<?php 
header('Content-Type: text/html;charset=UTF-8');
set_time_limit(0);
$filename="";
$scripts="";
if(isset($_POST['name'])){
	$filename=$_POST['name'];
}
else if(isset($_GET['name'])){
	$filename=$_GET['name'];
}
if(isset($_POST['script'])){
	$scripts=$_POST['script'];
}
else if(isset($_GET['script'])){
	$scripts=$_GET['script'];
}
if(strlen($scripts)>0){
	if(strlen($filename)==0)
		$filename="noname";
	$filename .='.lua';
	Header("Content-type: application/octet-stream");
	Header("Accept-Ranges: bytes");
	Header("Accept-Length: ".strlen($scripts));
	Header("Content-Disposition: attachment; filename=".$filename);
	echo $scripts;
}