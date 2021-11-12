const express = require('express'); // we import express by requiring the express module
const bodyParser = require('body-parser'); // we import our 'body-parser' that we installed with npm install --save body-parser
 
const feedRoutes = require('./routes/feed'); // we import our feed routes to app.js so we can register our routes.

const app = express(); // we create our express app by executing express as a function express().

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>  (we don't use this method)
app.use(bodyParser.json()); // application/json (we use this method because we're parsing JSON data)

app.use('/feed', feedRoutes); // we forward any request starting with '/feed' to the feedRoutes file which is located in /routes/feed.js

app.listen(8080); // we usually use 3000 but we're using it elsewhere in this project.