<?php

//namespace Klarschiff;

require_once dirname(__FILE__) . "/conf/config.php";
require_once dirname(__FILE__) . "/Search.php";

$search = new Search($solrConf);
$search->openIndex();

echo "<br/>\nclear index.\n";
$conn = pg_connect("host=" . HOST . " port=" . PORT . " dbname=" . NAME . " user=" . USER . " password=" . PASS . "");
if (!$conn) die("Error: pg_connect!");
echo "<br/>connect ok";

/* * *********************************************************************
 * O R T S T E I L    S E A R C H
 * ********************************************************************* */
$sql = "SELECT ot.id AS id,ot.name AS ortsteilname,box2d(ot.geom) AS bbox"
  . ",st_dimension(ot.geom) AS dimension FROM " . SCHEMA . ".ortsteil ot;";
$result = pg_query($conn, $sql);
$num = 0;
while ($row = pg_fetch_assoc($result)) {
  if ($row["bbox"] === null) {
    continue;
  }
  if ($row["dimension"] == 0 AND strpos($row["bbox"], "BOX") === 0) {
    $tmp = split(",", substr($row["bbox"], 4, -1));
    $row["geom"] = "BOX(" . $tmp[0] . "," . $tmp[0] . ")";
  } else {
    $row["geom"] = $row["bbox"];
  }
  $search->updateIndex(
    $row["ortsteilname"],
    array(
      "type" => "Ortsteil",
      "ortsteilname" => $row["ortsteilname"],
      "geom" => $row["geom"]
    )
  );
  $num++;
}

echo "<br/><br/>Tables :" . SCHEMA . ".ortsteil<->" . SCHEMA . ".ort";
echo "<br/>Rows all :" . pg_num_rows($result);
echo "<br/>Rows accepted :" . $num;
echo "<br/>Last error : " . pg_last_error();
/* * *********************************************************************
 * S T R A S S E    S E A R C H
 * ********************************************************************* */
$sql = "SELECT s.id AS id, s.name AS strassenname"
  . ",box2d(s.geom) AS bbox, st_dimension(s.geom) AS dimension FROM " . SCHEMA . ".strasse s";
$result = pg_query($conn, $sql);
$num = 0;
while ($row = pg_fetch_assoc($result)) {
  if ($row["bbox"] === null) {
    continue;
  }
  if ($row["dimension"] == 0 AND strpos($row["bbox"], "BOX") === 0) {
    $tmp = split(",", substr($row["bbox"], 4, -1));
    $row["geom"] = "BOX(" . $tmp[0] . "," . $tmp[0] . ")";
  } else {
    $row["geom"] = $row["bbox"];
  }
  $search->updateIndex(
    $row["strassenname"],
    array(
      "type" => "Straße",
      "strassenname" => $row["strassenname"],
      "geom" => $row["geom"]
    )
  );
  $num++;
}

echo "<br/><br/>Tables :" . SCHEMA . ".strasse<->" . SCHEMA . ".ort<->" . SCHEMA . ".ortsteil";
echo "<br/>Rows all :" . pg_num_rows($result);
echo "<br/>Rows accepted :" . $num;
echo "<br/>Last error : " . pg_last_error();
/* * *********************************************************************
 * A D R E S S E    S E A R C H
 * ********************************************************************* */
$sql = "SELECT a.id, s.name AS strassenname, a.hausnummer, a.hausnummerzusatz"
  . ",box2d(a.geom) AS bbox, st_dimension(a.geom) AS dimension"
  . " FROM " . SCHEMA . ".adresse a "
  . " INNER JOIN " . SCHEMA . ".strasse s ON s.id = a.strasse_id"
  . " ORDER BY a.id";
$result = pg_query($conn, $sql);
$num = 0;
while ($row = pg_fetch_assoc($result)) {
  if ($row["bbox"] === null) {
    continue;
  }
  if ($row["dimension"] == 0 AND strpos($row["bbox"], "BOX") === 0) {
    $tmp = split(",", substr($row["bbox"], 4, -1));
    $row["geom"] = "BOX(" . $tmp[0] . "," . $tmp[0] . ")";
  } else {
    $row["geom"] = $row["bbox"];
  }
  $search->updateIndex(
    $row["strassenname"] . " " . $row["hausnummer"] . " " . $row["hausnummerzusatz"],
    array(
      "type" => "Adresse",
      "strassenname" => $row["strassenname"],
      "hausnummer" => $row["hausnummer"],
      "hausnummerzusatz" => $row["hausnummerzusatz"],
      "geom" => $row["geom"]
    )
  );
  $num++;
}

echo "<br/><br/>Tables :" . SCHEMA . ".address<->" . SCHEMA . ".ort<->" . SCHEMA . ".ortsteil";
echo "<br/>Rows all :" . pg_num_rows($result);
echo "<br/>Rows accepted :" . $num;
echo "<br/>Last error : " . pg_last_error();


$search->closeIndex();
