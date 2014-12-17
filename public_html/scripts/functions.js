
function getLayerByTitle(title) {
  var layers = map.getLayers();
  for (var i = 0; i < layers.getLength(); i++) {
    var tmp = layers.item(i);
    if (tmp.get("title") == title) {
      return tmp;
    }
  }
  return null;
}

function getUrlParam(name) {
  var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  return results[1] || 0;
}

function meldungenStyles(features) {
  size = features.get("features").length;
  if (size == 1) {
    feature = features.get("features")[0];
    features.setStyle(new ol.style.Style({
      image: new ol.style.Icon(({
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        anchor: [4, 42],
        src: "images/icons/" + feature.get("vorgangstyp") + "_" + feature.get("status") + ".png"
      }))
    }));
  } else {
    features.setStyle(new ol.style.Style({
      image: new ol.style.Icon(({
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        anchor: [22, 22],
        src: "images/icons/generalisiert.png"
      })),
      text: new ol.style.Text({
        text: size.toString(),
        font: "bold 20px Verdana",
        fill: new ol.style.Fill({
          color: '#000000'
        })
      })
    }));
  }
}

function moveMapToShowFeature(feature, dlg) {
  featureOffset = map.getPixelFromCoordinate(feature.getGeometry().flatCoordinates);

  var viertel = ($(map.getViewport()).width() - dlg.width()) / 4;
  new_top = featureOffset[1];
  new_left = featureOffset[0] + viertel + (dlg.width() / 2);

  var new_position = map.getCoordinateFromPixel(Array(new_left, new_top));
  map.getView().setCenter(new_position);
}