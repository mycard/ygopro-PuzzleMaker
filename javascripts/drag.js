
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
var dragging = false;
var putting = false;
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		dragImage.src  = thumb.src;
		var x = thumb.src.lastIndexOf('.');
		var card_id = parseInt(thumb.src.substring(49,x));
		$.data(dragImage, 'card_id', card_id);
		dragging=true;
		var mousePos = getMousePos(ev);
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
	}
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
	parent.childNodes[1].childNodes[0].onmouseover = function(){
		showDetail(thumb);
	}
	parent.childNodes[1].childNodes[0].onmousedown = function(ev){
		dragImage.src  = thumb.src;
		var x = thumb.src.lastIndexOf('.');
		var card_id = parseInt(thumb.src.substring(49,x));
		$.data(dragImage, 'card_id', card_id);
		dragging=true;
		var mousePos = getMousePos(ev);
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
	}
}
function makeMoveable(thumb){
	var parent = thumb.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		dragImage.src  = thumb.src;
		var x = thumb.src.lastIndexOf('.');
		var card_id = parseInt(thumb.src.substring(49,x));
		$.data(dragImage, 'card_id', card_id);
		dragging=true;
		var mousePos = getMousePos(ev);
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
		
		//remove this card forn field
		parent.onmouseout();
		var card_list = $.data(parent, 'card_list');
		var i = $(thumb).tmplItem().data.index;
		var list = del(card_list,i);
		$.data(parent, 'card_list', list);
		parent.removeChild(thumb);
		updateField(parent);
	}
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
}
function showDetail(obj){
	var img = document.getElementById("detail_image");
	var x = obj.src.lastIndexOf('.');
	var card_id = parseInt(obj.src.substring(49,x));
	img.src = "http://my-card.in/images/cards/ygocore/" + card_id + ".jpg";
	var data = datas[card_id];
	//$('#detail_label').html($('#detail-tmpl').tmpl({detail: data}));
	var area = document.getElementById("detail_textarea");
	
	area.value = data.desc;
}
function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(target.onmousedown){
		return false;
	}
}
function mouseUp(ev){
	var dragImage  = document.getElementById('DragImage');
	if(dragging){
		dragging = false;
		putting = true;
		dragImage.style.display = "none";
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
