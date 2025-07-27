const Zone = require('../models/Zone');

// @desc Create a zone
exports.createZone = async (req, res) => {
  const { name, coordinates } = req.body;

  try {
    const zone = await Zone.create({ name, coordinates });
    res.status(201).json(zone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
