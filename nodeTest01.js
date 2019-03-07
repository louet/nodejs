var http = require('http');
var fs = require('fs');
var pathUtil = require('path');

var formidable = require('formidable');

var uploadDir = __dirname + '/upload';
var imageDir = __dirname + '/image';

var movieList = [];

var server = http.createServer((req, res) => {
    var reqType = req.method.toLowerCase();
    var url = req.url;
    console.log(url);
    if(reqType == 'get'){
        console.log('get request');
        if(url == '/'){
            showList(res);
        }else if(url.indexOf('/image') == 0){
            console.log('/image ' + url.indexOf('/image') + ' ' + url);
            var path = __dirname + req.url;
            res.writeHead(200, {'Content-Type' : 'image/jpeg'});
            fs.createReadStream(path).pipe(res);
        }
    }else if(reqType == 'post'){
        console.log('post request');
        addMovieInfo(req, res);
    }else{
        console.log('else request');
    };
});

// 영화 리스트 및 업로드 폼 보여주기
function showList(res){
    console.log('call showList()');

    var body = '<html>';
    body+='<head><meta charset="UTF-8"></head>';
    body+='<body>';
    body+='<h3>Favorite movies</h3>';
    body+='<ul>';

    movieList.forEach((item, index)=>{
        console.log('poster : ' + item.poster);
        body+='<li>';
        if(item.poster){
            body+='<img src="' + item.poster + '" style=height:70px;width:50px;"/>';
        }
        body+=' ' + item.title + '(' + item.director + ',' + item.year + ')';
        body+='</li>';
    });
    body += '</ul>';

    body += '<p>새 영화 입력</p>';
    body += '<form action="." encType="multipart/form-data" method="post">';
    body += '<div>영화 제목 : ' + '<input type="text" name="title"></div>' +
            '<div>영화 감독 : ' + '<input type="text" name="director"></div>' +
            '<div>영화 년도 : ' + '<input type="text" name="year"></div>' +
            '<div><input type="file" name="poster"></div>' +
            '<div><input type="submit" value="업로드"></div>';
            
    body+= '</form></body></html>';

    res.statusCode = 200;
    res.end(body);
}
function addMovieInfo(req, res){
    console.log('call addMovieInfo()');
    var form = formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        
        var date = new Date();
        var newName = 'image_' + date.getMilliseconds();
        var ext = pathUtil.parse(files.poster.name).ext;
        
        var newPath = __dirname + '/image' + pathUtil.sep + newName + ext;
        console.log(newPath);
        fs.renameSync(files.poster.path, newPath);
        var url = 'image/' + newName + ext;
        var info = {
            title : fields.title,
            director : fields.director,
            year : fields.year,
            poster : url
        }

        movieList.push(info);

        res.statusCode = 302;
        res.setHeader('Location','.');
        res.end();
    })
}
function copyUploadToImage(){
    console.log('call copyUploadToImage()');
}

server.listen(3000);