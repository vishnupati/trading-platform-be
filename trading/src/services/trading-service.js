const { TradingRepository, PositionRepository } = require("../database");
const { FormateData } = require("../utils");
const { sendEmail } = require("./email");
const { getPrice } = require('../utils/price');
const redisClient = require('../database/redis-connection');

class TradingService {

    constructor() {
        this.tradRepository = new TradingRepository();
        this.posRepository = new PositionRepository();
    }

    async CreateOrder(orderInputs) {
        const { userId, symbol, type, side, quantity, price } = orderInputs;
        try {
            if (!['market', 'limit'].includes(type) || !['buy', 'sell'].includes(side) || quantity < 0.01 || (type === 'limit' && (!price || price <= 0))) {
                return FormateData({ success: false, message: 'Invalid input' });
            }

            const marketPrice = await getPrice(symbol, side);

            if (!marketPrice) return FormateData({ success: false, message: 'Invalid symbol' });

            const order = await this.tradRepository.CreateOrder({ userId: userId, symbol: symbol.toUpperCase(), type, side, quantity, price: type === 'limit' ? price : undefined });

            if (type === 'market') {
                order.price = marketPrice; // Override for exec
                await this.createOrUpdatePosition(userId, symbol.toUpperCase(), side, quantity, marketPrice);

                // Notification
                sendEmail({
                    to: 'vpatildar@gmai.com', // Fetch from User Service
                    subject: `Order Filled: ${symbol}`,
                    text: `Executed at ${marketPrice}, Qty: ${quantity}`,
                    html: `Executed at ${marketPrice}, Qty: ${quantity}`
                }).catch(err => FormateData('Email error:', err));
            }
            
            await order.save();
    
            try {
                await redisClient.setEx(`order:${order._id}`, 300, JSON.stringify(order));
            } catch (redisErr) {
                console.error('Redis error:', redisErr);
            }

            return FormateData(order);

        } catch (err) {
            return FormateData(err);
        }

    }
    // TODO: redis caching
    async getOrderByUserId(userId, page, limit) {
        try {
            const key = `order:${userId}`;
            let userOrder = await redisClient.get(key);
            let total = 0;

            if (!userOrder) {
            const skip = (page - 1) * limit;
            userOrder = await this.tradRepository.FindByUserId(userId, skip, limit);
            total = await this.tradRepository.CountOrders(userId);
            await redisClient.setEx(key, 300, JSON.stringify(userOrder));
        }
            return FormateData({
                order: userOrder,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (err) {
            throw new Error(err.message || 'Error fetching orders');
        }
    }
    async orderCancelById(userId, orderId) {
        try {
            const order = await this.tradRepository.FindOne({ _id: orderId, userId });

            if (!order || order.status !== 'pending') return FormateData({ success: false, message: 'Cannot cancel' });

            await this.tradRepository.UpdateOrderStatus(order._id, 'cancelled');

            await redisClient.del(`order:${orderId}`);
            return FormateData({
                success: true,
                message: 'Order cancelled successfully'
            });
        } catch (err) {
            return FormateData({ success: false, message: 'Server error' });
        }
    }

    async createOrUpdatePosition(userId, symbol, side, quantity, price) {
        let position = await this.posRepository.FindOne({ userId, symbol, status: 'open' });
        if (position && position.side !== side) {
            // Net opposite: Close/reduce
            if (quantity >= position.quantity) {
                position.realizedPnL = position.calculatePnL(price);
                position.status = 'closed';
                await position.save();
                const remaining = quantity - position.quantity;
                if (remaining > 0) {
                    position = await this.posRepository.CreatePosition({ userId, symbol, side, quantity: remaining, entryPrice: price, currentPrice: price });
                    await position.save();
                }
            } else {
                position.quantity -= quantity;
                position.realizedPnL += (position.calculatePnL(price) * (quantity / (position.quantity + quantity)));
                await position.save();
            }
            return;
        }

        if (position) {
            const totalQty = position.quantity + quantity;
            const avgPrice = ((position.entryPrice * position.quantity) + (price * quantity)) / totalQty;
            position.quantity = totalQty;
            position.entryPrice = avgPrice;
        } else {
            position = await this.posRepository.CreatePosition({ userId, symbol, side, quantity, entryPrice: price, currentPrice: price });
        }
        position.unrealizedPnL = position.calculatePnL(price);
        await position.save();
    }

    async getPositions(userId) {
        try {
            const key = `positions:${userId}`;
            let positions = await redisClient.get(key);
            let fromCache = false;
            
            if (!positions) {
                positions = await this.posRepository.Find({ userId, status: 'open' });
                // Update prices/P&L
                for (let pos of positions) {
                    const current = await getPrice(pos.symbol, pos.side);
                    pos.currentPrice = current;
                    pos.unrealizedPnL = pos.calculatePnL(current);
                    await pos.save();
                }
                await redisClient.setEx(key, 300, JSON.stringify(positions.map(p => p.toJSON())));
            } else {
                positions = JSON.parse(positions);
                fromCache = true;
            }

            return FormateData({ success: true,  positions , fromCache });
        } catch (err) {
           return FormateData({ success: false, message: 'Server error' , err});
        }
    }
}

module.exports = TradingService;
