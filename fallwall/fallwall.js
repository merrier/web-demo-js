(function() {
	var WallFall = function(container, params) {
		'use strict';
		var n = this;
		if(!(this instanceof WallFall)) return new WallFall(container, params);
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
				fall.push(new WallFall(n.container[i], params));
			};
			return fall;
		};
		n.container = n.container[0] || n.container;
		var iHeight = [];
		n.isLoading = false;
		n.moveY = 0;
		n.isLoading = false;
		n.wrapper = n.container.querySelector('.fall-wrapper');
		n.refresh = function() {
			var items = n.container.querySelectorAll('.fall-item');
			for(var i = n.params.cols; i < items.length; i++) {
				if(items[i].classList.contains('news')) {
					n.countHeight(items, i);
					items[i].classList.remove('news');
				}
			};
			if(n.params.fall3D){
				n.scrollbar.style.height = n.getMax(iHeight) + 'px';
			}
		};
		n.countHeight = function(items, i) {
			var col = i % n.params.cols;
			var minHeight = n.getMin(iHeight);
			var min = iHeight.indexOf(minHeight);
			items[i].style.width = n.params.itemWidth + 'px';
			items[i].style.left = min * n.params.itemWidth + 'px';
			items[i].style.top = minHeight + 'px';
			iHeight[min] = n.getMin(iHeight) + items[i].offsetHeight;
		}
		n.pageInit = function() {
			n.params.itemWidth = n.container.offsetWidth / n.params.cols;
			var items = n.container.querySelectorAll('.fall-item');
			for(var i = 0; i < n.params.cols; i++) {
				var col = i % n.params.cols;
				items[i].style.width = n.params.itemWidth + 'px';
				items[i].style.left = col * n.params.itemWidth + 'px';
				items[i].style.top = '0px';
				iHeight[i] = items[i].offsetHeight;
				items[i].classList.add('moveIn');
			};
			for(var i = n.params.cols; i < items.length; i++) {
				n.countHeight(items, i);
				items[i].classList.add('moveIn');
			};
			if(n.params.fall3D) {
				n.scrollbar = document.createElement('div');
				n.scrollbar.className = 'fall-scrollbar';
				n.scrollbar.style.height = n.getMax(iHeight) + 'px';
				n.container.classList.add('fall3D');
				n.container.style.cssText = 'transform: translateX(-15vw) translateY(275px) rotateX(45deg) rotateZ(45deg);';
				n.container.style.position = 'fixed';
				n.scrollbar.style.height = n.getMax(iHeight) + 'px';
				n.container.parentNode.insertBefore(n.scrollbar, n.container);
			}
		};
		n.addItem = function(data) {
			var images = [];
			for(var i = 0; i < data.length; i++) {
				images.push(data[i].url);
			};
			n.isLoading = true;
			loadImages(images, function() {
				//为了解决图片加载问题，特意加上延时
				setTimeout(function() {
					for(var i = 0; i < images.length; i++) {
						var item = document.createElement('div');
						item.classList.add('fall-item');
						item.classList.add('moveIn');
						item.classList.add('news');
						item.innerHTML = '<div class="fall-inner"><div class="fall-media">' +
							'<img src="' + images[i] + '" alt="" />' +
							'</div><div class="fall-intro">' + data[i].title +
							'</div></div></div>';
						n.wrapper.appendChild(item);
					};
					n.refresh();
					n.isLoading = false;
				}, 500);
			});
			//加载图片
			function loadImages(sources, callback) {
				var count = 0,
					images = [],
					imgNum = sources.length;
				for(var k = 0; k < imgNum; k++) {
					images[k] = new Image();
					if(images[k].complete) {
						count++;
					} else {
						images[k].onload = function() {
							count++;
						};
					};
					images[k].src = sources[k];
				};
				if(count >= imgNum) {
					callback(images);
				}
			};
		};
		n.eventInit = function() {
			window.addEventListener('scroll', function() {
				var top = document.body.scrollTop;
				if(n.params.fall3D) {
					setTransform(n.wrapper, 'translate3d(0px, ' + (-top) + 'px, 0px)');
				}
				if(!n.isLoading && (top + window.innerHeight) >= n.getMin(iHeight)) {
					n.params.onLoad && n.params.onLoad(n);
					n.refresh();
				};
			}, false);
		};
		n.getMax = function(arr) {
			return Math.max.apply(Math, arr);
		};
		n.getMin = function(arr) {
			return Math.min.apply(Math, arr);
		};
		window.onload = function() {
			n.pageInit();
			n.eventInit();
		};
		return n;
	};
	window.WallFall = WallFall;
})();