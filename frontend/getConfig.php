<?php

$config = include('config.php');
$database = include(dirname(__FILE__) . "/../config/database.php");

$connectionString = sprintf("host=%s dbname=%s user=%s password=%s", 
  $database['frontend']['host'], $database['frontend']['dbname'], 
  $database['frontend']['user'], $database['frontend']['password']);
$connection = pg_connect($connectionString);

$conf = array();

$res = pg_query('SELECT * FROM klarschiff.klarschiff_vorgangstyp');
while($row = pg_fetch_assoc($res)) {
  $config['vorgangstyp'][$row['ordinal']] = $row;
}

$res = pg_query('SELECT * FROM klarschiff.klarschiff_status');
while($row = pg_fetch_assoc($res)) {
  $conf['status'][$row['nid']] = $row;
}

$res = pg_query('SELECT * FROM klarschiff.klarschiff_kategorie ORDER BY name');
while($row = pg_fetch_assoc($res)) {
  $conf['kategorie'][$row['id']] = $row;
}
pg_close($connection);

$conf['version'] = '0.1';
$conf['schwellenwert'] = $config['thresholds']['supporter'];
$conf['meldung_template'] = '
<h3 style="margin-left:2%;margin-top:1%;margin-bottom:0.5%">Hauptkategorie</h3>
<p style="margin-left:2%">${hauptkategorie}</p>

<h3 style="margin-left:2%;margin-bottom:0.5%">Unterkategorie</h3>
<p style="margin-left:2%">${unterkategorie}</p>

<h3 style="margin-left:2%;margin-bottom:0.5%">Status</h3>
<p style="margin-left:2%">{{if status != \'wirdNichtBearbeitet\' && status != \'inBearbeitung\'}}${status}{{/if}}{{if status == \'wirdNichtBearbeitet\'}}wird nicht bearbeitet{{/if}}{{if status == \'inBearbeitung\'}}in Bearbeitung{{/if}} (seit ${datum_statusaenderung}), aktuell bei<br/>${zustaendigkeit}</p>

{{if betreff_vorhanden == "true" && betreff_freigegeben == "true"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Betreff</h3>
<p style="margin-left:2%">${titel}</p>
{{else status == \'offen\' && betreff_vorhanden == "true" && betreff_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Betreff</h3>
<p style="margin-left:2%;font-style:italic">redaktionelle Prüfung ausstehend</p>
{{else status != \'offen\' && status != \'gemeldet\' && betreff_vorhanden == "true" && betreff_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Betreff</h3>
<p style="margin-left:2%;font-style:italic">redaktionell nicht freigegeben</p>
{{/if}}

{{if details_vorhanden == "true" && details_freigegeben == "true"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Details</h3>
<p style="margin-left:2%">${details}</p>
{{else status == \'offen\' && details_vorhanden == "true" && details_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Details</h3>
<p style="margin-left:2%;font-style:italic">redaktionelle Prüfung ausstehend</p>
{{else status != \'offen\' && status != \'gemeldet\' && details_vorhanden == "true" && details_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Details</h3>
<p style="margin-left:2%;font-style:italic">redaktionell nicht freigegeben</p>
{{/if}}
  
{{if foto_vorhanden == "true" && foto_freigegeben == "true"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Foto</h3>
<img style="margin-left:2%;margin-right:2%;margin-top:1%" src="${img_url}" />
{{else status == \'offen\' && foto_vorhanden == "true" && foto_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Foto</h3>
<p style="margin-left:2%;font-style:italic">redaktionelle Prüfung ausstehend</p>
{{else status != \'offen\' && status != \'gemeldet\' && foto_vorhanden == "true" && foto_freigegeben == "false"}}
<h3 style="margin-left:2%;margin-bottom:0.5%">Foto</h3>
<p style="margin-left:2%;font-style:italic">redaktionell nicht freigegeben</p>
{{/if}}

{{if bemerkung}}
<div id="bemerkung_eintrag">
<h3 style="margin-left:2%;margin-bottom:0.5%">Info der Verwaltung</h3>
<p style="margin-left:2%">{{html bemerkung}}</p>
{{/if}}
</div>

<div id="supporters">
<p style="margin-left:2%;margin-top:3%;font-style:italic">bisher <span {{if vorgangstyp == \'problem\'}}class="meldung_unterstuetzer_problem"{{/if}}{{if vorgangstyp == \'idee\'}}class="meldung_unterstuetzer"{{/if}}>${unterstuetzer}</span> {{if unterstuetzer != 1}}Unterstützungen{{/if}}{{if unterstuetzer == 1}}Unterstützung{{/if}}{{if vorgangstyp == \'idee\'}} (${schwellenwert} nötig){{/if}}</p>
</div>
';

header('Content-Type: application/json');
echo json_encode($conf);
