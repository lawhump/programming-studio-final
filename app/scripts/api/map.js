// Doesn't work when I tried to move it around so keeping it right here for now lol
function initMap() {
  app.Map = new app.views.Map();
}

// Without this, map container has no height
$(window).on('resize', function() {
	var h = $(window).height(),
        offsetTop = 0; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();