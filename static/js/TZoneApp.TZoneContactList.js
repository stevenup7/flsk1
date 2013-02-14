TZoneApp.TZoneContactList = Backbone.Collection.extend({
    model: TZoneApp.TZoneContact,
    url: "/tzone/",
    initialize: function(){
	_.bindAll(this, "loadDone");
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
	    } else if(a.get("lastName").toUpperCase() > b.get("lastName").toUpperCase()){
		return 1;
	    } else {
		return -1
	    }
	});
    }
});
