TZoneApp.TZoneTimesView = Backbone.View.extend({
    tagName: "div",
    className: "times-view",
    lastmin: -100,
    initialize: function (){
	this.contactView = this.options.contactView;
	this.options.listview.bind("tick", this.tick, this);
    },
    tick: function(){
	// timeOfDayO: mmmm ewwwwww fixme
	var now = this.model.getTimeInTimeZoneNow();
	if(now.getMinutes() !== this.lastmin){
	    this.lastmin = now.getMinutes();
	    this.renderTable();
	}
	this.$el.find('.clock').html((" " + now).split(" ")[5] );
    },
    render: function() {
	// console.log("rendering");
	this.$el.html(
	    "<h2>" + this.contactView.texttemplate(this.model.toJSON()) + "</h2><div class='clock'></div><div class='time-table'></div>"
	);
	this.renderTable();
	this.options.container.append(this.el);
    },
    renderTable: function(){
	console.log("re-rendering table");
	var now = this.model.getTimeInTimeZoneNow()
	var hoursNow = now.getHours(), timeTable = "", currHour = 0, timeOfDay = "night", nowLine;

	for(var x=-2;x<24;x++){
	    nowLine = "";
	    currHour = (hoursNow + x) % 24;
	    if(currHour == hoursNow){
		nowLine = "<div class='nowline' style='top: " + Math.floor(22 * (now.getMinutes() / 60)) + "px'></div>"
		// timeOfDay = "current";
	    } 
	    if(currHour <= 6 || currHour >= 20){
		timeOfDay = "night"
	    } else if(currHour >= 9 && currHour <= 17) {
		timeOfDay = "work";
	    } else {
		timeOfDay = "day";
	    } 
	    timeTable += "<div class='" + timeOfDay + "'>" + ("0" + currHour).substr(("0" + currHour).length -2) + ":00:00" + nowLine + "</div>";
	}	
	this.$el.find(".time-table").html(timeTable);
    }
    
});
