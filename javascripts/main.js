
var current_page ;
var page_num;
var table_row = Math.floor((getFullSize().h-350)/64);
var MZONE = 0;
var SZONE = 1;
var FIELD = 2;
var DECK = 3;
var HAND = 4;
var GRAVE = 5;
var EXTRA = 6;
var REMOVED = 7;
var LOCATION_STRING = ['mzone','szone','field','deck','hand','grave','extra','removed'];
var PLAYER_1 = [
{"top": 138, "left": 71}, //mzone
{"top": 64, "left": 71},  //szone
{"top": 99, "left": 408}, //field
{"top": 20, "left": 8},   //deck
{"top": -13, "left": 71}, //hand
{"top": 99, "left": 8},   //grave
{"top": 20, "left": 408}, //extra
{"top": 178, "left": 8},  //removed
];
var PLAYER_0 = [
{"top": 265, "left": 71}, //mzone
{"top": 339, "left": 71}, //szone
{"top": 302, "left": 8},  //field
{"top": 382, "left": 408},//deck
{"top": 416, "left": 71}, //hand
{"top": 302, "left": 408},//grave
{"top": 382, "left": 8},  //extra
{"top": 222, "left": 408},//removed
];
var COORDINATE = [PLAYER_0,PLAYER_1];

function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name == "")
		return false;
	var url = "https://api.mongolab.com/api/1/databases/mycard/collections/lang_zh?apiKey=508e5726e4b0c54ca4492ead"
	var q = JSON.stringify( {name: {$regex: name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i'}});
	var url2=url + '&q=' + q;
    $.getJSON(url2,function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			return false;
		}
		current_page = 1;
		page_num = 0;
		$.each(result, function(i, card){
			if(i%table_row==0){
				page_num ++;
				html = html + "<table class='page'>";
				html = html + "<tr>";
				html = html + "<th width='45px'>卡图</th>";
				html = html + "<th >卡名</th>";
				html = html + "</tr>";
			}
			html = html + "<tr>";
			html = html + "<td><img class='thumb' src='" + "http://my-card.in/images/cards/ygocore/thumbnail/" + card._id + ".jpg' style='cursor:pointer;'>" + "</td>";
			html = html + "<td width=200px>" + card.name + "</td>";
			html = html + "</tr>";
			if(((i+1)%table_row==0) || (i==result.length)){
				html = html+ "</table>";
			}
        });
		$("#result").html(html);
		tablecloth();
		var thumbs = document.getElementsByClassName("thumb");
		for (var i in thumbs){
			makeDraggable(thumbs[i]);
		}
		page_button.style.display = 'block';
		setPageLabel(current_page, page_num);
		showPage(current_page);
    });
 }
function prePage(){
	if(current_page == 1) return false;
	current_page--;
	setPageLabel(current_page, page_num);
	showPage(current_page);
}

function nextPage(){
	if(current_page == page_num) return false;
	current_page++;
	setPageLabel(current_page, page_num);
	showPage(current_page)
}

function showPage(current_page){
	var tables = document.getElementsByTagName('table');
	for(var i in tables){
		if(i == current_page -1)
			tables[i].style.display = "block";
		else 
			tables[i].style.display = "none";
	}
	
}
function setPageLabel(current_page, page_num) {
	var page_label = $('.page_label');
	var built = $('#page-tmpl').tmpl({
		current_page: current_page || 0,
		page_num: page_num || 0,
	});
	page_label.html(built);
}
function addField(player, location, place) {

	var top = COORDINATE[player][location].top;
	var left = COORDINATE[player][location].left + 66*place;
	
	var built = $('#field-tmpl').tmpl({
		player: player || 0,
		location: LOCATION_STRING[location] || 0,
		place: place || 0,
		top: top,
		left: left,
	});
	$('#fields').append(built);
}

function getViewSize(){
return {w: window['innerWidth'] || document.documentElement.clientWidth,
h: window['innerHeight'] || document.documentElement.clientHeight}
}
function getFullSize(){
return {w: window.screen.width, h: window.screen.height}
}
function del(array,n){
	var result = [];
	for(var i in array){
		if(i != n)
			result.push(array[i]);
	}
　　return result;
}