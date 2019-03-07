// xml parsing modules
// libxmljs, xml-stream, xmldoc

// postman으로 날릴 데이터 sample
/*
<?xml version="1.0" encoding="UTF-8"?>
<movies>
  <movie>
    <title>아바타</title>
    <director>케케케</director>
  </movie>
  <movie>
    <title>꿍꿍이</title>
    <director>꿍꿍꿍</director>
  </movie>
</movies>
*/
var http = require('http');
var jstoxml = require('jstoxml');
var libxmljs = require('libxmljs');

var movieList = [
    {
        title : 'title', director : 'director'
    }
];
http.createServer(function (req, res) {
    if(req.method.toLowerCase() == 'post'){
        var buffer = '';
        req.on('data', function ( chunk) {
            console.log('chunk : ' + chunk);
            buffer += chunk;
        });
        req.on('end', function(){
            var xmldoc = libxmljs.parseXml(buffer);     // xml 파싱
            var children = xmldoc.root().childNodes();  // 자식 노드들 전부 파싱
            console.log('children : ' + children.length);
            children.forEach((node, index) => {
                console.log("node : " + node.type() + ' ' + node);
                if(node.type() == 'element'){   // text, element 두 가지 존재. element인 경우 자식 노드 존재
                    var title = node.get('title').text();
                    var director = node.get('director').text();

                    movieList.push({
                        title : title, director : director
                    });
                }
            });
            // var title = xmldoc.get('/movie/title').text();
            // var director = xmldoc.get('/movie/director').text();
            // movieList.push({
            //     title : title, director : director
            // });

            res.writeHead(200, {'Content-Type':'application/xml'});
            // res.end(JSON.stringify({result : 'success'}));
            res.end(jstoxml.toXML(movieList));
        });
    }
    else {
        var result = {
            count : movieList.length,
            data : movieList
        }
        res.writeHead(200, {'Content-Type':'application/xml'});
        res.end(jstoxml.toXML(result));
    }
}).listen(3000);