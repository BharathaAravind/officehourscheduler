<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    $useremail=$_SESSION["useremail"];
    
    $coursename = $_POST["course"];
    $daylist = $_POST["daylist"];
    $starttime = $_POST["starttime"];
    $endtime = $_POST["endtime"];

    // $coursename = "Test Course";
    // $daylist = array("Mon", "Wed");
    // $starttime = "11:00AM";
    // $endtime = "4:00PM";
    
    
    
    $starttime_arr = explode(":", $starttime);
    $endtime_arr = explode(":", $endtime);

    $starttime_int = intval($starttime_arr[0]);
    $endtime_int = intval($endtime_arr[0]);
    $am_pm = " AM";
    if ($starttime_int < 9){
        $am_pm = " PM";
    } else{
        if($endtime_int<9)
            $endtime_int+=12;
    }
    $diff = abs(($endtime_int - $starttime_int)*4);
    $minute_arr = [":00",":15",":30",":45"]; 
    $startTime = $starttime_int;
    $count=0;
    $finaltimes = array();
    for($i = 0; $i < $diff; $i++){
        if($count != 0 && $count%4 == 0){
            $startTime++;
            if($startTime>12){
                $startTime = 1;
                $am_pm = " PM";
            }
        }
        $count = $count%4;
        $count++;
        $min = $minute_arr[$i%4];
        array_push( $finaltimes, (string)$startTime.(string)$min.$am_pm);
        
    }
    // // print_r($finaltimes)  ;
    $startdate=strtotime($daylist[0]);
    $enddate=strtotime("+16 weeks", $startdate);
    
    while ($startdate < $enddate) {
        $day = (string)date("D", $startdate);
        if(in_array($day, $daylist)){
            $datestr = (string)date("Y-m-d", $startdate);
            foreach ($finaltimes as &$times) {
                $query="INSERT INTO allotments (course, bookingdate, timeslot, filled, assignedto, requestedby, querytitle, querydescription) VALUES ('$coursename','$datestr','$times','No','None','None','None','None')";
                $result = pg_query($db, $query);
                if (!$result) {
                    echo "failure";
                    exit;
                }
            }    
        }
        $startdate = strtotime("+1 day", $startdate);
    }

    echo "success";
?>