// audio variables
var hpFilter,
	hpCutoff,
	lpFilter,
	lpCutoff,
	q,
	fft,
	bass,
	mid,
	high,
	amplitude,
	audioParams = [];

// other variables
var canvas,
	x,
	y,
	vector, 
	shapes = [],
	lastPressedKey = "";

var keys = {
	z: {
		shape: function(shapeSize){
			makeVector();
			return rect(vector.x, vector.y, shapeSize, shapeSize);
		},
		sound: function(){
			sounds[0].play();
		},
		color: "#FF0000"
	},
	x: {
		shape: function(shapeSize){
			makeVector();
			return rect(vector.x, vector.y, shapeSize, shapeSize/2);
		},
		sound: function(){
			sounds[1].play();
		},
		color: "#00FF00"
	},
	c: {
		shape: function(shapeSize){
			makeVector();
			return ellipse(vector.x, vector.y, shapeSize);
		},
		sound: function(){
			sounds[2].play();
		},
		color: "#0000FF"
	}
}	

function preload(){
	var kick = loadSound("./audio/raea_kick.wav"),
		snare = loadSound("./audio/raea_perc.wav"),
		hat = loadSound("./audio/hat.wav");
	return sounds = [kick, snare, hat];
}

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
	hpFilter = new p5.HighPass();
	lpFilter = new p5.LowPass();
	amplitude = new p5.Amplitude();
	fft = new p5.FFT();
	soundFormats("wav", "ogg");
	resetFilters();
}

function draw(){
	myFFT();

	// loop through all sounds and check if any are playing
	for (var i = 0; i < sounds.length; i++){
		if (sounds[i].isPlaying()){
			// spawn selected shape and pass in volume as size param
			keys[lastPressedKey].shape(volume * 200);
		}
	}
}

function keyPressed(){
	lastPressedKey = key.toLowerCase();
	// check if pressed key exists in keys object
	if (keys[lastPressedKey]){
		keys[lastPressedKey].sound();
		var newShape = keys[lastPressedKey].shape(100);
		shapes.push(newShape);
		return lastPressedKey;
	} else {
		console.log("you pressed the " + key + " key, which doesn't exist in the keys object.");
	}
}

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 5, .001);

	// LFP controls
	if (mouseButton === LEFT){
		
		for (var i = 0; i < sounds.length; i++){
			sounds[i].disconnect();
			sounds[i].connect(hpFilter)
		}

		hpCutoff = map(mouseX, 0, windowWidth, 20, 1000);
		hpFilter.freq(hpCutoff);
		hpFilter.res(q);
		console.log("cutoff is: " + hpCutoff + " resonance is: " + q);
	}

	// HFP controls
	else if (mouseButton === RIGHT){
		
		for (var i = 0; i < sounds.length; i++){
			sounds[i].disconnect();
			sounds[i].connect(lpFilter)
		}
		
		lpCutoff = map(mouseX, 0, windowWidth, 20000, 20);
		lpFilter.freq(lpCutoff);
		lpFilter.res(q);
		//console.log("cutoff is: " + lpCutoff + " resonance is: " + q);
	}	
}

function mouseReleased(){
	resetFilters();
}

function myFFT(){
	spectrum = fft.analyze();
	volume = amplitude.getLevel();
	bass = fft.getEnergy("bass");
	mid = fft.getEnergy("mid");
	high = fft.getEnergy("treble");
	//console.log("volume: " + volume + " bass: " + bass + " mid: " + mid + " hi: " + high);
	return audioParams = [bass, mid, high, volume];
}

function resetFilters(){
	hpCutoff = 0;
	lpCutoff = 20000;
	q = 0;
	hpFilter.freq(hpCutoff);
	lpFilter.freq(lpCutoff);
	hpFilter.res(q);
	lpFilter.res(q);
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	centerCanvas();
}

function makeVector(){
	x = Math.random() * windowWidth;
	y = Math.random() * windowHeight;
	vector = createVector(x, y);
	return vector;
}

/////////////////// paper.js stuff ///////////////////

// function onKeyDown(event){
// 	// check if pressed key exists in keys object
// 	if (keys[event.key]){
// 		console.log(" \n ONKEYDOWN volume is " + audioParams[3] + "\n");
// 		var newShape = keys[event.key].shape((audioParams[3] * 300) + 75);
// 		newShape.fillColor = keys[event.key].color;
// 		shapes.push(newShape);
// 	} else {
// 		console.log("You pressed the " + event.key + " which does not exist in the keys object.");
// 	}	
// }

// function onFrame(event){
// 	myFFT();
// 	// decrement loop to avoid splice() fuckery
// 	for (var i = shapes.length - 1; i >= 0; i--){
// 		shapes[i].fillColor.hue += audioParams[0] * .05;
// 		shapes[i].scale(map(audioParams[3], 0, 1, .8, 5));
// 		if (shapes[i].area < 1){
// 			shapes[i].remove();
// 			shapes.splice(i, 1);
// 		}
// 	}	 
// }