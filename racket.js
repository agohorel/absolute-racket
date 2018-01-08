var canvas;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	centerCanvas();
}

function draw(){
	background("#232323");
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