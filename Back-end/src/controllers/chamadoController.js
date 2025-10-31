const db = require("./db");

module.exports = {
  // CREATE
  createChamado: async (req, res) => {
    try {
      const {
        usuario_id,
        usuario_nome,
        sala_id,
        categoria,
        titulo,
        descricao,
        localizacao,
        urgencia,
        status,
        computador_id,
        aparelhos_id,
        patrimonio
      } = req.body;

      let nomeFinal = usuario_nome;

      // 🔹 Se o usuário estiver logado, busca o nome no banco
      if (usuario_id) {
        const [userRows] = await db.query(
          "SELECT nome FROM usuario WHERE id = ?",
          [usuario_id]
        );
        if (userRows.length > 0) {
          nomeFinal = userRows[0].nome;
        }
      }

      // 🔹 Cria o chamado com o nome resolvido
      const [result] = await db.query(
        `
        INSERT INTO chamado 
          (usuario_id, usuario_nome, categoria, titulo, descricao, localizacao, urgencia, status, computador_id, sala_id, aparelhos_id, patrimonio, data_abertura)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          usuario_id || null,
          nomeFinal || null,
          categoria || null,
          titulo || null,
          descricao || null,
          localizacao || null,
          urgencia || null,
          status || "Pendente",
          computador_id || null,
          sala_id || null,
          aparelhos_id || null,
          patrimonio || null
        ]
      );

      // 🔹 Retorna o chamado criado com os relacionamentos resolvidos
      const [rows] = await db.query(
        `
        SELECT 
          c.*, 
          COALESCE(u.nome, c.usuario_nome) AS usuario_nome, 
          t.nome AS tecnico_responsavel_nome,
          s.nome AS sala_nome,
          s.descricao AS sala_descricao,
          comp.numero_mesa,
          comp.modelo,
          CASE 
            WHEN a.id IS NOT NULL THEN CONCAT(a.tipo, ' - ', a.modelo)
            ELSE NULL
          END AS aparelhos_nome
        FROM chamado c
        LEFT JOIN usuario u ON c.usuario_id = u.id
        LEFT JOIN usuario t ON c.tecnico_responsavel_id = t.id
        LEFT JOIN sala s ON s.id = c.sala_id
        LEFT JOIN computador comp ON comp.id = c.computador_id
        LEFT JOIN aparelhos a ON a.id = c.aparelhos_id
        WHERE c.id = ?
        `,
        [result.insertId]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error("❌ Erro ao criar chamado:", err);
      res.status(500).json({ error: "Erro ao criar chamado" });
    }
  },

// READ ALL
getAllChamado: async (req, res) => {
  try {
const [rows] = await db.query(`
  SELECT 
    c.*, 
    COALESCE(u.nome, c.usuario_nome) AS usuario_nome, 
    t.nome AS tecnico_responsavel_nome,
    s.nome AS sala_nome,
    s.descricao AS sala_descricao,
    comp.numero_mesa,
    comp.modelo,
    CASE 
      WHEN a.id IS NOT NULL THEN CONCAT(a.tipo, ' - ', a.modelo)
      ELSE NULL
    END AS aparelhos_nome,
    sla.horas_limite,
    DATE_ADD(c.data_abertura, INTERVAL sla.horas_limite HOUR) AS data_limite
  FROM chamado c
  LEFT JOIN usuario u ON u.id = c.usuario_id
  LEFT JOIN usuario t ON t.id = c.tecnico_responsavel_id
  LEFT JOIN sala s ON s.id = c.sala_id
  LEFT JOIN computador comp ON comp.id = c.computador_id
  LEFT JOIN aparelhos a ON a.id = c.aparelhos_id
  LEFT JOIN sla ON sla.urgencia = c.urgencia
  ORDER BY c.data_abertura DESC
`);




    // 🔹 Calcula e adiciona o prazo estimado em cada chamado
    for (const chamado of rows) {
      chamado.prazo_estimado = await calcularPrazoEstimado(chamado.urgencia, chamado.data_abertura);
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar chamados:", err);
    res.status(500).json({ error: "Erro ao buscar chamados" });
  }
},

// READ ONE
getChamadoById: async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
  SELECT 
    c.*, 
    COALESCE(u.nome, c.usuario_nome) AS usuario_nome, 
    t.nome AS tecnico_responsavel_nome,
    s.nome AS sala_nome,
    s.descricao AS sala_descricao,
    comp.numero_mesa,
    comp.modelo,
    CASE 
      WHEN a.id IS NOT NULL THEN CONCAT(a.tipo, ' - ', a.modelo)
      ELSE NULL
    END AS aparelhos_nome,
    sla.horas_limite AS tempo_estimado
  FROM chamado c
  LEFT JOIN usuario u ON c.usuario_id = u.id
  LEFT JOIN usuario t ON t.id = c.tecnico_responsavel_id
  LEFT JOIN sala s ON s.id = c.sala_id
  LEFT JOIN computador comp ON comp.id = c.computador_id
  LEFT JOIN aparelhos a ON a.id = c.aparelhos_id
  LEFT JOIN sla ON sla.urgencia = c.urgencia
  WHERE c.id = ?
`, [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Chamado não encontrado" });

    const chamado = rows[0];

    // 🔹 Adiciona o prazo estimado também neste endpoint
    chamado.prazo_estimado = await calcularPrazoEstimado(chamado.urgencia, chamado.data_abertura);

    res.json(chamado);
  } catch (err) {
    console.error("❌ Erro ao buscar chamado:", err);
    res.status(500).json({ error: "Erro ao buscar chamado" });
  }
},

  // UPDATE
  updateChamado: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const fields = [];
      const values = [];

      for (const key in body) {
        fields.push(`${key} = ?`);
        values.push(body[key]);
      }

      if (fields.length === 0)
        return res.status(400).json({ error: "Nenhum campo para atualizar" });

      // Atualiza o chamado
      const sql = `
        UPDATE chamado 
        SET ${fields.join(", ")}, data_atualizacao = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      values.push(id);

      const [result] = await db.query(sql, values);

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Chamado não encontrado" });

      // Insere histórico de atualização
      await db.query(
        `
        INSERT INTO historico (chamado_id, tecnico_id, status_novo, observacao, data_hora)
        VALUES (?, ?, ?, ?, NOW())
        `,
        [
          id,
          body.tecnico_responsavel_id || null,
          body.status || null,
          body.observacao_tecnico || null
        ]
      );

      // Retorna chamado atualizado
      const [rows] = await db.query(
        `
        SELECT 
          c.*, 
          COALESCE(u.nome, c.usuario_nome) AS usuario_nome, 
          t.nome AS tecnico_responsavel_nome
        FROM chamado c
        LEFT JOIN usuario u ON c.usuario_id = u.id
        LEFT JOIN usuario t ON c.tecnico_responsavel_id = t.id
        WHERE c.id = ?
        `,
        [id]
      );

      res.json(rows[0]);
    } catch (err) {
      console.error("❌ Erro no updateChamado:", err);
      res.status(500).json({ error: "Erro ao atualizar chamado" });
    }
  },

  // DELETE
  deleteChamado: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query("DELETE FROM chamado WHERE id = ?", [
        id
      ]);

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Chamado não encontrado" });

      res.json({ message: "Chamado deletado com sucesso" });
    } catch (err) {
      console.error("❌ Erro ao deletar chamado:", err);
      res.status(500).json({ error: "Erro ao deletar chamado" });
    }
  }
};

async function calcularPrazoEstimado(urgencia, dataAbertura) {
  try {
    const [rows] = await db.query('SELECT horas_limite FROM sla WHERE urgencia = ?', [urgencia]);
    const horas = rows.length > 0 ? rows[0].horas_limite : 24; // fallback
    const abertura = new Date(dataAbertura);
    const prazo = new Date(abertura.getTime() + horas * 60 * 60 * 1000);
    return prazo;
  } catch (error) {
    console.error('Erro ao calcular prazo estimado:', error);
    return null;
  }
};

