const express = require('express');
var router = require('./router/main');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

const app = express();

app.use(session({
    HttpOnly: true,
    secret: 'thisistoyproject',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}))
app.use(express.static('public'));//css 사용을 위해 추가
app.use(bodyParser.urlencoded({ extended: false })); //body-parser 사용
app.use('/',router);

//html 경로 설정
app.set('views',__dirname + '/views');
//화면 engine을 ejs 로 설정
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.listen(3000,function(){
    console.log("Server Success");
});