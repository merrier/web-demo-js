(function(){
	//日历
	window.NCalendar = function(container, params) {
		'use strict';
		params = params || {};
		var options = {
			container: container,
			width: window.innerWidth
		};
		var nc = this;
		var originParams = {};
		var isClick = false;
		nc.year = 0;
		nc.month = 0;
		var week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
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
		nc.originParams = originParams;
		nc.params = params;

		//获取当月有多少天,当月第一天是星期几
		function getMonthDay(year, month) {
			var curDate = new Date();
			//设置年月
			curDate.setFullYear(year);
			curDate.setMonth(month);
			curDate.setDate(0);
			var dd = curDate.getDate();
			curDate.setDate(1);
			var item = curDate.getDay();
			if(item == 0) {
				item = 7;
			};
			return {
				"total": dd,
				"day": item
			};
		}
		//当天是星期几
		function getCurrentDay() {
			var curDate = new Date();
			var cd = curDate.getDay();
			return cd - 1;
		}
		//获取前一天或后一天
		function getSomeDay(day, add) {
			var now = new Date(day);
			now.setDate(now.getDate() - add);
			var y = now.getFullYear();
			var m = now.getMonth() + 1;
			m = m < 10 ? "0" + m : m;
			var d = now.getDate();
			d = d < 10 ? "0" + d : d;
			return {
				"y": y,
				"m": m,
				"d": d
			};
		}
		//切割字符
		function splitNum(v) {
			var v = parseInt(v).toString();
			return v;
		}
		//返回星期几
		function getWeek(v) {
			return week[Math.floor(v % 7)];
		}
		//绘制日历
		function drawCalendar(selectYear, selectMonth) {
			var date = new Date();
			var itemWidth = Math.floor(nc.params.width / 7);
			if(typeof selectYear === 'undefined') {
				var calendar = '<div id="nCalendar" class="calendar" style="width:' 
					+ nc.params.width + 'px;"><div class="calendar-tool">';
				calendar += '<div class="calendar-select"><div class="calendar-select-prev">';
				calendar += '<i class="ion ion-chevron-left"></i></div></div>';
				calendar += '<div class="calendar-today"></div>';
				calendar += '<div class="calendar-select"><div class="calendar-select-next">'
				calendar += '<i class="ion ion-chevron-right"></i></div></div></div>';
				calendar += '<div class="calendar-header">';
				if(nc.params.sunFirst){
					week.unshift(week[week.length - 1]);
					week.pop();
				};
				for(var i = 0; i < week.length; i++) {
					calendar += '<div class="item">' + week[i] + '</div>';
				};
				calendar += '</div>';
				calendar += '<div class="calendar-body"></div>';
				calendar += '</div>';
				var c = document.querySelectorAll(nc.params.container)[0];
				if(c) {
					c.innerHTML = calendar;
					nc.year = date.getFullYear();
					nc.month = date.getMonth() + 1;
				} else {
					return;
				}
			} else {
				nc.year = selectYear;
				nc.month = selectMonth;
			};

			if(nc.month >= 13) {
				nc.month = 1;
				nc.year += 1;
			} else if(nc.month <= 0) {
				nc.month = 12;
				nc.year -= 1;
			};
			var curDate = format(nc.year + '-' + nc.month + '-' + date.getDate());
			document.querySelector('.calendar-today').innerHTML = curDate;
			var cc = document.querySelector(".calendar-body");
			cc.innerHTML = "";
			var data = getMonthDay(nc.year, nc.month);
			var first = data.day;
			var total = data.total;
			var curDay = splitNum(date.getDate());
			var dd = getSomeDay(nc.year + "-" + nc.month + "-1", 1);
			var rows = 6;
			var cols = 7;
			var tr = "";
			var item = '';
			//绘制上个月日期
			if(nc.params.sunFirst){
				first += 1;
				first = first == 8 ? 1 : first;
			};
			for(var i = 0; i < first - 1; i++) {
				var ymd = nc.year + "-" + (nc.month - 1) + "-" + (dd.d - first + i + 2);
				item += '<div  class="item pass" data-value="' + ymd 
					+ '" data-year="' + nc.year + '" data-month="' 
					+ (nc.month - 1) + '" data-date="' 
					+ (dd.d - first + i + 2) + '">' + (dd.d - first + i + 2) + '</div>';
			}
			//绘制当月日期
			for(var i = 1; i < (total + 1); i++) {
				var ymd = nc.year + "-" + (nc.month) + "-" + i;
				if(i == curDay && nc.month == (date.getMonth() + 1)) {
					item += '<div class="item current selected" data-value="' 
						+ ymd + '" data-year="' + nc.year + '" data-month="' 
						+ (nc.month) + '" data-date="' + i + '">' + i + '</div>';
				} else {
					item += '<div  class="item" data-value="' + ymd + '" data-year="' 
						+ nc.year + '" data-month="' + (nc.month) 
						+ '" data-date="' + i + '">' + i + '</div>';
				}
			};
			//绘制下个月日期
			var both = total + first - 1;
			var b1 = (rows - 1) * cols;
			var b2 = rows * cols;
			if(both < b1) {
				for(var i = 0; i < (b1 - both); i++) {
					var ymd = nc.year + "-" + (nc.month + 1) + "-" + (i + 1);
					item += '<div  class="item future" data-value="'
						+ ymd + '" data-year="' + nc.year + '" data-month="' 
						+ (nc.month + 1) + '" data-date="' + (i + 1) + '">' + (i + 1) + '</div>';
				}
			} else if(both > b1) {
				for(var i = 0; i < b2 - both; i++) {
					var ymd = nc.year + "-" + (nc.month + 1) + "-" + (i + 1);
					item += '<div  class="item future"  data-value="' 
						+ ymd + '" data-year="' + nc.year + '" data-month="' 
						+ (nc.month + 1) + '" data-date="' + (i + 1) + '">' + (i + 1) + '</div>';
				}
			};
			cc.innerHTML = item;
			var items = document.getElementById('nCalendar').getElementsByClassName("item");
			for(var i = 0; i < items.length; i++) {
				items[i].style.width = itemWidth + 'px';
				items[i].style.height = itemWidth + 'px';
				items[i].style.lineHeight = itemWidth + 'px';
				if(i > 6) {
					items[i].setAttribute("data-index", (i - 6));
				}
			};
			addClickEvent();
			nc.params.selectDate = format(document.querySelector('.calendar-today').textContent);
			nc.params.onChange && nc.params.onChange(nc.params.selectDate);
		}
		
		function format(d){
			d = d.split('-');
			for(var i = 0; i < d.length; i++){
				if(parseInt(d[i]) < 10){
					d[i] = '0' + d[i];
				}
			};
			return d.join('-');
		}
		function addClickEvent() {
			var prev = document.querySelector('.calendar-select-prev');
			var next = document.querySelector('.calendar-select-next');
			//前一天或后一天点击事件
			if(!isClick) {
				prev.addEventListener("click", function(e) {
					drawCalendar(nc.year, nc.month - 1);
					e.stopPropagation();
				});
				next.addEventListener("click", function(e) {
					drawCalendar(nc.year, nc.month + 1);
					e.stopPropagation();
				});
			};
			// 为天数添加点击事件
			nc.items = document.querySelector('.calendar-body').querySelectorAll(".item:not(.pass):not(.future)");
			for(var i = 0; i < nc.items.length; i++) {
				nc.items[i].onclick = function() {
					var index = this.getAttribute('data-index') - 1;
					var year = this.getAttribute("data-year");
					var month = this.getAttribute("data-month");
					document.querySelector('.calendar-today').innerHTML = format(this.getAttribute('data-value'));
					for(var i = 0; i < nc.items.length; i++) {
						nc.items[i].className = nc.items[i].className.replace(" selected", "");
					};
					this.className += " selected";
					nc.params.onChange && nc.params.onChange(format(this.getAttribute('data-value')));
				}
			};
			isClick = true;
		};

		drawCalendar();
		return nc;
	};

})();
