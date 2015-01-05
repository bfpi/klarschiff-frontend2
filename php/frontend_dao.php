<?php

class FrontendDAO {

  private $conn;

  function __construct() {
    $database = include(dirname(__FILE__) . "/../config/database.php");
    $conn_str = '';
    foreach ($database['frontend'] as $key => $value) {
      $conn_str .= (empty($conn_str) ? '' : ' ') . implode('=', array($key, $value));
    }
    $this->conn = pg_connect($conn_str);
  }

  function __destruct() {
    pg_close($this->conn);
  }

  function count_new_advices_last_month() {
    return pg_fetch_result(
      pg_query($this->conn, "SELECT COUNT(id) " .
        "FROM klarschiff.klarschiff_vorgang " .
        "WHERE datum >= (now() - (INTERVAL '1' MONTH)) " .
        "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')"), 'count');
  }

  function count_done_advices_last_month() {
    return pg_fetch_result(
      pg_query($this->conn, "SELECT COUNT(id) " .
        "FROM klarschiff.klarschiff_vorgang " .
        "WHERE datum_statusaenderung >= (now() - (INTERVAL '1' MONTH)) " .
        "AND status = 'abgeschlossen'"), 'count');
  }

  function count_new_advices_since($since = '2014-12-01') {
    return pg_fetch_result(
      pg_query_params($this->conn, "SELECT COUNT(id) "
        . "FROM klarschiff.klarschiff_vorgang "
        . "WHERE datum::DATE >= $1::DATE "
        . "AND status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen')", array($since)), 'count');
  }

  function newest_advices($limit = 5) {
    return pg_fetch_all(
      pg_query_params($this->conn, "SELECT v.id, v.vorgangstyp AS type, "
        . "v.status, hk.name AS category, k.name AS subcategory "
        . "FROM klarschiff.klarschiff_vorgang v "
        . "INNER JOIN klarschiff.klarschiff_kategorie k ON v.kategorieid = k.id "
        . "INNER JOIN klarschiff.klarschiff_kategorie hk ON k.parent = hk.id "
        . "WHERE NOT v.archiviert "
        . "AND v.status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen') "
        . "ORDER BY v.datum DESC "
        . "LIMIT $1", array($limit)));
  }

  function random_advice_position() {
    return pg_fetch_assoc(
      pg_query($this->conn, "SELECT ST_X(v.the_geom) as x, ST_Y(v.the_geom) as y "
        . "FROM klarschiff.klarschiff_wfs v "
        . "WHERE v.status <> 'gemeldet' "
        . "ORDER BY RANDOM() LIMIT 1"));
  }

  function rss_data($id) {
    $result = array();
    if ($row = pg_fetch_assoc(
      pg_query_params($this->conn, "SELECT g.ideen, g.ideen_kategorien, g.probleme, "
        . "g.probleme_kategorien, ST_AsText(g.the_geom) AS wkt "
        . "FROM klarschiff.klarschiff_geo_rss g "
        . "WHERE md5(g.id::varchar) = $1", array($id)))) {
      $result = $row;
    }
    return $result;
  }

  function rss() {
    return pg_fetch_all(
      pg_query($this->conn, "SELECT v.id, v.datum::timestamp, v.vorgangstyp AS typ, "
        . "v.status, hk.name AS hauptkategorie, uk.name AS unterkategorie, "
        . "v.betreff_vorhanden, v.betreff_freigegeben, v.titel AS betreff, "
        . "v.details_vorhanden, v.details_freigegeben, v.details, v.foto_vorhanden, "
        . "v.foto_freigegeben, v.bemerkung, wfs.unterstuetzer AS unterstuetzungen, "
        . "ST_X(ST_Transform(v.the_geom,4326)) AS x, "
        . "ST_Y(ST_Transform(v.the_geom,4326)) AS y "
        . "FROM klarschiff.klarschiff_vorgang v, klarschiff.klarschiff_kategorie uk, "
        . "klarschiff.klarschiff_kategorie hk, klarschiff.klarschiff_wfs wfs "
        . "WHERE v.archiviert IS NOT TRUE "
        . "AND v.status IN ('offen', 'inBearbeitung', 'wirdNichtBearbeitet', 'abgeschlossen') "
        . "AND v.kategorieid = uk.id AND uk.parent = hk.id AND v.id = wfs.id "
        . "ORDER BY v.datum DESC"));
  }

  function city_boundary() {
    return pg_fetch_result(
      pg_query($this->conn, "SELECT ST_asText(ST_Multi(the_geom)) "
        . "FROM klarschiff.klarschiff_stadtgrenze_hro "
        . "LIMIT 1"), 0);
  }

  function district_boundary($district_ids) {
    return pg_fetch_result(
      pg_query_params($this->conn, "SELECT ST_asText(ST_Multi(ST_MemUnion((the_geom)))) "
        . "FROM klarschiff.klarschiff_stadtteile_hro "
        . "WHERE ogc_fid = ANY($1)", array('{' . implode(', ', $district_ids) . '}')), 0);
  }

  function boundary($geom) {
    return pg_fetch_result(
      pg_query_params($this->conn, "SELECT ST_asText(ST_Multi($1)) AS b", array($geom)), 'b');
  }

  function categories() {
    $res = pg_query($this->conn, "SELECT id, name, parent, vorgangstyp AS typ, aufforderung, "
      . "naehere_beschreibung_notwendig, 0 AS childcount "
      . "FROM klarschiff.klarschiff_kategorie "
      . "ORDER BY name");
    $categories = array();
    while ($row = pg_fetch_assoc($res)) {
      $id = $row['id'];
      unset($row['id']);
      $categories[$id] = $row;
    }
    return $categories;
  }

  function types() {
    $res = pg_query($this->conn, "SELECT id, name, ordinal "
      . "FROM klarschiff.klarschiff_vorgangstyp");
    $types = array();
    while ($row = pg_fetch_assoc($res)) {
      $types[$row['id']] = $row;
    }
    return $types;
  }

  function statuses() {
    $res = pg_query($this->conn, "SELECT id, name, nid "
      . "FROM klarschiff.klarschiff_status");
    $statuses = array();
    while ($row = pg_fetch_assoc($res)) {
      $statuses[$row["id"]] = $row;
    }
    return $statuses;
  }

}
