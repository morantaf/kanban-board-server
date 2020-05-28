const User = require("./UserModel");
const Board = require("./BoardModel");
const bcrypt = require("bcrypt");

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
    board: async (_, args, __) => {
      try {
        console.log("session ?", session);
        if (session.userId != 1) {
          return { title: "You are not allowed to see this" };
        }
        if (args.id) {
          const board = await Board.findByPk(args.id);
          return board.dataValues;
        }
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
    login: async (_, args, __) => {
      try {
        if (!args.email || !args.password) {
          response.status(400).send("Please enter a valid e-mail and password");
        } else {
          const user = await User.findOne({
            where: { email: args.email },
          });

          return user.dataValues.password === args.password ? true : false;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};

module.exports = resolvers;
