const express = require("express");

const statusRoutes = require("./routes/statusroutes");
const authRoutes = require("./routes/authroutes");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// rotas da API
app.use("/api", statusRoutes);
app.use("/api", authRoutes);

// rota raiz
app.get("/", (req, res) => {
  res.send("🚀 Data Progress API running");
});

app.listen(PORT, () => {
  console.log(`Servidor do projeto está rodando em http://localhost:${PORT}`);
});