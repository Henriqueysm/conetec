const db = require('./db');

module.exports = {
  getHistoricoCompleto: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          h.id,
          h.chamado_id,
          h.status_novo AS status,
          h.observacao,
          h.data_hora,
          u.nome AS tecnico_nome
        FROM historico h
        LEFT JOIN usuario u ON u.id = h.tecnico_id
        ORDER BY h.data_hora DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error('❌ Erro ao buscar histórico completo:', err);
      res.status(500).json({ error: 'Erro ao buscar histórico completo' });
    }
  },

  getHistoricoByChamado: async (req, res) => {
    try {
      const { chamado_id } = req.params;

      if (!chamado_id) {
        return res.status(400).json({ error: 'ID do chamado não fornecido' });
      }

      const [rows] = await db.query(`
        SELECT 
          h.id,
          h.chamado_id,
          h.status_novo AS status,
          h.observacao,
          h.data_hora,
          u.nome AS tecnico_nome
        FROM historico h
        LEFT JOIN usuario u ON u.id = h.tecnico_id
        WHERE h.chamado_id = ?
        ORDER BY h.data_hora DESC
      `, [chamado_id]);

            if (rows.length === 0) {
        return res.status(200).json([]); // ✅ Sem erro, mas indica “vazio”
      }


      res.json(rows);
    } catch (err) {
      console.error('❌ Erro ao buscar histórico do chamado:', err);
      res.status(500).json({ error: 'Erro ao buscar histórico do chamado' });
    }
  },
};
