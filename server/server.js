const express = require('express');
const path = require('path');
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

//serve up static assets
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test gql api
    console.log(`use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
