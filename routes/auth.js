const express = require('express'); // we import our express router by requiring express
const { body } = require('express-validator'); // brings in 'express-validator' module for input validation and assigns it to the 'body' value to check the body. We could have said 'check' instead of body to check headers, query parameters etc.

const User = require('../models/user'); // we import our user model and assign it to const User.
const authController = require('../controllers/auth'); // import our auth.js controller
const isAuth = require('../middleware/is-auth'); // import our us-auth.js from our middleware folder.

const router  = express.Router(); // we then create a router by calling the express.Router() function. We need it for authorized routes.

// here we add an array of validation-related middleware.
// Uses the PUT method (could also use POST) but PUT can not only create but also overwrite a resource which POST cannot do.
router.put('/signup', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.') // this checks the body for email, that it's a valid email and sends an error message if it isn't which is stored in the error object we can retrieve.
    .custom((value, { req }) => { // this looks for an email (value) and if it finds one, it rejects the promise and sends a message that the email already exists.
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
    .normalizeEmail(),
    body('password') // pulls the password from the body
        .trim() // trims the whitespace
        .isLength({ min: 5 }), // checks password length for a minimum length
    body('name') // pulls the name from the body
        .trim() // trims the whitespace
        .not() // checks that it's .not() empty.
        .isEmpty() // works with not()
],
    authController.signup // calls the 'signup' function from our authController.
);

router.post('/login', authController.login); // this is our login route. It refences the 'login' function in the authController.

router.get('/status', isAuth, authController.getUserStatus); // this is our status route. It reuqires authorization which iw why we use 'isAuth' which we imported at the top of the page.

// Imagine the router.patch block all as a single line like the router.get routes. We use the PATCH method which updates parts of an existing method.
// It says this is the '/status' route, 'isAuth' checks to see if we've got an authorization token.
// It then uses validation found inside the [] to check the body 'status' field to make sure it is not empty.
router.patch(
    '/status',
     isAuth,
        [
            body('status')
            .trim()
            .not()
            .isEmpty()
        ],
        authController.updateUserStatus
        );

module.exports = router; // we export our router constant defined at the top which holds the 'express.Router()' function.