const path = require('path'); // imports the 'path' module which will construct accurate paths to folders regardless of the OS (Windows, Linus, Apple)
const express = require('express'); // we import express by requiring the express module
const bodyParser = require('body-parser'); // we import our 'body-parser' that we installed with npm install --save body-parser
const mongoose = require('mongoose'); // allows us to connect to MongoDB and use the functions to work with that database. 
const multer = require('multer'); // imports Multer into our app.js. Installed with npm install --save multer.

const feedRoutes = require('./routes/feed'); // we import our feed routes to app.js so we can register our routes.
const authRoutes = require('./routes/auth'); // we import our auth routes to app.js so we can register our routes.

const app = express(); // we create our express app by executing express as a function express().

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g,'_') + '-' + file.originalname); // we had to use replace() to replace all the colons in that Date()toISOString puts in there so it will work with Windows.
    }
});

// the next block of code creates our 'fileFilter' const which defines the file types we will accept
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png'  ||
        file.mimetype === 'image/jpg'  ||
        file.mimetype === 'image/jpeg'  ||
        file.mimetype === 'image/gif' 
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>  (we don't use this method)
app.use(bodyParser.json()); // application/json (we use this method because we're parsing JSON data)
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image') // this registers multer and fills it with a JavaScript object {} that contains our const's we defined above.
);
app.use('/images', express.static(path.join(__dirname, 'images'))); // Uses the 'static' method provided by Express and the 'path' module we imported above to create a path to our 'images' folder.

// The next middleware solves our CORS error problem. We use 'setHeader' to set a header for our response which json will send,
// We set a couple headers that will be added to our response header.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // with this header we set a wildcard '*' to allow all domains and URL's to access our node.js server. Normally you might want to limit this although in the case of a REST API, you may want everyone to have access.
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // // this header sets what methods we allow, you can limit or allow as many as you like. 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // these are headers our client may set on their request. You can use a wildcard '*' or limit them. Here we will allow 'Content-Type' and 'Authorization' headers which are used by the frontend.
    next(); // this 'next()' allows our code to continue past this point.
});

app.use('/feed', feedRoutes); // we forward any request starting with '/feed' to the feedRoutes file which is located in /routes/feed.js
app.use('/auth', authRoutes); // we forward any request starting with '/auth' to the authRoutes file which is located in /routes/auth.js

app.use((error, req, res, next) => { // this middleware executes whenever an error is thrown and forwarded with 'next'.
    console.log("This error was caught in our app.js error catching Middleware. It came from somewhere else. ->", error);
    const status = error.statusCode || 500; // it pulls the statusCode from the error and assigns it to const status. If it can't find an error it assigns 500 which is a server error.
    const message = error.message; // this property exists by default and holds the message you pass to the constructor of the error.
    const data = error.data; // retrieves the error from the data property
    res.status(status).json({ message: message, data: data }); // we send a response with the 'status' and also the 'message' saved in json format along with the 'data' of our original errors and passes them to the frontend where we view them in the Browser Console.
});

// the next lines use Mongoose to connect to our database and start our server listening on port 8080.
// It connects and if successful starts listening, if there's an error the .catch block logs the error.
mongoose.connect('mongodb+srv://matt:L4sQRk6keymsprU6@cluster0.uxlfb.mongodb.net/messages?retryWrites=true&w=majority' // we use our database key and password and we create a new database called 'messages' (not 'shop' like before).
).then(result => {
    app.listen(8080); // we usually use 3000 but we're using it elsewhere in this project.
})
.catch(err => console.log("This error from mongoose.connect in app.js. ->", err));
