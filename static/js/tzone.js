var map;
var markers = {
   me: undefined,
   contacts: []
};

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

function getLocation(){
   if (navigator.geolocation){
      var options = {timeout: 60000};
      navigator.geolocation.getCurrentPosition(showPosition, positionError, options);
   }else{
      console.log("Geolocation is not supported by this browser.");
   }
}
function showPosition(position) {
   var loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
   map.setCenter(loc);
   map.setZoom(10);
   markers.me = addMarker(loc, "0088CC", "My Location");
   console.log("adding");
   $("#your-location .btn-group .btn").click(function(){
      console.log("click");
      $("#stepCarousel").carousel('next');
      $("#stepCarousel .left").show();
      map.setZoom(1);
   });
}
function positionError(err) {
   if(err.code == 1) {
      alert("Error: Access is denied!");
   }else if( err.code == 2) {
      alert("Error: Position is unavailable!");
   }
}

function addMyLocationFail(){
   console.log("show error")
   $("#map-message .heading").html("Error");
   $("#map-message .message").html("No timezone information for this location");
   $("#map-message").show()
   setTimeout(function(){
      $("#map-message").fadeOut("slow");
   }, 5000);

   $("#map-message .close").click(function(){$(this).parent().hide()});
}

function addMyLocation(lat, lng, tzone){   
   console.log("adding a friend at ",  tzone);
   pinImage = getColoredMarker();
   var loc = new google.maps.LatLng(lat, lng);
   $("#nofriends").hide();
   markers.contacts.push( addMarker(loc, "FE7569", tzone.timezoneId));
   console.log(markers)
   $("#friendlist").append("<p id='friend"+ (markers.contacts.length - 1) +"'>friend at " + tzone.timezoneId  + "</br>" + tzone.time.split(" ")[1]+ "</p>");
   $("#stepCarousel").carousel(2);
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
      getTimeZone(event.latLng.lat(),  event.latLng.lng(), addMyLocation, addMyLocationFail);
   });
}

initMap();
getLocation();