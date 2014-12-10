
function init_map() {

  if (typeof(preAddMap) == "function") {
    preAddMap();
  }

  var mapCenterStart = ol.proj.transform(lonLat_center, 'EPSG:4326', 'EPSG:25833');

  map = new ol.Map({
    target: 'ol_map',
    view: new ol.View({
      projection: projection_25833,
      center: mapCenterStart,
      zoom: zoom
    })
  });

  // Alle Layer erzeugen
  var layerFactory = new OLLayerFactory();
  $.each(ol_config.layers, function(name, def) {
    var layer = layerFactory.createLayer(def, projection_25833);
    layer && map.addLayer(layer);
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

proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
var projection_25833 = ol.proj.get('EPSG:25833');
projection_25833.setExtent(mv_bbox_25833);

function addControls(map) {

  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:25833',
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

  var scaleLine = new ol.control.ScaleLine()
  map.addControl(scaleLine);

  var zoom = new ol.control.Zoom();
  map.addControl(zoom);

  var controlFactory = new OLControlFactory();
  $.each(ol_config.controls, function(name, def) {
    var control = controlFactory.createControl(def, projection_25833);
    control && map.addControl(control);
  });
}