const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
    "fullUrl": {
        type: String,
        required: true,
        unique: true
    },
    "shortUrl": {
        type: String,
        required: true,
    },  
    "visits": {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model("urlModel", urlSchema);