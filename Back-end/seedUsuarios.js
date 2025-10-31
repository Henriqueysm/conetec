const bcrypt = require("bcrypt");
const db = require("./src/controllers/db");

(async () => {
  try {
    const usuario = [
      { nome: "Yuri", email: "yuri@conetec.com", senha: "admin123", tipo: "admin" },
      { nome: "Daniel", email: "daniel@conetec.com", senha: "admin123", tipo: "funcionario" },
      { nome: "Tina", email: "tina@conetec.com", senha: "admin123", tipo: "funcionario" },
      { nome: "Ana", email: "ana@conetec.com", senha: "admin123", tipo: "tecnico" },
      { nome: "Isa", email: "isa@conetec.com", senha: "admin123", tipo: "tecnico" }
    ];

    for (const u of usuario) {
      const hashed = await bcrypt.hash(u.senha, 10);
      await db.query(
        "INSERT INTO usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
        [u.nome, u.email, hashed, u.tipo]
      );
      console.log(`✅ Usuário ${u.nome} inserido com sucesso!`);
    }

    console.log("✨ Todos os usuários foram inseridos!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro ao inserir usuários:", err);
    process.exit(1);
  }
})();
//node seedUsuarios.js 