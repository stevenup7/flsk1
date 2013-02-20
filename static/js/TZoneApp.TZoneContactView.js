TZoneApp.TZoneContactView = Backbone.View.extend({
    tagName: "li",
    edit: false,
    rendered: false,
    isInCalendar: false, // has this model been added into the 'calendar table'
    viewtemplate: _.template('<div class="contact isUser<%=isUser%>"><div><span class="contact-name"><%=contactName%></span></div><i class="expand icon icon-chevron-down"></i><i class="add-to-table add-to-table-icon icon-plus icon"></i></div>'),
    edittemplate: _.template('<div class="contact isUser<%=isUser%>"><label>Contact\'s Name</label><input type="text" value="<%=contactName%>" tabindex="1" class="contactName" ><i class="expand icon icon-chevron-left"></i><div><p class="btn add-to-table "><i class="icon-plus icon"></i> Add to side by side comparison<p><p>You can update the location and timezone by dragging the pin on the map</p><span class="btn btn-danger delete-button">delete this contact</span> <span class="btn btn-primary done-button">done</span></div></div>'),
    texttemplate: _.template('<%=contactName%> - <% if(typeof(timezoneid) !== "undefined"){ %> <%=timezoneid%><% } %>'),
    events: {
	"blur input": "edited",
        "keyup input": "keyUp",
	"click .expand": "toggleEdit",
	"click .done-button": "toggleEdit",
        "click .contact-name": "toggleEdit",
	"click .delete-button": "delete",
	"click .add-to-table": "inCalendar",
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
	    this.inCalendar(false);
	}
    },

    render: function(){
	if(this.marker){
	    this.marker.setDraggable(this.edit);
	}
	if(this.edit){
	    this.$el.html(this.edittemplate(this.model.toJSON()));
	} else {
	    this.$el.html(this.viewtemplate(this.model.toJSON()));
	}
	this.renderMarker();
    },

    delete: function(){
	// todo check if it is USER
	var cname = this.model.get("contactName");
	if(confirm("Are you sure you want to delete '" + cname + "'")){
	    this.model.collection.remove(this.model);
	    // console.log("deleting", this);
	    // TODO : check that this is enough
	    // http://stackoverflow.com/questions/6569704/destroy-or-remove-a-view-in-backbone-js
	    this.marker.setMap(null);
	    this.remove();
	}
    },
    edited: function() {
	this.model.set({
	    "contactName": this.$el.find(".contactName").val()
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
	    this.edited();
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
    inCalendar: function(toggleTab){
	// TODO remove 
	if(!this.isInCalendar){
	    this.isInCalendar = true;
	    this.model.collection.trigger("in-calendar", this.model, this, toggleTab);
	}
    },	
    createEl: function(){
	this.$el.html(this.texttemplate(this.model.toJSON()));
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
