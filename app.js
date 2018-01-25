// audio variables
var osc,
	noiseOsc,
	noiseAmount = 0,
	attackLevel = 1.0,
	releaseLevel = 0,
	attack = 0.0,
	decay = 0.2,
	sustain = 0.2,
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

	osc.freq(pitch);

	myFFT();

	if (validKey === true){
		envelope.play();
		osc.amp(envelope);
		noiseEnvelope.play();
		noiseOsc.amp(noiseEnvelope);
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

// function mouseWheel(event){
	// eventually put FX param controls here
// }

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 20, 0);

	if (mouseIsLocked == false){
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
	background(0);
}

// re-center canvas if the window is resized
function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	canvas.position(x, y);
}

// DOM/GUI stuff

var buttons = document.querySelectorAll(".btn");

for (var i = 0; i < buttons.length; i++){
	buttons[i].addEventListener("click", function(){
		if (this.innerText === "Sine"){
			osc.setType("sine");
		}
		else if (this.innerText === "Triangle"){
			osc.setType("triangle");
		}
		else if (this.innerText === "Square"){
			osc.setType("square");
		}
		else if (this.innerText === "Sawtooth"){
			osc.setType("sawtooth");
		}
		else if (this.innerText === "White"){
			noiseOsc.setType("white");
		}
		else if (this.innerText === "Pink"){
			noiseOsc.setType("pink");
		}
		else if (this.innerText === "Brown"){
			noiseOsc.setType("brown");
		}
	});
}

var volumeSlider = document.querySelector("#volumeSlider");
var attackSlider = document.querySelector("#attackSlider");
var decaySlider = document.querySelector("#decaySlider");
var sustainSlider = document.querySelector("#sustainSlider");
var releaseSlider = document.querySelector("#releaseSlider");
var noiseSlider = document.querySelector("#noiseSlider");

volumeSlider.oninput = function() {
	masterVolume(parseFloat(this.value));
}

volumeSlider.onmousedown = function() {
	mouseIsLocked = true;
}

volumeSlider.onmouseup = function() {
	mouseIsLocked = false;
}

attackSlider.oninput = function() {
	mouseIsLocked = true;
	attack = parseFloat(this.value);
}

attackSlider.onmousedown = function() {
	mouseIsLocked = true;
}

attackSlider.onmouseup = function() {
	mouseIsLocked = false;
}

decaySlider.oninput = function() {
	mouseIsLocked = true;
	decay = parseFloat(this.value);
}

decaySlider.onmousedown = function() {
	mouseIsLocked = true;
}

decaySlider.onmouseup = function() {
	mouseIsLocked = false;
}

sustainSlider.oninput = function() {
	mouseIsLocked = true;
	sustain = parseFloat(this.value);
}

sustainSlider.onmousedown = function() {
	mouseIsLocked = true;
}

sustainSlider.onmouseup = function() {
	mouseIsLocked = false;
}

releaseSlider.oninput = function() {
	mouseIsLocked = true;
	release = parseFloat(this.value);
}

releaseSlider.onmousedown = function() {
	mouseIsLocked = true;
}

releaseSlider.onmouseup = function() {
	mouseIsLocked = false;
}

noiseSlider.oninput = function() {
	mouseIsLocked = true;
	noiseAmount = parseFloat(this.value);
}

noiseSlider.onmousedown = function() {
	mouseIsLocked = true;
}

noiseSlider.onmouseup = function() {
	mouseIsLocked = false;
}