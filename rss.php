<?php
require_once 'config/urls.php';
require_once 'php/frontend_dao.php';
header("Content-Type: text/xml; charset=utf-8");
echo '<?xml version="1.0" encoding="utf-8" ?>';
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss">
  <channel>
    <title>Klarschiff: Meldungen</title>
    <atom:link href="<?php echo FRONTEND_URL, 'rss.php'; ?>" rel="self" type="application/rss+xml" />
    <link><?php echo FRONTEND_URL; ?></link>
    <description>Meldungen im Bürgerbeteiligungsportal Klarschiff</description>
    <language>de-de</language>
    <copyright>Universitäts- und Hansestadt Greifswald</copyright>
    <image>
    <url><?php echo FRONTEND_URL, 'images/rss.png'; ?></url>
    <title>Klarschiff: Meldungen</title>
    <link><?php echo FRONTEND_URL; ?></link>
    </image>
    <?php
    $frontend = new FrontendDAO();
    foreach ($frontend->rss() as $rss) {
      $title = "#" . $rss['id'] . " " . ucfirst($rss['typ']) . " (" . $rss['hauptkategorie'] . " – " . $rss['unterkategorie'] . ")";
      $status = preg_replace('/([A-Z])/', ' $0', $rss['status']);

      if ($rss['betreff_vorhanden'] == 't' && $rss['betreff_freigegeben'] == 't' && $rss['betreff'] != '') {
        $betreff = $rss['betreff'];
      } else if ($status == 'offen' && $rss['betreff_vorhanden'] == 't' && $rss['betreff_freigegeben'] == 'f') {
        $betreff = "<i>redaktionelle Prüfung ausstehend</i>";
      } else if ($status != 'offen' && $rss['betreff_vorhanden'] == 't' && $rss['betreff_freigegeben'] == 'f') {
        $betreff = "<i>redaktionell nicht freigegeben</i>";
      } else {
        $betreff = "<i>nicht vorhanden</i>";
      }

      if ($rss['details_vorhanden'] == 't' && $rss['details_freigegeben'] == 't' && $rss['details'] != '') {
        $details = $rss['details'];
      } else if ($status == 'offen' && $rss['details_vorhanden'] == 't' && $rss['details_freigegeben'] == 'f') {
        $details = "<i>redaktionelle Prüfung ausstehend</i>";
      } else if ($status != 'offen' && $rss['details_vorhanden'] == 't' && $rss['details_freigegeben'] == 'f') {
        $details = "<i>redaktionell nicht freigegeben</i>";
      } else {
        $details = "<i>nicht vorhanden</i>";
      }
      if ($rss['foto_vorhanden'] == 't' && $rss['foto_freigegeben'] == 't') {
        $foto = "<br/><img src='" . BASE_URL . "fotos/ks_" . $rss['id'] . "_thumb.jpg' alt='ks_" . $rss['id'] . "_thumb'>";
      } else if ($status == 'offen' && $rss['foto_vorhanden'] == 't' && $rss['foto_freigegeben'] == 'f') {
        $foto = "<i>redaktionelle Prüfung ausstehend</i>";
      } else if ($status != 'offen' && $rss['foto_vorhanden'] == 't' && $rss['foto_freigegeben'] == 'f') {
        $foto = "<i>redaktionell nicht freigegeben</i>";
      } else {
        $foto = "<i>nicht vorhanden</i>";
      }

      $bemerkung = $rss['bemerkung'] != '' ? $rss['bemerkung'] : "<i>nicht vorhanden</i>";
      $unterstuetzungen = $rss['unterstuetzungen'] > 0 ? $rss['unterstuetzungen'] : "<i>bisher keine</i>";
      $link = htmlentities(strip_tags(MAP_URL . "?advice=" . $rss['id']), ENT_QUOTES);
      $date = date('D, d M Y H:i:s O', strtotime($rss['datum']));
      ?>
      <item>
        <title><?php echo $title; ?></title>
        <description>
          <![CDATA[
          <b>Status:</b> <?php echo $status; ?><br/>
          <b>Unterstützungen:</b> <?php echo $unterstuetzungen; ?><br/>
          <b>Betreff:</b> <?php echo $betreff; ?><br/>
          <b>Details:</b> <?php echo $details; ?><br/>
          <b>Foto:</b> <?php echo $foto; ?><br/>
          <b>Info der Verwaltung:</b> <?php echo $bemerkung; ?><br/>
          <a href="<?php echo $link; ?>" target="_blank">Meldung in Klarschiff ansehen</a>
          ]]>
        </description>
        <link><?php echo $link; ?></link>
        <guid><?php echo $link; ?></guid>
        <pubDate><?php echo $date; ?></pubDate>
        <georss:point><?php echo $rss['y'], " ", $rss['x']; ?></georss:point>
      </item>
      <?php
    }
    ?>
  </channel>
</rss>
