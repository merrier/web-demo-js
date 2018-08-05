+function(){
	var trees = document.querySelectorAll('.tree');
	var addEvent = function(dom, type, handle, capture) {
		if(dom.addEventListener) {
			dom.addEventListener(type, handle, capture);
		} else if(dom.attachEvent) {
			dom.attachEvent("on" + type, handle);
		}
	};
	for(var i = 0; i < trees.length; i++){
		var tree = trees[i];
		var folder = tree.querySelectorAll('.collapsable>span');
		for(var j = 0; j < folder.length; j++) {
			var f = folder[j];
			addEvent(f, 'click', toggle, false);
		}
	};
	function toggle(e){
		e.stopPropagation();
		var cl = this.parentNode.classList;
		cl.toggle('open');
	}
}();
