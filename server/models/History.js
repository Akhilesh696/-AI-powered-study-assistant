const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['summary', 'chat'],
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    note: String,
    summary: String,
    context: String,
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    response: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.History || mongoose.model('History', historySchema);
