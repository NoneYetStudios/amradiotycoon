<?php
/**
 * AM Radio Tycoon — POST api/submit_score.php
 * Stores completed career run metrics only. Never stores active savegames.
 */
require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    amrt_json(['ok' => false, 'error' => 'Method not allowed.'], 405);
}

$raw = file_get_contents('php://input', false, null, 0, 8192);
$in = [];
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $in = $decoded;
    }
}
if (!$in && !empty($_POST)) {
    $in = $_POST;
}

function amrt_clean_str($val, int $maxLen): string
{
    if (!is_string($val)) {
        return '';
    }
    $clean = trim(preg_replace('/\s+/', ' ', $val));
    $clean = preg_replace('/[^\P{C}]+/u', '', $clean);
    if (function_exists('mb_substr')) {
        return mb_substr($clean, 0, $maxLen, 'UTF-8');
    }
    return substr($clean, 0, $maxLen);
}

function amrt_int_range($val, int $min, int $max): ?int
{
    if (is_int($val)) {
        return ($val >= $min && $val <= $max) ? $val : null;
    }
    if (is_float($val) && is_finite($val) && floor($val) == $val) {
        $iv = (int) $val;
        return ($iv >= $min && $iv <= $max) ? $iv : null;
    }
    if (is_string($val) && preg_match('/^-?\d{1,12}$/', trim($val))) {
        $iv = (int) trim($val);
        return ($iv >= $min && $iv <= $max) ? $iv : null;
    }
    return null;
}

$managerName = amrt_clean_str($in['manager_name'] ?? '', 32);
$stationName = amrt_clean_str($in['station_name'] ?? '', 40);
$careerResult = amrt_clean_str($in['career_result'] ?? '', 64);

if ($managerName === '' || $stationName === '' || $careerResult === '') {
    amrt_json(['ok' => false, 'error' => 'Manager name, station name, and career result are required.'], 422);
}

$score = amrt_int_range($in['score'] ?? null, 0, 50000000);
$yearsSurvived = amrt_int_range($in['years_survived'] ?? null, 0, 25);
$monthsSurvived = amrt_int_range($in['months_survived'] ?? null, 1, 300);
$peakListeners = amrt_int_range($in['peak_listeners'] ?? null, 0, 50000000);
$stationValue = amrt_int_range($in['station_value'] ?? null, 0, 500000000);
$fccViolations = amrt_int_range($in['fcc_violations'] ?? 0, 0, 1000);

$peakRatingsRaw = $in['peak_ratings'] ?? null;
$peakRatings = null;
if (is_int($peakRatingsRaw) || is_float($peakRatingsRaw) || (is_string($peakRatingsRaw) && is_numeric($peakRatingsRaw))) {
    $pr = round((float) $peakRatingsRaw, 1);
    if (is_finite($pr) && $pr >= 0 && $pr <= 100) {
        $peakRatings = $pr;
    }
}

if (
    $score === null ||
    $yearsSurvived === null ||
    $monthsSurvived === null ||
    $peakListeners === null ||
    $peakRatings === null ||
    $stationValue === null ||
    $fccViolations === null
) {
    amrt_json(['ok' => false, 'error' => 'Invalid numeric career statistics.'], 422);
}

$dateCompleted = gmdate('Y-m-d');
$now = time();

try {
    $pdo = amrt_db();

    $ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|amradiotycoon');
    $pdo->exec('DELETE FROM rate_limit WHERE last_submit < ' . ($now - 3600));
    $st = $pdo->prepare('SELECT last_submit FROM rate_limit WHERE ip_hash = :h');
    $st->execute([':h' => $ipHash]);
    $last = $st->fetchColumn();
    if ($last !== false && ($now - (int) $last) < AMRT_MIN_SUBMIT_GAP) {
        amrt_json(['ok' => false, 'error' => 'Please wait a moment before submitting another career score.'], 429);
    }

    $pdo->beginTransaction();
    $pdo->prepare('INSERT OR REPLACE INTO rate_limit (ip_hash, last_submit) VALUES (:h, :t)')
        ->execute([':h' => $ipHash, ':t' => $now]);

    $ins = $pdo->prepare(
        'INSERT INTO leaderboard_runs (
            manager_name, station_name, score, years_survived, months_survived,
            peak_listeners, peak_ratings, station_value, fcc_violations,
            career_result, date_completed
        ) VALUES (:m, :s, :sc, :y, :mo, :pl, :pr, :sv, :fcc, :cr, :dc)'
    );
    $ins->execute([
        ':m' => $managerName,
        ':s' => $stationName,
        ':sc' => $score,
        ':y' => $yearsSurvived,
        ':mo' => $monthsSurvived,
        ':pl' => $peakListeners,
        ':pr' => $peakRatings,
        ':sv' => $stationValue,
        ':fcc' => $fccViolations,
        ':cr' => $careerResult,
        ':dc' => $dateCompleted,
    ]);
    $insertedId = (int) $pdo->lastInsertId();

    $pdo->exec(
        'DELETE FROM leaderboard_runs WHERE id NOT IN (
            SELECT id FROM leaderboard_runs ORDER BY score DESC, months_survived DESC, id ASC LIMIT ' . AMRT_MAX_ROWS . '
        )'
    );

    $rankSt = $pdo->prepare(
        'SELECT COUNT(*) FROM leaderboard_runs
         WHERE score > :sc
            OR (score = :sc AND months_survived > :mo)
            OR (score = :sc AND months_survived = :mo AND id < :id)'
    );
    $rankSt->execute([':sc' => $score, ':mo' => $monthsSurvived, ':id' => $insertedId]);
    $rank = (int) $rankSt->fetchColumn() + 1;

    $pdo->commit();

    amrt_json([
        'ok' => true,
        'id' => $insertedId,
        'rank' => $rank,
        'date_completed' => $dateCompleted,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    amrt_json(['ok' => false, 'error' => 'Failed to save career score.'], 500);
}
