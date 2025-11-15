const mongoose = require("mongoose");

const SmsBatchSchema = new mongoose.Schema({
  name: { type: String, required: true }, 

  message: { type: String, required: true },

  total: { type: Number, default: 0 }, 
  sent: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model("SmsBatch", SmsBatchSchema);
