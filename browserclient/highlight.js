(function( $ ) {
	
	/*
	 * selRange.startContainer.parentNode
	 */

	/*
	 * function foo() {
	 *     window.selObj = window.getSelection(); 
	 *     window.selRange = selObj.getRangeAt(0);
	 *     }
	 */
	//window.onmouseup = function() {console.log($(window.getSelection().anchorNode).parent())}
	//window.onmouseup = function() {console.log(window.getSelection().anchorNode.parentNode)}
	//window.onmouseup = function() {console.log(window.getSelection())}
	//

	/*
	 * Needs to be restricted to the element with text. Now it works anywhere it is some
	 * highlighting.
	 */
	window.onmouseup = function() {
		//console.log($(window.getSelection().anchorNode.parentNode).());
		var startNode = {}, endNode = {}, anchorNode, focusNode, selection, range;
		selection = window.getSelection();
		console.log(selection);
		range = selection.getRangeAt(0);
		//console.log(selection.focusNode.parentNode.id);
		/*
		 *console.log($(selection.anchorNode.parentNode).prevAll('#' + window.getSelection().focusNode.parentNode.id));
		 *console.log($(selection.anchorNode.parentNode).prevAll('#' + window.getSelection().focusNode.parentNode.id).length);
		 */
		anchorNode = selection.anchorNode;
		focusNode = selection.focusNode;
		if (focusNode.parentNode.id !== '' && $(anchorNode.parentNode).prevAll('#' + focusNode.parentNode.id).length === 0 ) {
			startNode = {
				node: anchorNode,
				parent: anchorNode.parentNode,
				offset: selection.anchorOffset
			};
			endNode = {
				node: focusNode,
				parent: anchorNode.parentNode,
				offset: selection.focusOffset
			};
		} else {
			startNode = {
				node: focusNode,
				parent: anchorNode.parentNode,
				offset: selection.focusOffset
			};
			endNode = {
				node: anchorNode,
				parent: anchorNode.parentNode,
				offset: selection.anchorOffset
			};

		}
		if ( startNode.node !== endNode.node ) { console.log("!!!"); return; }
		console.log(startNode.parent);
		console.log(startNode.offset)
		console.log(startNode.node);

		// find the elements..
		// *OR* just restrict it to one paragraph at a time.
		// if (startNode === endNode) ...
		// else nodes = startNode.nextAll( '#' + endNode.id ) {
		//  if (nodes.length <= 0) {
		//		nodes = endNode.nextAll( '#' + startNode.id )
		//	}
		//  
		//  
		// not top element, change p's while running down.
		var oldNode = startNode.node.parentNode;
		var newFirstNode = document.createElement('p');
		newFirstNode.appendChild(document.createTextNode(startNode.node.textContent.slice(0, startNode.offset)));
		var spanNode = document.createElement('span');
		spanNode.classList.add('selected');
		if (endNode.node === startNode.node) {
			spanNode.textContent = startNode.node.textContent.slice(startNode.offset, endNode.offset);
		} else {
			/*
			 * Go through the elements in the node and change them one after
			 * another. If node[0] === '#text' then add it to the new Node. If
			 * it is a <span> node then add it. If it is an <a> object then add
			 * it. Same with <img>, div media.
			 * If the selection spans objects place it in the right node.
			 * If it spans spans, add a span before, between and after.
			 */
			// > $('#P4')[0].childNodes[2].nodeName
			// < "#text" = $11
			// for loop adding span to the <p>'s between firstNode and endNode.
		}
		// instead of spandNodes, replace <p>'s as we go...
		// spanNodes.push(spanNode);
		newFirstNode.appendChild(spanNode);
		// for each spanNodes newFirstNode.appendChild(value)
		// if spanNode === startNode append last part, else loop down.
		newFirstNode.appendChild(document.createTextNode(startNode.node.textContent.slice( endNode.offset )));
		/*document.getElementById('P1').childNodes[0].parentElement.parentElement.replaceChild(;*/
		newFirstNode.id = startNode.node.parentNode.id;
		startNode.node.parentElement.parentElement.replaceChild(newFirstNode, startNode.node.parentElement);
		
		//console.log($('#' + focusNode.parentNode.id));
		console.log("new node:");
		console.log(newFirstNode.childNodes);
		console.log("old node:");
		console.log(oldNode.childNodes);
		/*
		console.log(endNode.parent);
		console.log(endNode.offset);
		console.log(endNode.node);
		console.log(endNode.node.textContent.charAt(endNode.offset));
		*/

		var nodes = { startNode, endNode, oldNode };
		window.testing = nodes;
	}
})/*( jQuery )*/ // main library in here. Needs function to add highlight to overlay.



/* for touch:
 * (should it also be added for window.onfocus (jquery using this))
 * (https://github.com/JamesMGreene/jquery.textSelect/issues/10)
 * on: window.ontouchend = function() {
 *
 * console.log(document.getSelection().anchorNode.textContent +
 * document.getSelection().anchorOffset + ":" +
 * document.getSelection().focusOffset) }
 *
   var touchHiIntervalId =  setInterval(function() {
	/* check if there is still a getSelection - if none turn off interval
	 * if ontouchcancel - turn off interval
	 * if ontouchstart (new highlight) - turn off old interval (check for touchHiIntervalId)
   },150);
*/
