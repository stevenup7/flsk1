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

function addMarker(location) {
   console.log("adding location");
   pinImage = getColoredMarker("FE7569");
   pinImage = getColoredMarker("0088CC");
   marker = new google.maps.Marker({
      position: location,
      map: map, 
      title: "Hello World!",
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
   markers.me = addMarker(loc);
   console.log("adding");

   $("#your-location .btn-group .btn").click(function(){
      console.log("click");

      $("#stepCarousel").carousel('next');
      $("#stepCarousel .left").show();
      //$("#stepCarousel").carousel('next');
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

function initMap(){
   console.log("init with carousel");
   
   
   $("#stepCarousel").carousel({
      interval: false
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