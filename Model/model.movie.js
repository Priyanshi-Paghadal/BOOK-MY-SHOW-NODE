const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    genre: [String],
    format: [String],
    duration: String,
    language: [String],
    promoted:String,
    certificate: String,
    rating: String,
    releaseDate: String,
    poster: String,
    bgPoster: String,
    discription: String
})

const movieModel = mongoose.model("MovieModel", movieSchema);

module.exports = movieModel;