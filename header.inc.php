<?php 
require_once 'config/urls.php';
$config = include('config/config.php');
?>
<div id="header" class="row clearfix">
  <img id="headerimage" src="images/header.png" height="120" width="998" alt="Klarschiff.SN" />
</div>
<div id="menu" class="row">
  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header pull-left">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <img alt="Brand" src="images/klarschiff.png">
        </button>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <?php
          foreach ($config['nav'] as $nav) {
            echo '<li><a href="', $nav['url'], '">', $nav['label'], '</a></li>';
          }
          ?>
        </ul>
      </div>
    </div>
  </nav>
</div>
