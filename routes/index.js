var express = require('express');
var router = express.Router();
var proxyCont = require("../controllers/ProxyController.js");


// restrict index for logged in user only

// route for register action
router.post('/register', proxyCont.register);

// route for unregister action
router.post('/unregister', proxyCont.unregister);

router.get('/domains', proxyCont.getDomains);

module.exports = router;