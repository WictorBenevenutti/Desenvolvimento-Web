const express = require("express"); //Importa o framework Express
const cors = require("cors"); // Biblioteca cors que trabalha junto com o express
const pool = require("./config/database"); //Importa a conexão com o banco PostgreSQL
const SECRET = "dataprogress_secret"; // Chave secreta usada para gerar e validar tokens JWT
const statusRoutes = require("./routes/statusroutes"); // Importa arquivos de rotas externas
const authRoutes = require("./routes/authroutes"); // Importa arquivos de rotas externas
const bcrypt = require("bcrypt"); // Biblioteca para criptografar senhas
const jwt = require("jsonwebtoken"); // Biblioteca para gerar tokens de autenticação (JWT)

const app = express(); // Cria a aplicação Express
app.use(cors()); // Ativa o cors
const PORT = 3000; // Define a porta onde o servidor irá rodar

// =========================
// MIDDLEWARE
// =========================

// Permite que o servidor receba JSON no body das requisições
app.use(express.json());


// =========================
// ROTAS EXTERNAS
// =========================

// Rotas de status da API
app.use("/api", statusRoutes);

// Rotas de autenticação (login / register)
app.use("/api", authRoutes);


// =========================
// TESTE DE CONEXÃO COM BANCO
// =========================

// Tenta conectar ao PostgreSQL
pool.connect()
  .then(() => {
    console.log("Conectado ao PostgreSQL");
  })
  .catch(err => {
    console.error("Erro ao conectar no banco", err);
  });


// =========================
// ROTA RAIZ DA API
// =========================

// Rota inicial para verificar se a API está rodando
app.get("/", (req, res) => {
  res.send("🚀 Data Progress API running");
});


// =========================
// INICIAR SERVIDOR
// =========================

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor do projeto está rodando em http://localhost:${PORT}`);
});


// =========================
// MIDDLEWARE DE AUTENTICAÇÃO
// =========================

// Função que verifica se o usuário enviou um token válido
function authenticateToken(req, res, next) {

  // Obtém o header Authorization
  const authHeader = req.headers['authorization'];

  // Extrai apenas o token (removendo "Bearer")
  const token = authHeader && authHeader.split(' ')[1];

  // Se não existir token
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Verifica se o token é válido
  jwt.verify(token, SECRET, (err, user) => {

    // Token inválido ou expirado
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }

    // Salva os dados do usuário na requisição
    req.user = user;

    // Continua para a próxima função
    next();

  });

}


// =========================
// REGISTRO DE USUÁRIO
// =========================

// Rota para criar uma nova conta
app.post("/register", async (req, res) => {

  // Dados enviados pelo usuário
  const { name, email, password } = req.body;

  try {

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o usuário no banco
    const result = await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );

    // Retorna sucesso
    res.json({
      message: "Usuário criado com sucesso",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar usuário"
    });

  }

});


// =========================
// LOGIN DE USUÁRIO
// =========================

// Rota de login
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    // Busca usuário pelo email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // Se não encontrar usuário
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Usuário não encontrado"
      });
    }

    const user = result.rows[0];

    // Compara senha enviada com senha criptografada
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Senha inválida"
      });
    }

    // Cria token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "2h" }
    );

    // Retorna token e dados do usuário
    res.json({
      message: "Login realizado com sucesso",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao realizar login"
    });

  }

});


// =========================
// CRIAR CURSO
// =========================

// Rota protegida para criar cursos
app.post("/courses", authenticateToken, async (req, res) => {

  const { title, description, price } = req.body;

  try {

    const result = await pool.query(
      "INSERT INTO courses (title,description,price) VALUES ($1,$2,$3) RETURNING *",
      [title, description, price]
    );

    res.json({
      message: "Curso criado com sucesso",
      course: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar curso"
    });

  }

});


// =========================
// CRIAR AULA
// =========================

// Rota para cadastrar uma aula
app.post("/lessons", async (req, res) => {

  const { title, video_url, module_id, position } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO lessons (title, video_url, module_id, position)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [title, video_url, module_id, position]
    );

    res.json({
      message: "Aula criada com sucesso",
      lesson: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});


// =========================
// BUSCAR UM CURSO
// =========================

app.get("/courses/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar curso"
    });

  }

});


// =========================
// LISTAR CURSOS
// =========================

app.get("/courses", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM courses ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});


// =========================
// DASHBOARD PROTEGIDO
// =========================

// Rota acessível apenas com token válido
app.get("/dashboard", authenticateToken, (req, res) => {

  res.json({
    message: "Bem-vindo ao Data Progress",
    user: req.user
  });

});


// =========================
// LISTAR MÓDULOS DO CURSO
// =========================

app.get("/courses/:id/modules", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      "SELECT * FROM modules WHERE course_id=$1 ORDER BY position",
      [id]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});


// =========================
// LISTAR AULAS DO MÓDULO
// =========================

app.get("/modules/:id/lessons", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      "SELECT * FROM lessons WHERE module_id=$1 ORDER BY position",
      [id]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

