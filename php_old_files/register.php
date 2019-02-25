<?php
// Include config file to connect to database.
require_once "config.php";
 
// Define variables and initialize with empty values
$fname = "";
$lname = "";
$dob = "";
$email = "";
$username = "";
$password = "";
$confirm_password = "";
$fname_err ="";
$lname_err ="";
$dob_err ="";
$email_err ="";
$username_err = "";
$password_err =  "";
$confirm_password_err = "";

 
// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    //Validate First Name, make sure it is not null
    if(empty(trim($_POST["fname"]))) 
    {
        $fname_err = "Please enter your first name.";
    } else
    {
        $fname = trim($_POST["fname"]);
    }

    if(empty(trim($_POST["lname"])))
    {
        $lname_err = "Please enter your last name.";
    }else 
    {
        $lname = trim($_POST["lname"]);
    }

    //need to add more error checking on DOB
    if(empty(trim($_POST["dob"]))) 
    {
        $dob_err = "Please enter your birthday.";
    } else
    {
        $dob = trim($_POST["dob"]);
    }

    if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL))
    {
        $email_err= "Please enter a valid email address.\n";
    }elseif(!strpos($_POST["email"], 'auburn.edu'))
    {
        $email_err= $email_err .  "Please enter your Auburn issued email address.\n";
    } else
    {
        $email = trim($_POST["email"]);
    }




    // Validate username
    if(empty(trim($_POST["username"])))
    {
        $username_err = "Please enter a username.";
    } else
    {
        // Prepare a select statement
        $sql = "SELECT UserID FROM Users WHERE Username = ?";
        
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            
            // Set parameters
            $param_username = trim(strtoupper($_POST["username"]));
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                /* store result */
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){
                    $username_err = "This username is already taken.";
                } else{
                    $username = trim(strtoupper($_POST["username"]));
                }
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }
        }
         
        // Close statement
        mysqli_stmt_close($stmt);
    }




    
    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password.";     
    } elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "Password must have atleast 6 characters.";
    } else{
        $password = trim($_POST["password"]);
    }
    
    // Validate confirm password
    if(empty(trim($_POST["confirm_password"]))){
        $confirm_password_err = "Please confirm password.";     
    } else{
        $confirm_password = trim($_POST["confirm_password"]);
        if(empty($password_err) && ($password != $confirm_password)){
            $confirm_password_err = "Passwords did not match.";
        }
    }
    
    // Check input errors before inserting in database
    if(empty($fname_err) && empty($lname_err) && empty($dob_err) && empty($email_err) && empty($username_err) && empty($password_err) && empty($confirm_password_err)){
        
        // Prepare an insert statement
        $sql = "INSERT INTO Users (FirstName, LastName, Email,Username, Password,DOB) VALUES (?, ?, ?,? ,?,?)";
         
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ssssss", $param_fname, $param_lname, $param_email,$param_username, $param_password, $param_dob);
            
            // Set parameters
            $param_fname = $fname;
            $param_lname = $lname;
            $param_dob = $dob;
            $param_email = $email;
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                // Redirect to login page
                header("location: login.php");
            } else{
                echo "Something went wrong. Please try again later.";
            }
        }
         
        // Close statement
        mysqli_stmt_close($stmt);
    }
    
    /*$to = $email;
    $subject = 'Auburn University Peer Mentoring Confirmation';
    $message = '
        Thanks for signing up! 
        Please verify that you are a current Auburn student by clicking the link below: 
            http://www.auburn.edu/~kmk0044/peermentoring/verify.php?email='.$email.'
    ';
    $headers = 'From:noreply@auburn.edu';
    mail($to,$subject,$message,$headers);*/
    // Close connection
    mysqli_close($link);
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
    
</head>
<body>
<div>
    <?php
       include("header.php");
    ?>
</div>
<div class="container">
    <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div class="card card-signin my-5">
                <div class="card-body">
                    <h5 class="card-title text-center">Sign Up</h5>
                    <p>Please fill this form to create an account.</p>
                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <!--Get First Name-->
                        <div class="form-group <?php echo (!empty($fname_err)) ? 'has-error' : ''; ?>">
                            <label>First Name</label>
                            <input type="text" name="fname" class="form-control" value="<?php echo $fname; ?>">
                            <span class="help-block"><?php echo $fname_err; ?></span>
                        </div>  

                        <!--Get Last Name-->
                        <div class="form-group <?php echo (!empty($lname_err)) ? 'has-error' : ''; ?>">
                            <label>Last Name</label>
                            <input type="text" name="lname" class="form-control" value="<?php echo $lname; ?>">
                            <span class="help-block"><?php echo $lname_err; ?></span>
                        </div>  


                        <!-- get DOB -->
                        <div class="form-group <?php echo (!empty($dob_err)) ? 'has-error' : ''; ?>">
                            <label>Birthday (MM/DD/YYYY)</label>
                            <input type="text" name="dob" class="form-control" value="<?php echo $dob; ?>">
                            <span class="help-block"><?php echo $dob_err; ?></span>
                        </div>
                        <!--Get Email-->
                        <div class="form-group <?php echo (!empty($email_err)) ? 'has-error' : ''; ?>">
                            <label>Auburn Email</label>
                            <input type="text" name="email" class="form-control" value="<?php echo $email; ?>">
                            <span class="help-block"><?php echo $email_err; ?></span>
                        </div>  
                        <!--Get User Name-->
                        <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
                            <label>Username</label>
                            <input type="text" name="username" class="form-control" value="<?php echo $username; ?>">
                            <span class="help-block"><?php echo $username_err; ?></span>
                        </div>  
                        <!--Get Password-->
                        <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
                            <label>Password</label>
                            <input type="password" name="password" class="form-control" value="<?php echo $password; ?>">
                            <span class="help-block"><?php echo $password_err; ?></span>
                        </div>
                        <!--Confirm Password-->
                        <div class="form-group <?php echo (!empty($confirm_password_err)) ? 'has-error' : ''; ?>">
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" class="form-control" value="<?php echo $confirm_password; ?>">
                            <span class="help-block"><?php echo $confirm_password_err; ?></span>
                        </div>

                        <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Submit">
                            <input type="reset" class="btn btn-default" href="register.php" value="Reset">
                        </div>

                        <p>Already have an account? <a style="color:orange;" href="login.php">Login here</a>.</p>
                    </form>
                </div>
            </div>
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