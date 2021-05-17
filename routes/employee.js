const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const employee = require('../controllers/employee');
const {isLoggedIn, isAdmin} = require('../middleware');

router.route('/')
    .get(isLoggedIn, catchAsync(employee.renderEmployee))

router.route('/markAttendance')
    .post(isLoggedIn, catchAsync(employee.markAttendance))

router.route('/approve')
    .get(isLoggedIn, catchAsync(employee.approveAttendance))

router.route('/find')
    .get(isLoggedIn, catchAsync(employee.renderEmployeesDetails))

router.route('/:userId')
    .get(isLoggedIn, catchAsync(employee.renderEmployeeDetails))
    .put(isLoggedIn, isAdmin, catchAsync(employee.updateEmployee))
    .delete(isLoggedIn, isAdmin, catchAsync(employee.deleteEmployee))

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(employee.renderEditFrom))

module.exports = router;