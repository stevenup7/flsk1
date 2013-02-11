TZoneApp.TZoneTimesView = Backbone.View.extend({
    tagName: "div",
    className: "times-view",
    initialize: function (){
	this.contactView = this.options.contactView;
	this.options.listview.bind("tick", this.tick, this);
    },
    tick: function(){
	// TODO: mmmm ewwwwww fixme
	this.$el.find('.clock').html((" " + this.model.getTimeInTimeZoneNow()).split(" ")[5] );
    },
    render: function() {
	// console.log("rendering");
	console.log("cv", this.contactView);

	this.$el.html(
	    "<h2>" + this.contactView.texttemplate(this.model.toJSON()) + "</h2><div class='clock'></div>"
	);
	this.options.container.append(this.el);
    }	
});
