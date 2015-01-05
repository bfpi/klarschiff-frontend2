var zoom = 3.7;
var lonLat_center = [13.409414, 54.089276];
var mv_bbox_25833 = [380000, 5980000, 410000, 6010000];

var problemMeldungenMoeglich = true;
var ideeMeldungenMoeglich = false;

var unterstuetzer_schwellenwert = 20;

var placeholder_betreff = "Bitte geben Sie einen Betreff an.";
var placeholder_details = "Bitte beschreiben Sie Ihre Meldung genauer.";
var placeholder_email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
var placeholder_begruendung = "Bitte geben Sie eine Begründung an.";
var placeholder_freitext = "Bitte tragen Sie hier Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung ein.";

//// Variablen mit Fehlertexten
var hauptkategorieLeer = "Sie müssen eine Hauptkategorie auswählen.";
var unterkategorieLeer = "Sie müssen eine Unterkategorie auswählen.";
var betreffLeer = "Sie müssen einen Betreff angeben.";
var detailsLeer = "Sie müssen Ihre Meldung genauer beschreiben.";
var emailFalsch = "Die angegebene E-Mail-Adresse ist syntaktisch falsch. Bitte korrigieren Sie Ihre Eingabe.";
var emailLeer = "Sie müssen Ihre E-Mail-Adresse angeben.";
var begruendungLeer = "Sie müssen eine Begründung angeben.";
var freitextLeer = "Sie müssen Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung angeben.";

var ows_namespace = window.location.protocol + "//" + window.location.host + "/ows/klarschiff";
ows_namespace = "http://www.klarschiff-local.de/ows/klarschiff";
var ows_url = ows_namespace + "/wfs";

var klarschiff_map = 'map.php';
var klarschiff_geoserver = 'http://klarschiff-test:8080/geoserver/';

var styleCache = {};
var highlightStyleCache = {};
ol_styles = {
  stroke: new ol.style.Stroke({
    color: "#FF8700",
    width: 2
  }),
  beobachtungsflaeche: function(feature, resolution) {
    var text = resolution < 15 ? feature.get("bezeichnung") : "";
    if (!styleCache[text]) {
      styleCache[text] = [new ol.style.Style({
          stroke: ol_styles.stroke,
          fill: new ol.style.Fill({
            color: "rgba(255,135,0,0.5)"
          }),
          text: new ol.style.Text({
            font: "bold 12px Verdana",
            text: text,
            fill: new ol.style.Fill({
              color: "#FFEAD7"
            })
          })
        })];
    }
    return styleCache[text];
  },
  beobachtungsflaeche_hover: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get("bezeichnung") : "";
    if (!highlightStyleCache[text]) {
      highlightStyleCache[text] = [new ol.style.Style({
          stroke: ol_styles.stroke,
          fill: new ol.style.Fill({
            color: "rgba(255,0,255,0.3)"
          }),
          text: new ol.style.Text({
            font: "bold 12px Verdana",
            text: text,
            fill: new ol.style.Fill({
              color: "#FFD7FF"
            })
          })
        })];
    }
    return highlightStyleCache[text];
  }
};

var ol_config = {
  "layers": {
    "Stadtplan": {
      type: "WMS",
      title: "Stadtplan",
      url: "http:\/\/geo.sv.rostock.de\/geodienste\/stadtplan\/ows?",
      visibility: true,
      version: "1.1.1",
      layers: "stadtplan",
      projection: "EPSG:25833",
      format: "image/png",
      attribution_text: 'Kartenbild © Universitäts- und Hansestadt Greifswald (<a href="http://creativecommons.org/licenses/by/3.0/deed.de" target="_blank" style="color:#006CB7;text-decoration:none;">CC BY 3.0</a>) | Kartendaten © <a href="http://www.openstreetmap.org/" target="_blank" style="color:#006CB7;text-decoration:none;">OpenStreetMap</a> (<a href="http://opendatacommons.org/licenses/odbl/" target="_blank" style="color:#006CB7;text-decoration:none;">ODbL</a>) und <a href="https://geo.sv.rostock.de/uvgb.html" target="_blank" style="color:#006CB7;text-decoration:none;">uVGB-MV</a>',
      default_layer: true,
      displayInLayerSwitcher: true
    },
    Luftbild: {
      type: "WMS",
      title: "Luftbild",
      url: "http:\/\/geo.sv.rostock.de\/geodienste\/luftbild\/ows?",
      visibility: true,
      version: "1.1.1",
      layers: "luftbild",
      projection: "EPSG:900913",
      format: "image/png",
      attribution_text: "© GeoBasis-DE/M-V",
      default_layer: false,
      displayInLayerSwitcher: true
    },
//      "POI": {
//        type: "WMS",
//        url: "http://geo.sv.rostock.de/geodienste/klarschiff_poi/ows",
//        layers: "abfallbehaelter,ampeln,beleuchtung,brunnen,denkmale,hundetoiletten,recyclingcontainer,sitzgelegenheiten",
//        format: "image/png",
//        displayInLayerSwitcher: true,
//        default_layer: false,
//        minScale: 600,
//        singleTile: true
//      },
    "Meldungen": {
      title: "Meldungen",
      type: "Vector",
      url: klarschiff_geoserver + "klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff:vorgaenge&outputFormat=application/json",
      default_layer: true,
      displayInLayerSwitcher: false,
      enableClustering: true,
      style: meldungenStyles
    },
    "SketchMeldung": {
      title: "SketchMeldung",
      type: "Vector",
      default_layer: true,
      displayInLayerSwitcher: false
    },
    "SketchBeobachtungsflaeche": {
      title: "SketchBeobachtungsflaeche",
      type: "Vector",
      url: klarschiff_geoserver + "klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff:klarschiff_stadtteile_hro&outputFormat=application/json",
      default_layer: false,
      displayInLayerSwitcher: false,
      style: ol_styles.beobachtungsflaeche
    },
    "DrawBeobachtungsflaeche": {
      title: "DrawBeobachtungsflaeche",
      type: "Vector",
      default_layer: false,
      displayInLayerSwitcher: false,
      style: ol_styles.beobachtungsflaeche
    }
  }
};

var mapicons_config = {};

if (problemMeldungenMoeglich) {
  var problem_mapicons_config = {
    probleme12: {
      icons: ["problem_1_layer.png", "problem_2_layer.png"],
      label: "offene Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: ["gemeldet", "offen"]
      }
    },
    probleme3: {
      icons: ["problem_3_layer.png"],
      label: "Probleme in Bearbeitung",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "inBearbeitung"
      }
    },
    probleme4: {
      icons: ["problem_4_layer.png"],
      label: "nicht lösbare Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "wirdNichtBearbeitet"
      }
    },
    probleme5: {
      icons: ["problem_5_layer.png"],
      label: "gelöste Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "abgeschlossen"
      }
    }
  };
  mapicons_config = $.extend(mapicons_config, problem_mapicons_config);
}
if (ideeMeldungenMoeglich) {
  var idee_mapicons_config = {
    ideen12: {
      icons: ["idee_1_layer.png", "idee_2_layer.png"],
      label: "offene Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: ["gemeldet", "offen"]
      }
    },
    ideen3: {
      icons: ["idee_3_layer.png"],
      label: "Ideen in Bearbeitung",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "inBearbeitung"
      }
    },
    ideen4: {
      icons: ["idee_4_layer.png"],
      label: "nicht umsetzbare Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "wirdNichtBearbeitet"
      }
    },
    ideen5: {
      icons: ["idee_5_layer.png"],
      label: "umgesetzte Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "abgeschlossen"
      }
    }
  };
  mapicons_config = $.extend(mapicons_config, idee_mapicons_config);
}