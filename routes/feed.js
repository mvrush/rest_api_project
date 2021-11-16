const express = require('express'); // we import our express router by requiring express
const { body } = require('express-validator'); // brings in 'express-validator' module and assigns it to the 'body' value to check the body. We could have said 'check' instead of body to check headers, query parameters etc.

const feedController = require('../controllers/feed'); // this pulls in our controllers/feed.js file.

const router  = express.Router(); // we then create a router by calling the express.Router() function.

// GET /feed/posts - would be handled by the feedController.getPosts because it was caught in app.js, sent here and forwarded to 'getPosts' in the feed.js controller.
router.get('/posts', feedController.getPosts); // this is the route to our newsfeed posts. When a request reaches this it goes to the controllers/feed.js and executes the 'getPosts' logic there.

// POST /feed/post - '/feed/post' is the path that handles the POST request.
router.post('/post',
    [ // this object [] contains our server-side validation using express-validator and calling the 'body' const defined above to check the body.
        body('title')
        .trim()
        .isLength( { min: 5 }),
        body('content')
        .trim()
        .isLength({ min: 5 })
    ],
    feedController.createPost
    ); // this is the route to our newsfeed posts. When a request reaches this it goes to the controllers/feed.js and executes the 'createPost' logic there.

module.exports = router; // we export our router constant defined at the top which holds the 'express.Router()' function.