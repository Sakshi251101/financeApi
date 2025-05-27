const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const UserLoan = sequelize.define(
  'user_loan',
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
    loan_type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    tenure: DataTypes.INTEGER, // years
    interest_rate: DataTypes.FLOAT,
    emi: DataTypes.DECIMAL,
  },
  { timestamps: true }
);

// User.hasOne(UserLoan, { foreignKey: 'user_id' });
// UserLoan.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserLoan;
