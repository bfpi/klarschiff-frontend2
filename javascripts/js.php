/* js.php */
<?php

$config = include('../config/config.php');

$jquery = "libs/jquery-1.11.1.js";

$files = array();
$js_tempfile = "";

$referer = parse_url($_SERVER["HTTP_REFERER"]);
if(endsWith($referer['path'], "map.php")) {
  // map.php
  $files = array(
    "libs/bootstrap-3.3.1.js",
    "libs/jquery-tmpl-1.0.4.js",
    "libs/jquery-placeholder-1.3.js",
    "libs/jquery-ui-1.11.2.js",
    "libs/proj4js-2.3.3.js",
    "libs/OpenLayers-3.0.0.js",
    "javascripts/functions.js",
    "config/config.js",
    "javascripts/projections.js",
    "javascripts/jquery.ks.spinner.php",
    "javascripts/OpenLayers-layerFactories.js",
    "javascripts/ks-search.js",
    "javascripts/init_map.js",
    "javascripts/init_sidebar_neue_meldung.js",
    "javascripts/init_sidebar_beobachtungsflaechen.js",
    "javascripts/init_sidebar_mapicons.js",
    "javascripts/init_sidebar.js",
    "javascripts/init_ks_lut.js.php",
    "javascripts/init.js",
    "javascripts/meldung_show.js"
  );
  $js_tempfile = $config['minify_js_tempfile_folter'] . "ks_map.js";
} else {
  // index.php
  $files = array(
    "libs/bootstrap-3.3.1.js",
    "libs/proj4js-2.3.3.js",
    "libs/OpenLayers-3.0.0.js",
    "javascripts/functions.js",
    "config/config.js",
    "javascripts/ks-search.js",
    "javascripts/projections.js",
    "javascripts/OpenLayers-layerFactories.js",
    "javascripts/index.js"
  );
  $js_tempfile = $config['minify_js_tempfile_folter'] . "ks_index.js";
}

if ($config['minify_js']) {
  include("../libs/jshrink_minifier.php");
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