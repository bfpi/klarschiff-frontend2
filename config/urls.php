<?php

$base = "http://klarschiff-test";
define("BASE_URL", $base . "/hgw/");

define("ADRESSSUCHE_URL", $base . ":8080/solr/select?");
define("BACKEND_URL", BASE_URL . "backend/");
define("FRONTEND_URL", BASE_URL . "pc/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");
define("MELDUNGEN_WFS_URL", BASE_URL . "ows/klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff_hgw:vorgaenge&outputFormat=application/json");
define("STADTTEILE_WFS_URL", BASE_URL . "ows/klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff_hgw:klarschiff_stadtteile_hro&outputFormat=application/json");
define("WFS_URL", BASE_URL . "ows/klarschiff/wms/reflect?layers=klarschiff_hgw:vorgaenge_rss&format=rss");
