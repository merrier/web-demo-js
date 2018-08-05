!function() {
	var lazyloadClassName = null;
	window.addEventListener('load',_loadImage);
	window.addEventListener('scroll',_loadImage);
	function _loadImage() {
		var imgList = document.querySelectorAll(".lazyload");
		for(var i = 0; i < imgList.length; i++) {
			var el = imgList[i];
			if(_isToShow(el)) {
				var imgUrl = el.getAttribute("data-src");
				el.setAttribute("src", imgUrl);
				el.className = el.className.replace("lazyload", "loaded");
			}
		};
	};

	function _isToShow(el) {
		var coords = el.getBoundingClientRect();
		var wHeight = window.innerHeight || document.documentElement.clientHeight;
		return (coords.top >= 0 && coords.left >= 0 && coords.top <= wHeight);
	};
}();