const express = require("express");
const authMiddleware = require("../Middleware/middleware");

const ticketRoutes = express.Router();

function requireAuth(req, res, next) {
    if (!req.token) {
        return res.redirect('/user/login');
    }
    next();
}

ticketRoutes.get("/buy", authMiddleware, requireAuth, (req, res) => {
    res.render("book-ticket", { token: req.token ,});
});

module.exports = ticketRoutes;