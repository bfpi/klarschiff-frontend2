function init_sidebar() {
  init_sidebarToggle();
  init_layerSwitcher();
  init_homeButton();
  init_adresssuche();
  init_gotoBBOX();
  init_checkAll();

  $('#beobachtungsflaechen button').button();
  $('#sonderseiten button').button();

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

function init_homeButton() {
  // Button für die Rückkehr zur Startseite
  var target = $('#back_to_start');
  target.append($('<a></a>').attr('href', window.location.protocol + "//" + window.location.host));
  var button = $('<div></div>').addClass('button');
  button.append($('<span></span>').html('Startseite'));
  button.button();
  $('#back_to_start a').append(button);
}

var results;
var searchField;
function init_adresssuche() {
  results = $("div.results");
  searchField = $("input#searchtext");

  searchField.on("keyup", function() {
    if ($(this).val().length >= 3) {
      var searchText = searchField.val();
      $.ajax({
        url: 'search/server.php',
        dataType: 'json',
        data: {
          searchtext: searchText
        },
        success: function(data) {
          results.children().remove();
          results.append(data.result);
          results.fadeIn();
        }
      });
    } else {
      results.children().remove();
      results.fadeOut();
    }
  })

  $(".resultElement").on("click", function() {
    results.fadeOut();
  });
}

function init_gotoBBOX() {
  $("#standortsuche").on("click", "a.gotoBBOX", function() {
    var bboxString = $(this).attr("name");
    var bboxArray = bboxString.split(",");

    try {
      if (bboxArray.length == 4) {
        var view = map.getView();

        if (bboxArray[0] == bboxArray[2]) {
          // PUNKT
          view.setCenter([parseFloat(bboxArray[0]), parseFloat(bboxArray[1])]);
          view.setZoom(9.5);
        } else {
          // POLYGON
          for (i = 0; i < bboxArray.length; i++) {
            bboxArray[i] = parseFloat(bboxArray[i]);
          }
          view.fitExtent(bboxArray, map.getSize());
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
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