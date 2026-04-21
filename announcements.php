<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        "SELECT id, title, body, category, posted_at
         FROM announcements ORDER BY posted_at DESC LIMIT 20"
    );
    $announcements = $stmt->fetchAll();

    foreach ($announcements as &$ann) {
        $diff = time() - strtotime($ann['posted_at']);
        if ($diff < 60)         $ann['time'] = 'Just now';
        elseif ($diff < 3600)   $ann['time'] = floor($diff/60).' minutes ago';
        elseif ($diff < 86400)  $ann['time'] = floor($diff/3600).' hours ago';
        elseif ($diff < 172800) $ann['time'] = 'Yesterday';
        else                    $ann['time'] = floor($diff/86400).' days ago';
    }

    echo json_encode($announcements);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body     = json_decode(file_get_contents('php://input'), true);
    $title    = trim($body['title']    ?? '');
    $bodyText = trim($body['body']     ?? '');
    $category = trim($body['category'] ?? 'General');

    if (!$title || !$bodyText) {
        echo json_encode(['error' => 'title and body required']);
        exit;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO announcements (title, body, category) VALUES (?, ?, ?)"
    );
    $stmt->execute([$title, $bodyText, $category]);

    $log = $pdo->prepare("INSERT INTO activity_logs (action_text) VALUES (?)");
    $log->execute(["Admin posted announcement: \"$title\""]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'time' => 'Just now']);
    exit;
}

echo json_encode(['error' => 'Method not allowed']);
?>