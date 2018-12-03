<?php 
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $useremailid=$_SESSION["useremail"];
    $courselist = pg_query($db, "SELECT DISTINCT course  FROM allotments");
    $course_arr = pg_fetch_all($courselist);
    $final_course_arr = array();
    
    foreach ($course_arr as &$course) {    
        array_push($final_course_arr, $course["course"]);
    }

    $selectcourse = $final_course_arr[0];
    if(isset($_GET['selectedcourse'])){
        $selectcourse = $_GET['selectedcourse'];
    }
    $result = pg_query($db, "SELECT * FROM allotments where course='$selectcourse'");
    if (!$result) {
        echo "An error occurred.\n";
        exit;
    }

    $allDates = pg_query($db, "SELECT DISTINCT bookingdate FROM allotments where course='$selectcourse'");
    
    if (!$result) {
        echo "An error occurred.\n";
        exit;
    }
    if (!$allDates) {
        echo "An error occurred.\n";
        exit;
    }

    $arr = pg_fetch_all($result);
    $unassigned_arr = array();
    $queries = array();
    foreach ($arr as &$value) {
        if(strcmp($value["requestedby"],"None")==0){
            array_push($unassigned_arr,$value["bookingdate"]);
        }
        if(strcmp($value["requestedby"],$useremailid)==0){
            array_push($queries, array("title"=>$value["querytitle"],"start"=>$value["bookingdate"]));
        }
    }
    $alldates = pg_fetch_all($allDates);
    $filled_arr = array();
    foreach ($alldates as &$value) {
        if(!in_array($value["bookingdate"], $unassigned_arr)){
            array_push($filled_arr, $value["bookingdate"]);
        }
    }

    $result = array();
    array_push($result, array('bookings' => $queries,'filled' => $filled_arr,'vacant' => $unassigned_arr, 'courselist' => $final_course_arr, 'selectedcourse' => $selectcourse));
    $result = json_encode($result, JSON_UNESCAPED_SLASHES);
    header('Content-type: application/json');
    echo $result;
?>