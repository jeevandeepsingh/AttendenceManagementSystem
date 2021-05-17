const express = require('express');
const router = express.Router({mergeParams: true});


const catchAsync = require("../utils/catchAsync");
const attendence = require('../controllers/attendence');
const {isLoggedIn} = require('../middleware');

router.route('/')
    .post(isLoggedIn, catchAsync(attendence.filterAttendence))

router.route('/:id/rejected')
    .put(isLoggedIn, catchAsync(attendence.rejectedAttendence))
    
router.route('/:id/approved')
    .put(isLoggedIn, catchAsync(attendence.approvedAttendence))

module.exports = router;