<?php

function validate_meldung_im_erlaubten_bereich($config, $point) {

  $connection = pg_connect("host=" . $config['psql']['host'] .
    " port=" . $config['psql']['port'] .
    " dbname=" . $config['psql']['database'] .
    " user=" . $config['psql']['username'] .
    " password=" . $config['psql']['password'] . "") or die("1000#1000#" . $config['labels']['errors']['db_unavailable']);

  // Inside allowed area?
  $ret = false;
  $wkt = str_replace(",", " ", $point);
  
  $sql = "SELECT ST_Within(ST_GeometryFromText($1, 25833), klarschiff.klarschiff_stadtgrenze_hro.the_geom) FROM klarschiff.klarschiff_stadtgrenze_hro";
  $result = pg_query_params($connection, $sql, array($wkt));
  while ($row = pg_fetch_assoc($result)) {
    if($row['st_within'] === 't') {
      $ret = true;
    }
  }
  pg_close($connection);
  return $ret;
}

?>