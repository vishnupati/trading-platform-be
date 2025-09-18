const { User_SERVICE } = require("../config");
const TradingService = require("../services/trading-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new TradingService();

  app.post('/api/orders', UserAuth, async (req, res) => {
    const { symbol, type, side, quantity, price } = req.body;
    const userId = req.user._id;

    try {
      const data = await service.CreateOrder({ userId, symbol, type, side, quantity, price });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get('/api/user/orders', UserAuth, async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const result = await service.getOrderByUserId(userId, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  });

  app.patch('/api/order-cancel/:id', UserAuth, async (req, res) => {
    const userId = req.user._id;
    const orderId = req.params.id;
    try {
      const data = await service.orderCancelById(userId, orderId);
      return res.status(200).json(data);

    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // GET /api/positions
  app.get('/api/positions', UserAuth, async (req, res) => {
      const userId = req.user._id;
      try {
      const data = await service.getPositions(userId);
      return res.status(200).json(data);

    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }

});
};
