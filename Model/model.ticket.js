const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

})

const movieModel = mongoose.model("tickets",ticketSchema);

module.exports = movieModel;