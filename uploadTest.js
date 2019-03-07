var fs = require('fs');
var pathUtil = require('path');

//업로드 된 파일 경로
var uploadDir = __dirname + '/upload';

// 이미지 파일 경로
var imageDir = __dirname + '/image';

var http = require('http');
var formidable = require('formidable');

// 업로드 된 데이터 목록
var uploadList = [];

var server = http.createServer((req, res) => {
    console.log('url : ' + req.url);
    console.log('type : ' + req.method.toLowerCase());
    // 루트 경로로 요청
    if(req.url == '/' && req.method.toLowerCase() == 'get'){
        showList(res);
    }

    // <img> 태그로 요청된 것 처리
    else if(req.method.toLowerCase() == 'get' && req.url.indexOf('/image') == 0){
        var path = __dirname + req.url;
        res.writeHead(200, {'Content-Type' : 'image/jpeg'});
        fs.createReadStream(path).pipe(res);
    }

    // 업로드 요청
    else if(req.method.toLowerCase() == 'post'){
        addNewImage(req, res);
    }
});


function showList(res){
    console.log('showlist(res)');
    res.writeHead(200, {'Content-Type' : 'text/html'});

    var body = '<html>';
    body+='<head><meta charset="UTF-8"></head>';
    body+='<body>';
    body+='<h3>Favorite images</h3>';
    body+='<ul>';
    
    uploadList.forEach((item, index) => {
        body+='<li>';
        if(item.image){
            body+='<img src="' + item.image + '" style=height:200pt"/>';
        }
        body+=item.title;
        body+='<li>';
    });
    body+='</ul>';

    body+='<form action="." encType="multipart/form-data" method="post">' +
            '<div><label>작품 이름 : </label><input type="text" name="title"></div>' +
            '<div><label>작품 이미지 : </label><input type="file" name="image" value="작품 파일 선택"></div>' +
            '<input type="submit" value="upload">' +
            '</form>';
    body+='</body></html>';

    res.end(body);
}

server.listen(3000, () => {
    console.log('server is running on port 3000');
});

function addNewImage(req, res){
    var form = formidable.IncomingForm();
    form.uploadDir = uploadDir;

    form.parse(req, (err, fields, files) => {
        var title = fields.title;
        var image = files.image;

        console.log('upload image information');
        console.log(image);
        // 새로 저장할 이미지 방식(시간 이용한 이름)
        var date = new Date();
        var newImageName = 'image_' + date.getHours() + date.getMinutes() + date.getSeconds();
        var ext = pathUtil.parse(image.name).ext;
        // 새로운 경로 및 파일 확장자까지
        var newPath = __dirname + '/image/' + newImageName + ext;
        // 새로운 경로로 이미지 복사
        fs.renameSync(image.path, newPath);
        console.log('new path : ' + newPath);

        var url = 'image/' + newImageName + ext;

        var info = {
            title : title, image : url
        };

        uploadList.push(info);

        res.statusCode = 302;
        res.setHeader('Location','.');
        res.end('success');
    });
}