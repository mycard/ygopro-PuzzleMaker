
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		if(ev.button == 0){
			dragImage.src  = thumb.src;
			var card_info = new Object();
			var x = thumb.src.lastIndexOf('.');
			card_info.card_id = parseInt(thumb.src.substring(49,x));
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22;
			dragImage.style.top      = mousePos.y - 32;
			dragImage.style.display  = "block";
		}
	}
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
	//与图片相邻的表格也可以拖动
	parent.childNodes[1].childNodes[0].onmouseover = function(){
		showDetail(thumb);
	}
	parent.childNodes[1].childNodes[0].onmousedown = function(ev){
		if(ev.button == 0){
			dragImage.src  = thumb.src;
			var card_info = new Object();
			var x = thumb.src.lastIndexOf('.');
			card_info.card_id = parseInt(thumb.src.substring(49,x));
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22;
			dragImage.style.top      = mousePos.y - 32;
			dragImage.style.display  = "block";
		}
	}
}
function makeMoveable(thumb){
	var parent = thumb.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		if(ev.button == 0){
			var tmplItem = $(thumb).tmplItem().data;
			var card_info = tmplItem.card_info;
			var card_id = card_info.card_id;
			dragImage.src  = card_img_thumb_url + card_id + ".jpg";
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22;
			dragImage.style.top      = mousePos.y - 32;
			dragImage.style.display  = "block";
			
			//remove this card forn field
			parent.onmouseout();
			var card_list = $.data(parent, 'card_list');
			var i = card_info.index;
			var list = del(card_list,i);
			$.data(parent, 'card_list', list);
			parent.removeChild(thumb);
			updateField(parent);
		}
	}
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
	$.data(thumb, "degree", 0);
	thumb.oncontextmenu = function(ev){
		_popmenu.show();
	}
}