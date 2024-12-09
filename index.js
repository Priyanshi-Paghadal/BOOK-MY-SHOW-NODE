const express = require("express");
require('dotenv').config()
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
app.set("view engine", "ejs");
const port = process.env.PORT;

// const connection = require("./Connection/db");

mongoose.connect("mongodb+srv://paghadalpriyanshi097:priyanshi_123@cluster0.5a0tw.mongodb.net/Show", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("Connected to MongoDB via Mongoose!"))
.catch((err) => console.error("Connection error:", err));

const movieRoutes = require("./Controller/routes.movie");
const userRoutes = require("./Controller/routes.user");
const ticketRoutes = require("./Controller/routes.ticket");
const authMiddleware = require("./Middleware/middleware");
const movieModel = require("./Model/model.movie");

app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/movie", movieRoutes);
app.use("/user", userRoutes);
app.use("/ticket", ticketRoutes);

app.get('/', authMiddleware, async (req, res) => {
    let allMovies = await movieModel.find();
    console.log(allMovies);
    res.render("home", {
        movies: allMovies,
        token: req.token || null,
    });
})

app.listen(port, async () => {
    try {
        // await connection;
        console.log("Server is Running at port ", port);
    } catch (error) {
        console.log("Something Went Wrong ", error);
    }
})