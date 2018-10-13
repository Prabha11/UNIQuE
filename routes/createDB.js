var express = require('express');
var router = express.Router();
var tapApi = require("tap-telco-api")

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://uniqueiddb:uniqueiddb1234@ds131763.mlab.com:31763/unique";

/* GET users listing. */
router.get('/', function(req, res, next) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        dbo.createCollection("users_table", function(err, res) {
            if (err) throw err;
            db.close();
        });
        dbo.createCollection("subscription_table", function(err, res) {
            if (err) throw err;
            db.close();
        });
        dbo.createCollection("msg_table", function(err, res) {
            if (err) throw err;
            db.close();
        });
        dbo.createCollection("id_table", function(err, res) {
            if (err) throw err;
            db.close();
        });
        dbo.createCollection("status_table", function(err, res) {
            if (err) throw err;
            db.close();
        });
        console.log("Database Created");
    });
    res.render('createDB', { title: 'Creating Database'});
})


module.exports = router;