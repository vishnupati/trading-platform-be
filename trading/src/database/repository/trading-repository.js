const mongoose = require('mongoose');
const { TradingModel } = require("../models");

class TradingRepository {

    async CreateOrder({ userId, symbol, type, side, quantity, price }) {
            const order = new TradingModel({
                userId,
                symbol,
                type,
                side,
                quantity,
                price,
                status: 'pending'
            });
    
            return order;
    }

    async FindById(id) {
        return await TradingModel.findById(id);
    }

    async FindByUserId(userId, skip, limit) {
        const orders = await TradingModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return orders;
    }

    async CountOrders(userId) {
        return await TradingModel.countDocuments({ userId });
    }

    async UpdateOrderStatus(orderId, status) {
        return await TradingModel.findByIdAndUpdate(orderId, { status }, { new: true });
    }

    async FindOne(query) {
        return await TradingModel.findOne(query);
    }

}

module.exports = TradingRepository;
