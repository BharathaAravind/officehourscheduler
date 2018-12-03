<?php
   
   
   error_reporting(E_ALL);
   ini_set('display_errors','1'); 
      
   $host = "host=149.165.168.221";
   $port        = "port=5432";
   $dbname      = "dbname = postgres";
   $credentials = "user = postgres password=postgres";

   $db = pg_connect( "$host $port $dbname $credentials"  );
   
?>


 
