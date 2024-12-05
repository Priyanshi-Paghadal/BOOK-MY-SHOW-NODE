const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.token = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, 'node');
        req.token = decoded;
        next();
    } catch (error) {
        console.error("Invalid token", error);
        req.token = null;
        next();
    }
}

module.exports = authMiddleware;