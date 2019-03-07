var fs = require('fs');
var output = fs.createWriteStream('./tmp/stdout.log');
var outputErr = fs.createWriteStream('./tmp/stderr.log');

var Console = require('console').Console;
var logger = new Console(output, outputErr);

logger.info("info");
logger.error("error");
logger.warn('warnning');
logger.log('log');
console.log('console.log');
console.error('console.error');

console.time('TEST');
var sum = 0;
for(var i=0; i<100000; i++){
    sum += i;
}
console.log(sum);
console.timeEnd('TEST');

var util = require('util');

process.on('exit', function(){
    console.log('exit event occur!!!');
})