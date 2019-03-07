function task1(cb){
    console.log('task1');
    cb(null,'task1 end');
}
function task2(cb){
    console.log('task2');
    cb(null,'task2 end');
}
function task3(cb){
    console.log('task3');
    cb(null,'task3 end');
}

// async module로 비동기 순차 제어
var async = require('async');
// => [result1, result2, result3] 배열 형태로 반환
async.series([
    function t1(callback){
        callback(null, 'result1');
    },
    function t2(callback){
        callback(null, 'result2');
    },
    function t3(callback){
        callback(null, 'result3');
    }],
    function(err, result){
    if(err){
        console.log('occur error!!');
        return;
    }
    console.log(result);
});

// 다음 task로 값 전달(함수 파라미터로 받음(갯수만큼))
async.waterfall([
    function t1(callback){
        callback(null, 'result1');
    },
    function t2(arg1, callback){
        callback(null, arg1, 'result2');
    },
    function t3(arg1, arg2, callback){
        callback(null, 'result is ' + arg1 + ' ' + arg2 + ' ' + 'result3');
    }],
    function(err, results){
        console.log(results);
    }
);

// 동시 실행
async.parallel([
    function t1(callback){
        callback(null, 'result1');
    },
    function t2(callback){
        setTimeout(function(){
            callback(null, 'result2');
        },300);
    },
    function t3(callback){
        callback(null, 'result3');
    }],
    function(err, result){
    if(err){
        console.log('occur error!!');
        return;
    }
    console.log(result);
});

// 콜렉션 동작
//async.each();

//promise
// ES6에 표준으로 추가됨
function taskPromise(sec, rej){
    console.log('taskPromise start');
    setTimeout(function(){
        console.log('taskPromise end');
        sec('success');
    }, 300);
}

function fullfill(result){
    console.log(result);
}
function reject(result){
    console.log(result);
}

new Promise(taskPromise).then(fullfill, reject);