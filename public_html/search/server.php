<?php

//namespace Klarschiff;

require_once dirname(__FILE__) . "/conf/config.php";
require_once dirname(__FILE__) . "/Search.php";

$search = new Search($solrConf);

$result = $search->find(
    isset($_GET["searchtext"]) ? $_GET["searchtext"] : "*"
);

$jsonObj = isset($_GET["backend"]) && strtolower($_GET["backend"]) === 'true';

$resultJson = $jsonObj ? array("result" => "", "array" => array()) : array("result" => "");

function generateHtml($href, $name, $type, $title)
{
    return
        '<div class="resultElement">&nbsp;
            <a href="' . $href . '" name="' . $name . '" class="gotoBBOX">' . $title . '</a><span>' . $type . '</span>
        </div>';
}

function generateJson($bbox_array, $type, $title)
{
    return array(
        "label" => $title,
        "bbox" => $bbox_array
//        ,'type' => $type
    );
}

foreach ($result->documents as $doc) {
    $data = json_decode($doc->json, true);
    $type = strtolower($data["type"]);

    $bbox_array = array();
    if (substr($data['geom'], 0, 3) == "BOX") {
        foreach (explode(",", substr($data['geom'], 4, -1)) AS $i) {
            foreach (explode(" ", $i) AS $j) {
                $bbox_array[] = $j;
            }
        }
    }
    if ($type === "ort")
        $title = $data['ortsname'];
    elseif ($type === "ortsteil")
        $title = $data['ortsteilname'];
    elseif ($type === "straße")
        $title = $data['strassenname'];
    elseif ($type === "adresse")
        $title = $data["strassenname"] . " " . $data["hausnummer"] . " " . $data["hausnummerzusatz"];
    elseif ($type === "poi")
        $title = $data['title'];
    else
        $title = "";

    if ($jsonObj) {
        $resultJson["result"] .= generateHtml(
            'javascript:map.zoomToExtent(new OpenLayers.Bounds(' . implode(",", $bbox_array) . '));',
            implode(",", $bbox_array), $data["type"], $title);
        $resultJson["array"][] = generateJson($bbox_array, $data["type"], $title);
    } else {
        $resultJson["result"] .= generateHtml(
            URL . '&BBOX=' . $data['geom'], implode(",", $bbox_array), $data["type"], $title);
    }
}

header('Content-Type: application/json');
echo json_encode($resultJson);
