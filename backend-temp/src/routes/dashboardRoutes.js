const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const db = require("../controllers/db"); // importa o mesmo banco usado no controller

// === Dashboard geral ===
router.get("/", controller.getDashboard);

// === Dashboard dos Usuarios ===
router.get("/funcionario/:id", controller.getDashboardFuncionario);
router.get("/admin", controller.getDashboardAdmin);

router.get("/chamadosPorCategoria", controller.getChamadosPorCategoria);
router.get("/porSala", controller.getChamadosPorSala);
router.get("/porStatus", controller.getChamadosPorStatus);
router.get("/porPrioridade", controller.getChamadosPorPrioridade);
router.get("/porDia", controller.getChamadosPorDia);
router.get("/chamadosPorTecnico", controller.getChamadosPorTecnico);
router.get("/tempoMedioPorTecnico", controller.getTempoMedioPorTecnico);
router.get("/porTurno", controller.getChamadosPorTurno);
router.get("/resolvidosPorDia", controller.getResolvidosPorDia);
router.get("/tempoMedioPorUrgencia", controller.getTempoMedioPorUrgencia);
router.get("/percentualDentroDoPrazo", controller.getPercentualDentroDoPrazo);
router.get("/rankingTecnicos", controller.getRankingTecnicos);
router.get("/abertosVsResolvidosMes", controller.getAbertosVsResolvidosMes);
router.get("/evolucaoResolvidos", controller.getEvolucaoResolvidos);
router.get("/porEquipamento", controller.getChamadosPorEquipamento);
router.get('/mapa-salas', controller.getMapaSalas);
router.get('/resumoSalas', controller.getResumoSalas);


// ✅ CORREÇÃO AQUI:
router.get("/relatorio", async (req, res) => {
  try {
    const [chamados] = await db.query(`
      SELECT c.*, u.nome AS tecnico, s.nome AS sala
      FROM chamado c
      LEFT JOIN usuario u ON c.tecnico_responsavel_id = u.id
      LEFT JOIN sala s ON c.sala_id = s.id
    `);

    const [[totais]] = await db.query(`
      SELECT 
        COUNT(*) AS totalChamados,
        SUM(CASE WHEN status='Resolvido' THEN 1 ELSE 0 END) AS resolvidos,
        (SELECT COUNT(*) FROM usuario WHERE tipo='tecnico') AS tecnicos,
        (SELECT COUNT(*) FROM usuario) AS usuarios
      FROM chamado
    `);

    res.json({ totais, chamados });
  } catch (err) {
    console.error("Erro no endpoint /relatorio:", err);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

module.exports = router;
