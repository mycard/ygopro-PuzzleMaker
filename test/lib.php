<?php
$CDBPATH='db';
$CDBNAME='cards.cdb';
//header('Content-Type: text/html;charset=UTF-8');
function getex($filename){
	$tmparr=explode('.',$filename);
	return end($tmparr);
}
function checkex($filename,$ex){
	$_ex=getex($filename);
	return ($_ex===$ex);
}
function getValue($key,$default=null){
	if(isset($_POST[$key])){
		return $_POST[$key];
	}
	else if(isset($_GET[$key])){
		return $_GET[$key];
	}
	return $default;
}
function getCards($cdbfile, $sql, $is_full=false){
	$cards=array();
	if(!file_exists($cdbfile))
		return $cards;
	$db=new PDO("sqlite:$cdbfile");
	$rs=$db->query($sql);
	if($rs){
		$reader=$rs->fetchAll();
		foreach ($reader as $key => $value) {
			$temp=array();
			$id=(int)$value['id'];	
			$temp['_id'] = $id;
			$temp['type']=(int)$value['type'];
			$temp['atk']=(int)$value['atk'];
			$temp['def']=(int)$value['def'];
			$temp['level']=(int)$value['level'];
			$temp['race']=(int)$value['race'];
			$temp['attribute']=(int)$value['attribute'];
			$temp['name']=$value['name'];
			$temp['desc']=$value['desc'];
			if($is_full){
				$temp['ot']=(int)$value['ot'];
				$temp['alias']=(int)$value['alias'];
				$temp['setcode']=(int)$value['setcode'];
				$temp['category']=(int)$value['category'];
				for($i=1;$i<=16;$i++){
					$temp['str'.$i]=$value['str'.$i];
				}
			}
			
			$cards[]=$temp;
		}
	}
	return $cards;
}