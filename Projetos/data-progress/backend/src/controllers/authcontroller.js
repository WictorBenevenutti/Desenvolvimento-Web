const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = [];

exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword
  };

  users.push(user);

  res.json({
    message: "Usuário criado com sucesso"
  });

};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: user.id },
    "dataprogress_secret",
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login realizado",
    token
  });

};