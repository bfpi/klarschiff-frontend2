showFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").show();
}

showFlaecheActionBtns = function() {
  $("button.flaecheAction").show();
}

hideFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").unbind("click").hide();
}

function onRssStartSelect() {
  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(onRssStopSelect);

  var layer = map.getLayer(ol_config.layers["GeoRSS-Polygone"].id);
  var control = map.getControl(ol_config.controls["SelectPolygon"].id);

  //	onRssStopNeueFlaeche();
  $("#flaeche_apply").unbind("click").click(function() {
    onRssSelect(control.layer.selectedFeatures);
  });

  layer.setVisibility(true);
  control.activate();

  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      onRssStopSelect();
      event.preventDefault();
    }
  });
}

function onRssStadtgebiet() {
  hideFlaecheActionBtns();
  beobachtungsflaechenDialog(-1, null, "thematische Eingrenzung", null);
  showFlaecheActionBtns();
}

// Hide and show buttons for Beobachtungsflaeche.
function hideFlaecheActionBtns(buttonID) {
  $("button.flaecheAction").hide();
  $("button.flaecheAction").removeClass("ui-state-focus");
  if (buttonID) {
    $("button#" + buttonID).show();
  }
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

/**
 * Event-Handler (jQuery), wird nach dem Klick auf "Neue Fläche erstellen"
 * ausgeführt. Aktiviert das DrawFeature-Control und ändert den Mauszeiger auf
 * "Fadenkreuz".
 * @param event Klick-Event, unbenutzt.
 * @returns null
 */
function onRssStartNeueFlaeche(event) {
  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(onRssStopNeueFlaeche);

  var control = map.getControl(ol_config.controls["DrawBeobachtungsflaeche"].id);
  var mapDiv = $(map.div);

  //	console.info(control);

  $("#flaeche_apply").click(function() {
    control.handler.finishGeometry();
    //		console.info(control.layer.features);
  });

  //	onRssStopSelect();

  control.activate();
  mapDiv.css('cursor', 'crosshair');

  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      onRssStopNeueFlaeche();
      event.preventDefault();
    }
  });
}

function onRssStopSelect() {
  showFlaecheActionBtns();
  hideFlaecheCtrlBtns();
  var layer = map.getLayer(ol_config.layers["GeoRSS-Polygone"].id);
  var control = map.getControl(ol_config.controls["SelectPolygon"].id);

  layer.setVisibility(false);
  control.unselectAll();
  control.deactivate();

  $(document).unbind('.rss');
}

/**
 * Event-Handler (OpenLayers), wird beim Verschieben eines Features im 
 * SketchMeldung-Layer vor dem Verschieben ausgeführt.
 * @param feature
 * @param pixel
 * @returns null
 */
function onNeueMeldungDragStart(feature, pixel) {
  if (feature.popup) {
    feature.popup.hide();
  }
}

/**
 * Event-Handler (OpenLayers), wird beim Verschieben eines Features im 
 * SketchMeldung-Layer nach dem Verschieben ausgeführt.
 * @param feature
 * @param pixel
 * @returns null
 */
function onNeueMeldungDragComplete(feature, pixel) {
  if (feature.popup) {
    feature.popup.lonlat = feature.geometry;
    feature.popup.updatePosition();
    feature.popup.show();
  }
}

/**
 * Event-Handler (OpenLayers), wird nach Fertigstellen des Features aufgerufen.
 * Ändert Karten-Cursor auf auto zurück und zeigt Dialog zur thematischen
 * Eingrenzung an. Dem Dialog wird keine Feature-Id, sondern das neue Feature
 * übergeben, so dass dieser weiß, dass es sich um ein neues Feature handelt.
 * @param feature OpenLayers.Feature
 * @returns null
 */
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