const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../services/mailer');

const JWT_SECRET = process.env.JWT_SECRET || "uma_chave_super_secreta";

/* ======================================================
   🟢 CRIAR USUÁRIO
====================================================== */
const createUsuario = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json({ success: false, message: "Body vazio." });

  try {
    let { nome, email, senha, tipo } = req.body;
    nome = nome?.trim();
    email = email?.trim();
    senha = senha?.trim();
    tipo = tipo?.trim();

    if (!nome || !email || !senha || !tipo)
      return res.status(400).json({ success: false, message: "Preencha todos os campos." });

    const [existe] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (existe.length > 0)
      return res.status(400).json({ success: false, message: "E-mail já cadastrado." });

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO usuario (nome, email, senha, tipo, criado_em) VALUES (?, ?, ?, ?, NOW())",
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json({ success: true, message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ success: false, message: "Erro interno no servidor." });
  }
};

/* ======================================================
   🟢 LOGIN
====================================================== */
const loginUsuario = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json({ success: false, message: "Body vazio." });

  try {
    const { email, senha } = req.body;
    const [usuarios] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (usuarios.length === 0)
      return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: "8h" });

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo,
        email: usuario.email,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
};

/* ======================================================
   🟢 CRUD
====================================================== */
const getAllUsuario = async (req, res) => {
  try {
    const [usuarios] = await db.query("SELECT id, nome, email, tipo, criado_em FROM usuario ORDER BY id ASC");
    res.json({ success: true, usuarios });
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar usuários." });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT id, nome, email, tipo, criado_em FROM usuario WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    res.json({ success: true, usuario: rows[0] });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

const updateUsuario = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json({ success: false, message: "Body vazio." });

  try {
    const { id } = req.params;
    const { nome, email } = req.body;
    await db.query("UPDATE usuario SET nome = ?, email = ?, atualizado_em = NOW() WHERE id = ?", [nome?.trim(), email?.trim(), id]);
    res.json({ success: true, message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ success: false, message: "Erro interno ao atualizar usuário." });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM usuario WHERE id = ?", [id]);
    res.json({ success: true, message: "Usuário excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).json({ success: false, message: "Erro interno ao excluir usuário." });
  }
};

/* ======================================================
   🟢 RECUPERAÇÃO DE SENHA
====================================================== */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email?.trim()]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expiracao = new Date(Date.now() + 15*60*1000); // 15 minutos

    await db.query(
      "UPDATE usuario SET reset_code = ?, reset_code_expires = ? WHERE email = ?",
      [codigo, expiracao, email.trim()]
    );

    await sendEmail({
      to: email.trim(),
      subject: "Redefinição de senha",
      codigo
    });

    res.status(200).json({ success: true, message: "Código enviado ao e-mail." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao enviar o código." });
  }
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email?.trim()]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    const usuario = rows[0];

    if (!usuario.reset_code || !usuario.reset_code_expires)
      return res.status(400).json({ success: false, message: "Nenhum código ativo encontrado." });

    const expirado = new Date(usuario.reset_code_expires) < new Date();
    if (expirado) return res.status(400).json({ success: false, message: "Código expirado. Solicite um novo." });

    if (String(usuario.reset_code).trim() !== String(code).trim())
      return res.status(400).json({ success: false, message: "Código incorreto." });

    res.status(200).json({ success: true, message: "Código verificado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno ao verificar código." });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, novaSenha } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email?.trim()]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    const usuario = rows[0];

    if (String(usuario.reset_code).trim() !== String(code).trim())
      return res.status(400).json({ success: false, message: "Código incorreto." });

    const expirado = new Date(usuario.reset_code_expires) < new Date();
    if (expirado) return res.status(400).json({ success: false, message: "Código expirado. Solicite um novo." });

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await db.query(
      "UPDATE usuario SET senha = ?, reset_code = NULL, reset_code_expires = NULL, atualizado_em = NOW() WHERE email = ?",
      [senhaCriptografada, email.trim()]
    );

    res.status(200).json({ success: true, message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao redefinir senha." });
  }
};

/* ======================================================
   🟢 TROCAR SENHA (usuário logado)
====================================================== */
const alterarSenha = async (req, res) => {
  const { email, senhaAntiga, senhaNova } = req.body;

  try {
    const [usuario] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (usuario.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado." });

    const senhaCorreta = await bcrypt.compare(senhaAntiga, usuario[0].senha);
    if (!senhaCorreta)
      return res.status(401).json({ error: "Senha antiga incorreta." });

    const senhaIgual = await bcrypt.compare(senhaNova, usuario[0].senha);
    if (senhaIgual)
      return res.status(400).json({ error: "A nova senha não pode ser igual à antiga." });

    const novaSenhaHash = await bcrypt.hash(senhaNova, 10);

    await db.query(
      "UPDATE usuario SET senha = ?, atualizado_em = NOW() WHERE email = ?",
      [novaSenhaHash, email]
    );

    res.json({ success: true, message: "Senha alterada com sucesso!" });
  } catch (err) {
    console.error("Erro ao alterar senha:", err);
    res.status(500).json({ error: "Erro interno ao alterar senha." });
  }
};


/* ======================================================
   🔁 EXPORTS
====================================================== */
module.exports = {
  createUsuario,
  loginUsuario,
  getAllUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  forgotPassword,
  verifyCode,
  resetPassword,
  alterarSenha,
};
