// THIS IS OUR POST.JS MODEL
const mongoose = require('mongoose'); // we require the 'mongoose' package to manage our database
const Schema = mongoose.Schema; // we extract the schema constructor from mongoose and assign it to the 'Schema' const.

// we then use the above constants to create a new database schema for our posts
const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creator: {
            type: Object,
            required: true
        }
    },
    { timestamps: true } // mongoose will add a timestamp every time a new object is added or updated in the database.
);

module.exports = mongoose.model('Post', postSchema); // we export a model based on the schema. We name our model 'Post' which creates a 'Post' database (renamed 'posts' by MongoDB) and we export our 'postSchema' defined above. This export is used in the conrtollers/feed.js