require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const salaRoutes = require('./src/routes/salaRoutes');
const computadorRoutes = require('./src/routes/computadorRoutes');
const chamadoRoutes = require('./src/routes/chamadoRoutes');
const historicoRoutes = require('./src/routes/historicoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const aparelhosRoutes = require('./src/routes/aparelhosRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({ origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:5501'] }));
app.use(express.json()); // já parseia JSON automaticamente

// Teste básico da API
app.get('/', (req, res) => {
  res.send('API de usuários está funcionando!');
});

// Rotas da API
app.use('/api/usuario', usuarioRoutes);
app.use('/api/sala', salaRoutes);
app.use('/api/computador', computadorRoutes);
app.use('/api/chamado', chamadoRoutes);
app.use('/api/historico', historicoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/aparelhos", aparelhosRoutes);

// Conexão com o banco
const db = require("./src/controllers/db"); // verifique se é esse o caminho correto

// Rota de debug para listar todos os usuários
app.get("/debug-usuario", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nome, email FROM usuario");
    console.log("📊 Usuários no banco:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Erro no debug:", error);
    res.status(500).json({ error: "Erro ao buscar usuários no banco" });
  }
});

/* ======================================================
   🔹 IMPORTANTE: INICIALIZAÇÃO DO TRANSPORTER
   🔹 O mailer.js deve ser importado aqui para garantir
     que o transporter do Azure OAuth2 seja inicializado
====================================================== */
const { transporter } = require('./src/services/mailer');

/* ======================================================
   🔹 TRATAMENTO DE ERROS GERAIS (opcional, recomendado)
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Erro geral:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
