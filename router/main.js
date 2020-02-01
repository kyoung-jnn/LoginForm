const express = require('express');
var router = express.Router();
var session = require('express-session');
const FileStore = require('session-file-store');
const bodyParser = require('body-parser');
const low = require('lowdb'); //lowdb 사용
const FileSync = require('lowdb/adapters/FileSync'); //동기 방식으로 저장
const adapter = new FileSync('db.json') //db.json 파일로 저장
const db = low(adapter)
db.defaults({users:[]}).write();

router.get('/login',function(req,res){
    res.render('login.html');
});

router.post('/login_process', function(req, res){
    var post = req.body;
    var userName = post.name;
    var userPwd = post.pwd;
    var user;
    
    if(user = db.get('users').find({name:userName}).value() /*db에서 데이터를 불러온다.*/){
        console.log(user);
        if(userName == user.name && userPwd == user.password){
            req.session.is_logined = true;
            req.session.save(function(){
                res.redirect('/loginSuccess');
            });
        } else{ //비밀번호 틀렸을때
            res.redirect('/login');
        }
    }else{ //db에 회원 정보가 없을때
        res.redirect('/login');
    }

    
});

router.get('/loginSuccess',function(req,res){
    res.render('loginSuccess.html');
})

router.post('/logout_process',function(req,res){
    console.log("logout Success!");
    req.session.destroy(function(err){
        res.redirect('/loginSuccess');
    })
})

router.get('/register',function(req,res){
    res.render('register.html');
});

router.post('/register_process', function(req, res){
    var post = req.body;
    var userName = post.userName;
    var userEmail = post.userEmail;
    var pwd1 = post.pwd1;
    var pwd2 = post.pwd2;
    
    //예외처리 추가
    if(pwd1 !== pwd2){
        res.status('401').send("different password");
    }else{
        var user ={
          name:userName,
          email:userEmail,
          password:pwd1 //    비밀번호 암호화 해야함
        }
        db.get('users').push(user).write(); //lowdb를 이용하여 데이터베이스에 유저정보 저장

        console.log("register process complete");
        res.redirect('/login');
    }
});

module.exports = router;
