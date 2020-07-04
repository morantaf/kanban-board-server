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

  type Tokens {
    username: String
    accessToken: String
    refreshToken: String
  }

  type List {
    id: Int!
    name: String!
  }

  type Card {
    id: Int!
    title: String!
    description: String
    status: String
  }

  type Status {
    deleted: Boolean
  }

  type Query {
    board(id: Int!): Board
    boards: [Board]
    user(id: Int!): User
    users: [User]
    listsByBoard(boardId: Int!): [List]
    cardsByList(listId: Int!): [Card]
  }

  type Mutation {
    addBoard(title: String!, description: String): Board

    addList(name: String!, boardId: Int!): List

    addCard(
      title: String!
      listId: Int!
      description: String
      status: String
    ): Card

    signup(
      firstName: String!
      lastName: String!
      email: String!
      username: String!
      password: String!
    ): User

    login(email: String!, password: String!): Tokens

    deleteCard(id: Int!): Status
  }
`;

module.exports = typeDefs;
