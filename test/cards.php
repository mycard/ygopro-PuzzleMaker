<?php
header('Content-Type: text/html;charset=UTF-8');
set_time_limit(0);
$cdbfile="cards.cdb";
function getjson(){
	global $cdbfile;
	if(isset($_GET['cdb'])){
		$cdb='cdbs/'+urldecode($_GET['cdb']);
		if(file_exists($cdb)){
			$cdbfile=$cdb;
		}
	}
    $cards=array();
    if(file_exists($cdbfile)){
        $db=new PDO("sqlite:$cdbfile");
		$sql="SELECT * FROM datas,texts WHERE datas.id=texts.id";
        if(isset($_GET['name'])){
            $name=str_replace("'","''",urldecode($_GET['name']));
			$sql.=" AND texts.name LIKE '%$name%'";
		}
		if(isset($_GET['desc'])){
            $desc=str_replace("'","''",urldecode($_GET['desc']));
			$sql.=" AND texts.desc LIKE '%$desc%'";
		}
		if(isset($_GET['id'])){
			$id=(int)$_GET['id'];
			$sql.= " AND datas.id=$id";
		}
		if(isset($_GET['alias'])){
			$alias=(int)$_GET['alias'];
			$sql.= " AND (datas.alias=$alias OR datas.id=$alias)";
		}
		if(isset($_GET['atk'])){
			$atk=(int)$_GET['atk'];
			$sql.= " AND datas.atk=$atk";
		}
		if(isset($_GET['def'])){
			$def=(int)$_GET['def'];
			$sql.= " AND datas.def=$def";
		}
		if(isset($_GET['attribute'])){
			$attribute=(int)$_GET['attribute'];
			$sql.= " AND datas.attribute=$attribute";
		}
		if(isset($_GET['ot'])){
			$ot=(int)$_GET['ot'];
			$sql.= " AND datas.ot=$ot";
		}
		if(isset($_GET['race'])){
			$race=(int)$_GET['race'];
			$sql.= " AND datas.race=$race";
		}
		if(isset($_GET['type'])){
			$type=(int)$_GET['type'];
			$sql.= " AND datas.type & $type = $type ";
		}
		if(isset($_GET['setcode'])){
			//1000100010001000
			//1152939097061330944
			/*$setcode=(int)$_GET['setcode'];
			$setcode=$setcode&0xffff;
			$setcode1=(int)($setcode<<0x30);
			$setcode2=(int)($setcode<<0x20);
			$setcode3=(int)($setcode<<0x10);
			$setcode4=(int)($setcode);
			$sql.= " AND ( datas.setcode & $setcode1 = $setcode1 
			OR datas.setcode & $setcode2 = $setcode2 
			OR datas.setcode & $setcode3 = $setcode3
			OR datas.setcode & $setcode4 = $setcode4
			)";*/
		}
		if(isset($_GET['level'])){
			$level=(int)$_GET['level'];
			$sql.= " AND datas.level=$level";
		}
		
		$rs=$db->query($sql);
		if($rs){
			$reader=$rs->fetchAll();
			foreach ($reader as $key => $value) {
				$temp=array();
				$temp['_id']=(int)$value['id'];
				$temp['ot']=(int)$value['ot'];
				$temp['alias']=(int)$value['alias'];
				$temp['setcode']=(int)$value['setcode'];
				$temp['type']=(int)$value['type'];
				$temp['atk']=(int)$value['atk'];
				$temp['def']=(int)$value['def'];
				$temp['level']=(int)$value['level'];
				$temp['race']=(int)$value['race'];
				$temp['attribute']=(int)$value['attribute'];
				$temp['category']=(int)$value['category'];
				$temp['name']=$value['name'];
				$temp['desc']=$value['desc'];
				for($i=1;$i<=16;$i++){
					$temp['str'.$i]=$value['str'.$i];
				}
				$cards[]=$temp;
			}
        }
    }
    return $cards;
}
$cards=getjson();
echo json_encode($cards);

