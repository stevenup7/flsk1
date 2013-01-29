
var GoogleMapHandler = Backbone.View.extend({
    tagName: "div",
    map: undefined,
    mapmarkers: [],
    geocoder: undefined,
    infowindow: undefined,
    isMapInit: false,	
    initialize: function(){
	var mapOptions = {
	    zoom: 2,
	    center: new google.maps.LatLng(3.75, -145.72),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	this.infowindow = new google.maps.InfoWindow();
	this.geocoder = new google.maps.Geocoder();
	this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	this.isMapInit = true;
	
	console.log("map obj init");
    },    

    getColoredMarker: function(col){
	var pinColor = col;
	var pinImage = new google.maps.MarkerImage(
	    "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
		+ pinColor,
	    new google.maps.Size(21, 34),
	    new google.maps.Point(0,0),
	    new google.maps.Point(10, 34));
	var pinShadow = new google.maps.MarkerImage(
	    "http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
	    new google.maps.Size(40, 37),
	    new google.maps.Point(0, 0),
	    new google.maps.Point(12, 35));
	return [pinImage, pinShadow];
    }, 

    addMarker: function(location, color, title) {
	console.log("adding location");
	pinImage = getColoredMarker(color);
	marker = new google.maps.Marker({
	    position: location,
	    map: map, 
	    title: title,
	    icon: pinImage[0],
	    shadow: pinImage[1]
	});
	return marker;
    },

    switchBounce: function(marker, bouncing) {
	if (!bouncing) {
	    marker.setAnimation(null);
	} else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	}
    }


})
