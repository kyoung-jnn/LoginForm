const express = require('express');
var router = express.Router();
var session = require('express-session');
const FileStore = require('session-file-store');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const low = require('lowdb'); //lowdb 사용
const bcrypt = require('bcrypt'); //bcrypt 사용하여 비밀번호 암호화
const FileSync = require('lowdb/adapters/FileSync'); //동기 방식으로 저장
const adapter = new FileSync('db.json'); //db.json 파일로 저장
const db = low(adapter);
db.defaults({users:[]}).write();

router.get('/login',function(req,res){
    console.log(req.params);
    res.render('login.html');
});

router.post('/login_process', function(req, res){
    var post = req.body;
    var userName = post.name;
    var userPwd = post.pwd;
    var user = db.get('users').find({name:userName}).value() /*db에서 데이터를 불러온다.*/;
    
    if(user){
        bcrypt.compare(userPwd, user.password, function(err,result){
            console.log(user);
            if(result){
                //userName == user.name && userPwd == user.password
                req.session.is_logined = true;
                req.session.save(function(){
                    console.log("login Success!");
                    res.redirect('/loginSuccess');
                });
            } else{ //비밀번호 틀렸을때
                console.log("logout Fail! / Wrong Password");
                res.redirect('/login');
            }
        })
    }else{ //db에 회원 정보가 없을때
        console.log("logout Fail! / No data on db");
        res.redirect('/login');
    }

    
});

router.get('/loginSuccess',function(req,res){
    res.render('loginSuccess.html');
})

router.post('/logout_process',function(req,res){
    console.log("logout Success!");
    req.session.destroy(function(err){
        res.redirect('/login');
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
    
    //예외처리 추가해야함
    if(pwd1 !== pwd2){
        res.status('401').send("different password");
    }else{
        bcrypt.hash(pwd1, 10, function(err, hash) {
            var user ={
                id:shortid.generate(),
                name:userName,
                email:userEmail,
                password:hash //비밀번호 암호화
            }
            db.get('users').push(user).write(); //lowdb를 이용하여 데이터베이스에 유저정보 저장
    
            console.log("register process complete");
            res.redirect('/login');
        });

     
    }
});

module.exports = router;
