<?php 
  
 
if(!isset($_SESSION["loggedin"])){
      session_start();
  }
  //index and programs arenr showing that they are logged in.
?>

<html>
<head>
	<title>Auburn Mentoring</title>
</head>
<body> 
	<div>
	<?php
		include "header.php";
	?>
	</div>
	<br>
	<div class="container">
	<div class="jumbotron" style="background-image:url('jumbotron-img.jpg');">
    	<h1>Auburn Peer Mentoring Program</h1> 
  	</div>
  </div>
	<div class="container" >
	    <div class="row">
		<div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;display:inline-block">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage -->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
	          </div>
	        </div>
	        <div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage -->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
	          </div>
	        </div>
	        <div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage -->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
	          </div>
	        </div>
	        <div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage -->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
	          </div>
	        </div>
	        <div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage -->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
	          </div>
	        </div>
	        <div class="card" style="width:22.5rem;padding:10pt;margin-right:15pt;margin-bottom:15pt;">
	          <img src="thumbnail.png" class="card-img-top" alt="100%x200">
	          <div class="card-body">
	            <h5 class="card-title">Program title</h5>
	            <p class="card-text">Some quick example text to preview the program and make up the bulk of the card's content.</p>
	            <a href="#" class="btn btn-primary" style="border-style:none;">Join</a> <!-- link to external organization's homepage (?)-->
	            <a href="#" class="btn btn-primary" style="border-style:none;">Learn more</a>
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
