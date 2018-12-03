<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $course = $_POST["course"];
    $timeslot = $_POST["timeslot"];
    $bookingdate = $_POST["bookingdate"];
    $title = $_POST["querytitle"];
    $desc = $_POST["queryDescription"];

    $query="UPDATE allotments SET (querytitle,querydescription) = ('$title','$desc') WHERE course= '$course' and timeslot = '$timeslot' and bookingdate = '$bookingdate'";
    $result = pg_query($db, $query);
    if (!$result) {
        echo "Failure";
        exit;
    }else{
        echo "success";
    }
        


?>