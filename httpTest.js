var http = require('http');
var url = require('url');
var fs = require('fs');
// http 클라이언트
//http.request();

//바디 없이 보내기
//http.get();


// var server = http.createServer(function(req,res){
//     res.statusCode = 200;
//     res.statusMessage = 'okok';
//     res.setHeader('content-type','text/html');

//     res.write('<http><body><h1>hello!!!!</h1></body></http>');
//     res.end('bye');
// });

// 정적 파일 요청 -> 파일 체크 -> 상태 코드 ->
var server = http.createServer(function(req,res){
    fs.access('./cat.jpg', (err) => {
        if(err){
            res.statusCode = 404;
            res.end();
            return;
        }
        fs.readFile('./cat.jpg', (err, data) => {
            res.end(data);
        });
    })
});

server.listen(3000);