<?php
# POSTGRESQL DATABASE
define("HOST","localhost");
define("PORT",5432);
define("NAME","standortsuche");
define("USER","standortsuche");
define("PASS","standortsuche");
define("SCHEMA","public");

# ORT
define("URL", "map.php");
# DEFAULT ORT - zur Begrenzung der Suche
# define("ORT","Greifswald");

# SOLR
$solrConf = array(
    'host'    => 'klarschiff-test',
    'port'    => 8080,
    'path'    => 'solr',
    'core'    => 'klarschiff_hgw',
    'version' => 4
);
