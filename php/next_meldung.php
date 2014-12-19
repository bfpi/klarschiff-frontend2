<?php
require_once("frontend_dao.php");
$frontend = new FrontendDAO();

header('Content-Type: application/json');
echo json_encode($frontend->random_advice_position());
?>