const User = require("./UserModel");
const Board = require("./BoardModel");
const List = require("./ListModel");
const Card = require("./CardModel");
const bcrypt = require("bcrypt");
const { toJWT } = require("./auth/setTokens");
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
        const user = await User.findByPk(req.userId);
        const dataToDisplay = users.dataValues;
        return dataToDisplay;
      } catch (e) {
        console.error(e);
      }
    },
    board: async (_, args, { req }) => {
      try {
        if (!req.userId) return new AuthenticationError("Authentication");
        const board = await Board.findByPk(args.id);
        return board.dataValues;
      } catch (e) {
        console.error(e);
      }
    },
    boards: async (_, { userId }, { req }) => {
      try {
        if (!req.userId) return new AuthenticationError("Authentication");

        if (req.userId !== userId)
          return new AuthenticationError(
            "You don't have the authorization to access this profile"
          );

        const user = await User.findByPk(userId, {
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
        const listsByBoard = await List.findAll({
          where: {
            boardId: boardId,
          },
        });

        const formatedResult = listsByBoard.map((list) => list.dataValues);

        const sortedArray = formatedResult.sort(
          (firstElement, secondElement) =>
            firstElement.position - secondElement.position
        );

        return sortedArray;
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
        console.log("req ?", req);

        if (!req.userId) return new AuthenticationError("Authentication");

        const user = await User.findByPk(req.userId);

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
        if (!req.userId) return new AuthenticationError("Authentication");

        const lists = await List.findAll({
          where: { boardId: boardId },
        });

        if (lists.length === 0) {
          const newList = await List.create({
            name: name,
            userId: req.userId,
            boardId: boardId,
            position: 0,
          });

          return newList.dataValues;
        } else {
          const positions = lists.map((list) => list.dataValues.position);
          const lastPosition = positions[positions.length - 1];
          const newListPosition = lastPosition + 1;

          const newList = await List.create({
            name: name,
            userId: req.userId,
            boardId: boardId,
            position: newListPosition,
          });

          return newList.dataValues;
        }
      } catch (e) {
        console.error(e);
      }
    },
    addCard: async (_, { title, description, listId, status }, { req }) => {
      try {
        if (!req.userId) return new AuthenticationError("Authentication");

        const user = await User.findByPk(req.userId);

        const cards = await Card.findAll({
          where: { listId },
        });

        if (cards.length === 0) {
          const newCard = await Card.create({
            title: title,
            listId: listId,
            description: description,
            status: status,
            position: 0,
          });

          await user.addCard(newCard);

          return newCard.dataValues;
        } else {
          const positions = cards.map((card) => card.dataValues.position);
          const lastPosition = positions[positions.length - 1];
          const newCardPosition = lastPosition + 1;

          const newCard = await Card.create({
            title: title,
            listId: listId,
            description: description,
            status: status,
            position: newCardPosition,
          });

          await user.addCard(newCard);

          return newCard.dataValues;
        }
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
    updateListsPositions: async (_, { updatedLists }) => {
      try {
        updatedLists.forEach(async (list) => {
          await List.update(
            { position: list.position },
            { where: { id: list.id } }
          );
        });
      } catch (e) {
        console.error(e);
      }
    },
    updateCardsPositions: async (_, { updatedCards }) => {
      try {
        updatedCards.forEach(async (card) => {
          await Card.update(
            { position: card.position },
            { where: { id: card.id } }
          );
        });
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
          return new AuthenticationError(
            "Please enter a valid e-mail and password"
          );
        } else {
          const user = await User.findOne({
            where: { email: email },
          });

          const jwt = toJWT({ id: user.dataValues.id });

          return bcrypt.compareSync(password, user.dataValues.password)
            ? { jwt, userId: user.id }
            : null;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};

module.exports = resolvers;
