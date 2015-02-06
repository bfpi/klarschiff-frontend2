jQuery(function($) {
  var mapUrl = 'map.php';

  eyeCatcher();
  initSearch();

  $(document).on('click', 'div#map', function(e) {
    window.location.href = mapUrl;
  });

  $(document).on('click', 'img#rss', function(e) {
    window.open('rss.php');
  });

  $(document).on('click', 'div.issue[data-advice-id]', function(e) {
    window.location.href = mapUrl + '?advice=' + $(e.currentTarget).data('advice-id');
  });
});

function eyeCatcher() {

  var map = new ol.Map({
    target: 'map',
    view: new ol.View({
      projection: projection_25833,
      zoom: 6
    }),
    controls: [],
    interactions: []
  });
  map.getView().setCenter(ol.proj.transform([13.409414, 54.089276], 'EPSG:4326', projection_25833));

  var layerFactory = new OLLayerFactory();
  var base = layerFactory.createLayer(ol_config.layers['Stadtplan'], projection_25833);
  base.setOpacity(0.6);
  map.addLayer(base);
  map.addLayer(layerFactory.createLayer(ol_config.layers['Meldungen'], projection_25833));

  var getNextMeldung = function() {
    $.ajax({
      url: 'php/next_meldung.php',
      cache: false,
      success: function(data) {
        map.getView().setCenter([parseInt(data.x), parseInt(data.y)]);
      }
    });
  };

  getNextMeldung();
  setInterval(getNextMeldung, 6000);
}

function initSearch() {
  KS.Search.init();

  var placeholder = 'Stadtteil, Straße oder Adresse eingeben…';
  var searchField = $("input#searchtext");
  if (checkBrowser('msie')) {
    searchField.attr('value', placeholder);
    searchField.css('color', '#888888');
    searchField.click(function() {
      $('#results-container').css('display', 'none');
      $(this).attr('value', '');
      searchField.css('color', '#000000');
    });
    searchField.focus(function() {
      $('#results-container').css('display', 'none');
      $(this).attr('value', '');
      searchField.css('color', '#000000');
    });
  }
  else {
    searchField.focus();
    searchField.attr('placeholder', placeholder);
  }
}
