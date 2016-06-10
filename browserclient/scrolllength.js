(function(socket) {
	var hasScrolled = false;
	var elements = $( '#lorem1' );

	var cssText = '.progressbar { width: ' + 2 + '%;}';
	var css = document.createElement('style');
	var pptComp;
	css.type = "text/css";
	css.textContent = cssText;
	document.body.appendChild(css);

	var scrollength = {
		setHasScrolled: function () {
			hasScrolled = true;
		},
		doonscroll: function () {
			this.setHasScrolled();
		},
		fixProgressBar: function () {
			var documentDistance
				= Math.abs(
						elements[0].getBoundingClientRect().top - 
						/*data.articlePosition.top -*/
						$(window).height() - 
						/*data.articlePosition.window.height -*/
						elements.position().top);
						/*data.articlePosition.position.top);*/
			var percentageComplete =
				Math.round(
						documentDistance /
						elements.height()
						/*data.articlePosition.document.height*/
						* 100);
			css.textContent = '.progressbar { width: ' + percentageComplete + '%;}';
			hasScrolled = false;
			pptComp = percentageComplete;
		}
	};

	intervalId = setInterval(function() {
		if ( hasScrolled ) {
			scrollength.fixProgressBar();
		}
	}, 125);

	var oldonscroll = document.onscroll;
	document.onscroll =
		(typeof document.onscroll != 'function') ? scrollength.doonscroll
		: function () {
			oldonscroll();
			scrollength.doonscroll();
		};

	window.scrolllength = function () {
		return pptComp;
	};

})(socket);
