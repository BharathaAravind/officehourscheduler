<?php 
    include("config.php");
    include("session.php");
    if(empty($_POST['username']) || empty($_POST['password']) || empty($_POST['role'])){
        echo "failure";
    }
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = strtolower($_POST['role']);

    // echo $password;

	if(!$db) {
        echo "Error : Unable to open database\n";

	} else {
	    $result = pg_query($db, "SELECT * FROM login WHERE username='$username' and password='$password' and role='$role'");
        $rows = pg_num_rows($result);
        if($rows==1 && strcasecmp($role,"student")==0){
            $_SESSION["useremail"] = $username;
            header('Location: ../home.html');
        }else if($rows==1 && strcasecmp($role,"ta")==0){
            $_SESSION["useremail"] = $username;
            header('Location: ../hometa.html');
        }else if($rows==1 && strcasecmp($role,"instructor")==0){
            $_SESSION["useremail"] = $username;
            header('Location: ../homeinstructor.html');
        }else{
            echo "incorrect login";
        }
    }
    


?>