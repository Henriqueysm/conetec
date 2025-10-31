const express = require('express');
const router = express.Router();
const computadorController = require('../controllers/computadorController');

router.post('/', computadorController.createComputador);
router.get('/', computadorController.getAllComputador);
router.get('/sala/:id', computadorController.getComputadorPorSala); // <--- sobe pra cá
router.get('/:id', computadorController.getComputadorById);
router.put('/:id', computadorController.updateComputador);
router.delete('/:id', computadorController.deleteComputador);



module.exports = router;
