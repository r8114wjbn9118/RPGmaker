/*:

*/
TextManager.again = '再来一次';


//////////////////////////////////////////////////
//	DataManager
//////////////////////////////////////////////////

DataManager.isLastSavefileExists = function() {
	var globalInfo = this.loadGlobalInfo();
	return !!globalInfo[this._lastAccessedId];
}



//////////////////////////////////////////////////
//	Scene_Gameover
//////////////////////////////////////////////////

Scene_Gameover.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	this._savefileId = DataManager.lastAccessedSavefileId();
};

Scene_Gameover.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
	this.createWindowLayer();
    this.createCommandWindow();
};

Scene_Gameover.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Gameover.prototype.isBusy = function() {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

Scene_Gameover.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_GameoverCommand();
    this._commandWindow.setHandler('again',		this.commandAgain.bind(this));
    this._commandWindow.setHandler('continue',	this.commandContinue.bind(this));
    this._commandWindow.setHandler('totitle',	this.commandToTitle.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Gameover.prototype.commandAgain = function() {
    this._commandWindow.close();
	if(DataManager.loadGame(this._savefileId)) {
		this.onLoadSuccess();
	} else {
        this.onLoadFailure();
    }
}

Scene_Gameover.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Load);
}

Scene_Gameover.prototype.commandToTitle = function() {
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
}

Scene_Gameover.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_Gameover.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_Gameover.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};



//////////////////////////////////////////////////
//	Window_GameoverCommand
//////////////////////////////////////////////////

function Window_GameoverCommand() {
    this.initialize.apply(this, arguments);
}

Window_GameoverCommand.prototype = Object.create(Window_Command.prototype);
Window_GameoverCommand.prototype.constructor = Window_GameoverCommand;

Window_GameoverCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
};

Window_GameoverCommand.prototype.windowWidth = function() {
    return 240;
};

Window_GameoverCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};

Window_GameoverCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.again,		'again',	this.isAgainEnabled());
	this.addCommand(TextManager.continue_,	'continue', this.isContinueEnabled());
    this.addCommand(TextManager.toTitle, 	'totitle');
}

Window_GameoverCommand.prototype.isAgainEnabled = function() {
    return DataManager.isLastSavefileExists();
};

Window_GameoverCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};

Window_GameoverCommand.prototype.selectLast = function() {
	var length = this._list.length;
	for(var i = this._index; i < length; ) {
		if(this.commandSymbol(i) == 'again') {
			if (!this.isAgainEnabled()) {
				i++;
			}
			else break;
		}
		else if(this.commandSymbol(i) == 'continue') {
			if(!this.isContinueEnabled()) {
				i++;
			}
			else break;
		}
		else break;
	}
	this.select(i);
};




