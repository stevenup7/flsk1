(function($){

   var personForm = new Form()
      .addField("firstName", "First Name", "text")
      .addField("lastName", "Last Name", "text")
      .addField("username", "User Name", "text")
      .addField("password", "password", "password")
      .addField("levels", "Levels", "tickset", {"values": ["SUPERUSER", "ADMIN", "USER"]})

   var SystemUser = Backbone.Model.extend({
      urlRoot: '/users/admin/data',
      defaults: {
	 firstName: 'unnamed',
	 lastName: 'unnamed',
	 nicName: 'unnamed',
	 levels: []
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