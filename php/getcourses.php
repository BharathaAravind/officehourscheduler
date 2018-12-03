<?php
    include("config.php");
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $courselist = pg_query($db, "SELECT DISTINCT course  FROM allotments");
    $course_arr = pg_fetch_all($courselist);
    $final_course_arr = array();
    foreach ($course_arr as &$course) {    
        array_push($final_course_arr, $course["course"]);
    }
    $result = json_encode($final_course_arr, JSON_UNESCAPED_SLASHES);
    header('Content-type: application/json');
    echo $result;
?>