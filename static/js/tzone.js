function initMap(){
   var map;
   var mapOptions = {
      zoom: 2,
      center: new google.maps.LatLng(3.75, -145.72),
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   var infowindow = new google.maps.InfoWindow();
   var geocoder = new google.maps.Geocoder();
   var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   isMapInit = true;

   google.maps.event.addListener(map, 'click', function(event) {
      console.log(event.latLng);

      console.log("getting timezone");

      // JSONP callback                                                                                                                                                                                                                                                       
      var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' + event.latLng.lat() + '&lng=' + event.latLng.lng() + "&callback=?";
      $.getJSON(url, function(data) {
         if(data["timezoneId"]){
	    console.log(data);
            addZone(data.timezoneId);
         } else {
                // todo                                                                                                                                                                                                                                                         
            alert("no timezone available for this location");
         }
      });
   });
}

initMap();