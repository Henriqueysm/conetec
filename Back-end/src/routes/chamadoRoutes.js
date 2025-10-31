const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');

router.post('/', chamadoController.createChamado);
router.get('/', chamadoController.getAllChamado);
router.get('/:id', chamadoController.getChamadoById);
router.put('/:id', chamadoController.updateChamado);
router.delete('/:id', chamadoController.deleteChamado);

module.exports = router;
