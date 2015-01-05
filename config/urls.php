<?php

$base_url = "http://klarschiff-test";

define("ADRESSSUCHE_URL", $base_url . ":8080/solr/select?");
define("BACKEND_URL", $base_url . "/backend/");
define("FRONTEND_URL", $base_url . "/");
define("MOBILE_FRONTEND_URL", $base_url . "/mobil");
define("GEOSERVER_URL", $base_url . ":8080/geoserver/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("WFS_URL", GEOSERVER_URL . "klarschiff/wms/reflect?layers=klarschiff:vorgaenge_rss&format=rss");
