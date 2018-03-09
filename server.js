var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/static', express.static('static'));

var gridInformations = {
    isGridUpdate: false, 
    isDirectionUpdate: false,
    grid: [],
    direction: {}
};
/* 
/next_direction 接口文档
功能：res接收direction请求，send出去，让前端访问

例子：java程序请求该接口时，在url中加入参数dir = 37、38、39、40
我们用ajax模拟java程序发送的请求
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://127.0.0.1:8081/next_direction?dir=38', true);
xhr.send()
之后，前端请求接口中的方向信息：
var obj = ajax('http://127.0.0.1:8081/next_direction',function(data){
	console.log(data);
	console.log(typeof(data));
},function(){},'GET')
输出
    {"dir ":" 37"}
    string
*/
app.get('/next_direction', function (req, res) {
    // console.log(req.query);
    if(Object.keys(req.query).length == 0){  //下一次前端get接口数据的时候，query为空，以此作为前端请求方向的判断依据
        gridInformations.isDirectionUpdate = true;
        // res.send(gridInformations); //send给前端, 此时isDirectionUpdate = true
        var timer = setTimeout(function(){
            res.send(gridInformations);
        }, 10000);
    }else{ //接口收到请求，更新接口内容
        gridInformations.direction = req.query;
        gridInformations.isGridUpdate = false;
        gridInformations.isDirectionUpdate = true;
        res.send(gridInformations);
    }   
});

/* 
current_status接口文档：
功能：若收到POST请求，则对外提供当前棋盘信息，立即请求 /next_direction 获得方向，执行dom渲染
    （由于dom渲染时间远小于请求传输的时间，所以这里收到请求之前，dom已经渲染完毕，可以默认为isGridUpdate为true）
    收到老师java程序向 /current_status 发送的post请求之后，
    老师在responseText中取得棋盘数据(string类型--{"status":[[4,0,0,0],[0,0,0,0],[2,0,0,0],[0,0,0,0]]})
前端模拟post请求接口数据
var obj = ajax('http://127.0.0.1:8081/current_status',function(data){
	console.log(data);
	console.log(typeof(data));
},function(){},'POST')

输出：{"status":[[4,0,0,0],[0,0,0,0],[2,0,0,0],[0,0,0,0]]})
        string
*/
app.post('/current_status', function(req,res){
    console.log(req.body);
    console.log("类型:" + typeof(req.body));
    gridInformations.grid = req.body.status;
    gridInformations.isGridUpdate = true;
    gridInformations.isDirectionUpdate = false;
    res.send(gridInformations);
});

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("访问地址为：%s: %s",host,port);
});

