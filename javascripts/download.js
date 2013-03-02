

function downloadURL(){
	var player_LP = document.getElementById("Player_LP").value;
	var AI_LP = document.getElementById("AI_LP").value;
	var str = "--created by ygopro puzzle maker \r\n";
	str += "Debug.SetAIName('高性能电子头脑')\r\n";
	str += "Debug.ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI)\r\n";
	str += "Debug.SetPlayerInfo(0," + player_LP + ",0,0)\r\n";
	str += "Debug.SetPlayerInfo(1," + AI_LP + ",0,0)\r\n" ;
	var action = "";//包括addCounter、Equip、setTarget等等
	var fields = GetAllFields();
	for(var i=0; i< fields.length;i++){
		var tmplItem = $(fields[i]).tmplItem().data;
		var player = tmplItem.player;
		var location = "LOCATION_" + tmplItem.location.toUpperCase();
		var place = tmplItem.place;
		if(location == "LOCATION_FIELD"){
			location = "LOCATION_SZONE";
			place = 5;
		}
		var thumbs = fields[i].getElementsByClassName("thumb");
		for(var j=0; j < thumbs.length; j++){
			var index;
			if(location == "LOCATION_MZONE"){//MZONE的顺序要颠倒一下
				index = thumbs.length - j -1;
			}
			else {
				index = j;
			}
			var card_info = $(thumbs[j]).tmplItem().data.card_info;
			var card_counters = card_info.card_counters;
			var continuous_target = card_info.continuous_target;
			var equip_target = card_info.equip_target;
			var be_continuous_target = card_info.be_continuous_target;
			var be_equip_target = card_info.be_equip_target;
			if(card_counters.length || continuous_target.length || equip_target.length || be_continuous_target.length || be_equip_target.length){
				str += card_info.cn + "=";
			}
			if(card_counters.length){
				for(var k = 0; k < card_counters.length; k++){
					action += "Debug.PreAddCounter(" + card_info.cn + "," + card_counters[k].code + "," + card_counters[k].number + ")\r\n";
				}
			}
			if(continuous_target.length){
				for(var k = 0;k < continuous_target.length; k++){
					var target_info = $(continuous_target[k]).tmplItem().data.card_info;
					action += "Debug.PreSetTarget(" + card_info.cn + "," + target_info.cn + ")\r\n";
				}
			}
			if(equip_target.length){
				for(var k = 0;k < equip_target.length; k++){
					var target_info = $(equip_target[k]).tmplItem().data.card_info;
					action += "Debug.PreEquip(" + card_info.cn + "," + target_info.cn + ")\r\n";
				}
			}
			if(card_info.disable_revivelimit){
				str += "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
			}
			else {
				str += "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + ")\r\n";
			}
		}
	}
	str += "Debug.ReloadFieldEnd()\r\n" ;
	str += "aux.BeginPuzzle()\r\n";
	str += action;
	//this.href = "http://my-card.in/singles/new.lua?name=Untitled&script=" + encodeURIComponent(str);
	document.getElementById("single_name").value = "Untitled";
	document.getElementById("single_script").value = str;
	document.getElementById("download_form").submit();
}
	