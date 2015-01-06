<?php

$base = "http://www.klarschiff-uhgw.de";
define("BASE_URL", $base . "/");

define("ADRESSSUCHE_URL", $base . ":8080/solr/select?");
define("BACKEND_URL", BASE_URL . "backend/");
define("FRONTEND_URL", BASE_URL . "pc/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");
define("OWS_URL", BASE_URL . "ows/klarschiff/ows");
define("WFS_URL", BASE_URL . "ows/klarschiff/wms/reflect?layers=klarschiff:vorgaenge_rss&format=rss");
