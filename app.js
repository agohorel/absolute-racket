var shapeSize = 300,
	shapes = [],
	reverb, 
	bpFilter;

reverb = new p5.Reverb();
bpFilter = new p5.HighPass();

function preload(){
	var kick = loadSound("./audio/kick.wav"),
		snare = loadSound("./audio/snare.wav"),
		hat = loadSound("./audio/hat.wav");
	return sounds = [kick, snare, hat];
}

function setup(){
	soundFormats("wav", "ogg");
	// set initial reverb params
	reverb.process(sounds[1], 0, 0);
	// mute dry kick signal
	sounds[0].disconnect();
	// route kick signal to filter
	sounds[0].connect(bpFilter);
}

function draw(){
	var freq = map(mouseX, 0, windowWidth, 20, 300);
	bpFilter.freq(freq);
	console.log(freq);
}

var keys = {
	a: {
		shape: function(){
			randomCoords();
			sounds[0].play();
			return Path.Circle(coords, shapeSize);
		},
		color: "#00FF00"
	},
	b: {
		shape: function(){
			randomCoords();
			sounds[1].play();
			return Path.Rectangle(coords, shapeSize, shapeSize);
		},
		color: "#FF0000"
	},
	c: {
		shape: function(){
			randomCoords();
			sounds[2].play();
			return Path.RegularPolygon(coords, 3, shapeSize);
		},
		color: "#0000FF"
	}
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

// change reverb params - problematic (causes lag)
function mousePressed(){
	console.log("the mouse has been moved to " + mouseX, mouseY);
	var duration = map(mouseX, 0, 1300, 0, 8);
	var decay = map(mouseY, -1000, 0, 0, 90);
	reverb.set(duration, decay);
}