'use strict';

$(document).ready(function () {
    var TZoneApp = {};
    TZoneApp.TZoneContact = Backbone.Model.extend({
	defauts:{
	    "firstName": "new",
	    "lastName":  "contact",
	    "lat":       90, // all good walrus live at the north pole
	    "lng":       0,
	    "timzoneid": undefined
	},
	initialize: function (){
	    _.bindAll(this, "removeContact");
	    this.bind("change", this.haschanged);
	    this.bind("remove", this.removeContact);
        this.bind("invalid", this.parseError);
	},
    
    validate: function ( ) {
        return "testing";
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
		this.set({"owner": window.username});
		if(this.get("firstName") + this.get("lastName") !== "newcontact"){
		    this.save();
		}
	    }
	}
    });

    TZoneApp.TZoneContactView = Backbone.View.extend({
	tagName: "li",
	edit: false,
	rendered: false,
	isInCalendar: false, // has this model been added into the 'calendar table'
	edittemplate: _.template('<input type="text" value="<%=firstName%>"class="firstName" ><input type="text" value="<%=lastName%>"class="lastName" >'),
	texttemplate: _.template('<div class="contact-name"><%=firstName%> <%=lastName%></div><div>' + 
				 '<% if(typeof(timezoneid) !== "undefined"){ %> <%=timezoneid%><% } %></div>'),
	events: {
	    "blur input": "change",
        "keyup input": "keyUp",
	    "click .edit": "toggleEdit",
        "click .contact-name": "toggleEdit",
	    "click .icon-trash": "delete",
	    "click .icon-calendar": "inCalendar",
	    
	},
	delete: function(){
	    if(confirm("Are you sure")){
		this.model.collection.remove(this.model);
		// console.log("deleting", this);
		// TODO : check that this is enough
		// http://stackoverflow.com/questions/6569704/destroy-or-remove-a-view-in-backbone-js
		this.marker.setMap(null);
		this.remove();
	    }

	},
	initialize: function(){
	    this.gmap = this.options.gmap;	    
	    this.model.on("change", this.render, this);
	    // when either the model or the collections asks remove from the DOM
	    this.model.on("dom-remove", this.domRemove, this);
	    this.model.collection.on("dom-remove", this.domRemove, this);
	    this.model.on("dom-insert", this.domInsert, this);
	    this.createEl();
	},
	change: function() {
	    this.model.set({
		"firstName": this.$el.find(".firstName").val(),
		"lastName" : this.$el.find(".lastName" ).val()
	    });
	},
    keyUp: function(e) {
        // console.log(e);
        if(e.which === 13) {
            this.change();
            this.edit = false;
            this.render();
        } // end if
    },
	toggleEdit: function(){
	    this.gmap.setZoom(6);
	    this.gmap.setCenter(this.marker.getPosition());
	    this.edit = !this.edit;
	    this.render();
	}, 
	domRemove: function(){
	    // remove the element from the dom
	    // console.log("domRem", this.texttemplate(this.model.toJSON()));
	    this.$el.detach();
	},
	domInsert: function(){
	    // console.log("domIns", this.texttemplate(this.model.toJSON()));
	    if(this.$el.parent().length === 0){
		this.options.container.append(this.el);
	    }
	},
	inCalendar: function(){
	    this.isInCalendar = true;
	    this.model.collection.trigger("in-calendar", this.model, this);
	},
	
	createEl: function(){
	    this.$el.html(this.texttemplate(this.model.toJSON()));
	},
	render: function(){
	    if(this.edit){
		this.$el.html(this.edittemplate(this.model.toJSON()) + " <i class='edit icon-list'></i> <i class='icon-trash'></i>");
	    } else {
		this.$el.html(this.texttemplate(this.model.toJSON()) + " <i class='edit icon-edit'></i> <i class='icon icon-calendar'></i>");
	    }
	    this.renderMarker();
	},
	renderMarker: function(){
	    if(this.marker === undefined){
		var loc = new google.maps.LatLng(this.model.get("lat"),this.model.get("lng"));
		this.marker = this.gmap.addMarker(loc, "6699FF", this.texttemplate(this.model.toJSON()));
	    } else {
		this.marker.setTitle(this.texttemplate(this.model.toJSON()));
	    }
	    return this;
	}
    })

    TZoneApp.TZoneTimesView = Backbone.View.extend({
	tagName: "div",
	className: "times-view",
	initialize: function (){
	    this.contactView = this.options.contactView;

	},
	render: function() {
	    // console.log("rendering");
	    console.log("cv", this.contactView);
	    this.$el.html(
		"<h2>" + this.contactView.texttemplate(this.model.toJSON()) + "</h2>"
	    );
	    this.options.container.append(this.el);
	}	
    });

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




