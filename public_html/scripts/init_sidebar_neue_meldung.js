/**
 * Event-Handler (jQuery), wird aufgerufen, wenn der Link zum Eintragen einer
 * neuen Meldung auf der Karte geklickt wird. Das Control zum abgreifen eines
 * neuen Kartenpunktes wird aktiviert und ruft als Event-Handler onNeueMeldung2
 * beim Click in die Karte auf.
 * @param event
 * @returns null
 */
function onNeueMeldung(event) {
  var dragControl = getControlByTitle("DragFeature");
  var targetLayer = getLayerByTitle("SketchMeldung");
  var targetId = $(event.currentTarget).attr('id');
  var mapDiv = $("#" + map.getTarget());

  // Alte Meldungen entfernen
  clearMeldungSketch();

  // Mittelpunkt der Karte ermitteln.
  var position = map.getCoordinateFromPixel([mapDiv.width() / 2, mapDiv.height() / 2]);

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(position),
  });

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      anchor: [15, 50],
      src: "images/icons/" + targetId + "_gemeldet_s.png"
    }))
  });

  targetLayer.setStyle(iconStyle);

  var source = targetLayer.getSource();
  source.addFeature(feature);

  var featureOverlay = new ol.FeatureOverlay({
    map: map,
    style: iconStyle
  });

  var highlight;
  var displayFeatureInfo = function(pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      return feature;
    });

    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.addFeature(feature);
        popup.setPosition(feature.getGeometry().flatCoordinates);
      }
      highlight = feature;
    }
  };

  $(map.getViewport()).on('mousemove', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);

  });

  var modify = new ol.interaction.Modify({
    features: featureOverlay.getFeatures(),
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) &&
              ol.events.condition.singleClick(event);
    },
    style: new ol.style.Style({
      stroke: null,
      fill: null
    })
  });
  map.addInteraction(modify);

  var element = document.getElementById('popup');
  var popup = new ol.Overlay({
    element: element,
    positioning: 'top-right',
    stopEvent: false
  });
  map.addOverlay(popup);
  popup.setPosition(position);

  var popupHeading = (targetId == "problem" ? "Problem" : "Idee") + " melden";
  
  $(element).popover({
    placement: 'auto',
    html: true,
    title: popupHeading,
    content: '<div class="buttons"><a href="#" id="details">beschreiben</a><a href="#" id="verwerfen">abbrechen</a></div>'
  });
  $(element).popover('show');

  $("a#details").button().click(function() {
    var dlg = $('<div></div>')
            .html('Bitte warten, die Koordinaten der neuen Meldung werden gerade geprüft…')
            .dialog({
      title: 'Koordinatenprüfung',
      modal: true,
      closeOnEscape: false,
      open: function(event, ui) {
        $(this).find(".ui-dialog-titlebar-close").hide();
      },
      close: function(event, ui) {
        $(this).dialog('destroy').remove();
      }
    });

    var show_message = function(msg) {
      dlg.html(msg);
      dlg.dialog('option', 'buttons', {
        schließen: function() {
          $(this).dialog('close');
        }
      });
    }

    $.ajax({
      url: '../php/point_check.php',
      data: {
        point: feature.getGeometry().flatCoordinates.toString()
      },
      context: this,
      success: function(data) {
        if (data.length > 0) {
          // Probleme!
          var messages = data.split('#');
          var message = messages[2];
          show_message(message);
        } else {
          // Keine Probleme
          dlg.dialog('close');
          openMeldungDialog(feature, targetId, dragControl);
        }
      },
      error: function() {
        show_message('Es trat ein allgemeiner Fehler auf.');
      }
    });
  });
  $("a#verwerfen").button().click(function() {
    clearMeldungSketch();
    $(element).popover('destroy');
  });
}

/**
 * Löscht alle Meldungen im Sketch-Layer
 */
function clearMeldungSketch() {
  var layer = getLayerByTitle("SketchMeldung");
  var features = layer.getSource().getFeatures();
  for (var i in features) {
    var feature = features[i];
    if (feature.popup) {
      feature.popup.destroy();
      feature.popup = null;
    }
    layer.getSource().removeFeature(feature);
  }
}

function openMeldungDialog(feature, targetId, dragControl) {
  console.log(feature);
  var title = (feature.data.vorgangstyp == "idee" ? "Idee" : "Problem") + " beschreiben";
  var attribs = {
    typ: targetId,
    point: feature.geometry.toString()
  }
  var dlg = $('#meldung_edit');
  $('#template_meldung_edit')
  .tmpl(attribs)
  .appendTo(dlg);

  var insertOptions = function(target, parent) {
    var t = $('select[name="' + target + '"]');
    if (!t)
      return;
    t.empty();

    var kategorien = getKategorien(parent, feature.data.vorgangstyp);
    $.each(kategorien, function(key, val) {
      $('<option></option>')
      .attr('value', key)
      .html(val)
      .appendTo(t);
    });

    return t;
  };

  $('<option></option>')
  .attr('value', 0)
  .html("auswählen…")
  .appendTo($('select[name="unterkategorie"]'));

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $.Placeholder.init();

  $(".betreff-pflicht, .details-pflicht, .pflicht-fussnote").css("visibility", "hidden");
  $('input[name="betreff"], textarea[name="details"], input[name="email"]').focus(function() {
    $(this).css({"color":"#000000"}); 
  }).blur(function() {
  });
  $("select[name='unterkategorie']").change(function() {
    var kategorie_id = $(this).val();
    var kategorie = ks_lut.kategorie[kategorie_id];

    if (!kategorie) {
      $(".betreff-pflicht, .details-pflicht, .pflicht-fussnote").css("visibility", "hidden");
      $('input[name="betreff"]').attr("placeholder", "");
      if ($('input[name="betreff"]').val() == placeholder_betreff) {
        $('input[name="betreff"]').val("");
      }

      $('textarea[name="details"]').attr("placeholder", "");
      if ($('textarea[name="details"]').val() == placeholder_details) {
        $('textarea[name="details"]').val("");
      }
      $.Placeholder.init();
      return;
    }

    if (kategorie.naehere_beschreibung_notwendig) {
      // unset labels that might have been set by kategorie.auffiorderung
      // then set them again 
      switch (kategorie.naehere_beschreibung_notwendig) {
        case "betreff":
          $(".details-pflicht").css("visibility", "hidden");
          $(".betreff-pflicht, .pflicht-fussnote").css("visibility", "visible");
          $('input[name="betreff"]').attr("placeholder", placeholder_betreff);
          $('textarea[name="details"]').attr("placeholder", "");
          if ($('textarea[name="details"]').val() == placeholder_details) {
            $('textarea[name="details"]').val("");
          }
          $.Placeholder.init();
          break;

        case "details":
          $(".betreff-pflicht").css("visibility", "hidden");
          $(".details-pflicht, .pflicht-fussnote").css("visibility", "visible");
          $('input[name="betreff"]').attr("placeholder", "");
          if ($('input[name="betreff"]').val() == placeholder_betreff) {
            $('input[name="betreff"]').val("");
          }
          $('textarea[name="details"]').attr("placeholder", placeholder_details);
          $.Placeholder.init();
          break;

        case "betreffUndDetails":
          $(".betreff-pflicht, .details-pflicht, .pflicht-fussnote").css("visibility", "visible");
          $('input[name="betreff"]').attr("placeholder", placeholder_betreff);
          $('textarea[name="details"]').attr("placeholder", placeholder_details);
          $.Placeholder.init();
          break;

        default:
          $(".betreff-pflicht, .details-pflicht, .pflicht-fussnote").css("visibility", "hidden");
          $('input[name="betreff"]').attr("placeholder", "");
          if ($('input[name="betreff"]').val() == placeholder_betreff) {
            $('input[name="betreff"]').val("");
          }
          $('textarea[name="details"]').attr("placeholder", "");
          if ($('textarea[name="details"]').val() == placeholder_details) {
            $('textarea[name="details"]').val("");
          }
          $.Placeholder.init();

      }
    }

  });
  insertOptions("hauptkategorie").change(function(e) {
    insertOptions("unterkategorie", e.currentTarget.value);
    $("select[name='unterkategorie']").change();

  });

  // Popup entfernen
  feature.popup.destroy();
  feature.popup = null;

  // Dialog Titel geben und öffnen
  if (typeof dlg.data('oHeight') !== 'undefined') {
    dlg.dialog('option', 'height', dlg.data('oHeight'));
  }
  dlg.dialog('option', 'title', title)
  .dialog('option', 'width', dlg.data('oWidth'))
  .dialog("open")
  .data('oHeight', dlg.dialog('option', 'height'));
  // URL aus dem Textfeld entfernen
  if ($("#meldung_edit form textarea").val() == window.location) {
    $("#meldung_edit form textarea").val("");
  }
  dragControl.deactivate();
  unhideFeatureUnderDialog(feature, dlg);
}