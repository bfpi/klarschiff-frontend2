/* init_ks_lut.js.php */
<?php
require_once dirname(__FILE__) . '/../php/frontend_dao.php';
$frontend = new FrontendDAO();

$lut = array(
  'kategorie' => $frontend->categories(),
  'typ' => $frontend->types(),
  'status' => $frontend->statuses()
);

foreach ($lut["kategorie"] as $key => $val) {
  $parent = $val["parent"];
  if ($parent) {
    $childcount = $lut["kategorie"][$parent]["childcount"];
    $lut["kategorie"][$parent]["childcount"] = $childcount + 1;
  }
}
?>
var ks_lut = <?php echo json_encode($lut); ?>;