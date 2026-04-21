<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = trim($body['password'] ?? '');

if (!$username || !$password) {
    echo json_encode(['error' => 'All fields required']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, role, username, password FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || $user['password'] !== $password) {
    http_response_code(401);
    echo json_encode(['error' => 'Incorrect credentials']);
    exit;
}

$name = 'Administrator';
if ($user['role'] === 'student') {
    $stmt2 = $pdo->prepare("SELECT full_name FROM students WHERE user_id = ?");
    $stmt2->execute([$user['id']]);
    $student = $stmt2->fetch();
    $name = $student ? $student['full_name'] : $username;
}

$student_id = null;
if ($user['role'] === 'student') {
    $stmt3 = $pdo->prepare("SELECT id FROM students WHERE user_id = ?");
    $stmt3->execute([$user['id']]);
    $s = $stmt3->fetch();
    $student_id = $s ? $s['id'] : null;
}

echo json_encode([
    'success'    => true,
    'role'       => $user['role'],
    'username'   => $user['username'],
    'user_id'    => $user['id'],
    'student_id' => $student_id,
    'name'       => $name,
]);
?>