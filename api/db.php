<?php
/**
 * AM Radio Tycoon — Shared SQLite Leaderboard Database Helper (PHP 7.4+)
 * Stores ONLY completed career runs. Never stores active savegames.
 */

const AMRT_DB_PATH = __DIR__ . '/../data/leaderboard.sqlite';
const AMRT_MAX_ROWS = 500;
const AMRT_MIN_SUBMIT_GAP = 2; // seconds between submissions per IP

function amrt_json(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function amrt_db(): PDO
{
    if (!extension_loaded('pdo_sqlite')) {
        amrt_json(['ok' => false, 'error' => 'Server is missing the pdo_sqlite PHP extension.'], 500);
    }

    $dir = dirname(AMRT_DB_PATH);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    if (!file_exists($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }

    try {
        $pdo = new PDO('sqlite:' . AMRT_DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA busy_timeout = 5000');
        @$pdo->exec('PRAGMA journal_mode = WAL');

        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS leaderboard_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                manager_name TEXT NOT NULL,
                station_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                years_survived INTEGER NOT NULL,
                months_survived INTEGER NOT NULL,
                peak_listeners INTEGER NOT NULL,
                peak_ratings REAL NOT NULL,
                station_value INTEGER NOT NULL,
                fcc_violations INTEGER NOT NULL DEFAULT 0,
                career_result TEXT NOT NULL,
                date_completed TEXT NOT NULL
            )'
        );

        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_runs_score ON leaderboard_runs (score DESC, months_survived DESC, id ASC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_runs_listeners ON leaderboard_runs (peak_listeners DESC, score DESC, id ASC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_runs_value ON leaderboard_runs (station_value DESC, score DESC, id ASC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_runs_longest ON leaderboard_runs (months_survived DESC, score DESC, id ASC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_runs_fcc ON leaderboard_runs (fcc_violations DESC, months_survived DESC, score DESC, id ASC)');

        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS rate_limit (
                ip_hash TEXT PRIMARY KEY,
                last_submit INTEGER NOT NULL
            )'
        );

        $count = (int) $pdo->query('SELECT COUNT(*) FROM leaderboard_runs')->fetchColumn();
        if ($count === 0) {
            amrt_seed($pdo);
        }

        return $pdo;
    } catch (Throwable $e) {
        amrt_json(['ok' => false, 'error' => 'Leaderboard database unavailable.'], 500);
    }
    return new PDO('sqlite::memory:'); // unreachable
}

function amrt_seed(PDO $pdo): void
{
    $seeds = [
        ['Evelyn Vance', 'WSTF 1120 AM', 184200, 25, 300, 148500, 62.4, 3450000, 4, 'Retired Legend', '2026-01-12'],
        ['Big Tony', 'WKRAK 1470 AM', 142900, 21, 254, 196200, 71.8, 2890000, 19, 'Early Retirement', '2026-02-04'],
        ['Mabel Jenkins', 'Radio Chicken 900 AM', 118500, 25, 300, 92400, 48.5, 4120000, 2, 'Retired Legend', '2026-02-19'],
        ['Carl Sr.', 'WTON 980 AM', 89400, 14, 172, 112000, 58.2, 1420000, 27, 'FCC Disaster', '2026-03-08'],
        ['Barnaby', 'WBAS 1290 AM', 64800, 11, 134, 68400, 41.0, 960000, 6, 'Early Retirement', '2026-04-02'],
        ['Dave (Former Intern)', 'WSTF 1120 AM', 31200, 6, 75, 24100, 29.4, 410000, 1, 'Goat Rebellion', '2026-05-14'],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO leaderboard_runs (
            manager_name, station_name, score, years_survived, months_survived,
            peak_listeners, peak_ratings, station_value, fcc_violations,
            career_result, date_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($seeds as $row) {
        $stmt->execute($row);
    }
}
