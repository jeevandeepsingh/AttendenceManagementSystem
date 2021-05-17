const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./modals/user');

const dbUrl = 'mongodb://localhost:27017/employee_directory';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;//for reference
db.on("error", console.error.bind(console, "conection error:"));

const seedDB = async () => {
    try{
        await User.deleteMany({});
        const dummy = new User({
            username: 'abc',
            phoneno: 1234567890,
            eid: 0,
            email: 'abc@gmail.com',
            designation: 'admin',
        })
        const registeredUser = await User.register(dummy, 'abc');
        dummy.manager = registeredUser._id;
        await registeredUser.save();
    } catch(err) {
        console.log(err);
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })