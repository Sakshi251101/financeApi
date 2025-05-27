// models/UserDocument.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserDocument = sequelize.define(
  'UserDocument',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    document_type: {
      type: DataTypes.ENUM(
        'Approval',
        'Agreement',
        'Holding',
        'Insurance',
        'NOC',
        'Others'
      ),
      allowNull: false,
    },
    document_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    transaction_type: {
      type: DataTypes.STRING, // You can use ENUM here if types are fixed
      allowNull: true,
    },
  },
  {
    tableName: 'user_documents',
    timestamps: true,
  }
);

module.exports = UserDocument;
