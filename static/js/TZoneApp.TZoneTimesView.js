
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
