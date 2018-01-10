var size = 300,
	shapes = [];

var keys = {
	a: {
		shape: function(){
			randomCoords();
			return Path.Circle(coords, size);
		},
		color: "#00FF00"
	},
	b: {
		shape: function(){
			randomCoords();
			return Path.Rectangle(coords, size, size);
		},
		color: "#FF0000"
	},
	c: {
		shape: function(){
			randomCoords();
			return Path.RegularPolygon(coords, 3, size);
		},
		color: "#0000FF"
	}
}

function setup(){
	console.log("this p5.js thing is loading");
}

function onKeyDown(event){
	// check if pressed key exists in keys object
	if (keys[event.key]){
		var newShape = keys[event.key].shape();
		newShape.fillColor = keys[event.key].color;
		shapes.push(newShape);
	} else {
		console.log("You pressed the " + event.key + " which does not exist in the keys object.");
	}	
}

function onFrame(event){
	// decrement loop to avoid splice() fuckery
	for (var i = shapes.length - 1; i >= 0; i--){
		shapes[i].fillColor.hue += 2;
		shapes[i].scale(.85);
		if (shapes[i].area < 1){
			shapes[i].remove();
			shapes.splice(i, 1);
		}
	}	 
}

function randomCoords(){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	return coords = new Point(x, y);
}