var c_number = 0;
function downloadURL(){
	c_number = 0;
	var player_LP = document.getElementById("Player_LP").value;
	var AI_LP = document.getElementById("AI_LP").value;
	var str = "--created by ygopro puzzle maker \r\n";
	str += "Debug.SetAIName('高性能电子头脑')\r\n";
	str += "Debug.ReloadFieldBegin(DUEL_ATTACK_FIRST_TURN+DUEL_SIMPLE_AI)\r\n";
	str += "Debug.SetPlayerInfo(0," + player_LP + ",0,0)\r\n";
	str += "Debug.SetPlayerInfo(1," + AI_LP + ",0,0)\r\n" ;
	
	var fields = document.getElementById("fields").getElementsByTagName("div");
	for(var i=0; i< fields.length;i++){
		var tmplItem = $(fields[i]).tmplItem().data;
		var player = tmplItem.player;
		var location = "LOCATION_" + tmplItem.location.toUpperCase();
		var place = tmplItem.place;
		if(fields[i]){
			var thumbs = fields[i].getElementsByClassName("thumb");
			if(location == "LOCATION_MZONE"){
				for(var j=thumbs.length-1; j>=0 ; j--){
					var card_info = $(thumbs[j]).tmplItem().data.card_info;
					var card_counters = card_info.card_counters;
					if(card_counters != undefined){
						var cn = getC_number();
						str += cn + "=" + "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
						for(var k=0;k<card_counters.length; k++){
							str += "Debug.PreAddCounter(" + cn + "," + card_counters[k].code + "," + card_counters[k].number + ")\r\n";
						}
					}
					else {
						str += "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
					}
				}
			}
			else if(location == "LOCATION_FIELD"){
				for(var j=0; j < thumbs.length; j++){
					location = "LOCATION_SZONE"
					place = 5;
					var card_info = $(thumbs[j]).tmplItem().data.card_info;
					var card_counters = card_info.card_counters;
					if(card_counters != undefined){
						var cn = getC_number();
						str += cn + "=" + "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
						for(var k=0;k<card_counters.length; k++){
							str += "Debug.PreAddCounter(" + cn + "," + card_counters[k].code + "," + card_counters[k].number + ")\r\n";
						}
					}
					else {
						str += "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
					}
				}
			}
			else {
				for(var j=0; j < thumbs.length; j++){
					var card_info = $(thumbs[j]).tmplItem().data.card_info;
					var card_counters = card_info.card_counters;
					if(card_counters != undefined){
						var cn = getC_number();
						str += cn + "=" + "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
						for(var k=0;k<card_counters.length; k++){
							str += "Debug.PreAddCounter(" + cn + "," + card_counters[k].code + "," + card_counters[k].number + ")\r\n";
						}
					}
					else {
						str += "Debug.AddCard(" + card_info.card_id + "," + player + "," + player + "," + location + "," + place + "," + card_info.position + "," + card_info.disable_revivelimit + ")\r\n";
					}
				}
			}
		}
	}
	str += "Debug.ReloadFieldEnd()\r\n" ;
	str += "aux.BeginPuzzle()\r\n";
	this.href = "http://my-card.in/singles/new.lua?name=Untitled&script=" + encodeURIComponent(str);
}
function getC_number(){
	return "c" + c_number++;
}