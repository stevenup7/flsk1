TZoneApp.TZoneContactListView = Backbone.View.extend({
    tagName: "div",
    id: "contactview",
    events: {
	"click .reverse": "reverseit"
    },
    initialize: function(){
	$(this.options.container).append(this.el);
	this.$el.append("<ul class='list-container unstyled'></ul><span class='reverse'>reverse</span>");
	this.gmap = this.options.gmap;
	_.bindAll(this, "render", "addItem", "loadDone");
	this.collection = new TZoneApp.TZoneContactList();
	window.c = this.collection;
	this.collection.bind('load-done', this.loadDone);
	this.collection.on("in-calendar", this.addToCalendar, this);
	that = this;
	(function(){
	    console.log("test");
	    that.tickInterval = window.setInterval(function(){
		that.trigger("tick")
	    },1000);
	})()

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
	    model: model,
	    listview: this
	}).render();
    },
    addModelView: function(i){
	// console.log("adding model", i.get('timezoneid'));
	if(i.get('timezoneid') === undefined){
	    i.fetchTimeZone();
	}
	new TZoneApp.TZoneContactView(
	    {model:i,
	     listview: this,
	     container: this.$el.find("ul")
	    }).render();

    },
    addItem: function(loc, firstName, lastName, isUser){
	var userCount = this.collection.filter(function(contact){
	    return contact.get("isUser")
	});
	
	if(userCount.length > 0 && isUser === true){
	    // TODO: offer to update location
	    console.log("found location alredy for the user" , isUser);
	    return;
	}
	console.log("about to create");
	var i = new TZoneApp.TZoneContact();
	console.log("adding to collection");
	this.collection.add(i);
	console.log("obj created");
	i.set({
	    "firstName": firstName || "new",
	    "lastName":  lastName  || "contact",
	    "isUser":    isUser    || false,
	    "lat":       loc.lat(),
	    "lng":       loc.lng()
	});
	console.log("nc" , i.toJSON());

	this.addModelView(i);
	this.render();
	return this; // Allow Chaining  TODO: should this return the model 
    }

})
