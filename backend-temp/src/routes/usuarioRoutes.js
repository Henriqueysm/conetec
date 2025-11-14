const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// CRUD
router.post("/", usuarioController.createUsuario);
router.get("/", usuarioController.getAllUsuario);
router.get("/:id", usuarioController.getUsuarioById);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

// Login
router.post("/login", usuarioController.loginUsuario);

// Recuperação de senha
router.post("/forgot-password", usuarioController.forgotPassword);
router.post("/verify-code", usuarioController.verifyCode);
router.post("/reset-password", usuarioController.resetPassword);

// Rota para trocar senha
router.post('/alterarSenha', usuarioController.alterarSenha);

// Rota de teste de e-mail
router.get("/teste-email", async (req, res) => {
  try {
    await sendEmail({
      to: "yuri.marques2@etec.sp.gov.br", 
      subject: "Teste SendGrid",
      html: "<strong>Funcionou!</strong>"
    });

    res.send("E-mail enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar e-mail de teste:", err);
    res.status(500).send("Erro ao enviar e-mail de teste.");
  }
});



module.exports = router;
