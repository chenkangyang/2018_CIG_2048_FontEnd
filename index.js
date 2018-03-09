var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use('/static', express.static('static'));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(8081, function(){
    console.log("访问地址为：*8081");
});