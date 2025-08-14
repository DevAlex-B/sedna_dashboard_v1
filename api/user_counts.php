<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

$conn = getEquipmentDbConnection();
$stmt = $conn->prepare(
  "SELECT SUM(CASE WHEN dashboard_visitor = 1 THEN 1 ELSE 0 END) AS dashboard, " .
  "SUM(CASE WHEN dashboard_visitor = 0 OR dashboard_visitor IS NULL THEN 1 ELSE 0 END) AS visitors " .
  "FROM users WHERE created_at BETWEEN ? AND ?"
);
$stmt->bind_param('ss', $start, $end);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$counts = [
  'visitors' => isset($row['visitors']) ? (int)$row['visitors'] : 0,
  'dashboard' => isset($row['dashboard']) ? (int)$row['dashboard'] : 0,
];
$stmt->close();
$conn->close();

echo json_encode($counts);
?>
