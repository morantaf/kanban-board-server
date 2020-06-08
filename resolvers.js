const User = require("./UserModel");
const Board = require("./BoardModel");
const bcrypt = require("bcrypt");
const { setTokens } = require("./auth/setTokens");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.findAll();
        const dataToDisplay = users.map((user) => user.dataValues);
        return dataToDisplay;
      } catch (e) {
        console.error(e);
      }
    },
    board: async (_, args, { req }) => {
      try {
        console.log("req.user ?", req.user);
        if (!req.user) throw new AuthenticationError("Must authenticate");
        const board = await Board.findByPk(args.id);
        return board.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    boards: async (_, args, __) => {
      try {
        const boards = await Board.findAll();
        const dataToDisplay = boards.map((board) => board.dataValues);
        return dataToDisplay;
      } catch (e) {
        console.error(e);
      }
    },
  },
  Mutation: {
    addBoard: async (_, args, __) => {
      try {
        const newBoard = await Board.create({
          title: args.title,
          description: args.description,
        });

        return newBoard.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    signup: async (_, args, __) => {
      try {
        const newUser = await User.create({
          ...args,
          password: bcrypt.hashSync(args.password, 10),
        });

        console.log(newUser);

        return newUser.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    login: async (_, { email, password }, __) => {
      try {
        if (!email || !password) {
          response.status(400).send("Please enter a valid e-mail and password");
        } else {
          const user = await User.findOne({
            where: { email: email },
          });

          return user.dataValues.password === password
            ? setTokens(user.dataValues)
            : null;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};

module.exports = resolvers;