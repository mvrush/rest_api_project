exports.getPosts = (req, res, next) => {
// this response is sent in json format. The json() function is built in and takes the JavaScript object {} and formats it as JSON with the correct headers etc.
    res.status(200).json({ // we have to be clear on our status codes so the client knows if there was an error or not. A 200 code means success.
        posts: [{ title: 'First Post', content: 'This is the first post!' }]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title; // we pull this from the body of the req the user sent which is in the form of JSON data
    const content = req.body.content; // we pull this from the body of the req the user sent which is in the form of JSON data
    // NOTE: we will create a post in our database at some point
    res.status(201).json({ // status 200 means success, status 201 means success AND we created a resource.
        message: 'Post created successfully!',
        post: { id: new Date().toISOString(), title: title, content: content }
    });
};