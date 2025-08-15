<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

function maskEmail($email) {
    if (!$email) return '';
    $parts = explode('@', $email);
    if (count($parts) !== 2) return '';
    $local = $parts[0];
    $domain = $parts[1];
    $maskedLocal = substr($local, 0, 1) . str_repeat('*', max(strlen($local) - 1, 0));
    $domainParts = explode('.', $domain);
    $tld = array_pop($domainParts);
    $domainWithoutTld = implode('.', $domainParts);
    $maskedDomain = str_repeat('*', strlen($domainWithoutTld));
    return $maskedLocal . '@' . $maskedDomain . '.' . $tld;
}

function maskPhone($phone) {
    if (!$phone) return '';
    if (preg_match('/^(\+\d{1,3})(\d{2})(\d+)(\d)$/', $phone, $m)) {
        $country = $m[1];
        $first = $m[2];
        $middle = $m[3];
        $last = $m[4];
        return $country . ' ' . $first . str_repeat('*', strlen($middle)) . $last;
    }
    return $phone;
}

function maskName($name) {
    if (!$name) return '';
    $tokens = preg_split('/\s+/', trim($name));
    $masked = array_map(function($token) {
        return substr($token, 0, 1) . str_repeat('*', max(strlen($token) - 1, 0));
    }, $tokens);
    return implode(' ', $masked);
}

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
$query = "SELECT id, full_name, email, phone_number, created_at, dashboard_visitor FROM users WHERE dashboard_visitor = 1 $order";
$result = $conn->query($query);
$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = [
            'id' => (int)$row['id'],
            'full_name' => maskName($row['full_name']),
            'email' => maskEmail($row['email']),
            'phone_number' => maskPhone($row['phone_number']),
            'created_at' => $row['created_at'],
            'dashboard_visitor' => (int)$row['dashboard_visitor']
        ];
    }
}
$conn->close();

echo json_encode($rows);
?>
