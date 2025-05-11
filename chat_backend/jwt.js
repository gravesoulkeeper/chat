/*
JWT TOKEN
id : user.id                            // holds the User schema id
username: user.name                     // holds the username of the user
relationId : decodeString(relation.id)  // holds the Relation schema id , but in the decoded form
*/


import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import dotenv from 'dotenv'
dotenv.config()

const jwtAuthMiddleware = (req, res, next) => {
    // Extract token from the Cookies 
    const token = req.cookies.token;
    // Extract the jwt token from the request header
    if (!token) {
        return res.status(401).send({ auth: false, error: 'Unauthorized User' });
    }

    try {
        // Verify the JWT token
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // Attach user information to the request object
        req.chatUser = decode
        // console.log("Authorization Successfull...")
        next()

    } catch (error) {
        console.error("Error in authorization...  \n", error);
        res.clearCookie("token");
        return res.status(401).json({ auth: false, error: 'Invalid token' })
    }
}

const socketAuthMiddleware = (socket, next) => {
    // Extract token from the Cookies 
    const cookies = socket.request.headers.cookie;
    const parsedCookies = cookie.parse(cookies || '');
    const token = parsedCookies.token;
    // console.log("Socket Token : ", token)
    if (!token) {
        return socket.disconnect(true);
    }

    try {
        // Verify the JWT token
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY) //{ expireIn: 60 * 60 }
        socket.chatUser = decode
        next()

    } catch (error) {
        console.error("Error in socket authorization...  \n", error);
        return next(new Error('Invalid token'));
    }
}

const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET_KEY)
}

export { jwtAuthMiddleware, socketAuthMiddleware, generateToken }