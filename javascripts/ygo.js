
var types_zh = [
  '怪兽','魔法','陷阱',null,'通常','效果','融合','仪式','陷阱怪兽','灵魂','同盟','二重','调整','同调', null,'衍生物',
  '速攻','永续','装备','场地','反击','反转','卡通','超量','灵摆'
];
var attributes_zh = [
  '地','水','炎','风','光','暗','神'
];	  
var races_zh = [
  '战士族','魔法师族','天使族','恶魔族','不死族','机械族','水族','炎族','岩石族','鸟兽族','植物族','昆虫族','雷族',
  '龙族','兽族','兽战士族','恐龙族','鱼族','海龙族','爬虫类族','念动力族','幻神兽族','创造神族','幻龙族'
];

var counters = [
{"code" : "0x3001" ,"str" : "魔力指示物"},
{"code" : "0x2" ,	"str" : "楔指示物"},
{"code" : "0x3003" ,"str" : "武士道指示物"},
{"code" : "0x3004" ,"str" : "念力指示物"},
{"code" : "0x5" ,	"str" : "光指示物"},
{"code" : "0x6" ,	"str" : "宝玉指示物"},
{"code" : "0x7" ,	"str" : "指示物（剑斗兽之槛）"},
{"code" : "0x8" ,	"str" : "变形斗士指示物"},
{"code" : "0x9" ,	"str" : "毒指示物"},
{"code" : "0xa" ,	"str" : "次世代指示物"},
{"code" : "0x300b" ,"str" : "指示物（古代的机械城）"},
{"code" : "0xc" ,	"str" : "雷指示物"},
{"code" : "0xd" ,	"str" : "强欲指示物"},
{"code" : "0xe" ,	"str" : "A指示物"},
{"code" : "0xf" ,	"str" : "虫指示物"},
{"code" : "0x10" ,	"str" : "黑羽指示物"},
{"code" : "0x11" ,	"str" : "超毒指示物"},
{"code" : "0x12" ,	"str" : "机巧指示物"},
{"code" : "0x13" ,	"str" : "混沌指示物"},
{"code" : "0x14" ,	"str" : "指示物（奇迹之侏罗纪蛋）"},
{"code" : "0x15" ,	"str" : "冰指示物"},
{"code" : "0x16" ,	"str" : "魔石指示物"},
{"code" : "0x17" ,	"str" : "橡子指示物"},
{"code" : "0x18" ,	"str" : "花指示物"},
{"code" : "0x19" ,	"str" : "雾指示物"},
{"code" : "0x1a" ,	"str" : "倍倍指示物"},
{"code" : "0x1b" ,	"str" : "时计指示物"},
{"code" : "0x1c" ,	"str" : "D指示物"},
{"code" : "0x1d" ,	"str" : "废品指示物"},
{"code" : "0x1e" ,	"str" : "门指示物"},
{"code" : "0x1f" ,	"str" : "指示物（巨大战舰）"},
{"code" : "0x20" ,	"str" : "植物指示物"},
{"code" : "0x21" ,	"str" : "守卫指示物"},
{"code" : "0x22" ,	"str" : "龙神指示物"},
{"code" : "0x23" ,	"str" : "海洋指示物"},
{"code" : "0x24" ,	"str" : "弦指示物"},
{"code" : "0x25" ,	"str" : "年代记指示物"},
{"code" : "0x26" ,	"str" : "指示物（金属射手）"},
{"code" : "0x27" ,	"str" : "指示物（死亡蚊）"},
{"code" : "0x3028" ,"str" : "指示物（暗黑投射手）"},
{"code" : "0x29" ,	"str" : "指示物（气球蜥蜴）"},
{"code" : "0x2a" ,	"str" : "指示物（魔法防护器）"},
{"code" : "0x302b" ,"str" : "命运指示物"},
{"code" : "0x2c" ,	"str" : "遵命指示物"},
{"code" : "0x2d" ,	"str" : "指示物（踢火）"},
{"code" : "0x2e" ,	"str" : "鲨指示物"},
{"code" : "0x2f" ,	"str" : "南瓜指示物"},
{"code" : "0x30" ,	"str" : "毅飞冲天指示物"},
{"code" : "0x31" ,	"str" : "希望剑指示物"},
{"code" : "0x32" ,	"str" : "气球指示物"},
{"code" : "0x33" ,	"str" : "妖仙指示物"},
{"code" : "0x34" ,	"str" : "指示物（BOX）"},
{"code" : "0x35" ,	"str" : "音响指示物"},
{"code" : "0x3036" ,"str" : "娱乐法师指示物"},
{"code" : "0x37" ,	"str" : "大怪兽指示物"},
{"code" : "0x90" ,	"str" : "少女指示物"},
{"code" : "0x91" ,	"str" : "速度指示物"},
{"code" : "0x92" ,	"str" : "血指示物"},
{"code" : "0x93" ,	"str" : "幻魔指示物"},
{"code" : "0x94" ,	"str" : "地缚神指示物"},
{"code" : "0x95" ,	"str" : "纹章指示物"},

];
function getType(type){
	var result='';
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
function getRace(race){
	var result;
	for(var i in races_zh){
		if(race & (1<<i)){
			return races_zh[i];
		}
	}
}
function getAttribute(attribute){
	var result;
	for(var i in races_zh){
		if(attribute & (1<<i)){
			return attributes_zh[i];
		}
	}
}
function getStars(level){
	var star = "";
	for(var i=0; i<(level&0xff); i++){
		star += "★";
	}
	return star;
}