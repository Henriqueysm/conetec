const db = require("./db"); // caminho ajustado

module.exports = {
  // CREATE
  createComputador: async (req, res) => {
    try {
      const { numero_mesa, modelo, patrimonio_monitor, patrimonio_cpu, numero_serie, sala_id, status } = req.body;

      if (!numero_mesa || !modelo) {
        return res.status(400).json({ error: "Número da mesa e modelo são obrigatórios" });
      }

      const [result] = await db.query(
        `INSERT INTO computador 
          (numero_mesa, modelo, patrimonio_monitor, patrimonio_cpu, numero_serie, sala_id, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          numero_mesa,
          modelo,
          patrimonio_monitor || null,
          patrimonio_cpu || null,
          numero_serie || null,
          sala_id || null,
          status || "Funcionando"
        ]
      );

      // Retorna o registro completo incluindo timestamps
      const [rows] = await db.query("SELECT * FROM computador WHERE id = ?", [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar computador" });
    }
  },

  // READ ALL
  getAllComputador: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM computador ORDER BY criado_em DESC");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar computadores" });
    }
  },

  // READ ONE
  getComputadorById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.query("SELECT * FROM computador WHERE id = ?", [id]);
      if (rows.length === 0) return res.status(404).json({ error: "Computador não encontrado" });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar computador" });
    }
  },

  // UPDATE
  updateComputador: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        numero_mesa,
        modelo,
        patrimonio_monitor,
        patrimonio_cpu,
        numero_serie,
        sala_id,
        status
      } = req.body;

      const [result] = await db.query(
        `UPDATE computador 
         SET numero_mesa = ?, modelo = ?, patrimonio_monitor = ?, patrimonio_cpu = ?, 
             numero_serie = ?, sala_id = ?, status = ?, atualizado_em = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          numero_mesa || null,
          modelo || null,
          patrimonio_monitor || null,
          patrimonio_cpu || null,
          numero_serie || null,
          sala_id || null,
          status || "Funcionando",
          id
        ]
      );

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Computador não encontrado" });

      const [rows] = await db.query("SELECT * FROM computador WHERE id = ?", [id]);
      res.json(rows[0]);
    } catch (err) {
      console.error("Erro no updateComputador:", err);
      res.status(500).json({ error: "Erro ao atualizar computador" });
    }
  },

  // GET computadores por sala
  getComputadorPorSala: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.query("SELECT * FROM computador WHERE sala_id = ?", [id]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar computadores por sala" });
    }
  },

  // DELETE
  deleteComputador: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query("DELETE FROM computador WHERE id = ?", [id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Computador não encontrado" });

      res.json({ message: "Computador deletado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar computador" });
    }
  },
};
