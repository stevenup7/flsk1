(function($){
  console.log("ready");    
  var TZItem = Backbone.Model.extend({
    urlRoot: 'data/tzone/',
    defaults: {
      firstName: 'unnamed',
      lastName: 'unnamed',
      nicName: 'unnamed',
      tzone: "nz"
    },
    initialize: function(){
      //this.on("change", function(model){
	//this.save();
      //});
    },
    validate: function(attrs) {
      // todo
    }
  });
  var TZItemView = Backbone.View.extend({
    tagName: "li",
    template: $("#tz-item").html(),
    formtemplate: $("#tz-item-form").html(),
    events: {
      "click span.change": 'edit',
      "click button.save-item": 'saveitem',
      "click button.delete-item": 'promptDelete',
      "click button.cancel-item": 'render'
    },
    promptDelete: function(){
      if(confirm("Are you sure you want to delete this entry?")){
	this.remove();
      } else {
	return false;	
      }
    },
    initialize: function(){
      _.bindAll(this, 'render', 'renderform', 'remove', 'unrender', 'edit');
      this.model.bind('remove', this.unrender);
    },
    edit: function(){
      this.renderform();
    },
    renderform: function(){
      var tmpl = _.template(this.formtemplate);
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    },    
    render: function(){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    },
    saveitem: function(){
      this.model.set("firstName", this.$el.find(".firstName").val() );
      this.model.set("lastName", this.$el.find(".lastName").val() );
      this.model.set("tzone", this.$el.find(".tzone").val() );
      this.model.save();
      this.render();
    },
    unrender: function(){
      $(this.el).remove();
    },
    remove: function(){
      console.log("remove");
      this.model.destroy()
    }
  });

  var TZList = Backbone.Collection.extend({
    url: 'data/tzone/',
    model: TZItem,
    initialize: function(){
      console.log("fetching");
      this.fetch({
	success: function(a){
	  a.trigger("load-done");
	}
      });
    }
  });

  var TZListView = Backbone.View.extend({
    counter: 0,
    addtemplate: $("#tz-item-form").html(),
    events: {
      'click a.add': 'addItem',
      'keyup input.person-name': 'keyup',
      'click .addnew': 'showform',
      'click .add-form-wrapper .cancel-item': 'hideform',
      'click .add-form-wrapper .save-item': 'addItem'
    },
    initialize: function(){
      this.el = this.options.el;
      console.log(this.options.el);
      _.bindAll(this, 'render', 'addItem', 'appendItem', 'keyup');
      this.collection = new TZList();
      this.collection.bind('add', this.appendItem);
      this.collection.bind('load-done', this.render);
    },
    render: function(){
      console.log("tzlv render");
      var self = this;
      this.$el.append("<ul class='tzlv-wrapper'></ul>");
      var tmpl = _.template(this.addtemplate);
      this.$el.append("<div class='add-form-wrapper hide'>" + 
		      tmpl({firstName:"", lastName: "", tzone: "", withdelete: false})
		      + "</div>" + 
		      "<div><button class='btn addnew'>add new person</button></div>");
      _(this.collection.models).each(function(item){
	console.log("items", item);
	self.appendItem(item);
      }, this);
    },
    keyup: function(e){
      if(e.which === 13){
	this.addItem();
      }
    },
    showform: function(){
      console.log("show ", this.$el);      
      this.$el.find(".add-form-wrapper").show();
      this.$el.find(".tzlv-wrapper").hide();
    },
    hideform: function(){
      this.$el.find(".add-form-wrapper input").val("");
      this.$el.find(".add-form-wrapper").hide();
      this.$el.find(".tzlv-wrapper").show();
    },
    addItem: function(){
      var i = new TZItem();
      var fm = $(this.$el.find('.add-form-wrapper'));
      i.set({
	firstName: fm.find('.firstName').val(),
	lastName: fm.find('.lastName').val(),
	nicName: fm.find('.nicName').val(),
	tzone: fm.find('.tzone').val(),
      })
      if(!i.isValid()){
	return false;
      }
      i.save();
      this.collection.add(i);
      this.hideform();
    },
    appendItem: function(i){
      var itemView = new TZItemView({
	model: i
      });
      $('ul', this.el).append(itemView.render().el);
    }
  });
  window.Vw  = new TZListView({el: $("#content1")});
})(jQuery);