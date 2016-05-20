var io = require('socket.io')();
io.on('connection', function(socket){
	console.log("connection.");
	console.log(socket.client.conn.id);

	socket.emit('message',	{ hello: 'Connected!'});
	socket.broadcast.emit('message', { hello: 'test'});
	io.emit('message', { hello: 'new connection...'});

	socket.on('message', function(data) {
		console.log(socket.client.conn.id);
		console.log(data);
	})

	/*
	 * external state change.
	 */
	
	/*
	 * reflect the data package so if there is video scroll it will still work
	 * just attach .video to the data-object.
	 */
	socket.on('statechange', function(data) {
		var documentDistance
			= Math.abs(
					data.articlePosition.top
					- data.articlePosition.window.height
					- data.articlePosition.position.top);
		var percentageComplete
			= documentDistance / data.articlePosition.document.height * 100;
		// console.log(data.title);
		// needs to send out the data package insted. Cache, only send changes?
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