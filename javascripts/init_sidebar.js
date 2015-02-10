function init_sidebar() {
  init_sidebarToggle();
  init_layerSwitcher();
  KS.Search.init();
  init_gotoBBOX();
  init_checkAll();
  init_mapicons();

  $('#back_to_start').button()
  $('#beobachtungsflaechen button').button();
  $('#sonderseiten a').button();

  $('#flaeche_stadtgebiet').click(beobachtungsflaecheStadtgebiet);
  $('#flaeche_stadtteil').click(beobachtungsflaecheStartSelect);
  $('#flaeche_neu').click(beobachtungsflaecheStartNeueFlaeche);

  // Accordion bauen
  $('#widgets').accordion({
    collapsible: true,
    autoHeight: false,
    heightStyle: "content"
  });

  $('#melden a').on("click", onNeueMeldung);
}

function init_sidebarToggle() {
  var toggle = $('#sidebar_toggle');
  toggle.click(function() {
    var sidebar = $(this).parent();
    var tw = $(this).width();
    var sw = sidebar.width();
    if (sidebar.hasClass("sidebar-open")) {
      sidebar.animate({
        "margin-right": -(sw - tw)
      });
      sidebar.toggleClass("sidebar-open sidebar-closed");
    } else {
      sidebar.animate({
        "margin-right": 0
      });
      sidebar.toggleClass("sidebar-open sidebar-closed");
    }
  });
}

function init_layerSwitcher() {

  var target = $('#layerswitcher');
  var buttonset = $('<div></div>').addClass('buttonset');

  var layers = map.getLayers();
  for (var i = 0; i < layers.getLength(); i++) {
    var layer = layers.item(i);
    if (layer != null && layer.getProperties().displayInLayerSwitcher) {
      buttonset.append($('<input/>')
              .attr('type', 'radio')
              .attr('id', 'bl_' + i)
              .attr('name', 'baselayer')
              .attr('value', i)
              .attr('checked', layer.getVisible()));
      buttonset.append($('<label></label>')
              .attr('id', 'bl_' + i)
              .attr('for', 'bl_' + i)
              .html(layer.get('title'))
              .click(function(elem) {
        var checkedLayer = $(this).attr('id').slice(3);
        var layers = map.getLayers().getArray();
        for (i = 0; i < layers.length; ++i) {
          if (layers[i].getProperties().displayInLayerSwitcher) {
            layers[i].setVisible(i == checkedLayer);
          }
        }
      }));
    }
  }
  buttonset.buttonset();
  target.append(buttonset);
}

function init_gotoBBOX() {
  $("#standortsuche").on("click", "a.gotoBBOX", function() {
    var bboxString = $(this).attr("name");
    fitViewportToBBox(bboxString.split(","));
    return false;
  });
}

function init_checkAll() {
  $(document).on("click", "input[name='idee_alle']", function() {
    if ($(this).prop("checked")) {
      $("div[name='idee_kategorie'] input").each(function() {
        $(this).prop("checked", true);
      });
    } else {
      $("div[name='idee_kategorie'] input").each(function() {
        $(this).prop("checked", false);
      });
    }
  })

  $(document).on("click", "input[name='problem_alle']", function() {
    if ($(this).prop("checked")) {
      $("div[name='problem_kategorie'] input").each(function() {
        $(this).prop("checked", true);
      });
    } else {
      $("div[name='problem_kategorie'] input").each(function() {
        $(this).prop("checked", false);
      });
    }
  })
}
