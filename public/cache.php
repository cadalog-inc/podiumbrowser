<?php 
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 1000');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
    }
    exit(0);
}


$_POST = json_decode(file_get_contents("php://input"),true);

if(isset($_POST['categories']) && isset($_POST['items']) && isset($_POST['relationships'])) {
    $file = dirname(__FILE__).'/categories.json';
    file_put_contents($file, json_encode($_POST['categories']));
    $file = dirname(__FILE__).'/items.json';
    file_put_contents($file, json_encode($_POST['items']));
    $file = dirname(__FILE__).'/relationships.json';
    file_put_contents($file, json_encode($_POST['relationships']));
    print("SUCCESS");
} else {
    print("ERROR");
}

?>