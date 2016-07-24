<?php
$a='1152921504606846975';
$a='4294967295';
$b=floatval($a);

$k1=0xffffffffffff;
$k2=0xffffffff;
$k3=0xffff;
$k4=0x1;
$s1=$b/0xffffffffffff;
$s2=($b-$s1*$k1);///$k2;
$s3=($b-$s1*$k1-$s2*$k2)/$k3;
$s4=($b-$s1*$k1-$s2*$k2-$s3*$k3);
echo $b.'<br>';
echo $s1.'<br>';
echo $s2.'<br>';
echo $s3.'<br>';
echo $s4.'<br>';