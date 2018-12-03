<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
   
    $date = "2018-12-03";
    $course = "info arch for web";

    if(isset($_GET['selecteddate'])){
        $date = $_GET['selecteddate'];
    }
    
    if(isset($_GET['course'])){
        $course = $_GET['course'];
    }
    
    $result = pg_query($db, "SELECT timeslot FROM allotments WHERE course='$course' and bookingdate='$date' and requestedby='None'");
    
    if (!$result) {
        echo "An error occurred.\n";
        exit;
    }

    $arr = pg_fetch_all($result);
    $queries = array();
    
    foreach ($arr as &$value) {
         array_push($queries,$value["timeslot"]);
    }

    $result = json_encode($queries, JSON_UNESCAPED_SLASHES);

    header('Content-type: application/json');
    echo $result;
?>