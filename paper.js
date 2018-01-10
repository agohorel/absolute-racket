var keys = {
	a: {
		shape: function(x, y, size){
			return Path.Circle(x, y, size);
		},
		color: "#00FF00"
	},
	b: {
		shape: function(x, y, size){
			return Path.Circle(x, y, size);
		},
		color: "#FF0000"
	}
}

var shapes = [];

function onKeyDown(event){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	var newShape = keys[event.key].shape(x, y, 300);
	newShape.fillColor = keys[event.key].color;
	shapes.push(newShape);
}

function onFrame(event){
	// decrement loop to avoid splice() fuckery
	for (var i = shapes.length - 1; i >= 0; i--){
		shapes[i].fillColor.hue += 2;
		shapes[i].scale(.85);
		if (shapes[i].area < 1){
			shapes[i].remove();
			shapes.splice(i, 1);
			console.log(shapes);
		}
	}
}