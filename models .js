const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  clickData: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String }
  }]
});

module.exports = mongoose.model('Url', urlSchema);