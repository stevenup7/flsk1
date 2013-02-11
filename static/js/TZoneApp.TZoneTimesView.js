TZoneApp.TZoneTimesView = Backbone.View.extend({
    tagName: "div",
    className: "times-view",
    initialize: function (){
	this.contactView = this.options.contactView;
	this.options.listview.bind("tick", this.tick, this);
    },
    tick: function(){
	// timeOfDayO: mmmm ewwwwww fixme
	this.$el.find('.clock').html((" " + this.model.getTimeInTimeZoneNow()).split(" ")[5] );
    },
    render: function() {
	// console.log("rendering");
	console.log("cv", this.contactView);
	var now = this.model.getTimeInTimeZoneNow()
	var hoursNow = now.getHours();
	var timeTable = "", currHour = 0;
	var timeOfDay = "night"

	for(var x=-2;x<24;x++){
	    currHour = (hoursNow + x) % 24;
	    if(currHour == hoursNow){
		timeOfDay = "current";
	    } else if(currHour <= 6 || currHour >= 20){
		timeOfDay = "night"
	    } else if(currHour >= 9 && currHour <= 17) {
		timeOfDay = "work";
	    } else {
		timeOfDay = "day";
	    } 
	    timeTable += "<div class='" + timeOfDay + "'>" + ("0" + currHour).substr(("0" + currHour).length -2) + ":00:00</div>";
	}
	this.$el.html(
	    "<h2>" + this.contactView.texttemplate(this.model.toJSON()) + "</h2><div class='clock'></div>" + timeTable
	);
	this.options.container.append(this.el);
    }	
});
