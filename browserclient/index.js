// find a way to find percentage of portion that is in viewports (for portfolio)
// and if it is the top or bottom that is visible (positive vs negative value)
// how-to-get-on-screen-visible-element-objects-in-jquery
// http://stackoverflow.com/questions/19498068/

// This is probably better:
// how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/
// http://stackoverflow.com/questions/123999/7557433#7557433

/* add function: unfinshedArticlesThisSite(fromDate, toDate, finishedTreshold)*/

var ignoreScrollEvents = false;
var overlayVisable = false;
var socket = io('http://pitr.local:3000');

socket.on('message', function (data) {
	console.log(data.hello);
});

socket.on('position', function (data) {
	var convertFromPercentage = data / 100 * $(document).height();
	var position = convertFromPercentage - $(window).height();
	oldPosition = position;
	ignoreScrollEvents = true;
	//$('body').scrollTop(position);
});

$('.article').each = function () {
	this.onfocus = function () {
		console.log(this.getAttribute('data-title'));
	}
}

// do the document.onload as the onscroll function. Non obtrusive...


/* http://stackoverflow.com/questions/1386696/
 * make-scrollleft-scrolltop-changes-not-trigger-scroll-event
 */

/*
 * this function does not pay enough attention to what is visible and not.
 * Should pay respect to what is visible to be compatible with eternal scroll
 * and other multiple elems.
 */
function doconscroll () {
	var ignore = ignoreScrollEvents;
	if (!overlayVisable) {
		//console.log('setting cookie...');

		/*
		 * :in-viewport takes to much cpu-time. a lot of calculations.
		 * check how performance is if only checking elements in selection.
		 *
		 * var array of elements, so no need to run function each time (and
		 * controlled when)
		 * var 'index of last element in viewport'
		 * onscroll - calculate direction of scrolling since last time.
		 * iterate array of elements incuding in viewport last time and
		 * linearily until new element in viewport.
		 *
		 * to set a max count of elements to iterate through each time:
		 * var lastChecked (set variable if jump out of loop)
		 * (how much more time does the process take to fininsh with this check
		 * of iteration count?
		 *
		 *
		console.log($('.article p:in-viewport').first().next().attr('id'));
		document.cookie = "lastvisit=" + $('.article p:in-viewport').first().next().attr('id');
		* profiling code to check only the elements in selection:
		invarr = []; var startTime = new Date().getTime(); var lorema =
		$('#lorem1 p'); for (var i = 0; i < lorema.length; i++) {
		invarr.push($.inviewport($(lorema[i]), {threshold:0}));} var endTime =
		new Date().getTime(); endTime - startTime;
		*/
	} else { 
		//console.log('not setting cookie...');
	}

	// toggle topic sentence drawer.
	/*
	if ($('body')[0].getBoundingClientRect().top > 16) {
		$('.topdrawer').toggleClass('active');
	}
	*/
	ignoreScrollEvents = false;
	if (ignore) {
		return false;
	} 
	var data = {
		articlePosition: {
			top: $('#lorem1')[0].getBoundingClientRect().top,
			bottom: $('#lorem1')[0].getBoundingClientRect().bottom,
			position: $('#lorem1').position(),
			window: {
				height: $(window).height(),
				width: $(window).width()
			},
			document: {
				height: $(document).height(),
				width: $(document).width()
			}
		},
		title: document.title
	}
	/* send data in a shortest possible number. Maybe hex.
	 * a = 262143
	 * b = 1048576
	 * a in hex: 3ffff
	 * b in hex: fffff
	 * sizeof(a) * 8 (bits): 32
	 * a in binary: 00000000000000111111111111111111
	 * b in binary: 00000000000011111111111111111111
	 */


	// needs to send both document height and page height to find out
	// when article is complete and when page is scrolled to the
	// bottom.

	//console.log(JSON.stringify(data));
	//console.log(JSON.stringify(data).length);
	// 185 bytes long.
	socket.emit('statechange', data);
}

var oldonscroll = document.onscroll;
document.onscroll =
	(typeof document.onscroll != 'function')
	? doconscroll
	: function () {
		oldonscroll();
		doconscroll();
	}

/*
 * http://stackoverflow.com/q/979975/
 *        ^^^^- important questions in the forum.
 * http://stackoverflow.com/q/11582512
 *		  ^^^^- nice regex alternative.
 */
var extractURLParameter = function() {
	var queryString = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length;i++) {
		var pair = vars[i].split("=");
		if (typeof queryString[pair[0]] === "undefined") {
			queryString[pair[0]] = decodeURIComponent(pair[1]);
		} else if (typeof queryString[pair[0]] === "string") {
			var arr =	[ queryString[pair[0]]
				, decodeURIComponent(pair[1]) ];
			queryString[pair[0]] = arr;
		} else {
			queryString[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return queryString;
}

/*
 * If JSON is not implemented in browser:
 * var JSON = JSON || {};
 * http://www.sitepoint.com/javascript-json-serialization/
 */
JSON.stringify = JSON.stringify || function (obj) {

	var t = typeof (obj);
	if (t != "object" || obj === null) {

		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);

	}
	else {

		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for (n in obj) {
			v = obj[n]; t = typeof(v);

			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);

			json.push((arr ? "" : '"' + n + '":') + String(v));
		}

		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

/* make these function with internal variables.*/
function
printAllSentences(selector) {
	extractSentences(selector).forEach(function(ocurrentValue, oindex, oarray) {
		ocurrentValue.forEach(function(currentValue, index, array) {
			console.log("[" + oindex + "] " + index + ": " + currentValue);
		});
	});
}

/* testing how to add attribute to DOM elements. */
function
addId(array) {
	array.forEach(function (value, index, array) {
		/* do not add ids to elements that already got ids */
		value.id = value.id || value.tagName + index;
	});
}

/*
 * creates an array per element found with the selector and adds the paragraphs
 * found within this element into an paragraph array.
 * **** Now extract jquery paragraph elements!
 */
function
extractParagraphs(selector) {
	var content = [];
	$(selector).each(function(index) {
		content[index] = [];
		$('p', this).each(function() {
			content[index].push($(this)[0]);
		});
	})
	return content;
}


/* add class 'first' or 'topics' to first sentence of paragraph.
 */


/*
 * creates an array per element found with the selector and adds a sentence
 * array to each of these arrays.
 */
function
extractSentences(selector) {
	var content = [];
	/* should the leading whitespace be cleaned out? Processor power to add it
	 * again when joining sentences to paragraph?
	 *@if not then a it needs to be handled when adding span stuff. Seems
	 * unclean.
	 */
	$(selector).each(function() {
		content.push($(this).html().split('.'));
	});
	return content;
}


/*
 * This function needs to be generalized.
 * Needs to take text to be placed in overlay and position(href) and position
 * in list.
 */
function
addFirstSentenceToOverlay() {
	extractParagraphs('#lorem1')[0].forEach(function(value, index) {
		//if (index > 10) return null;
		/*console.log(index + ": ");*/
		var currentValue = $(value).text().split(/[\?\!\.]/)[0];
		/*console.log(currentValue);*/
		$('.topdrawer .topicsentences').append("<p><a href=\#" + value.id + "> " + currentValue + " </a></p>");
		//$('.topdrawer .topicsentences').append("<p>" + currentValue + "</p>");
		// while (value.id != currentPosition.id)
	});
}

/* just runs the function on document load. Should also be run after an ajax
 * inject.
 */
addId(extractParagraphs('#lorem1')[0]);
addFirstSentenceToOverlay();

var stopScroll;
$('a[href*="#"]:not([href="#"])').click(function() {
	var click = {
		id: $(this).attr('href')
	}
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		var target = $(this.hash);
	target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	click.length = Math.abs(scrollCurrentObject.position().top -
				$(click.id).position().top) / 10;
	console.log(click.length);
	if (target.length) {
		stopScroll = true;
		$('html, body').stop().animate(
				{ scrollTop: target.offset().top }
				/* dirty hack here. scrollCurrentObject as global variable.
				 * Should not be that. Move all scroll related stuff to scroll.js
				 * and have access to it there.
				 */
				, {duration: Math.abs(scrollCurrentObject.position().top -
				$(click.id).position().top)
					,
				}
				).promise().then(function() {
					$('html, body').animate({ scrollTop: $(window).scrollTop() - 50});
					$(click.id).addClass('flash');
					setTimeout( function(){
						$(click.id).removeClass('flash');
						stopScroll = false;
					}, 1000);
				});
		return false;
	}
}
});

//function scrollTo
$('#continuance').click(function() {
	$('.topdrawer').toggleClass('active');
	overlayVisable = overlayVisable ? false : true;
	console.log(overlayVisable);
	$('.topdrawer').removeClass('up');
	$('.topdrawer').addClass('down');
	$('.main.article').toggleClass('blur');

});

$('.topdrawer a[href*="#"]:not([href="#"])').click(function() {
	$('.topdrawer').removeClass('active');
	$('.topdrawer').addClass('up');
	$('.topdrawer').removeClass('down');
	$('.main.article').removeClass('blur');
	overlayVisable = false;
})






/* scrollstuff // header show/hide */
/* https://jsfiddle.net/mariusc23/s6mLJ/31/ */
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.topdrawer').outerHeight();

$(window).scroll(function(event){
    if (!stopScroll && !overlayVisable) didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('.topdrawer').removeClass('down').addClass('up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.topdrawer').removeClass('up').addClass('down');
        }
    }

    lastScrollTop = st;
}




// to stop the body from scrolling:
// document.body.classList.toggle('noscroll')



// line to set right height for header bar in css:
// *NO* it's not, needs to rewrite css in DOM
// $('.topdrawer.down').css({'top': -($('#continuance').parent().outerHeight() - $('#continuance').outerHeight() - 5)})
//
// injecting css to handle size of continuance banner:
var oldonload = window.onload;
window.onload =
	(typeof window.onload != 'function')
	? doonload
	: function () {
		oldonload();
		doonload();
	}
/* this function will calculate size of #continuance class.*/
function doonload () {
	var cssText = '.topdrawer.down { top: ' 
		+ (-($('#continuance').parent().outerHeight() - $('#continuance').outerHeight() ))
		+ 'px;}';
	/*
	 * For when the header is up. Think it do not work on the iphone because of
	 * the moveing address bar.
	 * Calculate from bottom instead?
	cssText += '.topdrawer.up { top: '
		+ (-($('#continuance').parent().outerHeight() - $('#continuance').outerHeight() + 28))
		+ 'px;}';
	*/
	var css = document.createElement('style');
	css.type = "text/css";
	css.textContent = cssText;
	document.body.appendChild(css);
}