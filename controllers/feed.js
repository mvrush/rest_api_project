const fs = require('fs'); // brings in the filesystem module from Node.js so use the filesystem.
const path = require('path'); // our Node.js path function that constructs paths to files that work for whatever OS is needing it (Win, Linux, MacOS).

const { validationResult } = require('express-validator'); // This brings in 'express-validator' and assigns it to the 'validationResult' const.

const Post = require('../models/post'); // We require our post.js from the models folder.

exports.getPosts = (req, res, next) => {
    Post.find() // uses 'find' on our 'Post' method which is our database. 'find' is a Mongoose function.
    .then(posts => {
        res
        .status(200)
        .json({message: 'Fetched posts successfully.', posts: posts}); // says '.then' send a response with (200) (200=success) along with a value for 'message' and the posts we found in the lines above as our 'posts' value. The JSON data is shown in the Browser Console.
    })
    .catch(err => {
        if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
            err.statusCode = 500; // 500 means a server error occured.
        }
        next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handlind middleware found in 'app.js'.
    });

/**** This was a dummy response we used when setting things up. */
    // // this response is sent in json format. The json() function is built in and takes the JavaScript object {} and formats it as JSON with the correct headers etc.
    // res.status(200).json({ // we have to be clear on our status codes so the client knows if there was an error or not. A 200 code means success.
    //     posts: [
    //         { 
    //             _id: '1',
    //             title: 'First Post',
    //             content: 'This is the first post!',
    //             imageUrl: 'images/mexican_austin.jpg',
    //             creator: {
    //                 name: 'Big Willy'
    //             },
    //             createdAt: new Date()
    //         }
    //     ]
    // });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req); // looks at our validationResult in the request and looks for any errors.
    if (!errors.isEmpty()) { // says "if isEmpty() has no (!) errors then there is an error". It's kind of backwards.
        const error = new Error('Validation failed, entered data is incorrect.'); // we use the 'Error' constructor to create our error message.
        error.statusCode = 422; // 422 means that validation failed.
        throw error; // this 'throw' will exit the 'createPost' function and try to reach the next error handling function or error handling middleware provided in the express application ('app.js' I think). 
/* The following lines are how we were handling errors but that changed when we added the above 3 lines of code *******/        
    //     return res.status(422) // '422' means that validation failed.
    //     .json({ // creates an error message and creates an array of errors in the .json object.
    //         message: 'Validation failed, entered data is incorrect',
    //         errors: errors.array()
    // });
    }
    if (!req.file) { // checks the req for a file and if no (!) file is present it sets an error.
        const error = new Error('No image provided. Please try again whilst providing an image. 🥺');
        error.statusCode = 422; // on error replies with statusCode 422 to the browser console. 422=validation failed
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/"); // If an image was found in req.file then it stores the path to the file in the 'imageUrl' const. We had to use the 'replace()' function because it stores the filepath with a \\ which does not work in Windows. So we have to replace the '\\' with '/'.
    const title = req.body.title; // we pull this from the body of the req the user sent which is in the form of JSON data
    const content = req.body.content; // we pull this from the body of the req the user sent which is in the form of JSON data
    const post = new Post({ // we create a new post with our 'Post' model constructor and pass a JavaScript object {} to define what gets passed to the database. 
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: 'Big Willy'}
    });
    post.save().then(result => {
        console.log("This is the result of our createPost 'post.save()' in controllers/feed.js. ->", result);
        res.status(201).json({ // status 200 means success, status 201 means success AND we created a resource.
            message: 'Post created successfully!',
            post: result // this is the result we got back from post.save
        }); // The JSON object is shown inside the Browser Console so you can check it there.
    }).catch(err => {
        if (!err.statusCode) { // checks for a statusCode and if no (!) err.statusCode is found it executes the following.
            err.statusCode = 500; // 500 means a server error occured.
        }
        next(err); // we can't use 'throw' here because we're in an asynchronous function. We have to use 'next()' to pass the err to our error handlind middleware found in 'app.js'.
    });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId; // pulls our 'postId' from the 'params' in the request.
    Post.findById(postId) // we use our 'Post' model and the 'findById()' method provided by Mongoose to find our 'postId'.
        .then(post => {
            if (!post) { // says if no (!) post, do the following lines.
                const error = new Error('Could not find post.');
                error.statusCode = 404; // 404 means 'not found'.
                throw error; // we can use 'throw' here and not 'next' because the 'throw' will simply pass the error to our .catch block.
            }
            res.status(200).json({ message: 'Post fetched.', post: post }); // If there is a post then we return a 200 status (success), put up the 'Post fetched.' message and return the post as json data which is shown in the Browser Console.
        })
        .catch(err => {
            if (!err.statusCode) { // checks for an error statusCode and if no (!) code then is sets a 500 server error.
                err.statusCode = 500;
            }
        next(err); // if there is an err statusCode it sends it to the 'next' err handler which is our catch-all middleware in app.js.
        });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId; // requests the 'postId' from the params.
    const errors = validationResult(req); // looks at our validationResult in the request and looks for any errors.
    if (!errors.isEmpty()) { // says "if isEmpty() has no (!) errors then there is an error". It's kind of backwards.
        const error = new Error('Validation failed, entered data is incorrect.'); // we use the 'Error' constructor to create our error message.
        error.statusCode = 422; // 422 means that validation failed.
        throw error; // this 'throw' will exit the 'createPost' function and try to reach the next error handling function or error handling middleware provided in the express application ('app.js' I think). 
    }
    const title = req.body.title; // requests the title from the body.
    const content = req. body.content; // requests the content from the body.
    let imageUrl = req.body.image; // this sets up a variable so that if the image was not changed, it just pulls it's path from the body for the imageUrl.
    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/"); // this says that if the req contains a file (req.file) then store the file.path as the imageUrl. We had to use the 'replace()' function because it stores the filepath with a \\ which does not work in Windows. So we have to replace the '\\' with '/'.
    }
    if (!imageUrl) { // says, if no (!) imageUrl is found then throw an error.
        const error = new Error('No file picked.');
        error.statusCode = 422; // status code 422=validation failure.
        throw error; // this 'throw' will exit the 'createPost' function and try to reach the next error handling function or error handling middleware provided in the express application ('app.js' I think). 
    }
// after all the above validation checks, if everything is valid, we then update it in the database.
    Post.findById(postId)
    .then(post => {
        if (!post) { // says if no (!) post, do the following lines.
            const error = new Error('Could not find post.');
            error.statusCode = 404; // 404 means 'not found'.
            throw error; // we can use 'throw' here and not 'next' because the 'throw' will simply pass the error to our .catch block.
        }
        if (imageUrl !== post.imageUrl) { // says, if the imageUrl is not (!) the same as post.imageUrl then run clearImage which is defined below as a const.
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({ message: 'Post updated!', post: result }); // sends a response status 200=success along with some json that has a message and the result of our post which is shown in the Browser Console.
    })
    .catch(err => {
        if (!err.statusCode) { // checks for an error statusCode and if no (!) code then is sets a 500 server error.
            err.statusCode = 500;
        }
    next(err); // if there is an err statusCode it sends it to the 'next' err handler which is our catch-all middleware in app.js.
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId; // pulls our postId from params with a request.
    Post.findById(postId)  // uses the 'findById' function on our Post database to pull out the postId.
    .then(post => {
        if (!post) { // says if no (!) post, do the following lines.
            const error = new Error('Could not find post.');
            error.statusCode = 404; // 404 means 'not found'.
            throw error; // we can use 'throw' here and not 'next' because the 'throw' will simply pass the error to our .catch block.
        }
        // Check logged in user
        clearImage(post.imageUrl); // this removes the image associated with the post using our 'clearImage' function.
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        console.log("This is the result of our deletePost function. ->", result);
        res.status(200).json({ message: 'Deleted post.' }); // 200=success and this JSON object can be seen in the Browser Console.
    })
    .catch(err => {
        if (!err.statusCode) { // checks for an error statusCode and if no (!) code then is sets a 500 server error.
            err.statusCode = 500;
        }
    next(err); // if there is an err statusCode it sends it to the 'next' err handler which is our catch-all middleware in app.js.
    });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath); // uses the 'path' constructor and finds the path to our image. '..' means up one folder level.
    console.log("This is the file that was deleted. ->", filePath);
    fs.unlink(filePath, err => console.log("Err from 'clearImage' in the controllers/feed.js. (null means no error.) ->", err)); // uses the filesystem module (fs) to unlink() (which deletes the file) at the filePath
};