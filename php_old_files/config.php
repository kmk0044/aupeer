<?php

	// PHP Data Objects(PDO) Sample Code:
	// try {
	// $conn = new PDO("sqlsrv:server = tcp:auburnpeermentoring.database.windows.net,1433; Database = auburnpeermentoringdb", "peermentor", "Group8!2019");
	// $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// }
	// catch (PDOException $e) {
	// print("Error connecting to SQL Server.");
	// die(print_r($e));
	// }

	// SQL Server Extension Sample Code:
	$connectionInfo = array("UID" => "peermentor@auburnpeermentoring", "pwd" => "Group8!2019", "Database" => "auburnpeermentoringdb", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
	$serverName = "tcp:auburnpeermentoring.database.windows.net,1433";
	$conn = sqlsrv_connect($serverName, $connectionInfo);
?>