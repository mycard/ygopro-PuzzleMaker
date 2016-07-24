<?php
header('Content-Type: text/html;charset=UTF-8');
include_once('lib.php');
$path=$CDBPATH.'/';
$cdblist=array();
if ($handle = opendir($path)) { 
	while (false !== ($file = readdir($handle))) 
	{ 
		//echo $file;
		if (!is_dir($file) && $file != '.' && $file !='..' && checkex($file,'cdb')) {
			$cdblist[]=$file;
		}
	} 
} 
echo json_encode($cdblist);