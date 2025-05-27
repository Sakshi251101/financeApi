const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('Manager', {
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  nickName: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  timestamps: true,
});

Manager.associate = (models) => {
  Manager.belongsTo(models.User, { foreignKey: 'userId' });
  Manager.hasMany(models.Employee, { foreignKey: 'managerId', as: 'Employees' });
};

module.exports = Manager;
