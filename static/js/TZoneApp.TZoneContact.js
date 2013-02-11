TZoneApp.TZoneContact = Backbone.Model.extend({
    defauts:{
	"firstName": "new",
	"lastName":  "contact",
	"isUser":    false,
	"lat":       90, // all good walrus live at the north pole
	"lng":       0,
	"timzoneid": undefined
    },
    initialize: function (){
	_.bindAll(this, "removeContact");
	this.bind("change", this.haschanged);
	this.bind("remove", this.removeContact);
        this.on("invalid", this.parseError);
	this.parseUTCOffset();
    },
    parseUTCOffset: function (){
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
	var d = new Date();
	var u = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(),
			 d.getMinutes() + d.getTimezoneOffset(), d.getSeconds());	    
	var tzonedate = new Date(
	    u.getFullYear(), u.getMonth(), u.getDate(), u.getHours() + this.UTCOffset.hours,
	    u.getMinutes() + this.UTCOffset.mins, u.getSeconds());
	return tzonedate;
    },    
    validate: function ( attrs, options) {
	// TODO call this on change ?
	console.log("Validate running");
	//console.log("   ", attrs);
	//console.log("   ", options);
	
	if(attrs.firstName.indexOf("bad") >= 0){
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
	if(window.username !== undefined){
	    //this.set({"owner": window.username});
	    if(this.get("firstName") + this.get("lastName") !== "newcontact"){
		this.save();
	    }
	}
    }
});