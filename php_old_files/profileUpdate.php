<?php 
	//require_once("config.php");
    /*
	$query = "SELECT * FROM Users WHERE Username='".$_SESSION["username"]."'";	

	$result = mysqli_query($link,$query) or die ('Error: Unable to pull data from profile'.mysqli_error($link));

	$currentuser = mysqli_fetch_array($result);
*/	
    //$lname = filter($_POST['lname2'])
   // $dob = filter($_POST['DOB2'])
    ///$password2 = filter($_POST['gender'])
    //$password3 = filter($_POST['motto'])
   
   /**if($fname != NULL) {
		$newEntry = "UPDATE users SET fname='".$fname."' WHERE username ='".$_SESSION["username"]."'";

	}
	$tryEntry = mysqli_query($link,$newEntry) or die ('New Entry Failed. '.mysqli_error($link));
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

	function updateProfile() {
		global $fname;
		global $lname;
		global $DOB;
		global $password;
		if(array_key_exists('fname2',$_POST)){
			if ($_POST['fname2'] != $fname) {
				//sql query
			} else {
				echo '<script>alert("Your new First Name is the same as the old.");</script>';
			}
		}
		if (array_key_exists('lname2',$_POST)) {
			if ($_POST['lname2'] != $lname) {
				//sql query
			} else {
				echo '<script>alert("Your new Last Name is the same as the old.");</script>';
			}
		}
		if (array_key_exists('DOB2',$_POST)) {
			if ($_POST['DOB2'] != $DOB) {
				//sql query
			} else {
				echo '<script>alert("You new DOB was the same as the old.");</script>';
			}
		}
		if (array_key_exists('password2',$_POST)) {
			if ($_POST['password2'] != $password) {
				echo '<script>alert("Password is NOT the Same");</script>';
				if ($_POST['password2'] != $_POST['password3']) {
					echo '<script>alert("Password confirmation failed. Make sure they are the same!");</script>';
				} else {
					//sql query
				}
			} else {
				echo '<script>alert("New password is the same as the old one.");</script>';
			}
		}
		
	}
?>
<html>
<head>
	<title>Auburn Mentoring - Update Profile</title>
	<link rel='stylesheet' href='profile.css' type='text/css'>
	<?php include "header.php";?>
</head>
<body>
<div class="profileBox">
	
		<p>Enter information below that you would like to change.</p><br>
		<form action="" method="post">

		<div class="userInfo">
			<b>First Name: </b><input type="text" name="fname2" value="<?php echo $fname?>"> 
		</div>
		
		<div class="userInfo">
			<b>Last Name: </b> <input type="text" name="lname2" value="<?php echo $lname?>">
			
		</div>

		<div class="userInfo">
			<b>Birthday: </b><input type="text" name="DOB2" value="<?php echo $DOB?>">
		</div>

		<div class="userInfo">
			<b>Change Password: </b><input type="password" name="password2" id="password2" value="<?php echo $password;?>">
		</div>

		<div class="userInfo">
			<b>Confirm Password: </b><input type="password" name="password3" id="password3">
		</div>
		
		<button type="submit" value = 'submit'>UPDATE</button>
		<button type="button" onclick="window.location.href='profile.php'">CANCEL</button>
		</form>

	<?php
		updateProfile();
	?>
</div>
<FOOTER style="background-color:#03244d;border-top-width:5px;border-top-color:#dd550c;border-top-style:solid;padding:10px;position:absolute;bottom:0; width:100%;">	
		<?php include "footer.php";?>
</FOOTER>
</body>
</html>