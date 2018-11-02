var express = require('express');
var router = express.Router();
var proxy = require("../controllers/ProxyController.js")(db);
var db;

// restrict index for logged in user only

// route for register action
router.post('/register', proxy.register);

// route for unregister action
router.post('/unregister', proxy.unregister);

router.get('/domains', proxy.getDomains);

module.exports = function(db) {
  this.db = db;
  return router;
};