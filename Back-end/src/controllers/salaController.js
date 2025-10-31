const db = require("../controllers/db"); // caminho ajustado

module.exports = {
  // CREATE
  createSala: async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      if (!nome) return res.status(400).json({ error: "O campo nome é obrigatório" });

      const [result] = await db.query(
        'INSERT INTO sala (nome, descricao) VALUES (?, ?)',
        [nome, descricao || null]
      );

      const [rows] = await db.query('SELECT * FROM sala WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar sala' });
    }
  },

  // READ ALL
  getAllSala: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM sala ORDER BY criado_em DESC');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar salas' });
    }
  },

  // READ ONE - Adaptado para incluir computadores com posX e posY
  getSalaById: async (req, res) => {
    try {
      const { id } = req.params;

      // Busca sala
      const [rows] = await db.query('SELECT * FROM sala WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Sala não encontrada' });
      const sala = rows[0];

      // Busca computadores da sala com posX e posY
      const [computadores] = await db.query(
        'SELECT id, nome, modelo, patrimonio, status, posX, posY FROM computador WHERE sala_id = ?',
        [id]
      );

      sala.computadores = computadores; // adiciona array de computadores à sala
      sala.quantidade_computadores = computadores.length;

      res.json(sala);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar sala' });
    }
  },

getSalasComEquipamentos: async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.nome,
        s.descricao,
        COUNT(DISTINCT c.id) AS quantidade_computadores,
        COUNT(DISTINCT a.id) AS quantidade_outros_aparelhos,
        GROUP_CONCAT(DISTINCT c.status SEPARATOR ', ') AS status_computadores,
        GROUP_CONCAT(DISTINCT a.status SEPARATOR ', ') AS status_aparelhos
      FROM sala s
      LEFT JOIN computador c ON c.sala_id = s.id
      LEFT JOIN aparelhos a ON a.sala_id = s.id
      GROUP BY s.id, s.nome, s.descricao
      ORDER BY s.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Erro em getSalasComEquipamentos:", err);
    res.status(500).json({ error: "Erro ao buscar salas com equipamentos" });
  }
},


// salaController.js salaController.js
getSalaDetalhes: async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar dados da sala
    const [salas] = await db.query(`SELECT * FROM sala WHERE id = ?`, [id]);
    if (!salas.length) return res.status(404).json({ error: "Sala não encontrada" });

    const sala = salas[0];

    // Buscar computadores da sala
    const [computador] = await db.query(`SELECT * FROM computador WHERE sala_id = ?`, [id]);

    // Buscar outros aparelhos da sala
    const [aparelhos] = await db.query(`SELECT * FROM aparelhos WHERE sala_id = ?`, [id]);

    // Retornar todos os dados

    res.json({
  ...sala,
  computadores: computador,
  outros_aparelhos: aparelhos

});


  } catch (err) {
    console.error("Erro no getSalaDetalhes:", err); // <-- aqui vai aparecer o erro real no console do backend
    res.status(500).json({ error: "Erro ao buscar detalhes da sala" });
  }
},



  // UPDATE
  updateSala: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const [result] = await db.query(
        'UPDATE sala SET nome = ?, descricao = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?',
        [nome, descricao || null, id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sala não encontrada' });

      const [rows] = await db.query('SELECT * FROM sala WHERE id = ?', [id]);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar sala' });
    }
  },

  // DELETE
  deleteSala: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query('DELETE FROM sala WHERE id = ?', [id]);

      if (result.affectedRows === 0) return res.status(404).json({ error: 'Sala não encontrada' });

      res.json({ message: 'Sala deletada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar sala' });
    }
  },
};
