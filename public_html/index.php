<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <title>Klarschiff – Portal zur Bürgerbeteiligung – Frontend</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <link rel="stylesheet" type="text/css" href="styles/OpenLayers-3.0.0.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/jquery-ui-1.11.2.min.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/bootstrap-3.3.1.css" media="all" />
    <link rel="stylesheet" type="text/css" href="styles/style.css" media="all" />

    <script src="scripts/libs/jquery-1.11.1.min.js" type="text/javascript"></script>
    <script src="scripts/libs/bootstrap-3.3.1.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery-tmpl-1.0.4.js" type="text/javascript"></script>
    <script src="scripts/libs/jquery-ui-1.11.2.min.js" type="text/javascript"></script>
    <script src="scripts/libs/proj4js.min.js" type="text/javascript"></script>
    <script src="scripts/libs/OpenLayers-3.0.0.js" type="text/javascript"></script>
    <script src="scripts/libs/OpenLayers-factories.js" type="text/javascript"></script>

    <script src="config/config.js" type="text/javascript"></script>
    <script src="scripts/functions.js" type="text/javascript"></script>
    <script src="scripts/rss_functions.js" type="text/javascript"></script>
    <script src="scripts/init_map.js" type="text/javascript"></script>
    <script src="scripts/init_sidebar_neue_meldung.js" type="text/javascript"></script>
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
          <div class="headline">DEMO</div>
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
                <li>
                  <a href="#" id="problem">
                    <img style="margin-right:10px" alt="Problem melden" src="images/icons/problem_0.png"/>
                    Problem melden
                  </a>
                </li>
                <li style="margin-top:5px">
                  <a href="#" id="idee">
                    <img style="margin-right:10px" alt="Idee melden" src="images/icons/idee_0.png"/>
                    Idee melden
                  </a>
                </li>
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
    <script id='template_flaeche_abonnieren' type="text/x-jquery-templ">
      <form id="rss_abo">
      <input type="hidden" name="id" value="${id}"/>
      <input type="hidden" name="geom" value="${geom}"/>

      <div id="problem" style="width:48%;margin-right:2%">
      <h4 style="margin-bottom:5px;margin-top:2px">Probleme</h4>
      <div>
      <div name="problem_kategorie" class="scrollCheckbox" style="border-bottom:1px solid #999999;margin-bottom:6px">
      </div>
      <input type="checkbox" name="problem_alle" value="1" style="margin-bottom:0"/>
      <label style="font-style:italic;font-weight:bold;font-size:0.8em">alle Probleme</label>
      </div>
      </div>
      <div id="idee" style="width:48%;margin-right:2%">
      <h4 style="margin-bottom:5px;margin-top:2px">Ideen</h4>
      <div>
      <div name="idee_kategorie" class="scrollCheckbox" style="border-bottom:1px solid #999999;margin-bottom:6px">
      </div>
      <input type="checkbox" name="idee_alle" value="1" style="margin-bottom:0"/>
      <label style="font-style:italic;font-weight:bold;font-size:0.8em">alle Ideen</label>
      </div>
      </div>
      </form>
    </script>
  </body>
</html>