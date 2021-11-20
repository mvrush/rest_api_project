const express = require('express'); // we import our express router by requiring express
const { body } = require('express-validator'); // brings in 'express-validator' module for input validation and assigns it to the 'body' value to check the body. We could have said 'check' instead of body to check headers, query parameters etc.

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

router.get('/post/:postId', feedController.getPost); // this route will fetch our post with the dynamic (as indicated by the colon (:)) ':postId'. It uses the FeedController getPost function.

router.put('/post/:postId',  // The 'put' method won't work with a browser form but with JavaScript's asynchonous requests, we can use it. 'Put' will create or overwrite a resource on the server.
    [ // this object [] contains our server-side validation using express-validator and calling the 'body' const defined above to check the body.
    body('title')
    .trim()
    .isLength({ min: 5 }),
    body('content')
    .trim()
    .isLength({ min: 5 })
    ],
    feedController.updatePost // our associated controller action is 'feedController.updatePost' which means the updatePost function found in the feedController.
);

router.delete('/post/:postId', feedController.deletePost); // Route uses the 'delete' method to delete posts. Routes always have an associated controller action.

module.exports = router; // we export our router constant defined at the top which holds the 'express.Router()' function.