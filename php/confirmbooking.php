<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $assignedTo=$_SESSION["useremail"];
    $useremail=$_POST["requestedby"];
    $course = $_POST["course"];
    $timeslot = $_POST["timeslot"];
    $bookingdate = $_POST["bookingdate"];
    
    $query="UPDATE allotments SET (assignedto,filled) = ('$assignedTo','Yes') WHERE course= '$course' and timeslot = '$timeslot' and bookingdate = '$bookingdate'";
    $result = pg_query($db, $query);
    if (!$result) {
        echo "Failure";
        exit;
    }else{
        echo "success";
    }
        


?>