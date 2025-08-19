<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

$conn = getEquipmentDbConnection();
$sql = "SELECT equipment, current_status, created_at FROM equipment_status_form ORDER BY created_at DESC";
$result = $conn->query($sql);
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
$conn->close();

echo json_encode($data);
?>
