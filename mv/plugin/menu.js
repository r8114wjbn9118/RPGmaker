/*:
@param 选项

@param 初始选项
@parent 选项
@type number
@min 1
@desc 
@default 1

@param 选项名称
@parent 选项
@type text[]
@default ["物品","技能","装备","状态","设置","保存","结束"]

@param 选项內容
@parent 选项
@type select[]
@option 物品
@option 技能
@option 装备
@option 状态
@option 设置
@option 保存
@option 结束
@default ["物品","技能","装备","状态","设置","保存","结束"]

@param 选项间距
@parent 选项
@type number
@default 30

@param 选项文字大小
@parent 选项
@type number
@min 0
@default 64

@param 选项文字颜色
@parent 选项
@type text
@default #ffffff

@param 选项文字边框颜色
@parent 选项
@type text
@default rgba(0, 0, 0, 0.5)

@param 选中选项文字颜色
@parent 选项
@type text
@default #000000

@param 选中选项文字边框颜色
@parent 选项
@type text
@default rgba(255, 255, 255, 0.5)

@param 选项文字边框厚度
@parent 选项
@type number
@min 0
@default 4

@param 选项弹出帧数
@parent 选项
@type number
@min 0
@default 60

@param 选项文字与画面边框距离
@parent 选项
@type text
@desc x;y
@default 50;20



@param 右下文字

@param 文字內容
@parent 右下文字
@type text
@default 世界已暂停

@param 文字大小
@parent 右下文字
@type number
@min 0
@default 64

@param 文字颜色
@parent 右下文字
@type text
@default #ffffff

@param 文字边框颜色
@parent 右下文字
@type text
@default rgba(0, 0, 0, 0.5)

@param 文字边框厚度
@parent 右下文字
@type number
@min 0
@default 4

@param 文字弹出帧数
@parent 右下文字
@type number
@min 0
@default 60

@param 文字与画面边框距离
@parent 右下文字
@type text
@desc x;y
@default 10;15
*/

var xx = xx || {}
xx.menu = {}

xx.menu.lastIndexOf	= document.currentScript.src.lastIndexOf( '/' );
xx.menu.indexOf		= document.currentScript.src.indexOf( '.js' );
xx.menu.JSName		= document.currentScript.src.substring(xx.menu.lastIndexOf + 1, xx.menu.indexOf);
xx.menu.JSName		= decodeURIComponent(xx.menu.JSName);
xx.menu.parameters	= PluginManager.parameters(xx.menu.JSName);

xx.menu.options = {};
xx.menu.options.initialIndex = Number(xx.menu.parameters["初始选项"]);
xx.menu.options.name = JSON.parse(xx.menu.parameters["选项名称"]);
xx.menu.options.length = xx.menu.options.name.length;
xx.menu.options.content = JSON.parse(xx.menu.parameters["选项內容"]);
xx.menu.options.spacing = Number(xx.menu.parameters["选项间距"]);
xx.menu.options.fontSize = Number(xx.menu.parameters["选项文字大小"]);
xx.menu.options.textColor = String(xx.menu.parameters["选项文字颜色"]);
xx.menu.options.outlineColor = String(xx.menu.parameters["选项文字边框颜色"]);
xx.menu.options.selectedTextColor = String(xx.menu.parameters["选中选项文字颜色"]);
xx.menu.options.selectedOutlineColor = String(xx.menu.parameters["选中选项文字边框颜色"]);
xx.menu.options.outlineWidth = Number(xx.menu.parameters["选项文字边框厚度"]);
xx.menu.options.popupSpeed = Number(xx.menu.parameters["选项弹出帧数"]);
xx.menu.options.BorderSpacing = String(xx.menu.parameters["选项文字与画面边框距离"]);
xx.menu.options.BorderSpacing = xx.menu.options.BorderSpacing.split(";");
for(let i = 0; i < xx.menu.options.BorderSpacing.length; i++)
	xx.menu.options.BorderSpacing[i] = Number(xx.menu.options.BorderSpacing[i]);

xx.menu.text = {};
xx.menu.text.content = String(xx.menu.parameters["文字內容"]);
xx.menu.text.fontSize = Number(xx.menu.parameters["文字大小"]);
xx.menu.text.textColor = String(xx.menu.parameters["文字颜色"]);
xx.menu.text.outlineColor = String(xx.menu.parameters["文字边框颜色"]);
xx.menu.text.outlineWidth = Number(xx.menu.parameters["文字边框厚度"]);
xx.menu.text.popupSpeed = Number(xx.menu.parameters["文字弹出帧数"]);
xx.menu.text.BorderSpacing = String(xx.menu.parameters["文字与画面边框距离"]);
xx.menu.text.BorderSpacing = xx.menu.text.BorderSpacing.split(";");
for(let i = 0; i < xx.menu.text.BorderSpacing.length; i++)
	xx.menu.text.BorderSpacing[i] = Number(xx.menu.text.BorderSpacing[i]);



xx.menu.TouchInput_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
	xx.menu.TouchInput_onMouseMove.call(this, event);
    this._mouseOverX = Graphics.pageToCanvasX(event.pageX);
    this._mouseOverY = Graphics.pageToCanvasY(event.pageY);
};



Scene_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
	this._mouseX = null;
	this._mouseY = null;
	this._move = true;
	this._index = xx.menu.options.initialIndex % xx.menu.options.name.length;
};

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
	this.drawCommand();
	this.drawText();
};

Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

Scene_Menu.prototype.drawCommand = function() {
	var command = xx.menu.options.name;
	var length = command.length;
	var fontsize = xx.menu.options.fontSize;
	var spacing = xx.menu.options.spacing;
	var XBorderSpacing = xx.menu.options.BorderSpacing[0];
	var YBorderSpacing = xx.menu.options.BorderSpacing[1];
	
	this._command = [];
	for(let i = 0; i < length; i++) {
		var maxWidth = fontsize * command[i].length;
		var minX = -maxWidth;
		var maxX = XBorderSpacing + spacing * Math.abs((i > Math.floor(length / 2) - 1 ? length - 1: 0) - i);
		
		this._command[i] = new Sprite(new Bitmap(maxWidth + 10, fontsize + 10));
		this._command[i]._maxWidth = maxWidth;
		this._command[i]._minX = minX;
		this._command[i]._maxX = maxX;
		
		this._command[i].bitmap.outlineWidth = xx.menu.options.outlineWidth;
		this._command[i].bitmap.fontSize = fontsize;
		
		if(i == this._index) {
			this._command[i].bitmap.outlineColor = xx.menu.options.selectedOutlineColor;
			this._command[i].bitmap.textColor = xx.menu.options.selectedTextColor;
		} else {
			this._command[i].bitmap.outlineColor = xx.menu.options.outlineColor;
			this._command[i].bitmap.textColor = xx.menu.options.textColor;
		}
		
		this._command[i].bitmap.drawText(command[i], 5, 5, maxWidth, fontsize);
		
		if(xx.menu.options.popupSpeed > 0)
			this._command[i].x = minX;
		else
			this._command[i].x = maxX;
		this._command[i].y = YBorderSpacing + (Graphics.height - YBorderSpacing * 2) / length * i;
		
		this.addChild(this._command[i]);
	}
};

Scene_Menu.prototype.drawText = function() {
	var text = xx.menu.text.content;
	if(!text) return;
	
	var fontsize = xx.menu.text.fontSize;
	var maxWidth = fontsize * text.length;
	var XBorderSpacing = xx.menu.text.BorderSpacing[0];
	var YBorderSpacing = xx.menu.text.BorderSpacing[1];
	var minX = Graphics.width - xx.menu.text.content.length * fontsize - XBorderSpacing;
	var maxX = Graphics.width;
	
	this._text = new Sprite(new Bitmap(maxWidth + 10, fontsize + 10));
	this._text._minX = minX;
	this._text._maxX = maxX;
	
	this._text.bitmap.outlineWidth = xx.menu.text.outlineWidth;
	this._text.bitmap.fontSize = fontsize;
	
	this._text.bitmap.outlineColor = xx.menu.text.outlineColor;
	this._text.bitmap.textColor = xx.menu.text.textColor;
	
	this._text.bitmap.drawText(text, 5, 5, maxWidth, fontsize);
	
	if(xx.menu.text.popupSpeed > 0)
		this._text.x = maxX;
	else
		this._text.x = minX;
	this._text.y = Graphics.height - fontsize - YBorderSpacing;
	
	this.addChild(this._text);
}

Scene_Menu_update = Scene_Menu.prototype.update;
Scene_Menu.prototype.update = function() {
	Scene_Menu_update.call(this);
	if(this._move) this.updateMove();
	this.updateInput();
	
};

Scene_Menu.prototype.updateMove = function() {
	var optionsPopupSpeed = xx.menu.options.popupSpeed;
	var index = 0
	var length = xx.menu.options.length;
	
	for(let i = 0; i < length; i++) {
		if(this._command[i].x >= this._command[i]._maxX) {
			index++;
			continue;
		}
		this._command[i].x += (this._command[i]._maxX - this._command[i]._minX) / optionsPopupSpeed;
	}
	
	if(!xx.menu.text.content || this._text.x <= this._text._minX) {
		if(index == length) this._move = false;
		return;
	}
	this._text.x -= (this._text._maxX - this._text._minX) / xx.menu.text.popupSpeed;
}

Scene_Menu.prototype.updateInput = function() {
	if(Input.isTriggered('menu') || TouchInput.isCancelled()) {
		SoundManager.playCancel();
		this.popScene();
	}
	if(Input.isTriggered('ok')) {
		SoundManager.playOk();
		this.processOk();
	}
	if(Input.isRepeated('up')) {
		SoundManager.playCursor();
		
		var command = xx.menu.options.name;
		this._command[this._index].bitmap.outlineColor = xx.menu.options.outlineColor;
		this._command[this._index].bitmap.textColor = xx.menu.options.textColor;
		this._command[this._index].bitmap.clear();
		this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
		
		this._index = (this._index + command.length - 1) % command.length;
		this._command[this._index].bitmap.outlineColor = xx.menu.options.selectedOutlineColor;
		this._command[this._index].bitmap.textColor = xx.menu.options.selectedTextColor;
		this._command[this._index].bitmap.clear();
		this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
	}
	if(Input.isRepeated('down')) {
		SoundManager.playCursor();
		
		var command = xx.menu.options.name;
		this._command[this._index].bitmap.outlineColor = xx.menu.options.outlineColor;
		this._command[this._index].bitmap.textColor = xx.menu.options.textColor;
		this._command[this._index].bitmap.clear();
		this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
		
		this._index = (this._index + 1) % command.length;
		this._command[this._index].bitmap.outlineColor = xx.menu.options.selectedOutlineColor;
		this._command[this._index].bitmap.textColor = xx.menu.options.selectedTextColor;
		this._command[this._index].bitmap.clear();
		this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
	}
	if(this._mouseX != TouchInput._mouseOverX || this._mouseY != TouchInput._mouseOverY) {
		this._mouseX = TouchInput._mouseOverX;
		this._mouseY = TouchInput._mouseOverY;
		var length = xx.menu.options.length;
		for(let i = 0; i < length; i++) {
			if(this._mouseX > this._command[i].x && this._mouseX < this._command[i].x + this._command[i].width &&
			   this._mouseY > this._command[i].y && this._mouseY < this._command[i].y + this._command[i].height) {
				var command = xx.menu.options.name;
				this._command[this._index].bitmap.outlineColor = xx.menu.options.outlineColor;
				this._command[this._index].bitmap.textColor = xx.menu.options.textColor;
				this._command[this._index].bitmap.clear();
				this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
				
				this._index = i;
				this._command[this._index].bitmap.outlineColor = xx.menu.options.selectedOutlineColor;
				this._command[this._index].bitmap.textColor = xx.menu.options.selectedTextColor;
				this._command[this._index].bitmap.clear();
				this._command[this._index].bitmap.drawText(command[this._index], 5, 5, this._command[this._index]._maxWidth, xx.menu.options.fontSize);
			}
		}
	}
	if(TouchInput.isTriggered()) {
		if(this._mouseX > this._command[this._index].x && this._mouseX < this._command[this._index].x + this._command[this._index].width &&
		   this._mouseY > this._command[this._index].y && this._mouseY < this._command[this._index].y + this._command[this._index].height) {
			this.processOk();
		}
	}
};

Scene_Menu.prototype.processOk = function() {
	var content = xx.menu.options.content;
	if(this._index < content.length) {
		switch(content[this._index]) {
			case "物品":
				SceneManager.push(Scene_Item);
				break;
            case "技能":
				SceneManager.push(Scene_Skill);
				break;
            case "装备":
				SceneManager.push(Scene_Equip);
				break;
            case "状态":
				SceneManager.push(Scene_Status);
				break;
            case "设置":
				SceneManager.push(Scene_Options);
				break;
            case "保存":
				SceneManager.push(Scene_Save);
				break;
            case "读取":
				SceneManager.push(Scene_Load);
				break;
            case "结束":
				SceneManager.push(Scene_GameEnd);
				break;
			default:
				if(typeof(window[content[this._index]]) === "function");
					SceneManager.push(window[content[this._index]]);
				break;
		}
	}
}