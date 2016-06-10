var scroll = ( function ( $ ) {
	var lastIndex = 0;
	var stopIndex = 0;
	var countLimit = 25;
	/* should elements be an array of arrays? If it is an array it needs a
	 * methodology to clean up after finished following an element.  could also
	 * check if parent is in viewport. If not just check if next array's parent
	 * is in viewport.
	 */
	var elements = $( '#lorem1 p' ); // for testing only, should be null.
	//var inview = [];
	var hasScrolled = false;
	var oldScrollTop = 0;
	var intervalId; // only for debuging.

	var uid;
	window.uid = uid;
	
	var iv = {
		currentObject: {}, 
		setHasScrolled: function () {
			hasScrolled = true;
		},
		printHasScrollws: function () {
			console.log( hasScrolled );
		},
		setSelector: function ( selector ) {
			elements = $( selector );
		},
		getUid: function () {
			return uid;
		},
		check: function () {
			
			/*
			var scrollingUp = ($( 'body' ).scrollTop() - oldScrollTop < 0 );
			if ( scrollingUp ) {
				maxVar = 0;
			} else {
				maxVar = elements.length - 1;
			}
			if (maxVar == 0 && lastIndex == stopIndex) {
				lastIndex = elements.length - 1;
			} else if (maxVar == lastIndex.lenght - 1 &&
					lastIndex == elements.length -1) {
				lastIndex = 0;
			}
			
			var maxVar = elements.length || 0
				if maxVar == 0 and lastIndex == 0
				then lastIndex = elements.length - 1;
				else if maxVar == elements.length - 1 and lastIndex == elements.length -1
				then lastIndex = 0;
			*/
			//console.log( "elements.length: " + elements.length );
			if ( $.inviewport($('h1'), { threshold: 30 }) ) {
				console.log("testin hidden");
				$('.logo').addClass('hidden');
			} else {
				$('.logo').removeClass('hidden');
			}
			if ( lastIndex >= elements.length ) {
				lastIndex = 0;
			}
			if ( $( 'body' ).scrollTop() - oldScrollTop  < 0 ) {
				// this did not help...
				//console.log("going up...");
				//console.log(lastIndex == 0);
				if (lastIndex === 0) lastIndex = elements.length - 1;
				stopIndex = lastIndex + 1;
				lastIndex = lastIndex - countLimit > 0 ?
					lastIndex - countLimit : 0;
				// how to set lastIndex to elements.length - 1 after being run
				// one round down there?
				//console.log(lastIndex);
			} else {
				stopIndex = lastIndex + countLimit < elements.length ? lastIndex + countLimit : elements.length;
			}
			oldScrollTop = $( 'body' ).scrollTop();
			//console.log("lastIndex: " + lastIndex + " stopIndex: " + stopIndex);
			/* generalize this to a function. Needs to traverse the whole array
			 * at some time. fx. onload.
			 */
			for ( ; lastIndex < stopIndex; lastIndex++ ) {
				/* could test agains top of element to see if the whole element
				 * is in viewport instead of bottom just to see if some of the
				 * elment is in the viewport at all. This will create problems
				 * when an element is larger than the viewport.
				 * Maybe add some threshod?
				 */
				//console.log( $.inviewport( $( elements[ lastIndex ] ), { threshold:100 } ) );
				if ( $.inviewport( $( elements[ lastIndex ] ), { threshold:100 } ) ) {
					console.log( $( elements[ lastIndex ] ).attr( 'id' ) );
					if ( window.scrollCurrentObject.length !== "undefined" ) {
						window.scrollCurrentObject = $( elements[ lastIndex ] );
					}
					break;
				}
			}
			hasScrolled = false;
			//console.log("$$lastIndex: " + lastIndex + " stopIndex: " + stopIndex);
			/*
			console.log(inview);
			console.log(inview.length);
			console.log("so let's do this: " + lastIndex + " " + elements.length + ".");
			*/
			if ( window.scrollCurrentObject.length !== undefined ) {
				/*
				var teststring = "lastvisit=" + window.scrollCurrentObject.attr('id')
					+ "; expires=" + new Date(2020, 12, 31, 23, 59, 59, 59).toUTCString() + "; path=/"
					+ "; id=" + (uid ? uid : -1);

				console.log(teststring);
				*/
				document.cookie = "lastvisit=" + window.scrollCurrentObject.attr('id')
					+ "; expires=" + new Date(2020, 12, 31, 23, 59, 59, 59).toUTCString() 
					+ "; path=" + window.location.pathname;
				document.cookie = "uid=" + (uid ? uid : -1)
					+ "; expires=" + new Date(2020, 12, 31, 23, 59, 59, 59).toUTCString() + "; path=/";
			}
		},
		doonscroll: function () {
			if (typeof elements === 'object') {
				this.setHasScrolled();
			}
			//console.log($('.article p:in-viewport').first().next().attr('id'));
			//document.cookie = "lastvisit=" + $('.article p:in-viewport').first().next().attr('id');
		}
	};
	window.scrollCurrentObject = iv.currentObject;
	//window.check = iv.check; // exports to global namespace.
	//window.hasScrolled = iv.setHasScrolled;
	
	setTimeout( function () {
	iv.check();
	intervalId = setInterval( function() {
		if ( hasScrolled ) {
			iv.check();
		}
	}, 125 );
	}, 2000 );

	
	var oldonload = window.onload;
	window.onload = 
		(typeof window.onload != 'function') ? doonload
		: function () {
			oldonload();
			doonload();
		};

	var savedata = {
		/*
		id: {email: undefined,
		page: '',
		positionId: '',
		containerId: '',
		time: new Date(),
		percentage: 67}
		*/
	};
	// get id from cookie. should be stored in memory.
	setInterval(function () {
		if (uid === undefined) return;
		savedata[uid] = {
			email: undefined,
			page: '',
			positionId: '',
			containerId: '',
			time: new Date().getTime(),
			percentage: 67
		};
		savedata[uid].positionId = scrollCurrentObject.attr ? scrollCurrentObject.attr('id') : undefined;
		savedata[uid].containerId = scrollCurrentObject.attr ? scrollCurrentObject.parent().attr('id') : undefined;
		savedata[uid].page = window.location.hostname + window.location.pathname;
		//savedata[uid].page = window.location.href;
		savedata[uid].percentage = scrolllength();
		//console.log(iv.currentObject);
		//console.log(scrollCurrentObject.attr ? scrollCurrentObject.attr('id') : undefined);
		socket.emit('saveposition', savedata);
		//console.log('sent position...');
		//console.log(savedata);
	}, 500);

	var doonload = function() {
		//console.log($('#lorem2')[0].getAttribute('data-title'));
		var lastPosition;
		document.cookie.split(';').forEach(function(value) {
			console.log(value);
			console.log(value.split("=")[0]);
			console.log(value.split("=")[0] == ' uid');
			console.log('uid');
			console.log(value.split("=")[1]);
			if ( ( value.split("=")[0] ) === " uid" ) {
				uid = value.split("=")[1];
				console.log( "found id: " + uid );
			}
			if((value.split("=")[0]) === "lastvisit") {
				console.log(value.split("=")[0] === 'lastvisit');
				lastPosition = value.split("=")[1];
				console.log("Last position: " + lastPosition);
				var x = document.createElement("a");
				x.href = "#" + lastPosition;

			// this code is duplicated from further down. Generalize!
			$(x).click(function() {
				var click = {
					id: $(this).attr('href')
				}
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					stopScroll = true;
					$('html, body').stop().animate(
							{ scrollTop: target.offset().top }
							, {duration: 1000
								,
							}
							).promise().then(function() {
						$('html, body').animate({ scrollTop: $(window).scrollTop() - 50});
						$(click.id).addClass('flash');
						console.log(click.id);
						setTimeout( function(){
							$(click.id).removeClass('flash');
							stopScroll = false;
						}, 1000);
					});
							return false;
				}
			}
			});
			x.click();
			console.log(lastPosition);
		}
	});
		if ( uid === undefined ) {
			console.log("gnerating new id.");
			uid = new Date().getTime();
		}
	/* Get in the referrer / title etc. If set as argument, use the that
	 * instead of document.$ stuff.
	 */


}
	var oldonscroll = document.onscroll;
	document.onscroll =
		(typeof document.onscroll != 'function') ? iv.doonscroll
		: function () {
			oldonscroll();
			iv.doonscroll();
		};
	return iv;




} ) ( jQuery );



/*
 *
 * id.id20161424 = {
	email: undefined,
	page: 'v.html',
	positionId: 'P13',
	containerId: '.article',
	time: new Date(),
	percentage: 67
	}
*
*/
