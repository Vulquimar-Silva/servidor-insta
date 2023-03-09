const { ApolloServer } = require("apollo-server")
const typeDefs = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")

require('./database.js')

const serverApollo = new ApolloServer({
  typeDefs,
  resolvers,
})

serverApollo.listen().then(({ url }) => {
  console.log("---------APOLLO-SERVER-------")
  console.log(`🚀 Server ready on ${url}`)
  console.log("-----------------------------")
})
