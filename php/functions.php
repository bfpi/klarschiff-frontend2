<?php

function validate_meldung_im_erlaubten_bereich($config, $point) {
  $db_config = $config['database']['frontend'];
  $connection = pg_connect("host=" . $db_config['host'] .
    " port=" . $db_config['port'] .
    " dbname=" . $db_config['dbname'] .
    " user=" . $db_config['user'] .
    " password=" . $db_config['password'] . "") or die("1000#1000#" . $config['labels']['errors']['db_unavailable']);

  // Inside allowed area?
  $ret = false;
  $wkt = str_replace(",", " ", $point);

  $sql = "SELECT ST_Within(ST_GeometryFromText($1, 25833), klarschiff.klarschiff_stadtgrenze_hro.the_geom) FROM klarschiff.klarschiff_stadtgrenze_hro";
  $result = pg_query_params($connection, $sql, array($wkt));
  while ($row = pg_fetch_assoc($result)) {
    if ($row['st_within'] === 't') {
      $ret = true;
    }
  }
  pg_close($connection);
  return $ret;
}

function trashmail_check($config, $email) {
  $db_config = $config['database']['frontend'];
  $connection = pg_connect("host=" . $db_config['host'] .
    " port=" . $db_config['port'] .
    " dbname=" . $db_config['dbname'] .
    " user=" . $db_config['user'] .
    " password=" . $db_config['password'] . "");

  $blacklist_this = false;

  if ($connection) {
    pg_prepare('', "SELECT COUNT(*) FROM klarschiff.klarschiff_trashmail_blacklist WHERE $1 LIKE '%@' || pattern OR $2 LIKE '%.' || pattern");
    $result = pg_execute('', array($_REQUEST['email'], $_REQUEST['email']));
    if ($row = pg_fetch_assoc($result)) {
      $blacklist_this = $row["count"] !== '0';
    }
    pg_close($connection);
  }

  return $blacklist_this ? '1001#1001#' . $config['labels']['errors']['mail_on_blacklist'] : false;
}

?>