<?php

/**
 * @file
 * Frontend-Fassade für das Abonnieren von RSS-Feeds.
 */
require_once 'backend_tunnel.php';
require_once 'frontend_dao.php';
$frontend = new FrontendDAO();

$config = include dirname(__FILE__) . "/../config/config.php";

$problem_categories = filter_input(INPUT_POST, 'problem_kategorie');
if (empty($problem_categories) || !is_array($problem_categories)) {
  $problem_categories = array();
}

$idea_categories = filter_input(INPUT_POST, 'idee_kategorie');
if (empty($idea_categories) || !is_array($idea_categories)) {
  $idea_categories = array();
}

$data = array_merge(
  filter_input_array(INPUT_POST, array(
  'id' => FILTER_VALIDATE_INT,
  'geom' => FILTER_UNSAFE_RAW)), array(
  "ideen" => empty($idea_categories) ? 'false' : 'true',
  "ideen_kategorien" => implode(",", $idea_categories),
  "probleme" => empty($problem_categories) ? 'false' : 'true',
  "probleme_kategorien" => implode(",", $problem_categories)
  )
);

if ($data["geom"] != "null" && strlen($data["geom"]) > 0 &&
  $data["id"] != "null" && strlen($data["id"]) > 0) {
  header("HTTP/1.0 500 Internal Server Error");
  die("Es kann entweder ein Polygon oder eine Polygon-Id übergeben werden, aber nicht beides.");
}

if ($data["id"] == -1) {
  // STADTGEBIET
  $data["geom"] = $frontend->city_boundary();
} else if ($data["id"] != "null" && strlen($data["id"]) > 0) {
  // STADTTEILE
  $ids = array();

  // Überprüfen ob es sich um Zahlen handelt.
  foreach (explode(",", $_POST["id"]) AS $id) {
    if (is_numeric($id)) {
      $ids[] = $id;
    }
  }

  // Wenn gültige id/s gefunden wurde/n, Anfrage an die Datenbank.
  if (!empty($ids)) {
    $data["geom"] = $frontend->district_boundary($ids);
  }
} else if ($data["geom"] != "null" && strlen($data["geom"]) > 0) {
  $data["geom"] = $frontend->boundary($data["geom"]);
}

$data["oviWkt"] = $data["geom"];
$data["problemeKategorien"] = $data["probleme_kategorien"];
$data["ideenKategorien"] = $data["ideen_kategorien"];

$result = returnRelay($data, 'geoRss');

echo json_encode(array("hash" => md5($result["content"])));
