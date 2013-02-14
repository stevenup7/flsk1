TZoneApp.TZoneContactView = Backbone.View.extend({
    tagName: "li",
    edit: false,
    rendered: false,
    isInCalendar: false, // has this model been added into the 'calendar table'
    edittemplate: _.template('<input type="text" value="<%=firstName%>" tabindex="1" class="firstName" >' +
			     '<input type="text" value="<%=lastName%>" tabindex="2" class="lastName" >'),
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
    initialize: function(){
	this.gmap = this.options.listview.gmap;	    
	this.model.on("change", this.render, this);
	// when either the model or the collections asks remove from the DOM
	this.model.on("dom-remove", this.domRemove, this);
	this.model.collection.on("dom-remove", this.domRemove, this);
	this.model.on("dom-insert", this.domInsert, this);
	this.on("markerDragEnd", this.changeLocation);
	this.createEl();
	if(this.model.get("isUser")){
	    this.$el.addClass("user");
	}
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
    change: function() {
	this.model.set({
	    "firstName": this.$el.find(".firstName").val(),
	    "lastName" : this.$el.find(".lastName" ).val()
	});
    },
    changeLocation: function(loc){
	// TODO: update the timezone as well
	this.model.set({
	    "lat": this.marker.position.lat(), 
	    "lng": this.marker.position.lng()
	});
	this.model.fetchTimeZone();
    },
    keyUp: function(e) {
	// TODO: if tabbing off last field tab to first
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
	if(!this.isInCalendar){
	    this.isInCalendar = true;
	    this.model.collection.trigger("in-calendar", this.model, this);
	}
    },	
    createEl: function(){
	this.$el.html(this.texttemplate(this.model.toJSON()));
    },
    render: function(){
	if(this.marker){
	    this.marker.setDraggable(this.edit);
	}
	if(this.edit){
	    this.$el.html(this.edittemplate(this.model.toJSON())+" <i class='edit icon-list'></i> <i class='icon-trash'></i>");
	} else {
	    if(this.model.get("isUser")){
		this.$el.html("YOU:" + this.texttemplate(this.model.toJSON()) +
			      " <i class='edit icon-edit'></i> <i class='icon icon-calendar'></i>");
	    } else {
		this.$el.html(this.texttemplate(this.model.toJSON()) + 
			      " <i class='edit icon-edit'></i> <i class='icon icon-calendar'></i>");
	    }
	}
	this.renderMarker();
    },
    renderMarker: function(){
	if(this.marker === undefined){
	    var loc = new google.maps.LatLng(this.model.get("lat"),this.model.get("lng"));
	    if(this.model.get("isUser")){
		this.marker = this.gmap.addMarker(loc, "FF9999", this.texttemplate(this.model.toJSON()), this);
	    } else {
		this.marker = this.gmap.addMarker(loc, "6699FF", this.texttemplate(this.model.toJSON()), this);
	    }
	} else {
	    this.marker.setTitle(this.texttemplate(this.model.toJSON()));
	}
	return this;
    }
})
