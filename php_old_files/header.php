<?php 
  
 
/**if(!isset($_SESSION["loggedin"])){
      session_start();
  }*/ 
  //index and programs arenr showing that they are logged in.
?>


<html>
    <head>
        <title>Auburn Peer Mentoring</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
       <link rel="stylesheet" href="peermentoringstyle.css">
    </head>
    <body>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                 Auburn Mentoring Program
                  
                </div>
                <?php
                If(isset($_SESSION['username'])){ ?>
                 <!-- html here to show when logged in -->
                 <button style="float:right" type="button" onClick="location.href='logout.php'" class="btn btn-default navbar-btn">Log Out</button>
                <?php
                } else {?>
                <!-- html that's shown either way -->
                <button style="float:right" type="button" onClick="location.href='login.php'" class="btn btn-default navbar-btn">SIGN IN</button>
                <?php 
                  }
                ?>
                <div class="container-fluid">
                    <ul class="nav ">
                      <li class="nav-item">
                        <a class="nav-link active" href="index.php">Home</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="programs.php">Programs</a>
                      </li>
	                 <?php
	                 If(isset($_SESSION['username'])){ ?>
	                 <!-- html here to show when logged in -->
	                 <li class="nav-item">
	                    <a class="nav-link" href="survey.php">Survey</a>
	                 </li>
                   <li class="nav-item">
                      <a class="nav-link" href="profile.php">My Profile</a>
                   </li>
	                <?php
	                	} 
                	?>
                      
                      <li class="nav-item">
                        <a class="nav-link disabled" href="#">Disabled</a>
                      </li>
                    </ul>
                   <!--  <a style= "color:white" class="nav-link active" href="#">Home</a>
                        <a style= "color:white" class="nav-link" href="#">Programs</a>
                         <a class="nav-link" href="#"></a>
                         need to be signed in to see the My Profile
                        <a class="nav-link disabled" href="#">My Profile</a>
                      -->
                </div>
               
            </div>
          
        </nav>
            </body>
</html>

