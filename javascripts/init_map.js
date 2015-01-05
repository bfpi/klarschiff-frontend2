function init_map() {
  var mapCenterStart = ol.proj.transform(lonLat_center, 'EPSG:4326', projection_25833);

  map = new ol.Map({
    target: 'ol_map',
    view: new ol.View({
      projection: projection_25833,
      center: mapCenterStart,
      zoom: zoom
    })
  });

  var bboxString = getUrlParam("BBOX");
  if (bboxString !== null) {
    fitViewportToBBox(bboxString.split(","));
  }

  // Alle Layer erzeugen
  var layerFactory = new OLLayerFactory();
  $.each(ol_config.layers, function(name, def) {
    map.addLayer(layerFactory.createLayer(def, projection_25833));
  });

  addControls(map);
}

function addControls(map) {

  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: projection_25833,
    undefinedHTML: '?,?'
  });
  map.addControl(mousePositionControl);

  var latlon_mousePositionControl = new ol.control.MousePosition({
    className: 'll-mouse-position',
    target: document.getElementById('ol-overlaycontainer-stopevent'),
    coordinateFormat: ol.coordinate.createStringXY(6),
    projection: 'EPSG:4326',
    undefinedHTML: '?,?'
  });
  map.addControl(latlon_mousePositionControl);

  var scaleLine = new ol.control.ScaleLine();
  map.addControl(scaleLine);

  $(map.getViewport()).on("mousemove", function(evt) {
    pixel = map.getEventPixel(evt.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      return feature;
    });

    if (feature == undefined) {
      $("#" + map.getTarget()).css("cursor", "auto");
    } else {
      $("#" + map.getTarget()).css("cursor", "pointer");
    }
  });

  map.on("click", function(e) {
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
      if (layer && layer.get("title") === "Meldungen") {
        size = feature.get("features").length;
        if (size == 1) {
          showMeldung(feature.get("features")[0]);
        } else {
          map.getView().setCenter(e.coordinate);
          current_zoom = map.getView().getZoom();
          if (current_zoom == undefined) {
            current_zoom = zoom;
          }
          map.getView().setZoom(parseInt(current_zoom + 1));
          return;
        }
      }
    })
  });

  if (getUrlParam('advice') != null) {
    setTimeout(openFeatureFromParameter, 100);
  }
}

function openFeatureFromParameter() {
  var features = getLayerByTitle("Meldungen").getSource().getFeatures();
  features.forEach(function(ft) {
    if (ft.get("features").length == 1 && ft.get("features")[0].get("id") == getUrlParam('advice')) {
      showMeldung(ft.get("features")[0]);
    }
  });
}