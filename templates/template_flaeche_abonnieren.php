<form id="rss_abo">
  <input type="hidden" name="id" value="${id}"/>
  <input type="hidden" name="geom" value="${geom}"/>

  <?php
  if ($config['functions']['report_problem'] == true) {
  ?>
  <div id="problem" style="width:48%;margin-right:2%">
    <h4 style="margin-bottom:5px;margin-top:2px">Probleme</h4>
    <div>
      <div name="problem_kategorie" class="scrollCheckbox" style="border-bottom:1px solid #999999;margin-bottom:6px">
      </div>
      <input type="checkbox" name="problem_alle" value="1" style="margin-bottom:0"/>
      <label style="font-style:italic;font-weight:bold;font-size:0.8em">alle Probleme</label>
    </div>
  </div>
  <?php
  }
  if ($config['functions']['report_idea'] == true) {
  ?>
  <div id="idee" style="width:48%;margin-right:2%">
    <h4 style="margin-bottom:5px;margin-top:2px">Ideen</h4>
    <div>
      <div name="idee_kategorie" class="scrollCheckbox" style="border-bottom:1px solid #999999;margin-bottom:6px">
      </div>
      <input type="checkbox" name="idee_alle" value="1" style="margin-bottom:0"/>
      <label style="font-style:italic;font-weight:bold;font-size:0.8em">alle Ideen</label>
    </div>
  </div>
  <?php
  }
  ?>
</form>