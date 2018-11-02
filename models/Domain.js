

module.exports = function (proxy) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var DomainSchema = new Schema({
        subdomain: String,
        port: Number,
        deleted: Boolean,
        deletable: Boolean
    });

    // DomainSchema.methods.register = function () {
    //     proxy.register(this.subdomain + ".the-allo.com", "http://localhost:" + this.port);
    // }
    // DomainSchema.methods.unregister = function () {
    //     proxy.unregister(this.subdomain + ".the-allo.com");
    // }
    return mongoose.model('Domain', DomainSchema);
}