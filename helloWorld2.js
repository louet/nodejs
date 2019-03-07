console.log('1');
var http = require('http');
console.log('2');
http.createServer(function(req, res){
    console.log('3');
    res.writeHead(200, {'Content-Type':'text/html'});
    console.log('4');
    res.end('<H1>Hello Node2</H1>');
    console.log('5');
}).listen(3000);
console.log('6');