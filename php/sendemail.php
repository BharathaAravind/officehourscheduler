<?php

  require("../PHPMailer/src/PHPMailer.php");
  require("../PHPMailer/src/SMTP.php");

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->IsSMTP(); // enable SMTP

    // $mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls'; // secure transfer enabled REQUIRED for Gmail
    $mail->Username = "officehourscheduler@gmail.com";
    $mail->Password = "infoarch@123";
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->IsHTML(true);
    $mail->SetFrom("no-reply@officehourscheduler.com");
    $mail->Subject = "You have a new reply to your question!";
    $mail->Body = $_POST["queryDescription"];
    $email = 'nxjanxaslnxlsa';
    if(isset($_POST["requestedBy"])){
        $email = $_POST["requestedBy"];
    }
    
    $mail->AddAddress($email);

     if(!$mail->Send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
     } else {
        echo "success";
     }
?>
