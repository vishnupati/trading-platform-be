const { TradingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class TradingService {

    constructor(){
        this.repository = new TradingRepository();
    }
 

}

module.exports = TradingService;
