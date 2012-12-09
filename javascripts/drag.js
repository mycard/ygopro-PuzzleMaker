
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
var md = false;
function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(target.onmousedown){
		md=true;
		return false;
	}
}
function mouseUp(ev){
	var dragImage  = document.getElementById('DragImage');
	if(md){
		dragImage.style.display = "none";
	}
	md=false;
}
function mouseMove(ev){
	ev         = ev || window.event;

	var target   = ev.target || ev.srcElement;
	var mousePos = mouseCoords(ev);
	var dragImage  = document.getElementById('DragImage');
	if(md){
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22;
		dragImage.style.top      = mousePos.y - 32;
	}
}
function getPosition(e){
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
		top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
		e     = e.offsetParent;
	}
	left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
	top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
	return {x:left, y:top};
}
function mouseCoords(ev){
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

function makeDraggable(){
	var dragImage  = document.getElementById('DragImage');
	var thumbs = document.getElementsByClassName("thumb");
	for (var i=0;i<thumbs.length;i++){
		thumbs[i].onmousedown = function(ev){
			dragImage.src  = this.src;
			dragImage.style.display = "block";
		}
	}
}