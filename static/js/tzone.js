$(document).ready(function(){
   var map,
       cols = d3.scale.category10()

   var markers = {
      me: undefined,
      contacts: []
   };

   initMap();
   getUserLocation();

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
      console.log("adding");
      $("#your-location .btn-group .btn").click(function(){
	 console.log("click");
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
      console.log("adding a friend at ",  tzone);
      pinImage = getColoredMarker();
      var loc = new google.maps.LatLng(lat, lng);
      $("#nofriends").hide();
      // colors 
      var markerid = markers.contacts.length;
      var id = "friend_" + markerid;
      col = cols(id).replace("#","");
      console.log(col);
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
	 console.log(id, this);
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
	    console.log(data);
	    callBack(lat,lng, data);
	 } else {
	    failCallBack()
	 }
      });
   }

   function initMap(){
      console.log("init with carousel");
      $("#stepCarousel").carousel({
	 interval: false
      });
      $("#stepCarousel #hide-help").click(function(){
	 // on the last screen should be able to dismiss help 
	 $(this).parents("#stepCarousel").hide();
      });
      var mapOptions = {
	 zoom: 2,
	 center: new google.maps.LatLng(3.75, -145.72),
	 mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var infowindow = new google.maps.InfoWindow();
      var geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      isMapInit = true;

      google.maps.event.addListener(map, 'click', function(event) {
	 console.log("getting timezone");
	 getTimeZone(event.latLng.lat(),  event.latLng.lng(), addLocation, addLocationFail);
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

   function getColoredMarker(col){
      var pinColor = col;
      var pinImage = new google.maps.MarkerImage(
	 "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
	 new google.maps.Size(21, 34),
	 new google.maps.Point(0,0),
	 new google.maps.Point(10, 34));
      var pinShadow = new google.maps.MarkerImage(
	 "http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
	 new google.maps.Size(40, 37),
	 new google.maps.Point(0, 0),
	 new google.maps.Point(12, 35));
      return [pinImage, pinShadow];
   }

   function addMarker(location, color, title) {
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
   }

   function switchBounce(marker, bouncing) {
      if (!bouncing) {
	 marker.setAnimation(null);
      } else {
	 marker.setAnimation(google.maps.Animation.BOUNCE);
      }
   }

   
});




