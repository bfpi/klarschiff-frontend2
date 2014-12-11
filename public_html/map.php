<?php
$config = include(dirname(__FILE__) . "/config/config.php");
?>
<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <title>Klarschiff – Portal zur Bürgerbeteiligung – Frontend</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <link rel="stylesheet" type="text/css" href="styles/OpenLayers-3.0.0.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/jquery-ui-1.11.2.min.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/bootstrap-3.3.1.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/style.css" media="all" />

    <script src="scripts/libs/jquery-1.11.1.js" type="text/javascript"></script>
    <script src="scripts/libs/bootstrap-3.3.1.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery-tmpl-1.0.4.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery-placeholder-1.3.min.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery-ui-1.11.2.min.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery.ks.spinner.js" type="text/javascript"></script>
    <script src="scripts/libs/proj4js-2.3.3-min.js" type="text/javascript"></script>
    <script src="scripts/libs/OpenLayers-3.0.0.js" type="text/javascript"></script>

    <script src="config/config.js" type="text/javascript"></script>
    <script src="scripts/OpenLayers-controlFactories.js" type="text/javascript"></script>
    <script src="scripts/OpenLayers-layerFactories.js" type="text/javascript"></script>
    <script src="scripts/functions.js" type="text/javascript"></script>
    <script src="scripts/rss_functions.js" type="text/javascript"></script>
    <script src="scripts/init_map.js" type="text/javascript"></script>
    <script src="scripts/init_sidebar_neue_meldung.js" type="text/javascript"></script>
    <script src="scripts/init_sidebar_beobachtungsflaechen.js" type="text/javascript"></script>
    <script src="scripts/init_sidebar.js" type="text/javascript"></script>
    <script src="scripts/init_ks_lut.js.php" type="text/javascript"></script>
    <script src="scripts/init.js" type="text/javascript"></script>
  </head>
  <body>
    <div id="content">
      <div id="ol_map"> </div>
      <div id="popup"> </div>
      <div id="sidebar" class="sidebar-open">
        <div id="sidebar_toggle" class="sidebar-open" title="Menü ein-/ausfahren"></div>
        <div id="sidebar-content">
          <div class="headline"><?= $config['labels']['sidebar_headline'] ?></div>
          <div id="layerswitcher"></div>

          <div id="widgets">
            <h3>Adressensuche</h3>
            <div id='standortsuche'>
              <div class="search" style="display:block">
                <input type="text" name="searchtext" id="searchtext" placeholder="Stadtteil/Straße/Adresse eingeben…" />
                <div class="results" id="results_container" style="position:relative;"></div>
              </div>
            </div>
            <h3>neue Meldung</h3>
            <div id='melden'>
              <ol>
                <?php
                if ($config['functions']['report_problem'] == true) {
                  ?>
                  <li>
                    <a href="#" id="problem">
                      <img style="margin-right:10px" alt="Problem melden" src="images/icons/problem_0.png"/>
                      Problem melden
                    </a>
                  </li>
                  <?php
                }
                if ($config['functions']['report_idea'] == true) {
                  ?>
                  <li style="margin-top:5px">
                    <a href="#" id="idee">
                      <img style="margin-right:10px" alt="Idee melden" src="images/icons/idee_0.png"/>
                      Idee melden
                    </a>
                  </li>
                  <?php
                }
                ?>
              </ol>
            </div>
            <h3>Beobachtungsfl&auml;chen</h3>
            <div id="beobachtungsflaechen">
              <button id="flaeche_stadtgebiet" class="flaecheAction">gesamtes Stadtgebiet</button>
              <button id="flaeche_stadtteil" class="flaecheAction">Stadtteil(e) auswählen</button>
              <button id="flaeche_neu" class="flaecheAction">Fläche erstellen</button>
              <button id="flaeche_apply" class="flaecheCtrl" style="display:none">übernehmen</button>
              <button id="flaeche_cancel" class="flaecheCtrl" style="display:none">abbrechen</button>
            </div>
            <h3>Kartenelemente</h3>
            <div id="kartenelemente">
              TODO
            </div>
            <h3>Hilfe und Impressum</h3>
            <div id="sonderseiten">
              <button onClick="window.open('http://demo.klarschiff-hro.de/pc/hilfe.html', '_blank')">Hilfe</button>
              <button onClick="window.open('http://demo.klarschiff-hro.de/pc/datenschutz.html', '_blank')">Datenschutz</button>
              <button onClick="window.open('http://demo.klarschiff-hro.de/pc/impressum.html', '_blank')">Impressum</button>
              <button onClick="window.open('http://demo.klarschiff-hro.de/pc/nutzungsbedingungen.html', '_blank')">Nutzungsbedingungen</button>
            </div>
          </div>
          <div id="back_to_start"></div>
        </div>
      </div>
    </div>
    <?php
    $arr = array('template_flaeche_abonnieren', 'template_meldung_edit');
    foreach ($arr as $template) {
      echo "<script id='" . $template . "' type='text/x-jquery-templ'>";
      $filename = "templates/" . $template . ".html";
      if (file_exists($filename)) {
        echo file_get_contents($filename);
      }
      echo "</script>";
    }
    ?>
  </body>
</html>
