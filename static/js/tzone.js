$(document).ready(function(){

    var TZoneApp = Backbone.View.extend({
	tagName: "div",
	cols: d3.scale.category10(),
	events: {
	    "click .x" : "test"
	},
	initialize: function(){
	    this.map = new GoogleMapHandler();
	    getUserLocation();
	
	    
	},
	render: function(){
	    console.log("render");
	},
	test: function(){
	    console.log("test");
	}
    });


    var app = new TZoneApp()


    // callback for getUserLocation 
    function showUserPosition(position) {
	getTimeZone(position.coords.latitude, position.coords.longitude, showUserTimeZone, showUserTimeZoneFail);
    }

    function showUserTimeZone(lat, lng, data){
	var loc = new google.maps.LatLng(lat, lng);
	map.setCenter(loc);
	map.setZoom(10);
	addLocation(lat, lng, data, "Your location");

	//    markers.me = addMarker(loc, "0088CC", "My Location");
	$("#your-location .btn-group .btn").click(function(){
	    $("#stepCarousel").carousel('next');
	    $("#stepCarousel .left").show();
	    map.setZoom(1);
	});
    }
    function showUserTimeZoneFail(){
	// use local info from browser ?
	alert("could not find a timezone location for your location");
    }
    function addLocation(lat, lng, tzone, name){
	if(name === undefined){
	    name = "friend";
	    $("#stepCarousel").carousel(2);
	} else {

	}

	pinImage = getColoredMarker();
	var loc = new google.maps.LatLng(lat, lng);
	$("#nofriends").hide();
	// colors 
	var markerid = markers.contacts.length;
	var id = "friend_" + markerid;
	col = cols(id).replace("#","");

	markers.contacts.push( addMarker(loc, col, tzone.timezoneId));

	$("#friendlist").append(
	    "<p id='" + id + "'>" 
		+ '<i class="icon icon-user icon-white" style="background-color: #' + col + ';border: 2px solid #' + col + '"></i>'
		+ name + ' at ' + tzone.timezoneId 
		+ '<button type="button" class="close">&times;</button>'
		+ "</br>" + tzone.time  
		+ "</p>"
	);
	$("#friendlist #" + id + " .close").click(function(){
	    var markerid = id.split("_")[1];

	    markers.contacts[markerid].setMap(null);
	    $(this).parents("p").remove();
	});
	$("#friendlist #" + id).mouseover(function(){
	    $(this).css({"background-color": "#efefef"});
	    switchBounce(markers.contacts[markerid], true);
	});
	$("#friendlist #" + id).mouseout(function(){
	    $(this).css({"background-color": "white"});
	    switchBounce(markers.contacts[markerid], false);
	});
    }

    function addLocationFail(){
	$("#map-message .heading").html("Error");
	$("#map-message .message").html("No timezone information for this location");
	$("#map-message").show()
	setTimeout(function(){
	    $("#map-message").fadeOut("slow");
	}, 10000);
	$("#map-message .close").click(function(){$(this).parent().hide()});
    }

    function getTimeZone(lat, lng, callBack, failCallBack){
	var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' + lat + '&lng=' + lng + "&callback=?";
	$.getJSON(url, function(data) {
	    if(data["timezoneId"]){

		callBack(lat,lng, data);
	    } else {
		failCallBack()
	    }
	});
    }

    function getUserLocation(){
	// locally scoped funciton
	var positionError = function(err) {
	    if(err.code == 1) {
		// TODO: make UI
		alert("Error: Access is denied!");
	    }else if( err.code == 2) {
		// TODO: make UI
		alert("Error: Position is unavailable!");
	    }
	}
	if (navigator.geolocation){
	    var options = {timeout: 60000};
	    navigator.geolocation.getCurrentPosition(showUserPosition, positionError, options);
	}else{
	    console.log("Geolocation is not supported by this browser.");
	}
    }



    
});




