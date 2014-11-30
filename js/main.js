(function() {

	"use strict";

	var url = "http://www.panoramio.com/map/get_panoramas.php?set=public&from={from}&to={to}&minx={minx}&miny={miny}&maxx={maxx}&maxy={maxy}&size=medium&callback=?";

	$(document).ready(function() {
		var w = window.screen.availWidth;
		var h = window.screen.availWidth;
		var nw = Math.ceil(w/320);
		var nh = Math.ceil(h/240);

		var total = nw*nh;

		var cur_left = 0;
		var cur_top = 0;
		var cur_line = 0;

		var from = parseInt(Math.random()* 500);

		var params = {
			from: from,
			to: from + total,
			minx: -8.1,
			miny: 43.60,
			maxx: -7.65,
			maxy: 43.81
		};

		$.getJSON(t(url, params), function(data) {
			for (var k in data.photos) {
				if (cur_left > w) {
					cur_line++;
					cur_left = 0;
				}
				console.log(cur_left, cur_line);
				var cur_photo = data.photos[k];
				var img = document.createElement('div');
				img.style.width = "320px";
				img.style.height = "240px";
				img.style.position = "absolute";
				img.style.top = (240*cur_line) + 'px';
				img.style.left = cur_left + 'px';
				img.style.backgroundImage = 'url("' + cur_photo.photo_file_url + '")';
				document.body.appendChild(img);
				cur_left += 320;

			}

		});

	});

	function t(s,d){
		for(var p in d)
			s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
		return s;
	}

})();
