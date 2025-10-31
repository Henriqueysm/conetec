const bcrypt = require("bcrypt");
const db = require("../controllers/db"); // Caminho para seu arquivo db.js (ajuste se estiver em outro lugar)

// Buscar todos os usuários
const findAll = async () => {
  const [rows] = await db.query(
    "SELECT id, nome, email, tipo, criado_em, atualizado_em FROM usuario"
  );
  return rows;
};

// Buscar usuário por ID
const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, nome, email, tipo, criado_em, atualizado_em FROM usuario WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// Buscar usuário por email
const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
  return rows[0] || null;
};

// Criar novo usuário
const create = async (newUsuario) => {
  const { nome, email, senha, tipo } = newUsuario;

  if (!nome || !email || !senha || !tipo) {
    throw new Error("Todos os campos (nome, email, senha, tipo) são obrigatórios");
  }

  const hashedSenha = await bcrypt.hash(senha, 10);
  const [result] = await db.query(
    "INSERT INTO usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, hashedSenha, tipo]
  );

  return { id: result.insertId, nome, email, tipo };
};

// Login
const login = async (email, senha) => {
  const usuario = await findByEmail(email);
  if (!usuario) throw new Error("Usuário não encontrado");

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) throw new Error("Senha incorreta");

  return usuario;
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  login,
};
