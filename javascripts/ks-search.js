var KS = KS || {};
KS.Search = {};
KS.Search.init = function() {
  var results = $("div.results");
  $("input#searchtext").on("keyup", function(e) {
    if ($(this).val().length >= 3) {
      $.ajax({
        url: 'search/server.php',
        dataType: 'json',
        data: {
          searchtext: $(e.currentTarget).val()
        },
        success: function(data) {
          results.children().remove();
          results.append(data.result);
          results.fadeIn();
        }
      });
    } else {
      results.children().remove().end().fadeOut();
    }
  });

  $(".result-element").on("click", function(e) {
    results.fadeOut();
  });
}