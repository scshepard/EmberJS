/*
http://emberjs.com/documentation/#handlebars
(Ember determines whether a path is global or relative to the view by checking whether the first letter is capitalized, which is why your Ember.Application instance should start with a capital letter.)

what's the point of window.App?

	Initialize application
*/

App = Ember.Application.create();

/**************************
* Models
**************************/
App.Tweet = Ember.Object.extend({
	avatar: null,
	screen_name: null,
	text: null,
	date: null
});

/**************************
* Views
**************************/
/*
	Extend Ember's prepackaged View, the TextField
	In addition to allowing arbitrary properties and functions within Views,
		Ember also has built-in
		helper functions available for use.
	insertNewlin(): executes whenever the user presses the Enter/Return key
		while the cursor is within the input box
*/
App.TFView = Ember.TextField.extend({
	insertNewline: function(){
		App.tweetsArray.loadTweets();
	}
});

/**************************
* Controllers
**************************/
App.tweetsArray = Ember.ArrayController.create({
	content: [],
	username: '',
	loadTweets: function() {

		// scope it
		/*
			Set scope for the rest of the function; default for all
			Ember objects is the current function (App.tweetsController)
			However, here we set to "loadTweets".
			
			get and set helper functions are built into every E Object
			
			As soon as  type a value into the input field, the valueBinding
			attribute of the input field view updates the App.
			tweetsController object with a value.
			
			.ftm() function performsa handy string replacement with the
			%@ as the marker
		*/
		var me = this;
		var username = me.get("username");

		// does username property have a value?
		if ( username ) {

			// mention use of .fmt() function
			// http://code418.com/blog/2012/03/08/useful-emberjs-functions/
			var url = 'http://api.twitter.com/1/statuses/user_timeline.json'
				url += '?screen_name=%@&callback=?'.fmt(me.get("username"));

			//alert("here!");
			//console.log("url : " + url);
			// push username to recent user array
			App.recentUsersArray.addUser( username );

			// go get the data tiger!
			/*
				.get() function retrieves data. .getJSON expects
				a JSON packet as a result.
			*/
			$.getJSON(url,function(data){

				// truncates existing array data so that UI shows new information at top 
				me.set('content', []);

				var index = 0;
				$(data).each(function(index,value){

					index++;
					if (index < 5) {
						// create new instance of the Tweet model
						/*
							value.created_at : Mon Apr 15 2013
							value.id : 323821419605663740
							value.id_str : 323821419605663744
							value.in_reply_to_screen_name : 
							
							value.user.created_at : Wed Apr 29 07:17:48 +0000 2009
							value.user.id : 36310188
							
						*/
						
						/*
						*/
						var t = App.Tweet.create({
							avatar: value.user.profile_image_url,
							screen_name: value.user.screen_name,
							text: value.text,
							date: value.created_at
						});
						
						console.log("date : " + value.created_at + " id_str : " + value.id_str + " value.user.created " + value.user.created_at);
						console.log("in_reply: " + value.in_reply_to_screen_name + " value.id : " + value.id + " value.user.id : " + value.user.id);
						
						// push into the content array
						me.pushObject(t);
					}
				})
			});

		}

	}
});

App.recentUsersArray = Ember.ArrayController.create({
	content: [],
	addUser: function(name) {
		/*
			Check the existing array this using the built-in
			function contains()
			
			When a function is called using the {{action}} helper,
			Ember implicitly passes in a reference to the
			current view
		*/
		if ( this.contains(name) ) this.removeObject(name);
		this.pushObject(name);
	},
	/*
		Reverse() converts the Ember content array into a plain vanilla
		aray using Ember's toArray() function, reverses it, then returns it.
		The property() function allows you to use this function as a
		data source. property() takes a comma-delimited list of properties
		required by the function.
		
		Using the @each allws you to address each element withint the array
	*/
	reverse: function(){
		return this.toArray().reverse();
	}.property('@each'),
	/*
		searchAgain: also receives the current view as an arument. When
		a user clicks on the term, this function populates App.tweets
		Controller.username with the selected username, then triggers the
		loadTweets() function
	*/
	searchAgain: function(view){
		App.tweetsArray.set('username', view.context);
		App.tweetsArray.loadTweets();
	},
	removeUser: function(view){
		this.removeObject(view.context);
	}
});
