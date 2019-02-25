<?php
// Initialize the session
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
?>


<!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title> Peer Mentoring</title>
    
  </head>
  <body>
    <div>
      <?php 
        //session_start();
        include "header.php";
      ?>
    </div>
    <br>
    <div class="container" ">
      <div class="row">
        <div class="card" style="width:50%;padding:10pt;margin-right:auto;margin-left:auto;display:inline-block">
        		Thank you for completing the survey! We think you would get along well with some of these mentors in your program.
        		<br>
        		<br>
        		<br>
        		<br>
        		Comming Soon!
         </div>
     </div>
 </div>
  <FOOTER style="background-color:#03244d;border-top-width:5px;border-top-color:#dd550c;border-top-style:solid;padding:10px;">  
  <?php
    include "footer.php";
  ?>
  </FOOTER>
  </body>
</html>