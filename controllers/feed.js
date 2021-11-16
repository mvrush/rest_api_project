const { validationResult } = require('express-validator'); // This brings in 'express-validator' and assigns it to the 'validationResult' const.

const Post = require('../models/post'); // We require our post.js from the models folder.

exports.getPosts = (req, res, next) => {
// this response is sent in json format. The json() function is built in and takes the JavaScript object {} and formats it as JSON with the correct headers etc.
    res.status(200).json({ // we have to be clear on our status codes so the client knows if there was an error or not. A 200 code means success.
        posts: [
            { 
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/mexican_austin.jpg',
                creator: {
                    name: 'Big Willy'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req); // looks at our validationResult in the request and looks for any errors.
    if (!errors.isEmpty()) { // says "if isEmpty() has no (!) errors then there is an error". It's kind of backwards.
        return res.status(422) // '422' means that validation failed.
        .json({ // creates an error message and creates an array of errors in the .json object.
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array()
    });
    }
    const title = req.body.title; // we pull this from the body of the req the user sent which is in the form of JSON data
    const content = req.body.content; // we pull this from the body of the req the user sent which is in the form of JSON data
    const post = new Post({ // we create a new post with our 'Post' model constructor and pass a JavaScript object {} to define what gets passed to the database. 
        title: title,
        content: content,
        imageUrl: 'images/reilly_dummy.gif',
        creator: { name: 'Big Willy'}
    });
    post.save().then(result => {
        console.log("This is the result of our createPost 'post.save()'. ->", result);
        res.status(201).json({ // status 200 means success, status 201 means success AND we created a resource.
            message: 'Post created successfully!',
            post: result // this is the result we got back from post.save
        });
    }).catch(err => {
        console.log("Err from createPost 'post.save'. ->", err);
    });
};