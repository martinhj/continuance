// kill -19 `ps aux|grep -v grep |grep "node reloader.js" |awk '{print $2}'` 
(function() {
	var socket = io('http://pitr.local:3001');
	socket.on('reload', function () {
		console.log('Reloading...');
		location.reload();
	});
})()
