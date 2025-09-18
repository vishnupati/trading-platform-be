const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TradingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['market', 'limit'], required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: function() { return this.type === 'limit'; } },
  status: { type: String, enum: ['open', 'filled', 'cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  filledAt: Date
});

module.exports =  mongoose.model('trading', TradingSchema);