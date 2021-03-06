const db = require("./db");
const Sequelize = require("sequelize");
const Board = require("./BoardModel");
const User = require("./UserModel");

const List = db.define(
  "lists",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

List.belongsTo(User);
List.belongsTo(Board);

module.exports = List;
