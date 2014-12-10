
function beobachtungsflaecheStadtgebiet() {
  hideFlaecheActionBtns();
  beobachtungsflaechenDialog(-1, null, "thematische Eingrenzung", null);
  showFlaecheActionBtns();
}

function beobachtungsflaecheStartSelect() {
  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(beobachtungsflaecheStopSelect);

  var layer = getLayerByTitle("SketchBeobachtungsflaeche");
  var control = getControlByTitle("SelectPolygon");

  console.log("layer: " + layer);
  console.log("control: " + control);

  //	beobachtungsflaecheStopNeueFlaeche();
  $("#flaeche_apply").unbind("click").click(function() {
    beobachtungsflaecheSelect(control.layer.selectedFeatures);
  });

  layer.setVisible(true);
  var featureOverlay = new ol.FeatureOverlay({
    map: map,
    style: ol_styles.beobachtungsflaeche_hover
  });

  var highlight;
  var displayFeatureInfo = function(pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      return feature;
    });

    if (feature) {
      console.log(feature.getId() + ': ' + feature.get('bezeichnung'));
    }

    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.addFeature(feature);
      }
      highlight = feature;
    }

  };

  //  $(map.getViewport()).on('mousemove', function(evt) {
  //    var pixel = map.getEventPixel(evt.originalEvent);
  //    displayFeatureInfo(pixel);
  //  });

  map.on('click', function(evt) {
    displayFeatureInfo(evt.pixel);
  });

  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      beobachtungsflaecheStopSelect();
      event.preventDefault();
    }
  });
}

/**
 * Event-Handler (jQuery), wird nach dem Klick auf "Neue Fläche erstellen"
 * ausgeführt. Aktiviert das DrawFeature-Control und ändert den Mauszeiger auf
 * "Fadenkreuz".
 * @param event Klick-Event, unbenutzt.
 * @returns null
 */
function beobachtungsflaecheStartNeueFlaeche(event) {
  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(beobachtungsflaecheStopNeueFlaeche);

  var control = map.getControl(ol_config.controls["DrawBeobachtungsflaeche"].id);
  var mapDiv = $(map.div);

  //	console.info(control);

  $("#flaeche_apply").click(function() {
    control.handler.finishGeometry();
    //		console.info(control.layer.features);
  });

  beobachtungsflaecheStopSelect();

  control.activate();
  mapDiv.css('cursor', 'crosshair');

  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      beobachtungsflaecheStopNeueFlaeche();
      event.preventDefault();
    }
  });
}

// Hide and show buttons for Beobachtungsflaeche.
function hideFlaecheActionBtns(buttonID) {
  $("button.flaecheAction").hide();
  $("button.flaecheAction").removeClass("ui-state-focus");
  if (buttonID) {
    $("button#" + buttonID).show();
  }
}

showFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").show();
}

function beobachtungsflaecheStopSelect() {
  showFlaecheActionBtns();
  hideFlaecheCtrlBtns();
  var layer = getLayerByTitle("SketchBeobachtungsflaeche");
  var control = getControlByTitle("SelectPolygon");;

  layer.setVisible(false);
  control.unselectAll();
  control.deactivate();

  $(document).unbind('.rss');
}

/**
 * Erstellt Dialog zur thematischen Eingrenzung einer Beobachtungsfläche. Zur
 * Unterscheidung zwischen vorhandenen und neuen Flächen dient die Nutzung 
 * einer id für vorhandene Flächen oder eines Features für eine neue Fläche.
 * @param id int
 * @param feature OpenLayers.Feature
 * @param name
 * @param geom_string Polygon as string
 * @returns null
 */
function beobachtungsflaechenDialog(id, feature, name, geom_string) {
  var titel = (id ? name : "thematische Eingrenzung");
  var dlg = $('<div></div>')
          .attr('id', 'beobachtungsflaechen_dialog')
          .attr('title', titel);

  $('#template_flaeche_abonnieren')
          .tmpl()
          .appendTo(dlg);

  $.each(["problem", "idee"], function(key, typ) {
    var target = $('div[name="' + typ + '_kategorie"]', dlg);
    $.each(ks_lut.kategorie, function(kategorie_id, kategorie) {
      if (!kategorie.parent && kategorie.typ == typ) {
        var nobr = $('<nobr>');
        $('<input>')
                .attr("name", typ + "_kategorie[" + kategorie_id + "]") // kategorie.name
                .attr("type", "checkbox")
                .val(kategorie_id)
                .appendTo(nobr);
        $('<label></label>').html(" " + kategorie.name).appendTo(nobr);
        nobr.appendTo(target);
        $('<br>').appendTo(target);
      }
    });
  });

  dlg.dialog({
    modal: true,
    width: 500,
    close: function() {
      if (feature)
        feature.destroy();
    },
    open: function() {
      var $btn_beobachten = dlg.siblings(".ui-dialog-buttonpane").find(":button:").first();
      if (dlg.find(" :checked").size() == 0) {
        $btn_beobachten.attr("disabled", true).addClass("ui-state-disabled");
      } else {
        $btn_beobachten.attr("disabled", false).removeClass("ui-state-disabled");
      }
      dlg.find(":checkbox").bind("change", function() {
        if (dlg.find(" :checked").size() == 0) {
          $btn_beobachten.attr("disabled", true).addClass("ui-state-disabled");
        } else {
          $btn_beobachten.attr("disabled", false).removeClass("ui-state-disabled");
        }
      });
    },
    buttons: {
      "beobachten": function() {
        var problem_kat_arr = [];
        var idee_kat_arr = [];
        var geom_as_text = null;

        $("div[name='problem_kategorie'] input:checked", dlg).each(function() {
          problem_kat_arr.push($(this).val());
        });

        $("div[name='idee_kategorie'] input:checked", dlg).each(function() {
          idee_kat_arr.push($(this).val());
        });

        if (feature && feature.geometry) {
          geom_as_text = feature.geometry.toString();
        } else if (geom_string) {
          geom_as_text = geom_string;
        }

        $.ajax({
          url: "../pc/frontend/rss_submit.php",
          type: "POST",
          dataType: "json",
          data: {
            id: id,
            geom: geom_as_text,
            //problem: $('input[name="problem"]', dlg).is(':checked') ? true : false,
            //idee: $('input[name="idee"]', dlg).is(':checked') ? true : false,
            problem_kategorie: problem_kat_arr,
            idee_kategorie: idee_kat_arr
          },
          beforeSend: function() {
            //dlg.parent().css("display", "none");
            dlg.dialog("close");
            $('body').spinner({
              title: "GeoRSS-Feed",
              message: "<p>Bitte warten, der GeoRSS-Feed wird gerade erstellt…</p>",
              error: function() {
                //var d = dlg.parent();
                //var display = d.data("olddisplay") ? d.data("olddisplay") : "block";
                //dlg.parent().css("display", display);
                $('body').spinner("destroy");
                dlg.dialog("show");
              },
              success: function() {
                $('body').spinner("destroy");
              },
              timer: 3
            }).spinner("show");
          },
          error: function() {
            $('body').spinner("error");
          },
          success: function(data) {
            var feed_url = "../pc/georss.php?id=" + data.hash;
            var message = "Der GeoRSS-Feed wurde erfolgreich erstellt und ist nun unter folgender Adresse abrufbar: ";
            message += '<a href="' + feed_url + '" target="_blank" style="color:#006CB7;text-decoration:none;">GeoRSS-Feed</a>';
            $('body').spinner("success", message);
            showFlaecheActionBtns();
            hideFlaecheCtrlBtns();
          }
        });
      },
      "abbrechen": function() {
        $(this).dialog("close");
      }
    }
  });
}