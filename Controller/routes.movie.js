const express = require("express");
const movieModel = require("../Model/model.movie");
const multer = require("multer");
const path = require("path");
const movieRoutes = express.Router();

movieRoutes.use("/uploads", express.static(path.join(__dirname, "../uploads")));

movieRoutes.get("/form", (req, res) => {
    res.render("form");
})

const fileupload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid conflicts
    },
});

const uploadFields = multer({ storage: fileupload }).fields([
    { name: "poster", maxCount: 1 }, // Single file for poster
    { name: "bgPoster", maxCount: 1 }, // Single file for bgPoster
]);

movieRoutes.post("/addMovie", uploadFields, async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);

        // Validate uploaded files
        if (!req.files.poster || !req.files.bgPoster) {
            return res.status(400).json({ error: "Both poster and bgPoster files are required." });
        }

        // Validate request body
        if (!req.body.title ||
            !req.body.genre ||
            !req.body.format ||
            !req.body.duration ||
            !req.body.language ||
            !req.body.promoted ||
            !req.body.certificate ||
            !req.body.rating ||
            !req.body.releaseDate ||
            !req.body.discription) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        // Get file paths
        const poster = req.files.poster[0].path;
        const bgPoster = req.files.bgPoster[0].path;

        // Extract other fields
        const { title, genre, format, duration, language, promoted, certificate, rating, releaseDate, discription } = req.body;

        // Create and save the movie
        const movie = new movieModel({
            title,
            genre,
            format,
            duration,
            language,
            promoted,
            certificate,
            rating,
            releaseDate,
            discription,
            poster,
            bgPoster
        });

        const savedMovie = await movie.save();
        console.log(savedMovie);

        // Redirect to form after success
        res.redirect("form");
    } catch (error) {
        console.log("Movie Can Not Be Added.", error);
        res.status(500).send("Internal Server Error");
    }
});


movieRoutes.get("/about/:id", async (req, res) => {
    try {
        const movieId = req.params.id; // Get the movie ID from the URL
        const movie = await movieModel.findById(movieId); // Find the movie by ID

        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        console.log(movie);

        res.render("about", {
            movie,
            token: req.token || null,
        }); // Render the movie details page
    } catch (error) {
        console.log("Error fetching movie:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = movieRoutes;