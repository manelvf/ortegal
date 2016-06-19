(function($) {

// plugin definition
var flickrWithin = function(options) {
    var defaults = {
        loading: 'Loading',
        error_geo: 'Geolocation not supported',
        error_pos: 'Failed in getting current position',
        error_flickr: 'There was a problem connecting to Flickr',
        error_nopic: 'No pictures found in your area',
		caption: 'figcaption',
        api_key: ''
    },

    // extend default options with those provided
        opts = $.extend(defaults, options),

    // system variables
        _type = 'json',
        flickr_api_url = 'https://api.flickr.com/services/rest/?jsoncallback=?',
        flickr_title = '',
        flickr_api = {  // flickr.com/services/api/flickr.photos.search.html
            method: 'flickr.photos.search',
            api_key: opts.api_key,
            content_type: 1,
            media: 'photos',
            per_page: 10,
						bbox: "-8.1, 43.60, -7.65, 43.81",
            format: _type,
            nojsoncallback: 1
        };

        function do_it(position) {
						flickr_api.page = parseInt(Math.random()*370);

            $.get(flickr_api_url, flickr_api, function(data) {

								if (data.photos.photo.length == 0) {
										setTimeout(function() { do_it(); }, 0);
										//$caption.html(opts.error_nopic);
								}
								else {
										do_gallery(data.photos.photo);
								}
						}, _type)
						.error(function() {
								error(opts.error_flickr);
						});
				}

				do_it();
    };

$(document).ready(function() {
    flickrWithin({api_key: '6dddebee5be2e64d9cecdd1050906d83'});
});


var flickr_img_url = 'https://farm{farm}.static.flickr.com/{server}/{id}_{secret}_z.jpg';


function do_gallery(photos) {

var pswpElement = document.querySelector('.pswp');

var items = [];
var image_url;
var images = [];
var loadCounter = 0;

$.each(photos, function(i, pic) {

		image_url = flickr_img_url.replace(
				/({)([\w\-]+)(})/gi,
				function(str, p1, p2) {return pic[p2];}); // replace each {key} with its value

		image = new Image();
		image.addEventListener("load", function() {
			loadCounter++;
		});
		image.src = image_url;

	  images.push({
				original: image,
				src: image_url,
				title: pic.title
		});
});

max_time = 10 * 1000;  // 10 seconds
cur_time = Date.now();

function check_loading() {
	if ((Date.now() - cur_time) > max_time) {
		return;
	} else if (loadCounter < 10) {
		window.setTimeout(check_loading, 1000);
  } else {
		draw_gallery();
	}
}

window.setTimeout(check_loading, 1000);

// define options (if needed)
var options = {
    // optionName: 'option value'
    // for example:
    index: 0 // start at first slide
};

function draw_gallery() {

$.each(images, function(i, pic) {
		items.push({
			title: pic.title,
			src: pic.src,
			w: pic.original.width,
			h: pic.original.height
		});
});

		// Initializes and opens PhotoSwipe
		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
}

}
})(jQuery);
