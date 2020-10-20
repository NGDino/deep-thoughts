const express = require('express');
// import AplolloServer
const { ApolloServer } = require('apollo-server-express')
//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
const db = require('./schemas/config/connection');

const { authMiddleware } = require('./utils/auth')

const PORT = process.env.PORT || 3001;
const app = express();
//create a new Apollo server and pass schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

//integrate apollo server with express application as middleware
server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test gql api
    console.log(`use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
