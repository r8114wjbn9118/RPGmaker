/*:
@plugindesc 更改移動速度
@help
奔跑速度 = 行走速度 + 奔跑加速度


@param 行走速度
@type number
@min 0
@desc default:4
@default 4

@param 奔跑加速度
@type number
@min 0
@desc default:1
@default 1
*/


(function(){
	var parameters = PluginManager.parameters("ChangeMoveSpeed");
	var move = Number(parameters["行走速度"]);
	var run = Number(parameters["奔跑加速度"]);
	Game_Player.prototype.realMoveSpeed = function() {
		return move + (this.isDashing() ? run : 0);
	};
	
})()