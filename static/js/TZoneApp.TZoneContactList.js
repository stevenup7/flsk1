TZoneApp.TZoneContactList = Backbone.Collection.extend({
    model: TZoneApp.TZoneContact,
    url: "/tzone/",
    initialize: function(){
	this.fetch({
	    success:function(self){
		self.trigger("load-done");
	    }, 
	    error: function(msg){
		console.log("error", msg);
	    }
	});
    },
});
