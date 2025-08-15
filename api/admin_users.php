<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}
require_once 'equipment_db.php';
$allowed = ['id','full_name','email','phone_number','created_at','dashboard_visitor'];
$sort_by = $_GET['sort_by'] ?? 'created_at';
$sort_dir = $_GET['sort_dir'] ?? 'none';
if ($sort_dir === 'none') {
    $order = 'ORDER BY created_at DESC';
} else {
    if (!in_array($sort_by, $allowed)) {
        $sort_by = 'created_at';
    }
    $dir = strtolower($sort_dir) === 'asc' ? 'ASC' : 'DESC';
    $order = "ORDER BY $sort_by $dir";
}
$conn = getEquipmentDbConnection();
$query = "SELECT id, full_name, email, phone_number, created_at, dashboard_visitor FROM users $order";
$result = $conn->query($query);
$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
$conn->close();
echo json_encode($rows);
?>
