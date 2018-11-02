
var mongoose = require("mongoose");
var User = require("../models/User");
var Domain = require("../models/Domain");


var proxyController = {};

proxyController.register = function (req, res) {
    //put in database
    var query = req.query;
    new Domain({
        subdomain: query.subdomain,
        port: query.port,
        deleted: false,
        deletable: true,
        registered: false
    }).save(function (err, domain) {
        if (err)
            res.json({ status: err });
        else
            res.json({ status: "success" });
    })

};

proxyController.unregister = function (req, res) {
    //set in database
    var query = req.query;
    console.log(query);
    Domain.findByIdAndUpdate(query._id, { $set: { deleted: true } }, { new: true }, (err, todo) => {
        if (err) {
            console.log("error: " + err);
            return res.status(500).send(err);
        }
        return res.json({ status: "success" });
    })
};

proxyController.getDomains = function (req, res) {
    //get all domains from database
    Domain.find(function (err, domains) {
        console.log("running");
        if (err) {
            res.json({ status: err });
        }
        else
            res.json({ status: "success", message: domains });
    })
};
module.exports = proxyController;