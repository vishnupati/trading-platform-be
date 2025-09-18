const express = require("express");
const cors = require("cors");
const path = require("path");
const { trading } = require("./api");
const helmet = require("helmet");

const { CreateChannel } = require("./utils");

module.exports = async (app) => {
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  trading(app);

  // error handling
};
