/*
	Application
*/

// initialize "App"
App = Ember.Application.create();
/*
	Models
	Ember models are a blueprint for the data they will contain
*/
App.Tweet = Ember.Object.extend({
	avatar: null,
	screen_name: null,
	text: null,
	date: null
});

/*
	Views
*/
App.SearchTextField = Ember.TextField.extend({
		insertNewline: function() {
			App.tweetsController.loadTweets();
		}
});

/*
	Controllers
*/
App.tweetsController = Ember.ArrayController.create({
		content: [],
		username: '',
		loadTweets: function() {
			/*
				Set scope for the test of the function to the current object, or
				App.tweetsController.
				
				Ember's data bindings are bidirectional; as you type a value into the input field,
				the valueBinding attribute of the input field view updates the
				App.tweetsController object with a value
			*/
			var me = this;
			var username = me.get("username");
			alert(username);
			if (username) {
				/*
					.fmt function performs a string replacement with the %@ as marker
				*/
				var url = 'http://api.twitter.com/1/statuses/user_timeline.json';
				url += '?screen_name=%@%callback=?'.fmt(me.get("username"));
				//push username to recent user array
				App.recentUsersController.addUser(username);
				$.getJSON(url,function(data){
						me.set('content', []);
						$(data).each(function(index,value){
								var t = App.Tweet.create({
										avatar: value.user.profile_image_url,
										screen_name: value.user.screen_name,
										text: value.text,
										date: value.created_at
								});
								me.pushObject(t);
						})
				});
						
			}
		}
});

App.recentUsersController = Ember.ArrayController.create({
		content: [],
		addUser: function(name) {
			if (this.contains(name))this.removeObject(name);
			this.pushObject(name);
		},
		/*
			When a user clicks a previously searched term, this function
			populates App.tweetsController.username with the selected username,
			then triggers loadTweets() function, offering a single-click view
			for previous searches.
		*/
		removeUser: function(view){
			this.removeObject(view.context);
		},
		searchAgain: function(view){
			App.tweetsController.set('username', view.content);
			App.tweetsController.loadTweets();
		},
		/*
			Reverse() first converts the Ember content array into a plain vanilla array
			using the Ember toArray() function, reverses it, and then returns it.
			The property() function takes a comma-delimited list of properties required by the sepcified function
			The property() function is implicitly using the content array itself, addressing
			each element within that array using the @each dependant key.
		*/
		reverse: function() {
			return this.toArray().reverse();
		}.property('@each')
});
