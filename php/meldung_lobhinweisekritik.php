<?php

$config = include(dirname(__FILE__) . "/../config/config.php");
include_once("backend_tunnel.php");
include_once(dirname(__FILE__) . "/functions.php");

/**
 * @file
 * Frontend-Fassade für Absetzen von Lob, Hinweisen oder Kritik zu einer Meldung
 */
$data = array(
  "id" => $_REQUEST["id"],
  "email" => $_REQUEST["email"],
  "freitext" => $_REQUEST["freitext"]
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
  "email" => $data["email"],
  "freitext" => $data["freitext"]
);

$answer = returnRelay($backend_data, "lobHinweiseKritik");

print(utf8_decode($answer['content']));
