
var types_zh = [
  '怪兽','魔法','陷阱',null,'通常','效果','融合','仪式','陷阱怪兽','灵魂','同盟','二重','调整','同调', null,'衍生物',
  '速攻','永续','装备','场地','反击','翻转','卡通','超量'
];
var attributes_zh = [
  '地','水','炎','风','光','暗','神'
];	  
var races_zh = [
  '战士族','魔法师族','天使族','恶魔族','不死族','机械族','水族','炎族','岩石族','鸟兽族','植物族','昆虫族','雷族',
  '龙族','兽族','兽战士族','恐龙族','鱼族','海龙族','爬虫族','念动力族','幻神兽族','创造神族'
];

function getType(card){
	var result='';
	var type = card.type;
	for(var i in types_zh){
		if(type & (0x1<<i)){
			if(result=='')
				result = types_zh[i];
			else 
				result = result + "|" + types_zh[i];
		}
	}
	return result;
}
function getRace(card){
	var result;
	var race = card.race;
	for(var i in races_zh){
		if(race & (1<<i)){
			return races_zh[i];
		}
	}
}
function getAttribute(card){
	var result;
	var attribute = card.attribute;
	for(var i in races_zh){
		if(attribute & (1<<i)){
			return attributes_zh[i];
		}
	}
}