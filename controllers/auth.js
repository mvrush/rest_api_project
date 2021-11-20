// THIS IS OUR AUTH CONTROLLER
const { validationResult } = require('express-validator'); // uses the 'validationResult' function from our 'express-validator' package.
const bcrypt = require('bcryptjs'); // brings in bcrypt.js so we can encrypt our password. We instlled it with npm install --save bcryptjs

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req); // uses the 'validationResult' function and passes the req to it for it to check for errors.
    if (!errors.isEmpty()) { // says if errors is not (!) empty then execute the following lines.
        const error = new Error('Validation failed.');
        error.statusCode = 422; // means validation error
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email; // pulls these values from the body so we can send them to the model to store them in the database
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
        .hash(password, 12) // hashes the password with a level of 12 which is the standard right now.
        .then(hashedPw => {
            const user = new User({ // pulls the following values from our User database defined in our models/user.js and assigns it to const 'user'.
                email: email,
                password: hashedPw,
                name: name
            });
            return user.save(); // we then call save() to save it to the user database. We 'return' it so we can add another .then block.
        })
        .then(result => { // this is the result of our database save() operation.
            res.status(201) // 201 means request was fulfilled.
            .json({ message: 'User created!', userId: result._id }); // this is shown as JSON data in the Browser Console.
        })
        .catch(err => {
            if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
                err.statusCode = 500; // 500 means a server error occured.
            }
            next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handlind middleware found in 'app.js'.
        });
};