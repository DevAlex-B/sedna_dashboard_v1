<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$conn = getEquipmentDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET':
    $result = $conn->query("SELECT id, name, color, coordinates FROM geofences ORDER BY id");
    $data = [];
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    echo json_encode($data);
    break;
  case 'POST':
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    $color = $input['color'] ?? '';
    $coords = $input['coordinates'] ?? '';
    if (!$name || !$color || !$coords) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing fields']);
      break;
    }
    $stmt = $conn->prepare("INSERT INTO geofences (name, color, coordinates, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
    $stmt->bind_param('sss', $name, $color, $coords);
    if ($stmt->execute()) {
      echo json_encode(['id' => $stmt->insert_id]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Failed to save']);
    }
    $stmt->close();
    break;
  case 'DELETE':
    $id = $_GET['id'] ?? null;
    if (!$id) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing id']);
      break;
    }
    $stmt = $conn->prepare("DELETE FROM geofences WHERE id = ?");
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
      echo json_encode(['status' => 'ok']);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Delete failed']);
    }
    $stmt->close();
    break;
  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>
