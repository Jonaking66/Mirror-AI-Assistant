<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $student_id = intval($_GET['student_id'] ?? 0);
    if (!$student_id) {
        echo json_encode(['error' => 'student_id required']);
        exit;
    }
    $stmt = $pdo->prepare(
        "SELECT id, text, created_at FROM reminders
         WHERE student_id = ? ORDER BY created_at DESC"
    );
    $stmt->execute([$student_id]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = json_decode(file_get_contents('php://input'), true);
    $student_id = intval($body['student_id'] ?? 0);
    $text       = trim($body['text'] ?? '');

    if (!$student_id || !$text) {
        echo json_encode(['error' => 'student_id and text required']);
        exit;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO reminders (student_id, text) VALUES (?, ?)"
    );
    $stmt->execute([$student_id, $text]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'text' => $text]);
    exit;
}

echo json_encode(['error' => 'Method not allowed']);
?>