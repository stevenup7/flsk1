'use strict';

function dateMath(dt, yearDiff, monthDiff, dayDiff){
    return new Date(dt.getFullYear() + yearDiff, dt.getMonth() + monthDiff, dt.getDate() + dayDiff);
}

var TZoneApp = {};
TZoneApp.dateFormatter = new DatePlus();

$(document).ready(function () {
    // main application (not a view as it does not render to the DOM
    TZoneApp.TZoneApp = Backbone.Model.extend({
	cols: d3.scale.category10(),
	initialize: function(){
	    // Create a new Gooogle Map    
	    this.gmap = new GoogleMapHandler();
	    this.getUserLocation();
	    this.gmap.onClick(this, this.mapClicked);
	    this.contacts = new TZoneApp.TZoneContactListView({
		"container": "#friendlist",
		"gmap": this.gmap
	    });
            
            // create TZoneMessages
            this.TZoneMessages = new TZoneApp.TZoneMessages({"container": "#tzone-messages", "appModel": this});
	},
	mapClicked: function(loc){
	    this.contacts.addItem(loc.latLng);
	},
	getUserLocation: function(){
	    var that = this;
	    // Get the users locations
	    var u = new UserGeoLocation({		
		success: function(pos){
		    that.userLocationSuccess(pos);
		},
		fail: function(msg){
		    that.userLocationFail(msg);
		}
	    });
	},
	userLocationSuccess: function(pos){
    	    var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	    this.gmap.setCenter(location);
	    console.log(" adding user location");
	    this.contacts.addItem(location, "Your", "Location", true);
//	    this.gmap.setCenter(
//		this.gmap.addMarker(pos, "ff0000", "home").getPosition()
//	    ).setZoom(11);
            this.trigger("user-location-found");
	},
	userLocationFail: function(msg){
            this.trigger("user-location-not-found");
	    this.showMapMessage("Error", "Sorry our attempt to load your location failed. You can still click the map to add your location");
            
	},
	showMapMessage: function(title, msg){
	    $("#map-message .heading").text(title);
	    $("#map-message .message").text(msg);
	    $("#map-message").show();
	    $("#map-message .close").click(function(){
		$("#map-message").hide();
	    });	    
	}
    });
    TZoneApp.app = new TZoneApp.TZoneApp();

});
