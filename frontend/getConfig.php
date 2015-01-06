<?php

$database = include(dirname(__FILE__) . "/../config/database.php");

$connectionString = sprintf("host=%s dbname=%s user=%s password=%s", 
  $database['frontend']['host'], $database['frontend']['dbname'], 
  $database['frontend']['user'], $database['frontend']['password']);
$connection = pg_connect($connectionString);

$config = array();

$res = pg_query('SELECT * FROM klarschiff.klarschiff_vorgangstyp');
while($row = pg_fetch_assoc($res)) {
  $config['vorgangstyp'][$row['ordinal']] = $row;
}

$res = pg_query('SELECT * FROM klarschiff.klarschiff_status');
while($row = pg_fetch_assoc($res)) {
  $config['status'][$row['nid']] = $row;
}

$res = pg_query('SELECT * FROM klarschiff.klarschiff_kategorie ORDER BY name');
while($row = pg_fetch_assoc($res)) {
  $config['kategorie'][$row['id']] = $row;
}

pg_close($connection);

$connection = pg_connect("host=localhost dbname=mapbender user=mapbender password=mapbender");

$res = pg_query("SELECT e_content FROM mapbender.gui_element WHERE fkey_gui_id = 'Klarschiff' AND e_id = 'template_meldung_show_mobil'");
$row = pg_fetch_assoc($res);
$config['meldung_template'] = $row['e_content'];

$res = pg_query("SELECT var_value FROM mapbender.gui_element_vars WHERE fkey_gui_id = 'Klarschiff' AND fkey_e_id = 'kartenelemente' AND var_name ='schwellenwert'");
$row = pg_fetch_assoc($res);
$config['schwellenwert'] = $row ? intval($row['var_value']) : 20;

pg_close($connection);

$config['version'] = '0.1';

header('Content-Type: application/json');
echo json_encode($config);
