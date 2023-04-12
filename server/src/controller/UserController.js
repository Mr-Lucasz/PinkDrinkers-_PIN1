// Importa o Prisma, o bcrypt e o modelo de usuário
const prisma = require('../database');
const bcrypt = require('bcrypt');
const User = require('../model/User');


// Controlador para login de usuário
exports.login = async (req, res) => {
  // Extrai email e senha do corpo da requisição
  const { email, password } = req.body;
  // Busca o usuário no banco de dados pelo email
  const user = await prisma.user.findUnique({ where: { email } });

  // Verifica se o usuário foi encontrado
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  }

  // Compara a senha informada com a senha armazenada no banco de dados
  const passwordEqual = await bcrypt.compare(password, user.password);

  // Verifica se as senhas são iguais, pode ser um if no lugar tbm
  if (!passwordEqual) {
    return res.status(400).json({ error: 'Senha incorreta.' });
  }

  // Retorna os dados do usuário
  return res.json({ user });
};

// Controlador para criação de usuário
exports.createUser = async (req, res) => {
  // Extrai email e senha do body da requisição
  const { email, password } = req.body;

  try {
    // Chama o método estático createUser do model de usuário para criar o usuário no banco de dados
    const user = await User.createUser(email, password);
    // Retorna a resposta com mensagem de sucesso e dados do usuário
    res.status(201).json(
      { message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    // Em caso de erro, retorna a mensagem de erro e status HTTP 500
    console.error(error);
    res.status(500).json(
      { message: 'Erro ao criar usuário!' });
  }
};