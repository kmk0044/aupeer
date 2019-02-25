<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Account</title>
</head>
<body>
    <!-- start header div --> 
    <div>
        <?php 
            include "header.php";
        ?>
    </div>
    <!-- end header div -->   
     
    <!-- start wrap div -->   
    <div id="wrap">
        <!-- start PHP code -->
        <?php
            inculde "config.php";
            //if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash']) && !empty($_GET['hash'])){
            if(isset($_GET['email']) && !empty($_GET['email']))
            {
            // Verify data
            $email = mysql_escape_string($_GET['email']); // Set email variable
            //$hash = mysql_escape_string($_GET['hash']); // Set hash variable
                         
            $search = mysql_query("SELECT email, hash, active FROM user, user_data WHERE user_data.email='".$email."' AND users.hash='".$hash."' AND users.active='0'") or die(mysql_error());  
            $match  = mysql_num_rows($search);
                         
            if($match > 0){
                // We have a match, activate the account
                mysql_query("UPDATE users, user_data SET users.active='1' WHERE user_data.email='".$email."' AND users.hash='".$hash."' AND active='0' and users.username = user_data.username") or die(mysql_error());
                echo '<div class="statusmsg">Your account has been activated, you can now login</div>';
            }else{
                // No match -> invalid url or account has already been activated.
                echo '<div class="statusmsg">The url is either invalid or you already have activated your account.</div>';
            }
                         
        }else{
            // Invalid approach
            echo '<div class="statusmsg">Invalid approach, please use the link that has been send to your email.</div>';
        } 
                ?>
        <!-- stop PHP Code -->
 
         
    </div>
    <!-- end wrap div --> 
</body>
</html>