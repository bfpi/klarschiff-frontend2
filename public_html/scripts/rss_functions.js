
showFlaecheActionBtns = function() {
  $("button.flaecheAction").show();
}

hideFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").unbind("click").hide();
}


/**
 * Event-Handler (OpenLayers), wird beim Verschieben eines Features im 
 * SketchMeldung-Layer vor dem Verschieben ausgeführt.
 * @param feature
 * @param pixel
 * @returns null
function onNeueMeldungDragStart(feature, pixel) {
  if (feature.popup) {
    feature.popup.hide();
  }
}
 */

/**
 * Event-Handler (OpenLayers), wird beim Verschieben eines Features im 
 * SketchMeldung-Layer nach dem Verschieben ausgeführt.
 * @param feature
 * @param pixel
 * @returns null
function onNeueMeldungDragComplete(feature, pixel) {
  if (feature.popup) {
    feature.popup.lonlat = feature.geometry;
    feature.popup.updatePosition();
    feature.popup.show();
  }
}
 */

/**
 * Event-Handler (OpenLayers), wird nach Fertigstellen des Features aufgerufen.
 * Ändert Karten-Cursor auf auto zurück und zeigt Dialog zur thematischen
 * Eingrenzung an. Dem Dialog wird keine Feature-Id, sondern das neue Feature
 * übergeben, so dass dieser weiß, dass es sich um ein neues Feature handelt.
 * @param feature OpenLayers.Feature
 * @returns null
function onRssNeueFlaeche(feature) {
  beobachtungsflaechenDialog(null, feature);
  onRssStopNeueFlaeche();
}

function onRssStopNeueFlaeche() {
  showFlaecheActionBtns();
  hideFlaecheCtrlBtns();

  var control = map.getControl(mb_ol_config.controls["DrawBeobachtungsflaeche"].id);
  var mapDiv = $(map.div);

  control.deactivate();
  mapDiv.css('cursor', 'auto');

  $(document).unbind('.rss');
}
*/