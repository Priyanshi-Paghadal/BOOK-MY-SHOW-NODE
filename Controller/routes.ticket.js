const express = require("express");

const ticketRoutes = express.Router();

ticketRoutes.get("/buy", (req, res) => {
    res.render("book-ticket");
})

module.exports = ticketRoutes;