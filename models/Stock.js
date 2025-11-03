const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  likes: { type: Number, default: 0 },
  ipHashes: { type: [String], default: [] }, // store hashed IPs for privacy
});

module.exports = mongoose.model("Stock", stockSchema);
