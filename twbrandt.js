this.App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
		firstName: "Tom",
		lastName: "Brandt"
});

App.Router.map(function(){
		this.route('contributors');
		this.route('contributor',{path: '/contributors/:contributor_id'});
});

App.IndexRoute = Ember.Route.extend({
		setupController: function(controller) {
			controller.set('title',"This is the index controller");
		}
});


App.ContributorsRoute = Ember.Route.extend({
		model: function() {
			return App.Contributor.all();
		}
});

App.Contributor = Ember.Object.extend();
App.Contributor.reopenClass({
		allContributors: [],
		all: function(){
			this.allContributors = [];
			$.ajax({
					url: 'https://api.github.com/repos/emberjs/ember.js/contributors',
					dataType: 'jsonp',
					context: this,
					success: function(response){
						response.data.forEach(function(contributor){
								this.allContributors.addObject(App.Contributor.create(contributor))
						}, this)
					}
			})
			return this.allContributors;
		}
});

