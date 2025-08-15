<?php
session_start();
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';
if ($action === 'login') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    if ($username === 'sedna' && $password === 'sedna123') {
        $_SESSION['admin'] = true;
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} elseif ($action === 'validate') {
    if (!empty($_SESSION['admin'])) {
        echo json_encode(['authenticated' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['authenticated' => false]);
    }
} elseif ($action === 'logout') {
    session_unset();
    session_destroy();
    echo json_encode(['success' => true]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action']);
}
?>
