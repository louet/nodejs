var http = require('http');

var movieList = [
    {
        title : 'title', director : 'director'
    }
];

http.createServer(function (req, res) {
    if(req.method.toLowerCase() == 'post'){
        var buffer = '';
        req.on('data', function ( chunk) {
            buffer += chunk;
        });

        req.on('end', function(){
            var parsed = JSON.parse(buffer);
            var titleData = parsed.title;
            var directorData = parsed.director;

            movieList.push({
                title : titleData, director : directorData
            });
            res.writeHead(200, {'Content-Type':'application/json'});
            // res.end(JSON.stringify({result : 'success'}));
            res.end(JSON.stringify(movieList));
        });
    }
    else {
        var result = {
            count : movieList.length,
            data : movieList
        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(result));
    }
}).listen(3000);