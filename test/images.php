<?php 
header("Content-type:image/jpeg");
set_time_limit(0);
$filename="";
$thumb=false;

$PATH_PICS='pics/';
$PATH_THUMB='pics/thumbnail/';
$PATH_DEFAULT="pics/unknown.jpg";

if(isset($_POST['file'])){
	$filename=$_POST['file'];
}
else if(isset($_GET['file'])){
	$filename=$_GET['file'];
}
if(isset($_POST['thumb'])){
	$thumb=$_POST['thumb'];
}
else if(isset($_GET['thumb'])){
	$thumb=$_GET['thumb'];
}

if(strlen($filename)>0){
	$index=strpos($filename,"/");
	if($index===0)
		$filename=substr($filename, 1);
	if($thumb)
		$filename=$PATH_THUMB.$filename;
	else 
		$filename=$PATH_PICS.$filename;
	//echo $filename;
	//exit;
	if(file_exists($filename)){
		readfile($filename);
		exit;
	}
}
readfile($PATH_DEFAULT);