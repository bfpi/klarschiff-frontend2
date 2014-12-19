<?php

define('BUFFER', 10);

$included = strtolower(realpath(__FILE__)) != strtolower(realpath($_SERVER['SCRIPT_FILENAME']));
include(dirname(__FILE__) . "/functions.php");

function point_check($point, $displace) {
  $config = include(dirname(__FILE__) . "/../config/config.php");
  // Inside allowed area?
  if(!validate_meldung_im_erlaubten_bereich($config, $point)) {
    return '1002#1002#' . $config['labels']['errors']['ausserhalb_des_bereichs'];
  }
  
  return false;
}

if (!$included) {
  $ptc = point_check("POINT(" . $_REQUEST["point"] . ")", false);
  if ($ptc) {
    die($ptc);
  }
}

