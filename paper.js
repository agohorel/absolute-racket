var size = 300;

var keys = {
	a: {
		shape: function(){
			randomCoords();
			return Path.Circle(coord[0] , coord[1], size);
		},
		color: "#00FF00"
	},
	b: {
		shape: function(){
			randomCoords();
			return Path.Rectangle(coord[0] , coord[1], size, size);
		},
		color: "#FF0000"
	}
}

var shapes = [];

function onKeyDown(event){
	var newShape = keys[event.key].shape();
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


function randomCoords(){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	return coord = [x, y];
}