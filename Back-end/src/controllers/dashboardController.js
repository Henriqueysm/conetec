const db = require("./db");

// === Dashboard Geral (Admin) ===
const getDashboard = async (req, res) => {
  try {
    const [cards] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
        SUM(CASE WHEN status = 'Em Andamento' THEN 1 ELSE 0 END) AS andamento,
        SUM(CASE WHEN status = 'Resolvido' THEN 1 ELSE 0 END) AS resolvidos
      FROM chamado
    `);

    const [tempoMedio] = await db.query(`
      SELECT 
        ROUND(AVG(TIMESTAMPDIFF(HOUR, c.data_abertura, h.data_hora)), 2) AS tempo_medio
      FROM chamado c
      JOIN historico h 
        ON h.id = (
          SELECT h2.id 
          FROM historico h2
          WHERE h2.chamado_id = c.id AND h2.status_novo = 'Resolvido'
          ORDER BY h2.data_hora DESC
          LIMIT 1
        );
    `);

    const [ultimosChamados] = await db.query(`
      SELECT 
        c.id,
        c.titulo,
        COALESCE(u.nome, '—') AS usuario,
        c.categoria,
        c.status,
        c.data_abertura
      FROM chamado c
      LEFT JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.data_abertura DESC
      LIMIT 10
    `);

    res.json({
      cards: cards[0],
      tempoMedio: tempoMedio[0]?.tempo_medio || 0,
      ultimos: ultimosChamados
    });
  } catch (error) {
    console.error("Erro em getDashboard:", error);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
};

// === Chamados por Status ===
const getChamadosPorStatus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) AS total
      FROM chamado
      GROUP BY status
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorStatus:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por status" });
  }
};

// === Chamados por Sala ===
const getChamadosPorSala = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COALESCE(s.nome, 'Sem sala') AS sala, COUNT(c.id) AS total
      FROM chamado c
      LEFT JOIN sala s ON c.sala_id = s.id
      GROUP BY COALESCE(s.nome, 'Sem sala')
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorSala:", err);
    res.status(500).json({ error: "Erro ao buscar dados por sala" });
  }
};

// === Chamados por Prioridade ===
const getChamadosPorPrioridade = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(urgencia, 'Não definida') AS prioridade,
        COUNT(*) AS total
      FROM chamado
      GROUP BY COALESCE(urgencia, 'Não definida')
      ORDER BY FIELD(COALESCE(urgencia,'Não definida'), 'Alta','Média','Baixa','Não definida') DESC, total DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorPrioridade:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por prioridade" });
  }
};

// === Chamados por Dia ===
const getChamadosPorDia = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(data_abertura) AS dia, COUNT(*) AS total
      FROM chamado
      GROUP BY DATE(data_abertura)
      ORDER BY dia
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorDia:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por dia" });
  }
};

// === Chamados por Técnico ===
const getChamadosPorTecnico = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.nome AS tecnico,
        COUNT(*) AS total
      FROM historico h
      JOIN usuario u ON h.tecnico_id = u.id
      WHERE LOWER(h.status_novo) IN ('resolvido', 'fechado', 'encerrado')
      GROUP BY u.nome
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorTecnico:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por técnico" });
  }
};

// === Tempo Médio por Técnico ===
const getTempoMedioPorTecnico = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.nome AS tecnico,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, c.data_abertura, h.data_hora)), 2) AS tempo_medio_horas
      FROM chamado c
      JOIN historico h 
        ON h.id = (
          SELECT h2.id 
          FROM historico h2
          WHERE h2.chamado_id = c.id 
            AND h2.status_novo = 'Resolvido'
          ORDER BY h2.data_hora DESC
          LIMIT 1
        )
      JOIN usuario u ON h.tecnico_id = u.id
      GROUP BY u.nome
      ORDER BY tempo_medio_horas ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erro em getTempoMedioPorTecnico:", err);
    res.status(500).json({ error: "Erro ao buscar tempo médio por técnico" });
  }
};


// === Chamados por Turno ===
const getChamadosPorTurno = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        CASE 
          WHEN HOUR(CONVERT_TZ(data_abertura, '+00:00', '-03:00')) BETWEEN 6 AND 11 THEN 'Manhã'
          WHEN HOUR(CONVERT_TZ(data_abertura, '+00:00', '-03:00')) BETWEEN 12 AND 17 THEN 'Tarde'
          ELSE 'Noite'
        END AS turno,
        COUNT(*) AS total
      FROM chamado
      GROUP BY turno
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorTurno:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por turno" });
  }
};

// === Chamados Resolvidos por Dia ===
const getResolvidosPorDia = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(DATE(prazo_resolucao), DATE(data_abertura)) AS dia, 
        COUNT(*) AS total
      FROM chamado
      WHERE status = 'Resolvido'
      GROUP BY COALESCE(DATE(prazo_resolucao), DATE(data_abertura))
      ORDER BY dia
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getResolvidosPorDia:", err);
    res.status(500).json({ error: "Erro ao buscar resolvidos por dia" });
  }
};

// === Dashboard por Funcionário ===
const getDashboardFuncionario = async (req, res) => {
  try {
    const { id } = req.params;

    const [cards] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
        SUM(CASE WHEN status = 'Em Andamento' THEN 1 ELSE 0 END) AS andamento,
        SUM(CASE WHEN status = 'Resolvido' THEN 1 ELSE 0 END) AS resolvidos
      FROM chamado
      WHERE usuario_id = ?
    `, [id]);

    const [chamados] = await db.query(`
      SELECT 
        c.id,
        c.titulo,
        c.categoria,
        c.urgencia,
        c.status,
        c.data_abertura
      FROM chamado c
      WHERE c.usuario_id = ?
      ORDER BY c.data_abertura DESC
    `, [id]);

    const [tempoMedio] = await db.query(`
      SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, data_abertura, prazo_resolucao)), 2) AS tempo_medio
      FROM chamado 
      WHERE status = 'Resolvido' AND usuario_id = ?
    `, [id]);

    res.json({
      cards: cards[0],
      tempoMedio: tempoMedio[0]?.tempo_medio || 0,
      chamados
    });

  } catch (error) {
    console.error("Erro em getDashboardFuncionario:", error);
    res.status(500).json({ error: "Erro ao carregar dashboard do funcionário" });
  }
};

// === Chamados por Categoria ===
const getChamadosPorCategoria = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(categoria, 'Não definida') AS categoria,
        COUNT(*) AS total
      FROM chamado
      GROUP BY COALESCE(categoria, 'Não definida')
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorCategoria:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por categoria" });
  }
};
const getTempoMedioPorUrgencia = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(urgencia, 'Não definida') AS urgencia,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, data_abertura, prazo_resolucao)), 2) AS tempo_medio_horas
      FROM chamado
      WHERE status = 'Resolvido'
      GROUP BY COALESCE(urgencia, 'Não definida')
      ORDER BY FIELD(urgencia, 'Alta', 'Média', 'Baixa', 'Não definida')
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getTempoMedioPorUrgencia:", err);
    res.status(500).json({ error: "Erro ao buscar tempo médio por urgência" });
  }
};
const getPercentualDentroDoPrazo = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ROUND(
          (SUM(CASE WHEN prazo_resolucao <= prazo_estimado THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
          2
        ) AS percentual_dentro_prazo
      FROM chamado
      WHERE status = 'Resolvido'
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro em getPercentualDentroDoPrazo:", err);
    res.status(500).json({ error: "Erro ao buscar percentual de chamados dentro do prazo" });
  }
};
const getRankingTecnicos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.nome AS tecnico,
        COUNT(c.id) AS total_resolvidos,
        ROUND(AVG(TIMESTAMPDIFF(HOUR, c.data_abertura, c.prazo_resolucao)), 2) AS tempo_medio_horas
      FROM chamado c
      JOIN usuario u ON c.tecnico_responsavel_id = u.id
      WHERE c.status = 'Resolvido'
      GROUP BY u.nome
      ORDER BY tempo_medio_horas ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getRankingTecnicos:", err);
    res.status(500).json({ error: "Erro ao buscar ranking de técnicos" });
  }
};
const getAbertosVsResolvidosMes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MONTHNAME(data_abertura) AS mes,
        SUM(CASE WHEN status != 'Resolvido' THEN 1 ELSE 0 END) AS abertos,
        SUM(CASE WHEN status = 'Resolvido' THEN 1 ELSE 0 END) AS resolvidos
      FROM chamado
      WHERE YEAR(data_abertura) = YEAR(CURDATE())
      GROUP BY MONTH(data_abertura)
      ORDER BY MONTH(data_abertura)
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getAbertosVsResolvidosMes:", err);
    res.status(500).json({ error: "Erro ao buscar abertos vs resolvidos" });
  }
};
const getEvolucaoResolvidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(prazo_resolucao, '%Y-%m') AS mes,
        COUNT(*) AS total
      FROM chamado
      WHERE status = 'Resolvido'
      AND prazo_resolucao >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(prazo_resolucao, '%Y-%m')
      ORDER BY mes
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getEvolucaoResolvidos:", err);
    res.status(500).json({ error: "Erro ao buscar evolução de resolvidos" });
  }
};
const getChamadosPorEquipamento = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(categoria, 'Outros') AS equipamento,
        COUNT(*) AS total
      FROM chamado
      GROUP BY COALESCE(categoria, 'Outros')
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro em getChamadosPorEquipamento:", err);
    res.status(500).json({ error: "Erro ao buscar chamados por equipamento" });
  }
};

async function getMapaSalas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS sala_id,
        s.nome AS nome_sala,
        COUNT(DISTINCT c.id) AS total_equipamentos,

        -- chamados pendentes vinculados à sala (sala + computadores dela)
        SUM(CASE WHEN ch.status = 'Pendente' THEN 1 ELSE 0 END) AS qtd_pendente,

        -- chamados em andamento
        SUM(CASE WHEN ch.status = 'Em Andamento' THEN 1 ELSE 0 END) AS qtd_andamento,

        -- mesas com problema (se houver computador vinculado)
        GROUP_CONCAT(
          DISTINCT CASE 
            WHEN ch.status IN ('Pendente','Em Andamento') AND c.numero_mesa IS NOT NULL 
              THEN c.numero_mesa 
            ELSE NULL 
          END
          ORDER BY 
            (CASE WHEN c.numero_mesa REGEXP '^[0-9]+$' THEN CAST(c.numero_mesa AS UNSIGNED) ELSE 999999 END),
            c.numero_mesa
          SEPARATOR ', '
        ) AS mesas_com_problema

      FROM sala s
      LEFT JOIN computador c ON c.sala_id = s.id
      LEFT JOIN chamado ch 
        ON (ch.computador_id = c.id OR ch.sala_id = s.id)
      GROUP BY s.id, s.nome
      ORDER BY s.nome;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Erro ao gerar mapa de salas:', error);
    res.status(500).json({ error: 'Erro ao gerar mapa de salas' });
  }
}


const getResumoSalas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS sala_id,
        s.nome AS nome_sala,

        -- Quantidade de chamados pendentes (da sala ou computadores dela)
        SUM(CASE WHEN ch.status = 'Pendente' THEN 1 ELSE 0 END) AS qtd_pendente,

        -- Quantidade de chamados em andamento
        SUM(CASE WHEN ch.status = 'Em Andamento' THEN 1 ELSE 0 END) AS qtd_andamento,

        -- Total de chamados ativos (pendente ou andamento)
        SUM(CASE WHEN ch.status IN ('Pendente', 'Em Andamento') THEN 1 ELSE 0 END) AS total_chamados_ativos,

        -- Mesas com problema (se o chamado for de computador)
        GROUP_CONCAT(
          DISTINCT CASE 
            WHEN ch.status IN ('Pendente', 'Em Andamento') AND c.numero_mesa IS NOT NULL 
              THEN c.numero_mesa
            ELSE NULL 
          END
          ORDER BY 
            (CASE WHEN c.numero_mesa REGEXP '^[0-9]+$' THEN CAST(c.numero_mesa AS UNSIGNED) ELSE 9999 END),
            c.numero_mesa
          SEPARATOR ', '
        ) AS mesas_com_problema

      FROM sala s
      LEFT JOIN computador c ON c.sala_id = s.id
      LEFT JOIN chamado ch 
        ON ch.computador_id = c.id OR ch.sala_id = s.id

      GROUP BY s.id, s.nome
      ORDER BY s.id;
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar resumo de salas:", err);
    res.status(500).json({ error: "Erro ao buscar resumo de salas" });
  }
};


// === Exportação ===
module.exports = {
  getDashboard,
  getDashboardAdmin: getDashboard, 
  getChamadosPorSala,
  getChamadosPorStatus,
  getChamadosPorPrioridade,
  getChamadosPorDia,
  getChamadosPorTecnico,
  getTempoMedioPorTecnico,
  getChamadosPorTurno,
  getResolvidosPorDia,
  getDashboardFuncionario,
  getChamadosPorCategoria,
  getTempoMedioPorUrgencia,
  getPercentualDentroDoPrazo,
  getRankingTecnicos,
  getAbertosVsResolvidosMes,
  getEvolucaoResolvidos,
  getChamadosPorEquipamento,
  getMapaSalas,
  getResumoSalas
};
