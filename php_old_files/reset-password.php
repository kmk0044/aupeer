<?php
// Initialize the session
session_start();
 
// Check if the user is logged in, otherwise redirect to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
 
// Include config file
require_once "config.php";
 
// Define variables and initialize with empty values
$new_fname = "";
$new_lname = "";
$new_DOB = "";
$new_DOB_err = "";
$new_password = $confirm_password = "";
$new_password_err = $confirm_password_err = "";
 
// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
 
    if(!empty($_POST["new_DOB"])){
        if(strlen(trim($_POST["new_DOB"])) < 11){
            $new_DOB_err = "Date of Birth must be MM/DD/YYYY";
        } else {
            $new_DOB = trim($_POST["new_DOB"]);
        }
    }
   // Validate new password
   if(!empty($_POST["new_password"])){
       if(strlen(trim($_POST["new_password"])) < 6){
            $new_password_err = "Password must have atleast 6 characters.";
        } else{
            $new_password = trim($_POST["new_password"]);
        }

        /* if(trim($_POST["new_password"]))){
            $new_password_err = "Please enter the new password.";     
        } else*/
        
        // Validate confirm password
        if(empty(trim($_POST["confirm_password"]))){
            $confirm_password_err = "Please confirm the password.";
        } else{
            $confirm_password = trim($_POST["confirm_password"]);
            if(empty($new_password_err) && ($new_password != $confirm_password)){
                $confirm_password_err = "Password did not match.";
            }
        }
    }
            
    // Check input errors before updating the database
    if(!empty($_POST["new_password"]) &&empty($new_password_err) && empty($confirm_password_err)){
        // Prepare an update statement
        $sql = "UPDATE Users SET Password = ? WHERE Username = ?";
        
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ss", $param_password, $param_userid);
            
            // Set parameters
            $param_password = password_hash($new_password, PASSWORD_DEFAULT);
            $param_userid = $_SESSION["username"];
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                // Password updated successfully. Destroy the session, and redirect to login page
                session_destroy();
                header("location: login.php");
                exit();
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }
        }
        
        // Close statement
        mysqli_stmt_close($stmt);
    }
    
    if(!empty($_POST["new_DOB"]) && empty($new_DOB_err)) {
        // Prepare an update statement
        $sql2 = "UPDATE Users SET DOB = ? WHERE Username = ?";
        
        if($stmt2 = mysqli_prepare($link, $sql2)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt2, "ss", $param_DOB, $param_userid);
            
            // Set parameters
            $param_DOB =$new_DOB;
            $param_userid = $_SESSION["username"];
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt2)){
                // Password updated successfully. Destroy the session, and redirect to login page
                
                echo "Data Saved.";
            }else {
                echo "error stupid1";
            }
        }
        else {echo "error stupid2";}
        
        // Close statement
        mysqli_stmt_close($stmt2);
    } else {
        echo mysqli_error($link);
    }
    // Close connection
    mysqli_close($link);
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <style type="text/css">
        .profileBox {
        margin:auto;
        height:auto;
        text-align:left;
        width:55%;
        color:white;
        background-color:#dd550c;
        padding:10px;
    }
    </style>
</head>
<body>
	<div>
		<?php 
			include "header.php";
		?>
	</div>
	<div class="container">
        <br>
        <div class="profileBox">
                        
			       
			        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post"> 
                        <p>Enter information below that you would like to change.</p>
    <br>
     <div class="form-group">
    <label>First Name</label>
     <input  class="form-control" type="text" name="new_fname">
 </div>
  <div class="form-group">
     <label>Last Name</label> 
     <input class="form-control" type="text" name="new_lname">
 </div>
  <div class="form-group <?php echo (!empty($new_DOB_err)) ? 'has-error' : ''; ?>">
    <label>Birthday</label>
     <input  class="form-control" type="text" name="new_DOB">
        </div>

			            <div class="form-group <?php echo (!empty($new_password_err)) ? 'has-error' : ''; ?>">
			                <label>New Password</label>
			                <input type="password" name="new_password" class="form-control" value="<?php echo $new_password; ?>">
			                <span class="help-block"><?php echo $new_password_err; ?></span>
			            </div>
			            <div class="form-group <?php echo (!empty($confirm_password_err)) ? 'has-error' : ''; ?>">
			                <label>Confirm Password</label>
			                <input type="password" name="confirm_password" class="form-control">
			                <span class="help-block"><?php echo $confirm_password_err; ?></span>
			            </div>
			            <div class="form-group">
			                <input type="submit" class="btn btn-primary" value="Submit">
			                <a class="btn btn-link" href="profile.php">Cancel</a>
			            </div>
			        </form>
				    </div>
				</div>
			</div>
		</div>
	</div>
    <FOOTER style="background-color:#03244d;border-top-width:5px;border-top-color:#dd550c;border-top-style:solid;padding:10px;position:absolute;
   bottom:0;
   width:100%;">    
    <?php
        include "footer.php";
    ?>
    </FOOTER>
</body>
</html>