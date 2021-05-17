const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendenceSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    checkin: {
        type: String,
    },
    checkout: {
        type: String,
    },
    time: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
})

module.exports = mongoose.model('Attendence', AttendenceSchema);