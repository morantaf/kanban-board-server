const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const app = express();
const port = 4000;
const db = require("./db");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen(port, () =>
  console.log(`Server running on port ${port}` + server.graphqlPath)
);
