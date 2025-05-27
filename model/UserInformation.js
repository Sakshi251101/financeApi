const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const UserInformation = sequelize.define(
  'user_information',
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
    aadhar: DataTypes.STRING,
    pancard: DataTypes.STRING,
    whatsapp_no: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    employement: DataTypes.STRING,
    gender: DataTypes.STRING,
  },
  { timestamps: true }
);

module.exports = UserInformation;
