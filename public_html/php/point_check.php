<?php

define('BUFFER', 10);

$included = strtolower(realpath(__FILE__)) != strtolower(realpath($_SERVER['SCRIPT_FILENAME']));

function point_check(&$wkt, $displace) {
  $config = include(dirname(__FILE__) . "/../config/config.php");

  $connection = pg_connect("host=" . $config['psql']['host'] .
    " port=" . $config['psql']['port'] .
    " dbname=" . $config['psql']['database'] .
    " user=" . $config['psql']['username'] .
    " password=" . $config['psql']['password'] . "");

  // Inside allowed area?
  if (!inside_allowed_area_check($connection, "POINT(" . $wkt . ")")) {
    return '1002#1002#Die neue Meldung befindet sich außerhalb Rostocks.';
  }

  pg_close($connection);
  return false;
}

function inside_allowed_area_check($connection, $wkt) {
  $sql = "SELECT ST_Within(ST_GeometryFromText($1, 25833), klarschiff.klarschiff_stadtgrenze_hro.the_geom) FROM klarschiff.klarschiff_stadtgrenze_hro";
  $result = pg_query_params($connection, $sql, array($wkt));

  while ($row = pg_fetch_assoc($result)) {
    return $row['st_within'] === 't';
  }
  return false;
}

if (!$included) {
  $wkt = str_replace(",", " ", $_REQUEST['point']);
  $ptc = point_check($wkt, false);
  if ($ptc) {
    die($ptc);
  }
}

