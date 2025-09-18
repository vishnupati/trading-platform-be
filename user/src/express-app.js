const express = require('express');
const cors  = require('cors');
const { user } = require('./api');
const helmet = require('helmet');

module.exports = async (app) => {

    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));
    
    //api
    user(app);

}
