<?php

define("ADRESSSUCHE_URL", "http://klarschiff-test:8080/solr/select?");

define("BACKEND_URL", "http://klarschiff-test/backend");

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
  'functions' => array(
    'report_idea' => false,
    'report_problem' => true
  )
);
?>