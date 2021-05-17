const express = require('express');
const router = express.Router({mergeParams: true});


const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAdmin} = require('../middleware');
const users = require('../controllers/users');
const passport = require('passport');

router.route('/')
    .get(users.renderLogin)

router.route('/register')
    .get(isLoggedIn, isAdmin, catchAsync(users.renderRegister))
    .post(isLoggedIn, isAdmin, catchAsync(users.register))

router.route('/search')
    .post(isLoggedIn, catchAsync(users.searchEmployee))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login)

router.route('/logout')
    .get(users.logout)

module.exports = router;