const User = require("./UserModel");
const Board = require("./BoardModel");
const List = require("./ListModel");
const Card = require("./CardModel");
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
    user: async (_, __, { req }) => {
      try {
        const user = await User.findByPk(req.user.id);
        const dataToDisplay = users.dataValues;
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
    listsByBoard: async (_, { boardId }, __) => {
      try {
        console.log("listByBoard ? boardId: ", boardId);
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
    cardsByList: async (_, { listId }, __) => {
      try {
        const cardsByList = await Card.findAll({
          where: {
            listId: listId,
          },
        });

        const dataToSend = cardsByList.map((card) => card.dataValues);

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
    addCard: async (_, { title, description, listId, status }, { req }) => {
      try {
        const user = await User.findByPk(req.user.id);

        const newCard = await Card.create({
          title: title,
          listId: listId,
          description: description,
          status: status,
        });

        await user.addCard(newCard);

        return newCard.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    deleteCard: async (_, { id }) => {
      try {
        const cardToDestroy = await Card.destroy({ where: { id } });

        return cardToDestroy;
      } catch (e) {
        console.error(e);
      }
    },
    deleteBoard: async (_, { id }) => {
      try {
        const boardToDestroy = await Board.destroy({ where: { id } });

        return boardToDestroy;
      } catch (e) {
        console.error(e);
      }
    },
    deleteList: async (_, { id }) => {
      try {
        const listToDestroy = await List.destroy({ where: { id } });

        return listToDestroy;
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

          const { accessToken, refreshToken } = setTokens(user.dataValues);

          return bcrypt.compareSync(password, user.dataValues.password)
            ? { accessToken, refreshToken, username: user.dataValues.username }
            : null;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};

module.exports = resolvers;
