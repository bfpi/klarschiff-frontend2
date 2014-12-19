<?php

class FrontendDAO {
  private $connection;

  function __construct() {
    $config = include(dirname(__FILE__) . "/../config/config.php");
    $this->connection = pg_connect(
      "host=". $config['psql']['host'] ." port=". $config['psql']['port']
      ." dbname=". $config['psql']['database']
      ." user=". $config['psql']['username']
      ." password=". $config['psql']['password'] . "");
  }

  function __destruct() {
    pg_close($this->connection);
  }

  function count_new_advices_last_month() {
    pg_prepare('', 
      "SELECT COUNT(id) ".
      "FROM klarschiff.klarschiff_vorgang ".
      "WHERE datum >= (now() - (INTERVAL '1' MONTH)) ".
      "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')");
    $row = pg_fetch_assoc(pg_execute("", array()));
    return $row['count'];
  }

  function count_done_advices_last_month() {
    pg_prepare('', 
      "SELECT COUNT(id) ".
      "FROM klarschiff.klarschiff_vorgang ".
      "WHERE datum_statusaenderung >= (now() - (INTERVAL '1' MONTH)) ".
      "AND status = 'abgeschlossen'");
    $row = pg_fetch_assoc(pg_execute("", array()));
    return $row['count'];
  }

  function count_new_advices_since($since = '2014-12-01') {
    pg_prepare('', 
      "SELECT COUNT(id) ".
      "FROM klarschiff.klarschiff_vorgang ".
      "WHERE datum::DATE >= $1::DATE ".
      "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')");
    $row = pg_fetch_assoc(pg_execute("", array($since)));
    return $row['count'];
  }

  function newest_advices($limit = 5) {
    pg_prepare('', 
      "SELECT v.id, v.vorgangstyp AS type, v.status, hk.name AS category, k.name AS subcategory ".
      "FROM klarschiff.klarschiff_vorgang v ".
      "INNER JOIN klarschiff.klarschiff_kategorie k ON v.kategorieid = k.id ".
      "INNER JOIN klarschiff.klarschiff_kategorie hk ON k.parent = hk.id ".
      "WHERE NOT v.archiviert ".
      "AND v.status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen') ".
      "ORDER BY v.datum DESC ".
      "LIMIT ". $limit);
    $result = pg_execute("", array());
    $advices = array();
    while ($row = pg_fetch_assoc($result)) {
      $advices[] = $row;
    }
    return $advices;
  }
}
?>
