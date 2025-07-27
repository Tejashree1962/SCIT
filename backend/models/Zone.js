const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: Array, required: true }, // Array of [lat, lng]
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
