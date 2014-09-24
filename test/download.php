<?php 
set_time_limit(0);
include_once('lib.php');
$filename=getValue('name','');
$scripts=getValue('script','');
$type=getValue('type','txt');

if(strlen($scripts)>0){
	if(strlen($filename)==0)
		$filename="noname";
	if(!checkex($filename,$type))
		$filename .='.'.$type;
	Header("Content-type: application/octet-stream");
	Header("Accept-Ranges: bytes");
	Header("Accept-Length: ".strlen($scripts));
	Header("Content-Disposition: attachment; filename=".$filename);
	echo $scripts;
}