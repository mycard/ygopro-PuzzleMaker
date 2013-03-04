
var patterns = [];
patterns[0] = new RegExp("\\s*--.*");
patterns[1] = new RegExp("\\s*Debug\\.SetAIName\\(\\s*\".*\"\\s*\\).*");
patterns[2] = new RegExp("\\s*Debug\\.ReloadFieldBegin\\(DUEL_ATTACK_FIRST_TURN(\\+DUEL_SIMPLE_AI)?\\).*");
patterns[3] = new RegExp("\\s*Debug\\.SetPlayerInfo\\(\\s*[01]\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\).*");
patterns[4] = new RegExp("\\s*(\\w+\\s*=\\s*)?Debug\\.AddCard\\(\\d+,[01],[01],\\w+,\\d,\\w+(,\\w+)?\\).*");
patterns[5] = new RegExp("\\s*Debug\\.ReloadFieldEnd\\(\\s*\\).*");
patterns[6] = new RegExp("\\s*Debug\\.ShowHint\\(\\s*\".*\"\\s*\\).*");
patterns[7] = new RegExp("\\s*aux\\.BeginPuzzle\\(\\s*\\).*");

upload = function(files) {
	if (files.length) {
		var file = files[0]; 
		var reader = new FileReader(); 
		reader.onload = function() {
			readPuzzle(this.result)
		} 
		reader.readAsText(file); 
	} 
};
function readPuzzle(result){
	var results = result.split('\n'); 
	var cards = [];
	var cards_id = [];
	for(var i =0; i < results.length; i++){
		var tempString = results[i];
		var type = getRegType(tempString);
	//	alert(tempString + '\n' + "type: " + type);
		switch(type){
		case 0:
			break;
		case 1://SetAIName
			strings = tempString.split("\"");
			//AIName = strings[1];
			break;
		case 2://ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI)
			//Use_Simple_AI = tempString.contains("DUEL_SIMPLE_AI");
			break;
		case 3://SetPlayerInfo(0,8000,0,0)
			var params = getFuncParams(tempString);
			var player = parseInt(params[0]);
			var lp = parseInt(params[1]);
			var firstTurnDraw = parseInt(params[2]);
			var everyTurnDraw = parseInt(params[3]);
			SetPlayerInfo(player, lp, firstTurnDraw, everyTurnDraw);
			break;
		case 4://AddCard(2561846,1,1,LOCATION_EXTRA,0,POS_FACEUP_ATTACK)
			var params = getFuncParams(tempString);
			var card_id = parseInt(params[0]);
			var owner = parseInt(params[1]);
			var controler = parseInt(params[2]);
			var location = params[3];
			var place = parseInt(params[4]);
			var position = params[5];
			var disable_revivelimit = params[6];
			if(location == "LOCATION_DECK"||location =="LOCATION_GRAVE"||location =="LOCATION_REMOVED"
				||location =="LOCATION_EXTRA"||location =="LOCATION_HAND"){
				place = 0;
			}
			if(location == "LOCATION_SZONE" && place == 5){
				location = "LOCATION_FIELD";
				place = 0;
			}
			if(position == "POS_FACEDOWN"){
				position = "POS_FACEDOWN_ATTACK";
			}
			if(position == "POS_FACEUP"){
				position = "POS_FACEUP_ATTACK";
			}
			cards.push({"card_id":card_id, "owner":owner, "controler":controler, "location":location, "place":place, "position":position, "disable_revivelimit":disable_revivelimit});
			cards_id.push(card_id);
			break;
		case 5://ReloadFieldEnd
			
			break;
		case 6://ShowHint
			var strings = tempString.split("\"");
		//	PuzzleMaker.hintStrings.add(strings[1]);
			break;
		case 7://BeginPuzzle
		//	PuzzleMaker.BeginPuzzle = true;
			break;
		}
	}
	var fields = GetAllFields();
	for(var i in fields){
		$(fields[i]).empty();
		var card_list = $.data(fields[i], 'card_list');
		card_list = [];
		$.data(fields[i], 'card_list', card_list);
	}
	loadCards(cards_id,cards);
}
function getRegType(String){
	for(var i = 0; i < patterns.length; i++){
		if(String.match(patterns[i]))
			return i;
	}
	return -1;
}
function getFuncParams(str){
	var params = str.split("\(");
	params = params[1].split("\)");
	params = params[0].split(",");
	return params;
}
function SetPlayerInfo(player, lp, firstTurnDraw, everyTurnDraw){
	if(player == 0){
		document.getElementById("Player_LP").value = lp;
	//	PlayerFirstTurnDraw = firstTurnDraw;
	//	PlayerEveryTurnDraw = everyTurnDraw;
	}
	else if(player == 1){
		document.getElementById("AI_LP").value = lp;
	//	AIFirstTurnDraw = firstTurnDraw;
	//	AIEveryTurnDraw = everyTurnDraw;
	}
}
function loadCards(cards_id,cards){
	var url = locale_url + '?q=' + JSON.stringify({_id: {$in: cards_id}});
    $.getJSON(url,function(result){
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(_cards) {
			for(var i in _cards){
				var card = _cards[i];
				var name = '';
				var desc = '';
				for(var j in result){
					if(result[j]._id == card._id){
						name = result[j].name;
						desc = result[j].desc;
						break;
					}
				}
				var data = {
					"_id": card._id,
					"name": name,
					"type": getType(card),
					"atk": card.atk,
					"def": card.def,
					"level": card.level,
					"race": getRace(card),
					"attribute": getAttribute(card),
					"desc": desc
				};
				datas[card._id] = data;
			}
			for(var i in cards){
				newCard(cards[i]);
			}
		});
	});
}
function newCard(card){
	var card_info = new Object();
	card_info.card_id = card.card_id;
	card_info.position = card.position;
	card_info.disable_revivelimit = card.disable_revivelimit;
	card_info.cn = getCardName();
	card_info.equip_target = [];
	card_info.be_equip_target = [];
	card_info.continuous_target = [];
	card_info.be_continuous_target = [];
	card_info.card_counters = [];
	var location = card.location.toLowerCase();
	var field_id = card.owner + "_" + location + "_" + card.place;
	var field = document.getElementById(field_id);
	addCard(field,card_info);
}