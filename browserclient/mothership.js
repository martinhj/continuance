console.log("loading...");
var io = io('http://pitr.local:3000');

io.on('update', function() {
});

//completeness
var loginInfo = {
	email: 'martinhj@gmail.com',
	type: 'mothership'
};

io.emit('login', loginInfo);

io.on('message', function(data) {
	console.log(data);
});

io.on('position', function(data) {
	console.log(data);
});
