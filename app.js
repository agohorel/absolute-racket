// audio variables
var osc,
	osc2,
	oscOctave = 1, 
	osc2Octave = 1,
	osc1Detune = 0,
	osc2Detune = 0,
	noiseOsc,
	noiseAmount = 0,
	attackLevel = 1.0,
	releaseLevel = 0,
	attack = 0.0,
	decay = 0.2,
	sustain = 1,
	release = 0.5,
	envelope,
	noiseEnvelope,
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
	validKey,
	mouseIsLocked = false;

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

// other variables
var canvas;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
	noSmooth();

	masterVolume(.5);

	osc = new p5.Oscillator();
	osc.setType("sawtooth");
	osc.start();

	osc2 = new p5.Oscillator();
	osc2.setType("sine");
	osc2.start();

	envelope = new p5.Env();
	noiseEnvelope = new p5.Env();

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
	noiseEnvelope.setADSR(attack, decay, sustain, release);
	noiseEnvelope.setRange(attackLevel, releaseLevel);
	noiseEnvelope.mult(noiseAmount);

	osc.freq(pitch * oscOctave + osc1Detune);
	osc2.freq(pitch * osc2Octave + osc2Detune);

	myFFT();

	if (validKey === true){
		envelope.play();
		osc.amp(envelope);
		osc2.amp(envelope);
		noiseEnvelope.play();
		noiseOsc.amp(noiseEnvelope);
	} else {
		osc.amp(0);
		osc2.amp(0);
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
		rect(x, height, width/spectrum.length * .5, h);
	}
}

function keyPressed(){
	// set pitch
	if (notes[keyCode]){
		validKey = true;
		pitch = notes[keyCode];
	} 
	// if key is invalid, ignore it & mute
	else {
		validKey = false;
		osc.amp(0);
		osc2.amp(0);
		noiseOsc.amp(0);
	}
}

function keyReleased(){
	validKey = false;
}

// function mouseWheel(event){
	// eventually put FX param controls here
// }

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 20, 0);

	if (mouseIsLocked == false){
		// LFP controls
		if (mouseButton === LEFT){
			osc.disconnect();
			osc.connect(hpFilter);
			osc2.disconnect();
			osc2.connect(hpFilter);
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
			osc2.disconnect();
			osc2.connect(lpFilter);
			noiseOsc.disconnect();
			noiseOsc.connect(lpFilter);

			lpCutoff = map(mouseX, 0, windowWidth, 20, 20000);
			lpFilter.freq(lpCutoff);
			lpFilter.res(q);
		}
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
	osc2.disconnect();
	osc2.connect();
	noiseOsc.disconnect();
	noiseOsc.connect();
}

// resize canvas if window is resized
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	centerCanvas();
	background(0);
}

// re-center canvas if the window is resized
function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}

// OSC 1 TYPE CONTROLS

var osc1Sine = document.getElementById("sine1").addEventListener("click", function(){
	osc.setType("sine");
});

var osc1Triangle = document.getElementById("triangle1").addEventListener("click", function(){
	osc.setType("triangle");
});

var osc1Square = document.getElementById("square1").addEventListener("click", function(){
	osc.setType("square");
});

var osc1Sawtooth = document.getElementById("sawtooth1").addEventListener("click", function(){
	osc.setType("sawtooth");
});

// OSC 1 OCTAVE CONTROLS

var osc1OctaveDown = document.getElementById("osc1OctaveDown").addEventListener("click", function(){
	oscOctave = .5;
});

var osc1OctaveDefault = document.getElementById("osc1OctaveDefault").addEventListener("click", function(){
	oscOctave = 1;
});

var osc1OctaveUp = document.getElementById("osc1OctaveUp").addEventListener("click", function(){
	oscOctave = 2;
});

// OSC 2 TYPE CONTROLS

var osc2Sine = document.getElementById("sine2").addEventListener("click", function(){
	osc2.setType("sine");
});

var osc2Triangle = document.getElementById("triangle2").addEventListener("click", function(){
	osc2.setType("triangle");
});

var osc2Square = document.getElementById("square2").addEventListener("click", function(){
	osc2.setType("square");
});

var osc2Sawtooth = document.getElementById("sawtooth2").addEventListener("click", function(){
	osc2.setType("sawtooth");
});

// OSC 2 OCTAVE CONTROLS

var osc2OctaveDown = document.getElementById("osc2OctaveDown").addEventListener("click", function(){
	osc2Octave = .5;
});

var osc2OctaveDefault = document.getElementById("osc2OctaveDefault").addEventListener("click", function(){
	osc2Octave = 1;
});

var osc2OctaveUp = document.getElementById("osc2OctaveUp").addEventListener("click", function(){
	osc2Octave = 2;
});

// NOISE CONTROLS

var whiteNoise = document.getElementById("whiteNoise").addEventListener("click", function(){
	noiseOsc.setType("white");
});

var pinkNoise = document.getElementById("pinkNoise").addEventListener("click", function(){
	noiseOsc.setType("pink");
});

var brownNoise = document.getElementById("brownNoise").addEventListener("click", function(){
	noiseOsc.setType("brown");
});

// SLIDER CONTROLS

var sliders = document.getElementsByClassName("slider");
var volumeSlider = document.querySelector("#volumeSlider");
var attackSlider = document.querySelector("#attackSlider");
var decaySlider = document.querySelector("#decaySlider");
var sustainSlider = document.querySelector("#sustainSlider");
var releaseSlider = document.querySelector("#releaseSlider");
var noiseSlider = document.querySelector("#noiseSlider");
var osc1DetuneSlider = document.querySelector("#osc1Detune");
var osc2DetuneSlider = document.querySelector("#osc2Detune");

// prevent slider interactions from triggering other mouseclick events
for (var i = 0; i < sliders.length; i++){
	sliders[i].onmousedown = function() {
		mouseIsLocked = true;
	}

	sliders[i].onmouseup = function() {
		mouseIsLocked = false;z
	}
}

volumeSlider.oninput = function() {
	masterVolume(parseFloat(this.value));
}

attackSlider.oninput = function() {
	attack = parseFloat(this.value);
}

decaySlider.oninput = function() {
	decay = parseFloat(this.value);
}

sustainSlider.oninput = function() {
	sustain = parseFloat(this.value);
}

releaseSlider.oninput = function() {
	release = parseFloat(this.value);
}

noiseSlider.oninput = function() {
	noiseAmount = parseFloat(this.value);
}

osc1DetuneSlider.oninput = function() {
	osc1Detune = parseFloat(this.value);
}

osc2DetuneSlider.oninput = function() {
	osc2Detune = parseFloat(this.value);
}