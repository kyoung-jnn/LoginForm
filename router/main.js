const express = require('express');
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store');
var bodyParser = require('body-parser');

//lowdb 사용 
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync'); //동기 방식으로 저장
const adapter = new FileSync('db.json') //db.json 파일로 저장
const db = low(adapter)
db.defaults({users:[]}).write();


var authData={
    userName: "kyoung-jnn",
    userPwd: "1111"
};

router.get('/login',function(req,res){
    session.num = 1;
    res.render('login.html');
});

router.post('/login_process', function(req, res){
    var post = req.body;
    var userName = post.name;
    var userPwd = post.pwd;
    if(userName == authData.userName && userPwd == authData.userPwd){
        res.render('loginSuccess.html');
    }
});

router.get('/loginSuccess',function(req,res){
    res.render('loginSuccess.html');
})

router.get('/logout_process',function(req,res){
    console.log("logout Success!");
    //req.logout();
    req.session.save(function(){
        res.redirect('/login');
    })
})

router.get('/register',function(req,res){
    res.render('register.html');
});

router.post('/register_process', function(req, res){
    console.log("register_process!");
    // var post = req.body;
    // var userName = post.userName;
    // var userEmail = post.userEmail;
    // var pwd1 = post.pwd1;
    // var pwd2 = post.pwd2;
  
    // if(pwd1 !== pwd2){
    //   console.log("password wrong!");
    // }else{
    //   var user ={
    //     userName:userName,
    //     userEmail:userEmail,
    //     password:pwd1,
    //   }
    //     db.get('users').push(user).write(); //lowdb를 이용하여 데이터베이스에 유저정보 저장
    //     request.login(user,function(err){
    //     return response.redirect('/');
    //     })
    // }

    res.redirect('/login');

});

module.exports = router;
