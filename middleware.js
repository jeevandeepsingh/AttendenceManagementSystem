const Users = require('./modals/user');

//Middleware for Authentication details
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated())
    {
        req.flash('error', 'you must be signed in First');
        return res.redirect('/login');
    }
    next();
} 

//Middleware for Check details for User
module.exports.isAdmin = async (req, res, next) => {
    const id = req.user._id;
    const user = await Users.findById(id);

    if(user.designation !== 'admin') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/employee`);
    }
    next();
}