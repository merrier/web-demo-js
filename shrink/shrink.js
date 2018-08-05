/**
 
 @Name : lazyPicker v1.2.0 移动日期控件
 @Author: TG
 @Date: 2016-12-05
 @Site：https://github.com/IronPans/LazySuspend/blob/master/lazyPicker-1.2.0.js
 
 */
(function() {
	'use strict';
	var LazySuspend = function(container, params) {
		if(!(this instanceof LazySuspend)) return new LazySuspend(params);
		var n = this;
		var defaults = {
			type: 'horizontal',
			distance: 10,
			angle: 45,
			delay: 100,
			direction: 'rb'
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
				}
			}
		};
		n.params = params;
		n.originalParams = originalParams;
		n.container = typeof container === 'string' ? document.querySelectorAll(container) : container;
		if(n.container.length == 0) return;
		if(n.container.length > 1) {
			var suspends = [];
			for(var i = 0; i < n.container.length; i++) {
				suspends.push(new LazySuspend(n.container[i], params));
			};
			return suspends;
		};
		n.container = n.container.length ? n.container[0] : n.container;

		n.toggle = function() {
			if(n.container.classList.contains('suspend-expanded')) {
				n.close();
			} else {
				n.open();
			}
		};

		n.open = function() {
			var op = n.reverse ? '-' : '';
				n.btn.classList.add('burge-open');
			switch(n.params.type) {
				case 'horizontal':
					for(var i = 0; i < n.items.length; i++) {
						var x = 'translate(' + op + ((n.itemWidth + n.params.distance) * (i + 1)) + 'px, 0)';
						setTransform(n.items[i], x);
						n.items[i].style.top = '0px';
						n.items[i].style.opacity = 1;
					};
					break;
				case 'vertical':
					for(var i = 0; i < n.items.length; i++) {
						var x = 'translate(0, ' + op + ((n.itemWidth + n.params.distance) * (i + 1)) + 'px)';
						setTransform(n.items[i], x);
						n.items[i].style.top = '0px';
						n.items[i].style.opacity = 1;
					};
					break;
				case 'circle':
					var r = n.itemWidth + n.params.distance;
					var dir = {
						lt: -180,
						lb: 90,
						rt: -90,
						rb: 0
					};
					var rotation = dir[n.params.direction];
					function anim(i) {
						// -180/左上(lt)、 90/左下(lb)、-90/右上(rt)、0/右下(rb)
						var angle = (n.params.angle * i - rotation) / 180 * Math.PI; 
						var x = Math.sin(angle) * r;
						var y = Math.cos(angle) * r;
						x = x.toFixed(3);
						y = y.toFixed(3);
						var xy = 'translate(' + x + 'px,' + y + 'px)';
						setTransform(n.items[i], xy);
						n.items[i].style.top = '0px';
						n.items[i].style.opacity = 1;
					};
					n.params.delay = parseInt(n.params.delay);
					for(var i = 0; i < n.items.length; i++) {
						if(n.params.delay) {
							(function(i) {
								n.items[i].intervalId = setInterval(function() {
									anim(i);
								}, n.params.delay * i);
							})(i);
							transitionEnd(n.items[i], function(){
								clearInterval(this.intervalId);
							});
						} else {
							anim(i);
						}
					};
					break;
			};
			n.container.classList.add('suspend-expanded');
		};

		n.close = function() {
			switch(n.params.type) {
				case 'horizontal':
				case 'vertical':
				case 'circle':
					for(var i = 0; i < n.items.length; i++) {
						setTransform(n.items[i], 'translate(0, 0)');
						n.items[i].style.top = '0px';
						n.items[i].style.opacity = 0;
					};
					break;
			};
			n.btn.classList.remove('burge-open');
			n.container.classList.remove('suspend-expanded');
		};

		n.pageInit = function() {
			n.reverse = false;
			n.items = n.container.querySelectorAll('.suspend-item');
			n.itemWidth = n.items[0].offsetWidth;
			n.btn = n.container.querySelector('.suspend-btn');
			addEvent(n.btn, 'click', n.toggle, false);
			var type = n.params.type.split('-');
			if(type[1] && type[1] == 'reverse') {
				n.params.type = type[0];
				n.reverse = true;
			}
		};

		n.pageInit();
		return n;
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
	var animationEnd = function(elem, handler) {
		elem.addEventListener('animationend', handler, false);
		elem.addEventListener('webkitAnimationEnd', handler, false);
		elem.addEventListener('mozAnimationEnd', handler, false);
		elem.addEventListener('OAnimationEnd', handler, false);
	};
	var deleteAnimationEnd = function(elem, handler) {
		elem.removeEventListener('animationend', handler, false);
		elem.removeEventListener('webkitAnimationEnd', handler, false);
		elem.removeEventListener('mozAnimationEnd', handler, false);
		elem.removeEventListener('OAnimationEnd', handler, false);
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
	window.LazySuspend = LazySuspend;
})();
if(typeof(module) !== 'undefined') {
	module.exports = window.LazySuspend;
} else if(typeof define === 'function' && define.amd) {
	define([], function() {
		'use strict';
		return window.LazySuspend;
	});
}