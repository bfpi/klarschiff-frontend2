function showMeldung(feature) {
  var img = '<img id="meldung_details_icon" src="images/icons/' +
          feature.get("vorgangstyp") + '_' + feature.get("status") + '_layer.png"></img>';

  var title = img + (feature.get("vorgangstyp") == 'idee' ? "Idee" : "Problem") +
          " (Meldung " + feature.get("id") + " – " + feature.get("datum_erstellt") + ") " +
          "<a class='directlink' title='Permalink auf Meldung " + feature.get("id") +
          "' href='" + klarschiff_map + "?advice=" + feature.get("id") + "'>LINK</a>";

  if (ks_lut.kategorie[feature.get("kategorieid")].parent) {
    feature.set("unterkategorie", ks_lut.kategorie[feature.get("kategorieid")].name);
    feature.set("hauptkategorie", ks_lut.kategorie[feature.get("hauptkategorieid")].name);
  } else {
    feature.set("hauptkategorie", ks_lut.kategorie[feature.get("kategorieid")].name);
    feature.set("unterkategorie", "auswählen…");
  }

  var dlg = $('<div></div>')
          .data('oWidth', 500)
          .attr('id', 'meldung_show')
          .dialog({
    autoOpen: false,
    width: 500,
    close: onMeldungShowClose()
  }).addClass(feature.get("vorgangstyp"));

  $('#template_meldung_show')
          .tmpl(feature.values_)
          .appendTo(dlg);

  var schwellenwertClass = "unter-schwellenwert";
  if (parseInt(feature.get("unterstuetzer")) >= unterstuetzer_schwellenwert) {
    schwellenwertClass = "ueber-schwellenwert";
  }
  dlg.find('span.meldung_unterstuetzer').addClass(schwellenwertClass);

  $('#meldung_details').hide();
  dlg.addClass("teaser");
  $('#meldung_details_show').button({
    icons: {
      secondary: 'ui-icon-circle-triangle-s'
    }
  }).click(function() {
    meldungDetailsClick(dlg)
  });
  // auf Fall prüfen, in dem die Buttons deaktiviert werden sollen
  if (feature.get("status_id") == 'gemeldet')
    var buttonsDeaktivieren = true;

  // je nach Fall Deaktivierungen durchführen und/oder weitere Dialoge aufbauen
  if (buttonsDeaktivieren) {
    $('#meldung_actions').buttonset().buttonset('enable');
    $('#meldung_unterstuetzen').button('option', 'disabled', true);
    $('#meldung_melden').button('option', 'disabled', true);
    $('#meldung_lobenhinweisenkritisieren').button('option', 'disabled', true);
  } else {
    $('#meldung_actions').buttonset().buttonset('enable');
    $('#meldung_unterstuetzen').click(meldungSupportDialog);
    $('#meldung_melden').click(meldungAbuseDialog);
    $('#meldung_lobenhinweisenkritisieren').click(meldungLobHinweiseKritikDialog);
  }

  // Dialog Titel geben und öffnen
  dlg.dialog('option', 'height', 'auto')
          .dialog('option', 'width', dlg.data('oWidth'))
          .dialog("open");
  dlg.dialog('widget').find('.ui-dialog-title').html(title);

  moveMapToShowFeature(feature, dlg);
}

/**
 * Event-Handler (jQuery), wird beim Schließen des Meldungs-Dialogs
 * ausgeführt. Entfernt die Dialoginhalte - diese werden beim Öffnen
 * des Dialogs jedes mal neu aufgebaut - und deselektiert das zugehörige
 * Feature.
 * @returns null
 */
function onMeldungShowClose(event) {
  // Dialog leeren
  $('#meldung_show').parent().remove()
}

function meldungDetailsClick(dlg) {
  var self = $(this);
  var contentHeight = dlg.css('height', 'auto').height();
  var outerHeight = dlg.parent().height();
  var extraHeight = outerHeight - contentHeight + 15;
  $('#meldung_details').toggle();
  dlg.toggleClass("teaser");
  //Trigger resize
  contentHeight = dlg.css('height', 'auto').height();

  dlg.dialog('option', 'height', Math.min($('#ol_map').height() - extraHeight, contentHeight + extraHeight));

  if (dlg.parent().offset().top + dlg.parent().height() > $('#ol_map').height()) {
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
}

/**
 * Setzt Unterstützungsmeldung an Server ab.
 * @returns null
 */
function meldungSupportDialog() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();
  showDlg.dialog('destroy').remove();

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
      onMeldungShowClose();
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $.Placeholder.init();
}

/**
 * Zeigt Dialog für Missbrauchsmeldung
 */
function meldungAbuseDialog() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();
  showDlg.dialog('destroy').remove();

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
      onMeldungShowClose();
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $('textarea[name="details"]').attr("placeholder", placeholder_begruendung);
  $.Placeholder.init();
}


/**
 * Zeigt Dialog für Lob, Hinweise oder Kritik zu einer Meldung
 */
function meldungLobHinweiseKritikDialog() {
  var showDlg = $('#meldung_show');
  var id = $('input[name="id"]').val();
  var email = $('input[name="meldung_actions_email"]').val();
  var zustaendigkeit = $('input[name="zustaendigkeit"]').val();
  showDlg.dialog('destroy').remove();

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
      onMeldungShowClose();
    }
  });

  $('input[name="email"]').attr("placeholder", placeholder_email);
  $('textarea[name="freitext"]').attr("placeholder", placeholder_freitext);
  $.Placeholder.init();
}

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
  else
    $('input[name="email"]', dlg).removeClass("error");

  dlg.dialog('option', 'buttons', {});
  dlg.html('Bitte warten, die Unterstützungsmeldung wird gerade abgesetzt…');
  dlg.dialog('option', 'title', 'Unterstützungsmeldung');
  onMeldungShowClose({originalEvent: true});
  $.ajax({
    url: "../php/meldung_support.php",
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
}

/**
 * Setzt Missbrauchsmeldung ab.
 */
function meldungAbuseSubmit() {
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
  else
    $('input[name="email"]', dlg).removeClass("error");
  if (!details || details === placeholder_begruendung) {
    $('textarea[name="details"]', dlg).addClass("error");
    eingabeFehlerPopup("begruendungLeer");
    return;
  }
  else
    $('textarea[name="details"]', dlg).removeClass("error");

  dlg.dialog('option', 'buttons', {});
  dlg.html('Bitte warten, die Missbrauchsmeldung wird gerade abgesetzt…');
  dlg.dialog('option', 'title', 'Missbrauchsmeldung');
  onMeldungShowClose({originalEvent: true});
  $.ajax({
    url: "../php/meldung_abuse.php",
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
}

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
  else
    $('input[name="email"]', dlg).removeClass("error");
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
    url: "../php/meldung_lobhinweisekritik.php",
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
}