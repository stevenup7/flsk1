TZoneApp.TZoneMessages = Backbone.View.extend({
    
    tagName: "div",

    locatedTemplate: _.template('<div class="alert alert-success">We think you are here. ' +
                            '<input type="button" value="Yes I am" tabindex="1" id="locatedSuccessButton">' +
                            '<input type="button" value="No I am not" tabindex="2" id="locatedFailButton">' +                            
                            '</div>'),
    findSelfTemplate: _.template('<div class="alert alert-info">Tell us where you are by clicking on the map. ' +
                            '</div>'),
    addFriendsTemplate: _.template('<div class="alert alert-info">Now click on the map to add some friends. ' +
                            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                            '</div>'),
    exitTemplate: _.template(''),
    
    events: {
        "click #exitButton": "exitMessage",
        "click #locatedSuccessButton": "locatedSuccess",
        "click #locatedFailButton": "findSelf",
    },
    
    initialize: function(){
        this.options.appModel.bind('user-location-found', this.isLocatedCorrect, this);
        this.options.appModel.bind('user-location-not-found', this.findSelf, this);
        this.createEl();
        $(this.options.container).append(this.el);
    },
    
    render: function(){
        
    }, 
    
    exitMessage: function(){
        this.$el.html(this.exitTemplate());
    },
    
    isLocatedCorrect: function(){
        this.$el.html(this.locatedTemplate());
    },
    
    locatedSuccess: function() {
        this.$el.html(this.addFriendsTemplate());
    }, 
    
    findSelf: function() {
        this.$el.html(this.findSelfTemplate());
    }, 
    
    createEl: function(){
        this.$el.html(this.exitTemplate());
    }

});