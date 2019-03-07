var fs = require('fs');
process.on('exit',function(){
    console.log('process exit...');
});
fs.readdir('./',function(err,files){
    if(err){
        console.error('occur error');
        process.exit(1);
    }
    console.log('file list is ' + files);
});

var list = fs.readdirSync('./','utf8');
console.log('file list is ' + list);