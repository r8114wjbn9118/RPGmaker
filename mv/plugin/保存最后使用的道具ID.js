/*:
@author	xx
@help

@param 道具ID保存位置
@type variable
@default 10

@param 道具使用者保存位置
@type variable
@default 11

@param 道具目标(角色)保存位置
@type variable
@default 12

@param 道具目标(敌人)保存位置
@type variable
@default 13
*/

var xx = xx || {};
xx.saveUseItemParameter = {};

xx.saveUseItemParameter.lastIndexOf	= document.currentScript.src.lastIndexOf('/');
xx.saveUseItemParameter.indexOf		= document.currentScript.src.indexOf('.js');
xx.saveUseItemParameter.JSName		= document.currentScript.src.substring(xx.saveUseItemParameter.lastIndexOf + 1, xx.saveUseItemParameter.indexOf);
xx.saveUseItemParameter.JSName		= decodeURIComponent(xx.saveUseItemParameter.JSName);

xx.saveUseItemParameter.parameters = PluginManager.parameters(xx.saveUseItemParameter.JSName);
xx.saveUseItemParameter.SaveItemIdVariable = Number(xx.saveUseItemParameter.parameters["道具ID保存位置"]);
xx.saveUseItemParameter.SaveItemUserVariable = Number(xx.saveUseItemParameter.parameters["道具使用者保存位置"]);
xx.saveUseItemParameter.SaveItemTargetToPartyVariable = Number(xx.saveUseItemParameter.parameters["道具目标(角色)保存位置"]);
xx.saveUseItemParameter.SaveItemTargetToTroopVariable = Number(xx.saveUseItemParameter.parameters["道具目标(敌人)保存位置"]);


xx.saveUseItemParameter.BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
	if(action.isItem()) {
		if(xx.saveUseItemParameter.SaveItemIdVariable > 0) {
			$gameVariables.setValue(xx.saveUseItemParameter.SaveItemIdVariable, action.item().id);
		}
		
		if(xx.saveUseItemParameter.SaveItemUserVariable > 0) {
			if(subject.isActor()) {
				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemUserVariable, subject.actorId());
			}
			else {
				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemUserVariable, 0);
			}
		}
		
		if(xx.saveUseItemParameter.SaveItemTargetVariable > 0) {
			var length = targets.length;
			if(length == 0) {
				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToPartyVariable, "");
				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToTroopVariable, "");
			}
			else {
				if(targets[0].isActor()) {
					for(let i = 0; i < length; i++) {
						targets[i] = targets[i].actorId();
					}
					$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToPartyVariable, targets);
					$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToTroopVariable, "");
				}
				else if(targets[0].isEnemy()) {
					var members = $gameTroop.members();
					for(let i = 0; i < length; i++) {
						targets[i] = members.indexOf(targets[i]);
					}
					$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToTroopVariable, targets);
					$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToPartyVariable, "");
				}
			}
		}
	}
	xx.saveUseItemParameter.BattleManager_startAction.call(this);
};

xx.saveUseItemParameter.Scene_ItemBase_applyItem = Scene_ItemBase.prototype.applyItem;
Scene_ItemBase.prototype.applyItem = function() {
	var targets = this.itemTargetActors();
	if(xx.saveUseItemParameter.SaveItemIdVariable > 0)
		$gameVariables.setValue(xx.saveUseItemParameter.SaveItemIdVariable, this.item().id);
	
	if(xx.saveUseItemParameter.SaveItemTargetToPartyVariable > 0) {
		var length = targets.length;
		if(length == 0) {
			targets = "";
		}
		else {
			for(let i = 0; i < length; i++) {
				targets[i] = targets[i].actorId();
			}
		}
	}
	$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToPartyVariable, targets);
	$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetToTroopVariable, "");
	xx.saveUseItemParameter.Scene_ItemBase_applyItem.call(this);
};

//xx.saveUseItemParameter.Game_Action_apply = Game_Action.prototype.apply;
//Game_Action.prototype.apply = function(target) {
//	if(this.isItem()) {
//		if(xx.saveUseItemParameter.SaveItemIdVariable > 0)
//			$gameVariables.setValue(xx.saveUseItemParameter.SaveItemIdVariable, this.item().id); //保存最后使用的道具ID
//		if(xx.saveUseItemParameter.SaveItemTargetVariable > 0)
//			if(target.isActor())
//				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetVariable, target.actorId());
//			else if(target.isEnemy())
//				$gameVariables.setValue(xx.saveUseItemParameter.SaveItemTargetVariable, target.enemyId());
//	}
//	xx.saveUseItemParameter.Game_Action_apply.call(this, target);	
//};