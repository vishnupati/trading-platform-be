const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String,},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: { type: String, required: true },
  kyc: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'not_started'],
      default: 'not_started',
      index: true,
    },
    documents: [{
      type: {
        type: String,
        enum: ['passport', 'driving_license', 'national_id']
      },
      url: String,
    }],
    verifiedAt: Date,
    rejectionReason: String,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  salt: String,
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    currency: { type: String, default: 'USD' },
    transactions: [
      {
        type: {type: String, enum: ['deposit', 'withdrawal', 'trade'] },
        amount: Number,
        timestamp: Date,
        reference: String
      }
    ]
  },
  createdAt: { type: Date, default: Date.now }
},{
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
