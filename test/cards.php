<?php
header('Content-Type: text/html;charset=UTF-8');
set_time_limit(0);
include_once('lib.php');

$cdb=getValue('cdb',$CDBNAME);
if(strlen($cdb)==0)
	$cdb=$CDBNAME;
$cdbfile=$CDBPATH."/".$cdb;
$decdbfile=$CDBPATH."/".$CDBNAME;
$merge=getValue('merge',false);
$is_full=getValue('full',false);

$cards=array();
if(file_exists($cdbfile)){
	$sql="SELECT * FROM datas,texts WHERE datas.id=texts.id";
	$name=getValue('name','');
	$name=str_replace("'","''",urldecode($name));
	$sql.=" AND texts.name LIKE '%$name%'";
	
	$desc=getValue('desc','');
	$desc=str_replace("'","''",urldecode($desc));
	$sql.=" AND texts.desc LIKE '%$desc%'";
	
	$id=(int)getValue('id','0');
	if($id>0)
		$sql.= " AND datas.id=$id";
		
	$alias=(int)getValue('alias','0');
	if($alias>0)
		$sql.= " AND (datas.alias=$alias OR datas.id=$alias)";
		
	$atk=(int)getValue('atk','-10');
	if($atk>=-2)
		$sql.= " AND datas.atk=$atk";
		
	$def=(int)getValue('def','-10');
	if($def>=-2)
		$sql.= " AND datas.def=$def";
	
	if(isset($_GET['attribute'])){
		$attribute=(int)getValue('attribute','0');
		if($attribute>0)
			$sql.= " AND datas.attribute=$attribute";
	}

	$ot=(int)getValue('ot','0');
	if($ot>0)
		$sql.= " AND datas.ot=$ot";
		
	$race=(int)getValue('race','0');
	if($race>0)
		$sql.= " AND datas.race=$race";

	$type=(int)getValue('type','0');
	if($type>0)
		$sql.= " AND datas.type & $type = $type ";

	$level=(int)getValue('level','-1');
	if($level>=0)
		$sql.= " AND datas.level=$level";

	//category
	$category=(float)getValue('category','0');

	//setcode
	$setcode=(float)getValue('setcode','0');
	
	if($cdbfile!=$decdbfile && $merge!='false'){
		$cards=array_merge($cards, getCards($decdbfile,$sql, $is_full));
		$cards=array_merge($cards, getCards($cdbfile, $sql, $is_full));
	}
	else{
		$cards=getCards($cdbfile, $sql, $is_full);
	}
}   
echo json_encode($cards);