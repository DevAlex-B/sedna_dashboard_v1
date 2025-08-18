<?php
header('Content-Type: application/json');
require_once '../equipment_db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';
$id = null;
if ($path !== '') {
    $parts = explode('/', trim($path, '/'));
    if (count($parts) > 0) {
        $id = intval($parts[0]);
    }
}

$conn = getEquipmentDbConnection();

function validate_color($color) {
    return preg_match('/^#[0-9A-Fa-f]{6}$/', $color);
}

function validate_coordinates($coords) {
    if (!is_array($coords) || !isset($coords['type']) || $coords['type'] !== 'Polygon') {
        return null;
    }
    if (!isset($coords['coordinates']) || !is_array($coords['coordinates'])) {
        return null;
    }
    $ring = $coords['coordinates'][0] ?? [];
    if (count($ring) < 3) {
        return null;
    }
    // ensure closure
    $first = $ring[0];
    $last = end($ring);
    if ($first[0] !== $last[0] || $first[1] !== $last[1]) {
        $ring[] = $first;
    }
    // check unique vertices
    $unique = array_unique(array_map(function($p){ return implode(',', $p); }, $ring));
    if (count($unique) < 4) { // includes closing point
        return null;
    }
    $coords['coordinates'][0] = $ring;
    return $coords;
}

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare('SELECT id, name, color, coordinates FROM geofences WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $res = $stmt->get_result()->fetch_assoc();
            if ($res) {
                $res['coordinates'] = json_decode($res['coordinates']);
                echo json_encode($res);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Not found']);
            }
            $stmt->close();
        } else {
            $result = $conn->query('SELECT id, name, color, coordinates FROM geofences');
            $rows = [];
            while ($row = $result->fetch_assoc()) {
                $row['coordinates'] = json_decode($row['coordinates']);
                $rows[] = $row;
            }
            echo json_encode($rows);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $color = $data['color'] ?? '';
        $coords = $data['coordinates'] ?? null;
        $coords = validate_coordinates($coords);
        if (!$name || !validate_color($color) || !$coords) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
            break;
        }
        $json = json_encode($coords);
        $stmt = $conn->prepare('INSERT INTO geofences (name, color, coordinates) VALUES (?, ?, ?)');
        $stmt->bind_param('sss', $name, $color, $json);
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            $stmt->close();
            $stmt = $conn->prepare('SELECT id, name, color, coordinates FROM geofences WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $res = $stmt->get_result()->fetch_assoc();
            $res['coordinates'] = json_decode($res['coordinates']);
            echo json_encode($res);
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Insert failed']);
        }
        break;
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $fields = [];
        $types = '';
        $params = [];
        if (isset($data['name'])) {
            $fields[] = 'name = ?';
            $types .= 's';
            $params[] = $data['name'];
        }
        if (isset($data['color'])) {
            if (!validate_color($data['color'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid color']);
                break;
            }
            $fields[] = 'color = ?';
            $types .= 's';
            $params[] = $data['color'];
        }
        if (isset($data['coordinates'])) {
            $coords = validate_coordinates($data['coordinates']);
            if (!$coords) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid coordinates']);
                break;
            }
            $fields[] = 'coordinates = ?';
            $types .= 's';
            $params[] = json_encode($coords);
        }
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            break;
        }
        $types .= 'i';
        $params[] = $id;
        $sql = 'UPDATE geofences SET '.implode(',', $fields).' WHERE id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            $stmt->close();
            $stmt = $conn->prepare('SELECT id, name, color, coordinates FROM geofences WHERE id = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $res = $stmt->get_result()->fetch_assoc();
            if ($res) {
                $res['coordinates'] = json_decode($res['coordinates']);
                echo json_encode($res);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Not found']);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Update failed']);
        }
        break;
    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing id']);
            break;
        }
        $stmt = $conn->prepare('DELETE FROM geofences WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $success = $stmt->affected_rows > 0;
        $stmt->close();
        echo json_encode(['success' => $success]);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>
