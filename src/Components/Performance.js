import mongoose from 'mongoose'
const PerformanceSchema = new mongoose.Schema({
    score: Number,
    total: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  });
const Performance = mongoose.model('Performance', PerformanceSchema);
export default Performance