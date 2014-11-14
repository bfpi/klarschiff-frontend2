/**
 * Erstellt aus einer Layer-Definition
 * ein OpenLayers Layer-Objekt.
 */
var OLLayerFactory = function() {
  /**
   * Erzeugt einen OSM-Tile-Layer.
   */
  this.createOSMLayer = function(def) {
    var layer = new OpenLayers.Layer.OSM(
      def.name,
      def.url,
      {
        projection: def.projection
      }
    );
    return layer;
  },

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
          'SRS': def.projection,
        },
        attributions: [
          new ol.Attribution({
            html: def.attribution_text
          }),
        ],
      }),
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return layer;
//    var layer = new ol.source.TileWMS(
//      def.name,
//      def.url,
//      {
//        layers: def.layers,
//        format: def.format
//      },
//      {
//        transitionEffect: 'resize'
//      }
//    );
//    return layer;
  },

  /**
   * Erzeugt einen Vector-Layer.
   */
  this.createVectorLayer = function(def, projection) {

    var source = new ol.source.Vector();

    var layer = new ol.layer.Vector({
      title: def.title,
      source: source,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return layer;

//    var stdDef = {
//      displayInLayerSwitcher: true,
//      geometryType: null,
//      protocol: {},
//      strategies: {},
//      styleMap: null,
//      version: null,
//      filter: null,
//      visibility: true
//    }
//    var o = $.extend(true, stdDef, def);
//
//    var protocol = null;
//    if(o.protocol.type) {
//      var protocolOptions = o.protocol.options ? o.protocol.options : {};
//      protocol = new OpenLayers.Protocol[o.protocol.type](protocolOptions);
//    }
//
//    var strategies = []
//    for(var i in o.strategies) {
//      strategies.push(new OpenLayers.Strategy[i](o.strategies[i]))
//    }
//    if(ol_styles[o.styleMap])
//      o.styleMap = ol_styles[o.styleMap];
//    else
//      o.styleMap = null;
//
//    var layer = new ol.source.TileVector(
//      def.name,
//      {
//        displayInLayerSwitcher: o.displayInLayerSwitcher,
//        filter: o.filter,
//        geometryType: o.geometryType,
//        protocol: protocol,
//        strategies: strategies,
//        styleMap: o.styleMap,
//        version: o.version,
//        visibility: o.visibility
//      }
//    );
//    return layer;
  },

  /**
   * Eigentliche Fabrikfunktion.
   */
  this.createLayer = function(def, projection) {
    var funcName = "create" + def.type + "Layer";
    if(typeof(this[funcName]) == 'function') {
      return this[funcName].apply(this, [def, projection]);
    } else {
      console.error("Can not create layer of type " + def.type);
      return null;
    }		
  };
}

///**
// * Erstellt aus einer Mapbender-Control-Definition
// * ein OpenLayers Control-Objekt.
// */
//OLControlFactory = function() {
//  /**
//   * Erzeugt eine SelectFeature-Control.
//   */
//  this.createSelectFeatureControl = function(def) {
//    var layer = getLayerByTitle(def.layer);
//    return new OpenLayers.Control.SelectFeature(layer, def.options);
//  },
//
//  /**
//   * Erzeugt eine DragFeature-Control.
//   */
//  this.createDragFeatureControl = function(def) {
//    var layer = getLayerByTitle(def.layer);
//    return new OpenLayers.Control.DragFeature(layer, def.options);
//  },
//
//  /**
//   * Erzeugt eine DrawFeature-Control.
//   */
//  this.createDrawFeatureControl = function(def) {
//    var layer = getLayerByTitle(def.layer);
//    return new OpenLayers.Control.DrawFeature(layer, def.handler, def.options);
//  },
//
//  /**
//   * Erzeugt eine ScaleLine-Control
//   */
//  this.createScaleLineControl = function(def) {
//    return new OpenLayers.Control.ScaleLine(def.options);
//  },
//
//  /**
//   * Erzeugt ein Scale-Control
//   */
//  this.createScaleControl = function(def) {
//    return new OpenLayers.Control.Scale(def.options);
//  },
//
//  this.createAttributionControl = function(def) {
//    return new ol.control.Attribution();
//  }
//
//  /**
//   * Eigentliche Fabrikfunktion.
//   */
//  this.createControl = function(def) {
//    var funcName = "create" + def.type + "Control";
//    if(typeof(this[funcName]) == 'function') {
//      return this[funcName].apply(this, [def]);
//    } else {
//      console.error("Can not create control of type " + def.type);
//      return null;
//    }
//  };
//};
