/**
 * @version 0.1
 */

var xx = xx || {};
xx.changeLocalFileDirPath = {}

//测试 开启及关闭游戏时在Record.txt中新增当前电脑时间
xx.changeLocalFileDirPath.onload = onload;
onload = function() {
	//StorageManager.saveOpenAndCloseTime(true);
	xx.changeLocalFileDirPath.onload.call(this);
};

xx.changeLocalFileDirPath.onunload = onunload;
onunload = function() {
	//StorageManager.saveOpenAndCloseTime(false);
	if(typeof(xx.changeLocalFileDirPath.onunload) == "function") {
		xx.changeLocalFileDirPath.onunload.call(this);
	}
};

//测试 更换保存位置为 appdata/local/游戏标题 文件夹中(仅限windows)
xx.changeLocalFileDirPath.StorageManager_localFileDirectoryPath = StorageManager.localFileDirectoryPath;
StorageManager.localFileDirectoryPath = function() {
	if(process.platform == 'win32') {
		var path = require('path');
		var fs = require('fs');

		var dirPath = path.join(process.env.LOCALAPPDATA, document.title);
		if(!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
		return path.join(dirPath, 'save/');
	}
	else {
		xx.changeLocalFileDirPath.StorageManager_localFileDirectoryPath.call(this);
	}
};