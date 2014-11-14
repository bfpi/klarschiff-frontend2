<?php

define("ADRESSSUCHE_URL", "http://klarschiff-demo:8080/solr/select?");
define("ADRESSSUCHE_SELECT_URL", "/index.php?adresssuche_result=true");

return array(
  'psql' => array(
    'host' => 'klarschiff-demo',
    'port' => 5432,
    'username' => 'klarschiff_frontend',
    'password' => 'klarschiff_frontend',
    'database' => 'klarschiff_frontend'
  )
);
?>