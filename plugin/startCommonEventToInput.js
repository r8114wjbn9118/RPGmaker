/*
Input.keyMapper[81] = "commonEvent1"; //Q
Input.commonEvent = [null, 25];

81是键码
commonEvent1是名字 1是代表Input.commonEvent中的位置
25是公共事件的编号
因此 按下Q后执行25号事件
*/


Input.keyMapper[81] = "commonEvent1"; //Q
Input.keyMapper[87] = "commonEvent2"; //W

Input.commonEvent = [null, 25, 26];

xx_Scene_Map_prototype_updateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    xx_Scene_Map_prototype_updateScene.call(this);
    if(!SceneManager.isSceneChanging()) {
        this.updateCallCommonEventInput();
    }
};

Scene_Map.prototype.updateCallCommonEventInput = function() {
	let length = Input.commonEvent.length;
	for(let i = 1; i < length; i++) {
		if(Input.isTriggered("commonEvent" + i)) {
			let index = Input.commonEvent[i];
			let event = $dataCommonEvents[index];
			if(!!event) {
				$gameMap._interpreter.setup(event.list)
			}
		}
	}
}