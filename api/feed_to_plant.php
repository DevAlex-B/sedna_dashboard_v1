<?php
header('Content-Type: application/json');

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

$host = getenv('DB_HOST') ?: 'dw.digirockinnovations.com';
$user = getenv('DB_USER') ?: 'alex';
$pass = getenv('DB_PASS') ?: 'yHf7jK@3Lm!1';
$name = getenv('DB_NAME') ?: 'kilken';

$conn = new mysqli($host, $user, $pass, $name);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$conn->query("SET time_zone = 'UTC'");

$sql = "SELECT Final_Tails_SG, CONVERT_TZ(sast_timestamp, 'UTC','Africa/Johannesburg') AS sast_timestamp FROM ewon1 WHERE sast_timestamp BETWEEN CONVERT_TZ(?, 'Africa/Johannesburg', 'UTC') AND CONVERT_TZ(?, 'Africa/Johannesburg', 'UTC') ORDER BY sast_timestamp";
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
