// audio variables
var osc,
	noise,
	noiseAmount = 0,
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
	lastPressedKey,
	validKey;

var notes = {
	z: 130.81,
	s: 138.59,
	x: 146.83,
	d: 155.56,
	c: 164.81,
	v: 174.61,
	g: 185,
	b: 196,
	h: 207.65,
	n: 220,
	j: 233.08,
	m: 246.94,
	"¼": 261.63
}

var oscTypes = {
	"1": "sine",
	"2": "triangle",
	"3": "square",
	"4": "sawtooth"
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

	noise = new p5.Noise;
	noise.start();

	hpFilter = new p5.HighPass();
	lpFilter = new p5.LowPass();
	
	amplitude = new p5.Amplitude();
	fft = new p5.FFT();
	
	resetFilters();
}

function draw(){
	myFFT();
	
	osc.freq(pitch);

	if (validKey === true){
		osc.amp(1);
		noise.amp(noiseAmount);
	} else {
		osc.amp(0);
		noise.amp(0);
	}

	fill(0, 80);
	rect(0, 0, width, height);

	noStroke();

	// set spectrum colors based on freq
	fill(bass, mid, high);

	// draw the spectrum
	for (var i = 0; i < spectrum.length/2; i++){
		var x = map(i, 0, spectrum.length, 0, width * 2);
		var h = -height + map(spectrum[i], 0, 255, height, 0);
		rect(x, height, width/spectrum.length, h);
	}
}

function keyPressed(){
	lastPressedKey = key.toLowerCase();

	// set pitch
	if (notes[lastPressedKey]){
		validKey = true;
		pitch = notes[lastPressedKey];
	} 
	// set oscillator type
	else if (oscTypes[key]){
		osc.setType(oscTypes[key]);
	}
	// if key is invalid, ignore it & mute
	else {
		validKey = false;
		osc.amp(0);
		noise.amp(0);
	}
}

function keyReleased(){
	validKey = false;
}

function mouseWheel(event){
	console.log(event.delta * -1)
	noiseAmount += (event.delta * -1) / 10000;
	noiseAmount = constrain(noiseAmount, 0, 1);
	console.log(noiseAmount);
}

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 5, .001);

	// LFP controls
	if (mouseButton === LEFT){
		osc.disconnect();
		osc.connect(hpFilter)
		noise.disconnect();
		noise.connect(hpFilter);

		hpCutoff = map(mouseX, 0, windowWidth, 0, 10000);
		hpFilter.freq(hpCutoff);
		hpFilter.res(q);
	}

	// HFP controls
	else if (mouseButton === RIGHT){
		osc.disconnect();
		osc.connect(lpFilter);
		noise.disconnect();
		noise.connect(lpFilter);

		lpCutoff = map(mouseX, 0, windowWidth, 20000, 20);
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