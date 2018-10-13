var yeast = require('yeast');

const util = require('util');

var express = require('express');
var router = express.Router();
var tapApi = require("tap-telco-api");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var feedbackManager = require('./../backend_manager').feedbackRepo;

feedbackManager.saveToRepo({key : "1", message : "Very good mocha", mobileNo:"tel:8928272828", date : new Date()});
feedbackManager.saveToRepo({key : "2", message : "Very good latte", mobileNo:"tel:8128272828", date : new Date()});
feedbackManager.saveToRepo({key : "3", message : "Very good espresso", mobileNo:"tel:8898272828", date : new Date()});


/* GET users listing. */
router.get('/', function(req, res, next) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("unique");
        var query = { msg_to: "shehan" };
        dbo.collection("msg_table").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.render('community', { title: 'Community', "messages" : result, record_no : 1});
        });
    });

    // feedbackManager.getAll(function(result){
    //     console.log(result);
    //     res.render('community', { title: 'Community', feedback : result, record_no : 1})
    // })
});

router.post('/send',
    function(req, res, next) {
        res.redirect("/community")
        next()
    },
    function(req, res){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("unique");
            var myobj = { msg_from: "tadhack", msg_to: "gihan", msg_body: req.body.messageInput, msg_date: new Date()};
            dbo.collection("msg_table").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 msg inserted to all subscribers");
                db.close();
            });
        });

        tapApi.sms.requestCreator({applicationId : "APP_000101", password : "password"}).broadcast(req.body.messageInput, function(mtReq){
            tapApi.transport.createRequest({hostname: '127.0.0.1', port: 7000, path: '/sms/send'}, mtReq, function(request){
                tapApi.transport.httpClient(request, function() {
                    console.log("Mt request send to subscriber" + mtReq)
                    console.log(util.inspect(mtReq.destinationAddresses, {showHidden: false, depth: null}))
                })
            })
        })}
);

router.post('/subscription', function(req, res){
    console.log("Subscription notification " + req.body.subscriberId)

    res.send(tapApi.subscription.subscriptionNotificationResponse)
});

//recive msg
router.post('/sms',
    function(req, res, next) {
        res.send(tapApi.sms.successResponse);
        next()
    },
    function(req, res, next){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("unique");
            var myobj = { msg_from: req.body.sourceAddress, msg_to: "shehan", msg_body: req.body.message, msg_date: new Date()};
            dbo.collection("msg_table").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 msg inserted");
                db.close();
            });
        });

        feedbackManager.saveToRepo({key: yeast(), message:req.body.message, mobileNo:req.body.sourceAddress, date:new Date()})
        next()
    },
    function(req, res){
        tapApi.sms.requestCreator({applicationId : "APP_000101", password : "password"}).single(req.body.sourceAddress, "Thanks for your feedback.", function(mtReq){
            tapApi.transport.createRequest({hostname: '127.0.0.1', port: 7000, path: '/sms/send'}, mtReq, function(request){
                tapApi.transport.httpClient(request, function() {
                    console.log("Mt request send to subscriber" + mtReq)
                })
            })
        })}
);

module.exports = router;