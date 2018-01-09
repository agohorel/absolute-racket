function onKeyDown(event){
	var x = Math.random() * view.size.width;
	var y = Math.random() * view.size.height;
	var newCircle = new Path.Circle(x, y, 100);
	newCircle.fillColor = "red";
}