'use strict';

function dateMath(dt, yearDiff, monthDiff, dayDiff){
    return new Date(dt.getFullYear() + yearDiff, dt.getMonth() + monthDiff, dt.getDate() + dayDiff);
}

var TZoneApp = {};

$(document).ready(function () {

    // main application (not a view as it does not render to the DOM
    TZoneApp.TZoneApp = Backbone.Model.extend({
	cols: d3.scale.category10(),
	initialize: function(){
	    // Create a new Gooogle Map
	    this.gmap = new GoogleMapHandler();
	    this.contacts = new TZoneApp.TZoneContactListView({
		"container": "#friendlist",
		"gmap": this.gmap
	    });
	    this.getUserLocation();
	    this.gmap.onClick(this, this.mapClicked);
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
	    this.gmap.setCenter(
		this.gmap.addMarker(pos, "ff0000", "home").getPosition()
	    ).setZoom(11);
	},
	userLocationFail: function(msg){
	    // todo fix this 
	    console.log("bad", msg);
	},
    });
    TZoneApp.app = new TZoneApp.TZoneApp();

});
