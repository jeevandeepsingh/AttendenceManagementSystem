const express = require('express');
const app = express();

const methodOverride = require('method-override');
const User = require('./modals/user');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const flash = require('connect-flash');
app.use(flash());

const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
const attendence = require('./modals/attendance');

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));//Decode URL
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname,'views'));

const dbUrl = 'mongodb://localhost:27017/employee_directory';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;//for reference
db.on("error", console.error.bind(console, "conection error:"));

const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const sessionConfig = {
    secret: 'thisisdemosecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//Client Side Script do not access it (means not by javaScripts)
        // secure: true,//Only hit by HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));//From Curr Directory
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//Method from passport-local

passport.serializeUser(User.serializeUser());//How to store data in session
passport.deserializeUser(User.deserializeUser());//How to fetch data in session

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const employeeRoutes = require('./routes/employee');
const attendenceRoutes = require('./routes/attendence');
const userRoutes = require('./routes/users');
const { isLoggedIn } = require('../YelpCamp/middleware');

app.use('/employee', employeeRoutes);
app.use('/attendence', attendenceRoutes);
app.use('/', userRoutes);


app.get('/favicon.ico', (req, res) => {
    res.send('Hello');
})

//Handling all error
app.all('*', (req, res, next) => {
    next (new ExpressError('Page Not Found', 404));
})

//Error Handler Middleware
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message =  'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
})

const port = 3000;
app.listen(port ,() => {
    console.log(`Server is running on port ${port}`);
})