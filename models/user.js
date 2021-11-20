// THIS IS OUR USER.JS MODEL
const mongoose = require('mongoose'); // we require the 'mongoose' package to manage our database
const Schema = mongoose.Schema; // we extract the schema constructor from mongoose and assign it to the 'Schema' const.

// we then use the above constants to create a new database schema for our posts
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        defaul: 'I am new!'
    },
    posts: [
        {
            type: Schema.Types.ObjectId, // This will be a reference to a post which will have an ObjectId, the type is Post so we define it next.
            ref: 'Post' // 'Post' defines our Type.
        }
    ]
});

module.exports = mongoose.model('User', userSchema); // exports our User model (which automatcally gets changed to 'users' by MongoDB in the database.)