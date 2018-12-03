<?php 
    include("config.php");
    // By students to get their confirmed slots
    // GET request
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $useremail=$_SESSION["useremail"];
    
    $result = pg_query($db, "SELECT * FROM allotments WHERE requestedby='$useremail'");
    
    $arr = pg_fetch_all($result);

    $queries = array();
    foreach ($arr as &$res) {
        if($res['requestedby']===$useremail){
            array_push($queries, $res);
        }
   }

   $result = json_encode($queries, JSON_UNESCAPED_SLASHES);
   header('Content-type: application/json');
   echo $result;
?>