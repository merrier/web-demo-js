; + function() {
	var setTransform = function(element, animation) {
		element.style.webkitTransform = animation;
		element.style.mozTransform = animation;
		element.style.oTransform = animation;
		element.style.msTransform = animation;
		element.style.transform = animation;
	};

	function anim(m, a, b, s, w) {
		m.timer = setInterval(function() {
			a.translateX -= s;
			b.translateX -= s;
			if(a.translateX <= -w) {
				a.translateX = w;
			};
			if(b.translateX <= -w) {
				b.translateX = w;
			};
			setTransform(a, 'translate(' + a.translateX + 'px,0)');
			setTransform(b, 'translate(' + b.translateX + 'px,0)');
		}, 80);
	};
	var marquee = document.querySelectorAll('.marquee-box');
	for(var i = 0; i < marquee.length; i++) {
		var m = marquee[i];
		var inner = m.querySelector('.marquee-inner');
		var width = inner.offsetWidth;
		var bWidth = m.offsetWidth;
		if(bWidth < width * 2) {
			var clone = inner.cloneNode(true);
			m.appendChild(clone);
			var ax = 3;
			setTransform(clone, 'translate(' + width + 'px,0)');
			inner.translateX = 0;
			clone.translateX = width;
			anim(m, inner, clone, ax, width);
			m.addEventListener('mouseover', function() {
				clearInterval(this.timer);
			});
			m.addEventListener('mouseout', function() {
				anim(m, inner, clone, ax, width);
			});
		}
	}
}();