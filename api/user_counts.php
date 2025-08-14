<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;

$conn = getEquipmentDbConnection();
$stmt = $conn->prepare("SELECT dashboard_visitor, COUNT(*) AS count FROM users WHERE created_at BETWEEN ? AND ? GROUP BY dashboard_visitor");
$stmt->bind_param('ss', $start, $end);
$stmt->execute();
$result = $stmt->get_result();
$counts = ['visitors' => 0, 'dashboard' => 0];
while ($row = $result->fetch_assoc()) {
  if ((int)$row['dashboard_visitor'] === 1) {
    $counts['dashboard'] = (int)$row['count'];
  } else {
    $counts['visitors'] = (int)$row['count'];
  }
}
$stmt->close();
$conn->close();

echo json_encode($counts);
?>
