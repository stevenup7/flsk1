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
   console.log("load model");
   _(this.fields).each(function(field){
      if(field.isArrayType){
	 var rsltArray = [];
	 that.containerEl.find("." + field.name + ":checked").each(function(){
	    rsltArray.push($(this).val());
	 });
	 model.set(field.name, rsltArray);
      }else {
	 model.set(field.name, that.containerEl.find("." + field.name).val());
      }
   });
   return model;
}
Form.prototype.render = function(containerEl, renderFunction, model, withDelete, formClass) {
   // if no model is passed we can render the form using a blank model 
   if(model === undefined){
      // TODO: this should render form defaults rather than blanks
      model = {get:function(){return ""}};
   }
   this.containerEl = containerEl;
   var renderData = {
      "formBody" :"",
      "formTitle": "",
      "withdelete": withDelete,
      "formClass": formClass
   }
   _(this.fields).each(function(field){
      renderData["formBody"] += field.render(model.get(field.name) );
   });
   renderData["formBody"] += this.buttonstpl(renderData);
   renderFunction.call(containerEl, this.wrappertpl(renderData));
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
   if(type === "tickset"){
      this.isArrayType = true;
   } else {
      this.isArrayType = false;
   }
   return this;
}

FormField.prototype.fldtpl = _.template('<div><label for="<%= name%>"><%= label %></label><%= field %></div>');

FormField.prototype.typetpls = {
   "text":      _.template('<input type="text" class="<%= name%>" name="<%= name%>" value="<%= value %>" />'),
   "password":  _.template('<input type="password" class="<%= name%>" name="<%= name%>" value="<%= value %>" />'),
   "select":    _.template('<select></select>'),
   "tickset":   _.template('<ul><% _.each(options.values, function(i,x){%> <li><label class="checkbox"><input type="checkbox" value="<%= i%>" name="<%= name %>" <%=  checked[x]%> class="<%= name %>" :><%= i%></label></li><% }); %></ul>')
}
FormField.prototype.render = function(value) {
   this.value = value;
   var checked = [];
   if(this.isArrayType){
      _.each(this.options.values, function(i,x){
	 checked[x] = (_.indexOf(value, i) === -1)?"":" checked='checked'";
      });
      console.log(checked);
      this.checked = checked;
   }
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
      this.form.render(this.$el, this.$el.html, this.model, true);
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
      'click .addnew': 'showAddForm', 
      'click .add-form-wrapper .save-item': 'addItem',
      'click .add-form-wrapper .cancel-item': 'hideAddForm'
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
   hideModelForms: function(){
      _(this.collection.models).each(function(item){
	 item.trigger("cancel-edit");
      }, this);
   },
   hideAddForm: function(){
      $('.add-form-wrapper').remove();
      $('ul.list-wrapper', this.el).show();
      $('.addnew', this.el).show();
   },
   showAddForm: function(){
      this.hideModelForms()
      $('ul.list-wrapper', this.el).hide();
      $('.addnew', this.el).hide();
      this.addForm.render(this.$el, this.$el.append, undefined, false, "add-form-wrapper");
   },
   addItem: function(){
      console.log("list view" , this);
      var i = new this.model();
      i = this.addForm.loadModel(i);
      this.collection.add(i);
      i.save();
      this.render();
   },
   appendItem: function(i){
      var itemView = new this.itemView({
	 model: i
      });
      $('ul', this.el).append(itemView.render().el);
      this.hideAddForm();
   }
});
