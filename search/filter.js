(function() {
	var SFilter = function(container, params) {
		'use strict';
		var n = this;
		if(!(this instanceof SFilter)) return new SFilter(container, params);
		var defaults = {
			cols: 5,
			fall3D: false
		};
		params = params || {};
		var originalParams = {};
		for(var param in params) {
			if(typeof params[param] === 'object') {
				originalParams[param] = {};
				for(var deepParam in params[param]) {
					originalParams[param][deepParam] = params[param][deepParam];
				}
			} else {
				originalParams[param] = params[param];
			}
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
		if(!n.container || (n.container.length && n.container.length == 0)) return;
		if(n.container.length && n.container.length > 1) {
			var fall = [];
			for(var i = 0; i < n.container.length; i++) {
				fall.push(new SFilter(n.container[i], params));
			};
			return fall;
		};
		n.container = n.container[0] || n.container;
		var eventBroker = function(e, className, fn, success) {
			var target = e.target;
			var isInView = false;
			while(target) {
				if(target && target.nodeName == '#document') {
					fn && fn();
					isInView = false;
				} else if(target.classList.contains(className)) {
					isInView = true;
					success && success(target);
					break;
				};
				target = target.parentNode;
			};
			return isInView;
		};
		n.pageInit = function() {
			n.input = n.container.querySelector('input');

			function inputChange(dom, fn, capture) {
				capture = capture || false;
				dom.addEventListener('input', fn, capture);
				dom.addEventListener('propertychange', fn, capture);
			}

			function filterInit(input) {
				n.panel = document.createElement('div');
				n.panel.className = 'filter-panel';
				var ul = document.createElement('ul');
				n.panel.appendChild(ul);
				input.parentNode.appendChild(n.panel);
			}

			function closePanel() {
				if(n.panel) {
					n.panel.style.display = 'none';
					n.container.classList.remove('filter-open');
				}
			}

			function toFilter() {
				var box = n.panel.querySelector('ul');
				var value = this.value;
				var w = n.params.data;
				if(value.trim() == '') return;
				box.innerHTML = '';
				var list = [];
				for(var i = 0; i < w.length; i++) {
					if(w[i].indexOf(value) != -1) {
						list.push('<li>' + w[i] + '</li>');
					};
				};
				box.innerHTML = list.join('');
				n.panel.style.display = 'block';
				setTimeout(function() {
					n.container.classList.add('filter-open');
				}, 200);
			};

			filterInit(n.input);
			inputChange(n.input, toFilter);
			document.addEventListener('click', function(e) {
				eventBroker(e, 'filter', closePanel);
			});
		};
		n.pageInit();
		return n;
	};
	window.SFilter = SFilter;
})();