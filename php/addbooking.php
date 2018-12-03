<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    $useremail=$_SESSION["useremail"];
    $title = $_POST["title"];
    $desc = $_POST["desc"];
    $course = $_POST["course"];
    $timeslot = $_POST["timslot"];
    $bookingdate = $_POST["selectedate"];

    $allDates = pg_query($db, "SELECT * FROM allotments where course='$course' and timeslot = '$timeslot' and bookingdate = '$bookingdate' ");
    $alldates = pg_fetch_all($allDates);
    foreach ($alldates as &$res) {
        if($res['requestedby']==='None'){
            $query="UPDATE allotments SET (querytitle,querydescription,requestedby) = ('$title','$desc','$useremail') WHERE course= '$course' and timeslot = '$timeslot' and bookingdate = '$bookingdate'";
            $result = pg_query($db, $query);
            if (!$result) {
                echo "Failure";
                exit;
            }else{
                echo "success";
            }
        }else{
            echo "Failure";
            exit;
        }
   }


?>