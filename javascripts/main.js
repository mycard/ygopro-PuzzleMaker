var filename = "Untitled";
var AI_name = "高性能电子头脑";
var hintMsgs = [];
hintMsgs[0] = "在这个回合取得胜利！";
var _popmenu;
var dragging = false;
var putting = false;
var selectingEquip;
var selectingContinuous;
var removeContinuous;
var thumb_equip;
var thumb_equip_target;
var thumb_continuous;
var thumb_continuous_target;
var isIE = /*@cc_on!@*/!1;
var IE10 = isIE && parseInt($.browser.version) >= 10;
var current_page ;
var page_num;
var table_row = 6;//Math.floor((getViewSize().h-250)/64);
var MZONE = 0;
var SZONE = 1;
var FIELD = 2;
var DECK = 3;
var HAND = 4;
var GRAVE = 5;
var EXTRA = 6;
var REMOVED = 7;
var PZONE_LEFT= 8;
var PZONE_RIGHT = 9;

var LOCATION_STRING = ['mzone','szone','field','deck','hand','grave','extra','removed','pzone_l','pzone_r'];
var PLAYER_1 = [
{"top": 138, "left": 71}, //mzone
{"top": 64, "left": 71},  //szone
{"top": 138, "left": 403}, //field
{"top": -13, "left": 12},   //deck
{"top": -13, "left": 71}, //hand
{"top": 138, "left": 12},    //grave
{"top": -13, "left": 403}, //extra
{"top": 138, "left": -45},  //removed
{"top": 64, "left": 12},//pzone_left
{"top": 64, "left": 403},//pzone_right
];
var PLAYER_0 = [
{"top": 265, "left": 71}, //mzone
{"top": 339, "left": 71}, //szone
{"top": 265, "left": 12}, //field
{"top": 416, "left": 403},//deck
{"top": 416, "left": 71}, //hand
{"top": 265, "left": 403},//grave
{"top": 416, "left": 12},  //extra
{"top": 265, "left": 460},//removed
{"top": 339, "left": 403},//pzone_left
{"top": 339, "left": 12},//pzone2_right
];
var COORDINATE = [PLAYER_0,PLAYER_1];

var locale = 'zh';
var cards_url = "http://my-card.in/cards";

var card_img_url = "http://my-card.in/images/cards/ygocore/";
var card_img_thumb_url = "http://my-card.in/images/cards/ygocore/thumbnail/";

var img_qm="images/qm.png";
var img_close="images/close.png";
var img_unkown="images/unknow.jpg";

var datas = new Object();

function initField(){
	var player, place;
	for(player=0;player<2;player++){
		for(place=0;place<5;place++)
			addField(player,SZONE,place);
		for(place=0;place<5;place++)
			addField(player,MZONE,place);
		addField(player,FIELD,0);
		addField(player,DECK,0);
		addField(player,HAND,0);
		addField(player,GRAVE,0);
		addField(player,EXTRA,0);
		addField(player,REMOVED,0);
		addField(player,PZONE_LEFT,0);
		addField(player,PZONE_RIGHT,0);
	}
	var fields = GetAllFields();
	for(var i=0; i< fields.length;i++){
		var card_list = [];
		$.data(fields[i], 'card_list', card_list);
		fields[i].onmouseover = function(){
			if(dragging == false && putting == true){
				putting = false;
				var dragImage  = document.getElementById('DragImage');
				var card_info = $.data(dragImage, 'card_info');
				addCard(this, card_info);
				$(document).tooltip({track: true});
			}
		}
	}
	var dragImage  = document.getElementById('DragImage');
	dragImage.onmouseover = function(){
		var card_info = $.data(dragImage, 'card_info');
		var card_id = card_info.card_id;
		showDetail(card_id);
	}
	var keyword = document.getElementById('keyword');
	keyword.onkeypress = function(ev){
		var ev = ev || window.event;
		var key = ev.keyCode;
		if(key == 13){
			search();
		}
	};
	_popmenu = new PopMenu;
	$(document).tooltip({track: true});
	$( "#radio" ).buttonset();
	//$( "#check_shuffle" ).button();
	//$( "#check_shuffle" ).buttonset();
	$("#setting_dialog").dialog({
		autoOpen: false,
		resizable: false,
		hide: "puff",
		modal: true,
		width: 350,
		buttons: {
			"确定": function() {
				settingOK(this);
				$( this ).dialog({hide: "clip"});
				$( this ).dialog( "close" );
				$( this ).dialog({hide: "puff"});
			},
			"取消": function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	$(".box_main").hide();
	$('#menu ul').hide();
	$('#menu li a').click(function(){
		$(this).next().slideToggle('normal');
	});
	
	$('#box_link').toggle(function(){
		$('.box_main').show(function(){
			$('.box_main').animate({width:'200px'},500);
		});
		$('#box_img').attr("src", img_close);
	},function(){
		$('.box_main').hide(function(){
			$('.box_main').animate({width:'200px'},500);
		});
		$('#box_img').attr("src", img_qm);
	});
//*test 黑羽
	addList(default_result);
//*/
}

function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name == "")
		return false;
	var q = JSON.stringify( {name: {$regex: name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i'}});
	var locale_url = "http://my-card.in/cards_" + locale;
	var url = locale_url + '?q=' + encodeURIComponent(q);
    $.getJSON(url,function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			alert("未找到相关卡片");
			return false;
		}
		var cards_id = [];
		for (var _i in result) {
			cards_id.push(result[_i]._id);
		}
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(cards) {
			for(var i in cards){
				datas[card._id]=getcarddata(result,cards[i]);
			}
			addList(result);
		});
	});
}

function addList(result){
	current_page = 1;
	page_num = 0;
	var html="";
	$.each(result, function(i, card){
		//console.log(card.name);
		if(i%table_row==0){
			page_num ++;
			html = html + "<table class='page' style='display:none'>";
			html = html + "<tr>";
			html = html + "<th width='46px'>卡图</th>";
			html = html + "<th >卡名</th>";
			html = html + "</tr>";
		}
		html = html + "<tr>";
		html = html + "<td><img class='thumbImg' src='" + card_img_thumb_url + card._id + ".jpg' style='cursor:pointer;'>" + "</td>";
		html = html + "<td width=200px><div class='cardname'>" + card.name + "</div></td>";
		html = html + "</tr>";
		if(((i+1)%table_row==0) || (i==result.length)){
			html = html+ "</table>";
		}
	});
	var tables = document.getElementById("result");
	$(tables).html(html);
	tablecloth();
	page_button.style.display = 'block';
	setPageLabel(current_page, page_num);
	showPage(current_page);
	var thumbs = tables.getElementsByClassName("thumbImg");
	for (var i=0; i< thumbs.length;i++){
		makeDraggable(thumbs[i]);
	}
}

function prePage(){ //上一页
	if(current_page == 1) return false;
	current_page--;
	setPageLabel(current_page, page_num);
	showPage(current_page);
}

function nextPage(){//下一页
	if(current_page == page_num) return false;
	current_page++;
	setPageLabel(current_page, page_num);
	showPage(current_page)
}

function showPage(current_page){//显示current页
	var tables = document.getElementsByTagName('table');
	for(var i=0; i<tables.length; i++){
		if(i == current_page -1) //current为1时显示table[0]
			tables[i].style.display = "block";
		else
			tables[i].style.display = "none";
	}
}

function setPageLabel(current_page, page_num) {//显示第X页/共X页
	var page_label = $('.page_label');
	var built = $('#page-tmpl').tmpl({
		current_page: current_page || 0,
		page_num: page_num || 0
	});
	page_label.html(built);
}

function addField(player, location, place) {//画场地
	var top, left;
	top = COORDINATE[player][location].top;
	left = COORDINATE[player][location].left + 66*place;
	if(location == MZONE || location == SZONE){
		if(player == 0){
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*place;
		}
		else {
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*(4-place);
		}
	}
	$('#field-tmpl').tmpl({
		player: player || 0,
		location: "location_" + LOCATION_STRING[location] || 0,
		place: place || 0,
		top: top,
		left: left
	}).appendTo($('#fields'));
}

function addCard(field, card_info){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	if(location == "location_szone" || location == "location_field"||location == "location_pzone_r"||location == "location_pzone_l"){ //魔陷区和场地区最多只能有1张卡
		card_list = [];
	}
	card_list.push(card_info);
	$.data(field, 'card_list', card_list);
	updateField(field);
}

function updateField(field){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	var thumbs = field.getElementsByClassName("thumb");
	for (var i=0; i<thumbs.length; i++){
		thumbs[i].removeAllRelation();
	}
	$(field).empty();
	var width = $(field).width();
	var length = card_list.length;
	var start = width/2 - 23*length;
	for(var i in card_list){
		var card_info = card_list[i];
		card_info.location = tmplItem.location;
		card_info.player = tmplItem.player;
		card_info.place = tmplItem.place;
		card_info.index = i;
		var top, left, right, bottom;
		if(45 < (width / length)) 
			left = start + 46*i ;
		else 
			left = (width-46)/(length-1)*i;
		$("#thumb-tmpl").tmpl({
			card_info: card_info,
			top: top || 3,
			left: left || 0,
			right: right || 0,
			bottom: bottom || 0,
			card_img_thumb_url: card_img_thumb_url
		}).appendTo(field);
	}
	var thumbs = field.getElementsByClassName("thumb");
	for (var i=0; i<thumbs.length; i++){
		makeMoveable(thumbs[i]);
	}
	updateCards(thumbs);
	if(0 != length){
		var type;
		var text = "";
		if(location == "location_grave" || location == "location_deck" || location == "location_extra" || location == "location_removed"){
			type = "field_group_count";
			text = length;
		}
		else if(location == "location_mzone"){
			type = "monster_ad";
			var card_info = card_list[length-1];
			var data = datas[card_info.card_id];
			if(typeof(data)=="undefined"){
				data=unkownCard(card_info.card_id);
			}
			var atk = data.atk;
			var def = data.def;
			if(atk < 0){atk = "?";}
			if(def < 0){def = "?";}
			text = atk + "/" + def;
		}
		$("#label_field-tmpl").tmpl({
			type: type,
			text: text
		}).appendTo(field);
	}
}

function updateCards(thumbs){	
	for (var i=0; i<thumbs.length; i++){
		var thumb = thumbs[i];
		var tmplItem = $(thumb).tmplItem().data;
		var card_info = tmplItem.card_info;
		var location = card_info.location;
		var card_id = card_info.card_id;
		var thumbImg = thumb.getElementsByTagName("img")[0];
		thumb.addAllRelation();
		if(location == "location_szone" || location == "location_field" || location == "location_pzone_r"|| location == "location_pzone_l"){ //魔陷区和场地区只分表侧和里侧
			if(card_info.position == "POS_FACEDOWN_ATTACK" || card_info.position == "POS_FACEDOWN_DEFENCE")
				card_info.position = "POS_FACEDOWN_ATTACK";
			else
				card_info.position = "POS_FACEUP_ATTACK";
		}
		else if(location == "location_mzone"){
			if(1 < thumbs.length && i < thumbs.length-1){//超量素材
				card_info.position = "POS_FACEUP_ATTACK";
				card_info.IsXYZmaterial = true;
			}
			else {
				card_info.IsXYZmaterial = false;
			}
		}
		else if(location != "location_mzone"){//除魔陷和怪兽区
			card_info.position = "POS_FACEUP_ATTACK";
		}
		if(card_info.position == "POS_FACEUP_ATTACK"){
			if(isIE && !IE10){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumbImg.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, 0, true);
		}
		else if(card_info.position == "POS_FACEUP_DEFENCE"){
			if(isIE && !IE10){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumbImg.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(card_info.position == "POS_FACEDOWN_DEFENCE"){
			if(isIE && !IE10){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumbImg.src = img_unkown;
			Img.rotate(thumb, -90, true);
		}
		else if(card_info.position == "POS_FACEDOWN_ATTACK"){
			if(isIE && !IE10){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumbImg.src = img_unkown;
			Img.rotate(thumb, 0, true);
		}
	}
}

function getcarddata(result,card){
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
		"type": getType(card.type),
		"atk": card.atk,
		"def": card.def,
		"level": card.level,
		"star": getStars(card.level),
		"race": getRace(card.race),
		"attribute": getAttribute(card.attribute),
		"desc": desc
	};
	return data;
}

function getcardId(src){
	var x = src.lastIndexOf('.');
	var y = src.lastIndexOf('/');
	var card_id = parseInt(src.substring(y+1,x));
	//console.log(src.substring(y+1,x));
	return card_id;
}

function GetAllFields(){
	var fields = [];
	addToFields(fields, "location_szone");
	addToFields(fields, "location_mzone");
	addToFields(fields, "location_field");
	addToFields(fields, "location_hand");
	addToFields(fields, "location_deck");
	addToFields(fields, "location_grave");
	addToFields(fields, "location_removed");
	addToFields(fields, "location_extra");
	addToFields(fields, "location_pzone_l");
	addToFields(fields, "location_pzone_r");
	return fields;
}

function addToFields(fields, classname){
	var temp = document.getElementsByClassName(classname);
	for(var i =0; i < temp.length; i++){
		fields.push(temp[i]);
	}
}

function unkownCard(id){
	var data = {
		"_id": id,
		"name": name,
		"type": "???",
		"atk": "???",
		"def": "???",
		"level": "??",
		"star": "???",
		"race": "???",
		"attribute": "???",
		"desc": "???"
	};
	return data;
}

function showDetail(card_id){
	var textarea = document.getElementById("detail_textarea");
	var img = document.getElementById("detail_image");
	img.src = card_img_url + card_id + ".jpg";
	var card = datas[card_id];
	if(typeof(card)=="undefined"){
		card=unkownCard(card_id);
	}
	var text = card.name + "["+ card._id + "]" + "\r\n";
	text += "[" + card.type + "]   "
	if(card.race){
		text += card.race + " / " + card.attribute + "\r\n" ;
		text += "[" + card.star + "] "+(card.level&0xff)+"\r\n";
		text += "ATK/" + (card.atk<0?"?":card.atk) + "  DEF/" + (card.def<0?"?":card.def) + "\r\n";
	}
	else {
		text += "\r\n";
	}
	text +=  card.desc;
	textarea.innerText = text;
}

function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	_popmenu.hide();
	if(target.onmousedown){
		return false;
	}
}

var up;

function mouseUp(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(ev.button == 0 || ev.button == 1){//鼠标左键，ie是0，其他是1
		var dragImage  = document.getElementById('DragImage');
		if(dragging){
			dragging = false;
			putting = true;
			dragImage.style.display = "none";
			Img.rotate(dragImage, 0, true);
			up = true;
		}
	}
	else {
		if(selectingEquip || selectingContinuous || removeContinuous){
			selectingEquip = false;
			selectingContinuous = false;
			removeContinuous = false;
			$(document).tooltip({track: true});
			var thumbs = document.getElementsByClassName('thumb');
			for(var i = 0; i < thumbs.length; i++)
				thumbs[i].style.border = "none";
			return false;
		}
		else if(target.oncontextmenu){
			return false;
		}
	}
}

function mouseMove(ev){
	ev         = ev || window.event;
	var target   = ev.target || ev.srcElement;
	if(dragging){
		var mousePos = getMousePos(ev);
		var dragImage  = document.getElementById('DragImage');
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22 + "px";
		dragImage.style.top      = mousePos.y - 32 + "px";
		dragImage.style.display  = "block";
	}
	
	if(!up)
		putting = false;
	else 
		up = false;
}

function getMousePos(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function checkNums() {
	var key = window.event.keyCode;
	if (key >= 48 && key <= 57 || key == 8) {
	}
	else {
		return false;
	}
}

function checkLetter() {
	var key = window.event.keyCode;
	if (key >= 65 && key <= 97) {
	}
	else {
		return false;
	}
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

function delElement(array,v){
	var result = [];
	for(var i in array){
		if(array[i] != v)
			result.push(array[i]);
	}
	return result;
}

document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;
document.oncontextmenu = mouseUp;
