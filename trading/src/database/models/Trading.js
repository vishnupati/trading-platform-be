const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TradingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  symbol: { type: String, enum:['EURUSD','GBPUSD','USDJPY','AUDUSD'], required: true, uppercase: true },
  type: { type: String, enum: ['market', 'limit'], required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  price: { type: Number, min: 0 },
  status: { type: String, enum: ['pending', 'filled', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports =  mongoose.model('trading', TradingSchema);