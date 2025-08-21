<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;
$latest = isset($_GET['latest']);

$conn = getEquipmentDbConnection();
$conn->query("SET time_zone = 'UTC'");

if ($latest) {
  $sql = "SELECT equipment, operator, status, monday_status, tuesday_status, wednesday_status, thursday_status, friday_status, saturday_status, sunday_status, planned_downtime_start, planned_downtime_end, unplanned_downtime_start, unplanned_downtime_end, CONVERT_TZ(created_at, 'UTC','Africa/Johannesburg') AS created_at FROM equipment_status_form ORDER BY created_at DESC LIMIT 1";
  $result = $conn->query($sql);
  $data = [];
  if ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
  $conn->close();
  echo json_encode($data);
  exit;
}

$sql = "SELECT equipment, operator, status, monday_status, tuesday_status, wednesday_status, thursday_status, friday_status, saturday_status, sunday_status, planned_downtime_start, planned_downtime_end, unplanned_downtime_start, unplanned_downtime_end, CONVERT_TZ(created_at, 'UTC','Africa/Johannesburg') AS created_at FROM equipment_status_form WHERE created_at BETWEEN CONVERT_TZ(?, 'Africa/Johannesburg', 'UTC') AND CONVERT_TZ(?, 'Africa/Johannesburg', 'UTC') ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $start, $end);
$stmt->execute();
$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}
$stmt->close();
$conn->close();

echo json_encode($data);
