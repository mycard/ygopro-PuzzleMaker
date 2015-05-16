
cards_url = "test/cards.php?full=false";
card_img_url = "test/pics/";
card_img_thumb_url = "test/pics/thumbnail/";
img_qm="images/qm.png";
img_close="images/close.png";
img_unkown="images/unknow.jpg";
var cdb_url="test/cdblist.php";

function getcarddata(result,card){
	var data = {
		"_id": card._id,
		"name": card.name,
		"type": getType(card.type),
		"typecode": card.type,
		"atk": card.atk,
		"def": card.def,
		"level": card.level,
		"star": getStars(card.level),
		"race": getRace(card.race),
		"attribute": getAttribute(card.attribute),
		"desc": card.desc
	};
	return data;
}

function loadCards(cards_id, cards){
	$.ajaxSettings.async = false;
	for(var _i=0;_i<cards_id.length;_i++){
		var id=cards_id[_i];
		var url = cards_url +"&merge=true&cdb="+getnowcdb() + '&id='+id;
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
		
	var url=cards_url+"&merge=false&cdb="+getnowcdb()+"&name="+encodeURI(name);

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
function addcdblist(){
	//cdbs
	var cdblist=document.getElementById("cdbs");
	var nowsel=cdblist.value;
	cdblist.options.length = 0; 
	$.getJSON(cdb_url, function(_cdbs){
		if(_cdbs.length==0){
			cdblist.options.add(new Option('cards.cdb','cards.cdb'));
			return false;
		}	
		for(var i=0;i<_cdbs.length;i++){
			var tmp=_cdbs[i];
			var tmpoption=new Option(tmp, tmp);
			if(nowsel==tmp)
				tmpoption.selected=true;
			cdblist.options.add(tmpoption);
		}
	});
	
}
function getnowcdb(){
	var cdblist=document.getElementById("cdbs");
	return cdblist.value;
}