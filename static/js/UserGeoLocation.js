function UserGeoLocation(opts){
    this.opts = opts;
    this.getUserGeoLocation();
}    
UserGeoLocation.prototype.showUserPosition = function (position) {
    getTimeZone(position.coords.latitude, position.coords.longitude, showUserTimeZone, showUserTimeZoneFail);
}
UserGeoLocation.prototype.getUserGeoLocation = function(){
    console.log(this, "getting user location");
    if (navigator.geolocation){
	var options = {timeout: 60000};
	var that = this;
	navigator.geolocation.getCurrentPosition(
	    function(pos){
		that.opts.success(pos);
	    }, function(i){
		that.opts.fail("Failed to get location ");
	    }, options);
    }else{
	this.opts.bad("Geolocation is not supported by this browser.");
    }
}

