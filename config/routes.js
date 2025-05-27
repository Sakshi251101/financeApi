const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  updateIsrentedStatus,
  createUser,
  getManagers,
  loginUser,
  getUserByMobile,
  getUserById,
  getEmployeesByManager,
  getManagersWithEmployees,
  getAllEmployeesWithData,
  getEmployeesByManagerWithData,
} = require('../controller/userController');
const { createManager } = require('../controller/managerController');
const { createEmployee } = require('../controller/employeeController');
const userDetailsController = require('../controller/userDetailsController');
const { createManagerBank } = require('../controller/managerBankController');
const {
  createLoanType,
  getAllLoanTypes,
} = require('../controller/loanTypeController');
const {
  submitLoanApplication,
  getUsersAssignedToEmployee,
  getLeads,
  fetchLeadsByManager,
  getUserLoanApplication,
} = require('../controller/submitLoanController');
const {
  getStatesByEmployee,
  getEmployeesByState,
  assignStatesToEmployee,
} = require('../controller/EmployeeStateController');
const {
  upsertCompanyDetails,
  getCompanyDetails,
} = require('../controller/companyController');

router.post('/register', createUser);
router.get('/getManager', getManagers);
router.post('/manager', createManager);
router.get('/managerWithEmployees', getManagersWithEmployees);
router.post('/employee', createEmployee);
router.get('/employeesWithData', getAllEmployeesWithData);
router.post('/user/address', userDetailsController.createUserAddress);
router.post('/user/bank', userDetailsController.createUserBank);
router.post('/user/loan', userDetailsController.createUserLoan);
router.post('/user/info', userDetailsController.createUserInformation);
router.post('/manager/bank', createManagerBank);
router.post('/loanTypes', createLoanType);
router.get('/getAllLoanType', getAllLoanTypes);
router.post('/loanSubmit', submitLoanApplication);
// router.post('/loanSubmit', submitLoanApplication);
router.post('/loginAuth', loginUser);
router.post('/assignState', assignStatesToEmployee);
router.get('/employee/:employeeId', getStatesByEmployee);
router.get('/state/:state', getEmployeesByState);
router.get('/by-mobile/:mobileNumber', getUserByMobile);
router.get('/byuserId/:id', getUserById);
router.post('/company-details', upsertCompanyDetails);
router.get('/getCompanyDetails', getCompanyDetails);
router.get('/assigned-users', verifyToken, getUsersAssignedToEmployee);
router.get('/getAllLeads', getLeads);
router.get('/employees-by-manager', getEmployeesByManager);
router.get('/employeesBYManagerData', getEmployeesByManagerWithData);
router.get('/leads', verifyToken, fetchLeadsByManager);
router.get('/user/:id/details', getUserLoanApplication);
router.post('/update-isrented-status', updateIsrentedStatus);
// update-address-status

module.exports = router;
