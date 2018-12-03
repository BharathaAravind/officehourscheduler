<?php
include("session.php");
if(isset($_SESSION["useremail"])){
    echo "true";
}else{
    echo "false";
} 
?>
