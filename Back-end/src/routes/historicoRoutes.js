const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

// 🔹 Histórico completo
router.get('/', historicoController.getHistoricoCompleto);

// 🔹 Histórico por chamado específico
router.get('/chamado/:chamado_id', historicoController.getHistoricoByChamado);

module.exports = router;
