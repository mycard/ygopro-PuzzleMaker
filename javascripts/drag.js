
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			dragImage.src  = thumb.src;
			var card_info = new Object();
			var x = thumb.src.lastIndexOf('.');
			card_info.card_id = parseInt(thumb.src.substring(49,x));
			card_info.position = "POS_FACEUP_ATTACK";
			card_info.disable_revivelimit = false;
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22 + "px";
			dragImage.style.top      = mousePos.y - 32 + "px";
			dragImage.style.display  = "block";
		}
	}
	thumb.onmouseover = function(){
		var x = thumb.src.lastIndexOf('.');
		var card_id = parseInt(thumb.src.substring(49,x));
		showDetail(card_id);
	}
	//与图片相邻的表格也可以拖动
	parent.childNodes[1].childNodes[0].onmouseover = function(){
		var x = thumb.src.lastIndexOf('.');
		var card_id = parseInt(thumb.src.substring(49,x));
		showDetail(card_id);
	}
	parent.childNodes[1].childNodes[0].onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			dragImage.src  = thumb.src;
			var card_info = new Object();
			var x = thumb.src.lastIndexOf('.');
			card_info.card_id = parseInt(thumb.src.substring(49,x));
			card_info.position = "POS_FACEUP_ATTACK";
			card_info.disable_revivelimit = false;
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22 + "px";
			dragImage.style.top      = mousePos.y - 32 + "px";
			dragImage.style.display  = "block";
		}
	}
}
function makeMoveable(thumb){
	var parent = thumb.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			dragImage.src = thumb.src;
			var tmplItem = $(thumb).tmplItem().data;
			var card_info = tmplItem.card_info;
			var degree = $.data(thumb, "degree");
			$.data(dragImage, 'card_info', card_info);
			dragging=true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22 + "px";
			dragImage.style.top      = mousePos.y - 32 + "px";
			dragImage.style.display  = "block";
			
			//remove this card forn field
		//	parent.onmouseout();
			var card_list = $.data(parent, 'card_list');
			var i = card_info.index;
			var list = del(card_list,i);
			$.data(parent, 'card_list', list);
			parent.removeChild(thumb);
			updateField(parent);
			//下面这句IE无法执行，所以放最后
			Img.rotate(dragImage, degree, true);
		}
	}
	thumb.onmouseover = function(){
		var tmplItem = $(thumb).tmplItem().data;
		card_id = tmplItem.card_info.card_id;
		showDetail(card_id);
	}
	$.data(thumb, "degree", 0);
	thumb.oncontextmenu = function(ev){
		ev = ev || window.event;
		_popmenu.show(ev);
	}
}