var Form = function(){
   this.fields = [];
   this.containerEl = undefined;
   return this;
}
Form.prototype.wrappertpl = _.template('<div class="form-wrapper <%= formClass%>"><%= formBody%></div>');
Form.prototype.buttonstpl = _.template('<button class="save-item btn btn-primary">save</button> <% if(typeof(withdelete)==="undefined"?true:withdelete===true){ %><button class="delete-item btn btn-danger">delete</button> <% } %><button class="cancel-item btn">cancel</button>');
Form.prototype.loadModel = function(model){
   if(model === undefined){
      model = {set: function(k,v){ this[k] = v}}
   }
   var getValue = ""
   var that = this;

   _(this.fields).each(function(field){
      model.set(field.name, that.containerEl.find("." + field.name).val());
   });
   return model;
}
Form.prototype.render = function(containerEl, model, withDelete, formClass) {
   if(model === undefined){
      model = {get:function(){return ""}};
   }
   this.containerEl = containerEl;
   var renderData = {
      "formBody" :"",
      "formTitle": "",
      "withdelete": withDelete,
      "formClass": formClass
   }
   console.log(model);
   _(this.fields).each(function(field){
      renderData["formBody"] += field.render(model.get(field.name) );
   });
   renderData["formBody"] += this.buttonstpl(renderData);
   containerEl.html(this.wrappertpl(renderData));
} 
Form.prototype.addField = function(name, label, type, options){
   this.fields.push(new FormField(name, label, type, options));
   return this;
}
var FormField = function(name, label, type, options){
   this.name = name;
   this.label = label;
   this.type = type;
   this.options = options;
   this.value = "";
   return this;
}

FormField.prototype.fldtpl = _.template('<div><label for="<%= name%>"><%= label %></label><%= field %></div>');

FormField.prototype.typetpls = {
   "text":      _.template('<input type="text" class="<%= name%>" name="<%= name%>" value="<%= value %>" />'),
   "password":  _.template('<input type="pasword" class="<%= name%>" name="<%= name%>" value="<%= value %>" />'),
   "select":    _.template('<select></select>'),
   "tickset":   _.template('<ul><% _.each(options.values, function(i){%> <li><label class="checkbox"><input type="checkbox" value="<%= i%>"><%= i%></label></li><% }); %></ul>')
}
FormField.prototype.render = function(value) {
   this.value = value;
   return this.fldtpl({
      "field": this.typetpls[this.type](this),
      "label": this.label,
      "name": this.name
   });
}

var GeneralItemView = Backbone.View.extend({
   tagName: "li",
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
      // allow hiding of the edit form from elsewhere
      this.model.bind("cancel-edit", this.render, this);
      this.model.bind('remove', this.unrender);
   },
   edit: function(){
      this.renderform();
   },
   renderform: function(){
      // render the form 
      this.form.render(this.$el, this.model, true);
      return this;
   },    
   render: function(){
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
   },
   saveitem: function(){
      // save the form  
      // get the values from the form
      this.form.loadModel(this.model);

      this.model.save();
      this.render();
      // save the model 
      //alert("you must overwrite the method");
   },
   unrender: function(){
      $(this.el).remove();
   },
   remove: function(){
      this.model.destroy()
   }
});
var GeneralList = Backbone.Collection.extend({
   initialize: function(){
      console.log("fetching");
      this.fetch({
	 success: function(a){
	    // trigger load done on the list view
	    console.log(a);
	    a.trigger("load-done");
	 }
      });
   }
});

var GeneralListView = Backbone.View.extend({
   events: {
      'click a.add': 'addItem',
      'keyup input.person-name': 'keyup',
      'click .addnew': 'showform', 
      'click .add-form-wrapper .save-item': 'addItem'
   },
   initialize: function(){
      this.el = this.options.el;
      this.form = this.options.form;
      _.bindAll(this, 'render', 'addItem', 'appendItem', 'keyup');
      this.collection = new this.collectionType();
      this.collection.bind('add', this.appendItem);
      this.collection.bind('load-done', this.render);
   },
   render: function(){
      console.log("general list render");
      var self = this;
      this.$el.html("<ul class='list-wrapper unstyled'></ul><span class='addnew btn'>Add New</span>");
//      var tmpl = _.template(this.addtemplate);
  
      _(this.collection.models).each(function(item){
	 console.log("item:", item);      
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
      _(this.collection.models).each(function(item){
	 // trigger cancel edit on the model caught by the model view
	 item.trigger("cancel-edit");
      }, this);
      console.log("this", this);
      this.addForm.render(this.$el, undefined, false, "add-form-wrapper");
   },
   addItem: function(){
      console.log("list view" , this);
      var i = new this.model();
      /////////////////// >>>>>>>>>>>>>>>>>
      var i = this.addForm.loadModel(i);
      this.collection.add(i);
      i.save();
      this.render();
   },
   appendItem: function(i){
      var itemView = new this.itemView({
	 model: i
      });
      $('ul', this.el).append(itemView.render().el);
   }
});


(function($){

   var personForm = new Form()
      .addField("firstName", "First Name", "text")
      .addField("lastName", "Last Name", "text")
      .addField("username", "User Name", "text")
      .addField("password", "password", "text")
      .addField("levels", "Levels", "tickset", {"values": ["SUPERUSER", "ADMIN", "USER"]})

   var SystemUser = Backbone.Model.extend({
      urlRoot: '/users/admin/data',
      defaults: {
	 firstName: 'unnamed',
	 lastName: 'unnamed',
	 nicName: 'unnamed',
      },
      initialize: function(){
      },
      validate: function(attrs) {
      }
   });
   var SystemUserView = GeneralItemView.extend({
      template: '<span><%= firstName %> <%= lastName %></span><span class="change btn btn-mini">edit</span>',
      form: personForm
   });
   var SystemUserList = GeneralList.extend({
      url: 'admin/data',
      model: SystemUser
   });
   var SystemUserListView = GeneralListView.extend({
      model: SystemUser,
      itemView: SystemUserView,
      collectionType: SystemUserList,
      addForm: personForm
   });

   var lView  = new SystemUserListView({
      el: $("#userlist"),
   });

})(jQuery);