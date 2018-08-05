; + function() {
	var addEvent = function(dom, type, handle, capture) {
		if(dom.addEventListener) {
			dom.addEventListener(type, handle, capture);
		} else if(dom.attachEvent) {
			dom.attachEvent("on" + type, handle);
		}
	};
	var requestAnimationFrame = function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
			window.setTimeout(a, 1e3 / 60, (new Date).getTime())
		};
	}();
	var cancelAnimationFrame = function() {
		return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id) {
			clearTimeout(id);
		};
	}();
	var getMax = function(a, b) {
		return Math.max.call(Math, a, b);
	};
	var removeClass = function(elem, className) {
		if(elem.classList) {
			elem.classList.remove(className);
		} else {
			elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};
	var addClass = function(elem, className) {
		if(elem.classList) {
			elem.classList.add(className);
		} else {
			elem.className += ' ' + className;
		}
	}
	var scrollSpys = document.querySelectorAll('.scrollSpy');
	var speed = 100;
	var min = 100;
	function removeAllClass(tabs){
		for(var i = 0; i < tabs.length; i++){
			var tab = tabs[i].querySelector('a');
			removeClass(tab, 'active');
		}
	}
	for(var i = 0; i < scrollSpys.length; i++) {
		var scrollSpy = scrollSpys[i];
		scrollSpy.isScrolling = false;
		var tabs = scrollSpy.querySelectorAll('.scrollSpy-tabs>ul>li');
		//使用闭包保持数据
		(function(scrollSpy, tabs) {
			//监听滚动
			addEvent(scrollSpy, 'scroll', function(e) {
				var top = this.scrollTop;
				var length = tabs.length;
				for(var j = 0; j < length; j++) {
					var tab = tabs[j].querySelector('a');
					var id = tab.href.split('#')[1];
					var cur = document.getElementById(id);
					var next = null;
					if((j + 1) < length) {
						next = tabs[j + 1].querySelector('a').href.split('#')[1];
						next = document.getElementById(next);
					};
					if(top >= cur.offsetTop) {
							removeAllClass(tabs);
						if(next && next.offsetTop >= top) {
							addClass(tab, 'active');
						} else {
							addClass(tabs[length - 1].querySelector('a'), 'active');
						}
					}
				}
			});
		})(scrollSpy, tabs);
		for(var j = 0; j < tabs.length; j++) {
			var tab = tabs[j].querySelector('a');
			(function(tab, scrollSpy) {
				//为tab添加点击事件
				addEvent(tab, 'click', function(e) {
					e = e || window.event;
					//阻止a的默认事件
					if(e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					};
					var id = this.href.split('#')[1];
					var con = document.getElementById(id);
					if(con) {
						var tabs = this.parentNode.parentNode.querySelectorAll('li');
						for(var t = 0; t < tabs.length; t++) {
							removeClass(tabs[t].querySelector('a'), 'active');
						};
						addClass(tab, 'active');
						//获取目标位置
						var top = con.offsetTop;
						var scroll = scrollSpy;
						scrollSpyTo.call(this, scroll, top);
					}
				});
			})(tab, scrollSpy);
		}
	}

	function scrollSpyTo(el, top) {
		//判断是往上滚动还是往下滚动
		var a = el.scrollTop - top >= 0 ? true : false;
		var tab = this;
		// 获取每次滚动的最大值
		var vy = getMax(Math.abs(el.scrollTop - top) / speed, min);
		var tick = function() {
			if(a) {
				el.scrollTop -= vy;
			} else {
				el.scrollTop += vy;
			};
			if((!a && el.scrollTop < top) || (a && el.scrollTop > top)) {
				requestAnimationFrame(tick);
			} else {
				el.scrollTop = top;
			}
		};
		tick();
	}

}();