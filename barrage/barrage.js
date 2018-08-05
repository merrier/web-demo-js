(function() {
	var barrages = [];
	var Barrage = function(params) {
		'use strict';
		var n = this;
		if(!(this instanceof Barrage)) return new Barrage(params);
		var defaults = {
			height: '40',
			borderRadius: '20',
			backgroundColor: 'rgba(0,0,0,.5)',
			color: '#fff',
			speed: 6,
			bottom: 60
		};
		var width = window.innerWidth;
		var wHeight = window.innerHeight;
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
			}
		};
		for(var def in defaults) {
			if(typeof params[def] === 'undefined' || params[def] === '') {
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
		n.isInView = function(b) {
			n.params.bottom = parseInt(n.params.bottom);
			if(n.params.bottom >= (wHeight - b.offsetHeight)) {
				n.params.bottom -= 40;
			} else if(n.params.bottom <= 0) {
				n.params.bottom += 40;
			}
		};
		n.createBarrage = function() {
			n.barrage.innerHTML += n.params.text;
			if(!n.originalParams.bottom) {
				n.params.bottom = Math.ceil(Math.random() * wHeight);
			};
			n.isInView(n.barrage);
			n.css(n.barrage, {
				color: n.params.color,
				backgroundColor: n.params.backgroundColor,
				borderRadius: n.params.borderRadius + 'px',
				bottom: n.params.bottom + 'px'
			});
			document.body.appendChild(n.barrage);
			n.barrage.right = -(n.barrage.offsetWidth + 20);
			n.css(n.barrage, {
				right: n.barrage.right + 'px'
			});
			n.barrage.timeoutId = setInterval(function() {
				if(n.barrage.stoped) return;
				if(n.barrage.right <= (n.barrage.offsetWidth + width)) {
					n.barrage.right += 1;
					n.css(n.barrage, {
						right: n.barrage.right + 'px'
					});
				} else {
					clearInterval(n.barrage.timeoutId);
					barrages.splice(n.barrage.index, 1);
					document.body.removeChild(n.barrage);
				}
			}, n.params.speed);
			n.barrage.addEventListener('mouseover', function() {
				n.barrage.stoped = true;
			});
			n.barrage.addEventListener('mouseout', function() {
				n.barrage.stoped = false;
			});
		};
		(function() {
			n.barrage = document.createElement('div');
			n.barrage.className = 'sg-barrage';
			var img = new Image();

			function addHeader(img) {
				var a = document.createElement('a');
				a.appendChild(img);
				a.setAttribute('target', '_blank');
				n.params.url && (a.href = n.params.url);
				n.barrage.appendChild(a);
				n.createBarrage();
			}
			if(n.params.img) {
				img.onload = function() {
					addHeader(img);
				};
				img.onerror = function() {
					addHeader(img);
				};
				img.src = n.params.img;
			} else {
				n.createBarrage();
			};
		})();

		return n;
	};
	Barrage.prototype.removeAll = function() {
		barrages.forEach(function(b) {
			clearInterval(b.timeoutId);
		});
		barrages = [];
	};
	window.Barrage = function(params) {
		var item = new Barrage(params);
		item.index = barrages.length;
		barrages.push(item.barrage);
		return item;
	};
})();