const db = require("./db");
const Sequelize = require("sequelize");
const List = require("./ListModel");
const User = require("./UserModel");

const Card = db.define(
  "cards",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

Card.belongsTo(List);
Card.belongsToMany(User, { through: "UserCard" });
User.belongsToMany(Card, { through: "UserCard" });

module.exports = Card;
