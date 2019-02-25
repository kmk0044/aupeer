<?php
// Initialize the session
session_start();
/*
//Connect to Database
require_once "config.php";

// Check if the user is already logged in, if yes then redirect him to welcome page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;}
*/
    ?>

<!DOCTYPE html>
<html>
<head>
  	<title>Auburn Mentoring - Profile</title>
   	<link rel='stylesheet' href='profile.css' type='text/css'>
   	<?php include "header.php";?>
</head>
<body>
	<?php
	
	
//!!!!!!!!!!!!!!!!COMMENT IN PHP VARIABLE ONCE INFORMATION IS DB!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!COMMENT IN PHP VARIABLE ONCE INFORMATION IS DB!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!COMMENT IN PHP VARIABLE ONCE INFORMATION IS DB!!!!!!!!!!!!!!!!
/*
	$query = "SELECT * FROM Users WHERE Username='".$_SESSION["username"]."'";	

	$result = mysqli_query($link,$query) or die ('Error: Unable to pull data from profile'.mysqli_error($link));

	$currentuser = mysqli_fetch_array($result);
*/

// Comment out vvv
	$currentuser['UserID'] = "aaa0000";
	$currentuser['FirstName'] = "John";
	$currentuser['LastName'] = "Doe";
	$currentuser['Email'] = "aaa0000@auburn.edu";
	$currentuser['Username'] = "aaa0000";
	$currentuser['Password'] = "password";
	$currentuser['DOB'] = "00/00/0000";
//Comment out ^^^

	$id = $currentuser['UserID'];
	$fname = $currentuser['FirstName'];
	$lname = $currentuser['LastName'];
	$email = $currentuser['Email'];
	$username = $currentuser['Username'];
	$password = $currentuser['Password'];
	$DOB = $currentuser['DOB'];				

	?>

	<div class="container">
		<form id="edit" method="POST">
			<div class="profileBox">
				<div class="avatar" ">
					<img src="download.png" alt="Circle Image" class="img-raised rounded-circle img-fluid" style="display: block; margin-right: auto;margin-left: auto;">
				</div>
				<div class="userInfo">
					<b>Name: </b><?php echo $fname." ".$lname;?>
				</div>
				<div class="userInfo">
					<b>E-mail: </b><?php echo $email?>
				</div>
				<div class="userInfo">
					<b>Username: </b><?php echo $username?>
				</div>
				<div class="userInfo">
					<b>Birthdate: </b><?php echo $DOB?>
				</div>
				<button type="button" onclick="window.location.href='profileUpdate.php'">Edit Info</button>
			</div>

		</div>

	<FOOTER style="background-color:#03244d;border-top-width:5px;border-top-color:#dd550c;border-top-style:solid;padding:10px;position:absolute;bottom:0; width:100%;">	
		<?php include "footer.php";?>
	</FOOTER>

</body>
</html>