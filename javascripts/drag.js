
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
var dragging = false;
var putting = false;
function makeDraggable(thumb){
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		dragImage.src  = this.src;
		var x = this.src.lastIndexOf('.');
		var card_id = parseInt(this.src.substring(49,x));
		$.data(dragImage, 'card_id', card_id);
		dragging=true;
		var mousePos = getMousePos(ev);
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
	}
	thumb.onmouseover = function(){
		var img = document.getElementById("detail_image");
		var x = this.src.lastIndexOf('.');
		var card_id = parseInt(this.src.substring(49,x));
		img.src = "http://my-card.in/images/cards/ygocore/" + card_id + ".jpg";
		for(var i in details){
			if(details[i]._id == card_id){
				var detail_label = $('#detail_label');
				var built = $('#detail-tmpl').tmpl({detail: details[i]});	
				detail_label.html(built);
			}
		}
	}
}
function makeMoveable(thumb,parent){
	thumb.onmousedown = function(ev){
		var dragImage  = document.getElementById('DragImage');
		dragImage.src  = this.src;
		var x = this.src.lastIndexOf('.');
		var card_id = parseInt(this.src.substring(49,x));
		$.data(dragImage, 'card_id', card_id);
		dragging=true;
		var mousePos = getMousePos(ev);
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
		dragImage.style.display  = "block";
		parent.onmouseout();
		var card_list = $.data(parent, 'card_list');
		var i = $(this).tmplItem().data.index;
		var list = del(card_list,i);
		$.data(parent, 'card_list', list);
		parent.removeChild(this);
		updateField(parent);
	}
	thumb.onmouseover = function(){
		var img = document.getElementById("detail_image");
		var x = this.src.lastIndexOf('.');
		var card_id = parseInt(this.src.substring(49,x));
		img.src = "http://my-card.in/images/cards/ygocore/" + card_id + ".jpg";
		for(var i in details){
			if(details[i]._id == card_id){
				var detail_label = $('#detail_label');
				var built = $('#detail-tmpl').tmpl({detail: details[i]});	
				detail_label.html(built);
			}
		}
	}
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
