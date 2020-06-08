const db = require("./db");
const Sequelize = require("sequelize");
const Board = require("./BoardModel");
const User = require("./UserModel");

const List = db.define(
  "lists",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

List.belongsTo(User);
List.belongsTo(Board);

module.exports = List;
