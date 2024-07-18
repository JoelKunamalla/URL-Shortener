const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
    apiKey: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true }
});

module.exports = mongoose.model("ApiKey", apiKeySchema);
