var io = require('socket.io')();
io.on('connection', function(socket){
	console.log("connection.");

	socket.emit('message',	{ hello: 'Connected!'});

	socket.on('message', function(data) {
		var documentDistance 
			= Math.abs(data.top - data.window.height - data.position.top);
		process.stdout.write(""
				+ " percentage complete: " 
				+ (documentDistance / data.document.height * 100)
				+ "\n"
				);
		//console.log(data);
	})
	/*
	function () { if(this[0])
		{
			var a,b,c={top:0,left:0}, d=this[0];
			return "fixed"===n.css(d,"position") ? b=d.getBoundingClientRect()
			: (a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html") 
				|| (c=a.offset())
					,c.top+=n.css(a[0],"borderTopWidth",!0)
					,c.left+=n.css(a[0],"borderLeftWidth",!0))
			, {
				top:b.top-c.top-n.css(d,"marginTop",!0)
				,left:b.left-c.left-n.css(d,"marginLeft",!0)
			}
	}
	}
	*/

});
io.listen(3000);