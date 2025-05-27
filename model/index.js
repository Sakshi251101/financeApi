const sequelize = require('../config/database');
const User = require('./user');
const UserLoan = require('./UserLoan');
const UserBank = require('./UserBank');
const UserInformation = require('./UserInformation');
const UserAddress = require('./UserAddress');
const UserLoanReferenceIds = require('./userLoanReferenceIds');
const EmployeeAssignment = require('./EmployeeAssignment');
const Employee = require('./employee');
const ManagerBank = require('./ManagerBank');

// Associations

// User self-reference: manager and employees
User.belongsTo(User, { as: 'Manager', foreignKey: 'managerId' });
User.hasMany(User, { as: 'Employees', foreignKey: 'managerId' });

// User and related one-to-one models
User.hasOne(UserLoan, { foreignKey: 'user_id', as: 'user_loan' });
UserLoan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserBank, { foreignKey: 'user_id', as: 'user_bank' });
UserBank.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserInformation, { foreignKey: 'user_id', as: 'user_information' });
UserInformation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserAddress, { foreignKey: 'user_id', as: 'user_address' });
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserLoanReferenceIds, {
  foreignKey: 'user_id',
  as: 'loanReference',
});
UserLoanReferenceIds.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


// ManagerBank associations
User.hasOne(ManagerBank, { foreignKey: 'manager_id', as: 'manager_bank' });
ManagerBank.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

// EmployeeAssignment associations
User.hasOne(EmployeeAssignment, {
  foreignKey: 'user_id',
  as: 'assigned_employee',
});
EmployeeAssignment.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
EmployeeAssignment.belongsTo(User, {
  foreignKey: 'employee_id',
  as: 'AssignedEmployee',
});

// Employee belongs to User as both UserInfo and ManagerInfo
Employee.belongsTo(User, { foreignKey: 'employeeId', as: 'UserInfo' });
Employee.belongsTo(User, { foreignKey: 'managerId', as: 'ManagerInfo' });
User.hasOne(Employee, {foreignKey: 'employeeId', as:'employeeLeads'})

// Export all models
module.exports = {
  sequelize,
  User,
  UserLoan,
  UserBank,
  UserInformation,
  UserAddress,
  UserLoanReferenceIds,
  EmployeeAssignment,
  Employee,
  ManagerBank,
};
