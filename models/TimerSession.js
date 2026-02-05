// MongoDB model for timer/stopwatch sessions
const mongoose = require('mongoose');

const timerSessionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['timer', 'stopwatch'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  laps: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimerSession', timerSessionSchema);
