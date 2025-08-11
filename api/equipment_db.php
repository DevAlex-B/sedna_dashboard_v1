<?php
function getEquipmentDbConnection() {
  $host = getenv('EQUIP_DB_HOST') ?: 'dw.digirockinnovations.com';
  $user = getenv('EQUIP_DB_USER') ?: 'alex';
  $pass = getenv('EQUIP_DB_PASS') ?: 'yHf7jK@3Lm!1';
  $name = getenv('EQUIP_DB_NAME') ?: 'sedna';
  $conn = new mysqli($host, $user, $pass, $name);
  if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
  }
  return $conn;
}
