const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const validateTokensMiddleware = require("./auth/validateTokensMiddleware");

const app = express();
const port = 4000;
const db = require("./db");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
  }),
});

app.use(validateTokensMiddleware);
server.applyMiddleware({ app });

app.listen(port, () =>
  console.log(`Server running on port ${port}` + server.graphqlPath)
);
