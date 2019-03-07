function fact(n){
    if(n<=1) return n;
    return n*fact(n-1);
}
for(var i=1; i<10; i++){
    console.log(i + "!= " + fact(i));
}

function fact2(n){
	var a = 1, b = 1, c = 1;
	if(n <= 2) return 1;
	for(var i=3; i<=n; i++){
		c = a + b;
		a = b;
		b = c;
	}
	return c;
}
for(var i=1; i<10; i++){
	console.log(i + " = " + fact2(i));
}

function myConcat(seperator){
	console.log(seperator);
	var s = "";
	for(var i=1; i<arguments.length; i++){
		s += arguments[i];
		if(i<arguments.length-1){
			s += seperator;
		}
	}
	return s;
}

console.log(myConcat("/","cat","dog","pig"));

function closure(){
	for(var i=0; i<3; i++){
		function s(){
			console.log(i);
		}
	}
}

console.log(closure());

