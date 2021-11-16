const express = require('express'); // we import express by requiring the express module
const bodyParser = require('body-parser'); // we import our 'body-parser' that we installed with npm install --save body-parser
const mongoose = require('mongoose'); // allows us to connect to MongoDB and use the functions to work with that database. 
const feedRoutes = require('./routes/feed'); // we import our feed routes to app.js so we can register our routes.

const app = express(); // we create our express app by executing express as a function express().

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>  (we don't use this method)
app.use(bodyParser.json()); // application/json (we use this method because we're parsing JSON data)

// The next middleware solves our CORS error problem. We use 'setHeader' to set a header for our response which json will send,
// We set a couple headers that will be added to our response header.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // with this header we set a wildcard '*' to allow all domains and URL's to access our node.js server. Normally you might want to limit this although in the case of a REST API, you may want everyone to have access.
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // // this header sets what methods we allow, you can limit or allow as many as you like. 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // these are headers our client may set on their request. You can use a wildcard '*' or limit them. Here we will allow 'Content-Type' and 'Authorization' headers.
    next(); // this 'next()' allows our code to continue past this point.
});

app.use('/feed', feedRoutes); // we forward any request starting with '/feed' to the feedRoutes file which is located in /routes/feed.js

// the next lines use Mongoose to connect to our database and start our server listening on port 8080.
// It connects and if successful starts listening, if there's an error the .catch block logs the error.
mongoose.connect('mongodb+srv://matt:L4sQRk6keymsprU6@cluster0.uxlfb.mongodb.net/messages?retryWrites=true&w=majority' // we use our database key and password and we create a new database called 'messages' (not 'shop' like before).
).then(result => {
    app.listen(8080); // we usually use 3000 but we're using it elsewhere in this project.
})
.catch(err => console.log("This error from mongoose.connect in app.js. ->", err));
