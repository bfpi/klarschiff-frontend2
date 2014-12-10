/**
 * Erstellt aus einer Mapbender-Control-Definition
 * ein OpenLayers Control-Objekt.
 */
OLControlFactory = function() {
  /**
   * Erzeugt eine SelectFeature-Control.
   */
  this.createSelectFeatureControl = function(def) {
    return new ol.interaction.Select({
      title: def.title,
      condition: ol.events.condition.click
    });

    
//    var layer = getLayerByTitle(def.layer);
//    return new OpenLayers.Control.SelectFeature(layer, def.options);
  },

  /**
   * Erzeugt eine DragFeature-Control.
   */
  this.createDragFeatureControl = function(def) {
    var layer = getLayerByTitle(def.layer);
    return new OpenLayers.Control.DragFeature(layer, def.options);
  },

  /**
   * Erzeugt eine DrawFeature-Control.
   */
  this.createDrawFeatureControl = function(def) {
    var layer = getLayerByTitle(def.layer);
    return new OpenLayers.Control.DrawFeature(layer, def.handler, def.options);
  },

  /**
   * Erzeugt eine ScaleLine-Control
   */
  this.createScaleLineControl = function(def) {
    return new OpenLayers.Control.ScaleLine(def.options);
  },

  /**
   * Erzeugt ein Scale-Control
   */
  this.createScaleControl = function(def) {
    return new OpenLayers.Control.Scale(def.options);
  },

  this.createAttributionControl = function(def) {
    return new ol.control.Attribution();
  }

  /**
   * Eigentliche Fabrikfunktion.
   */
  this.createControl = function(def) {
    var funcName = "create" + def.type + "Control";
    if(typeof(this[funcName]) == 'function') {
      return this[funcName].apply(this, [def]);
    } else {
      console.error("Can not create control of type " + def.type);
      return null;
    }
  };
};