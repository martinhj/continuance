
var uid;
var socket = io('http://pitr.local:3000');

socket.on('message', function (data) {
	console.log(data.hello);
});

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

randomDate(new Date(2012, 0, 1), new Date());


var date = new Date();

date ; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

date.setDate(date.getDate() - 1);

date ; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)




var imageTypes = [ 'people', 'animals', 'arch', 'nature', 'tech' ];
var imageFilters = [ 'grayscale', 'sepia' ];
var pages = [ 'v.html', 'index.html', 'fb.html' ];
//var pages = [ 'v.html', 'index.html', 'fb.html', 'video.html' ];

var generalclass = "narticle";
var smallclasses = "small";
var bigclasses = "big center";

//if (small) // add a two small.

var btn = document.createElement("DIV");

var str = "";
$('.main.container').append(btn);

function link (classes) {
	var element = "<a href=\"";
	element += pages[ Math.round(Math.random() * (pages.length -1 ) ) ];
	element += "\" class = \"" + classes + "\">\n";
	return element;
}

function smallhead () {
	var element = "<div class=\"container small center\">\n";
}
function head () {
	var element = "<div class=\"";
	element += generalclass + " ";
	return element;
}

function inner () {
	var element = "";
	element += "<img src=\"https://placeimg.com/400/200/";
	element += imageTypes[ Math.round( Math.random() * ( imageTypes.length - 1 ))];
	element += "\">\n";
	element += "\t<div class=\"header\">An article you want to read</div>\n";
	element += "\t<p>Here it is a short teaser of the content.</p>\n";

	/*
	   ends with </div></a> in big
	   ends with </a> </div> in small
	   small: last class narticle small right
	 */
	return element;
}

function createLinks () {
	var element = "";
	if (Math.round(Math.random())) {
		// small
		element += "<div class=\"container small center\">\n";
		element += "\t" + link(generalclass + " small");
		element += "\t" + inner();
		element += "\t</a>\n";
		element += "\t" + link(generalclass + " small right");
		element += "\t" + inner();
		element += "\t</a>\n";
		element += "</div>\n";
	} else {
		element += link("");
		element += "\t<div class=\"narticle big center\">\n";
		element += "\t" + inner();
		element += "\t</div>\n</a>";
	}
	return element;
}


$(btn).append( createLinks() );
$(btn).append( createLinks() );
$(btn).append( createLinks() );
$(btn).children().each(function (index, value) {
	$('.main.container').append(value);
});
//$('.main.container').append(btn);
//var big = " <a href=\"index.html\"> <div class=\"narticle big center\"> <img src=\"https://placeimg.com/400/200/any\"> <div class=\"header\">An article you want to read</div> <p>Here it is a short teaser of the content.</p> </div> </a> ";
/*
 *<div class="main container">
 *    <h1 class="narticle center"> A newspaper you use to read.  </h1>
     <a href="index.html">
         <div class="narticle big center">
             <img src="https://placeimg.com/400/200/any">
             <div class="header">An article you want to read</div>
             <p>Here it is a short teaser of the content.</p>
         </div>
     </a>
 *    <div class="container small center">
 *        <a class="narticle small" href="#testin">
 *            <img src="https://placeimg.com/400/200/arch">
 *            <div class="header">An article you want to read</div>
 *            <p>Here it is a short teaser of the content.</p>
 *        </a>
 *        <a href="#testin" class="narticle small right">
 *            <img src="https://placeimg.com/400/200/tech">
 *            <div class="header">An article you want to read</div>
 *            <p>Here it is a short teaser of the content.</p>
 *        </a>
 *    </div>
 *</div>
 */


function getPositions () {
	socket.emit('getpositions', uid);
}
socket.on('positions', function (data) {
	console.log(data);
});





var oldonload = window.onload;
window.onload = 
(typeof window.onload != 'function') ? doonload
: function () {
	oldonload();
	doonload();
};

var doonload = function() {
	console.log("doning something...")
		//console.log($('#lorem2')[0].getAttribute('data-title'));
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
		});
	if ( uid === undefined ) {
		console.log("gnerating new id.");
		uid = new Date().getTime();
	}
	/* Get in the referrer / title etc. If set as argument, use the that
	 * instead of document.$ stuff.
	 */
}
