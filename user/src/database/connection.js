const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async() => {
console.log('DB_URL', DB_URL);
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.error('Error ============ ON DB Connection')
        console.log(error);
    }
 
};

 
