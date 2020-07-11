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
    jwt: String
    userId: Int
  }

  type List {
    id: Int!
    name: String!
    position: Int
  }

  input ListInput {
    id: Int!
    position: Int!
  }

  input CardInput {
    id: Int!
    position: Int!
  }

  type Card {
    id: Int!
    title: String!
    description: String
    status: String
    position: Int
  }

  type Status {
    deleted: Boolean
  }

  type Query {
    board(id: Int!): Board
    boards(userId: Int): [Board]
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

    updateListsPositions(updatedLists: [ListInput]): [List]

    updateCardsPositions(updatedCards: [CardInput]): [Card]

    login(email: String!, password: String!): Tokens

    deleteCard(id: Int!): Status
    deleteList(id: Int!): Status
    deleteBoard(id: Int!): Status
  }
`;

module.exports = typeDefs;
