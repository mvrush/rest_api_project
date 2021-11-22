// THIS IS OUR AUTH CONTROLLER
const { validationResult } = require('express-validator'); // uses the 'validationResult' function from our 'express-validator' package.
const bcrypt = require('bcryptjs'); // brings in bcrypt.js so we can encrypt our password. We installed it with npm install --save bcryptjs
const jwt = require('jsonwebtoken'); // brings in the jsonwebtoken package. Installed with npm start --save jsonwebtoken

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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser; // we will use this variable to store our found user in the code below.
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401; // 401 means not authenticated
            throw error; // we can use 'throw' here and not 'next' because the 'throw' will simply pass the error to our .catch block.
        }
        loadedUser = user; // we store our 'user' in teh loadedUser variable so we can use it in later functions as well.
        return bcrypt.compare(password, user.password); // we use bcrypt's compare function to compare the password with the user.password we have stored. We 'return' it so it has a promise so we can add another .then block.
    })
    .then(isEqual => { // checks to see if the password is equal. If not, it runs the error block, if it is, we create a JSON Web Token.
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401; // means Not Authenticated
            throw error; // we use 'throw' and not next because throw will simply pass the error to the next .catch block.
        }
        const token = jwt.sign({ // we create a 'token' const using our jwt (jsonwebtoken) sign() function which creates the JSON token. We then fill it with the data we want.
            email: loadedUser.email, // we put in the loadedUser email
            userId: loadedUser._id.toString() // we put in the loadedUser _id from the database after converting it to string data.
        },
        'somesupersecretsecret', // THIS IS OUR SECRET KEY. You can make it as long as you want. It is only known to the server and will validate the token when passed by the cleint.
        { expiresIn: '1h' } // we set the expiry so that the token becomes invalid after 1 hour. This is a security mechanism so the token, if stolen, will expire.
        );
        res.status(200).json({ token: token, userId: loadedUser._id.toString() }); // sends a response with status 200 (success) and a json object with the token and the loaded user _id converted to a sting.
    }) 
    .catch(err => {
        if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
            err.statusCode = 500; // 500 means a server error occured.
        }
        next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handling middleware found in 'app.js'.
    });
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId) // we can get the userId from the req object (references our middleware/is-auth.js file).
    .then(user => {
        if (!user) { // if no (!) user is found then throw an error.
            const error = new Error('User not found.');
            error.statusCode = 404; // 404 means 'Not Found'.
            throw error; // we throw the error so that it throws it to the next .catch block.
        }
        res.status(200).json({ status: user.status }); // if a user was found we send a 200 (success) status and json data with the user.status
    }).catch(err => {
        if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
            err.statusCode = 500; // 500 means a server error occured.
        }
        next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handling middleware found in 'app.js'.
    });
};

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User.findById(req.userId)
    .then(user => {
        if (!user) { // if no (!) user is found then throw an error.
            const error = new Error('User not found.');
            error.statusCode = 404; // 404 means 'Not Found'.
            throw error; // we throw the error so that it throws it to the next .catch block.
        }
        user.status = newStatus;
        return user.save(); // we return the promise that user.save() creates when it saves the user.
    })
    .then (result => {
      res.status(200).json({ message: 'User updated.' }); // we return status 200 (success) along with the message.  
    })
    .catch( err => {
        if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
            err.statusCode = 500; // 500 means a server error occured.
        }
        next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handling middleware found in 'app.js'.
    });
};