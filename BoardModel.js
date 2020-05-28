const Sequelize = require("sequelize");
const db = require("./db");
const User = require("./UserModel");

const Board = db.define("boards", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Board.belongsToMany(User, { through: "UserBoard" });
User.belongsToMany(Board, { through: "UserBoard" });

module.exports = Board;
