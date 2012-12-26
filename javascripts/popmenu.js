var menu_position = 1;
var menu_pos_faceup_attack = 2;
var menu_pos_faceup_defence = 4;
var menu_pos_facedown_defence = 8;
var menu_pos_facedown_attack = 16;
var menu_enable_revivelimit = 32;
var menu_disable_revivelimit = 64;
var menu_target = 128;
var menu_equip = 256;
var menu_counter = 512;


var PopMenu = function createPopMenu(){
	var popMenu = document.getElementById("popMenu");
	var aUl = popMenu.getElementsByTagName("ul");
	var aLi = popMenu.getElementsByTagName("li");
	var showTimer = hideTimer = null;
	var i = 0;
	var maxWidth = maxHeight = 0;
	var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
	var thumb;//弹出右键菜单的thumb
	popMenu.style.display = "none";

	this.show = function (event){
		var event = event || window.event;
		thumb = event.target;
		var tmplItem = $(thumb).tmplItem().data;
		var card_info = tmplItem.card_info;
		var location = card_info.location;
		var menuItems = 0;
		if(location == 'mzone'){
			if(!card_info.IsXYZmaterial){
				menuItems = menu_position + menu_pos_faceup_attack + menu_pos_faceup_defence + menu_pos_facedown_defence + menu_pos_facedown_attack
				+ menu_target + menu_counter;
			}
			if(card_info.disable_revivelimit){
				menuItems += menu_enable_revivelimit;
			}
			else {
				menuItems += menu_disable_revivelimit;
			}
		}
		else if(location == 'szone'){
			menuItems = menu_position + menu_pos_faceup_attack + menu_pos_facedown_attack + menu_target + menu_equip + menu_counter;
		}
		else if(location == 'field'){
			menuItems = menu_position + menu_pos_faceup_attack + menu_pos_facedown_attack + menu_target + menu_counter;
		}
		else if(location == 'grave'){
			if(card_info.disable_revivelimit){
				menuItems += menu_enable_revivelimit;
			}
			else {
				menuItems += menu_disable_revivelimit;
			}
		}
		else if(location == 'hand'){
			menuItems = 0;
		}
		else if(location == 'deck'){
			menuItems = 0;
		}
		else if(location == 'extra'){
			menuItems = 0;
		}
		else if(location == 'removed'){
			menuItems = 0;
		}
		if(menuItems == 0) return false;
		setMenu(menuItems);
		popMenu.style.display = "block";
		popMenu.style.top = getMousePos(event).y + "px";
		popMenu.style.left = getMousePos(event).x + "px";
		setWidth(aUl[0]);
		//最大显示范围
		maxWidth = aDoc[0] - popMenu.offsetWidth;
		maxHeight = aDoc[1] - popMenu.offsetHeight;
		//防止菜单溢出
		popMenu.offsetTop > maxHeight && (popMenu.style.top = maxHeight + "px");
		popMenu.offsetLeft > maxWidth && (popMenu.style.left = maxWidth + "px");
		return false;
	};

	this.hide = function (){
		popMenu.style.display = "none" 
	};
	
	function setMenu(menuItems){
		for(var i=0; i<aLi.length; i++){
			if(menuItems & 1)
				aLi[i].style.display = 'block';
			else
				aLi[i].style.display = 'none';
			menuItems = menuItems >> 1;
		}
	}
	for (i = 0; i < aLi.length; i++){
		//为含有子菜单的li加上箭头
		aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");
		
		//鼠标移入
		aLi[i].onmouseover = function (){
			var oThis = this;
			var oUl = oThis.getElementsByTagName("ul");
			oThis.className += " active";   
			//显示子菜单
			if (oUl[0]){
				clearTimeout(hideTimer);    
				showTimer = setTimeout(function (){
					for (i = 0; i < oThis.parentNode.children.length; i++){
						oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
						(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
					}
					oUl[0].style.display = "block";
					oUl[0].style.top = oThis.offsetTop + "px";
					oUl[0].style.left = oThis.offsetWidth + "px";
					setWidth(oUl[0]);
					//最大显示范围
					maxWidth = aDoc[0] - oUl[0].offsetWidth;
					maxHeight = aDoc[1] - oUl[0].offsetHeight;
					//防止溢出
					maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
					maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
				},300);
			}
		};
		aLi[i].onmousedown = function (){ }
		//鼠标移出 
		aLi[i].onmouseout = function (){
			var oThis = this;
			var oUl = oThis.getElementsByTagName("ul");
			oThis.className = oThis.className.replace(/\s?active/,"");
			clearTimeout(showTimer);
			hideTimer = setTimeout(function (){
				for (i = 0; i < oThis.parentNode.children.length; i++){
					oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
					(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
				}
			},300);
		};
	}

	function setWidth(obj){
		maxWidth = 0;
		for (var i = 0; i < obj.children.length; i++){
			var oLi = obj.children[i];   
			var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi,null)["paddingLeft"]) * 2
			if (iWidth > maxWidth) maxWidth = iWidth;
		}
		if(maxWidth > 0){
			for (i = 0; i < obj.children.length; i++)
				obj.children[i].style.width = maxWidth + "px";
		}
	}
	aLi[1].onmousedown = function(event){//表侧攻击表示
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		var card_id = tmplItem.card_info.card_id;
		tmplItem.card_info.position = "POS_FACEUP_ATTACK";
		thumb.style.left = tmplItem.left + "px";
		thumb.src = card_img_thumb_url + card_id + ".jpg";
		Img.rotate(thumb, 0);
	}
	aLi[2].onmousedown = function(event){//表侧守备表示
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		var card_id = tmplItem.card_info.card_id;
		tmplItem.card_info.position = "POS_FACEUP_DEFENCE";
		thumb.style.left = 10 + "px";
		thumb.src = card_img_thumb_url + card_id + ".jpg";
		Img.rotate(thumb, -90);
	}
	aLi[3].onmousedown = function(event){//里侧守备表示
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		var card_id = tmplItem.card_info.card_id;
		tmplItem.card_info.position = "POS_FACEDOWN_DEFENCE";
		thumb.style.left = 10 + "px";
		thumb.src = "images/unknow.jpg";
		Img.rotate(thumb, -90);
	}
	aLi[4].onmousedown = function(event){//里侧攻击表示
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		var card_id = tmplItem.card_info.card_id;
		tmplItem.card_info.position = "POS_FACEDOWN_ATTACK";
		thumb.style.left = tmplItem.left + "px";
		thumb.src = "images/unknow.jpg";
		Img.rotate(thumb, 0);
	}
	aLi[5].onmousedown = function(event){//不解除苏生限制
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		tmplItem.card_info.disable_revivelimit = false;
	}
	aLi[6].onmousedown = function(event){//解除苏生限制
		var event = event || window.event;
		var tmplItem = $(thumb).tmplItem().data;
		tmplItem.card_info.disable_revivelimit = true;
	}
}
var getOffset = {
	top: function (obj) {
		return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0) 
	},
	left: function (obj) {
		return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0) 
	} 
};


var speed = 1;

var Img = function() {
	var isIE = /*@cc_on!@*/!1;
	var rotate = function(thumb, degree, immediately) {
		if(immediately == true){
			run(degree);
			return false;
		}
		var i = 0, sinDeg = 0, cosDeg = 0, timer = null ;
		var deg_begin = $.data(thumb, "degree");
		var orginW = thumb.clientWidth, orginH = thumb.clientHeight;
		clearInterval(timer);
		function run(angle) {
			if (isIE) { // IE
				cosDeg = Math.cos(angle * Math.PI / 180);
				sinDeg = Math.sin(angle * Math.PI / 180);
				with(thumb.filters.item(0)) {
					M11 = M22 = cosDeg; M12 = -(M21 = sinDeg); 
				}
				thumb.style.top = (orginH - thumb.offsetHeight) / 2 + 'px';
				thumb.style.left = (orginW - thumb.offsetWidth) / 2 + 'px';
			} else if (thumb.style.MozTransform !== undefined) {  // Mozilla
				thumb.style.MozTransform = 'rotate(' + angle + 'deg)';
			} else if (thumb.style.OTransform !== undefined) {   // Opera
				thumb.style.OTransform = 'rotate(' + angle + 'deg)';
			} else if (thumb.style.webkitTransform !== undefined) { // Chrome Safari
				thumb.style.webkitTransform = 'rotate(' + angle + 'deg)';
			} else {
				thumb.style.transform = "rotate(" + angle + "deg)";
			}
			
			$.data(thumb, "degree", angle);
		}
		
		timer = setInterval(function() {
			if(deg_begin < degree){
				i += 1;
				run(deg_begin + i);
				if (deg_begin + i >= degree) {
					i = 0;
					clearInterval(timer);
				}
			}
			else if(deg_begin > degree){
				i -= 1;
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