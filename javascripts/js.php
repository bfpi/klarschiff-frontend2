<?php

$config = include('../config/config.php');

$jquery = "scripts/libs/jquery-1.11.1.js";

$files = array();
$js_tempfile = "";

$referer = parse_url($_SERVER["HTTP_REFERER"]);
if(endsWith($referer['path'], "map.php")) {
  // map.php
  $files = array(
    "scripts/libs/bootstrap-3.3.1.js",
    "scripts/libs/jquery-tmpl-1.0.4.js",
    "scripts/libs/jquery-placeholder-1.3.js",
    "scripts/libs/jquery-ui-1.11.2.js",
    "scripts/libs/proj4js-2.3.3.js",
    "scripts/libs/OpenLayers-3.0.0.js",
    "scripts/functions.js",
    "config/config.js",
    "scripts/projections.js",
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
  $js_tempfile = $config['minify_js_tempfile_folter'] . "ks_map.js";
} else {
  // index.php
  $files = array(
    "scripts/libs/proj4js-2.3.3.js",
    "scripts/libs/OpenLayers-3.0.0.js",
    "scripts/functions.js",
    "config/config.js",
    "scripts/ks-search.js",
    "scripts/projections.js",
    "scripts/OpenLayers-layerFactories.js",
    "scripts/index.js"
  );
  $js_tempfile = $config['minify_js_tempfile_folter'] . "ks_start.js";
}

if ($config['minify_js']) {
  include("../php/jshrink_minifier.php");
  if ($config['minify_js_force']) {
    unlink($js_tempfile);
  }

  if (file_exists($js_tempfile)) {
    echo file_get_contents($js_tempfile);
  } else {
    $handle = fopen($js_tempfile, "a");

    foreach (array_merge(array($jquery), $files) as $file) {
      $file_name = FRONTEND_URL . $file;
      $file_content = Minifier::minify(file_get_contents($file_name));
      echo $file_content;
      fwrite($handle, $file_content);
    }

    fclose($handle);
  }
} else {
  if (file_exists($js_tempfile)) {
    unlink($js_tempfile);
  }
  
  ?>
  importJQuery("<?= $jquery ?>", function() {
    <?php
    foreach ($files as $file) {
      echo 'importJs("' . $file . '");';
    }
    ?>
  });

  function importJQuery(file, callback) {
    var script = document.createElement("script");
    script.src = file;
    script.type = "text/javascript";
    
    script.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  function importJs(file) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = file;

    $('head').find('script:last').append(script);
  }
<?php
}

function endsWith($haystack, $needle) {
  return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
} 
?>