var io = require('socket.io')();
io.on('connection', function(socket){
	console.log("connection.");
	/*
	console.log("^^^^^^^^^^\n");
	console.log(io);
	console.log("^^^^^^^^^^^");
	console.log("##########\n");
	console.log(socket);
	console.log("###########");
	*/
	console.log(socket.client.conn.id);

	socket.emit('message',	{ hello: 'Connected!'});
	socket.broadcast.emit('message', { hello: 'test'});
	io.emit('message', { hello: 'new connection...'});

	socket.on('message', function(data) {
		console.log(socket.client.conn.id);
		console.log(data);
	})
	socket.on('scroll', function(data) {
		var documentDistance 
			= Math.abs(data.top - data.window.height - data.position.top);
		var percentageComplete
			= documentDistance / data.document.height * 100;
		socket.broadcast.emit('position', percentageComplete);

		/*
		process.stdout.write(""
				+ " percentage complete: " 
				+ (documentDistance / data.document.height * 100)
				+ "\n"
				);
		*/
	})
});
io.listen(3000);