const Attendence = require('../modals/attendance');
const User = require('../modals/user');
const TimeandDate = require('../public/javascripts/dateandTime');
const calculateHours = require('../public/javascripts/calculateHours');
const mongoose = require('mongoose');

module.exports.renderEmployee = async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate({
        path: 'attendance'
    });
    res.render('home', { user });
}

module.exports.markAttendance = async (req, res) => {

    const id = req.user._id;
    let user = await User.findById(id).populate({
        path: 'attendance'
    });
    
    const time = await TimeandDate.calculateTime();
    const date = await TimeandDate.calculateDate();

    let alreadyMarked = false;
    let attendenceId = id;//default intialization

    for(let pos = 0 ; pos < user.attendance.length ; pos++)
    {
        if(user.attendance[pos].date === date)
        {
            alreadyMarked = true;
            attendenceId = user.attendance[pos]._id;
            break;
        }
    }

    if(alreadyMarked)
    {
        const attendence = await Attendence.findById(attendenceId);
        attendence.checkout = time;
        let diffHours = calculateHours.calculateHoursDiff(attendence.checkin, attendence.checkout, attendence.date);
        attendence.time = diffHours;
        await attendence.save();
    }
    else
    {
        const attendence = new Attendence({date});
        attendence.checkin = time;

        user.attendance.push(attendence)
        await user.save();
        await attendence.save();
    }

    user = await User.findById(id).populate({
        path: 'attendance'
    });
    res.render('home', {user});
}

module.exports.renderEmployeesDetails = async (req, res) => {
    let users = await User.find({});
    res.render('users/employees', { users });
}

module.exports.renderEmployeeDetails = async (req, res) => {
    const { userId } = req.params;
    let user = await User.findById(userId);
    let tempuser = await User.findById(user.manager);
    res.render('users/employeedetails', { user , manager: tempuser.username});
}

module.exports.renderEditFrom = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: 'manager'
    });
    const users = await User.find({});

    if(!user)
    {
        req.flash('error', 'Cannot find that empolyee');
        return res.redirect('/employee'); 
    }
    res.render('users/edit', {user, users});
}

module.exports.updateEmployee = async (req, res) => {
    const {userId} = req.params;
    const {username, email, phoneno, eid, designation, manager} = req.body;

    const user = await User.findById(userId);
    let objectId = mongoose.Types.ObjectId(manager);

    const currManager = await User.findById(objectId);
    const prevManager = await User.findById(user.manager).populate({
        path: 'mentees'
    });

    if(currManager.username !== prevManager.username)
    {
        currManager.mentees.push(user);

        for(let pos = 0 ; pos < prevManager.mentees.length ; pos++)
        {
            if((prevManager.mentees[pos]._id).equals(user._id))
            {
                prevManager.mentees.splice(pos, 1);
                break;
            }
        }

        await prevManager.save();
        await currManager.save();
        user.manager = currManager._id;
    }

    user.username = username;
    user.email = email;
    user.phoneno = phoneno;
    user.eid = eid;
    user.designation = designation;
    
    await user.save();
    req.flash('success', 'Successfully updated user details!');
    res.redirect(`/employee/${userId}`);
}

module.exports.deleteEmployee = async (req, res) => {
    if(req.params.userId != req.user._id)
    {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        
        if(user.mentees.length > 0)
        {
            req.flash('error', `This user has mentees please first change their manager then delete this ${user.username}!`);
            res.redirect('/employee/find');
        }
        else
        {
            const manager = await User.findById(user.manager);

            for(let pos = 0 ; pos < manager.mentees.length ; pos++)
            {
                if(manager.mentees[pos].equals(user._id))
                {
                    manager.mentees.splice(pos, 1);
                    break;
                }
            }

            await manager.save();
            for(let val of user.attendance)
            {
                await Attendence.findByIdAndDelete(val);
            }

            await User.findByIdAndDelete(userId);
            req.flash('success', 'User Deleted!');
            res.redirect('/employee');
        }
    }
    else
    {
        req.flash('error', 'This operation is not allowed!');
        res.redirect('/employee/find');
    }
}

module.exports.approveAttendance = async (req, res) => {
    const id = req.user._id;

    console.log(id);
    const user = await User.findById(id).populate(
        {
            path: 'mentees'
        }
    );
    const mentees = [];
    for(let menteeId of user.mentees)
    {
        let mentee = await User.findById(menteeId).populate(
            {
                path: 'attendance'
            }
        );
        mentees.push(mentee);
    }
    const date = await TimeandDate.calculateDate();
    const flag = true;
    res.render('./users/approveAttendence', {user, mentees, date, flag});
}