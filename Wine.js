/****************************
  * Application 
****************************/
Wine = window.Wine = Em.Application.create({
	ready: function(){
		console.log('--------Application ready');
		Wine.wineArray.ready();
	}
});

/****************************
  * Models
****************************/


/****************************
  * Views
****************************/


/****************************
  * Controllers
****************************/
Wine.wineArray = Em.ArrayController.create({
	content: [],
	ready: function(){
		var me = this;
		$.getJSON('wines.txt', function(data){
			me.pushObjects(data);
		});
	},
	loadWine: function(index, event, item) {
		Wine.wineDisplay.addItem(item);
	}
});

Wine.wineDisplay = Em.ArrayController.create({
	content: [],
	addItem: function(item){
		if ( this.get('length') ) this.removeAt( 0, this.get('length') );
		this.pushObject(item);
	}
});