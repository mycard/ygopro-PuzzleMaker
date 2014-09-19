
cards_url = "test/cards.php";
card_img_url = "test/images.php?file=/";
card_img_thumb_url = "test/images.php?thumb=true&file=/";
img_qm="images/qm.png";
img_close="images/close.png";
img_unkown="images/unknow.jpg";

function getcarddata(result,card){
	var star='';
	var rlevel=card.level&0xff;
	for(var i=0; i<rlevel; i++){
		star += "★";
	}
	var data={
		"_id": card._id,
		"name": card.name,
		"type": getType(card),
		"atk": card.atk,
		"def": card.def,
		"level": card.level,
		"star": star,
		"race": getRace(card),
		"attribute": getAttribute(card),
		"desc": card.desc,
	};
	return data;
}

function loadCards(cards_id, cards){
	$.ajaxSettings.async = false;
	for(var _i=0;_i<cards_id.length;_i++){
		var id=cards_id[_i];
		var url = cards_url + '?id='+id;
		$.getJSON(url, function(result){
			if(result.length!=0){
				var card=result[0];
				datas[card._id]=getcarddata(result,card);
			}
		});
	}
	for(var j in cards){
		loadCard(cards[j]);
	}
}

function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name.length == 0)
		return false;
		
	var url=cards_url+"?name="+encodeURI(name);

	$.ajaxSettings.async = true;
	//console.log(url);
    $.getJSON(url, function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			alert("未找到相关卡片");
			return false;
		}
		//console.log("cards:"+result.length);
		for(var _i=0;_i<result.length;_i++){
			datas[result[_i]._id]=getcarddata(result,result[_i]);
		}
		addList(result);
	});
}