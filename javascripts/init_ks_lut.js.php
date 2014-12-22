<?php
$database = include(dirname(__FILE__) . "/../config/database.php");

$lut = array();

$connection = pg_connect("host=" . $database['frontend']['host'] .
  " port=" . $database['frontend']['port'] .
  " dbname=" . $database['frontend']['database'] .
  " user=" . $database['frontend']['username'] .
  " password=" . $database['frontend']['password'] . "");

$res = pg_query("SELECT * FROM klarschiff.klarschiff_kategorie ORDER BY name");
while ($row = pg_fetch_assoc($res)) {
  $lut["kategorie"][$row["id"]] = array(
    "name" => $row["name"],
    "parent" => $row["parent"],
    "childcount" => 0,
    "typ" => $row["vorgangstyp"],
    "aufforderung" => $row["aufforderung"],
    "naehere_beschreibung_notwendig" => $row["naehere_beschreibung_notwendig"]
  );
}

foreach ($lut["kategorie"] as $key => $val) {
  $parent = $val["parent"];
  if ($parent) {
    $childcount = $lut["kategorie"][$parent]["childcount"];
    $lut["kategorie"][$parent]["childcount"] = $childcount + 1;
  }
}

$res = pg_query("SELECT * FROM klarschiff.klarschiff_vorgangstyp");
while ($row = pg_fetch_assoc($res)) {
  $lut["typ"][$row["id"]] = $row;
}

$res = pg_query("SELECT * FROM klarschiff.klarschiff_status");
while ($row = pg_fetch_assoc($res)) {
  $lut["status"][$row["id"]] = $row;
}

pg_close($connection);
?>

var ks_lut = <?php echo json_encode($lut); ?>;