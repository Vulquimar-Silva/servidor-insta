const User = require("../models/user")
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    // User
    getUser: () => {
      console.log("Obtendo usuário")
      return null
    },
  },
  Mutation: {
    // User
    register: async (_, { input }) => {
      const newUser = input;
      newUser.email = newUser.email.toLowerCase();
      newUser.username = newUser.username.toLowerCase();

      const { email, username, password } = newUser;

      // Revisando se o email está em uso
      const foundEmail = await User.findOne({ email });
      if (foundEmail) throw new Error("This email is already in use.")

      // Revisando se o username está em uso
      const foundUsername = await User.findOne({ username });
      if (foundUsername) throw new Error("This username is already in use.")

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

      console.log(newUser)
      return null
    },
  }
}

module.exports = resolvers;