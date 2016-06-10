/*
 * other example:
 * http://stackoverflow.com/questions/16786182/how-to-get-browser-diagnostics
 */

(function( io ) {
	var socket = io('http://pitr.local:3002');

	var logOfConsole = [];

	var _log = console.log,
	_warn = console.warn,
	_error = console.error;

	window.console.log = function() {
		socket.emit('log', {method: 'log', time: new Date().getTime(), arguments: arguments});
		return _log.apply(console, arguments);
	};

	window.console.warn = function() {
		socket.emit('warn', {method: 'warn', time: new Date().getTime(), arguments: arguments});
		return _warn.apply(console, arguments);
	};

	window.console.error = function() {
		socket.emit('serror', {method: 'serror', time: new Date().getTime(), arguments: arguments});
		return _error.apply(console, arguments);
	};

	window.onerror = function(msg, url, line, column, errorObject) {
		socket.emit('werror', {method: 'error', time: new Date().getTime(), arguments : {message: msg, url: url, line: line, column: column, we: errorObject || 'none'}});
	};

	socket.on('message', function (data) {
		console.log(data.message);
	});
})( io )
