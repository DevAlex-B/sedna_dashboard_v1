<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

$conn = getEquipmentDbConnection();

// Counts within the provided time range
$stmt = $conn->prepare(
  "SELECT SUM(CASE WHEN dashboard_visitor = 1 THEN 1 ELSE 0 END) AS dashboard, " .
  "SUM(CASE WHEN dashboard_visitor = 0 OR dashboard_visitor IS NULL THEN 1 ELSE 0 END) AS visitors " .
  "FROM users WHERE created_at BETWEEN ? AND ?"
);
$stmt->bind_param('ss', $start, $end);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// All-time user count
$allResult = $conn->query("SELECT COUNT(*) AS total FROM users");
$allRow = $allResult->fetch_assoc();

$counts = [
  'visitors' => isset($row['visitors']) ? (int)$row['visitors'] : 0,
  'dashboard' => isset($row['dashboard']) ? (int)$row['dashboard'] : 0,
  'allTime' => isset($allRow['total']) ? (int)$allRow['total'] : 0,
];

$stmt->close();
$allResult->free();
$conn->close();

echo json_encode($counts);
?>
