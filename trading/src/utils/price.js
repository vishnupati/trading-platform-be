const  redisClient = require('../database/redis-connection.js');

const DEFAULT_PRICES = {
  'EURUSD': { bid: 1.0850, ask: 1.0852 },
  'GBPUSD': { bid: 1.2650, ask: 1.2652 },
  'USDJPY': { bid: 149.80, ask: 149.82 },
  'AUDUSD': { bid: 0.6450, ask: 0.6452 }
};

  module.exports.getPrice = async (symbol, side) => {
  try {
    const key = `price:${symbol.toUpperCase()}`;
    let priceData = await redisClient.get(key);
    if (!priceData) {
      const defaultPrice = DEFAULT_PRICES[symbol.toUpperCase()];
      if (!defaultPrice) return(false);
      priceData = JSON.stringify(defaultPrice);
      await redisClient.setEx(key, 30, priceData); // 30s TTL
    }
    const { bid, ask } = JSON.parse(priceData);
    return side === 'buy' ? ask : bid;
  } catch (error) {
    console.error('Price fetch error:', error);
    throw error;
  }
};
