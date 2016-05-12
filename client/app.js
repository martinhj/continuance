var ioclient = require('socket.io-client')('http://localhost:3000');
var socket = ioclient.connect();


socket.on('message', function(data) {
	console.log("\n> " + data.hello)});