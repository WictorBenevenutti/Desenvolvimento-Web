const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("🚀 Data Progress API running");
});

app.listen(PORT, () => {
  console.log(`Servidor do projeto está rodando em http://localhost:${PORT}`);
});