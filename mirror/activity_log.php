<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        "SELECT id, action_text, logged_at FROM activity_logs
         ORDER BY logged_at DESC LIMIT 30"
    );
    $logs = $stmt->fetchAll();

    foreach ($logs as &$log) {
        $diff = time() - strtotime($log['logged_at']);
        if ($diff < 60)        $log['time'] = 'Just now';
        elseif ($diff < 3600)  $log['time'] = floor($diff/60).' min ago';
        elseif ($diff < 86400) $log['time'] = date('g:i A', strtotime($log['logged_at']));
        else                   $log['time'] = date('M j', strtotime($log['logged_at']));
    }

    echo json_encode($logs);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body    = json_decode(file_get_contents('php://input'), true);
    $text    = trim($body['text']    ?? '');
    $user_id = intval($body['user_id'] ?? 0) ?: null;

    if (!$text) {
        echo json_encode(['error' => 'text required']);
        exit;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO activity_logs (user_id, action_text) VALUES (?, ?)"
    );
    $stmt->execute([$user_id, $text]);
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Method not allowed']);
?>