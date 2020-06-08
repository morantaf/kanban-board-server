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

List.BelongsTo(User);
List.BelongsTo(Board);

module.exports = List;
