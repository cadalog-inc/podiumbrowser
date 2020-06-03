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

function getLicenseId($key) {    
    $url = 'https://api.keygen.sh/v1/accounts/5c8527e9-edad-4ee6-8240-2c2b7ec16415/licenses/' . $key;
    
    $data_string = json_encode($data);  
    
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);                                             
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $headers = [
        'Content-Type: application/vnd.api+json',
        'Accept: application/vnd.api+json',
        'Authorization: Bearer prod-c7d6796f33d445a4fb707cc6cdaf6c168981bd46d49518fb96709c29c1709e0bd6bd7d91c05b86852d655a10f77fc45c16357176cffd70b33d7922a0dd65f2v2'
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec ($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close ($ch);

    $license = json_decode($response);

    return (object)array(
        "statusCode" => $statusCode,
        "body" => $license
    );
}

function activate($key, $fingerprint) {    
    $license = getLicenseId($key);

    if($license->statusCode == 200) {
        $url = 'https://api.keygen.sh/v1/accounts/5c8527e9-edad-4ee6-8240-2c2b7ec16415/machines/';
        
        $body = json_encode([
            'data' => [
                'type' => 'machines',
                'attributes' => ['fingerprint' => $fingerprint],
                'relationships' => [
                    'license' => [
                    'data' => ['type' => 'licenses', 'id' => $license->body->data->id]
                    ]
                ]
            ]
        ]);
        
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $headers = [
            'Content-Type: application/vnd.api+json',
            'Accept: application/vnd.api+json',
            'Authorization: Bearer prod-c7d6796f33d445a4fb707cc6cdaf6c168981bd46d49518fb96709c29c1709e0bd6bd7d91c05b86852d655a10f77fc45c16357176cffd70b33d7922a0dd65f2v2'
        ];
        
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        $response = curl_exec ($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close ($ch);
        
        $machine = json_decode($response);

        if($statusCode == 201) {
            return (object) array(
                "key" => $key,
                "fingerprint" => $fingerprint,
                "id" => $machine->data->id,
                "expiry" => $license->body->data->attributes->expiry
            );
        } else {
            return (object)array(
                "statusCode" => $statusCode,
                "body" => json_decode($response)
            );
        }
    } else {
        return $license;
    }
}

print(json_encode(activate($_GET["key"] ?: '', $_GET["fingerprint"] ?: '')));

?>