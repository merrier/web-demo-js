(function() {
	'use strict';
	window.NFullscreen = function(container, params) {
		var nf = this;
		var options = {
			container: container,
			width: window.innerWidth,
			height: window.innerHeight,
			pagination: false,
			paginationClickable: false
		};
		var originParams = {};
		params = params || {};
		for(var param in params) {
			if(typeof params[param] === 'object') {
				originParams[param] = {};
				for(var defPa in params[param]) {
					originParams[param][defPa] = params[param][defPa];
				}
			} else {
				originParams[param] = params[param];
			}
		};
		for(var opt in options) {
			if(typeof params[opt] === 'object') {
				for(var defOpt in options[opt]) {
					if(typeof params[opt][defOpt] === 'undefined') {
						params[opt][defOpt] = options[opt][defOpt];
					}
				}
			} else if(typeof params[opt] === 'undefined') {
				params[opt] = options[opt];
			}
		};
		nf.originParams = originParams;
		nf.params = params;
		nf.container = null;
		nf.wrapper = null;
		nf.activeIndex = 0;
		nf.totalSlides = 0;
		nf.scrollY = 0;
		nf.isScroll = false;
		nf.initPage = function() {

			document.addEventListener('DOMContentLoaded', function() {
				//					document.oncontextmenu = function() {
				//						return false;
				//					};
				document.addEventListener('keydown', function(e) {
					e.preventDefault();
					return false;
				});
			});

			window.onload = function() {
				nf.container = document.querySelector(".fullscreen-container");
				nf.wrapper = nf.container.firstElementChild;
				nf.refreshView(nf.container);
				var type = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
				if(document.attachEvent) {
					document.attachEvent("on" + type, nf.scrollFunc);
				}else if(document.addEventListener) {
					document.addEventListener(type, nf.scrollFunc, false);
				}
					//滚动滑轮触发scrollFunc方法
					//				window.onmousewheel = document.onmousewheel = nf.scrollFunc;
				nf.pageTransitionEnd();
			};
			nf.resize();
		};
		nf.initPagePagination = function(slide) {
			nf.pagination = document.createElement('div');
			nf.pagination.className = 'fullscreen-pagination';
			for(var i = 0; i < slide.length; i++) {
				slide[i].style.height = nf.params.height + "px";
				var tab = document.createElement("span");
				if(i == 0) {
					tab.className = "fullscreen-pagination-bullet fullscreen-pagination-bullet-active";
				} else {
					tab.className = "fullscreen-pagination-bullet";
				}
				tab.index = i;
				nf.pagination.appendChild(tab);
			};
			nf.container.appendChild(nf.pagination);
			if(nf.params.paginationClickable) {
				var p = document.querySelector('.fullscreen-pagination').getElementsByClassName('fullscreen-pagination-bullet');
				for(var i = 0; i < p.length; i++) {
					p[i].addEventListener('click', function() {
						var index = this.index;
						nf.scrollTo(index);
					});
				};
			};
		};
		nf.refreshView = function(elem) {
			var wHeight = nf.params.height;
			nf.wrapper = elem.firstElementChild;
			var slides = nf.container.getElementsByClassName("fullscreen-slide");
			if(nf.params.pagination) {
				nf.initPagePagination(slides)
			};
			nf.totalSlides = slides.length;
			nf.wrapper.style.height = wHeight * nf.totalSlides.length + "px";
		};
		nf.scrollFunc = function(e) {
			var direct = 0;
			e = e || window.event;
			if(!nf.isScroll) {
				if(e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件             
					if(e.wheelDelta > 0) { //当滑轮向上滚动时
						nf.scrollPrev();
					} else if(e.wheelDelta < 0) { //当滑轮向下滚动时
						nf.scrollNext();
					};
				} else if(e.detail) { //Firefox滑轮事件
					if(e.detail < 0) { //当滑轮向上滚动时
						nf.scrollPrev();
					} else if(e.detail > 0) { //当滑轮向下滚动时
						nf.scrollNext();
					};
				};
			};
		};
		nf.scrollPrev = function() {
			if(nf.activeIndex > 0) {
				nf.isScroll = true;
				nf.scrollY += nf.params.height;
				nf.wrapper.style.transform = "translate3d(0," + nf.scrollY + "px,0)";
				nf.activeIndex--;
			};
		};
		nf.scrollNext = function() {
			if(nf.activeIndex < nf.totalSlides - 1) {
				nf.isScroll = true;
				nf.scrollY -= nf.params.height;
				nf.wrapper.style.transform = "translate3d(0," + nf.scrollY + "px,0)";
				nf.activeIndex++;
			};
		};
		nf.scrollTo = function(index) {
			if(index < nf.totalSlides) {
				nf.isScroll = true;
				nf.scrollY += nf.params.height * (nf.activeIndex - index);
				nf.wrapper.style.transform = "translate3d(0," + nf.scrollY + "px,0)";
				nf.activeIndex = index;
			};
		};
		nf.pageTransitionEnd = function(fullscreen) {
			var slides = nf.wrapper.querySelectorAll(".fullscreen-slide");
			var pagination = document.querySelectorAll(".fullscreen-pagination-bullet");
			nf.wrapper.addEventListener("transitionend", function() {
				nf.isScroll = false;
				for(var i = 0; i < slides.length; i++) {
					slides[i].className = "fullscreen-slide";
					pagination[i].className = "fullscreen-pagination-bullet";
				};
				slides[nf.activeIndex].className += " active";
				pagination[nf.activeIndex].className += " fullscreen-pagination-bullet-active";
			});

			function start() {
				nf.isScroll = true;
				if(nf.params.pageChangeStart) {
					nf.params.pageChangeStart(nf);
				};
			};

			function end() {
				nf.isScroll = false;
				if(nf.params.pageChangeEnd) {
					nf.params.pageChangeEnd(nf);
				};
			};
			nf.transitionStart(nf.wrapper, start);
			nf.transitionEnd(nf.wrapper, end);
		};
		nf.transitionStart = function(elem, handler) {
			elem.addEventListener('transitionstart', handler, false);
			elem.addEventListener('webkitTransitionStart', handler, false);
			elem.addEventListener('mozTransitionStart', handler, false);
			elem.addEventListener('oTransitionStart', handler, false);
		};
		nf.transitionEnd = function(elem, handler) {
			elem.addEventListener('transitionend', handler, false);
			elem.addEventListener('webkitTransitionEnd', handler, false);
			elem.addEventListener('mozTransitionEnd', handler, false);
			elem.addEventListener('oTransitionEnd', handler, false);
		};
		nf.resize = function() {
			window.addEventListener('resize', function() {
				nf.initPage();
			});
		};
		nf.initPage();
		return nf;
	};
})();