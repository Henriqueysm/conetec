const mysql = require("mysql2/promise");

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,   // <- usa seu .env
      database: process.env.DB_NAME,   // <- usa seu .env
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("🔥 Pool MySQL Aiven criado (uma única vez)");
  }
  return pool;
}

module.exports = getPool();
