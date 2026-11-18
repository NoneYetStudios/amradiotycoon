<?php
/**
 * AM Radio Tycoon — GET api/leaderboard.php
 * Supports 5 categories: score, listeners, value, longest, fcc.
 */
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
    header('Allow: GET, HEAD');
    amrt_json(['ok' => false, 'error' => 'Method not allowed.'], 405);
}

$category = isset($_GET['category']) && is_string($_GET['category']) ? strtolower(trim($_GET['category'])) : 'score';
$orderMap = [
    'score' => 'score DESC, months_survived DESC, id ASC',
    'listeners' => 'peak_listeners DESC, score DESC, id ASC',
    'value' => 'station_value DESC, score DESC, id ASC',
    'longest' => 'months_survived DESC, score DESC, id ASC',
    'fcc' => 'fcc_violations DESC, months_survived DESC, score DESC, id ASC',
];

if (!isset($orderMap[$category])) {
    $category = 'score';
}

$limit = 25;
if (isset($_GET['limit']) && ctype_digit((string) $_GET['limit'])) {
    $limit = max(1, min(50, (int) $_GET['limit']));
}

try {
    $pdo = amrt_db();
    $sql = 'SELECT id, manager_name, station_name, score, years_survived, months_survived,
                   peak_listeners, peak_ratings, station_value, fcc_violations,
                   career_result, date_completed
            FROM leaderboard_runs
            ORDER BY ' . $orderMap[$category] . '
            LIMIT :lim';

    $st = $pdo->prepare($sql);
    $st->bindValue(':lim', $limit, PDO::PARAM_INT);
    $st->execute();

    $entries = [];
    $rank = 1;
    foreach ($st->fetchAll() as $row) {
        $entries[] = [
            'rank' => $rank++,
            'id' => (int) $row['id'],
            'manager_name' => $row['manager_name'],
            'station_name' => $row['station_name'],
            'score' => (int) $row['score'],
            'years_survived' => (int) $row['years_survived'],
            'months_survived' => (int) $row['months_survived'],
            'peak_listeners' => (int) $row['peak_listeners'],
            'peak_ratings' => (float) $row['peak_ratings'],
            'station_value' => (int) $row['station_value'],
            'fcc_violations' => (int) $row['fcc_violations'],
            'career_result' => $row['career_result'],
            'date_completed' => $row['date_completed'],
        ];
    }

    amrt_json([
        'ok' => true,
        'category' => $category,
        'entries' => $entries,
    ]);
} catch (Throwable $e) {
    amrt_json(['ok' => false, 'error' => 'Could not load leaderboard.'], 500);
}
