const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const UserLoanReferenceIds = sequelize.define(
  'UserLoanReferenceIds',
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
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    application_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proposal_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = UserLoanReferenceIds;
