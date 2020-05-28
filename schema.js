const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
  }

  type Board {
    id: Int!
    title: String
    description: String
  }

  type Query {
    board(id: Int!): Board
    boards: [Board]
    user(id: Int!): User
    users: [User]
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      username: String
      password: String!
    ): User
    addBoard(title: String!, description: String): Board
    signup(
      firstName: String!
      lastName: String!
      email: String!
      username: String!
      password: String!
    ): User
    login(email: String!, password: String!): String
  }
`;

module.exports = typeDefs;
