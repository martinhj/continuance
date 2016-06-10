'esversion: 6';
var io = require('socket.io')();
userposition = {};
io.on('connection', function(socket){
	console.log("connection.");
	console.log(socket.client.conn.id);

	socket.emit('message',	{ hello: 'Connected!'});
	socket.broadcast.emit('message', { hello: 'test'});
	io.emit('message', { hello: 'new connection...'});

	socket.on('login', function(data) {
		console.log(data);
	});

	socket.on('message', function(data) {
		console.log(socket.client.conn.id);
		console.log(data);
	});


	/*
	 * saving position on scroll sent from page.
	 *
	 * { '1465282262454': 
   { page: 'http://pitr.local/~martinhj/syncScrolling/index.html',
     positionId: 'P31',
     containerId: 'lorem1',
     time: '2016-06-07T06:53:49.786Z',
     percentage: 73 }
	 */
	//userposition[]
	socket.on('saveposition', function(data) {

		if (userposition[Object.keys(data)] === undefined) {
			userposition[Object.keys(data)] = {};
		}
		userposition[Object.keys(data)][data[Object.keys(data)].page] = data[Object.keys(data)];
		/*
		console.log(new Date().getTime());
		console.log(data);
		*/
	});


	socket.on('getpositions', function(data) {
		console.log("sending positions...");
		if (data !== null) {
			console.log(data);
			console.log(userposition[data]);
			socket.emit('positions', userposition[data]);
		} else {
			socket.emit('positions', "no userid");
		}
	});
	
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
					data.articlePosition.top -
					data.articlePosition.window.height -
					data.articlePosition.position.top); var percentageComplete
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
	});
});
io.listen(3000);


const repl = require('repl');
var msg = 'message';

repl.start('> ').context.m = msg;
