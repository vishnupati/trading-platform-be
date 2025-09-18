const mongoose = require('mongoose');
const { PositionModel } = require("../models");

//Dealing with data base operations
class PositionRepository {

    async FindOne(filter) {
        let position = await PositionModel.findOne(filter);
        return await position 
     }


    async CreatePosition({ userId, symbol, side, quantity, entryPrice, currentPrice }){

        const position = new PositionModel({
            userId, symbol, side, quantity, entryPrice, currentPrice
        });
        return position;
    }

    async UpdatePosition(positionId, updateData) {
        return await PositionModel.findByIdAndUpdate(positionId, updateData, { new: true });
    }
   
    async FindById(id){
       return await PositionModel.findById(id);
    }

    async Find(filter){
        console.log('PositionRepository Find filter:', filter);
        return await PositionModel.find(filter).sort({ createdAt: -1 });
    }
    
}

module.exports = PositionRepository;
