(function() {
	var LazyIScroll = function(container, params) {
		if(!(this instanceof LazyIScroll)) return new LazyIScroll(container, params);
		var n = this;
		var defaults = {
			scrollbar: true,
			fadeScrollbar: false,
			bounce: false
		};
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
				};
			};
		};
		n.params = params;
		n.originalParams = originalParams;
		n.container = typeof container === 'string' ? document.querySelectorAll(container) : container;
		if(n.container.length == 0) return;
		if(n.container.length > 1) {
			var iscrolls = [];
			for(var i = 0; i < n.container.length; i++) {
				iscrolls.push(new LazyIScroll(n.container[i]));
			}
			return iscrolls;
		};
		n.css = function(dom, styles) {
			for(var s in styles) {
				dom.style[s] = styles[s];
			}
		};
		var addEvent = function(dom, type, handle, capture) {
			if(dom.addEventListener) {
				dom.addEventListener(type, handle, capture);
			} else if(dom.attachEvent) {
				dom.attachEvent("on" + type, handle);
			}
		};
		var setTransform = function(element, animation) {
			element.style.webkitTransform = animation;
			element.style.mozTransform = animation;
			element.style.oTransform = animation;
			element.style.msTransform = animation;
			element.style.transform = animation;
		};
		var setTransitionDuration = function(element, times) {
			element.style.webkitTransitionDuration = times + 'ms';
			element.style.mozTransitionDuration = times + 'ms';
			element.style.oTransitionDuration = times + 'ms';
			element.style.transitionDuration = times + 'ms';
		};
		var addPrefix = function(element, attr, value) {
			var prefix = ['webkit', 'moz', 'o', 'ms'];
			var uattr = attr.split('');
			uattr[0] = uattr[0].toUpperCase();
			uattr = uattr.join('');
			prefix.forEach(function(x) {
				element.style[x + uattr] = value;
			});
			element.style[attr] = value;
		};
		var transitionEnd = function(elem, handler) {
			elem.addEventListener('transitionend', handler, false);
			elem.addEventListener('webkitTransitionEnd', handler, false);
			elem.addEventListener('mozTransitionEnd', handler, false);
			elem.addEventListener('oTransitionEnd', handler, false);
		};
		var deleteTransitionEnd = function(elem, handler) {
			elem.removeEventListener('transitionend', handler, false);
			elem.removeEventListener('webkitTransitionEnd', handler, false);
			elem.removeEventListener('mozTransitionEnd', handler, false);
			elem.removeEventListener('oTransitionEnd', handler, false);
		};

		n.container = n.container.length ? n.container[0] : n.container;
		// 检测是否FireFox浏览器
		var isMoz = 'MoztTransform' in document.createElement('div').style;
		// 检测是否移动端，然后定义事件
		var isTouch = 'ontouchstart' in window,
			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = isTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = isTouch ? 'touchmove' : 'mousemove',
			END_EV = isTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = isTouch ? 'touchcancel' : 'mouseup',
			WHEEL_EV = isMoz ? 'DOMMouseScroll' : 'mousewheel';
		n.isPressed = false;
		n.mouseXY = {};
		n.captureMT = function(element, touchStartEvent, touchMoveEvent, touchEndEvent) {
			'use strict';
			var isTouch = ('ontouchend' in document);
			var touchstart = null;
			var touchmove = null
			var touchend = null;
			var isPressed = false;
			if(isTouch) {
				touchstart = 'touchstart';
				touchmove = 'touchmove';
				touchend = 'touchend';
			} else {
				touchstart = 'mousedown';
				touchmove = 'mousemove';
				touchend = 'mouseup';
			};
			/*传入Event对象*/
			function getPoint(event) {
				/*将当前的触摸点坐标值减去元素的偏移位置，返回触摸点相对于element的坐标值*/
				event = event || window.event;
				var touchEvent = isTouch ? event.changedTouches[0] : event;
				var x = (touchEvent.pageX || touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
				x -= element.offsetLeft;
				var y = (touchEvent.pageY || touchEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop);
				y -= element.offsetTop;
				return {
					x: x,
					y: y
				};
			};
			if(!element) return;
			/*为element元素绑定touchstart事件*/
			element.addEventListener(touchstart, function(event) {
				event.point = getPoint(event);
				touchStartEvent && touchStartEvent.call(this, event);
			}, false);

			/*为element元素绑定touchmove事件*/
			element.addEventListener(touchmove, function(event) {
				event.point = getPoint(event);
				touchMoveEvent && touchMoveEvent.call(this, event);
			}, false);

			/*为element元素绑定touchend事件*/
			element.addEventListener(touchend, function(event) {
				event.point = getPoint(event);
				touchEndEvent && touchEndEvent.call(this, event);
			}, false);
		};
		n.isLoading = false;
		n.isRunning = false;
		n.scrollType = {
			show: function() {
				if(n.scrollTop > 0) {
					n.iscrollbar.style.opacity = 1;
				} else {
					n.iscrollbar.style.opacity = 0;
				}
			},
			hide: function() {
				n.iscrollbar.style.opacity = 0;
			}
		};
		n.refresh = function() {
			// n.scrollHeight = n.container.scrollHeight;
			n.scrollHeight = n.wrapper.offsetHeight;
			n.offsetHeight = n.container.offsetHeight;
			n.offsetTop = 0;
			n.scrollTop = n.scrollHeight - n.offsetHeight;
			n.scrollBarHeight = n.iscrollbar.offsetHeight;
			n.scrollBarHeight = Math.max(Math.round(n.scrollBarHeight * n.scrollBarHeight / n.wrapper.offsetHeight), 8);
			n.thumb.style.height = (n.scrollBarHeight) + 'px';
			if(n.scrollTop > 0) {
				n.iscrollbar.style.opacity = 1;
			} else {
				n.iscrollbar.style.opacity = 0;
			}
		};
		n.reset = function() {
			n.moveY = 0;
			setTransform(n.thumb, 'translate3d(0, 0px, 0');
			setTransform(n.wrapper, 'translate3d(0, ' + n.moveY + 'px, 0');
		};
		n.drawScrollBar = function() {
			n.css(n.container, {
				overflow: 'hidden'
			});
			n.wrapper = n.container.querySelector('.lazy-iscroll-wrapper');
			if(!n.wrapper) {
				return;
			};
			n.iscrollbar = document.createElement('div');
			n.thumb = document.createElement('div');
			n.thumb.className = 'iscroll-thumb';
			n.iscrollbar.className = 'iscroll-iscrollbar';
			n.moveY = 0;
			n.css(n.thumb, {
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				background: 'padding-box padding-box rgba(0, 0, 0, 0.498039)',
				border: '1px solid rgba(255, 255, 255, 0.901961)',
				borderRadius: '3px',
				zIndex: 100,
				boxSizing: 'border-box'
			});
			setTransitionDuration(n.thumb, 300);
			n.css(n.iscrollbar, {
				position: 'absolute',
				top: '2px',
				right: '1px',
				bottom: '2px',
				overflow: 'hidden',
				width: '7px',
				zIndex: 101
			});
			addPrefix(n.thumb, 'transition', 'transform 400ms cubic-bezier(0.33, 0.66, 0.66, 1)');
			addPrefix(n.iscrollbar, 'transition', 'all 350ms cubic-bezier(0.33, 0.66, 0.66, 1)');
			n.iscrollbar.appendChild(n.thumb);
			n.container.appendChild(n.iscrollbar);

			n.refresh();

			function onWheel(e) {
				var that = this,
					wheelDeltaX, wheelDeltaY,
					deltaX, deltaY,
					deltaScale;
				if('wheelDeltaX' in e) { // 向下滚动是负数-120，向上滚动是正数120
					wheelDeltaX = e.wheelDeltaX / 12;
					wheelDeltaY = e.wheelDeltaY / 12;
				} else if('wheelDelta' in e) {
					wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
				} else if('detail' in e) { //向下滚动是正数3，向上滚动是负数-3
					wheelDeltaX = wheelDeltaY = -e.detail * 3;
				} else {
					return;
				};
				if(!n.isLoading) {
					n.isRunning = true;
					move(wheelDeltaY);
				}
			}
			if(!isTouch) {
				addEvent(n.container, WHEEL_EV, onWheel, false);
			};
			if(n.scrollTop > 0) {
				n.scrollType.show();
			};

			function move(y) {
				n.moveY += y;
				if(!n.isPressed) {
					if(Math.abs(n.moveY) > n.scrollTop) {
						n.moveY = -n.scrollTop;
						n.isLoading = true;
						setTimeout(function() {
							n.isLoading = false;
						}, 1000);
						n.isRunning = false;
					} else if(y > 0 && n.moveY > 0) {
						n.moveY = 0;
						n.isRunning = false;
					};
					setTransitionDuration(n.wrapper, 250);
				};
				//计算滚动条滚动的高度
				var mY = 0;
				if(n.moveY >= 0) {
					mY = 0;
				} else if(Math.abs(n.moveY) >= n.scrollTop) {
					mY = -n.scrollTop;
				} else {
					mY = n.moveY;
				};
				var sv = mY / n.scrollTop * (n.iscrollbar.offsetHeight - n.scrollBarHeight);
				sv = -Math.floor(sv);
				n.iscrollbar.style.opacity = 1;
				setTransform(n.thumb, 'translate3d(0, ' + sv + 'px, 0');
				setTransform(n.wrapper, 'translate3d(0, ' + n.moveY + 'px, 0');
			}

			function mousedown(event) {
				n.isPressed = true;
				n.scrollType.show();
				n.mouseXY['startY'] = event.point.y;
			};

			function mousemove(event) {
				if(n.isPressed && !n.isLoading) {
					n.isRunning = true;
					//					setTransitionDuration(n.wrapper, 0);
					var y = event.point.y - n.mouseXY['startY'];
					move(y);
					n.mouseXY['startY'] = event.point.y;
				}
			};

			function mouseup(event) {
				n.isPressed = false;
				var y = event.point.y - n.mouseXY['startY'];
				if(n.moveY >= 0) {
					n.moveY = 0;
				} else if(Math.abs(n.moveY) >= n.scrollTop) {
					n.moveY = -n.scrollTop;
				};
				move(0);
			};
			n.captureMT(n.container, mousedown, mousemove, mouseup);
			if(n.params.fadeScrollbar) {
				n.scrollType.hide();
				addEvent(n.iscrollbar, 'mouseover', function() {
					n.scrollType.show();
				}, false);
				addEvent(n.iscrollbar, 'mouseout', function() {
					n.scrollType.hide();
				}, false);
				transitionEnd(n.wrapper, function() {
					setTimeout(function() {
						n.scrollType.hide();
						n.isRunning = false;
					}, 200);
					setTransitionDuration(n.wrapper, '0');
				});
				addEvent(n.container, 'mouseover', function() {
					n.scrollType.show();
				});
				addEvent(n.container, 'mouseout', function() {
					if(!n.isRunning) {
						n.scrollType.hide();
					}
				});
			};
		};
		n.drawScrollBar();
		return n;
	};
	window.LazyIScroll = LazyIScroll;
})();