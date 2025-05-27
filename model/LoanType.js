const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanType = sequelize.define('LoanType', {
  loan: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING, // URL string for icon
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  interest_rate: {
    type: DataTypes.FLOAT, // in percentage
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = LoanType;
