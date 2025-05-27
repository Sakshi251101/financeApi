const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Progress = sequelize.define(
  'Progress',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    current_card: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    step_in_card: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    completed_cards: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: 'user_progress',
    timestamps: true,
  }
);

module.exports = Progress;
