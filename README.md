# AM Radio Tycoon

**AM Radio Tycoon — The 25-Year Station Manager Career** is a browser-based management simulation built for **STF Arcade**.

Take control of **WSTF 1120 AM**, a struggling small-town radio station, and guide it through a full broadcasting career spanning 25 years and 300 monthly turns. Hire eccentric hosts, negotiate advertising contracts, survive FCC scrutiny, outmaneuver rival stations, cover suspicious weather, respond to local emergencies, and somehow stay on the air while reporting on runaway goats, fish rain, escaped promotional inflatables, and whatever else this month decides to throw at you.

Can you build a tiny local station into a broadcasting empire before retirement?

---

## Features

### 📻 25-Year Broadcasting Career
Manage your station across **300 monthly turns**, balancing:

- Cash
- Listener growth
- Ratings
- Station value
- Signal coverage
- Public trust
- FCC standing
- Staff morale
- Advertiser relationships

Every decision shapes your station's legacy.

### 🎙️ Hosts, Contracts & Rival Stations
Hire and manage a roster of colorful on-air personalities.

- Negotiate raises
- Renew contracts
- Maintain loyalty
- Prevent defections
- Recover from host departures

Competing stations can poach talent, steal listeners, and challenge your market dominance.

### 📡 Industry Evolution
The media landscape changes throughout your career.

Experience:

- AM's local radio heyday
- FM expansion
- Cable weather competition
- Talk radio booms
- Internet streaming
- Podcast disruption
- Modern digital media challenges

Adapt or get left behind.

### 📢 Programming & Audience Trends
Schedule shows across the broadcast day:

- Local News
- Swap Shop
- Weather Watch
- Community Calendar
- County Sports
- Classic Country
- Talk Radio
- Oldies

Unlock increasingly ridiculous content including:

- Conspiracy Carl Live
- Department of Boom Prevention Report
- Bass Forecast Network
- Goat Watch
- Hamster Hour
- Interstate Weather Panic Center
- National Fish Monitoring Service

Audience preferences evolve over time, and overused programming can lose effectiveness.

### 🚨 Interrupt Events & Story Chains
Every month is broken into four broadcast weeks.

Respond to:

- Breaking news
- Severe weather
- Equipment failures
- Host scandals
- Advertising disputes
- Community crises
- STF Arcade absurdity

Many events evolve into multi-part story chains whose consequences can last for years.

### 🐐 Hundreds of Events
The game includes:

- Generic local-news incidents
- Host-driven storylines
- Advertiser conflicts
- Weather emergencies
- Industry disruptions
- Rare special incidents
- Multi-stage event chains

No two careers should feel exactly alike.

### 💾 Instant Local Save
Active careers automatically save to browser `localStorage`.

Close the browser and return later.

No accounts.
No cloud saves.
No server-side game storage.

### 🏆 Global SQLite Leaderboards
Completed careers can be submitted to a lightweight PHP + SQLite leaderboard backend.

Supported ranking categories:

- Highest Score
- Highest Listener Count
- Highest Station Value
- Longest Career
- Most FCC Violations Survived

---

## Project Structure

```text
amradiotycoon/
├── .htaccess               # Security rules & server protections
├── index.html              # Main game UI
├── api/
│   ├── db.php              # SQLite connection & schema setup
│   ├── leaderboard.php     # Leaderboard API endpoint
│   └── submit_score.php    # Score submission API endpoint
├── css/
│   └── style.css           # Broadcast console styling
├── data/
│   └── .htaccess           # Blocks direct access to SQLite files
└── js/
    ├── events_expansion.js # Expanded event and storyline pools
    ├── data.js             # Hosts, stations, upgrades, shows, rivals
    ├── audio.js            # Retro broadcast sound effects
    ├── engine.js           # Simulation engine & game state
    └── ui.js               # Rendering, UI logic, and leaderboard integration
```

---

## Requirements

- **PHP 7.4+**
- **PDO SQLite (`pdo_sqlite`)**
- **Apache** (recommended for `.htaccess` support)
- Writable `data/` directory

---

## Local Development

Run PHP's built-in development server:

```bash
php -S localhost:8000
```

Open:

```text
http://localhost:8000
```

Alternatively:

```bash
python -m http.server 8000
```

> **Note:** PHP's built-in development server does not process `.htaccess` files. Apache is recommended for production deployment.

---

## Deploying to JetHost (or Similar Hosts)

No build tools, package managers, or compilation steps are required.

Upload:

- `index.html`
- `.htaccess`
- `css/`
- `js/`
- `api/`
- `data/` (including `data/.htaccess`)

The application automatically creates and initializes `data/leaderboard.sqlite` on first use.

### Verify PHP Support

Ensure:

- PHP 7.4+ is enabled
- `pdo_sqlite` is available

### Verify Permissions

Ensure `data/` is writable by PHP.

Typical values:

```text
0755
```

or:

```text
0775
```

depending on hosting configuration.

### Verify Security Files

Confirm that:

```text
.htaccess
data/.htaccess
```

were uploaded successfully so SQLite files cannot be downloaded directly.

---

## STF Arcade

AM Radio Tycoon is part of the STF Arcade collection:

- Lemonade Stand
- AM Radio Tycoon
- World's Worst Florist
- Kaiju Brawl
- Boom Squad
- Food Dasher
- Beach Hamster
- And many more questionable decisions

---

## License

MIT License © 2026 Anthony Moore / None Yet Studios
