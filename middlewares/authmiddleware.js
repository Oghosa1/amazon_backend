const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for JWT functionality

// Define the authentication middleware function
const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the 'x-auth-token' header
        const token = req.header('x-auth-token');

        // Check if the token exists
        if (!token)
            // If no token is provided, return a 401 Unauthorized status with an error message
            return res.status(401).json({msg: 'No token provided, access denied'});

        // Verify the token using the 'passwordKey' secret
        const isVerified = jwt.verify(token, 'passwordKey');

        // If the token is not verified, return a 401 Unauthorized status with an error message
        if (!isVerified) return res.status(401).json({msg: 'No token provided, access denied'});

        // If the token is valid, attach the user ID from the token to the request object
        req.user = isVerified.id;
        req.token = token;

        // Call the next middleware in the chain
        next();

    } catch (e) {
        // If any error occurs during the process, return a 500 Internal Server Error status with the error message
        res.status(500).json({error: e.message});
    }
}

// Export the authMiddleware middleware function to be used in other modules
module.exports = authMiddleware;