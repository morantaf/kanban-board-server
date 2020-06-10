const User = require("./UserModel");
const Board = require("./BoardModel");
const List = require("./ListModel");
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
        if (!req.user) return new AuthenticationError("Must authenticate");
        const board = await Board.findByPk(args.id);
        return board.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    boards: async (_, args, { req }) => {
      try {
        console.log("req.user ?", req.user);
        if (!req.user) return new AuthenticationError("Must authenticate");

        const user = await User.findByPk(req.user.id, {
          include: { model: Board, through: { attributes: [] } },
        });

        const boardsByUser = user.dataValues.boards;

        const dataToSend = boardsByUser.map((board) => board.dataValues);

        return dataToSend;
      } catch (e) {
        console.error(e);
      }
    },
    listsByBoard: async (_, { boardId }, { req }) => {
      try {
        const listsByBoard = await List.findAll({
          where: {
            boardId: boardId,
          },
        });

        const dataToSend = listsByBoard.map((list) => list.dataValues);

        return dataToSend;
      } catch (e) {
        console.error(e);
      }
    },
  },
  Mutation: {
    addBoard: async (_, args, { req }) => {
      try {
        const user = await User.findByPk(req.user.id);

        const newBoard = await Board.create({
          title: args.title,
          description: args.description,
        });

        await user.addBoard(newBoard);

        return newBoard.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    addList: async (_, { name, boardId }, { req }) => {
      try {
        const newList = await List.create({
          name: name,
          userId: req.user.id,
          boardId: boardId,
        });

        return newList.dataValues;
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

          return bcrypt.compareSync(password, user.dataValues.password)
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
