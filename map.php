<?php $config = include(dirname(__FILE__) . "/config/config.php"); ?>
<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Klarschiff – Portal zur Bürgerbeteiligung – Frontend</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="images/icons/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="libs/OpenLayers.min.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/jquery-ui-1.11.2.min.css" media="all" />
    <link rel="stylesheet" type="text/css" href="libs/bootstrap.min.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/map.css" media="all" />
    <script type="text/javascript" src="javascripts/build/libs.js"></script>
    <script type="text/javascript" src="javascripts/build/map.js"></script>
  </head>
  <body>
    <div id="content">
      <div id="ol_map"></div>
      <div id="sidebar" class="sidebar-open">
        <div id="sidebar_toggle" class="sidebar-open" title="Menü ein-/ausfahren"></div>
        <div id="sidebar-content">
          <div class="headline"><?php echo $config['labels']['sidebar_headline']; ?></div>
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
            <div id="melden">
              <ol>
<?php if ($config['functions']['report_problem'] == true) { ?>
                <li>
                  <a href="#" id="problem">
                    <img style="margin-right:10px" alt="Problem melden" src="images/icons/problem_0.png"/>
                    Problem melden
                  </a>
                </li>
<?php } ?>
<?php if ($config['functions']['report_idea'] == true) { ?>
                <li style="margin-top:5px">
                  <a href="#" id="idee">
                    <img style="margin-right:10px" alt="Idee melden" src="images/icons/idee_0.png"/>
                    Idee melden
                  </a>
                </li>
<?php } ?>
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
            <div id="mapicons"></div>
            <h3>Hilfe und Impressum</h3>
            <div id="sonderseiten">
<?php foreach ($config['links']['help_and_impressing'] as $link) { ?>
              <a href="<?php echo $link['url']  ?>" target="_blank"><?php echo $link['label'] ?></a>
<?php } ?>
            </div>
          </div>
          <a id="back_to_start" href="<?php echo FRONTEND_URL; ?>">Startseite</a>
        </div>
      </div>
    </div>
    <div id="tooltip" style="display: none;"></div>
<?php
    foreach (scandir("templates") as $template) {
      if ($template != "." && $template != "..") {
        $file = str_replace(".php", "", $template);
        echo "<script id=\"" . $file . "\" type=\"text/x-jquery-templ\">";
        $filename = "templates/" . $template;
        if (file_exists($filename)) {
          include($filename);
        }
        echo "</script>\n";
      }
    }
?>
  </body>
</html>
