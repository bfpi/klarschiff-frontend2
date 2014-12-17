/**
 * Erstellt aus einer Layer-Definition
 * ein OpenLayers Layer-Objekt.
 */
var OLLayerFactory = function() {

  /**
   * Erzeugt einen WMS-Layer.
   */
  this.createWMSLayer = function(def, projection) {
    var layer = new ol.layer.Tile({
      title: def.title,
      extent: def.extent,
      projection: projection,
      source: new ol.source.TileWMS({
        url: def.url,
        params: {
          'LAYERS': def.layers,
          'FORMAT': def.format,
          'VERSION': def.version,
          'SRS': def.projection
        },
        attributions: [
          new ol.Attribution({
            html: def.attribution_text
          })
        ]
      }),
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return layer;
  },
  /**
   * Erzeugt einen Vector-Layer.
   */
  this.createVectorLayer = function(def, projection) {
    var source;
    source = new ol.source.GeoJSON({
      projection: projection,
      url: def.url
    });
    if (def.enableClustering) {
      source = new ol.source.Cluster({
        distance: 40,
        source: Object.create(source)
      });
    }
    var vectorLayer = new ol.layer.Vector({
      title: def.title,
      source: source,
      style: def.style,
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return vectorLayer;
  },
  /**
   * Eigentliche Fabrikfunktion.
   */
  this.createLayer = function(def, projection) {
    var funcName = "create" + def.type + "Layer";
    if (typeof(this[funcName]) === 'function') {
      return this[funcName].apply(this, [def, projection]);
    } else {
      console.error("Can not create layer of type " + def.type);
      return null;
    }
  };
};