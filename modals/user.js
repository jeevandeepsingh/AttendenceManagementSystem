const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    manager: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    phoneno: {
        type: Number,
        required: true,
        unique: true
    },
    eid: {
        type: Number,   
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    attendance: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attendence'
        }
    ],
    mentees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);