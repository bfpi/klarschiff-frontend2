<form id="rss-abo">
  <input type="hidden" name="id" value="${id}"/>
  <input type="hidden" name="geom" value="${geom}"/>
  <div class="row">
    <?php
    if ($config['functions']['report_problem'] == true) {
      ?>
      <div id="problem" class="col-md-6">
        <h4>Probleme</h4>
        <div>
          <div name="problem_kategorie" class="scroll-checkbox"></div>
          <div class="checkbox">
            <label class="all">
              <input type="checkbox" name="problem_alle" value="1"/>
              alle Probleme
            </label>
          </div>
        </div>
      </div>
      <?php
    }
    if ($config['functions']['report_idea'] == true) {
      ?>
      <div id="idee" class="col-md-6">
        <h4>Ideen</h4>
        <div>
          <div name="idee_kategorie" class="scroll-checkbox"></div>
          <div class="checkbox">
            <label class="all">
              <input type="checkbox" name="idee_alle" value="1"/>
              alle Ideen
            </label>
          </div>
        </div>
      </div>
      <?php
    }
    ?>
  </div>
</form>
