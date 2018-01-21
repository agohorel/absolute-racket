// audio variables
var osc,
	noiseOsc,
	noiseAmount = 0,
	attackLevel = 1.0,
	releaseLevel = 0,
	attack = 0.001,
	decay = 0.2,
	sustain = 0.2,
	release = 0.5,
	envelope,
	pitch,
	hpFilter,
	hpCutoff,
	lpFilter,
	lpCutoff,
	q,
	fft,
	bass,
	mid,
	high,
	amplitude,
	validKey;

var notes = {
	90: 130.81,
	83: 138.59,
	88: 146.83,
	68: 155.56,
	67: 164.81,
	86: 174.61,
	71: 185,
	66: 196,
	72: 207.65,
	78: 220,
	74: 233.08,
	77: 246.94,
	188: 261.63,
}

var oscTypes = {
	49: "sine",
	50: "triangle",
	51: "square",
	52: "sawtooth"
}

var noiseTypes = {
	53: "white",
	54: "pink",
	55: "brown"
}

// other variables
var canvas;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
	noSmooth();

	osc = new p5.Oscillator();
	osc.setType("sawtooth");
	osc.start();

	envelope = new p5.Env();

	noiseOsc = new p5.Noise;
	noiseOsc.start();

	hpFilter = new p5.HighPass();
	lpFilter = new p5.LowPass();
	
	amplitude = new p5.Amplitude();
	fft = new p5.FFT(0.9, 512);
	
	resetFilters();
}

function draw(){
	envelope.setADSR(attack, decay, sustain, release);
	envelope.setRange(attackLevel, releaseLevel);

	osc.freq(pitch);

	myFFT();

	if (validKey === true){
		envelope.play();
		print(envelope);
		osc.amp(envelope);
		noiseOsc.amp(noiseAmount);
	} else {
		osc.amp(0);
		noiseOsc.amp(0);
	}

	fill(0, 80);
	rect(0, 0, width, height);

	noStroke();

	// set spectrum colors based on freq
	fill(bass, mid, high);

	// draw the spectrum
	for (var i = 0; i < spectrum.length; i++){
		var x = map(i, 0, spectrum.length, 0, width);
		var h = -height + map(spectrum[i], 0, 255, height, 0);
		rect(x, height, width/spectrum.length, h);
	}
}

function keyPressed(){
	// set pitch
	if (notes[keyCode]){
		validKey = true;
		pitch = notes[keyCode];
	} 
	// set oscillator type
	else if (oscTypes[keyCode]){
		osc.setType(oscTypes[keyCode]);
	}
	// set noise type
	else if (noiseTypes[keyCode]){
		noiseOsc.setType(noiseTypes[keyCode]);
	}
	// if key is invalid, ignore it & mute
	else {
		validKey = false;
		osc.amp(0);
		noiseOsc.amp(0);
	}
}

function keyReleased(){
	validKey = false;
}

function mouseWheel(event){
	// mouse wheel controls volume of noise
	noiseAmount += (event.delta * -1) / 10000;
	noiseAmount = constrain(noiseAmount, 0, 1);
}

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 20, 0);

	// LFP controls
	if (mouseButton === LEFT){
		osc.disconnect();
		osc.connect(hpFilter)
		noiseOsc.disconnect();
		noiseOsc.connect(hpFilter);

		hpCutoff = map(mouseX, 0, windowWidth, 0, 10000);
		hpFilter.freq(hpCutoff);
		hpFilter.res(q);
	}

	// HFP controls
	else if (mouseButton === RIGHT){
		osc.disconnect();
		osc.connect(lpFilter);
		noiseOsc.disconnect();
		noiseOsc.connect(lpFilter);

		lpCutoff = map(mouseX, 0, windowWidth, 20, 20000);
		lpFilter.freq(lpCutoff);
		lpFilter.res(q);
	}
}

function mouseReleased(){
	resetFilters();
}

// audio analysis stuff
function myFFT(){
	spectrum = fft.analyze();
	volume = amplitude.getLevel();
	bass = fft.getEnergy("bass");
	mid = fft.getEnergy("mid");
	high = fft.getEnergy("treble");
	//console.log("volume: " + volume + " bass: " + bass + " mid: " + mid + " hi: " + high);
}

// initialize/reset filter parameters
function resetFilters(){
	hpCutoff = 0;
	lpCutoff = 20000;
	q = 0;
	hpFilter.freq(hpCutoff);
	lpFilter.freq(lpCutoff);
	hpFilter.res(q);
	lpFilter.res(q);
	osc.disconnect();
	osc.connect();
	noiseOsc.disconnect();
	noiseOsc.connect();
}

// resize canvas if window is resized
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	centerCanvas();
}

// re-center canvas if the window is resized
function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}