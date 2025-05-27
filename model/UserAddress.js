const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const UserAddress = sequelize.define(
  'user_address',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pincode: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    address: DataTypes.STRING,
    address_type: {
      type: DataTypes.ENUM('permanent', 'rented'),
      allowNull: false,
      defaultValue: 'permanent',
    },
  },
  {
    timestamps: true,
  }
);
module.exports = UserAddress;
