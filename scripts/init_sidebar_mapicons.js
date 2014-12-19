function init_mapicons() {
  // mapicons
  var mapicons = $('#mapicons');
  var kol = $('<ol></ol>');
  for (var id in mapicons_config) {
    var checkbox = $('<input/>')
            .attr('type', 'checkbox')
            .attr('name', id);
    if (mapicons_config[id].checked) {
      checkbox.attr('checked', 'checked');
    }

    var div = $('<div></div>').attr('id', id);
    div.append(checkbox)
            .append($('<label></label>')
            .attr('for', id)
            .html(mapicons_config[id].label));
    $.each(mapicons_config[id].icons, function(key, val) {
      div.append($("<img/>").attr("src", "images/icons/" + val));
    });
    kol.append(div);
  }

  var generalisiert = $('<div></div>').attr('id', 'generalisiert');
  generalisiert.append($('<label></label>').html('zusammengefasste Meldungen'));
  generalisiert.append($("<img/>").attr("src", "images/icons/generalisiert_layer.png"));
  kol.append(generalisiert);
  $('input', kol).click(function() {
    buildFilter();
  });
  mapicons.append(kol);
}

/**
 * Baut Gesamtfilter aus Filterfragmenten für WFS-Layer.
 * Die Filterfragmente werden mit OR verbunden und als neuer Filter
 * der Filterstrategie gesetzt.
 * @returns null
 */
var filter = null;
function buildFilter() {
  // Alle angehakten Teilfilter abholen...
  var cbs = $('#mapicons input');
  var filters = {};
  cbs.each(function() {
    var self = $(this);
    if (self.is(':checked')) {
      var id = self.attr('name');
      var filter = mapicons_config[id].filter;
      if (filters[filter.vorgangstyp] === undefined) {
        filters[filter.vorgangstyp] = [];
      }
      if (Array.isArray(filter.status)) {
        filter.status.forEach(function(status) {
          filters[filter.vorgangstyp].push(status);
        })
      } else {
        filters[filter.vorgangstyp].push(filter.status);
      }
    }
  });

  condition = [];
  Object.keys(filters).forEach(function(key) {
    var values = jQuery.unique(filters[key]);
    status_cond = []
    if (values.length > 0) {
      values.forEach(function(status) {
        status_cond.push("status='" + status + "'");
      })
    }
    condition.push("(vorgangstyp='" + key + "' and (" + status_cond.join(" or ") + "))")
  })

  var layer = getLayerByTitle("Meldungen");
  map.removeLayer(layer);

  var layerFactory = new OLLayerFactory();
  layer_config = Object.create(ol_config.layers['Meldungen']);
  if (condition.length > 0) {
    layer_config.url += "&cql_filter=" + condition.join(" or ")
  }
  map.addLayer(layerFactory.createVectorLayer(layer_config, projection_25833));
}