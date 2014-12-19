<?php

$config = include(dirname(__FILE__) . "/../config/config.php");
include_once("backend_tunnel.php");
include_once(dirname(__FILE__) . "/functions.php");

/**
 * @file
 * Frontend-Fassade für das Absetzen von Unterstützungsmeldungen.
 */

$data = array(
  "id" => $_REQUEST["id"],
  "email" => $_REQUEST["email"]
);

/*****************************************************************************/
/*                     VALIDIERUNG & TRANSFORMIERUNG                         */
/*****************************************************************************/

$trashmail_check = trashmail_check($config, $data['email']);
if($trashmail_check) {
  die($trashmail_check);
}

$backend_data = array(
  "vorgang" => $data["id"],
  "email" => $data["email"]
);

$answer = returnRelay($backend_data, "unterstuetzer");

print(utf8_decode($answer['content']));


