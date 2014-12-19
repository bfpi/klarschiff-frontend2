<?php

$config = include('../config/config.php');

$files = array(
  "scripts/libs/bootstrap-3.3.1.js",
  "scripts/libs/jquery-tmpl-1.0.4.js",
  "scripts/libs/jquery-placeholder-1.3.js",
  "scripts/libs/jquery-ui-1.11.2.js",
  "scripts/libs/proj4js-2.3.3.js",
  "scripts/libs/OpenLayers-3.0.0.js",
  "scripts/functions.js",
  "config/config.js",
  "scripts/jquery.ks.spinner.php",
  "scripts/OpenLayers-layerFactories.js",
  "scripts/ks-search.js",
  "scripts/init_map.js",
  "scripts/init_sidebar_neue_meldung.js",
  "scripts/init_sidebar_beobachtungsflaechen.js",
  "scripts/init_sidebar_mapicons.js",
  "scripts/init_sidebar.js",
  "scripts/init_ks_lut.js.php",
  "scripts/init.js",
  "scripts/meldung_show.js"
);

if ($config['minify_js']) {
  include("../php/jshrink_minifier.php");
  if ($config['minify_js_force']) {
    unlink($config['minify_js_tempfile']);
  }

  if (file_exists($config['minify_js_tempfile'])) {
    echo file_get_contents($config['minify_js_tempfile']);
  } else {
    $handle = fopen($config['minify_js_tempfile'], "a");

    foreach ($files as $file) {
      $file_name = FRONTEND_URL . $file;
      $file_content = Minifier::minify(file_get_contents($file_name));
      echo $file_content;
      fwrite($handle, $file_content);
    }

    fclose($handle);
  }
} else {
  if (file_exists($config['minify_js_tempfile'])) {
    unlink($config['minify_js_tempfile']);
  }
  foreach ($files as $file) {
    echo 'imports("' . $file . '");';
  }

  echo 'function imports(file) {
    var script = document.createElement(\'script\');
    script.type = \'text/javascript\';
    script.src = file;

    $(\'head\').find(\'script:last\').append(script);
  }';
}
?>
