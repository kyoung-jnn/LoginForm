const express = require('express');
const app = express();
var router = require('./router/main');

//html 경로 설정
app.set('views',__dirname + '/views');
//화면 engine을 ejs 로 설정
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use('/',router);
app.use(express.static('public'));//css 사용을 위해 추가

app.listen(3000,function(){
    console.log("Success");
});