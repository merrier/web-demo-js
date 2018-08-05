; + function() {
	var addEvent = function(dom, type, handle, capture) {
		if(dom.addEventListener) {
			dom.addEventListener(type, handle, capture);
		} else if(dom.attachEvent) {
			dom.attachEvent("on" + type, handle);
		}
	};

	var addClass = function(elem, className) {
		if(elem.classList) {
			elem.classList.add(className);
		} else {
			elem.className += ' ' + className;
		}
	};
	var removeClass = function(elem, className) {
		if(elem.classList) {
			elem.classList.remove(className);
		} else {
			elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};
	var hasClass = function(elem, className) {
		if(elem.classList) {
			return elem.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(elem.className);
		}
	}
	var menus = document.querySelectorAll('.scroll-menu');
	for(var i = 0; i < menus.length; i++) {
		var menu = menus[i];
		var tabs = menu.querySelectorAll('.scroll-menu-tabs>li');
		var direction = menu.getAttribute('data-position');
		direction = direction ? direction : 'right';
		for(var j = 0; j < tabs.length; j++) {
			var tab = tabs[j];
			(function(menu,tab, direction) {
				addEvent(tab, 'mouseover', function() {
					var w = tab.querySelector('span').offsetWidth;
					if(hasClass(menu, 'scroll-menu-left')) {
						this.style.left = w + 'px';
					} else {
						this.style.right = w + 'px';
					}
					addClass(this, 'active');
				});

				addEvent(tab, 'mouseout', function() {
					if(hasClass(menu, 'scroll-menu-left')) {
						this.style.left = '0px';
					} else {
						this.style.right = '0px';
					}
					removeClass(this, 'active');
				});
			})(menu,tab, direction);
		}
	}
}();