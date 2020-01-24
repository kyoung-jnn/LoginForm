var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.render('login.html');
});
router.get('/register',function(req,res){
    res.render('register.html');
});

module.exports = router;
