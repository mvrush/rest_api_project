const jwt = require('jsonwebtoken'); // we bring in jsonwebtoken which we installed with npm install --save jsonwebtoken

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization'); // gets our Authorization header from the frontend so we can verify that there is one.
    if (!authHeader) { // if there is no (!) authHeader then we run this error block.
        const error = new Error('Not Authenticated');
        error.statusCode = 401; // means not authenticated
        throw error; // throws it back to the app.js error handler.
    }
    const token = authHeader.split(' ')[1]; // we use 'get' to get our 'Authorization' header from the front end. We then split it on the whitespace we programmed on the frontend and it gets the 2nd value in the array at index [1].
    let decodedToken; // this variable will be filled below in the try block.
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');  // verify() both decodes and verifies that the token is valid.
    } catch (err) { // if there's an error with verifying our token it catches the error.
        err.statusCode = 500; // 500 means server error
        throw err; // this throw will throw it back to the app.use(error) block in app.js.
    }
    if (!decodedToken) { // if there is no decoded token we run this block.
        const error = new Error('Not Authenticated.');
        error.statusCode = 401; // means not authenticated
        throw error; // this throw will throw it back to the app.use(error) block in app.js.
    }
    req.userId = decodedToken.userId; // we can pull our userId out of the decoded token and store it as a request.
    next(); // we then simply forward the request (req) that holds our userId.
};