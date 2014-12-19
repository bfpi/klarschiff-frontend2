
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
