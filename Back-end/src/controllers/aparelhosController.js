const db = require('./db'); // conexão com o banco

module.exports = {
  // ==========================
  // Listar todos os aparelhos
  // ==========================
  getAllAparelhos: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM aparelhos ORDER BY updated_at DESC, created_at DESC, id DESC");
      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar aparelhos:", err);
      res.status(500).json({ error: "Erro ao buscar aparelhos" });
    }
  },

  // ==========================
  // Listar por sala
  // ==========================
  getListarPorSala: async (req, res) => {
    const salaId = req.params.salaId;
    try {
      const [aparelhos] = await db.query(
        "SELECT * FROM aparelhos WHERE sala_id = ?",
        [salaId]
      );
      res.json(aparelhos);
    } catch (err) {
      console.error("Erro ao buscar aparelhos:", err);
      res.status(500).json({ error: "Erro ao buscar aparelhos" });
    }
  },

  // ==========================
  // Adicionar novo
  // ==========================
  createAparelhos: async (req, res) => {
    const { sala_id, tipo, modelo, patrimonio, status } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO aparelhos (sala_id, tipo, modelo, patrimonio, status) VALUES (?, ?, ?, ?, ?)",
        [sala_id, tipo, modelo, patrimonio, status]
      );
      res.json({ id: result.insertId, sala_id, tipo, modelo, patrimonio, status });
    } catch (err) {
      console.error("Erro ao adicionar aparelho:", err);
      res.status(500).json({ error: "Erro ao adicionar aparelho" });
    }
  },

  // ==========================
  // Atualizar
  // ==========================
  updateAparelhos: async (req, res) => {
    const id = req.params.id;
    const { tipo, modelo, patrimonio, status, sala_id } = req.body;
    try {
      const [result] = await db.query(
        "UPDATE aparelhos SET tipo = ?, modelo = ?, patrimonio = ?, status = ?, sala_id = ? WHERE id = ?",
        [tipo, modelo, patrimonio, status, sala_id, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Aparelho não encontrado" });
      }
      res.json({ message: "Aparelho atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar aparelho:", err);
      res.status(500).json({ error: "Erro ao atualizar aparelho" });
    }
  },

  // ==========================
  // Deletar
  // ==========================
  deleteAparelhos: async (req, res) => {
    const id = req.params.id;
    try {
      const [result] = await db.query("DELETE FROM aparelhos WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Aparelho não encontrado" });
      }
      res.json({ message: "Aparelho removido com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar aparelho:", err);
      res.status(500).json({ error: "Erro ao deletar aparelho" });
    }
  },
};
