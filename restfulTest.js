// restful api

// postman으로 날릴 데이터 sample
/*
movieData.json
[
	{
      "id":0,
      "title":"아바타",
		"director":"제임스 카메론",
		"year":2009,
		"synopsis":"인류의 마지막 희망, 행성 판도라! 이 곳을 정복하기 위한 ‘아바타 프로젝트’가 시작된다! 가까운 미래, 지구는 에너지 고갈 문제를 해결하기 위해 머나먼 행성 판도라에서 대체 자원을 채굴하기 시작한다. 하지만 판도라의 독성을 지닌 대기로 인해 자원 획득에 어려움을 겪게 된 인류는 판도라의 토착민 ‘나비(Na’vi)’의 외형에 인간의 의식을 주입, 원격 조종이 가능한 새로운 생명체 ‘아바타’를 탄생시키는 프로그램을 개발한다."
	},
	{
      "id":1,
      "title":"스타워즈",
		"director":"조지 루카스",
		"year":1977,
		"synopsis":"평화롭던 은하계에서 타킨총독(피터 커슁)이 왕정에 저항하여 제국을 일으킨다. 타킨은 우주정거장인 죽음의 별을 완성하고 은하계의 작은 나라들을 점령하고자 한다. 그 정보를 입수한 반란군은 레아 공주(캐리 피셔)를 보내 죽음의 별 설계도를 입수하려고 하지만 공주는 타킨에게 잡힌다. 대신 공주는 도움을 요청하기 위해 제다이 기사 케노비(알렉 기네스)에게 로봇을 보낸다."
	},
	{
      "id":2,
      "title":"인터스텔라",
		"director":"크리스토퍼 놀란",
		"year":2014,
		"synopsis":"세계 각국의 정부와 경제가 완전히 붕괴된 미래가 다가온다. 지난 20세기에 범한 잘못이 전 세계적인 식량 부족을 불러왔고, NASA도 해체되었다. 이때 시공간에 불가사의한 틈이 열리고, 남은 자들에게는 이 곳을 탐험해 인류를 구해야 하는 임무가 지워진다. 사랑하는 가족들을 뒤로 한 채 인류라는 더 큰 가족을 위해, 그들은 이제 희망을 찾아 우주로 간다. 그리고 우린 찾을 것이다. 늘 그랬듯이…"
	}
]
*/
const http = require('http');
const fs = require('fs');

const data = fs.readFileSync('./movieData.json');
let movieList = JSON.parse(data);

http.createServer(function (req, res) {
    const method = req.method.toLowerCase();
    switch(method){
        // get 요청 처리 : 영화 목록 보기, 영화 상세정보 보기
        // 영화목록보기 /movies
        // 상세보기 /movies/1 or 2 or 3 ....
        case 'get' :
        handleGetRequest(req,res);
        break;
        // 영화 정보 추가 /movies
        case 'post' :
        handleSelectMethod(req, res);
        break;
        // 영화 정보 수정 /movies/1 or 2 ....
        case 'put' :
        handlePutRequest(req,res);
        break;
        // 영화 정보 삭제 /movies/1 or 2 or ...
        case 'delete' :
        handleDeleteRequest(req,res);
        break;
        default :
        res.statusCode = 404;
        res.end('error');
        break;
    }
}).listen(3000);

function handleSelectMethod(req, res){
    let url = req.url;
    let parsedUrl = url.split('/');
    console.log('url : ' + url);
    console.log('parsedUrl : ' + parsedUrl[2]);
    if(parsedUrl[1] == 'movies'){
        if(!parsedUrl[2]){
            handlePostRequest(req, res);
        }else if(parsedUrl[2] == 'put'){
            handlePutRequest(req, res);
        }else if(parsedUrl[2] == 'delete'){
            handleDeleteRequest(req,res);
        }
    }
}

function handleGetRequest(req, res){
    console.log('call handleGetRequest()');
    const url = req.url;
    let result = {};
    if(url == '/movies'){   // 전체 목록 출력
        //영화 목록 생성
        let movies = [];
        // 목록 정보와 메타 데이터 준비
        for(let i = 0; i< movieList.length; i++){
            let item = movieList[i];
            movies.push({
                id : item.id,
                title : item.title,
                director : item.director,
                year : item.year,
                synopsis : item.synopsis
            });
        }
        result = {
            count : movies.length,
            data : movies
        }
    }else{
        //영화 상세 정보 제공
        // url에서 id 찾기 /movies/1 or 2 ro 3 or ...
        const urlSplit = url.split('/');
        if(urlSplit[1] != 'movies' || typeof urlSplit[2] == Number){
            res.writeHeader(400, {'Content-Type':'text/html'});
            res.end('<h1>Not found</h1>');
        }
        const id = url.split('/')[2];
        movieList.forEach((item, index) => {
            if(item.id == id){
                result = item;
                return false;
            }
        });
    }
    //json 형태로 응답
    responseJsonData(res, result);
}

function handlePostRequest(req, res){
    console.log('call handlePostRequest()');
    let buffer = '';
    let result = {};
    //영화 목록 추가
    req.on('data', function(chunk){
        buffer += chunk;
    });
    req.on('end', function(){
        const parsed = JSON.parse(buffer);
        if(parsed.constructor == Object){   // {a:a, b:b} 단일 객체
            console.log('object');
            result = {id : movieList.length + 1, title : parsed.title, director : parsed.director,synopsis : parsed.synopsis};
            movieList.push(result);
        }else if(parsed.constructor == Array){  // [{a:a, b:b}] 배열형태
            console.log('array');
            for(let i=0; i< parsed.length;i++){
                result = {id : movieList.length + 1, title : parsed[i].title, director : parsed[i].director,synopsis : parsed[i].synopsis};
                movieList.push(result);
            }
        }
        fs.writeFile('./movieData.json',JSON.stringify(movieList),'utf8', (err) => {
            if(err){
                throw err;
            }
            console.log('saved data');
        });
        updateMovieList('./movieData.json', movieList, 'saved data');
        responseJsonData(res, result);
    });
}
// 수정 movies/put/1 or 2 or 3 ...
function handlePutRequest(req, res){
    console.log('call handlePutRequest()');
    let buffer = '';
    let result = {};
    //영화 목록 추가
    req.on('data', function(chunk){
        buffer += chunk;
    });
    req.on('end', function(){
        const parsed = JSON.parse(buffer);
        result = { id : parsed.id, title : parsed.title, director : parsed.director, synopsis : parsed.synopsis};
        for(let i=0; i<movieList.length; i++){
            let item = movieList[i];
            if(parsed.id == item.id){
                item.title = parsed.title;
                item.director = parsed.director;
                item.synopsis = parsed.synopsis;
                break;
            }
        }
        updateMovieList('./movieData.json',movieList,'putted data');
        responseJsonData(res, result);
    });
}

// 삭제 movies/delete/1 or 2 or 3 ...
function handleDeleteRequest(req, res){
    console.log('call handleDeleteRequest()');
    let buffer = '';
    let result = {};
    //영화 목록 추가
    req.on('data', function(chunk){
        buffer += chunk;
    });
    req.on('end', function(){
        const parsed = JSON.parse(buffer);
        result = { id : parsed.id, title : parsed.title, director : parsed.director, synopsis : parsed.synopsis};
        let count = 0;
        for(let i=0; i<movieList.length; i++){
            let item = movieList[i];
            if(parsed.id == item.id){
                movieList.splice(count,1);
                break;
            }
            count++;
        }
        updateMovieList('./movieData.json',movieList,'deleted data');
        responseJsonData(res, result);
    });
}

function updateMovieList(fileName, list, message){
    fs.writeFile(fileName,JSON.stringify(list),'utf8', (err) => {
        if(err){
            throw err;
        }
        console.log(message);
    });
}

function responseJsonData(res, result){
    res.writeHeader(200, {'Content-Type' : 'Application/json;charset:UTF-8'});
    res.end(JSON.stringify(result));
}