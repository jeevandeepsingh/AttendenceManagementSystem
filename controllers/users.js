const User = require('../modals/user');
const mongoose = require('mongoose');

module.exports.renderRegister = async (req, res) => {
    const users = await User.find({});
    const ID = users[users.length-1].eid;
    res.render('users/register', {users, ID});
}

module.exports.register = async (req, res) => {
    try {
        const author = req.user._id;
        const {username, email, phoneno, password, eid, designation, manager} = req.body;
        const user = new User({username, email, phoneno, eid, designation});
        
        let objectId = mongoose.Types.ObjectId(manager);
        user.manager = objectId;
        const registeredUser = await User.register(user, password);

        const mentor = await  User.findById(objectId);
        mentor.mentees.push(registeredUser);
        await mentor.save();
        
        req.flash('success', 'Succesfully created a new user');
        res.redirect('/employee');
    
    }catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/employee');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye!');
    res.redirect('/login');
}

module.exports.searchEmployee = async (req, res) => {
    const {username} = req.body;
    
    const user = await User.findOne({username : username});

    if(user)
    {
        res.redirect(`/employee/${user._id}`);
    }
    else
    {
        const users = await User.find({});
        req.flash('error', 'Employee Not Found');
        res.redirect('/employee/find');   
    }
}