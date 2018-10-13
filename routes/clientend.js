var express = require('express');
var router = express.Router();
var tapApi = require("tap-telco-api");

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('clientend', { title: 'Client'});
})

router.post('/subcribe',function (req, res) {
    
})

module.exports = router;