TZoneApp.TZoneContact = Backbone.Model.extend({
    defauts:{
	"contactName":  "contact",
	"isUser":    false,
	"lat":       90, // all good walrus live at the north pole
	"lng":       0,
	"timzoneid": undefined
    },
    initialize: function (){
	_.bindAll(this, "removeContact", "validate");
	this.bind("change", this.haschanged);
	this.bind("remove", this.removeContact);
        this.on("invalid", this.parseError);
	this.parseUTCOffset();
    },
    parseUTCOffset: function (){
	console.log("parsing utcoffset");

	if(this.get("UTCOffset") !== undefined){
	    var os = this.get("UTCOffset"); // something like "-0130"
	    this.UTCOffset = {
		hours:     parseInt(os.substr(0,3)),
		mins:      parseInt(os.substr(3,2))
	    };
	    this.CTime = this.getTimeInTimeZoneNow();
	}
    },
    getTimeInTimeZoneNow: function(){
	var d = new Date(); // time here
	var u = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(),
			 d.getMinutes() + d.getTimezoneOffset(), d.getSeconds());	    // utc time 
	//console.log("d u ", d,u,this.UTCOffset);

	var tzonedate = new Date(
	    u.getFullYear(), u.getMonth(), u.getDate(), u.getHours() + this.UTCOffset.hours,
	    u.getMinutes() + this.UTCOffset.mins, u.getSeconds());                          // localtime for this model
	return tzonedate;
    },    
    validate: function ( attrs, options) {
	// TODO call this on change ?
	console.log("Validate running", this.toJSON());
	//console.log("   ", attrs);
	//console.log("   ", options);
	
	if(attrs.contactName.indexOf("bad") >= 0){
	    alert("bad name");
	    return "Bad is a bad name";
	}
    },    
    parseError: function(model, error){
        console.log("parseError is getting called");
        // console.log(error);
    },    
    removeContact: function(){
	// console.log("this", this);
	this.destroy();
    },
    // TODO: validation
    haschanged: function(){
	console.log("has changed is called here");

	if(window.username !== undefined){
	    // TODO: fix this 
	    //this.set({"owner": window.username});
	    if(this.get("contactName") !== "newcontact"){		
		this.save();
	    }
	}
    },
    fetchTimeZone: function() {
	var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' 
	    + this.get("lat") + '&lng=' + this.get("lng") + "&callback=?";
	console.log(url);
	var self = this;
	$.getJSON(url, function(data) {
	    // SELF here :)
	    if(data["timezoneId"]){
		self.UTCOffset = {
		    hours:     Math.floor(data.gmtOffset),
		    mins:      (data.gmtOffset - Math.floor(data.gmtOffset)) * 60
		};
		console.log("TZONE DATE", data, this.UTCOffset);
		self.set("timezoneid", data["timezoneId"]);
	    } else {
		self.set("timezoneid", "timezone unavailable");
	    }
	});    
    }
});
