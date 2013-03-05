
Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
function makeDraggable(thumb){
	var parent = thumb.parentNode.parentNode;
	var dragImage  = document.getElementById('DragImage');
	thumb.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			if(selectingEquip || selectingContinuous || removeContinuous){
				return false;
			}
			dragImage.src  = thumb.src;
			var x = thumb.src.lastIndexOf('.');
			var card_id = parseInt(thumb.src.substring(49,x));
			var card_info = newCard_Info(card_id);
			$.data(dragImage, 'card_info', card_info);
			dragging = true;
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
	var thumbImg = thumb.getElementsByTagName("img")[0];
	var equipImg = thumb.getElementsByTagName("img")[1];
	var targetImg = thumb.getElementsByTagName("img")[2];
	
	var card_info = $(thumb).tmplItem().data.card_info;
	var card_id = card_info.card_id;
	var card_counters = card_info.card_counters;
	var continuous_target = card_info.continuous_target;
	var equip_target = card_info.equip_target;
	var be_continuous_target = card_info.be_continuous_target;
	var be_equip_target = card_info.be_equip_target;
	var dragImage  = document.getElementById('DragImage');
	$.data(thumb, "degree", 0);
	thumbImg.onmousedown = function(ev){
		ev = ev || window.event;
		if(ev.button == 0 || ev.button == 1){
			var tmplItem = $(thumb).tmplItem().data;
			if(selectingEquip && card_info.IsSelectable){
				createEquipRelation(thumb_equip, thumb);
				selectingEquip = false;
				card_info.IsSelectable = false;
				var thumbs = document.getElementsByClassName('thumb');
				for(var i = 0; i < thumbs.length; i++)
					thumbs[i].style.border = "none";
				$(document).tooltip({track: true});
				return false;
			}
			if(selectingContinuous && card_info.IsSelectable){
				createContinuousRelation(thumb_continuous, thumb);
				selectingContinuous = false;
				card_info.IsSelectable = false;
				var thumbs = document.getElementsByClassName('thumb');
				for(var i = 0; i < thumbs.length; i++)
					thumbs[i].style.border = "none";
				$(document).tooltip({track: true});
				return false;
			}
			if(removeContinuous && card_info.IsSelectable){
				thumbImg.onmouseout();
				removeContinuousRelation(thumb_continuous, thumb);
				removeBeContinuousRelation(thumb, thumb_continuous);
				removeContinuous = false;
				card_info.IsSelectable = false;
				var thumbs = document.getElementsByClassName('thumb');
				for(var i = 0; i < thumbs.length; i++)
					thumbs[i].style.border = "none";
				$(document).tooltip({track: true});
				return false;
			}
			else if(selectingEquip || selectingContinuous || removeContinuous)
				return false;
			dragImage.src = thumbImg.src;
			var degree = $.data(thumb, "degree");
			Img.rotate(dragImage, degree, true);
			$.data(dragImage, 'card_info', card_info);
			dragging = true;
			var mousePos = getMousePos(ev);
			dragImage.style.position = 'absolute';
			dragImage.style.left     = mousePos.x - 22 + "px";
			dragImage.style.top      = mousePos.y - 32 + "px";
			dragImage.style.display  = "block";
			
			//remove this card forn field
			thumbImg.onmouseout();
			thumb.removeAllRelation();
			$(document).tooltip({track: true});
			$(document).tooltip( "destroy" );
			var card_list = $.data(parent, 'card_list');
			var i = card_info.index;
			var list = del(card_list,i);
			$.data(parent, 'card_list', list);
			updateField(parent);
		}
	}
	thumbImg.onmouseover = function(){
	var card_info = $(thumb).tmplItem().data.card_info;
	var card_id = card_info.card_id;
	var card_counters = card_info.card_counters;
	var continuous_target = card_info.continuous_target;
	var equip_target = card_info.equip_target;
	var be_continuous_target = card_info.be_continuous_target;
	var be_equip_target = card_info.be_equip_target;
		showDetail(card_id);
	//	equipImg.style.display = "none";
	//	targetImg.style.display = "none";
		if(card_counters.length){
			var str="";
			for(var k = 0; k < card_counters.length; k++){
				str += GetCounterStrByCode(card_counters[k].code) + " ：" + card_counters[k].number + "</br>"
			}
			thumb.title = str;
		}
		if(continuous_target.length){
		//	targetImg.style.display = "block";
			for(var k = 0;k < continuous_target.length; k++){
				continuous_target[k].getElementsByTagName("img")[2].style.display = "block";
			}
		}
		if(equip_target.length){
		//	equipImg.style.display = "block";
			for(var k = 0;k < equip_target.length; k++){
				equip_target[k].getElementsByTagName("img")[1].style.display = "block";
			}
		}
		if(be_continuous_target.length){
		//	targetImg.style.display = "block";
			for(var k = 0;k < be_continuous_target.length; k++){
				be_continuous_target[k].getElementsByTagName("img")[2].style.display = "block";
			}
		}
		if(be_equip_target.length){
		//	equipImg.style.display = "block";
			for(var k = 0;k < be_equip_target.length; k++){
				be_equip_target[k].getElementsByTagName("img")[1].style.display = "block";
			}
		}
	}
	thumbImg.onmouseout = function(){
	var card_info = $(thumb).tmplItem().data.card_info;
	if(card_info == undefined) return ;
	var card_id = card_info.card_id;
	var card_counters = card_info.card_counters;
	var continuous_target = card_info.continuous_target;
	var equip_target = card_info.equip_target;
	var be_continuous_target = card_info.be_continuous_target;
	var be_equip_target = card_info.be_equip_target;
		if(continuous_target.length){
			for(var k = 0;k < continuous_target.length; k++){
				continuous_target[k].getElementsByTagName("img")[2].style.display = "none";
			}
		}
		if(equip_target.length){
			for(var k = 0;k < equip_target.length; k++){
				equip_target[k].getElementsByTagName("img")[1].style.display = "none";
			}
		}
		if(be_continuous_target.length){
			for(var k = 0;k < be_continuous_target.length; k++){
				be_continuous_target[k].getElementsByTagName("img")[2].style.display = "none";
			}
		}
		if(be_equip_target.length){
			for(var k = 0;k < be_equip_target.length; k++){
				be_equip_target[k].getElementsByTagName("img")[1].style.display = "none";
			}
		}
	}
	thumbImg.oncontextmenu = function(ev){
		ev = ev || window.event;
		_popmenu.show(ev);
	}
	thumb.removeAllRelation = function (){
	var card_info = $(thumb).tmplItem().data.card_info;
	var card_id = card_info.card_id;
	var card_counters = card_info.card_counters;
	var continuous_target = card_info.continuous_target;
	var equip_target = card_info.equip_target;
	var be_continuous_target = card_info.be_continuous_target;
	var be_equip_target = card_info.be_equip_target;
		if(continuous_target.length){
			for(var k = 0;k < continuous_target.length; k++){
				removeBeContinuousRelation(continuous_target[k], thumb);
			}
		}
		if(equip_target.length){
			for(var k = 0;k < equip_target.length; k++){
				removeBeEquipRelation(equip_target[k], thumb);
			}
		}
		if(be_continuous_target.length){
			for(var k = 0;k < be_continuous_target.length; k++){
				removeContinuousRelation(be_continuous_target[k], thumb);
			}
		}
		if(be_equip_target.length){
			for(var k = 0;k < be_equip_target.length; k++){
				removeEquipRelation(be_equip_target[k], thumb);
			}
		}
	}
	thumb.addAllRelation = function (){
	var card_info = $(thumb).tmplItem().data.card_info;
	var card_id = card_info.card_id;
	var card_counters = card_info.card_counters;
	var continuous_target = card_info.continuous_target;
	var equip_target = card_info.equip_target;
	var be_continuous_target = card_info.be_continuous_target;
	var be_equip_target = card_info.be_equip_target;
		if(continuous_target.length){
			for(var k = 0;k < continuous_target.length; k++){
				addBeContinuousRelation(continuous_target[k], thumb);
			}
		}
		if(equip_target.length){
			for(var k = 0;k < equip_target.length; k++){
				addBeEquipRelation(equip_target[k], thumb);
			}
		}
		if(be_continuous_target.length){
			for(var k = 0;k < be_continuous_target.length; k++){
				addContinuousRelation(be_continuous_target[k], thumb);
			}
		}
		if(be_equip_target.length){
			for(var k = 0;k < be_equip_target.length; k++){
				addEquipRelation(be_equip_target[k], thumb);
			}
		}
	}
}
function newCard_Info(card_id){
	var card_info = new Object();
	card_info.card_id = card_id;
	card_info.position = "POS_FACEUP_ATTACK";
	card_info.disable_revivelimit = false;
	card_info.cn = getCardName();
	card_info.equip_target = [];
	card_info.be_equip_target = [];
	card_info.continuous_target = [];
	card_info.be_continuous_target = [];
	card_info.card_counters = [];
	return card_info;
}
var c_number = 0;
function getCardName(){
	c_number++;
	return "c" + c_number;
}
function createEquipRelation(thumb_equip, thumb_equip_target){
	var pre_equip_target = $(thumb_equip).tmplItem().data.card_info.equip_target[0];
	removeBeEquipRelation(pre_equip_target, thumb_equip);
	addEquipRelation(thumb_equip, thumb_equip_target);
	addBeEquipRelation(thumb_equip_target, thumb_equip);
}
function createContinuousRelation(thumb_continuous, thumb_continuous_target){
	addContinuousRelation(thumb_continuous, thumb_continuous_target);
	addBeContinuousRelation(thumb_continuous_target, thumb_continuous);
}
function addEquipRelation(thumb_equip, thumb_equip_target){
	var equip = $(thumb_equip).tmplItem().data.card_info;
	if(equip) equip.equip_target[0] = thumb_equip_target;
}
function addBeEquipRelation(thumb_equip_target, thumb_equip){
	var equip_target = $(thumb_equip_target).tmplItem().data.card_info;
	if(equip_target) equip_target.be_equip_target.push(thumb_equip);
}
function addContinuousRelation(thumb_continuous, thumb_continuous_target){
	var continuous = $(thumb_continuous).tmplItem().data.card_info;
	if(continuous) continuous.continuous_target.push(thumb_continuous_target);
}
function addBeContinuousRelation(thumb_continuous_target, thumb_continuous){
	var continuous_target = $(thumb_continuous_target).tmplItem().data.card_info;
	if(continuous_target) continuous_target.be_continuous_target.push(thumb_continuous);
}
function removeContinuousRelation(thumb_continuous, thumb_continuous_target){
	var continuous = $(thumb_continuous).tmplItem().data.card_info;
	if(continuous) continuous.continuous_target = delElement(continuous.continuous_target, thumb_continuous_target);
}
function removeBeContinuousRelation(thumb_continuous_target, thumb_continuous){
	var continuous_target = $(thumb_continuous_target).tmplItem().data.card_info;
	if(continuous_target) continuous_target.be_continuous_target = delElement(continuous_target.be_continuous_target, thumb_continuous);
}
function removeEquipRelation(thumb_equip, thumb_equip_target){
	var equip = $(thumb_equip).tmplItem().data.card_info;
	if(equip) equip.equip_target = delElement(equip.equip_target, thumb_equip_target);
}
function removeBeEquipRelation(thumb_equip_target, thumb_equip){
	var equip_target = $(thumb_equip_target).tmplItem().data.card_info;
	if(equip_target) equip_target.be_equip_target = delElement(equip_target.be_equip_target, thumb_equip);
}
function GetCounterStrByCode(code){
	for(var i in counters){
		if(counters[i].code == code)
			return counters[i].str;
	}
}