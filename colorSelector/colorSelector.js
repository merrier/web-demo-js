+ function() {
	var colorModal = null;
	var currentItem = null;
	var addEvent = function(dom, type, handle, capture) {
		if(dom.addEventListener) {
			dom.addEventListener(type, handle, capture);
		} else if(dom.attachEvent) {
			dom.attachEvent("on" + type, handle);
		}
	};
	function HSVtoRGB(h, s, v) {
		var r, g, b, i, f, p, q, t;
		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);
		switch(i % 6) {
			case 0:
				r = v, g = t, b = p;
				break;
			case 1:
				r = q, g = v, b = p;
				break;
			case 2:
				r = p, g = v, b = t;
				break;
			case 3:
				r = p, g = q, b = v;
				break;
			case 4:
				r = t, g = p, b = v;
				break;
			case 5:
				r = v, g = p, b = q;
				break;
		};
		var hr = Math.floor(r * 255).toString(16);
		var hg = Math.floor(g * 255).toString(16);
		var hb = Math.floor(b * 255).toString(16);
		return '#' + (hr.length < 2 ? '0' : '') + hr +
			(hg.length < 2 ? '0' : '') + hg +
			(hb.length < 2 ? '0' : '') + hb;
	};

	function addColorBoard() {
		var table = document.createElement('table');
		table.setAttribute('cellpadding', 0);
		table.setAttribute('cellspacing', 0);
		table.setAttribute('unselectable', 'on');
		table.style.border = '1px solid #d9d9d9';
		table.setAttribute('id', 'color-board');
		for(var row = 1; row < 15; ++row) {
			var rows = document.createElement('tr');
			for(var col = 0; col < 25; ++col) {
				var color;
				if(col == 24) {
					var gray = Math.floor(255 / 13 * (14 - row)).toString(16);
					var hexg = (gray.length < 2 ? '0' : '') + gray;
					color = '#' + hexg + hexg + hexg;
				} else {
					var hue = col / 24;
					var saturation = row <= 8 ? row / 8 : 1;
					var value = row > 8 ? (16 - row) / 8 : 1;
					color = HSVtoRGB(hue, saturation, value);
				};
				var td = document.createElement('td');
				td.setAttribute('title', color);
				td.style.cursor = 'url(../images/di.ico),crosshair';
				td.setAttribute('unselectable', 'on');
				td.style.backgroundColor = color;
				td.width = 12;
				td.height = 12;
				rows.appendChild(td);
			};
			table.appendChild(rows);
		};
		var box = document.createElement('div');
		box.appendChild(table);
		return box.innerHTML;
	};

	function open(e) {
		e.preventDefault();
		e.stopPropagation();
		colorModal && document.body.removeChild(colorModal);
		currentItem = this;
		colorModal = document.createElement('div');
		colorModal.className = 'color-modal';
		colorModal.innerHTML = addColorBoard();
		document.body.appendChild(colorModal);
		var td = colorModal.querySelectorAll('td');
		var isInput = this.isInput;
		for(var i = 0; i < td.length; i++) {
			addEvent(td[i], 'click', function() {
				var color = this.getAttribute('title');
				if(isInput) {
					currentItem.value = color;
				} else {
					currentItem.style.background = color;
				}
				colorModal && document.body.removeChild(colorModal);
				colorModal = null;
			}, false);
		};
		var rect = this.getBoundingClientRect();
		var left = rect.left;
		var top = rect.top;
		var right = rect.right;
		var bottom =rect.bottom;
		var cWidth = colorModal.offsetWidth;
		var cHeight = colorModal.offsetHeight;
		if(cWidth > (window.innerWidth - left)){
			colorModal.style.left = (right - cWidth) + 'px';
		} else {
			colorModal.style.left = left + 'px';
		};
		if(cHeight > (window.innerHeight - bottom)){
			colorModal.style.top = (bottom -cHeight - rect.height) + 'px';
		} else {
			colorModal.style.top = (top + rect.height) + 'px';
		};
	}
	var colorSelector = document.querySelectorAll('.color-picker');
	for(var i = 0; i < colorSelector.length; i++) {
		var c = colorSelector[i];
		if(c.nodeName == 'INPUT') {
			c.readOnly = true;
			colorSelector[i].isInput = true;
		} else {
			colorSelector[i].isInput = false;
		};
		addEvent(c, 'click', open, false);
	};
	addEvent(document, 'click', function(e) {
		if(colorModal) {
			eventBroker(e, 'color-modal', function() {
				colorModal && document.body.removeChild(colorModal);
				colorModal = null;
			});
		}
	}, false);

}();