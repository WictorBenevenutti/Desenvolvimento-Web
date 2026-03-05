const express = require("express");
const app = express();

console.log("ARQUIVO NOVO RODANDO 🚀");
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.send("API Portal BI funcionando");
});

// Simulação de banco de dados
let indicadores = [
  { id: 1, titulo: "Produtividade Fazenda 49", link: "https://powerbi.com/1" },
  { id: 2, titulo: "Custo Talhão 4", link: "https://powerbi.com/2" }
];

// Listar indicadores
app.get("/indicadores", (req, res) => {
  res.json(indicadores);
});

// Cadastrar indicador
app.post("/indicadores", (req, res) => {
  const novoIndicador = {
    id: indicadores.length + 1,
    titulo: req.body.titulo,
    link: req.body.link
  };

  indicadores.push(novoIndicador);
  res.status(201).json(novoIndicador);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});