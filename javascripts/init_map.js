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

//  var point1 = proj4('EPSG:4326', 'EPSG:25833', [11.49824, 53.74828]);
//  var point2 = ol.proj.transform([11.49824, 53.74828], 'EPSG:4326', projection_25833);
//  var point3 = proj4('EPSG:4326', 'EPSG:25833', [11.43663, 53.69561]);
//  var point4 = ol.proj.transform([11.43663, 53.69561], 'EPSG:4326', projection_25833);
//  var htmlStr = "Transformation of points from GeoJSON to view projection:\n";
//  htmlStr += "[11.49824,53.74828] proj4: [" + point1[0] + ', ' + point1[1] + '] ol3: [' + point2[0] + ', ' + point2[1] + ']' + '\n';
//  htmlStr += "[11.43663,53.69561] proj4: [" + point3[0] + ', ' + point3[1] + '] ol3: [' + point4[0] + ', ' + point4[1] + ']' + '\n';
//  console.log(htmlStr);
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