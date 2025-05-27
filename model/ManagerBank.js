const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const ManagerBank = sequelize.define(
  'manager_bank',
  {
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    bank_name: DataTypes.STRING,
    account_type: DataTypes.STRING,
    ifsc: DataTypes.STRING,
    branch_name: DataTypes.STRING,
    account_holder_name: DataTypes.STRING,
    account_no: DataTypes.STRING,
    upi: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

module.exports = ManagerBank;
