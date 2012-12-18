
var popMenu;
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		if(ev.button == 0){
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
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
	parent.childNodes[1].childNodes[0].onmouseover = function(){
		showDetail(thumb);
	}
	parent.childNodes[1].childNodes[0].onmousedown = function(ev){
		if(ev.button == 0){
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
}
function makeMoveable(thumb){
	var parent = thumb.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		if(ev.button == 0){
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
	}
	thumb.onmouseover = function(){
		showDetail(thumb);
	}
	var i = 0;
	$.data(thumb, "degree", 0);
	thumb.oncontextmenu = function(ev){
		/*
		if(ev.button == 2){
			if((i++)%2==0)
				Img.rotate(thumb, -90);
			else 
				Img.rotate(thumb, 0);
		}
		//*/
		popMenu.show();
	}
}
function showDetail(obj){
	var img = document.getElementById("detail_image");
	var x = obj.src.lastIndexOf('.');
	var card_id = parseInt(obj.src.substring(49,x));
	img.src = "http://my-card.in/images/cards/ygocore/" + card_id + ".jpg";
	var data = datas[card_id];
	//$('#detail_label').html($('#detail-tmpl').tmpl({detail: data}));
	var textarea = document.getElementById("detail_textarea");
	
	textarea.value = data.desc;
}
function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
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
var speed = 1;

var Img = function() {
	var ua = navigator.userAgent,
	isIE = /msie/i.test(ua) && !window.opera;
	var rotate = function(target, degree) {
		var i = 0, sinDeg = 0, cosDeg = 0, timer = null ;
		var deg_begin = $.data(target, "degree");
		var orginW = target.clientWidth, orginH = target.clientHeight;
		clearInterval(timer);
		function run(angle) {
			if (isIE) { // IE
				cosDeg = Math.cos(angle * Math.PI / 180);
				sinDeg = Math.sin(angle * Math.PI / 180);
				with(target.filters.item(0)) {
					M11 = M22 = cosDeg; M12 = -(M21 = sinDeg); 
				}
				target.style.top = (orginH - target.offsetHeight) / 2 + 'px';
				target.style.left = (orginW - target.offsetWidth) / 2 + 'px';
			} else if (target.style.MozTransform !== undefined) {  // Mozilla
				target.style.MozTransform = 'rotate(' + angle + 'deg)';
			} else if (target.style.OTransform !== undefined) {   // Opera
				target.style.OTransform = 'rotate(' + angle + 'deg)';
			} else if (target.style.webkitTransform !== undefined) { // Chrome Safari
				target.style.webkitTransform = 'rotate(' + angle + 'deg)';
			} else {
				target.style.transform = "rotate(" + angle + "deg)";
			}
			
			$.data(target, "degree", angle);
		}
		
		timer = setInterval(function() {
			if(deg_begin < degree){
				i += speed;
				run(deg_begin + i);
				if (deg_begin + i >= degree) {
					i = 0;
					clearInterval(timer);
				}
			}
			else if(deg_begin > degree){
				i -= speed;
				run(deg_begin + i);
				if (deg_begin + i <= degree) {
					i = 0;
					clearInterval(timer);
				}
			}
		}, speed); 
	}
	return {rotate: rotate}
}();
document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;
document.oncontextmenu = mouseUp;