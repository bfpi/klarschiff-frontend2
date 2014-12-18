<?php

/**
 * @file
 * Frontend-Fassade für das Abonnieren von RSS-Feeds.
 */
$config = include(dirname(__FILE__) . "/../config/config.php");

$problem_kat_arr = array();
$idee_kat_arr = array();
$idee = "false";
$problem = "false";
$debug = "";


if (!empty($_REQUEST["problem_kategorie"]) AND is_array($_REQUEST["problem_kategorie"])) {
  $problem_kat_arr = $_REQUEST["problem_kategorie"];
  if (!empty($problem_kat_arr)) {
    $problem = "true";
  }
}

if (!empty($_REQUEST["idee_kategorie"]) AND is_array($_REQUEST["idee_kategorie"])) {
  $idee_kat_arr = $_REQUEST["idee_kategorie"];
  if (!empty($idee_kat_arr)) {
    $idee = "true";
  }
}

if (substr($_REQUEST["id"], 0, 1) == ",") {
  $_REQUEST["id"] = substr($_REQUEST["id"], 1);
}

$data = array(
  "geom" => $_REQUEST["geom"],
  "id" => $_REQUEST["id"],
  "ideen" => $idee,
  "ideen_kategorien" => implode(",", $idee_kat_arr),
  "probleme" => $problem,
  "probleme_kategorien" => implode(",", $problem_kat_arr)
);


/* * ************************************************************************** */
/*                     VALIDIERUNG & TRANSFORMIERUNG                         */
/* * ************************************************************************** */

if ($data["geom"] != "null" && strlen($data["geom"]) > 0 && 
  $data["id"] != "null" && strlen($data["id"]) > 0) {
  header("HTTP/1.0 500 Internal Server Error");
  die("Es kann entweder ein Polygon oder eine Polygon-Id übergeben werden, aber nicht beides.");
}
$connection = pg_connect("host=" . $config['psql']['host'] .
  " port=" . $config['psql']['port'] .
  " dbname=" . $config['psql']['database'] .
  " user=" . $config['psql']['username'] .
  " password=" . $config['psql']['password'] . "");


/* * ************************************************************************** */
/*                      Geometrie ermitteln - START                          */
/*                       STADTGEBIET / STADTTEILE                            */
/* * ************************************************************************** */
$geom = "";

// STADTGEBIET
if ($data["id"] == -1) {
  $result = pg_query($connection, "SELECT st_astext(st_multi(the_geom)) FROM klarschiff.klarschiff_stadtgrenze_hro LIMIT 1;");
  if (pg_num_rows($result) == 1) {
    $row = pg_fetch_row($result);
    $data["geom"] = $row[0];
  }

  // STADTTEILE
} else if ($data["id"] != "null" && strlen($data["id"]) > 0) {
  $ids = array();

  // Überprüfen ob es sich um Zahlen handelt.
  foreach (explode(",", $_POST["id"]) AS $id) {
    if (is_numeric($id)) {
      $ids[] = $id;
    }
  }

  // Wenn gültige id/s gefunden wurde/n, Anfrage an die Datenbank.
  if (!empty($ids)) {

    // SQL aufbauen.
    $sql = "SELECT st_astext(st_multi(st_memunion((the_geom)))) FROM klarschiff.klarschiff_stadtteile_hro WHERE ogc_fid IN (" . implode(",", $ids) . ");";

    $debug.= "\n" . $sql;

    $result = pg_query($connection, $sql);

    if (pg_num_rows($result) == 1) {
      $row = pg_fetch_row($result);
      $data["geom"] = $row[0];
    } else {
      $debug.= "\n count : " . pg_num_rows($result);
    }
  }

  $debug.= "\n ids : " . print_r($ids, true);
} else if ($data["geom"] != "null" && strlen($data["geom"]) > 0) {
  $sql = "SELECT st_astext(st_multi('" . $data["geom"] . "'));";
  $result = pg_query($connection, $sql);

  if (pg_num_rows($result) == 1) {
    $row = pg_fetch_row($result);
    $data["geom"] = $row[0];
  }
}


/* * ************************************************************************** */
/*                      Geometrie ermitteln - ENDE                           */
/* * ************************************************************************** */

pg_close($connection);


/* * ************************************************************************** */
/*                  Geometrie an das Backend durchreichen                    */
/* * ************************************************************************** */

require_once dirname(__FILE__) . '/backend_tunnel.php';

/*
 * @todo change this!
 */
$data["oviWkt"] = $data["geom"];
$data["problemeKategorien"] = $data["probleme_kategorien"];
$data["ideenKategorien"] = $data["ideen_kategorien"];

$result = returnRelay($data, 'geoRss');

echo json_encode(array(
  "hash" => md5($result["content"])
));