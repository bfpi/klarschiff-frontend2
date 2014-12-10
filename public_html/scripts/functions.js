
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

function getControlByTitle(title) {
  var controls = map.getControls();
  for (var i = 0; i < controls.getLength(); i++) {
    var tmp = controls.item(i);
    if(tmp.values_ != undefined) {
      if (tmp.get("title") == title) {
        return tmp;
      }
    }
  }
  return null;
}