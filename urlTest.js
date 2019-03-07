var url = require('url');
var queryString = require('querystring');
var urlStr = 'http://www.google.com/search?a=fnifnief&b=neifenif&c=';

var parsed = url.parse(urlStr);
var query = queryString.parse(parsed.query);
console.log(parsed);
console.log(query);