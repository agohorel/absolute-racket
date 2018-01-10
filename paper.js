var keys = {
	a: {
		shape: function(x, y, size){
			return Path.Circle(x, y, size);
		},
		color: "#FFFFFF"
	},
	b: {
		shape: function(x, y, size){
			return Path.Circle(x, y, size);
		},
		color: "#FF0000"
	}
}

function onKeyDown(event){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	var newShape = keys[event.key].shape(x, y, 100);
	newShape.fillColor = keys[event.key].color;
}