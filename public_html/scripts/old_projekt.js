
// Start pc/projekt.js

var filter = null;

/**
 * für IE Schriftgröße für Labels der Stadtteile festlegen
 */
function checkBrowser(name) {  
  var agent = navigator.userAgent.toLowerCase();  
  if (agent.indexOf(name.toLowerCase()) > -1) {  
    return true;  
  }
  return false;  
}

/**
 * Baut Gesamtfilter aus Filterfragmenten für WFS-Layer.
 * Die Filterfragmente werden mit OR verbunden und als neuer Filter
 * der Filterstrategie gesetzt.
 * @returns null
 */
var buildFilter = function() {
  var layer = map.getLayer(mb_ol_config.layers["Meldungen"].id);
  // Alle angehakten Teilfilter abholen...
  var cbs = $('#kartenelemente input');
  var filters = [];
  cbs.each(function() {
    var self = $(this);
    if (self.is(':checked')) {
      var id = self.attr('name');
      filters.push(ks_config.filter[id].filter);
    }
  });

  if (!filter) {
    filter = new OpenLayers.Filter.Logical({
      type: OpenLayers.Filter.Logical.OR
    });
    layer.filter = filter;
  }
  filter.filters = filters;

  if (map.getExtent())
    layer.refresh({force: true});
},

preAddMap = function() {
  

  var isIEtenOrEleven = /(msie 10.0|rv:11)/.test(navigator.userAgent.toLowerCase());
  clusterRules = [
    // Rule für Clusteranzeige
    new OpenLayers.Rule({
      filter: new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.GREATER_THAN,
        property: "count",
        value: 1
      }),
      symbolizer: {    		
        externalGraphic: "../pc/media/icons/generalisiert.png",
        graphicWidth: 44,
        graphicHeight: 44,
        graphicXOffset: -22,
        graphicYOffset: -22,
        label: (isIEtenOrEleven ? "܁ \n" : "") +"${count}",
        fontSize: "141%",
        fontWeight: "bold",
        labelAlign: "cm",
        cursor: "pointer",
        graphicTitle: "fasst " + "${count}" + " Meldungen zusammen:\nklicken zum Zoomen,\nin letzter Zoomstufe zum Anzeigen"
      }
    }),
    // Rule für Standardanzeige
    new OpenLayers.Rule({
      elseFilter: true,
      symbolizer: {}
    })
  ];

  var klarschiffDefaultStyle;
  if ($.browser.msie && $.browser.version.search(/^8.+/) > -1) {
    klarschiffDefaultStyle = new OpenLayers.Style({
      graphicWidth: 36,
      graphicHeight: 43,
      graphicXOffset: -4,
      graphicYOffset: -41,
      fontSize: "1.6em",
      fontWeight: "bold",
      externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}.png",
      cursor: "pointer",
      graphicTitle: "Meldung " + "${id}"
    }, {
      rules: clusterRules
    });
  } else if ($.browser.msie && $.browser.version.search(/^9.+/) > -1) {
    klarschiffDefaultStyle = new OpenLayers.Style({
      graphicWidth: 36,
      graphicHeight: 43,
      graphicXOffset: -4,
      graphicYOffset: -41,
      labelYOffset: -10,
      externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}.png",
      cursor: "pointer",
      graphicTitle: "Meldung " + "${id}"
    }, {
      rules: clusterRules
    });
  } else {
    klarschiffDefaultStyle = new OpenLayers.Style({
      graphicWidth: 36,
      graphicHeight: 43,
      graphicXOffset: -4,
      graphicYOffset: -41,
      externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}.png",
      cursor: "pointer",
      graphicTitle: "Meldung " + "${id}"
    }, {
      rules: clusterRules
    });
  }
  mb_ol_styles = {
    rss: new OpenLayers.StyleMap({
      "default": new OpenLayers.Style({
        fontFamily: "Verdana",
        fontSize: "12px",
        fontStyle: "italic",
        fontWeight: "bold",
        fontColor: "#FFEAD7",
        label: "${bezeichnung}",
        labelAlign: "cm",
        fillColor: "#FF8700",
        fillOpacity: 0.5,
        strokeColor: '#FF8700',
        cursor: "pointer"
      }),
      "select": new OpenLayers.Style({
        fontFamily: "Verdana",
        fontSize: "12px",
        fontStyle: "italic",
        fontWeight: "bold",
        fontColor: "#FFD7FF",
        label: "${bezeichnung}",
        labelAlign: "cm",
        fillColor: "#FF00FF",
        fillOpacity: 0.5,
        strokeColor: '#FF8700',
        cursor: "pointer"
      }),
      "temporary": new OpenLayers.Style({
        fillColor: "#FF8700",
        fillOpacity: 0.5,
        strokeColor: '#FF8700',
        cursor: "pointer"
      })
    }),
    klarschiff: new OpenLayers.StyleMap({
      "default": klarschiffDefaultStyle,
      "select": new OpenLayers.Style({
        graphicWidth: 56,
        graphicHeight: 64,
        graphicXOffset: -14,
        graphicYOffset: -51,
        externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}_s.png",
        cursor: "pointer"
      }, {
        rules: clusterRules
      }),
      "temporary": new OpenLayers.Style({
        graphicWidth: 56,
        graphicHeight: 64,
        graphicXOffset: -14,
        graphicYOffset: -51,
        externalGraphic: "../pc/media/icons/${vorgangstyp}_${status}_s.png",
        cursor: "pointer",
        graphicTitle: "neue Meldung"
      })
    })
  };
},

getKategorien = function(parent, typ) {
  var kategorien = {}
  kategorien[0] = "auswählen…";
  for(var i in ks_lut.kategorie) {
    if (ks_lut.kategorie[i].parent == parent) {
      if (parent == undefined && ks_lut.kategorie[i].typ != typ) {
        continue;
      }
      kategorien[i] = ks_lut.kategorie[i].name;
    }
  }
  return kategorien;
},

  /**
   * Event-Handler (OpenLayers), wird bei der Selektion einer Meldung ausgeführt.
   * Zeigt die Meldungsdetails an.
   * @param feature
   * @returns null
   */
onMeldungSelect = function(feature) {
  // Alles abwählen
  var selectControl = map.getControl(mb_ol_config.controls["SelectMeldung"].id);
  selectControl.unselectAll();
  // Variablen für Meldungsattribute und Index beim Blättern
  var attribs;
  var currentIndex;
  if (feature.cluster) {
    // Wenn nicht letzte Zoomstufe, nur zoomen und raus
    if(map.getZoom() < map.getNumZoomLevels() - 1) {
      map.panTo(feature.geometry.getBounds().getCenterLonLat());
      map.zoomIn();
      return;
    }
    currentIndex = 0;
    attribs = feature.cluster[0].data;
  } 
  else {
    attribs = feature.data;
  }
  var dlg = showMeldung($.extend({}, attribs));
  unhideFeatureUnderDialog(feature, dlg);
  if (feature.cluster) {
    enhanceDialogForCluster(dlg, feature.cluster, currentIndex);
  }
},

enhanceDialogForCluster = function(dlg, cluster, currentIndex) {
  dlg.find('#meldung_details_recorder').show().text("Meldung "+ (currentIndex + 1) +" von "+ cluster.length);
  var showClusterMeldung = function(index) {
    var detailsClicked = $('#meldung_details').is(":visible");
    var dlg = showMeldung($.extend({}, cluster[index].data));
    enhanceDialogForCluster(dlg, cluster, currentIndex);
    if(detailsClicked) $('#meldung_details_show').click();
  }
  if(currentIndex > 0) {
    dlg.find('#meldung_details_prev').show().button().click(function() {
      showClusterMeldung(--currentIndex);
    });
  }
  else {
    dlg.find('#meldung_details_prev').show().button({ disabled: true });
  }
  if(currentIndex < cluster.length - 1) {
    dlg.find('#meldung_details_next').show().button().click(function() {
      showClusterMeldung(++currentIndex);
    });
  }
  else {
    dlg.find('#meldung_details_next').show().button({ disabled: true });
  }
},

showMeldung = function(attribs) {
  var schwellenwert = typeof ks_config.schwellenwert !== 'undefined' ?
    ks_config.schwellenwert : 20;
  var img = '<img id="meldung_details_icon" src="../pc/media/icons/'+
    attribs.vorgangstyp +'_'+ attribs.status +'_layer.png"></img>';

  var title = img + (attribs.vorgangstyp == 'idee'? "Idee" : "Problem") +
    " (Meldung " + attribs.id + " – " + attribs.datum_erstellt + ") " +
    "<a class='directlink' title='Permalink auf Meldung " + attribs.id + 
    "' href='" + Mapbender.loginUrl + "?mb_user_myGui=Klarschiff&" +
    "name=public&password=public&meldung=" + attribs.id + "'>LINK</a>";
  //attribs.unterstuetzer = Math.round(5+(Math.random()*(10)));
  attribs.schwellenwert = schwellenwert;

  if (ks_lut.kategorie[attribs.kategorieid].parent) {
    attribs.unterkategorie = ks_lut.kategorie[attribs.kategorieid].name;
    var hk = ks_lut.kategorie[attribs.kategorieid].parent;
    attribs.hauptkategorie = ks_lut.kategorie[hk].name;
  } else {
    attribs.hauptkategorie = ks_lut.kategorie[attribs.kategorieid].name;
    attribs.unterkategorie = "auswählen…";
  }
  attribs.status_id = attribs.status;
  attribs.status = ks_lut.status[attribs.status_id].name;
  var dlg = $('#meldung_show').empty()
  .removeClass('idee')
  .removeClass('problem')
  .addClass(attribs.vorgangstyp);

  $('#template_meldung_show')
  .tmpl(attribs)
  .appendTo(dlg);

  var schwellenwertClass = "unter-schwellenwert";
  if (parseInt(attribs.unterstuetzer) >= schwellenwert) {
    schwellenwertClass = "ueber-schwellenwert";
  }
  dlg.find('span.meldung_unterstuetzer').addClass(schwellenwertClass);

  $('#meldung_details').hide();
  dlg.addClass("teaser");
  $('#meldung_details_show').button({
    icons: {
      secondary: 'ui-icon-circle-triangle-s'
    }
  }).click(function() { meldungDetailsClick(dlg) });
  // auf Fall prüfen, in dem die Buttons deaktiviert werden sollen
  if (attribs.status_id == 'gemeldet')
    var buttonsDeaktivieren = true;

  // je nach Fall Deaktivierungen durchführen und/oder weitere Dialoge aufbauen
  if (buttonsDeaktivieren) {
    $('#meldung_actions').buttonset().buttonset('enable');
    $('#meldung_unterstuetzen').button('option', 'disabled', true);
    $('#meldung_melden').button('option', 'disabled', true);
    $('#meldung_lobenhinweisenkritisieren').button('option', 'disabled', true);
  }
  else {
    $('#meldung_actions').buttonset().buttonset('enable');
    $('#meldung_unterstuetzen').click(meldungSupportDialog);
    $('#meldung_melden').click(meldungAbuseDialog);
    $('#meldung_lobenhinweisenkritisieren').click(meldungLobHinweiseKritikDialog);
  }

  // Dialog Titel geben und öffnen
  dlg.dialog('option', 'title', title)
  .dialog('option', 'height', 'auto')
  .dialog('option', 'width', dlg.data('oWidth'))
  .dialog("open");
  return dlg;
},

meldungDetailsClick = function(dlg) {
  var self = $(this);
  var contentHeight = dlg.css('height', 'auto').height();
  var outerHeight = dlg.parent().height();
  var extraHeight = outerHeight - contentHeight;
  $('#meldung_details').toggle();
  dlg.toggleClass("teaser");
  //Trigger resize
  contentHeight = dlg.css('height', 'auto').height();
  dlg.dialog('option', 'height', Math.min($('body').height() - 20 - extraHeight, contentHeight + extraHeight));

  if (dlg.parent().offset().top + dlg.parent().height() > $('body').height()) {
    dlg.dialog('option', 'position', {
      my: 'top',
      at: 'top',
      of: $('body'),
      offset: '0 10'});
  }
  $('.ui-button-icon-secondary')
  .toggleClass("ui-icon-circle-triangle-s")
  .toggleClass("ui-icon-circle-triangle-n");
  var label = self.find('.ui-button-text');
  if (label.html() == "Details") {
    label.html("keine Details");
  } else {
    label.html("Details");
  }
};

  /**
   * Setzt Unterstützungsmeldung an Server ab.
   * @returns null
   */
meldungSupportDialog = function() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();
  showDlg.dialog("close");

  var dlg = $('<div></div>')
  .attr("id", 'meldung_support')
  .append($('#template_meldung_support').tmpl({id: id, email: email}))
  .dialog({
    title: "Meldung unterstützen",
    width: 400,
    buttons: {
      "unterstützen": meldungSupportSubmit,
      "abbrechen": function() {
        $(this).remove();
        showDlg.dialog('open');
      }
    },
    close: function(evt, ui) {
      $(this).dialog('destroy').remove();
      onMeldungShowClose({originalEvent: true});
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $.Placeholder.init();
},

meldungSupportSubmit = function() {
  var dlg = $('#meldung_support');
  var id = $('input[name="id"]').val();
  var email = $('input[name="email"]', dlg).val();

  // clientseitige Validierung
  var filter = /^\S+@\S+\.[A-Za-z]{2,6}$/;
  if (!email || email === placeholder_email) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailLeer");
    return;
  }
  else if (!filter.test(email)) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailFalsch");
    return;
  }
  else $('input[name="email"]', dlg).removeClass("error");

  dlg.dialog('option', 'buttons', {});
  dlg.html('Bitte warten, die Unterstützungsmeldung wird gerade abgesetzt…');
  dlg.dialog('option', 'title', 'Unterstützungsmeldung');
  onMeldungShowClose({originalEvent: true});
  $.ajax({
    url: "../pc/frontend/meldung_support.php",
    type: "post",
    data: {
      id: id,
      email: email
    },
    complete: function(jqXHR, status) {
      dlg.empty();
      response = jqXHR.responseText;
      var message = "Die Unterstützungsmeldung wurde erfolgreich abgesetzt. Sie erhalten in Kürze eine E-Mail, in der Sie Ihre Unterstützungsmeldung noch einmal bestätigen müssen.";
      if (response.length > 0) {
        var messages = response.split('#');
        message = messages[2];
      }
      dlg.html(message);
      dlg.dialog('option', 'buttons', {
        schließen: function() {
          $(this).dialog('close');
        }
      });
    }
  });
},


  /**
   * Zeigt Dialog für Missbrauchsmeldung
   */
meldungAbuseDialog = function() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();	
  showDlg.dialog("close");

  var dlg = $('<div></div>')
  .attr("id", 'meldung_abuse')
  .append($('#template_meldung_abuse').tmpl({id: id, email: email}))
  .dialog({
    title: "Missbrauch melden",
    width: 400,
    buttons: {
      "melden": meldungAbuseSubmit,
      "abbrechen": function() {
        $(this).remove();
        showDlg.dialog('open');
      }
    },
    close: function(evt, ui) {
      $(this).dialog('destroy').remove();
      onMeldungShowClose({originalEvent: true});
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $('textarea[name="details"]').attr("placeholder", placeholder_begruendung);
  $.Placeholder.init();
},

  /**
   * Setzt Missbrauchsmeldung ab.
   */
meldungAbuseSubmit = function() {
  var dlg = $('#meldung_abuse');
  var id = $('input[name="id"]', dlg).val();
  var email = $('input[name="email"]', dlg).val();
  var details = $('textarea[name="details"]', dlg).val();

  // clientseitige Validierung
  var filter = /^\S+@\S+\.[A-Za-z]{2,6}$/;                                                                 
  if (!email || email === placeholder_email) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailLeer");
    return;
  }
  else if (!filter.test(email)) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailFalsch");
    return;
  }
  else $('input[name="email"]', dlg).removeClass("error");
  if (!details || details === placeholder_begruendung) {
    $('textarea[name="details"]', dlg).addClass("error");
    eingabeFehlerPopup("begruendungLeer");
    return;
  }
  else $('textarea[name="details"]', dlg).removeClass("error");

  dlg.dialog('option', 'buttons', {});
  dlg.html('Bitte warten, die Missbrauchsmeldung wird gerade abgesetzt…');
  dlg.dialog('option', 'title', 'Missbrauchsmeldung');
  onMeldungShowClose({originalEvent: true});
  $.ajax({
    url: "../pc/frontend/meldung_abuse.php",
    type: "post",
    data: {
      id: id,
      email: email,
      details: details
    },
    complete: function(jqXHR, status) {
      dlg.empty();
      response = jqXHR.responseText;
      var message = "Die Missbrauchsmeldung wurde erfolgreich abgesetzt. Sie erhalten in Kürze eine E-Mail, in der Sie Ihre Missbrauchsmeldung noch einmal bestätigen müssen.";
      if (response.length > 0) {
        var messages = response.split('#');
        message = messages[2];
      }
      dlg.html(message);
      dlg.dialog('option', 'buttons', {
        schließen: function() {
          $(this).dialog('close');
        }
      });	
    }
  });
},

  /**
   * Zeigt Dialog für Lob, Hinweise oder Kritik zu einer Meldung
   */
meldungLobHinweiseKritikDialog = function() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();
  var zustaendigkeit = $('input[name="zustaendigkeit"]').val();
  showDlg.dialog("close");

  var dlg = $('<div></div>')
  .attr("id", 'meldung_lobhinweisekritik')
  .append($('#template_meldung_lobhinweisekritik').tmpl({id: id, email: email, zustaendigkeit: zustaendigkeit}))
  .dialog({
    title: "Lob, Hinweise oder Kritik zur Meldung",
    width: 400,
    buttons: {
      "senden": meldungLobHinweiseKritikSubmit,
      "abbrechen": function() {
        $(this).remove();
        showDlg.dialog('open');
      }
    },
    close: function(evt, ui) {
      $(this).dialog('destroy').remove();
      onMeldungShowClose({originalEvent: true});
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $('textarea[name="freitext"]').attr("placeholder", placeholder_freitext);
  $.Placeholder.init();
},

  /**
   * Setzt Lob, Hinweise oder Kritik zu einer Meldung ab.
   */
meldungLobHinweiseKritikSubmit = function() {
  var dlg = $('#meldung_lobhinweisekritik');
  var id = $('input[name="id"]', dlg).val();
  var email = $('input[name="email"]', dlg).val();
  var freitext = $('textarea[name="freitext"]', dlg).val();

  // clientseitige Validierung
  var filter = /^\S+@\S+\.[A-Za-z]{2,6}$/;
  if (!email || email === placeholder_email) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailLeer");
    return;
  }
  else if (!filter.test(email)) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailFalsch");
    return;
  }
  else $('input[name="email"]', dlg).removeClass("error");
  if (!freitext || freitext === placeholder_freitext) {
    $('textarea[name="freitext"]', dlg).addClass("error");
    eingabeFehlerPopup("freitextLeer");
    return;
  }

  dlg.dialog('option', 'buttons', {});
  dlg.html('Bitte warten, Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung wird/werden gerade abgesetzt…');
  dlg.dialog('option', 'title', 'Lob, Hinweise oder Kritik');
  onMeldungShowClose({originalEvent: true});
  $.ajax({
    url: "../pc/frontend/meldung_lobhinweisekritik.php",
    type: "post",
    data: {
      id: id,
      email: email,
      freitext: freitext
    },
    complete: function(jqXHR, status) {
      dlg.empty();
      response = jqXHR.responseText;
      var message = "Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung wurde(n) erfolgreich abgesetzt und dem genannten Empfänger zugestellt.";
      if (response.length > 0) {
        var messages = response.split('#');
        message = messages[2];
      }
      dlg.html(message);
      dlg.dialog('option', 'buttons', {
        schließen: function() {
          $(this).dialog('close');
        }
      });	
    }
  });
},



  

  /**
   * Event-Handler (jQuery), wird beim Schließen des Meldungs-Dialogs
   * ausgeführt. Entfernt die Dialoginhalte - diese werden beim Öffnen
   * des Dialogs jedes mal neu aufgebaut - und deselektiert das zugehörige
   * Feature.
   * @returns null
   */
onMeldungShowClose = function(event) {
  if (event.originalEvent) {
    // Dialog leeren
    $('#meldung_show').empty();

    // Feature abwählen
    var selectControl = map.getControl(mb_ol_config.controls["SelectMeldung"].id);
    selectControl.unselectAll();
  }
},

onRssSelect = function(features) {
  //beobachtungsflaechenDialog(feature.data.id, null, feature.data.name);
  var IDs = "";
  for(var i=0; i<features.length; i++) {
    var idString = features[i].fid;
    if (idString.indexOf(".")!=-1) {
      IDs += "," + idString.substring(idString.indexOf(".")+1);
    }
  }

  hideFlaecheActionBtns();
  beobachtungsflaechenDialog(IDs, null, "thematische Eingrenzung", null);
  onRssStopSelect();
},

prepareProject = function(mapElement) {


  // Event-Handler für SelectControl
  var selectControl = map.getControl(mb_ol_config.controls["SelectMeldung"].id);
  selectControl.onSelect = onMeldungSelect;

  // Baselayerauswahl
  var target = $('#map_toggle');
  var buttonset = $('<div></div>').addClass('buttonset');

  for(var i in map.layers) {
    var layer = map.layers[i];		
    if (layer.isBaseLayer && layer.displayInLayerSwitcher) {
      buttonset.append($('<input/>')
                       .attr('type', 'radio')
                       .attr('id', 'bl_' + layer.id)
                       .attr('name', 'baselayer')
                       .attr('checked', (layer == map.baseLayer ? true : false))
                       .click(function() {
                         // TODO: Change-Layer-Events von OpenLayers.Map abfangen.
                         var id = $(this).attr('id').slice(3);
                         var layer = map.getLayer(id);
                         if (layer.name == 'Luftbild') {
                           map.getLayersByName("POI")[0].setVisibility(false);
                         }
                         else {
                           map.getLayersByName("POI")[0].setVisibility(true);
                         }
                         map.setBaseLayer(layer);
                       }));
                       buttonset.append($('<label></label>')
                                        .attr('for', 'bl_' + layer.id)
                                        .html(layer.name));			
    }		
  }
  buttonset.buttonset();
  target.append(buttonset);

  // Button für die Rückkehr zur Startseite
  var target = $('#back_to_start');
  target.append($('<a></a>').attr('href', window.location.protocol +"//"+ window.location.host));
  var button = $('<div></div>').addClass('button');
  button.append($('<span></span>').html('Startseite'));
  button.button();
  $('#back_to_start a').append(button);

  // Vorbereitung für Accordion
  var w = $('#widgets');
  $("> div", w).each(function() {
    var self = $(this),
    title = self.attr('title'),
    h = $('<h3></h3>')
    .append($('<a></a>')
            .html(title))
            .appendTo(w);
            self.addClass('cnt')
            .appendTo(w);
  });

  /*********************************/

  // Standortsuche
  $('#standortsuche button')
  .button({
    icons: {primary: 'ui-icon-search'},
    text: false
  })
  .click(function() {
    var standort = $.trim($('#standortsuche input[type="text"]').val());
    if (standort != "") {
      //TODO: Fehlermeldung anzeigen, falls notwendig
      $.ajax({
        url: "server/location.php",
        data: {standort: standort},
        dataType: 'json',
        type: 'POST',
        success: zoomToPosition
      });
    }
  });

  $('#flaeche_action').hide();

  // Neue Fläche
  

  // Kartenelemente
  var kartenelemente = $('#kartenelemente');
  var kol = $('<ol></ol>');
  for(var id in ks_config.filter) {
    var checkbox = $('<input/>')
    .attr('type', 'checkbox')
    .attr('name', id);
    if (ks_config.filter[id].enabled)
      checkbox.attr('checked', 'checked');			

    var div = $('<div></div>')
    .attr('id', id);
    div.append(checkbox)
    .append($('<label></label>')
            .attr('for',  id)
            .html(ks_config.filter[id].label));
            $.each(ks_config.filter[id].icons, function(key, val) {
              div.append($("<img/>")
                         .attr("src", "../pc/media/icons/" + val));
            });
            kol.append(div);
  }

  var generalisiert = $('<div></div>')
  .attr('id', 'generalisiert');
  generalisiert.append($('<label></label>').html('zusammengefasste Meldungen'));

  generalisiert.append($("<img/>").attr("src", "../pc/media/icons/generalisiert_layer.png"));
  kol.append(generalisiert);

  $('input', kol).click(function() { buildFilter(); });
  kartenelemente.append(kol);

  buildFilter();
  window.setInterval(buildFilter, (ks_config.reload_interval || 30)*1000);

  // Sidebar-Toogle
  var toggle = $('#sidebar_toggle');
  toggle.click(function() {
    var sidebar = $(this).parent();
    var tw = $(this).width();
    var sw = sidebar.width();
    if (sidebar.hasClass("sidebar-open")) {
      sidebar.animate({
        "margin-right": -(sw-tw)
      });
      sidebar.toggleClass("sidebar-open sidebar-closed");
    } else {
      sidebar.animate({
        "margin-right": 0
      });
      sidebar.toggleClass("sidebar-open sidebar-closed");
    }
  });

  // Anzeige einer bestehenden Meldung	
  $('<div></div>')
  .attr('id', 'meldung_show')
  .data('oWidth', 500)
  .dialog({
    autoOpen: false,
    width: 500,
    height: 'auto',
    abeforeclose: onMeldungShowClose
  }).bind('dialogclose', onMeldungShowClose);



};

$(document).ready(function() {
  $("input[name='idee_alle']").live("click", function() {
    if ($(this).attr("checked")) {
      $("div[name='idee_kategorie'] input").each(function() {
        $(this).attr("checked", true);
      });			
    } else {
      $("div[name='idee_kategorie'] input").each(function() {
        $(this).attr("checked", false);
      });
    }
  })

  $("input[name='problem_alle']").live("click", function() {
    if ($(this).attr("checked")) {
      $("div[name='problem_kategorie'] input").each(function() {
        $(this).attr("checked", true);
      });			
    } else {
      $("div[name='problem_kategorie'] input").each(function() {
        $(this).attr("checked", false);
      });
    }
  })

  $("a.gotoBBOX").live("click", function() {
    var bboxString = $(this).attr("name");
    var bboxArray = bboxString.split(",");

    if (bboxArray.length == 4) {
      // PUNKT
      if (bboxArray[0] == bboxArray[2]) {	
        var ll = new OpenLayers.LonLat(parseFloat(bboxArray[0]), parseFloat(bboxArray[1]));
        map.setCenter(ll, 7);
        // POLYGON
      } else {
        var bbox = OpenLayers.Bounds.fromArray(bboxArray);
        var zoom = Math.min(7, map.getZoomForExtent(bbox));
        map.setCenter(bbox.getCenterLonLat(), zoom);
      }
    }
    return false;
  })

});	

// Ende pc/projekt.js
