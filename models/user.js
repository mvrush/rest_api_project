const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

});

module.exports = mongoose.model('User', userSchema); // exports our User model (which automatcally gets changed to 'users' by MongoDB in the database.)