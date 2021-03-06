<?php

$config = include(dirname(__FILE__) . "/../config/config.php");
include_once("backend_tunnel.php");
include_once(dirname(__FILE__) . "/functions.php");

/**
 * @file
 * Frontend-Fassade für Absetzen einer Missbrauchsmeldung
 */
$data = array(
  "id" => $_REQUEST["id"],
  "email" => $_REQUEST["email"],
  "details" => $_REQUEST["details"]
);

/* * ************************************************************************** */
/*                     VALIDIERUNG & TRANSFORMIERUNG                         */
/* * ************************************************************************** */
$trashmail_check = trashmail_check($config, $data['email']);
if ($trashmail_check) {
  die($trashmail_check);
}

$backend_data = array(
  "vorgang" => $data["id"],
  "text" => $data["details"],
  "email" => $data["email"]
);

$answer = returnRelay($backend_data, "missbrauchsmeldung");

print(utf8_decode($answer['content']));
