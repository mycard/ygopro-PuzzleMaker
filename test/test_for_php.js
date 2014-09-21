
cards_url = "test/cards.php";
card_img_url = "test/pics/";
card_img_thumb_url = "test/pics/thumbnail/";
img_qm="images/qm.png";
img_close="images/close.png";
img_unkown="images/unknow.jpg";

function getcarddata(result,card){
	var data = {
		"_id": card._id,
		"name": card.name,
		"type": getType(card.type),
		"atk": card.atk,
		"def": card.def,
		"level": card.level,
		"star": getStars(card.level),
		"race": getRace(card.race),
		"attribute": getAttribute(card.attribute),
		"desc": card.desc
	};
	return data;
}

function loadCards(cards_id, cards){
	$.ajaxSettings.async = false;
	for(var _i=0;_i<cards_id.length;_i++){
		var id=cards_id[_i];
		var url = cards_url + '?id='+id;
		$.getJSON(url, function(result){
			if(result.length!=0){
				var card=result[0];
				datas[card._id]=getcarddata(result,card);
			}
		});
	}
	for(var j in cards){
		loadCard(cards[j]);
	}
}

function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name.length == 0)
		return false;
		
	var url=cards_url+"?name="+encodeURI(name);

	$.ajaxSettings.async = true;
	//console.log(url);
    $.getJSON(url, function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			alert("未找到相关卡片");
			return false;
		}
		//console.log("cards:"+result.length);
		for(var _i=0;_i<result.length;_i++){
			datas[result[_i]._id]=getcarddata(result,result[_i]);
		}
		addList(result);
	});
}
/*
function downloadURL(){
	filename = "new.lua";
	var player_LP = document.getElementById("Player_LP").value;
	var AI_LP = document.getElementById("AI_LP").value;
	var DUEL_PSEUDO_SHUFFLE = document.getElementById("check_shuffle").checked;
	var str = "--created by ygopro puzzle maker (web) \r\n";
	str += "Debug.SetAIName(\"" + AI_name + "\")\r\n";
	if(DUEL_PSEUDO_SHUFFLE){
		str += "Debug.ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI+DUEL_PSEUDO_SHUFFLE)\r\n";
	}
	else {
		str += "Debug.ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI)\r\n";
	}
	str += "Debug.SetPlayerInfo(0," + player_LP + ",0,0)\r\n";
	str += "Debug.SetPlayerInfo(1," + AI_LP + ",0,0)\r\n" ;
	var action = "";//包括addCounter、Equip、setTarget等等
	var fields = GetAllFields();
	for(var i=0; i< fields.length;i++){
		var tmplItem = $(fields[i]).tmplItem().data;
		var player = tmplItem.player;
		var location = tmplItem.location.toUpperCase();
		var place = tmplItem.place;
		if(location == "LOCATION_FIELD"){
			location = "LOCATION_SZONE";
			place = 5;
		}
		if(location == "LOCATION_PZONE_L"){
			location = "LOCATION_SZONE";
			place = 7;
		}
		if(location == "LOCATION_PZONE_R"){
			location = "LOCATION_SZONE";
			place = 6;
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
			var card_info = $(thumbs[index]).tmplItem().data.card_info;
			var card_counters = card_info.card_counters;
			var continuous_target = card_info.continuous_target;
			var equip_target = card_info.equip_target;
			var be_continuous_target = card_info.be_continuous_target;
			var be_equip_target = card_info.be_equip_target;
			if(card_counters.length || continuous_target.length || equip_target.length || be_continuous_target.length || be_equip_target.length
			||card_info.attack != undefined ||card_info.base_attack != undefined ||card_info.defence != undefined ||card_info.base_defence != undefined
			||card_info.level != undefined
			){
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
			if(card_info.attack != undefined){
				action += set_attack(card_info.cn, card_info.attack);
			}
			if(card_info.base_attack != undefined){
				action += set_base_attack(card_info.cn, card_info.base_attack);
			}
			if(card_info.defence != undefined){
				action += set_defence(card_info.cn, card_info.defence);
			}
			if(card_info.base_defence != undefined){
				action += set_base_defence(card_info.cn, card_info.base_defence);
			}
			if(card_info.level != undefined){
				action += change_level(card_info.cn, card_info.level);
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
	for(var i = 0; i < hintMsgs.length; i++){
		str += "Debug.ShowHint(\"" + hintMsgs[i] + "\")\r\n" ;
	}
	str += "aux.BeginPuzzle()\r\n";
	str += action;
	var w=window.open();
	var data=str.replace(/\r\n/g,"%0d%0a");
	data=data.replace(/"/g,"%22");
	w.document.write('<a href="data:text/plain;charset=utf8,'+data+'" download="new.lua">下载</a><br>');
	w.document.write('<pre>'+str+'</pre>');
}
*/