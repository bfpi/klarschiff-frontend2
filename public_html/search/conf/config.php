<?php
# POSTGRESQL DATABASE
define("HOST","localhost");
define("PORT",5432);
define("NAME","klarschiff_suche");
define("USER","admin");
define("PASS","admin");
define("SCHEMA","public");

# ORT
# define("URL","http://demo.klarschiff-hro.de/frames/login.php?mb_user_myGui=Klarschiff&name=public&password=public");
# DEFAULT ORT - zur Begrenzung der Suche
# define("ORT","Greifswald");

# SOLR
$solrConf = array(
    'host'    => 'klarschiff-test',
    'port'    => 8080,
    'path'    => 'solr',
    'core'    => 'klarschiff',
    'version' => 4
);
