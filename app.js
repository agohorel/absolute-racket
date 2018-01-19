// audio variables
var osc,
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
	audioParams = [],
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

// other variables
var canvas;

function setup(){
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
	noSmooth();

	osc = new p5.Oscillator();
	osc.setType("sawtooth");
	osc.start();

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
	} else {
		osc.amp(0);
	}

	background(0);
	noStroke();
	fill(bass, mid, high);

	for (var i = 0; i < spectrum.length/2; i++){
		var x = map(i, 0, spectrum.length, 0, width * 2);
		var h = -height + map(spectrum[i], 0, 255, height, 0);
		rect(x, height, width/spectrum.length, h);
	}
}

function keyPressed(){
	lastPressedKey = key.toLowerCase();

	if (notes[lastPressedKey]){
		validKey = true;
		pitch = notes[lastPressedKey];
	} else {
		validKey = false;
		osc.amp(0);
	}
}

function keyReleased(){
	validKey = false;
}

function mouseDragged(){
	q = map(mouseY, 0, windowHeight, 5, .001);

	// LFP controls
	if (mouseButton === LEFT){
		osc.disconnect();
		osc.connect(hpFilter)

		hpCutoff = map(mouseX, 0, windowWidth, 20, 1000);
		hpFilter.freq(hpCutoff);
		hpFilter.res(q);
		console.log("cutoff is: " + hpCutoff + " resonance is: " + q);
	}

	// HFP controls
	else if (mouseButton === RIGHT){
		osc.disconnect();
		osc.connect(lpFilter);

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