<?php 
    include("config.php");
    // By students to get their confirmed slots
    // GET request
    include("session.php");
    if(!isset($_SESSION["useremail"])){
        header('Location: ../duo.php');
    }
    
    $selectcourse = 'info arch for web';
    
    if(isset($_GET['course'])){
        $selectcourse = $_GET['course'];
    }
    
    $result = pg_query($db, "SELECT * FROM allotments WHERE course='$selectcourse' and assignedto='None' and requestedby!='None'");
    
    $arr = pg_fetch_all($result);

    $queries = array();
    if(!$arr){
        $result = json_encode($queries, JSON_UNESCAPED_SLASHES);
        header('Content-type: application/json');
        echo $result;
    }
    else{
        foreach ($arr as &$res) {
            array_push($queries, $res);
        }
        $result = json_encode($queries, JSON_UNESCAPED_SLASHES);
        header('Content-type: application/json');
        echo $result;
    }
?>