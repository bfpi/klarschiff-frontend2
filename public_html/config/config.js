var zoom = 3.7;
var lonLat_center = [13.409414, 54.089276];
//var mv_bbox_25833 = [271265.01714072, 5971859.93045162, 346749.189382955, 6017571.95459192];
var mv_bbox_25833 = [380000, 5980000, 410000, 6010000];

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

var styleCache = {};
var highlightStyleCache = {};
ol_styles = {
  beobachtungsflaeche: function(feature, resolution) {
    var text = resolution < 15 ? feature.get("bezeichnung") : "";
    if (!styleCache[text]) {
      styleCache[text] = [new ol.style.Style({
          fill: new ol.style.Fill({
            color: "rgba(255,135,0,0.5)"
          }),
          stroke: new ol.style.Stroke({
            color: "#FF8700",
            width: 2
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
          stroke: new ol.style.Stroke({
            color: "#FF8700",
            width: 2
          }),
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
//  rss: new OpenLayers.StyleMap({
//    "default": new OpenLayers.Style({
//      fontFamily: "Verdana",
//      fontSize: "12px",
//      fontStyle: "italic",
//      fontWeight: "bold",
//      fontColor: "#FFEAD7",
//      label: "${bezeichnung}",
//      labelAlign: "cm",
//      fillColor: "#FF8700",
//      fillOpacity: 0.5,
//      strokeColor: "#FF8700",
//      cursor: "pointer"
//    }),
//    "select": new OpenLayers.Style({
//      fontFamily: "Verdana",
//      fontSize: "12px",
//      fontStyle: "italic",
//      fontWeight: "bold",
//      fontColor: "#FFD7FF",
//      label: "${bezeichnung}",
//      labelAlign: "cm",
//      fillColor: "#FF00FF",
//      fillOpacity: 0.5,
//      strokeColor: "#FF8700",
//      cursor: "pointer"
//    }),
//    "temporary": new OpenLayers.Style({
//      fillColor: "#FF8700",
//      fillOpacity: 0.5,
//      strokeColor: "#FF8700",
//      cursor: "pointer"
//    })
//  }),
//  klarschiff: new OpenLayers.StyleMap({
//    "default": klarschiffDefaultStyle,
//    "select": new OpenLayers.Style({
//      graphicWidth: 56,
//      graphicHeight: 64,
//      graphicXOffset: -14,
//      graphicYOffset: -51,
//      externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}_s.png",
//      cursor: "pointer"
//    }, {
//      rules: clusterRules
//    }),
//    "temporary": new OpenLayers.Style({
//      graphicWidth: 56,
//      graphicHeight: 64,
//      graphicXOffset: -14,
//      graphicYOffset: -51,
//      externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}_s.png",
//      cursor: "pointer"
//    })
//  })
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
      attribution_text: 'Kartenbild © Hansestadt Rostock (<a href="http://creativecommons.org/licenses/by/3.0/deed.de" target="_blank" style="color:#006CB7;text-decoration:none;">CC BY 3.0</a>) | Kartendaten © <a href="http://www.openstreetmap.org/" target="_blank" style="color:#006CB7;text-decoration:none;">OpenStreetMap</a> (<a href="http://opendatacommons.org/licenses/odbl/" target="_blank" style="color:#006CB7;text-decoration:none;">ODbL</a>) und <a href="https://geo.sv.rostock.de/uvgb.html" target="_blank" style="color:#006CB7;text-decoration:none;">uVGB-MV</a>',
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
    "SketchMeldung": {
      title: "SketchMeldung",
      type: "Vector",
      url: "http://klarschiff-test:8080/geoserver/klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff:vorgaenge&maxFeatures=50&outputFormat=application/json",
      default_layer: true,
      displayInLayerSwitcher: false,
    },
//    "Meldungen": {
//      title: "Meldungen",
//      //filter: filter,
//      type: "Vector",
//      displayInLayerSwitcher: true,
//      projection: "EPSG:25833",
//      protocol: {
//        type: "WFS",
//        options: {
//          url: ows_url,
//          featureType: "vorgaenge",
//          featureNS: ows_namespace,
//          srsName: "epsg:25833"
//        }
//      }
//    },
//    "GeoRSS-Polygone": {
//      title: "GeoRSS-Polygone",
//      type: "Vector",
////        styleMap: "rss",
////        visibility: false,
////        strategies: {
////          BBOX: {}
////        },
////        protocol: {
////          type: "WFS",
////          options: {
////            version: "1.1.0",
////            url: ows_url,
////            featureType: "klarschiff_stadtteile_hro",
////            featureNS: ows_namespace,
////            srsName: "epsg:25833"
////          }
//      displayInLayerSwitcher: false,
////        }
//    },
    "SketchBeobachtungsflaeche": {
      title: "SketchBeobachtungsflaeche",
      type: "Vector",
      url: "http://klarschiff-test:8080/geoserver/klarschiff/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=klarschiff:klarschiff_stadtteile_hro&maxFeatures=50&outputFormat=application/json",
      default_layer: false,
      displayInLayerSwitcher: false,
      style: ol_styles.beobachtungsflaeche
    }
  }
};