const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payload = {
    id,
    name,
    email,
    username,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {

  const newUser = input;
  newUser.email = newUser.email.toLowerCase();
  newUser.username = newUser.username.toLowerCase();

  const { email, username, password } = newUser;

  // Revisando se o email está em uso
  const foundEmail = await User.findOne({ email });
  if (foundEmail) throw new Error("Esse email já está em uso.")

  // Revisando se o username está em uso
  const foundUsername = await User.findOne({ username });
  if (foundUsername) throw new Error("Esse username já está em uso.")

  // Encriptar
  const salt = await bcrypt.genSaltSync(10)
  newUser.password = await bcrypt.hashSync(password, salt)

  try {
    const user = new User(newUser);
    user.save()
    return user
  } catch (error) {
    console.log(error)
  }

}

async function login(input) {
  const { email, password } = input;

  // Revisando se o email está correto
  const userFound = await User.findOne({ email: email.toLowerCase() });
  if (!userFound) throw new Error("Invalid email or password.");

  const validatingPassword = await bcrypt.compareSync(password, userFound.password);
  if (!validatingPassword) throw new Error("Senha ou email inválido.");

  return {
    token: createToken(userFound, process.env.SECRET_KEY, "24h")
  }
}

async function getUser(id, username) {
  let user = null;
  if(id) user = await User.findById(id);
  if(username) user = await User.findOne({ username });
  if(!user) throw new Error("Esse usuário não existe.")

  return user;
}

module.exports = {
  register,
  login,
  getUser,
}