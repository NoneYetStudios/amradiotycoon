# AM Radio Tycoon

**AM Radio Tycoon — The 25-Year Station Manager Career** is a browser-based management simulation built for **STF Arcade**. Take the reins of a small-town AM radio station (`WSTF 1120 AM`) and guide it through 300 monthly turns of programming, ad sales, transmitter upgrades, staff management, FCC compliance, and unpredictable local chaos.

## Features

- **25-Year Career Arc (300 Monthly Turns):** Manage cash, listeners, ratings, transmitter power, station value, and FCC compliance.
- **4-Week Live Interrupts & Event Chains:** Handle breaking news, host crises, equipment failures, and STF Arcade absurdity.
- **Retro Studio SFX:** Synthesized Web Audio API sound effects (`js/audio.js`) with a header toggle.
- **Instant Local Save:** Active careers auto-save locally in browser `localStorage` every month.
- **Global SQLite Leaderboard:** Completed career runs are submitted to a lightweight PHP + SQLite backend (`api/submit_score.php`, `api/leaderboard.php`) supporting 5 ranking categories (`score`, `listeners`, `value`, `longest`, `fcc`).

## Project Structure

```text
amradiotycoon/
├── .htaccess               # Disables directory indexing, blocks dotfiles/DBs/logs, sets security headers
├── index.html              # Game UI, screens, and modals
├── api/
│   ├── db.php              # SQLite connection, schema init, and seed data (PHP 7.4+)
│   ├── leaderboard.php     # GET endpoint for top career runs
│   └── submit_score.php    # POST endpoint with validation & per-IP rate limiting
├── css/
│   └── style.css           # Broadcast console styling
├── data/
│   └── .htaccess           # Blocks all direct HTTP access to the SQLite database directory
└── js/
    ├── events_expansion.js # Expanded event pool
    ├── data.js             # Stations, staff, upgrades, and core game data
    ├── audio.js            # Web Audio retro SFX
    ├── engine.js           # Simulation state, turn logic, and save/load
    └── ui.js               # DOM rendering, modals, and leaderboard integration
```

## Requirements

- **PHP 7.4+** with the **`pdo_sqlite`** extension enabled
- **Apache** (recommended, uses `.htaccess` and `data/.htaccess` for access control and security headers)
- **Writable `data/` directory** so PHP can create and update `data/leaderboard.sqlite`

## Local Development

Start PHP's built-in development server from the project root:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

You can also run with python:

```bash
python -m http.server 8000
```

> **Note:** PHP's built-in server does not process `.htaccess` files; Apache is required in production for those rules to apply.

## Deploying to JetHost (or similar web host)

No build step or package manager is required. Upload the project files to your JetHost web root (or a subdirectory such as `public_html/amradiotycoon/`):

1. **Upload files:**
   - `index.html`
   - `.htaccess`
   - `css/`
   - `js/`
   - `api/`
   - `data/` (including `data/.htaccess`; do **not** upload a local `leaderboard.sqlite` unless you want to carry over local test scores—`api/db.php` will automatically create and seed `data/leaderboard.sqlite` on the first request)
2. **Verify PHP & `pdo_sqlite`:**
   - In JetHost cPanel → **Select PHP Version**, ensure **PHP 7.4 or newer** (e.g. PHP 8.x) is active and the **`pdo_sqlite`** extension is enabled.
3. **Verify `data/` permissions:**
   - Ensure `data/` is writable by PHP (typically `0755` on cPanel/JetHost suPHP, or `0775` if needed).
4. **Verify `.htaccess` protection:**
   - Confirm hidden files (`.htaccess` and `data/.htaccess`) were uploaded so `data/leaderboard.sqlite` cannot be downloaded directly via HTTP.

---

## License

MIT License © 2026 Anthony Moore / None Yet Studios
