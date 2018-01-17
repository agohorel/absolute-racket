/////////////////// p5.js stuff ///////////////////
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

hpFilter = new p5.HighPass();
lpFilter = new p5.LowPass();
amplitude = new p5.Amplitude();
fft = new p5.FFT();

function preload(){
	var kick = loadSound("./audio/raea_kick.wav"),
		snare = loadSound("./audio/raea_perc.wav"),
		hat = loadSound("./audio/hat.wav");
	return sounds = [kick, snare, hat];
}

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
	soundFormats("wav", "ogg");
	resetFilters();
}

function draw(){
	rect(mouseX, mouseY, 100, 100);
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
	console.log("volume: " + volume + " bass: " + bass + " mid: " + mid + " hi: " + high);
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

/////////////////// paper.js stuff ///////////////////

var shapes = [];

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

var keys = {
	z: {
		shape: function(shapeSize){
			randomCoords();
			sounds[0].play();
			return Path.Circle(coords, shapeSize);
		},
		color: "#FF0000"
	},
	x: {
		shape: function(shapeSize){
			randomCoords();
			sounds[1].play();
			return Path.Rectangle(coords, shapeSize, shapeSize);
		},
		color: "#00FF00"
	},
	c: {
		shape: function(shapeSize){
			randomCoords();
			sounds[2].play();
			return Path.RegularPolygon(coords, 3, shapeSize);
		},
		color: "#0000FF"
	}
}

function randomCoords(){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	return coords = new Point(x, y);
}