const express = require("express");
const router = express.Router();
const aparelhosController = require("../controllers/aparelhosController");

router.get("/", aparelhosController.getAllAparelhos);
router.get("/:salaId", aparelhosController.getListarPorSala);
router.post("/", aparelhosController.createAparelhos);
router.put("/:id", aparelhosController.updateAparelhos);
router.delete("/:id", aparelhosController.deleteAparelhos);

module.exports = router;
