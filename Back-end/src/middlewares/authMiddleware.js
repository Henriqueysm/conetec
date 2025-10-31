const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(' ')[1];
  console.log("🔍 TOKEN RECEBIDO:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ TOKEN DECODIFICADO:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ ERRO TOKEN:", err.message);
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};
