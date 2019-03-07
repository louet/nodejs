var http = require('http');
var url = require('url');

var server = http.createServer((req, res) => {
    // url 분석
    var parsed = url.parse(req.url, true);
    var query = parsed.query;

    //start end
    var start = parseInt(query.start);
    var end = parseInt(query.end);

    if( !start || !end ){
        res.statusCode = 404;
        res.end('Wrong Parameter');
    }
    else{
        // 합계
        var result = 0;
        for(var i = start; i < end + 1; i++){
            result += i;
        }
        res.statusCode = 200;
        res.end('Result : ' + result);
    }
}).listen(3000);

// http://127.0.0.1:3000/count?start=1&end=100