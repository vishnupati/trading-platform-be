const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  symbol: { type: String, required: true, uppercase: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  entryPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, required: true, min: 0 },
  unrealizedPnL: { type: Number, default: 0 },
  realizedPnL: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

positionSchema.methods.calculatePnL = function(currentPrice) {
  const multiplier = this.side === 'buy' ? 1 : -1;
  return (currentPrice - this.entryPrice) * this.quantity * multiplier;
};

module.exports = mongoose.model('Position', positionSchema);