
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