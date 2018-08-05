(function() {
	'use strict';
	var LYRange = function(container, params) {
		if(!(this instanceof LYRange)) return new LYRange(container, params);
		var n = this;
		var defaults = {
			fillLower: '#059CFA',
			fillUpper: '#bdbdbd',
			min: 0,
			max: 100,
			defaultValue: 50
		};
		var maxPercent = 100;
		params = params || {};
		var originalParams = {};
		for(var param in params) {
			if(typeof params[param] === 'object' && params[param] !== null) {
				originalParams[param] = {};
				for(var deepParam in params[param]) {
					originalParams[param][deepParam] = params[param][deepParam];
				}
			} else {
				originalParams[param] = params[param];
			};
		};
		for(var def in defaults) {
			if(typeof params[def] === 'undefined') {
				params[def] = defaults[def];
			} else if(typeof params[def] === 'object') {
				for(var deepDef in defaults[def]) {
					if(typeof params[def][deepDef] === 'undefined') {
						params[def][deepDef] = defaults[def][deepDef];
					}
				}
			}
		};
		n.range = typeof container === 'string' ? document.querySelectorAll(container) : container;
		if(n.range.length == 0) return;
		if(n.range.length > 1) {
			var ranges = [];
			for(var i = 0; i < n.range.length; i++) {
				ranges.push(new LYRange(n.range[i], params));
			};
			return ranges;
		};
		n.range = n.range.length ? n.range[0] : n.range;
		n.params = params;
		n.originParams = originalParams;
		var isTouch = ('ontouchend' in document);
		var touchstart = null;
		var touchmove = null
		var touchend = null;
		var isPressed = false;
		var timeoutID = null;
		if(isTouch) {
			touchstart = 'touchstart';
			touchmove = 'touchmove';
			touchend = 'touchend';
		} else {
			touchstart = 'mousedown';
			touchmove = 'mousemove';
			touchend = 'mouseup';
		};
		var setTransform = function(element, animation) {
			element.style.webkitTransform = animation;
			element.style.mozTransform = animation;
			element.style.oTransform = animation;
			element.style.msTransform = animation;
			element.style.transform = animation;
		};
		var inputChange = function(dom, fn, capture) {
			capture = capture || false;
			addEvent(dom, 'input', fn, capture);
			addEvent(dom, 'propertychange', fn, capture);
		};
		var addEvent = function(dom, type, handle, capture) {
			if(dom.addEventListener) {
				dom.addEventListener(type, handle, capture);
			} else if(dom.attachEvent) {
				dom.attachEvent("on" + type, handle);
			}
		};
		var deleteEvent = function(dom, type, handle) {
			if(dom.removeEventListener) {
				dom.removeEventListener(type, handle);
			} else if(dom.detachEvent) {
				dom.detachEvent('on' + type, handle);
			}
		};

		var isIE = function() {
			if(!!window.ActiveXObject || "ActiveXObject" in window) {
				return true;
			};
			return false;
		};
		//设置提示块位置内容
		n.setTrackColor = function(range) {
			var p = range.value;
			var t = n.range.max - n.range.min;
			p = Math.ceil(p / t * 100 - n.range.min);
			n.range.percent = p;
			range.style.background = '-webkit-linear-gradient(left, ' + n.params.fillLower + ' ' +
				p + '%, ' + n.params.fillUpper + ' ' + p + '%)';
		};
		n.setValue = function(range, tooltip) {
			var left = 0;
			var percent = n.range.percent / maxPercent;
			if(n.params.type == 1) {
				//轨道从0~100，滑块也是0~100
				left = Math.floor((range.offsetWidth - tooltip.offsetWidth) * percent);
			} else {
				left = Math.floor(range.offsetWidth * percent - tooltip.offsetWidth / 2);;
			};
			tooltip.textContent = range.value;
			setTransform(tooltip, 'translate(' + left + 'px,0)');
		};

		function getPoint(element, event) {
			/*将当前的触摸点坐标值减去元素的偏移位置，返回触摸点相对于element的坐标值*/
			event = event || window.event; //e.originalEvent.targetTouches[0]
			var touchEvent = isTouch ? event.changedTouches[0] : event;
			var x = (touchEvent.pageX ||
				touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
			x -= element.offsetLeft;
			var y = (touchEvent.pageY ||
				touchEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop);
			y -= element.offsetTop;
			return {
				x: x,
				y: y
			};
		};

		var touchEvent = {
			init: function(dom) {
				addEvent(dom, touchstart, touchEvent.touchstart);
			},
			setValue: function(value) {
				var percent = value / n.range.offsetWidth * maxPercent;
				var thumb = n.range.querySelector('.range-knob-handle');
				var track = n.range.querySelector('.range-bar-active');
				if(percent >= maxPercent) {
					percent = maxPercent;
				} else if(percent <= 0) {
					percent = 0;
				};
				percent = percent.toFixed(4);
				//计算真实百分比
				var t = n.range.max - n.range.min;
				var cp = Math.ceil(t * percent / 100) + n.range.min;
				thumb.style.left = percent + '%';
				track.style.right = (maxPercent - percent) + '%';
				n.range.value = cp;
				n.range.percent = percent;
			},
			getValue: function(e) {
				var v = getPoint(n.range, e);
				touchEvent.setValue(v.x);
				n.params.onChange && n.params.onChange(n.range);
			},
			touchstart: function(e) {
				if(e.button) return;
				clearTimeout(timeoutID);
				touchEvent.getValue(e);
				n.animate.show(n.tooltip);
				isPressed = true;
				n.setValue(n.range, n.tooltip);
				addEvent(document.body, touchend, touchEvent.touchend);
				addEvent(document.body, touchmove, touchEvent.touchmove);
			},
			touchmove: function(e) {
				if(isPressed) {
					n.animate.show(n.tooltip);
					touchEvent.getValue(e);
					n.setValue(n.range, n.tooltip);
				}
			},
			touchend: function(e) {
				isPressed = false;
				n.animate.hide(n.tooltip);
				deleteEvent(document.body, touchend, touchEvent.touchend);
				deleteEvent(document.body, touchmove, touchEvent.touchmove);
			}
		};
		n.animate = {
			hide: function(dom) {
				timeoutID = setTimeout(function() {
					dom.style.display = 'none';
				}, 400);
			},
			show: function(dom) {
				dom.style.display = 'block';
			}
		};
		n.pageInit = function() {
			n.params.type = parseInt(n.params.type);
			n.params.type = (n.params.type != 1 && n.params.type != 2) ? 1 : n.params.type;
			n.params.min = n.params.min >= n.params.max ? 0 : n.params.min;
			switch(n.params.type) {
				case 1:
					n.input = n.range.querySelector('input');
					//判断最大值和最小值的关系
					if(n.input.min && n.input.max && n.input.min >= n.input.max) {
						n.input.min = 0;
						n.input.max = 100;
					};
					if(!n.input.min) {
						n.input.min = n.params.min;
						n.range.min = n.params.min;
					} else {
						n.range.min = n.input.min;
					};
					if(!n.input.max) {
						n.input.max = n.params.max;
						n.range.max = n.params.max;
					} else {
						n.range.max = n.input.max;
					};
					n.tooltip = n.input.nextElementSibling;
					n.setTrackColor(n.input);
					n.setValue(n.input, n.tooltip);
					inputChange(n.input, function() {
						n.setTrackColor(this);
						n.setValue(this, n.tooltip);
						n.params.onChange && n.params.onChange(n.input);
					}, false);
					addEvent(n.input, touchstart, function() {
						isPressed = true;
						clearTimeout(timeoutID);
						n.animate.show(n.tooltip);
					});
					addEvent(n.input, touchmove, function() {
						if(isPressed) {
							n.animate.show(n.tooltip);
						}
					});
					addEvent(n.input, touchend, function() {
						n.animate.hide(n.tooltip);
						isPressed = false;
					});
					if(isIE()) {
						n.tooltip.style.display = 'none';
					};
					break;
				case 2:
					n.range.min = n.params.min;
					n.range.max = n.params.max;
					n.range.value = n.params.defaultValue;
					//计算当前值的百分比
					var t = n.range.max - n.range.min;
					var p = (n.params.defaultValue- n.range.min) / t;
					touchEvent.setValue(Math.floor(p * n.range.offsetWidth));
					n.tooltip = n.range.querySelector('.range-slider-tooltip');
					touchEvent.init(n.range);
					break;
			}
		};
		n.pageInit();
	};
	window.LYRange = LYRange;
})();