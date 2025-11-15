const mongoose = require("mongoose");

const BulkSmsJobSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "SmsBatch", required: true },

  contactId: { type: mongoose.Schema.Types.ObjectId, required: true },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "processing", "sent", "failed"],
    default: "pending"
  },

  error: { type: String },
  attempts: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BulkSmsJobSchema.index({ status: 1, batchId: 1 });

module.exports = mongoose.model("BulkSmsJob", BulkSmsJobSchema);
