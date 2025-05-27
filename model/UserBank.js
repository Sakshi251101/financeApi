const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const UserBank = sequelize.define(
  'user_bank',
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
    bank_name: DataTypes.STRING,
    account_type: DataTypes.STRING,
    ifsc: DataTypes.STRING,
    branch_name: DataTypes.STRING,
    account_holder_name: DataTypes.STRING,
    account_no: DataTypes.STRING,
  },
  { timestamps: true }
);

// User.hasOne(UserBank, { foreignKey: 'user_id' });
// UserBank.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserBank;
