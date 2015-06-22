<?php

require_once 'urls.php';
return array(
  'database' => include('database.php'),
  'labels' => array(
    'sidebar_headline' => '<img id="logopc" src="' . FRONTEND_URL . 'images/klarschiff_hgw_328px.png" alt="Klarschiff.HGW"/>',
    'errors' => array(
      'db_unavailable' => 'Datenbank ist nicht erreichbar.',
      'ausserhalb_des_bereichs' => 'Die neue Meldung befindet sich außerhalb Greifswalds.',
      'mail_on_blacklist' => 'Ihre E-Mail-Adresse wird nicht akzeptiert, da sie auf unserer Trashmail-Blacklist steht.'
    )
  ),
  'functions' => array(
    'report_idea' => false,
    'report_problem' => true
  ),
  'thresholds' => array(
    'supporter' => 20
  ),
  'links' => array(
    'help_and_impressing' => array(
      array(
        'label' => 'Hilfe',
        'url' => FRONTEND_URL . 'hilfe.html'
      ),
      array(
        'label' => 'Datenschutz',
        'url' => FRONTEND_URL . 'datenschutz.html'
      ),
      array(
        'label' => 'Impressum',
        'url' => FRONTEND_URL . 'impressum.html'
      ),
      array(
        'label' => 'Nutzungsbedingungen',
        'url' => FRONTEND_URL . 'nutzungsbedingungen.html'
      )
    )
  )
);
