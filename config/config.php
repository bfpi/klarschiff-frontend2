<?php

define("ADRESSSUCHE_URL", "http://klarschiff-test:8080/solr/select?");
define("BACKEND_URL", "http://klarschiff-test/backend/");
define("FRONTEND_URL", "http://klarschiff-test/");

return array(
  'psql' => array(
    'host' => 'klarschiff-test',
    'port' => 5432,
    'username' => 'klarschiff_frontend',
    'password' => 'klarschiff_frontend',
    'database' => 'klarschiff_frontend'
  ),
  'labels' => array(
    'sidebar_headline' => 'DEMO',
    'errors' => array(
      'db_unavailable' => 'Datenbank ist nicht erreichbar.',
      'ausserhalb_des_bereichs' => 'Die neue Meldung befindet sich außerhalb Greifswalds.',
      'mail_on_blacklist' => 'Ihre E-Mail-Adresse wird nicht akzeptiert, da sie auf unserer Trashmail-Blacklist steht.'
    )
  ),
  'minify_js' => false,
  'minify_js_tempfile' => "/tmp/temp_uM0ahzie.js",
  'minify_js_force' => false,
  'functions' => array(
    'report_idea' => false,
    'report_problem' => true
  ),
  'sidebar_links' => array(
    'hilfe_und_impressum' => array(
      array(
        'label' => 'Hilfe',
        'link' => FRONTEND_URL . 'hilfe.html'
      ),
      array(
        'label' => 'Datenschutz',
        'link' => FRONTEND_URL . 'datenschutz.html'
      ),
      array(
        'label' => 'Impressum',
        'link' => FRONTEND_URL . 'impressum.html'
      ),
      array(
        'label' => 'Nutzungsbedingungen',
        'link' => FRONTEND_URL . 'nutzungsbedingungen.html'
      )
    )
  )
);
?>