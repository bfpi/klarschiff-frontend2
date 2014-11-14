var zoom = 4;
var lonLat_center = [12.1528, 54.1507];
var mv_bbox_25833 = [271265.01714072, 5971859.93045162, 346749.189382955, 6017571.95459192];

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
      attribution_text: '© GeoBasis-DE/M-V',
      default_layer: false,
      displayInLayerSwitcher: true
    },
    "SketchMeldung": {
      title: "SketchMeldung",
      type: "Vector",
      geometryType: ol.geom.Point,
      displayInLayerSwitcher: false,
//      styleMap: "klarschiff"
    }
//      "POI": {
//        type: "WMS",
//        url: "http://geo.sv.rostock.de/geodienste/klarschiff_poi/ows",
//        layers: "abfallbehaelter,ampeln,beleuchtung,brunnen,denkmale,hundetoiletten,recyclingcontainer,sitzgelegenheiten",
//        format: "image/png",
//        transparent: true,
//        displayInLayerSwitcher: false,
//        isBaseLayer: false,
//        minScale: 600,
//        singleTile: true
//      },
//      "Meldungen": {
//        //filter: filter,
//        type: "Vector",
//        styleMap: "klarschiff",
//        strategies: {
//          BBOX: {},
//          Cluster: {
//            threshold: 2,
//            distance: 60
//          }
//        },
//        protocol: {
//          type: "WFS",
//          options: {
//            version: "1.1.0",
//            url: ows_url,
//            featureType: "vorgaenge",
//            featureNS: ows_namespace,
//            srsName: "epsg:25833"
//          }
//        }},
//      "GeoRSS-Polygone": {
//        type: "Vector",
//        styleMap: "rss",
//        visibility: false,
//        strategies: {
//          BBOX: {}
//        },
//        protocol: {
//          type: "WFS",
//          options: {
//            version: "1.1.0",
//            url: ows_url,
//            featureType: "klarschiff_stadtteile_hro",
//            featureNS: ows_namespace,
//            srsName: "epsg:25833"
//          }
//        }},
//      "SketchBeobachtungsfläche": {
//        type: "Vector",
//        geometryType: ol.geom.Polygon,
//        styleMap: "rss",
//        displayInLayerSwitcher: false}
  }
};


ol_styles = {
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
//      strokeColor: '#FF8700',
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
//      strokeColor: '#FF8700',
//      cursor: "pointer"
//    }),
//    "temporary": new OpenLayers.Style({
//      fillColor: "#FF8700",
//      fillOpacity: 0.5,
//      strokeColor: '#FF8700',
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

function preAddMap() {
  //var ows_namespace = window.location.protocol + "//" + window.location.host + "/ows/klarschiff";
  //var ows_url = ows_namespace + "/wfs";
  var extra_config = {
    controls: {
//      "Attribution": {
//        type: "Attribution"
//      },
//      "SelectMeldung": {
//        type: "SelectFeature",
//        layer: "Meldungen",
//        options: {
//          multiple: false,
//          autoActivate: true,
//          box: false
//        }},
//      "SelectPolygon": {
//        type: "SelectFeature",
//        layer: "GeoRSS-Polygone",
//        options: {
//          multiple: true,
//          toggle: true,
//          box: false,
//          clickout: false,
//          autoActivate: false
//        }},
//      "DragFeature": {
//        type: "DragFeature",
//        layer: "SketchMeldung",
//        options: {
//          onStart: onNeueMeldungDragStart,
//          onComplete: onNeueMeldungDragComplete
//        }
//      },
//      "DrawBeobachtungsflaeche": {
//        type: "DrawFeature",
//        layer: "SketchBeobachtungsfläche",
//        options: {
//          featureAdded: onRssNeueFlaeche
//        }},
//      "ScaleLine": {
//        type: "ScaleLine",
//        options: {
//          bottomInUnits: ""
//        }
//      }
    },
//    markerSize: 60
  }

  $.extend(true, ol_config, extra_config);
}