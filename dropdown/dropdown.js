! function() {
	var dropdown = document.querySelectorAll('.dropdown');
	var addEvent = function(dom, type, handle, capture) {
		if(dom.addEventListener) {
			dom.addEventListener(type, handle, capture);
		} else if(dom.attachEvent) {
			dom.attachEvent("on" + type, handle);
		}
	};
	function toggleDropdown() {
		var d = this.parentNode;
		for(var i = 0; i < dropdown.length; i++) {
			dropdown[i].classList.remove('open');
		};
		var classList = d.classList;
		if(classList.contains('open')) {
			classList.remove('open');
		} else {
			classList.add('open');
		}
	};

	function closeDropdown(e) {
		var target = e.target;
		while(target) {
			if(target && target.nodeName == '#document') {
				[].forEach.call(dropdown, function(d) {
					d.classList.remove('open');
				});
			} else if(target.classList.contains('dropdown')) {
				break;
			}
			target = target.parentNode;
		}
	}
	for(var i = 0; i < dropdown.length; i++) {
		addEvent(dropdown[i].firstElementChild, 'click', toggleDropdown, false);
	}
	addEvent(document, 'click', closeDropdown, false);
}();