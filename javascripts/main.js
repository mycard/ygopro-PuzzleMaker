
var current_page ;
var page_num;
var table_row = Math.floor((getFullSize().h-370)/64);
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

var locale = 'zh';
var cards_url = "http://my-card.in/cards";
var locale_url = "http://my-card.in/cards_" + locale;

var card_img_url = "http://my-card.in/images/cards/ygocore/";
var card_img_thumb_url = "http://my-card.in/images/cards/ygocore/thumbnail/";

var datas = new Object();
function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name == "")
		return false;
	var q = JSON.stringify( {name: {$regex: name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i'}});
	var url = locale_url + '?q=' + q;
	//$("#detail_label").html(url);
    $.getJSON(url,function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			return false;
		}
		var cards_id = [];
		for (var _i in result) {
			cards_id.push(result[_i]._id);
		}
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(cards) {
			for(var i in cards){
				var card = cards[i];
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
				//alert(JSON.stringify(data));
				datas[card._id]=data;
			}
			//alert(datas);
			current_page = 1;
			page_num = 0;
			$.each(result, function(i, card){
				if(i%table_row==0){
					page_num ++;
					html = html + "<table class='page' style='display:none'>";
					html = html + "<tr>";
					html = html + "<th width='46px'>卡图</th>";
					html = html + "<th >卡名</th>";
					html = html + "</tr>";
				}
				html = html + "<tr>";
				html = html + "<td><img class='thumb' src='" + card_img_thumb_url + card._id + ".jpg' style='cursor:pointer;'>" + "</td>";
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
			var thumbs = tables.getElementsByClassName("thumb");
			for (var i=0; i< thumbs.length;i++){
				makeDraggable(thumbs[i]);
			}
		});
	});
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
	for(var i in tables){
		if(i == current_page -1) //current为1时显示table[0]
			tables[i].style.display = "block";
		else
			tables[i].style.display = "none";
		if(i == tables.length-1)
			return false;
	}
}
function setPageLabel(current_page, page_num) {//显示第X页/共X页
	var page_label = $('.page_label');
	var built = $('#page-tmpl').tmpl({
		current_page: current_page || 0,
		page_num: page_num || 0,
	});
	page_label.html(built);
}
function addField(player, location, place) {//画场地

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
function initField(){
	var fields = document.getElementById("fields").getElementsByTagName("div");
	for(var i=0; i< fields.length;i++){
		var card_list = [];
		$.data(fields[i], 'card_list', card_list);
		fields[i].onmouseover = function(){
			this.style.border = "1px solid #ff0000";
			if(dragging == false && putting == true){
				putting = false;
				var dragImage  = document.getElementById('DragImage');
				var card_info = $.data(dragImage, 'card_info');
				addCard(this, card_info);
			}
		}
		fields[i].onmouseout = function(){
			this.style.border = "1px solid #00ffff";
		}
	}
}

function addCard(field, card_info){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	if(location == "szone" || location == "field"){ //魔陷区和场地区最多只能有1张卡
		card_list = [];
	}
	card_list.push(card_info);
	$.data(field, 'card_list', card_list);
	updateField(field);
}

function updateField(field){
	var tmplItem = $(field).tmplItem().data;
	var card_list = $.data(field, 'card_list');
	$(field).empty();
	var width = $(field).width();
	var length = card_list.length;
	var start = width/2 - 22.5*length;
	for(var i in card_list){
		var top, left, right, bottom;
		if(45 < (width / length)) 
			left = start + 45*i ;
		else 
			left = (width-45)/(length-1)*i;
			
		var card_info = card_list[i];
		card_info.location = tmplItem.location;
		card_info.player = tmplItem.player;
		card_info.place = tmplItem.place;
		card_info.index = i;
		$("#thumb-tmpl").tmpl({
			card_info: card_info,
			top: top || 3,
			left: left || 0,
			right: right || 0,
			bottom: bottom || 0
		}).appendTo(field);
	}
	var thumbs = field.getElementsByClassName("thumb");
	for (var i=0; i<thumbs.length; i++){
		makeMoveable(thumbs[i]);
	}
	updateCards(thumbs);
}
function updateCards(thumbs){	
	for (var i=0; i<thumbs.length; i++){
		var thumb = thumbs[i];
		var tmplItem = $(thumb).tmplItem().data;
		var card_info = tmplItem.card_info;
		var location = card_info.location;
		var card_id = card_info.card_id;
		if(location == "szone" || location == "field"){ //魔陷区和场地区只分表侧和里侧
			if(card_info.position == "POS_FACEDOWN_ATTACK" || card_info.position == "POS_FACEDOWN_DEFENCE")
				tmplItem.card_info.position = "POS_FACEDOWN_ATTACK";
			else 	//card_info.position == "POS_FACEUP_ATTACK" || card_info.position == "POS_FACEUP_DEFENCE"
				tmplItem.card_info.position = "POS_FACEUP_ATTACK";
		}
		else if(location == "mzone"){
			if(1 < thumbs.length && i < thumbs.length-1){//超量素材
				tmplItem.card_info.position = "POS_FACEUP_ATTACK";
				tmplItem.card_info.IsXYZmaterial = true;
			}
			else {
				tmplItem.card_info.IsXYZmaterial = false;
			}
		}
		else if(location != "mzone"){//除魔陷和怪兽区
			tmplItem.card_info.position = "POS_FACEUP_ATTACK";
		}
		if(tmplItem.card_info.position == "POS_FACEUP_ATTACK"){
			thumb.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, 0, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEUP_DEFENCE"){
			thumb.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEDOWN_DEFENCE"){
			thumb.src = "images/unknow.jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEDOWN_ATTACK"){
			thumb.src = "images/unknow.jpg";
			Img.rotate(thumb, 0, true);
		}
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
function showDetail(obj){
	var img = document.getElementById("detail_image");
	//搜索框中的图片没有tpmlItem
	var x = obj.src.lastIndexOf('.');
	var card_id = parseInt(obj.src.substring(49,x));
	//卡片背面表示时为unknow.jpg
	if(isNaN(card_id)){
		var tmplItem = $(obj).tmplItem().data;
		card_id = tmplItem.card_info.card_id;
	}
	img.src = card_img_url + card_id + ".jpg";
	var data = datas[card_id];
	//$('#detail_label').html($('#detail-tmpl').tmpl({detail: data}));
	var textarea = document.getElementById("detail_textarea");
	
	textarea.value = data.desc;
}
function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	_popmenu.hide();
	if(target.onmousedown){
		return false;
	}
}
function mouseUp(ev){
	if(ev.button == 0){
		var dragImage  = document.getElementById('DragImage');
		if(dragging){
			dragging = false;
			putting = true;
			dragImage.style.display = "none";
		}
	}
	if(ev.target.oncontextmenu){
		return false;
	}
}
function mouseMove(ev){
	ev         = ev || window.event;

	var target   = ev.target || ev.srcElement;
	var mousePos = getMousePos(ev);
	var dragImage  = document.getElementById('DragImage');
	if(dragging){
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
	}
	putting = false;
}
function getMousePos(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;
document.oncontextmenu = mouseUp;