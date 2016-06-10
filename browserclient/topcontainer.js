(function() {
	var didScroll = false;
	lastScrollTop = 0;
	var delta = 5;
	var lock = false;

	$( window ).scroll(function() {
		didScroll = true;
	});

	setInterval( function() {
		if ( didScroll ) {
			hasScrolled();
			didScroll = false;
		}
	});

	function hasScrolled() {
		var st = $( this ).scrollTop();
		if (Math.abs( lastScrollTop - st ) <= delta || lock ) return;
		if ( $( window ).scrollTop() < -20 ) {
			toggleDrawer();
			lock = true;
		}
		setTimeout( function() {
			lock = false;
		}, 500);
	}
	$( document ).ready( function() {
		//$('.main').addClass('blur');
		//$('.topdrawer').addClass('active');
		$( '.overlay' ).addClass( 'hidden' );
	});
	/*
	$('.overlay, #continuance').click(function () {
		$('.topdrawer').removeClass('active');
		$('.main').removeClass('blur');
		$('.overlay').hide();
	});
	*/
	$( '.overlay, #continuance' ).click( function () {
		toggleDrawer();
	});
	var toggleDrawer = function() {
		$( '.main' ).toggleClass( 'blur' );
		$( '.topdrawer' ).toggleClass( 'active' );
		$( '.overlay' ).toggleClass( 'hidden' );
	};
})();
