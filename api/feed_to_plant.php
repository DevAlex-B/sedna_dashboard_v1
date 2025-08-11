<?php
header('Content-Type: application/json');

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$name = getenv('DB_NAME') ?: 'sedna';

$conn = new mysqli($host, $user, $pass, $name);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$sql = "SELECT Final_Tails_SG, sast_timestamp FROM ewon1 WHERE sast_timestamp BETWEEN ? AND ? ORDER BY sast_timestamp";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $start, $end);
$stmt->execute();
$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = [
    'time' => $row['sast_timestamp'],
    'value' => (float)$row['Final_Tails_SG'] * 1000,
  ];
}
$stmt->close();
$conn->close();

echo json_encode($data);
