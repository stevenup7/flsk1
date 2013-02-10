TZoneApp.TZoneContactListView = Backbone.View.extend({
    tagName: "div",
    id: "contactview",
    events: {
	"click .reverse": "reverseit"
    },
    initialize: function(){
	$(this.options.container).append(this.el);
	this.$el.append("<ul class='list-container'></ul><span class='reverse'>reverse</span>");
	this.gmap = this.options.gmap;
	_.bindAll(this, "render", "addItem", "loadDone");
	this.collection = new TZoneApp.TZoneContactList();
	window.c = this.collection;
	this.collection.bind('load-done', this.loadDone);
	this.collection.on("in-calendar", this.addToCalendar, this);
    },
    loadDone: function(){
	_.each(this.collection.models, function(i){
	    // TODO models with no location
	    this.addModelView(i);
	}, this);
	this.render();
    },
    render: function(){
	_.each(this.collection.models, function(i){
	    i.trigger("dom-insert");
	}, this);
	return this;
    },
    reverseit: function(e){
	this.collection.models.reverse();
	this.collection.trigger("dom-remove");
	_.each(this.collection.models, function(i){
	    i.trigger("dom-insert");
	}, this);
	
    },
    addToCalendar: function(model, modelview){
	// console.log("in calendar", model.toJSON(), modelview);
	var listView = new TZoneApp.TZoneTimesView({
	    container: $("#times-wrapper"),
	    contactView: modelview,
	    model: model
	}).render();
    },
    addModelView: function(i){
	// console.log("adding model", i.get('timezoneid'));
	if(i.get('timezoneid') === undefined){
	    var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' + i.get("lat") + '&lng=' + i.get("lng") + "&callback=?";
	    // console.log(url);

	    $.getJSON(url, function(data) {
		if(data["timezoneId"]){
		    i.set("timezoneid", data["timezoneId"]);
		} else {
		    i.set("timezoneid", "timezone unavailable");
		}
	    });    
	}

	new TZoneApp.TZoneContactView(
	    {model:i,
	     gmap: this.gmap,
	     container: this.$el.find("ul")
	    }).render();

    },
    addItem: function(loc){
	var i = new TZoneApp.TZoneContact();
	i.set({
	    "firstName": "new",
	    "lastName":  "contact",
	    "lat":       loc.lat(),
	    "lng":       loc.lng()
	});
	
	this.collection.add(i);
	this.addModelView(i);
	this.render();
    }

})
