const mongoose = require('mongoose');
const { TradingModel } = require("../models");

//Dealing with data base operations
class TradingRepository {


    async CreateProduct({ name, desc, type, unit,price, available, suplier, banner }){

        const product = new TradingModel({
            name, desc, type, unit,price, available, suplier, banner
        })

    //    return await TradingModel.findByIdAndDelete('607286419f4a1007c1fa7f40');

        const productResult = await product.save();
        return productResult;
    }


     async Products(){
        return await TradingModel.find();
    }
   
    async FindById(id){
        
       return await TradingModel.findById(id);

    }

    async FindByCategory(category){

        const products = await TradingModel.find({ type: category});

        return products;
    }

    async FindSelectedProducts(selectedIds){
        const products = await TradingModel.find().where('_id').in(selectedIds.map(_id => _id)).exec();
        return products;
    }
    
}

module.exports = TradingRepository;
