'use strict';

$(document).ready(function () {

    var TZoneApp = {};

    TZoneApp.TZoneContact = Backbone.Model.extend({
	initialize: function (){
	    this.bind("change", this.haschanged);
	},
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
	texttemplate: _.template('<%=firstName%> <%=lastName%> '),
	events: {
	    "blur input": "change",
	    "click .edit": "toggleEdit",
	    "click .icon-calendar": "inCalendar"
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
	toggleEdit: function(){
	    this.gmap.setZoom(6);
	    this.gmap.setCenter(this.marker.getPosition());
	    this.edit = !this.edit;
	    this.render();
	}, 
	domRemove: function(){
	    // remove the element from the dom
	    console.log("domRem", this.texttemplate(this.model.toJSON()));
	    this.$el.detach();
	},
	domInsert: function(){
	    console.log("domIns", this.texttemplate(this.model.toJSON()));
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
		this.$el.html(this.edittemplate(this.model.toJSON()) + " <i class='edit icon-list'></i>");
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
	    console.log("in calendar", model.toJSON(), modelview);
	},
	addModelView: function(i){
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
	getTimeZone: function(lat, lng, callBack, failCallBack){
	    var url = 'http://api.geonames.org/timezoneJSON?username=stevenup7&lat=' + lat + '&lng=' + lng + "&callback=?";
	    $.getJSON(url, function(data) {
		if(data["timezoneId"]){
		    callBack(lat,lng, data);
		} else {
		    failCallBack()
		}
	    });
	},
    });
    TZoneApp.app = new TZoneApp.TZoneApp();

});




