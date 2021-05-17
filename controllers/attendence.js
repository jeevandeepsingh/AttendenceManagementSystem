const Attendence = require('../modals/attendance');
const TimeandDate = require('../public/javascripts/dateandTime');
const User = require('../modals/user');

module.exports.rejectedAttendence = async (req, res) => {
    const {id} = req.params;
    const attendence = await Attendence.findById(id);

    attendence.status = 'Rejected';
    await attendence.save();
    res.redirect('/employee/approve');
}

module.exports.approvedAttendence = async (req, res) => {
    const {id} = req.params;
    const attendence = await Attendence.findById(id);

    attendence.status = 'Approved';
    await attendence.save();
    res.redirect('/employee/approve');
}

module.exports.filterAttendence = async (req, res) => {
    const {status} = req.body;
    const id = req.user._id;

    if(status === "ALL")
    {
        res.redirect('/employee/approve');
    }
    else
    {
        const user = await User.findById(id).populate(
            {
                path: 'mentees'
            }
        );
        const attendences = new Array(user.mentees.length);
        let pos = 0;

        for(let menteeId of user.mentees)
        {
            let mentee = await User.findById(menteeId).populate(
                {
                    path: 'attendance'
                }
            );
            attendences[pos] = [];
            attendences[pos].push(mentee)
            for(let x of mentee.attendance)
            {
                if(x.status === status)
                {
                    attendences[pos].push(x);
                }
            }
            pos++;
        }

        const flag = false;
        const date = await TimeandDate.calculateDate();
        res.render('./users/approveAttendence', {attendences, status , flag, date});

    }
}