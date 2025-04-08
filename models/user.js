const mongoose = require('mongoose');
const emailRegx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            required: true,
            type: String,
            trim: true,
            validate: {
                validator: (value) => {
                    return value.match(emailRegx);
                },
                message: 'Please enter a valid email address'
            },
        },
        password: {
            required: true,
            type: String,
            validate: {
                validator: (value) => {
                    return value.length > 6;
                },
                message: 'Please enter your password greater than 6 characters'
            }
        },
        address: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'user',
        }
    },
    {timestamps: true},);

const User = mongoose.model("User", userSchema);
module.exports = User;
