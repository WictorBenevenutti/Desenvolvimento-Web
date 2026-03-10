const express = require("express");
const path = require("path");

const app = express();

// servir arquivos do front-end
app.use(express.static(path.join(__dirname, "../front-end")));

// abrir página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/pages/index.html"));
});

// iniciar servidor
app.listen(4000, "0.0.0.0", () => {
  console.log("Servidor rodando na porta 4000");
});