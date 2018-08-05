+ function() {
	'use strict';
	var getStyle = function(dom, attr) {
		return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
	};
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
	var lyTable = document.querySelectorAll('.table-fixed');
	var btSelectAll = null;

	function addSelect(t) {
		var thead = t.querySelector('thead');
		var firstTh = thead.querySelector('tr>th:first-child');
		var dataset = firstTh.dataset;
		if(!dataset['checkbox']) return;
		var tbody = t.querySelector('tbody');
		var trs = tbody.querySelectorAll('tr');
		if(dataset['checkbox']) {
			btSelectAll = document.createElement('input');
			btSelectAll.className = 'btSelectAll';
			if(dataset['checkbox']) {
				btSelectAll.type = 'checkbox';
			};
			thead.querySelector('tr>th:first-child').appendChild(btSelectAll);
		};

		function addItem(item) {
			var firstChild = item.firstElementChild;
			var input = document.createElement('input');
			var td = document.createElement('td');
			if(dataset['checkbox']) {
				input.type = 'checkbox';
			};
			td.appendChild(input);
			if(firstChild) {
				item.insertBefore(td, firstChild);
			} else {
				item.appendChild(td);
			}
		};
		for(var n = 0; n < trs.length; n++) {
			addItem(trs[n]);
		}
	};

	function LyTable(t) {
		var table = t.querySelector('table');
		var thead = t.querySelector('thead');
		var tbody = t.querySelector('tbody');
		var thList = thead.querySelectorAll('tr>th');
		addSelect(t);
		var box = t.querySelector('.table-fixed-box');
		var header = document.createElement('div');
		header.className = 'fixed-table-header';
		t.insertBefore(header, box);
		var hdiv = null;
		var w = 0;
		var length = thList.length;
		for(var j = 0; j < length; j++) {
			hdiv = document.createElement('div');
			hdiv.className = 'th-inner';
			hdiv.innerHTML = thList[j].innerHTML;
			var html = thList[j].innerHTML;
			thList[j].innerHTML = '';
			thList[j].appendChild(hdiv);
			var tw = parseInt(getStyle(hdiv, 'width'));
			tw = tw > thList[j].offsetWidth ? tw : thList[j].offsetWidth;
			hdiv.style.width = tw + 'px';
			var h = document.createElement('div');
			h.style.width = tw + 'px';
			h.innerHTML = html;
			thList[j].appendChild(h);
			if(j != length - 1) {
				w += tw;
			}
		};
		t.style.paddingTop = thList[0].querySelector('.th-inner').offsetHeight + 'px';
		box.style.height = table.getAttribute('data-minHeight') + 'px';
		//考虑滚动条宽度，重新计算最后一格的宽度
		hdiv.style.width = (header.offsetWidth - w) + 'px';
	};
	for(var i = 0; i < lyTable.length; i++) {
		LyTable(lyTable[i]);
	};
	var selectAll = document.querySelectorAll('.btSelectAll');
	for(var i = 0; i < selectAll.length; i++) {
		selectAll[i].onchange = function(e) {
			eventBroker(e, 'btSelectAll', function() {}, function(target) {
				var checked = target.checked;
				var tbody = target.parentNode.parentNode.parentNode.parentNode.nextElementSibling;
				var td = tbody.querySelectorAll('tr');
				Array.prototype.forEach.call(td, function(t) {
					t.querySelector('td:first-child input').checked = checked;
				})
			});
		}
	}
}();