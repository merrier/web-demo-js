+ function() {
	var tabs = document.querySelectorAll('.sg-tabs-block');
	var getStyle = function(dom, attr) {
	return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
};
	for(var i = 0; i < tabs.length; i++) {
		var tab = tabs[i].querySelectorAll('.sg-button-tab');
		tab[0].classList.add('active');
		var classList = tabs[i].classList;
		if(classList.contains('sg-tabs-line')) {
			var w = parseInt(getStyle(tabs[i], 'width')) / tab.length;
			for(var j = 0; j < tab.length; j++) {
				tab[j].index = j;
				tab[j].width = w;
			};
			var indicator = document.createElement('div');
			indicator.className = 'sg-tabs-indicator';
			indicator.style.width = w + 'px';
			tabs[i].querySelector(".sg-tabs-nav").appendChild(indicator);
		}
		var items = tabs[i].querySelectorAll('.sg-button-tab');
		for(var t = 0; t < items.length; t++) {
			items[t].index = t;
			items[t].addEventListener('click', function() {
				var content = this.parentNode.parentNode;
				var tb = content.nextElementSibling.querySelectorAll('.sg-tab');
				var tt = this.parentNode.querySelectorAll('.sg-button-tab');
				var index = this.index;
				for(var j = 0; j < tb.length; j++) {
					if(j != index) {
						tb[j].classList.remove('active');
						tt[j].classList.remove('active');
					} else {
						tb[j].classList.add('active');
						tt[j].classList.add('active');
					}
				};
				if(content.parentNode.classList.contains('sg-tabs-line')) {
					var w = this.width;
					var indicator = this.parentNode.nextElementSibling;
					indicator.style.left = w * index + 'px';
				}
			}, false);
		}
	};
}();