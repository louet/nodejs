var fs = require('fs');

var is = process.stdin;
var os = fs.createWriteStream('./tmp/ouput.txt');

os.on('pipe', function(src){
    console.log('pipe event');
});

// exit 입력이 오면 파이프 연결 해제
is.on('data', (data) => {
    if(data.toString().trim() == 'exit'){
        console.log('exit occur');
        is.unpipe(os);
    }
});

is.pipe(os);