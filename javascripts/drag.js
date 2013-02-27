
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			if(selectingEquip || selectingContinuous){
				return false;
			}
			dragImage.src  = thumb.src;
			var x = thumb.src.lastIndexOf('.');
			var card_id = parseInt(thumb.src.substring(49,x));
			var card_info = newCard_Info(card_id);
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
	parent.childNodes[1].childNodes[0].onmouseover = thumb.onmouseover;
	parent.childNodes[1].childNodes[0].onmousedown = thumb.onmousedown;
}
function makeMoveable(thumb){
	var parent = thumb.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			var tmplItem = $(thumb).tmplItem().data;
			var card_info = tmplItem.card_info;
			if(selectingEquip && card_info.IsSelectable){
				createEquipRelation(thumb_equip, thumb);
				selectingEquip = false;
				card_info.IsSelectable = false;
				var thumbs = document.getElementsByClassName('thumb');
				for(var i = 0; i < thumbs.length; i++)
					thumbs[i].style.border = "none";
				return false;
			}
			if(selectingContinuous && card_info.IsSelectable){
				createContinuousRelation(thumb_continuous, thumb);
				selectingContinuous = false;
				card_info.IsSelectable = false;
				var thumbs = document.getElementsByClassName('thumb');
				for(var i = 0; i < thumbs.length; i++)
					thumbs[i].style.border = "none";
				return false;
			}
			else if(selectingEquip || selectingContinuous)
				return false;
			dragImage.src = thumb.src;
			var degree = $.data(thumb, "degree");
			Img.rotate(dragImage, degree, true);
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
		}
	}
	thumb.onmouseover = function(){
		var card_info = $(thumb).tmplItem().data.card_info;
		card_id = card_info.card_id;
		card_counters = card_info.card_counters;
		continuous_target = card_info.continuous_target;
		equip_target = card_info.equip_target;
		showDetail(card_id);
	/*	
		if(card_counters.length){
			var str="";
			for(var k = 0; k < card_counters.length; k++){
				str += GetCounterStrByCode(card_counters[k].code) + " ：" + card_counters[k].number + "\r\n"
			}
			var options = {
				animation: true,
				placement: "top",
				trigger: "hover",
				title: str,
				delay: { show: 0, hide: 200 }
			}
			$(thumb).popover(options);
		}
		if(continuous_target.length){
			for(var k = 0;k < continuous_target.length; k++){
				
			}
		}
		if(equip_target.length){
			for(var k = 0;k < equip_target.length; k++){
			
			}
		}
		if(card_info.equip_target.length){
		
		}
		if(card_info.be_continuous_target.length || card_info.be_equip_target.length){
		
		}
	*/
	}
	$.data(thumb, "degree", 0);
	thumb.oncontextmenu = function(ev){
		ev = ev || window.event;
		_popmenu.show(ev);
	}
}
function newCard_Info(card_id){
	var card_info = new Object();
	card_info.card_id = card_id;
	card_info.position = "POS_FACEUP_ATTACK";
	card_info.disable_revivelimit = false;
	card_info.cn = getC_number();
	card_info.equip_target = [];
	card_info.be_equip_target = [];
	card_info.continuous_target = [];
	card_info.be_continuous_target = [];
	card_info.card_counters = [];
	return card_info;
}
var c_number = 0;
function getC_number(){
	c_number++;
	return "c" + c_number;
}
var equip_relation = [];
function createEquipRelation(thumb_equip, thumb_equip_target){
	var i;
	var equip = $(thumb_equip).tmplItem().data.card_info;
	var equip_target = $(thumb_equip_target).tmplItem().data.card_info;
	
	for(i=0; i < equip_relation.length; i++){
		if(equip_relation[i].equip == equip.cn){
			equip_relation[i].equip_target = equip_target.cn;
			break;
		}
	}
	if(i == equip_relation.length){
		equip_relation[i] = {};
		equip_relation[i].equip = equip.cn;
		equip_relation[i].equip_target = equip_target.cn;
	}
	//alert("equip: " + equip.cn + " -> " + equip_target.cn);
	equip.equip_target[0] = thumb_equip_target;
	equip_target.be_equip_target.push(thumb_equip);
}
function removeEquipRelation(thumb_equip, thumb_equip_target){
	var i;
	var equip = $(thumb_equip).tmplItem().data.card_info;
	var equip_target = $(thumb_equip_target).tmplItem().data.card_info;
	
	for(i=0; i < equip_relation.length; i++){
		if(equip_relation[i].equip == equip.cn && equip_relation[i].equip_target == equip_target.cn){
			equip_relation = del(equip_relation,i);
			equip.equip_target.delElement(thumb_equip_target);
			equip_target.be_equip_target.delElement(thumb_equip);
			break;
		}
	}
}
var continuous_relation = [];
function createContinuousRelation(thumb_continuous, thumb_continuous_target){
	var i;
	var continuous = $(thumb_continuous).tmplItem().data.card_info;
	var continuous_target = $(thumb_continuous_target).tmplItem().data.card_info;
	
	for(i=0; i < continuous_relation.length; i++){
		if(continuous_relation[i].continuous == continuous.cn){
			continuous_relation[i].continuous_target = continuous_target.cn;
			break;
		}
	}
	if(i == continuous_relation.length){
		continuous_relation[i] = {};
		continuous_relation[i].continuous = continuous.cn;
		continuous_relation[i].continuous_target = continuous_target.cn;
	}
	//alert("continuous: " + continuous.cn + " -> " + continuous_target.cn);
	continuous.continuous_target.push(thumb_continuous_target);
	continuous_target.be_continuous_target.push(thumb_continuous);
}
function removeContinuousRelation(thumb_continuous, thumb_continuous_target){
	var i;
	var continuous = $(thumb_continuous).tmplItem().data.card_info;
	var continuous_target = $(thumb_continuous_target).tmplItem().data.card_info;
	
	for(i=0; i < continuous_relation.length; i++){
		if(continuous_relation[i].continuous == continuous.cn && continuous_relation[i].continuous_target == continuous_target.cn){
			continuous_relation = del(continuous_relation,i);
			continuous.continuous_target.delElement(thumb_continuous_target);
			continuous_target.be_continuous_target.delElement(thumb_continuous);
			break;
		}
	}
}
function GetCounterStrByCode(code){
	for(var i in counters){
		if(counters[i].code == code)
			return counters[i].str;
	}
}