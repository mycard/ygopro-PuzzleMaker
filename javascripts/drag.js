
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
var dragging = false;

function makeDraggable(){
	var dragImage  = document.getElementById('DragImage');
	dragImage.style.display = "none";
	var thumbs = document.getElementsByClassName("thumb");
	for (var i in thumbs){
		thumbs[i].onmousedown = function(ev){
			dragImage.src  = this.src;
			dragging=true;
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
