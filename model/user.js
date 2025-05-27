const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'employee', 'user'),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // Self-reference to User table
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active',
    },
    isrented: {
      type: DataTypes.ENUM('1', '2'),
      allowNull: false,
      defaultValue: '1', // 1= rednted,2=non rented
    },
  },
  {
    timestamps: true,
  }
);

// // Self-referencing association for manager-employee relationship
// User.belongsTo(User, { as: 'Manager', foreignKey: 'managerId' });
// User.hasMany(User, { as: 'Employees', foreignKey: 'managerId' });

module.exports = User;
