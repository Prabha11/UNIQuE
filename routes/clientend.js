var express = require('express');
var router = express.Router();
var tapApi = require("tap-telco-api");

//var tadhack = require('./routes/ids/tadhack');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://uniqueiddb:uniqueiddb1234@ds131763.mlab.com:31763/unique";

/* GET users listing. */
router.get('/', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        var query = { user_type: "company" };
        dbo.collection("users_table").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.render('clientend', { title: 'client subscribe', "messages" : result, record_no : 1});
        });
    });
    //res.render('clientend', { title: 'Client'});
})

router.post('/subscribe',function (req, res,next) {
    var userName = req.body.username;
    var organization = req.body.organization;
    var type = req.body.type;
    console.log("got a subscription request from " + userName)

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        var myobj = {
            subscription_company:organization,
            subscription_by:userName,
            subscription_date:new Date(),
            subscription_type:type
        };
        dbo.collection("subscription_table").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });

        dbo = db.db("unique");
        var query = { user_email: userName };
        dbo.collection("users_table").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();

            var phone_no = result.user_phoneNo;

            /*tapApi.sms.requestCreator({applicationId : "APP_000101", password : "password"}).single("0768417354", "You were subscribed to "+organization, function(mtReq){
                tapApi.transport.createRequest({hostname: '127.0.0.1', port: 7000, path: '/sms/send'}, mtReq, function(request){
                    tapApi.transport.httpClient(request, function() {
                        console.log("Mt request send to subscriber" + mtReq)
                    })
                })
            });*/
        });
    });
/*
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        var query = { user_email: userName };
        dbo.collection("users_table").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();

            var phone_no = result.user_phoneNo;

            tapApi.sms.requestCreator({applicationId : "APP_000101", password : "password"}).single(phone_no, "You were subscribed to "+organization, function(mtReq){
                tapApi.transport.createRequest({hostname: '127.0.0.1', port: 7000, path: '/sms/send'}, mtReq, function(request){
                    tapApi.transport.httpClient(request, function() {
                        console.log("Mt request send to subscriber" + mtReq)
                    })
                })
            });
        });
    });*/

});

router.get('/tadhack', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        var query = {msg_from: "tadhack" , msg_to: "gihan" };
        dbo.collection("msg_table").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            //res.render('clientend', { title: 'client subscribe', "messages" : result, record_no : 1});
            res.render('ids/tadhack', { title: 'tadhack', "messages" : result});
        });
    });

})

module.exports = router;