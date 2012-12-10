var map;


function getLocation(){
   if (navigator.geolocation){
      var options = {timeout: 60000};
      navigator.geolocation.getCurrentPosition(showPosition, positionError, options);
   }else{
      console.log("Geolocation is not supported by this browser.");
   }
}
function showPosition(position) {
   $("#your-location").show();
   console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
   map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
   map.setZoom(10);
}
function positionError(err) {
   if(err.code == 1) {
      alert("Error: Access is denied!");
   }else if( err.code == 2) {
      alert("Error: Position is unavailable!");
   }
}



function initMap(){
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
      var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng() + "&callback=?";
      $.getJSON(url, function(data) {
         if(data["timezoneId"]){
	    console.log(data);
            addZone(data.timezoneId);
         } else {
            alert("no timezone available for this location");
         }
      });
   });
}

initMap();
getLocation();