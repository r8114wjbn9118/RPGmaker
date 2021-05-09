xx_screenshot_Bitmap_snap = Bitmap.snap;
Bitmap.snap = function(stage) {
	var bitmap = xx_screenshot_Bitmap_snap.call(this, stage);
	screenshot.url = bitmap.canvas.toDataURL();
	return bitmap;
};


	var fs = require("fs");
	var url = bitmap.canvas.toDataURL();
	url = url.split(";base64,");
	var data = atob(url[1]);
	fs.writeFile("bitmap.png", data, "ascii");