<?php

class FrontendDAO {

  private $connection;

  function __construct() {
    $database = include(dirname(__FILE__) . "/../config/database.php");
    $this->connection = pg_connect(
      "host=" . $database['frontend']['host'] . " port=" . $database['frontend']['port']
      . " dbname=" . $database['frontend']['database']
      . " user=" . $database['frontend']['username']
      . " password=" . $database['frontend']['password'] . "");
  }

  function __destruct() {
    pg_close($this->connection);
  }

  function count_new_advices_last_month() {
    $row = pg_fetch_assoc(pg_query($this->connection, "SELECT COUNT(id) " .
        "FROM klarschiff.klarschiff_vorgang " .
        "WHERE datum >= (now() - (INTERVAL '1' MONTH)) " .
        "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')"));
    return $row['count'];
  }

  function count_done_advices_last_month() {
    $row = pg_fetch_assoc(pg_query($this->connection, "SELECT COUNT(id) " .
        "FROM klarschiff.klarschiff_vorgang " .
        "WHERE datum_statusaenderung >= (now() - (INTERVAL '1' MONTH)) " .
        "AND status = 'abgeschlossen'"));
    return $row['count'];
  }

  function count_new_advices_since($since = '2014-12-01') {
    $row = pg_fetch_assoc(
      pg_query_params($this->connection, "SELECT COUNT(id) "
        . "FROM klarschiff.klarschiff_vorgang "
        . "WHERE datum::DATE >= $1::DATE "
        . "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')", array($since)));
    return $row['count'];
  }

  function newest_advices($limit = 5) {
    $result = pg_query_params($this->connection, "SELECT v.id, v.vorgangstyp AS type, "
      . "v.status, hk.name AS category, k.name AS subcategory "
      . "FROM klarschiff.klarschiff_vorgang v "
      . "INNER JOIN klarschiff.klarschiff_kategorie k ON v.kategorieid = k.id "
      . "INNER JOIN klarschiff.klarschiff_kategorie hk ON k.parent = hk.id "
      . "WHERE NOT v.archiviert "
      . "AND v.status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen') "
      . "ORDER BY v.datum DESC "
      . "LIMIT $1", array($limit));
    $advices = array();
    while ($row = pg_fetch_assoc($result)) {
      $advices[] = $row;
    }
    return $advices;
  }

  function random_advice_position() {
    return pg_fetch_assoc(
      pg_query($this->connection, "SELECT ST_X(v.the_geom) as x, ST_Y(v.the_geom) as y "
        . "FROM klarschiff.klarschiff_wfs v "
        . "WHERE v.status <> 'gemeldet' "
        . "ORDER BY RANDOM() LIMIT 1"));
  }

  function rss_data($id) {
    $result = array();
    if ($row = pg_fetch_assoc(
      pg_query_params($this->connection, "SELECT g.ideen, g.ideen_kategorien, g.probleme, "
        . "g.probleme_kategorien, st_astext(g.the_geom) AS wkt "
        . "FROM klarschiff.klarschiff_geo_rss g "
        . "WHERE md5(g.id::varchar) = $1", array($id)))) {
      $result = $row;
    }
    return $result;
  }

}
