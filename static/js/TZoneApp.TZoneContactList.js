TZoneApp.TZoneContactList = Backbone.Collection.extend({
    model: TZoneApp.TZoneContact,
    url: "/tzone/",
    initialize: function(){
	_.bindAll(this, "loadDone");
	if(window.username !== undefined){
	    this.loadRecords();
	}
    },
    isUserInList: function(){
	var userCount = this.filter(function(contact){
	    return contact.get("isUser");
	});
	if(userCount.length > 0){
	    return true;
	}
	return false;
    },
    loadRecords: function(){
 	this.fetch({
	    success:function(self){
		console.log("loaded");
		self.loadDone();
	    }, 
	    error: function(){
		console.log("error loading contacts");
	    }
	});
    },
    loadDone: function(){
	console.log(this);
	this.sortAsc();
	this.trigger("load-done");
    },
    sortAsc: function(){
	this.models = this.models.sort(function(a, b){
	    if(a.get("isUser")){
		return -1;
	    } else if(b.get("isUser")){
		return 1;
	    } else if(a.get("contactName").toUpperCase() > b.get("contactName").toUpperCase()){
		return 1;
	    } else {
		return -1
	    }
	});
    }
});
