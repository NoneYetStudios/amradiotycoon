/**
 * AM RADIO TYCOON — Content & Event Expansion Pack
 * Adds: 105 Generic Interrupts, 42 Host Events, 32 Advertiser Events,
 * 26 Weather/Emergency Events, 22 Industry Events, and 20 Multi-Stage Event Chains.
 */
(function (root) {
  'use strict';

  function ch(label, tags, fx, reportLine, extra) {
    const out = { label: label, tags: tags, effects: fx, reportLine: reportLine };
    if (extra) Object.assign(out, extra);
    return out;
  }

  function ev(id, category, icon, minYear, title, description, choices, opts) {
    const out = {
      id: id,
      category: category,
      icon: icon,
      isEmergency: Boolean(opts && opts.isEmergency),
      minYear: minYear || 1,
      maxYear: (opts && opts.maxYear) || 25,
      title: title,
      description: description,
      choices: choices
    };
    if (opts) {
      Object.keys(opts).forEach(function (k) {
        if (k !== 'isEmergency' && k !== 'maxYear') out[k] = opts[k];
      });
    }
    return out;
  }

  // =========================================================================
  // 1. 105 NEW GENERIC INTERRUPT EVENTS
  // =========================================================================
  const GENERIC_INTERRUPTS = [
    ev('gen_01', 'CIVIC DISPUTE', '🚧', 1, 'Town Installs Three Roundabouts On A Two-Lane Road',
      'County engineers built triple mini-roundabouts overnight. Three tractors and a bread truck are stuck circling infinitely.',
      [
        ch('A) Air live roundabout navigation coaching', ['+Trust', '+Listeners', '-$300'], { cash: -300, ratings: 1.8, listeners: 380, trust: 4, fcc: 1, morale: 2 }, 'Broadcast live roundabout turn-by-turn therapy for stranded motorists.'),
        ch('B) Turn the chaos into a timed lap-record call-in contest', ['++Ratings', '-Trust', '-FCC'], { cash: 0, ratings: 3.1, listeners: 620, trust: -4, fcc: -3, morale: 3 }, 'Timed roundabout lap records spiked ratings while exasperating traffic cops.'),
        ch('C) Run calm civic announcements during news breaks', ['+FCC', 'Safe'], { cash: 0, ratings: 0.5, listeners: 110, trust: 2, fcc: 2 }, 'Delivered polite roundabout safety summaries between songs.')
      ]),
    ev('gen_02', 'LOCAL MYSTERY', '🧀', 1, '400-Pound Wheel of Unclaimed Cheese Appears At Post Office',
      'Nobody signed for a cedar crate containing 400 pounds of sharp cheddar humming slightly at 60 Hz.',
      [
        ch('A) Host "Name That Cheese" on-air investigative special', ['+Ratings', '+Listeners'], { cash: -200, ratings: 2.3, listeners: 490, trust: 1, morale: 3 }, 'Listeners phoned in wild theories about the humming post-office cheddar.'),
        ch('B) Notify Dept of Boom Prevention & clear the lobby', ['+Trust', '+FCC'], { cash: 0, ratings: 0.9, listeners: 180, trust: 4, fcc: 3 }, 'Cautious cheese quarantine won warm praise from Boom Prevention.'),
        ch('C) Auction cheese slices on Swap Shop to fund snacks', ['+$750 Cash', '-Trust Risk'], { cash: 750, ratings: 1.4, listeners: 210, trust: -3, fcc: -2, morale: 4 }, 'Sold mystery post-office cheddar slices live on Swap Shop.')
      ]),
    ev('gen_03', 'COMMUNITY EVENT', '🎣', 1, 'Annual Catfish Noodling Banquet Runs Out of Tartar Sauce',
      'Two hundred angry anglers at the Elks Lodge are threatening to picket Highway 31 unless condiment supplies arrive.',
      [
        ch('A) Broadcast an emergency Swap Shop sauce airlift appeal', ['++Trust', '+Listeners'], { cash: -250, ratings: 1.9, listeners: 440, trust: 5, morale: 3 }, 'Organized a community tartar-sauce convoy for the Elks Lodge.'),
        ch('B) Sell last-minute grocery sponsor spots to cash in', ['+$800 Cash', '+Ad Sat'], { cash: 800, ratings: 0.6, listeners: 120, adSat: 4 }, 'Rushed grocery condiment spots brought fast revenue during the banquet shortage.'),
        ch('C) Mock the condiment panic during evening drive', ['+Ratings', '-Trust'], { cash: 0, ratings: 2.2, listeners: 380, trust: -3, morale: 1 }, 'Evening hosts teased the great tartar-sauce crisis mercilessly.')
      ]),
    ev('gen_04', 'TECHNICAL HICCUP', '🔌', 1, 'Tower Grounding Rod Attracts Every Goose In Three Counties',
      'Four hundred Canada geese are standing in formation humming along with our 1120 kHz carrier wave.',
      [
        ch('A) Hire humane wildlife handler to relocate the choir', ['-$550 Cash', '+FCC', '+Trust'], { cash: -550, ratings: 0.7, listeners: 140, trust: 3, fcc: 3 }, 'Wildlife crews gently moved the resonating goose choir off the tower field.'),
        ch('B) Put a parabolic mic outside and broadcast "Goose Harmony FM"', ['++Ratings', '-FCC'], { cash: 0, ratings: 2.8, listeners: 620, trust: -1, fcc: -3, morale: 4 }, 'Live harmonizing tower geese briefly became our most bizarre morning bit.')
      ]),
    ev('gen_05', 'CIVIC POLITICS', '🏛️', 2, 'Mayor Proposes Daylight Savings Twice A Year In July',
      'To extend hardware store shopping hours, the Mayor wants to move clocks forward 42 minutes every Tuesday.',
      [
        ch('A) Host a serious town hall grilling the Mayor on time math', ['++Trust', '+FCC'], { cash: -150, ratings: 2.1, listeners: 460, trust: 5, fcc: 2 }, 'Rigorous mayoral questioning earned civic journalism praise.'),
        ch('B) Launch a satirical "Time Confusion Countdown" every hour', ['++Ratings', '-Trust Risk', '+Morale'], { cash: 0, ratings: 3.0, listeners: 680, trust: -2, fcc: -1, morale: 4 }, 'Satirical time-zone jingles made the Mayor fume and commuters howl.'),
        ch('C) Stay neutral and read official clock bulletins only', ['+Ad Sat', 'Safe'], { cash: 0, ratings: 0.4, listeners: 80, trust: 1, adSat: 2 }, 'Avoided political friction over the Tuesday clock proposal.')
      ]),
    ev('gen_06', 'SPORTS DRAMA', '⚾', 1, 'Little League Umpire Ejects The Entire Snack Shack',
      'Following a disputed infield fly ruling, Umpire Rusty banished both teams\' mothers and the nacho cheese warmer.',
      [
        ch('A) Interview the banished nacho warmer operator live', ['++Ratings', '+Listeners'], { cash: -150, ratings: 2.6, listeners: 560, trust: 1, morale: 3 }, 'Interview with the exiled snack-shack captain dominated weekend chatter.'),
        ch('B) Donate $400 for replacement trophies & peace talks', ['-$400 Cash', '++Trust'], { cash: -400, ratings: 1.2, listeners: 290, trust: 5, morale: 2 }, 'Funded peacemaking Little League medals after the snack-shack purge.'),
        ch('C) Side loudly with Umpire Rusty on County Sports', ['+Ratings', '-Trust'], { cash: 0, ratings: 2.4, listeners: 420, trust: -4, adSat: -1 }, 'Pro-umpire tirade split parent households across the county.')
      ]),
    ev('gen_07', 'LOCAL BUZZ', '🎸', 1, 'Garage Band Records 19-Minute Ballad About Pothole #7',
      'Teen quartet "Asphalt Grief" dropped off a cassette tribute to the Main Street crater that swallowed their drummer\'s moped.',
      [
        ch('A) Put the 19-minute pothole epic in heavy rotation', ['++Listeners', '+Morale', '-Ad Sat'], { cash: 0, ratings: 2.5, listeners: 610, trust: 2, adSat: -3, morale: 5 }, 'Teenage pothole ballad became an unlikely drive-time anthem.'),
        ch('B) Play a 90-second radio edit & interview City Public Works', ['+Trust', '+FCC'], { cash: 0, ratings: 1.4, listeners: 310, trust: 4, fcc: 2 }, 'Balanced local art with public-works accountability.'),
        ch('C) Charge them $300 as a paid novelty commercial', ['+$300 Cash', '+Ad Sat', '-Morale'], { cash: 300, ratings: -0.4, listeners: -60, adSat: 2, morale: -3 }, 'Billed local teens commercial airtime rates for their moped song.')
      ]),
    ev('gen_08', 'ABSURD LOCAL', '🐢', 2, 'Giant Snapping Turtle Refuses To Leave Bank Drive-Thru',
      'Lane 2 at First National Bait Bank is occupied by a 65-pound snapping turtle wearing a tiny sticker that says "MANAGER."',
      [
        ch('A) Dispatch remote mic for live teller-tube negotiations', ['++Ratings', '+Listeners'], { cash: -200, ratings: 2.7, listeners: 590, trust: 2, morale: 4 }, 'Broadcast live drive-thru standoff with "Manager Turtle."'),
        ch('B) Air calm detour advisories for bank customers', ['+Trust', '+Ad Sat'], { cash: 0, ratings: 0.9, listeners: 190, trust: 3, adSat: 3 }, 'Directed deposit traffic cleanly around Turtle Lane.'),
        ch('C) Launch "Turtle Vs. Mayor" poll on talk radio', ['++Ratings', '-Trust'], { cash: 0, ratings: 3.1, listeners: 650, trust: -3, fcc: -2 }, 'Listeners overwhelmingly voted Snapping Turtle for acting bank commissioner.')
      ]),
    ev('gen_09', 'CIVIC EVENT', '🚒', 1, 'Volunteer Fire Chili Cook-Off Causes 3-Alarm Smoke Scare',
      'Seven rival habanero cauldrons triggered smoke alarms across four blocks; everyone evacuated with spoons.',
      [
        ch('A) Air live taste-test safety bulletins from outside the firehouse', ['+Ratings', '+Trust'], { cash: -200, ratings: 2.0, listeners: 450, trust: 3, morale: 3 }, 'Reported live through watering eyes from the firehouse chili perimeter.'),
        ch('B) Run antacid & milk sponsor deals all afternoon', ['+$850 Cash', '+Ad Sat'], { cash: 850, ratings: 0.8, listeners: 160, adSat: 4 }, 'Clever dairy & pharmacy spot bundle paid off during the chili scare.'),
        ch('C) Claim an undocumented pepper bunker exploded', ['++Ratings', '--FCC', '--Trust'], { cash: 0, ratings: 3.2, listeners: 700, trust: -6, fcc: -5 }, 'Sensational pepper-bunker panic triggered an angry fire-chief rebuttal.')
      ]),
    ev('gen_10', 'LOCAL TRADE', '🛋️', 1, 'Mystery Warehouse Auction Sells 800 Slightly Damp Recliners',
      'Every household on Elm Street bought three velvet recliners that smell faintly of cedar bait boxes.',
      [
        ch('A) Dedicate Swap Shop to recliner barter & cushion drying tips', ['+Listeners', '+Trust'], { cash: 0, ratings: 1.7, listeners: 390, trust: 3, morale: 2 }, 'Swap Shop became recliner central for an entire week.'),
        ch('B) Sell upholstery cleaner ad packages', ['+$900 Cash', '+Ad Sat'], { cash: 900, ratings: 0.5, listeners: 100, adSat: 4 }, 'Sold out upholstery cleaning slots overnight.'),
        ch('C) Ignore the velvet sofa boom', ['Safe', '-Missed Buzz'], { cash: 0, ratings: -0.3, listeners: -40 }, 'Skipped the great damp-recliner craze.')
      ]),
    ev('gen_11', 'PARKING DRAMA', '🅿️', 2, 'Grocery Store Repaints Spaces Two Inches Narrower',
      'Shoppers at Piggly Wiggly are trapped in their sedans; Competitive Parking pundits demand emergency commentary.',
      [
        ch('A) Broadcast live tape-measure audits from the parking lot', ['++Ratings', '+Trust'], { cash: -250, ratings: 2.5, listeners: 540, trust: 3, morale: 3 }, 'Live parking-stripe tape measurement exposed two-inch grocery tyranny.'),
        ch('B) Offer body-shop and muffler sponsor tags all day', ['+$950 Cash', '+Ad Sat'], { cash: 950, ratings: 0.8, listeners: 150, adSat: 4 }, 'Dent-repair sponsors loved the tight-parking panic.'),
        ch('C) Defend narrow stalls as "compact civic efficiency"', ['--Trust', '-Ratings'], { cash: 0, ratings: -1.3, listeners: -280, trust: -4, adSat: 1 }, 'Defending narrow parking spots united pickup drivers against us.')
      ]),
    ev('gen_12', 'COUNTY FAIR', '🎡', 2, 'Prize Pumpkin Weighs 840 Pounds And Rolls Into Creek',
      'Farmer Clem\'s championship gourd snapped its winch strap and splashed into Mud Creek like a pumpkin submarine.',
      [
        ch('A) Air live creek-side pumpkin recovery play-by-play', ['++Ratings', '+Listeners'], { cash: -300, ratings: 2.8, listeners: 640, trust: 2, morale: 4 }, 'Listeners cheered as tow crews winched the runaway gourd ashore.'),
        ch('B) Run Honest Bob\'s Marine & Pumpkin Insurance jokes', ['+$750 Cash', '+Ad Sat'], { cash: 750, ratings: 1.5, listeners: 310, adSat: 3 }, 'Honest Bob ran custom gourd-collision ads during the recovery.'),
        ch('C) Keep playing classic country uninterrupted', ['Safe'], { cash: 0, ratings: -0.4, listeners: -80 }, 'Missed the great creek-pumpkin saga.')
      ]),
    ev('gen_13', 'TECHNICAL', '📻', 1, 'Antique Studio Turntable Plays Everything 11% Too Fast',
      'Waylon Jennings suddenly sounds like an energetic chipmunk; retirees are calling in confused.',
      [
        ch('A) Spend $650 immediately for belt & motor repair', ['-$650 Cash', '+Trust', '+FCC'], { cash: -650, ratings: 0.6, listeners: 120, trust: 3, fcc: 2, morale: 2 }, 'Fixed the studio turntable before chipmunk country drove off loyalists.'),
        ch('B) Lean into it as "Turbo Country Tuesday" until parts ship', ['+Ratings', '+Morale', '-Ad Sat'], { cash: 0, ratings: 2.1, listeners: 410, trust: -2, adSat: -3, morale: 3 }, 'Turbo Country Tuesday confused purists yet amused younger commuters.')
      ]),
    ev('gen_14', 'LOCAL NEWS', '🦝', 1, 'Raccoon Learns How To Open City Council Snack Vending Machine',
      'Security footage shows a masked bandit calmly selecting pretzel twists using exact quarters.',
      [
        ch('A) Crown the raccoon "Employee of the Month" on air', ['++Listeners', '+Morale'], { cash: 0, ratings: 2.4, listeners: 520, trust: 1, morale: 5 }, 'Vending-machine raccoon mascot merchandise delighted morning listeners.'),
        ch('B) Cover the city sanitation policy response seriously', ['+Trust', '+FCC'], { cash: 0, ratings: 0.9, listeners: 190, trust: 3, fcc: 2 }, 'Delivered sober public-building pest preparedness coverage.')
      ]),
    ev('gen_15', 'CIVIC SCANDAL', '📜', 2, 'Town Charter Found To Require Paying Dogcatcher In Maple Syrup',
      'A dusty 1911 bylaw stipulates municipal animal control salaries must be settled in Grade-A maple syrup.',
      [
        ch('A) Organize a listener maple-syrup salary relief drive', ['-$450 Cash', '++Trust', '+Listeners'], { cash: -450, ratings: 2.2, listeners: 520, trust: 6, morale: 4 }, 'Listener syrup donations rescued the county dogcatcher payroll.'),
        ch('B) Debate wacky century-old laws all afternoon on talk radio', ['+Ratings', '+Listeners'], { cash: 0, ratings: 2.3, listeners: 480, trust: 1, morale: 2 }, 'Old-bylaw call-in show uncovered three more absurd local rules.')
      ]),
    ev('gen_16', 'LOCAL FLAVOR', '🍩', 2, 'Donut Shop Introduces "Bait-Bucket Glaze" By Mistake',
      'A mislabeled bucket in the bakery kitchen created garlic-minnow glazed crullers that somehow sold out in 20 minutes.',
      [
        ch('A) Have hosts taste-test garlic-minnow crullers live on air', ['++Ratings', '+Morale', '-Stomachs'], { cash: -150, ratings: 2.9, listeners: 630, trust: 1, morale: 4 }, 'Live gagging and reluctant praise made the cruller review instant radio gold.'),
        ch('B) Issue food-safety allergy alerts calmly', ['+Trust', '+FCC'], { cash: 0, ratings: 0.7, listeners: 140, trust: 4, fcc: 2, adSat: 1 }, 'Prioritized seafood-allergy warnings over novelty food stunts.')
      ]),
    ev('gen_17', 'NEIGHBORHOOD', '📬', 1, 'Mail Carrier Goes Rogue Delivering Compliments Instead Of Bills',
      'Postman Earl held utility bills hostage for 48 hours and tucked handwritten poetry inside every mailbox.',
      [
        ch('A) Feature Earl\'s best mailbox poems on Morning Drive', ['++Trust', '+Listeners'], { cash: 0, ratings: 2.3, listeners: 540, trust: 5, morale: 4 }, 'Listeners cried happy tears hearing Earl\'s wholesome mailbox verses.'),
        ch('B) Report strictly on the postal delay & late-fee waivers', ['+Trust', '+FCC'], { cash: 0, ratings: 1.1, listeners: 210, trust: 3, fcc: 2 }, 'Helped residents arrange utility grace periods after the poetic mail pause.')
      ]),
    ev('gen_18', 'TRAFFIC', '🚜', 1, 'Parade Of Vintage Tractors Blocks Interstate On-Ramp At 5 MPH',
      'Seventeen restored 1953 tractors are cruising to the county fair at walking pace during rush hour.',
      [
        ch('A) Run live tractor-parade spotting & cheerful alternate routes', ['+Trust', '+Listeners'], { cash: 0, ratings: 1.8, listeners: 410, trust: 4, morale: 2 }, 'Saved commuters 40 minutes while celebrating vintage farm iron.'),
        ch('B) Let Mad Dog rant against slow farm machinery on evening drive', ['++Ratings', '--Rural Trust'], { cash: 0, ratings: 2.8, listeners: 520, trust: -5, adSat: -2 }, 'Anti-tractor rant spiked talk calls and outraged farm sponsors.')
      ]),
    ev('gen_19', 'WEATHER ODDITY', '🐸', 2, 'Ten Thousand Tiny Frogs Colonize Drive-In Movie Speaker Posts',
      'Every time the cinema plays trailers, ten thousand tree frogs ribbit in perfect 120-BPM unison.',
      [
        ch('A) Broadcast a midnight "Amphibian Top 40" remote special', ['++Ratings', '+Listeners'], { cash: -250, ratings: 2.6, listeners: 590, trust: 2, morale: 4 }, 'Midnight frog-chorus remote became a late-night listener favorite.'),
        ch('B) Promote drive-in pest-control sponsors', ['+$800 Cash', '+Ad Sat'], { cash: 800, ratings: 0.5, listeners: 90, adSat: 4 }, 'Sold urgent pest-control packages to the drive-in owners.')
      ]),
    ev('gen_20', 'SPORTS', '🎳', 2, 'Bowling Alley Splits Town Down The Middle Over Bumper Rails',
      'League night erupted when the defending champion secretly bowled with toddler gutter bumpers deployed.',
      [
        ch('A) Air emergency "Bumpergate" sports tribunal live', ['++Ratings', '+Listeners'], { cash: 0, ratings: 2.7, listeners: 580, trust: 1, morale: 3 }, 'Bumpergate call-in debate jammed station phone lines for three hours.'),
        ch('B) Sponsor a clean rematch out of station petty cash', ['-$500 Cash', '++Trust'], { cash: -500, ratings: 1.5, listeners: 340, trust: 5, morale: 2 }, 'Station-sponsored rematch restored bowling league peace.')
      ]),
    ev('gen_21', 'PUBLIC WORKS', '💧', 3, 'Water Tower Briefly Pumps Lukewarm Lemon-Lime Soda',
      'A cross-connected syrup tanker at the bottling plant tinted municipal tap water neon citrus for three hours.',
      [
        ch('A) Issue immediate boil/don\'t-brush-with-soda advisories', ['++Trust', '+FCC'], { cash: -200, ratings: 1.8, listeners: 420, trust: 6, fcc: 3 }, 'Clear health warnings kept kids from shampooing with lemon-lime fizz.'),
        ch('B) Joke about "Free Faucet Soda Day" on air', ['++Ratings', '--Trust', '--FCC'], { cash: 0, ratings: 3.1, listeners: 690, trust: -6, fcc: -4 }, 'Calling contaminated tap water a free beverage promo angered health officials.')
      ]),
    ev('gen_22', 'MYSTERY', '🛸', 3, 'Crop Circle Shaped Like A Bass Pro Receipt Appears In Rye Field',
      'Farmers woke up to a 300-foot flattened pattern listing $47.92 in crankbaits and beef jerky.',
      [
        ch('A) Send hosts out with flashlights for live UFO/Fishing coverage', ['++Ratings', '+Listeners'], { cash: -350, ratings: 3.1, listeners: 740, trust: 0, fcc: -1, morale: 4 }, 'UFO receipt mystery united sci-fi buffs and weekend anglers.'),
        ch('B) Expose the local pranksters responsibly on news', ['+Trust', '+FCC'], { cash: 0, ratings: 1.3, listeners: 280, trust: 4, fcc: 2 }, 'Calmly tracked down the college tractor pranksters behind the receipt circle.')
      ]),
    ev('gen_23', 'LOCAL HERO', '🐕', 1, 'Stray Hound Named "Dial Tone" Predicts Mail Trucks Two Miles Out',
      'A sleepy hound hanging out behind the station porch howls exactly 90 seconds before every delivery van arrives.',
      [
        ch('A) Make Dial Tone the official station porch correspondent', ['++Trust', '+Morale', '-$150 Treats'], { cash: -150, ratings: 1.9, listeners: 450, trust: 5, morale: 6 }, 'Listeners tuned in daily to hear Dial Tone announce delivery arrivals.'),
        ch('B) Keep dogs out of the broadcast booth for professionalism', ['+FCC', '-Morale'], { cash: 0, ratings: 0.2, listeners: 40, fcc: 2, morale: -3 }, 'Banned Dial Tone from the hallway, drawing groans from interns.')
      ]),
    ev('gen_24', 'LOCAL DRAMA', '🎺', 2, 'High School Marching Band Accidentsly Plays Rival Fight Song At Pep Rally',
      'Freshman tubas read the wrong flip-folder sheet, triggering a 15-minute bleacher boo-off.',
      [
        ch('A) Invite the tuba section in studio to play our station jingle', ['+Trust', '+Listeners', '+Morale'], { cash: -200, ratings: 2.0, listeners: 480, trust: 4, morale: 5 }, 'Forgiveness tuba-section concert warmed hearts across both school districts.'),
        ch('B) Play the botched fight-song recording on loop for laughs', ['+Ratings', '--Trust'], { cash: 0, ratings: 2.5, listeners: 460, trust: -5, fcc: -1 }, 'Mocking teenager tuba players generated ratings and furious PTA calls.')
      ]),
    ev('gen_25', 'FINANCE', '🪙', 3, 'Armored Coin Truck Spills $40,000 In Quarters On Bridge',
      'Rush-hour drivers abandoned running cars to scoop shiny quarters off the asphalt.',
      [
        ch('A) Air urgent highway safety warnings & lawful return info', ['++Trust', '+FCC'], { cash: 0, ratings: 1.6, listeners: 380, trust: 5, fcc: 3 }, 'Cooperated with state patrol to clear coin-hunters off the bridge safely.'),
        ch('B) Broadcast live "Quarter Dash" odds like horse racing', ['++Ratings', '--FCC', '--Trust'], { cash: 0, ratings: 3.4, listeners: 790, trust: -5, fcc: -5 }, 'Play-by-play of commuters diving for quarters amused listeners and horrified police.')
      ]),
    ev('gen_26', 'CIVIC', '🎈', 2, 'Rotary Club Hot Air Balloon Lands Gently In Car Wash',
      'Low wind dropped the Rotary Club\'s sponsorship balloon onto the automatic foam brushes.',
      [
        ch('A) Broadcast live interviews with soapy balloonists', ['+Ratings', '+Listeners'], { cash: -150, ratings: 2.1, listeners: 470, trust: 2, morale: 3 }, 'Soapy balloon-landing interviews cheered up afternoon traffic.'),
        ch('B) Run sudden Car Wash & Wax sponsor promos', ['+$850 Cash', '+Ad Sat'], { cash: 850, ratings: 0.7, listeners: 140, adSat: 4 }, 'Car wash sponsors bought immediate tie-in spots.')
      ]),
    ev('gen_27', 'AGRICULTURE', '🍉', 2, 'Giant Watermelon Explodes On Courthouse Steps In Heat',
      'Fermenting quietly in 98-degree sun, the 190-pound pride melon detonated during the noon bell.',
      [
        ch('A) Call Department of Boom Prevention for official melon forensic report', ['+Ratings', '+Trust'], { cash: 0, ratings: 2.1, listeners: 490, trust: 3, morale: 3 }, 'Boom Prevention confirmed high-pressure melon rind posed zero ongoing hazard.'),
        ch('B) Speculate recklessly about acoustic weapons', ['++Ratings', '--Trust', '--FCC'], { cash: 0, ratings: 3.0, listeners: 620, trust: -5, fcc: -4 }, 'Watermelon conspiracy rumors triggered unnecessary panic downtown.')
      ]),
    ev('gen_28', 'TECH CRASH', '💾', 4, 'County Tax Office Upgrades To Computers, Immediately Prints Everyone\'s Dog Licenses Twice',
      'Eight hundred bewildered poodles received jury summonses and double sewer bills.',
      [
        ch('A) Host a cheerful "Canine Jury Duty" human-interest morning', ['++Listeners', '+Trust'], { cash: 0, ratings: 2.4, listeners: 570, trust: 4, morale: 4 }, 'Dogs "testifying" live over the phone delighted the entire county.'),
        ch('B) Air helpful clerk helpline numbers & filing instructions', ['+Trust', '+FCC'], { cash: 0, ratings: 1.0, listeners: 220, trust: 4, fcc: 2 }, 'Guided confused residents through the great poodle-billing glitch.')
      ]),
    ev('gen_29', 'CIVIC', '🚦', 3, 'Downtown Traffic Light Stuck Green In All Four Directions',
      'Instead of crashing, polite small-town drivers froze in a 4-way courtesy standoff waving each other through for an hour.',
      [
        ch('A) Play smooth jazz & narrate the polite hornless standoff', ['+Ratings', '+Trust'], { cash: 0, ratings: 1.9, listeners: 430, trust: 4, morale: 3 }, 'Narrated the most courteous gridlock in state highway history.'),
        ch('B) Blast urgent public-works dispatch until fixed', ['+FCC', '+Trust'], { cash: 0, ratings: 1.1, listeners: 240, trust: 3, fcc: 2 }, 'Fast dispatch reporting brought repair crews out in record time.')
      ]),
    ev('gen_30', 'OUTDOORS', '🦌', 3, 'Antlered Deer Walks Into Hardware Store, Picks Up Duct Tape',
      'Security video shows an 8-point buck nudging silver duct tape off the shelf and strolling calmly out the automatic door.',
      [
        ch('A) Launch "Hardware Buck" listener sighting hotline', ['++Listeners', '+Ratings'], { cash: -150, ratings: 2.6, listeners: 610, trust: 2, morale: 4 }, 'Hardware Buck sightings kept callers ringing all weekend.'),
        ch('B) Sell hardware-store tie-in ads ("Even Deer Trust Our Tape!")', ['+$1,050 Cash', '+Ad Sat'], { cash: 1050, ratings: 1.1, listeners: 220, adSat: 5 }, 'Hardware sponsor jumped at the Hardware Buck tagline.')
      ]),
    ev('gen_31', 'LOCAL FEUD', '🥧', 4, 'Two Rival Gravy Diners Hold Simultaneous "Secret Recipe" Taste-Offs',
      'Gertie\'s and Big Al\'s parked dueling gravy wagons across the street from our studio entrance.',
      [
        ch('A) Host an impartial blind gravy taste test on afternoon block', ['++Ratings', '+Ad Sat'], { cash: 400, ratings: 2.5, listeners: 560, trust: 2, adSat: 4, morale: 5 }, 'Blind gravy taste-test united diner regulars and delighted Gertie.'),
        ch('B) Take exclusive cash sponsorship from one diner only', ['+$1,350 Cash', '-Trust', '-Rival Ad'], { cash: 1350, ratings: 1.0, listeners: 150, trust: -3, adSat: -2 }, 'Exclusive gravy payout offended half the town\'s breakfast loyalists.')
      ]),
    ev('gen_32', 'PUBLIC SAFETY', '🐝', 2, 'Beekeeper\'s Trailer Pops Open Behind Post Office',
      'Four hundred thousand honeybees are peacefully swarming a parked mail Jeep while humming C-sharp.',
      [
        ch('A) Broadcast bee-avoidance routes & support local beekeepers', ['+Trust', '+FCC'], { cash: -200, ratings: 1.5, listeners: 340, trust: 5, fcc: 2 }, 'Guided pedestrians safely past the humming mail Jeep.'),
        ch('B) Air dramatic swarm disaster sound effects for ratings', ['++Ratings', '--Trust', '-FCC'], { cash: 0, ratings: 2.9, listeners: 590, trust: -5, fcc: -4 }, 'Fake killer-bee sound effects sparked an unnecessary elementary lockdown.')
      ]),
    ev('gen_33', 'NOSTALGIA', '📼', 3, 'Time Capsule Buried In 1969 Dug Up Early—Contains 40 Cassette Tapes Of WSTF',
      'Before anyone checks what is on the magnetic tape, townsfolk gather around Town Square.',
      [
        ch('A) Digitize & air the 1969 station tapes as a heritage special', ['-$500 Tech', '++Trust', '++Listeners'], { cash: -500, ratings: 3.0, listeners: 780, trust: 6, morale: 5 }, 'Lost 1969 broadcast voices moved three generations of listeners to tears.'),
        ch('B) Auction sponsorships on the heritage playback hour', ['+$1,100 Cash', '+Ratings'], { cash: 1100, ratings: 1.8, listeners: 420, adSat: 4 }, 'Heritage playback sponsors loved the nostalgic ratings bump.')
      ]),
    ev('gen_34', 'ABSURD CIVIC', '🪑', 2, 'Lawn Chair Left On Curb Evolves Into Protected Landmark',
      'A rusted aluminum folding chair sat untouched on Oak Street so long the Historical Society bolted a brass plaque onto it.',
      [
        ch('A) Celebrate "The Chair" with tongue-in-cheek heritage radio spots', ['+Ratings', '+Listeners'], { cash: 0, ratings: 2.1, listeners: 460, trust: 2, morale: 3 }, 'Listeners began leaving tribute donuts beside the historic Oak Street chair.'),
        ch('B) Critique wasteful historical-society bureaucracy', ['+Ratings', '-Trust'], { cash: 0, ratings: 1.6, listeners: 280, trust: -3, fcc: 1 }, 'Scolding the historical society alienated elderly club donors.')
      ]),
    ev('gen_35', 'COMPETITION', '🏆', 4, 'County Spelling Bee Ends In 19-Round Tie Over "Bass"',
      'Judges and parents are arguing whether "largemouth" is hyphenated; the gymnasium refuses to disperse.',
      [
        ch('A) Broadcast the final sudden-death spelling rounds live', ['+Trust', '+Listeners'], { cash: -200, ratings: 2.2, listeners: 520, trust: 4, morale: 2 }, 'Live spelling-bee overtime gave families nail-biting evening drama.'),
        ch('B) Host angry call-ins accusing judges of dictionary bias', ['+Ratings', '-Trust'], { cash: 0, ratings: 2.4, listeners: 430, trust: -4, fcc: -1 }, 'Dictionary conspiracy calls entertained truckers and annoyed teachers.')
      ]),
    ev('gen_36', 'REGIONAL', '🚂', 4, 'Freight Train Carrying 90 Tons Of Rubber Ducks Halts On Crossing',
      'Every downtown crossing is blocked for four hours; a single crate shifted and spilled yellow ducks along the ditch.',
      [
        ch('A) Run live crossing detours & duck-adoption charity shout-outs', ['++Trust', '+Listeners'], { cash: -250, ratings: 2.3, listeners: 560, trust: 5, morale: 4 }, 'Helpful crossing detours turned a 4-hour train jam into a charity event.'),
        ch('B) Sell bumper-to-bumper commuter captive-audience ad reads', ['+$1,200 Cash', '+Ad Sat', '-Ratings'], { cash: 1200, ratings: -0.9, listeners: -120, adSat: 5 }, 'Monetized stranded commuters with rapid-fire radio spots.')
      ]),
    ev('gen_37', 'HEALTH FAD', '🥒', 3, 'Local Gym Launches "Pickle-Juice Marathon" Conditioning Craze',
      'Half the county is jogging down Main Street sipping dill brine from mason jars.',
      [
        ch('A) Cover the craze playfully & invite local doctors to weigh in', ['+Trust', '+Ratings'], { cash: 0, ratings: 1.9, listeners: 420, trust: 3, morale: 2 }, 'Balanced pickle-brine wellness reporting kept joggers hydrated.'),
        ch('B) Sell suspicious unlicensed miracle-brine endorsements', ['+$1,400 Cash', '--Trust', '--FCC'], { cash: 1400, ratings: 1.2, listeners: 180, trust: -6, fcc: -5 }, 'Pushing miracle pickle juice drew an angry medical-board complaint.')
      ]),
    ev('gen_38', 'ANIMAL CAPER', '🐐', 3, 'Goat Climbs Radio Guy-Wire Anchor And Watches Studio Window',
      'A determined Alpine goat is chewing thoughtfully near our secondary tower guy wire, glaring directly at the producer.',
      [
        ch('A) Call Corporate Goat Retrieval immediately before signal drops', ['-$600 Cash', '+FCC', '+Signal Safe'], { cash: -600, ratings: 0.8, listeners: 150, trust: 2, fcc: 3 }, 'Professionals safely coaxed the tower-curious goat down with alfalfa.', { flagGrant: 'sawGoatEvent' }),
        ch('B) Put him on webcam/radio as "Goat Boss" until closing time', ['++Ratings', '-FCC Risk'], { cash: 0, ratings: 2.8, listeners: 620, trust: 0, fcc: -3, morale: 4 }, 'Keeping "Goat Boss" at the tower anchor popped ratings and chewed one coax strap.', { flagGrant: 'sawGoatEvent' })
      ]),
    ev('gen_39', 'CIVIC', '🎪', 2, 'Traveling Mechanical Bull Breaks Down In Front Of Church',
      'The mechanical bull is stuck on setting 7 ("Tornado") outside First Baptist during Wednesday potluck.',
      [
        ch('A) Help locate an electrician on air so potluck can resume', ['++Trust', '+Listeners'], { cash: 0, ratings: 1.7, listeners: 380, trust: 5, morale: 2 }, 'Found a volunteer electrician in 11 minutes to tame the rogue mechanical bull.'),
        ch('B) Take live over/under bets on who can ride the casserole bull', ['++Ratings', '--Trust', '--FCC'], { cash: 0, ratings: 3.1, listeners: 650, trust: -6, fcc: -5 }, 'Taking on-air rodeo bets outside a church drew fierce community scolding.')
      ]),
    ev('gen_40', 'COMMERCE', '🛒', 3, 'Hardware Store Accidentally Orders 10,000 Left-Handed Gloves',
      'Owner Gus begs the radio station to help unload five tons of solitary left gloves before his lease renews.',
      [
        ch('A) Run a goofy "Lefty Appreciation Week" Swap Shop tie-in', ['+$650 Cash', '+Ad Sat', '+Trust'], { cash: 650, ratings: 1.8, listeners: 400, trust: 3, adSat: 5 }, 'Sold 6,000 left-handed gloves in three days and earned Gus\'s lifelong gratitude.'),
        ch('B) Mock Gus\'s ordering blunder ruthlessly', ['+Ratings', '--Ad Sat'], { cash: 0, ratings: 2.2, listeners: 390, trust: -2, adSat: -6 }, 'Roasting a local merchant\'s mistake made other retail advertisers nervous.')
      ]),
    ev('gen_41', 'WEATHER LORE', '☁️', 4, 'Suspiciously Square Cloud Hovers Unmoving Over Bowling Alley',
      'For six straight hours, one crisp 90-degree geometric cloud has refused to blow away in a 20-knot breeze.',
      [
        ch('A) Air Suspicious Cloud Hotline style call-ins & interviews', ['++Ratings', '+Listeners'], { cash: 0, ratings: 3.0, listeners: 720, trust: -1, fcc: -1, morale: 4 }, 'Square-cloud hotline drew ecstatic calls from three neighboring counties.'),
        ch('B) Consult atmospheric physics professor for calm explanation', ['+Trust', '+FCC'], { cash: -250, ratings: 1.4, listeners: 310, trust: 4, fcc: 2 }, 'Explained micro-thermal updrafts cleanly without losing credibility.')
      ]),
    ev('gen_42', 'CIVIC PRIDE', '🗽', 5, 'Town Votes To Erect 18-Foot Fiberglass Bass Statue Downtown',
      'The monument committee needs $15,000; half the town wants the giant bass, half wants library roof repairs.',
      [
        ch('A) Back the Giant Bass Statue & host fundraising marathon', ['-$800 Pledge', '++Listeners', '+Morale'], { cash: -800, ratings: 2.7, listeners: 700, trust: 1, morale: 5 }, 'Station led the charge for the towering downtown fiberglass largemouth.'),
        ch('B) Champion the Library Roof instead', ['++Trust', '+FCC', '-Bass Fans'], { cash: -500, ratings: 1.4, listeners: 320, trust: 6, fcc: 3 }, 'Backed library roof repairs, winning quiet respect from civic readers.')
      ]),
    ev('gen_43', 'POLITICS', '🗳️', 5, 'County Assessor Caught Using Magic 8-Ball For Property Values',
      'Leaked minutes confirm tough commercial appraisals were decided by "Ask Again Later."',
      [
        ch('A) Break the Magic 8-Ball investigative exclusive immediately', ['++Trust', '++Ratings', '-Political Ads'], { cash: -300, ratings: 3.5, listeners: 890, trust: 6, adSat: -2, fcc: 2 }, 'Investigative scoop forced transparent county property reassessments.'),
        ch('B) Spike the story to avoid offending courthouse advertisers', ['+Ad Sat', '--Trust'], { cash: 600, ratings: -0.9, listeners: -200, trust: -6, adSat: 4 }, 'Word leaked that the station buried the 8-Ball tax scandal.')
      ]),
    ev('gen_44', 'COMMUNITY', '🧺', 2, 'Church Picnic Potato Salad Inspires Great Regional Debate: Mustard vs. Sweet',
      'Tempers flare across four parishes over whether dill pickle relish belongs inside Sunday potato salad.',
      [
        ch('A) Host a diplomatic "All Salads Welcome" on-air picnic', ['+Trust', '+Listeners'], { cash: -200, ratings: 1.9, listeners: 450, trust: 4, morale: 3 }, 'United mustard and sweet-relish factions at a peaceful Sunday picnic.'),
        ch('B) Stir the pot aggressively on Talk Radio for 4 hours', ['++Ratings', '-Trust'], { cash: 0, ratings: 2.9, listeners: 610, trust: -3, morale: 1 }, 'Fierce potato-salad warfare turned morning drive into culinary combat.')
      ]),
    ev('gen_45', 'RURAL', '🚜', 3, 'Self-Driving Lawn Mower Escapes Yard And Joins 5K Charity Run',
      'A homeowner\'s robotic mower slipped its boundary wire and finished 14th overall in the Fun Run.',
      [
        ch('A) Interview the mower\'s baffled owner & award it a plastic medal', ['+Ratings', '+Listeners'], { cash: -100, ratings: 2.3, listeners: 510, trust: 2, morale: 4 }, 'Robot-mower marathon finish became a viral small-town feel-good story.'),
        ch('B) Warn runners about rogue blades & safety liability', ['+Trust', '+FCC'], { cash: 0, ratings: 1.0, listeners: 210, trust: 3, fcc: 2 }, 'Prioritized runner safety notices along the race course.')
      ]),
    ev('gen_46', 'TECH', '📡', 4, 'Nearby Ham Operator Accidentally Transmits Baby Monitor Into Car Stereos',
      'For twenty minutes, every commuter passing Exit 9 heard lullabies and aggressive snack negotiation.',
      [
        ch('A) Help locate the frequency leak & fix interference quietly', ['+Trust', '+FCC'], { cash: -150, ratings: 1.1, listeners: 240, trust: 4, fcc: 4 }, 'Tracked down the stray baby-monitor signal and protected local privacy.'),
        ch('B) Do live dramatic commentary over the toddler nap negotiation', ['++Ratings', '--FCC', '--Trust'], { cash: 0, ratings: 3.1, listeners: 660, trust: -6, fcc: -6 }, 'Rebroadcasting a private baby monitor triggered serious FCC privacy scolding.')
      ]),
    ev('gen_47', 'MUSIC', '🎻', 2, 'Bluegrass Legend Visits Pawn Shop, Buys Back His 1958 Mandolin',
      'Word spreads that acoustic icon Lester Pickens is playing impromptu tunes next to the used power tools.',
      [
        ch('A) Clear an hour & record an acoustic live studio drop-in', ['-$450 Cash', '++Trust', '++Listeners'], { cash: -450, ratings: 3.2, listeners: 840, trust: 5, morale: 6 }, 'Impromptu pawn-shop mandolin reunion broadcast became an instant classic.'),
        ch('B) Send an intern for a quick 2-minute tape quote only', ['+Small Lift'], { cash: 0, ratings: 1.0, listeners: 200, trust: 1 }, 'Aired a brief quote from Lester Pickens during evening news.')
      ]),
    ev('gen_48', 'ABSURD', '🦆', 3, 'Duck Walks Into Diner Daily At 11:45 AM For Rye Toast',
      'Waitresses reserve booth #3 for "Arthur the Regular," who tips in shiny bottle caps.',
      [
        ch('A) Sponsor Arthur\'s rye-toast tab & broadcast daily diner check-ins', ['-$200 Cash', '++Trust', '+Listeners'], { cash: -200, ratings: 2.2, listeners: 520, trust: 5, morale: 4 }, 'Diner-duck segments warmed hearts across morning commutes.'),
        ch('B) Ignore novelty animal fluff & keep news hard-edged', ['Safe'], { cash: 0, ratings: 0.1, listeners: 20 }, 'Passed on covering Arthur the Diner Duck.')
      ]),
    ev('gen_49', 'TRANSPORT', '🚌', 4, 'School Bus Driver Takes Scenic Detour Past Historic Barn, Wins Award',
      'Kids arrived 12 minutes late, all knowing three facts about 19th-century haylofts.',
      [
        ch('A) Feature the driver on Morning Drive & honor local history', ['+Trust', '+Listeners'], { cash: 0, ratings: 1.8, listeners: 410, trust: 4, morale: 3 }, 'Honoring the history-loving bus driver boosted civic goodwill.'),
        ch('B) Debate strict schedule discipline vs. joy on Talk Radio', ['+Ratings'], { cash: 0, ratings: 2.0, listeners: 380, trust: 0 }, 'Talk callers debated bus schedules versus roadside education.')
      ]),
    ev('gen_50', 'LOCAL BIZ', '💈', 2, 'Barber Shop Quartet Refuses To Stop Harmonizing Outside City Hall',
      'Four barbers protesting parking meters have sung unbroken four-part harmonies for 14 hours straight.',
      [
        ch('A) Broadcast their protest medley live & bring them warm tea', ['+Ratings', '+Listeners', '+Morale'], { cash: -150, ratings: 2.4, listeners: 550, trust: 3, morale: 4 }, 'Live barbershop protest concert charmed even the meter maids.'),
        ch('B) Air pro-city-parking commentary against sidewalk crowding', ['-Trust', '+City Ad'], { cash: 400, ratings: 0.6, listeners: 80, trust: -3, adSat: 2 }, 'Backed municipal parking enforcement over the singing barbers.')
      ]),
    // Batch 51-105 concise rich events
    ev('gen_51', 'LOCAL DRAMA', '🧊', 3, 'Ice Sculpture Of Mayor Melts Into Suspicious Puddle Shape',
      'Mid-July sun turned the Chamber of Commerce gala centerpiece into something vaguely resembling a startled badger.',
      [
        ch('A) Run lighthearted puddle-shape call-ins', ['+Ratings', '+Morale'], { cash: 0, ratings: 2.1, listeners: 450, trust: 1, morale: 3 }, 'Callers debated whether the melted mayor looked more like a badger or an otter.'),
        ch('B) Keep Chamber coverage strictly complimentary', ['+Ad Sat', '+Trust'], { cash: 0, ratings: 0.7, listeners: 140, trust: 2, adSat: 3 }, 'Chamber sponsors appreciated our respectful gala recap.')
      ]),
    ev('gen_52', 'MYSTERY', '🔑', 2, 'Box Of 600 Unlabeled Brass Keys Turns Up In Studio Closet',
      'Nobody since 1978 knows what any of them unlock, though one is taped with "DO NOT USE IN RAIN."',
      [
        ch('A) Invite listeners to test keys around town on live radio', ['++Listeners', '+Ratings', '-FCC Risk'], { cash: -150, ratings: 2.6, listeners: 620, trust: 0, fcc: -2, morale: 5 }, 'Mystery brass-key hunt unlocked three abandoned lockers and one antique soda machine.'),
        ch('B) Lock them safely in a vault & focus on news', ['+FCC', 'Safe'], { cash: 0, ratings: 0.3, listeners: 60, fcc: 2 }, 'Stored the mysterious studio keys safely out of intern reach.')
      ]),
    ev('gen_53', 'FESTIVAL', '🌽', 3, 'Sweet Corn Eating Champion Disqualified For Hidden Butter Straw',
      'Fairground scandal erupts after judges inspect runner-up\'s suspiciously glossy cob technique.',
      [
        ch('A) Air full slow-motion audio breakdown of "Butter-Straw-Gate"', ['++Ratings', '+Listeners'], { cash: 0, ratings: 2.7, listeners: 600, trust: 1, morale: 3 }, 'Investigative corn-eating commentary gripped fair fans.'),
        ch('B) Sponsor an honest tie-breaker round', ['-$450 Cash', '+Trust'], { cash: -450, ratings: 1.5, listeners: 340, trust: 5, morale: 2 }, 'Station-sponsored corn rematch settled fairground honor.')
      ]),
    ev('gen_54', 'TECH', '📞', 4, 'Phone Company Crosses Lines: Callers Ordering Pizza Reach Our Live Studio',
      'Four straight listeners tried ordering double pepperoni on the open-line request number.',
      [
        ch('A) Take their pizza orders live & call the pizzeria on air', ['++Ratings', '+Morale', '-$250 Pies'], { cash: -250, ratings: 2.8, listeners: 640, trust: 3, morale: 5 }, 'Buying surprised callers actual pepperoni pies live on air turned into instant legend.'),
        ch('B) Put up an automated error loop until lines clear', ['-Ratings', 'Save Cash'], { cash: 0, ratings: -0.9, listeners: -150, trust: -1 }, 'Automated recording frustrated hungry phone-crossed callers.')
      ]),
    ev('gen_55', 'COMMERCE', '⛽', 5, 'Gas Station Price War Hits $0.69 A Gallon For 4 Hours',
      'Two rival stations across Highway 9 cut prices until lines stretch three miles.',
      [
        ch('A) Give real-time line-wait & cheapest-pump dispatches', ['++Trust', '++Listeners'], { cash: 0, ratings: 2.6, listeners: 680, trust: 5, morale: 2 }, 'Live fuel-price dispatches saved drivers hours in line.'),
        ch('B) Charge the rival stations for rapid-fire flash promo ads', ['+$1,400 Cash', '+Ad Sat'], { cash: 1400, ratings: 1.1, listeners: 240, adSat: 5 }, 'Cashed in handsomely on the Highway 9 gas price war.')
      ]),
    ev('gen_56', 'LOCAL', '🎨', 4, 'Crosswalk Painted With 3D Optical Illusion Stops Every Pickup Truck',
      'Drivers slam their brakes thinking floating white bars are concrete barriers.',
      [
        ch('A) Warn motorists calmly & interview city safety planners', ['+Trust', '+FCC'], { cash: 0, ratings: 1.5, listeners: 320, trust: 4, fcc: 2 }, 'Clarified the 3D crosswalk artwork before any rear-end collisions occurred.'),
        ch('B) Broadcast live reactions of startled drivers at the corner', ['++Ratings', '-Trust'], { cash: 0, ratings: 2.7, listeners: 540, trust: -3, morale: 3 }, 'Live crosswalk brake-slam commentary drew laughs and angry safety letters.')
      ]),
    ev('gen_57', 'WILDLIFE', '🦝', 5, 'Opossum Breaks Into Choir Loft & Harmonizes During Hymn',
      'Sunday broadcast picked up a surprisingly rhythmic screech right on the third chorus.',
      [
        ch('A) Air the unedited hymn tape & raise $500 for wildlife shelter', ['-$500 Cash', '++Trust', '+Listeners'], { cash: -500, ratings: 2.5, listeners: 590, trust: 6, morale: 4 }, 'Choir-opossum charity drive delighted congregations countywide.'),
        ch('B) Edit out the opossum quietly out of church reverence', ['+FCC', '+Trust'], { cash: 0, ratings: 0.7, listeners: 150, trust: 2, fcc: 2 }, 'Quietly edited the choir tape to preserve Sunday dignity.')
      ]),
    ev('gen_58', 'HERITAGE', '🚂', 6, 'Retired Train Whistle Mounted On Grain Silo Blows Every Noon At 115 Decibels',
      'Windows rattle half a mile away, yet half the town loves setting watches by it.',
      [
        ch('A) Sync the station\'s noon news chime directly to the silo whistle', ['++Listeners', '+Trust'], { cash: -200, ratings: 2.1, listeners: 490, trust: 4, morale: 4 }, 'Live noon whistle-chime became an iconic county tradition.'),
        ch('B) Lead an anti-noise campaign against the silo horn', ['+Ratings', '--Rural Trust'], { cash: 0, ratings: 2.0, listeners: 340, trust: -5, adSat: -2 }, 'Attacking the beloved noon whistle alienated longtime rural listeners.')
      ]),
    ev('gen_59', 'LOCAL', '🚤', 4, 'Homemade Paddlewheel Boat Launches In Flooded Ditch, Declares Ferry Service',
      'Captain Gus is charging fifty cents to ferry pedestrians across Elm Street.',
      [
        ch('A) Give Captain Gus free live traffic-ferry plugs', ['+Listeners', '+Trust'], { cash: 0, ratings: 2.0, listeners: 460, trust: 3, morale: 3 }, 'Promoted Gus\'s whimsical 50-cent street ferry during rain cleanup.'),
        ch('B) Report safety liabilities to city inspectors', ['+FCC', '-Listeners'], { cash: 0, ratings: -0.6, listeners: -120, trust: 1, fcc: 3 }, 'Safety report shut down the popular Elm Street paddleboat.')
      ]),
    ev('gen_60', 'ABSURD', '🎳', 5, 'Bowling Ball Rolls Four Miles Downhill After Trunk Latch Fails',
      'A neon-pink 16-pound ball rolled uninterrupted down Ridge Road, clipping three mailboxes and a lawn gnome.',
      [
        ch('A) Broadcast live mileage tracking of the runaway bowling ball', ['++Ratings', '+Listeners'], { cash: 0, ratings: 2.9, listeners: 660, trust: 2, morale: 4 }, 'Listeners lined Ridge Road cheering the runaway 16-pound strike.'),
        ch('B) Air calm road-hazard notices only', ['+Trust'], { cash: 0, ratings: 1.0, listeners: 210, trust: 3 }, 'Delivered quick road-hazard alerts for Ridge Road.')
      ]),
    ev('gen_61', 'CIVIC', '📚', 3, 'Library Book Return Box Swallows Mayor\'s Umbrella And Won\'t Give It Back',
      'A 1954 spring-loaded book drop clamped tight on the Mayor\'s prized tartan umbrella.',
      [
        ch('A) Air cheeky live hostage updates from the library steps', ['+Ratings', '+Morale'], { cash: 0, ratings: 2.0, listeners: 440, trust: 1, morale: 4 }, 'Book-drop umbrella standoff kept morning listeners chuckling.'),
        ch('B) Sponsor a new library drop box ($600)', ['-$600 Cash', '++Trust'], { cash: -600, ratings: 1.3, listeners: 310, trust: 6, morale: 2 }, 'Funded a modern library drop box, rescuing the Mayor\'s umbrella.')
      ]),
    ev('gen_62', 'SPORTS', '🏈', 5, 'High School Mascot Costume Lost Before Playoff Kickoff',
      'The fighting Bulldog suit was accidentally left on a lumber truck bound for Alabama.',
      [
        ch('A) Put out an all-points highway broadcast to intercept the Bulldog suit', ['++Trust', '++Listeners'], { cash: -250, ratings: 2.8, listeners: 710, trust: 5, morale: 5 }, 'Truckers relayed the missing Bulldog suit back just in time for kickoff!'),
        ch('B) Suggest Dave The Intern wear cardboard ears instead', ['+Morale', '+Ratings', '-Dignity'], { cash: 0, ratings: 1.9, listeners: 380, trust: 1, morale: 3 }, 'Dave\'s cardboard mascot ears drew laughs and zero intimidation.')
      ]),
    ev('gen_63', 'COMMERCE', '🐟', 4, 'Bait Shop Installs 24-Hour Live Minnow ATM Next To Laundromat',
      'Swipe a card at 3 AM, receive a chilled pint of shiners and one moist washcloth.',
      [
        ch('A) Broadcast live from the ribbon-cutting at 2:00 AM', ['+Ratings', '+Listeners', '+Ad Sat'], { cash: 400, ratings: 2.3, listeners: 520, trust: 2, adSat: 4 }, 'Late-night anglers swarmed the Minnow ATM grand opening.'),
        ch('B) Question sanitary proximity to the spin dryers on air', ['+Trust', '-Sponsor'], { cash: 0, ratings: 1.5, listeners: 290, trust: 3, adSat: -3 }, 'Raised health questions about bait-and-laundry vending.')
      ]),
    ev('gen_64', 'LOCAL', '🎻', 6, 'Fiddler Plays 36 Hours Straight To Break County Record In Hardware Window',
      'Half the street is square-dancing on the sidewalk; the other half wants to sleep.',
      [
        ch('A) Carry the final record-breaking hour live on air', ['+Listeners', '+Trust'], { cash: -200, ratings: 2.4, listeners: 560, trust: 3, morale: 4 }, 'Broadcast the victorious final bow of the 36-hour hardware fiddle marathon.'),
        ch('B) Side with sleepless neighbors & urge quiet curfew', ['+FCC', '-Listeners'], { cash: 0, ratings: -0.7, listeners: -160, trust: 1, fcc: 2 }, 'Urging curfew dampened the street fiddle celebration.')
      ]),
    ev('gen_65', 'TECH', '🎙️', 7, 'Ghostly 1940s Swing Music Bleeds Onto Studio Phone Lines Every Night',
      'Whenever humidity tops 88%, our studio hold button plays crisp Glenn Miller through rusted fence wire.',
      [
        ch('A) Let callers enjoy the mystery phantom broadcast overnight', ['+Ratings', '+Listeners'], { cash: 0, ratings: 2.5, listeners: 590, trust: 1, morale: 3 }, 'Humidity-powered phantom swing music enchanted night owls.'),
        ch('B) Pay an RF tech $900 to clean corroded ground straps', ['-$900 Cash', '+FCC'], { cash: -900, ratings: 0.4, listeners: 90, trust: 2, fcc: 4 }, 'Restored spotless grounding across the studio phone bridge.')
      ]),
    ev('gen_66', 'POLITICS', '🚧', 6, 'Town Council Spends $18,000 On Gold-Plated Pothole Patch Plaque',
      'Rather than paving Oak Street, council unveiled a commemorative plaque honoring the pothole\'s "cultural persistence."',
      [
        ch('A) Roast the plaque mercilessly on Emergency Pothole Watch', ['++Ratings', '++Trust'], { cash: 0, ratings: 3.1, listeners: 740, trust: 5, fcc: 1, morale: 4 }, 'Exposing the gold-plated pothole plaque forced council to finally pave Oak Street!'),
        ch('B) Praise artistic civic preservation awkwardly', ['--Trust', '+City Favor'], { cash: 500, ratings: -1.4, listeners: -310, trust: -6 }, 'Defending a commemorative pothole plaque baffled daily commuters.')
      ]),
    ev('gen_67', 'AGRICULTURE', '🎃', 5, 'Stray Herd Of Fainting Goats Freezes Every Time A Freight Train Honks',
      'Twelve fainting goats keep toppling symmetrically beside the main rail crossing.',
      [
        ch('A) Help organize safe fencing relocation live on air', ['-$300 Cash', '++Trust'], { cash: -300, ratings: 1.8, listeners: 410, trust: 5, morale: 3 }, 'Listener volunteers moved the fainting goats to a tranquil meadow.', { flagGrant: 'sawGoatEvent' }),
        ch('B) Sell ringside commentary tickets via morning radio', ['+$900 Cash', '+Ratings', '--Trust'], { cash: 900, ratings: 2.4, listeners: 450, trust: -5, fcc: -2 }, 'Monetizing fainting-goat rail crossings drew angry humane letters.', { flagGrant: 'sawGoatEvent' })
      ]),
    ev('gen_68', 'CRIME CAPER', '🚓', 5, 'Thief Steals Police Cruiser, Immediately Turns Himself In Because Seat Was Uncomfortable',
      'Suspect pulled up to the county jail 9 minutes later demanding lumbar support and hot coffee.',
      [
        ch('A) Turn the lumbar confession into comedy gold on Morning Drive', ['++Ratings', '+Listeners'], { cash: 0, ratings: 2.8, listeners: 620, trust: 1, morale: 4 }, 'Cruiser-seat thief story sparked hilarious lumbar-cushion call-ins.'),
        ch('B) Run serious police-equipment upgrade coverage', ['+Trust', '+FCC'], { cash: 0, ratings: 1.2, listeners: 260, trust: 4, fcc: 2 }, 'Highlighted patrol ergonomic needs after the brief joyride.')
      ]),
    ev('gen_69', 'FOOD', '🍔', 6, 'Diner Introduces 7-Pound "Broadcast Tower Burger" With Free Tums',
      'Anyone finishing the burger earns 30 seconds of live shout-out airtime on Saturday Swap Shop.',
      [
        ch('A) Partner officially and host live eating attempts', ['+$1,100 Cash', '++Ratings', '-FCC Risk'], { cash: 1100, ratings: 2.7, listeners: 620, trust: 1, adSat: 4, fcc: -2 }, 'Broadcast Tower Burger challenge drew crowds and heartburn.'),
        ch('B) Decline live burger promos to protect station dignity', ['+Trust', '+FCC'], { cash: 0, ratings: 0.4, listeners: 80, trust: 2, fcc: 2 }, 'Kept Swap Shop free of competitive condiment eating.')
      ]),
    ev('gen_70', 'CIVIC', '🚒', 7, 'Fire Hydrants Repainted Glow-In-The-Dark Chartreuse By Enthusiastic Boy Scouts',
      'Motorists can now see every hydrant from half a mile away—plus pilots report mild glare.',
      [
        ch('A) Applaud the safety visibility & interview Scout troop', ['+Trust', '+Listeners'], { cash: 0, ratings: 1.9, listeners: 430, trust: 5, morale: 3 }, 'Glowing hydrant interview praised youth safety initiative.'),
        ch('B) Question UFO landing-strip conspiracy angles', ['++Ratings', '-Trust'], { cash: 0, ratings: 2.5, listeners: 520, trust: -3, fcc: -2 }, 'Claiming glowing hydrants signaled alien landing pads puzzled Scout leaders.')
      ]),
    ev('gen_71', 'ODDITY', '🪃', 6, 'Boomerang Enthusiast Accidentally Knocks Own Truck Mirror Off Twice',
      'An ambitious park throw curved across Highway 9, tagged the driver mirror, and returned cleanly to his glovebox.',
      [
        ch('A) Invite him on air for physics commentary & safety tips', ['+Ratings', '+Listeners'], { cash: 0, ratings: 2.0, listeners: 450, trust: 2, morale: 3 }, 'Boomerang physics segment sparked dozens of backyard fail stories.'),
        ch('B) Skip fluff and cover county road maintenance instead', ['+Trust'], { cash: 0, ratings: 0.6, listeners: 130, trust: 2 }, 'Focused afternoon drive on municipal paving schedules.')
      ]),
    ev('gen_72', 'CIVIC', '📮', 8, 'Post Office Celebrates 100 Years By Issuing Stamp Of Locally Famous Catfish',
      'Collectors from three states are lining up for "Old Whiskers" commemorative envelopes.',
      [
        ch('A) Air live collector interviews & Bass Forecast tie-in', ['++Listeners', '+Ratings'], { cash: 500, ratings: 2.6, listeners: 670, trust: 3, adSat: 3 }, 'Old Whiskers stamp special attracted collectors across state lines.'),
        ch('B) Run routine postal-hours announcements only', ['Safe'], { cash: 0, ratings: 0.4, listeners: 80, trust: 1 }, 'Provided standard post-office hours during stamp week.')
      ]),
    ev('gen_73', 'CONSPIRACY', '🛰️', 7, 'Garage Door Openers Across Three Blocks Trigger Simultaneously At 3:14 AM',
      'Ninety-two suburban garage doors lifted in ghostly sync under a clear sky.',
      [
        ch('A) Run deep-dive late-night mystery hotline', ['++Ratings', '+Listeners', '-FCC Risk'], { cash: 0, ratings: 3.3, listeners: 810, trust: -1, fcc: -2, morale: 4 }, '3:14 AM garage-door mystery lit up overnight skywave phones.'),
        ch('B) Investigate military/aviation radar interference calmly', ['+Trust', '+FCC'], { cash: -350, ratings: 1.8, listeners: 420, trust: 5, fcc: 3 }, 'Confirmed a stray military transponder test caused the garage-door wave.')
      ]),
    ev('gen_74', 'CIVIC', '🎺', 8, 'Town Bans Leaf Blowers Before 9 AM; Rebel Gardeners Switch To Brass Tubas',
      'Determined lawn-care rebels blast loud low notes across fences to blow leaves manually.',
      [
        ch('A) Broadcast live "Tuba Leaf-Blowing Championships"', ['++Ratings', '+Morale'], { cash: 0, ratings: 2.9, listeners: 660, trust: 1, morale: 5 }, 'Tuba leaf-blowing coverage turned neighborhood ordinance drama into pure comedy.'),
        ch('B) Host peaceful city ordinance mediation forum', ['+Trust', '+FCC'], { cash: 0, ratings: 1.2, listeners: 250, trust: 4, fcc: 2 }, 'Mediated quiet-hour compromises between gardeners and shift workers.')
      ]),
    ev('gen_75', 'BIZ', '🏪', 9, 'Supermarket Installs Muzak System That Only Plays Accordion Covers Of Classic Rock',
      'Shoppers stand mesmerized in Aisle 4 listening to polka-fied "Free Bird."',
      [
        ch('A) Invite the accordionist live into our studio for drive-time', ['++Listeners', '+Morale'], { cash: -350, ratings: 2.7, listeners: 680, trust: 3, morale: 6 }, 'Accordion "Free Bird" broadcast became our most shared cassette tape of the year.'),
        ch('B) Mock supermarket retail trends brutally', ['+Ratings', '-Ad Sat'], { cash: 0, ratings: 1.8, listeners: 340, adSat: -4 }, 'Roasting supermarket music offended regional grocery ad buyers.')
      ]),
    ev('gen_76', 'REGIONAL', '🌉', 8, 'Toll Booth Operator Starts Handing Out Handwritten Fortune Cookies With Receipts',
      'Commuters eagerly queue in Lane 1 for cryptic advice like "Watch out for damp goats on Thursday."',
      [
        ch('A) Feature the Toll Booth Oracle\'s daily fortunes on Morning Drive', ['++Listeners', '+Trust'], { cash: 0, ratings: 2.6, listeners: 650, trust: 4, morale: 4 }, 'Morning commuters tuned in daily for the Toll Booth Oracle\'s wisdom.'),
        ch('B) Question whether fortune slips delay rush-hour flow', ['-Listeners', '+Efficiency'], { cash: 0, ratings: -0.7, listeners: -140, fcc: 1 }, 'Griping about toll-booth fortunes earned eye-rolls from cheerful commuters.')
      ]),
    ev('gen_77', 'SPORTS', '⛳', 9, 'Miniature Golf Windmill Catches Fire During Sudden-Death Championship',
      'Smoke curled out of Hole 18 while two fiercely competitive dentists refused to concede their putts.',
      [
        ch('A) Broadcast live dentist putting through fire-hose spray', ['++Ratings', '+Listeners'], { cash: 0, ratings: 3.1, listeners: 740, trust: 2, morale: 4 }, 'Play-by-play of blazing windmill miniature golf captivated evening listeners.'),
        ch('B) Run fire-safety warnings & dental sponsor tags', ['+$1,100 Cash', '+Trust'], { cash: 1100, ratings: 1.2, listeners: 240, trust: 3, adSat: 4 }, 'Dental and safety sponsors backed the mini-golf incident recap.')
      ]),
    ev('gen_78', 'POLITICS', '🏛️', 10, 'Rival Counties Fight Over Ownership Of A 12-Foot Bend In Mud Creek',
      'Surveyors discovered an 1882 map shift placing one prime fishing sandbar inside rival territory.',
      [
        ch('A) Rally listeners with patriotic "Hold The Sandbar" remotes', ['++Ratings', '++Listeners', '-Neighbor Relations'], { cash: -500, ratings: 3.4, listeners: 880, trust: 3, morale: 5 }, 'Patriotic sandbar coverage rallied hometown pride across county lines.'),
        ch('B) Broadcast neutral legal history & peace summit', ['+Trust', '+FCC'], { cash: 0, ratings: 1.5, listeners: 320, trust: 5, fcc: 3 }, 'Fair boundary reporting cooled tempers between county surveyors.')
      ]),
    ev('gen_79', 'ABSURD', '🎈', 10, '400 Helium Balloons From Car Lot Escape And Trigger Regional Air Traffic Alert',
      'Regional radar mistook the tightly bunched car-dealer balloons for a slow silver squadron.',
      [
        ch('A) Coordinate live aviation clearances & clarify it\'s a sedan sale', ['++Trust', '+FCC'], { cash: 0, ratings: 2.1, listeners: 490, trust: 5, fcc: 4 }, 'Helped clarify the harmless car-lot balloon flock before panic spread.'),
        ch('B) Play "Invasion Alert" sirens for 40 seconds before revealing truth', ['++Ratings', '---FCC', '---Trust'], { cash: 0, ratings: 4.1, listeners: 850, trust: -10, fcc: -12, morale: -3, fccViolation: 1 }, 'Fake invasion siren prank triggered an immediate FCC formal sanction!')
      ]),
    ev('gen_80', 'COMMUNITY', '🧺', 7, 'Quilting Guild Discovers 1938 Quilt Map Showing Hidden Moonshine Still',
      'Stitched patterns on the courthouse display quilt turn out to encode coordinates along Pine Hollow.',
      [
        ch('A) Air a thrilling three-part historical treasure hunt series', ['++Listeners', '+Trust'], { cash: -400, ratings: 2.9, listeners: 760, trust: 4, morale: 4 }, 'Quilt-map treasure series had families hiking Pine Hollow every Sunday.'),
        ch('B) Let sheriffs confiscate the site first & cover dryly', ['+FCC'], { cash: 0, ratings: 0.8, listeners: 160, trust: 2, fcc: 2 }, 'Reported briefly on the historical quilt discovery.')
      ]),
    ev('gen_81', 'LAW', '⚖️', 11, 'Town Passes Ordinance Making It Illegal To Mock Casseroles In Public',
      'After a heated potluck review in the weekly paper, council outlawed culinary slander.',
      [
        ch('A) Test the First Amendment live by critiquing tater-tot hotdish', ['++Ratings', '+Listeners', '-Legal Risk'], { cash: -600, ratings: 3.6, listeners: 920, trust: 2, fcc: -2, morale: 5 }, 'Live casserole-free-speech broadcast got the silly ban repealed within a week!'),
        ch('B) Comply politely and praise every local gelatin mold', ['+Trust', '-Credibility'], { cash: 0, ratings: -0.9, listeners: -190, trust: 1, morale: -3 }, 'Mandatory casserole praise left listeners suspicious of radio spin.')
      ]),
    ev('gen_82', 'WILDLIFE', '🦅', 11, 'Bald Eagle Steals Mayor\'s Wig Mid-Speech At Riverfront Dedication',
      'Live microphones captured a majestic whoosh followed by horrified silence and applause.',
      [
        ch('A) Air the live audio respectfully as a wildlife triumph', ['++Ratings', '+Listeners'], { cash: 0, ratings: 3.1, listeners: 780, trust: 1, morale: 5 }, 'The Eagle-Wig broadcast clip became our most requested replay of the decade.'),
        ch('B) Mute the clip and donate $500 toward a spare mayoral toupee', ['-$500 Cash', '+Civic Favor', '+Trust'], { cash: -500, ratings: 0.8, listeners: 180, trust: 4 }, 'Mayor thanked the station warmly for burying the airborne-wig audio.')
      ]),
    ev('gen_83', 'ECONOMY', '🏭', 12, 'Regional Pickle Factory Threatens To Relocate Unless Freight Spur Is Fixed',
      'Three hundred local jobs hang on a half-mile stretch of warped railroad track.',
      [
        ch('A) Spearhead an investigative jobs campaign pressuring state officials', ['-$700 Cash', '++Trust', '++Listeners'], { cash: -700, ratings: 2.8, listeners: 790, trust: 7, fcc: 2, morale: 4 }, 'Station pressure helped secure state rail funding, saving 300 pickle-plant jobs!'),
        ch('B) Run paid factory PR spots without taking a stance', ['+$1,600 Cash', '-Trust'], { cash: 1600, ratings: 0.5, listeners: 90, trust: -4, adSat: 3 }, 'Cashed corporate PR checks while workers feared layoffs.')
      ]),
    ev('gen_84', 'MEDIA', '📺', 12, 'Regional TV Crew Arrives To Film "Quirky Small-Town Radio" Segment',
      'A glossy state television crew wants to shadow our studio for a Sunday morning feature.',
      [
        ch('A) Stage authentic hometown broadcasting & shine on camera', ['-$600 Prep', '+++Listeners', '+Trust'], { cash: -600, ratings: 3.5, listeners: 1100, trust: 5, morale: 6 }, 'TV spotlight introduced thousands of regional viewers to our station.'),
        ch('B) Let Conspiracy Carl & Big Earl improvise live on TV', ['++++Ratings', '-Trust', '-FCC Risk'], { cash: 0, ratings: 4.5, listeners: 1350, trust: -4, fcc: -5, morale: 4 }, 'Wild unscripted TV appearance went viral statewide while making regulators sweat.')
      ]),
    ev('gen_85', 'TECH', '📱', 14, 'Spam Robocalls Accidentally Dial Into Live Traffic Tip Line',
      'Every time we ask for road hazards, automated voices offer extended warranties on 1996 sedans.',
      [
        ch('A) Put Dave on air prank-arguing with the car warranty bots', ['++Ratings', '+Morale'], { cash: 0, ratings: 2.7, listeners: 640, trust: 1, morale: 5 }, 'Live arguments with warranty robocalls made drive-time commuters cry laughing.'),
        ch('B) Spend $1,100 upgrading call-screening hardware', ['-$1,100 Cash', '+FCC', '+Trust'], { cash: -1100, ratings: 0.9, listeners: 190, trust: 3, fcc: 3 }, 'Upgraded digital call screener killed robocalls cleanly.')
      ]),
    ev('gen_86', 'CIVIC', '🎪', 13, 'Neighboring Town Claims They Invented Swap Shop Radio First',
      'Cross-county rivals printed T-shirts reading "Home of Original Porch Barter Since 1962."',
      [
        ch('A) Dig through archives & prove our Swap Shop history on air', ['-$400 Cash', '++Trust', '+Listeners'], { cash: -400, ratings: 2.4, listeners: 620, trust: 5, morale: 4 }, 'Archival proof defended our Swap Shop crown with pride.'),
        ch('B) Challenge them to a charity Swap-Off live simulcast', ['-$500 Cash', '++Listeners', '+Morale'], { cash: -500, ratings: 3.0, listeners: 810, trust: 4, morale: 5 }, 'Joint charity Swap-Off raised $12,000 for local food banks.')
      ]),
    ev('gen_87', 'ABSURD', '🦖', 14, 'Road Crew Unearths Fiberglass Dinosaur Buried Beneath Gas Station',
      'Turns out a 1960s roadside attraction buried a 22-foot brontosaurus rather than pay demolition fees.',
      [
        ch('A) Campaign to place the unearthed dinosaur in front of our studio', ['-$1,800 Crane', '++Listeners', '+Morale'], { cash: -1800, ratings: 3.6, listeners: 1050, trust: 4, morale: 7 }, 'The rescued fiberglass brontosaurus outside our lobby became a regional landmark!'),
        ch('B) Cover the paleontology joke lightly during news', ['+Ratings'], { cash: 0, ratings: 1.5, listeners: 320, trust: 1 }, 'Reported playfully on the unearthed gas-station dinosaur.')
      ]),
    ev('gen_88', 'REGIONAL', '🚤', 15, 'Statewide Fishing Tournament Moves Championship Weigh-In To Our Dock',
      'Hundreds of bass boats and TV trucks descend on the town boat ramp.',
      [
        ch('A) Anchor three days of nonstop marine & bass radio coverage', ['-$1,200 Crew', '+++Listeners', '+Ad Sat'], { cash: -1200, ratings: 4.0, listeners: 1350, trust: 4, adSat: 6, morale: 5 }, 'Tournament weigh-in coverage cemented us as the state\'s bass radio powerhouse.'),
        ch('B) Sell high-margin marina sponsorship spots from studio', ['+$2,800 Cash', '+Ad Sat'], { cash: 2800, ratings: 1.2, listeners: 300, adSat: 5 }, 'Sold championship weekend commercial inventory at top dollar.')
      ]),
    ev('gen_89', 'CONSPIRACY', '🛰️', 16, 'Cell Tower Disguised As Giant Plastic Pine Tree Drops Pinecones Made Of Foam',
      'Wind snapped three fake branches, revealing hollow green fiberglass cones across the hardware lot.',
      [
        ch('A) Air explosive "Tree-Spies" late-night talk marathon', ['++Ratings', '-Trust', '-FCC'], { cash: 0, ratings: 3.8, listeners: 940, trust: -4, fcc: -4 }, 'Fake-pinecone talk marathon drew paranoid night owls and irritated telecom execs.'),
        ch('B) Explain stealth telecom camouflage humorously & clearly', ['+Trust', '+Listeners'], { cash: 0, ratings: 1.9, listeners: 450, trust: 4, fcc: 2 }, 'Listeners appreciated learning how stealth tree towers work.')
      ]),
    ev('gen_90', 'LAW', '⚖️', 15, 'Angry Listener Sues Station Over "Misleading Sunny Forecast" That Ruined Wedding',
      'Bride\'s lawyer seeks $8,000 claiming our morning weather cheer ruined outdoor floral arrangements.',
      [
        ch('A) Fight the lawsuit aggressively in court on First Amendment grounds', ['-$1,900 Legal', '+FCC', '+Ratings'], { cash: -1900, ratings: 2.4, listeners: 520, trust: 2, fcc: 3 }, 'Won summary judgment protecting weather broadcasters everywhere.'),
        ch('B) Settle quietly with cake voucher & on-air wedding redo plug', ['-$1,100 Cash', '+Trust'], { cash: -1100, ratings: 1.1, listeners: 240, trust: 4, morale: 1 }, 'Gracious weather-wedding settlement turned a plaintiff into a loyal fan.')
      ]),
    ev('gen_91', 'COMMUNITY', '🎹', 16, 'Retired Music Teacher Leaves $10,000 Bequest For Youth Radio Scholarships',
      'Her will stipulates the station must host an annual live teen-broadcaster day to claim the grant.',
      [
        ch('A) Host Teen Broadcaster Day & launch the scholarship', ['+$2,500 Grant Net', '++Trust', '++Morale'], { cash: 2500, ratings: 2.5, listeners: 680, trust: 7, fcc: 4, morale: 6 }, 'Teen Broadcaster Day inspired young voices and flooded the station with goodwill.'),
        ch('B) Decline administrative hassle & donate funds elsewhere', ['Safe'], { cash: 0, ratings: 0.2, listeners: 40, trust: 1 }, 'Passed scholarship administration smoothly to the local high school.')
      ]),
    ev('gen_92', 'ABSURD', '🐐', 17, 'National Magazine Names Somewhere "Top Goat-Friendly Small Town In America"',
      'Tourists in hiking boots begin arriving specifically to photograph local goats wearing traffic vests.',
      [
        ch('A) Launch "Goat Tourism Welcome Desk" live weekend specials', ['++Listeners', '+Ad Sat', '+$1,200'], { cash: 1200, ratings: 3.4, listeners: 1050, trust: 3, adSat: 5, morale: 4 }, 'Goat-tourism broadcasts turned visitors into lifelong streaming fans.', { flagGrant: 'sawGoatEvent' }),
        ch('B) Critique tourist commercialization & protect quiet locals', ['+Trust', '-Ad Sat'], { cash: 0, ratings: 1.4, listeners: 280, trust: 4, adSat: -3 }, 'Defended longtime locals against intrusive goat-selfie traffic.', { flagGrant: 'sawGoatEvent' })
      ]),
    ev('gen_93', 'CRISIS', '🏗️', 18, 'Highway Overpass Paint Crew Accidentally Drops Neon Orange Paint On 20 Cars',
      'Drivers cruising beneath the bridge emerged looking like safety cones.',
      [
        ch('A) Broadcast car-wash discount relays & DOT claim hotlines', ['++Trust', '+Listeners'], { cash: 0, ratings: 2.4, listeners: 610, trust: 5, fcc: 2 }, 'Helped orange-painted motorists file rapid state paint-removal claims.'),
        ch('B) Hold "Best Neon Car" call-in photo contest', ['++Ratings', '-Trust'], { cash: 0, ratings: 3.1, listeners: 720, trust: -3, morale: 3 }, 'Neon-car beauty pageant drew laughs while DOT officials winced.')
      ]),
    ev('gen_94', 'TECH', '🔋', 17, 'Smart Home Speakers Nationwide Mishear Our Station ID As "Order Goat Feed"',
      'Thousands of smart kitchens across the broadcast footprint just ordered 50-pound bags of pelleted oats.',
      [
        ch('A) Air humorous PSA helping baffled households cancel oat orders', ['++Trust', '++Listeners'], { cash: 0, ratings: 2.9, listeners: 810, trust: 5, morale: 5 }, 'National tech blogs picked up our hilarious smart-speaker oat-order PSA!'),
        ch('B) Intentionally repeat the trigger phrase for comedic mischief', ['+++Ratings', '---FCC', '---Trust'], { cash: 0, ratings: 4.3, listeners: 950, trust: -8, fcc: -9 }, 'Intentionally hijacking home speakers brought furious consumer complaints and FCC warning!')
      ]),
    ev('gen_95', 'CIVIC', '🏅', 19, 'State Historical Commission Installs Marker At Our Transmitter Shack',
      'They praise "50 Years of Unbroken Bass, Goat, and Pothole Journalism."',
      [
        ch('A) Host a grand open-house barbecue under the tower', ['-$1,500 BBQ', '++Trust', '++Morale', '+Listeners'], { cash: -1500, ratings: 2.8, listeners: 840, trust: 6, fcc: 3, morale: 7 }, 'Historical marker open house brought hundreds of longtime listeners to the shack.'),
        ch('B) Keep it low-key with a polite on-air thank-you', ['+Trust'], { cash: 0, ratings: 1.1, listeners: 250, trust: 3 }, 'Acknowledged the state historical plaque gracefully on Morning Drive.')
      ]),
    ev('gen_96', 'BUSINESS', '💼', 20, 'Private Equity Firm Offers To Buy Station Signal And Convert To Automated Polka',
      'Suits from Chicago wave a shiny contract promising buyout fees if you fire every host and play automated tuba loops.',
      [
        ch('A) Reject the suits live on air ("Somewhere Has A Soul!")', ['+++Trust', '+++Morale', '++Listeners'], { cash: 0, ratings: 3.8, listeners: 1200, trust: 8, morale: 8 }, 'Defiant live rejection of corporate buyout galvanized fierce regional loyalty!'),
        ch('B) Take a $4,500 consulting fee to hear them out privately', ['+$4,500 Cash', '--Morale', '--Trust'], { cash: 4500, ratings: -1.2, listeners: -350, trust: -5, morale: -9 }, 'Rumor of buyout talks rattled hosts and loyal listeners.')
      ]),
    ev('gen_97', 'ANIMAL', '🦃', 18, 'Flock Of 40 Wild Turkeys Stages Daily Stand-Off At Post Office Doors',
      'Residents must carry open umbrellas just to mail utility checks safely.',
      [
        ch('A) Broadcast live "Turkey Crossing Guard" reports every morning', ['++Listeners', '+Trust'], { cash: 0, ratings: 2.5, listeners: 660, trust: 4, morale: 4 }, 'Turkey-crossing alerts helped mail patrons navigate feathers unscathed.'),
        ch('B) Sell umbrella & bowling-helmet tie-in spots', ['+$1,400 Cash', '+Ad Sat'], { cash: 1400, ratings: 1.1, listeners: 240, adSat: 5 }, 'Sporting goods sponsors capitalized on the turkey patrol rush.')
      ]),
    ev('gen_98', 'WEATHER', '🌈', 19, 'Rare Upside-Down Rainbow Sparks Apocalyptic Rumors On Social Feeds',
      'A brilliant circumzenithal arc appears above downtown; half the town thinks gravity reversed.',
      [
        ch('A) Calm panic with atmospheric science guests on air', ['++Trust', '+FCC'], { cash: -200, ratings: 1.8, listeners: 450, trust: 6, fcc: 3 }, 'Calmly explained ice-crystal refraction, reassuring anxious callers.'),
        ch('B) Host breathless "Sky Flip" conspiracy call-ins', ['+++Ratings', '--Trust', '--FCC'], { cash: 0, ratings: 4.1, listeners: 990, trust: -7, fcc: -5 }, 'Stoking gravity-reversal rumors brought massive listenership and harsh criticism.')
      ]),
    ev('gen_99', 'SPORTS', '🏎️', 20, 'Lawnmower Drag Racing Nationals Choose County Fairgrounds',
      'Modified 65-MPH riding mowers with chrome exhaust pipes rumble into town.',
      [
        ch('A) Broadcast live mower-drag heats with Mad Dog style calls', ['-$600 Crew', '+++Ratings', '++Listeners'], { cash: -600, ratings: 3.9, listeners: 1150, trust: 2, adSat: 4, morale: 6 }, 'Lawnmower drag-racing coverage roared to #1 across the region.'),
        ch('B) Sell mower-repair & hearing-aid commercial packs', ['+$2,200 Cash', '+Ad Sat'], { cash: 2200, ratings: 1.3, listeners: 320, adSat: 6 }, 'Heavy mower weekend ad sales padded quarterly profits.')
      ]),
    ev('gen_100', 'MYSTERY', '📻', 21, 'Time-Delayed Echo Causes Station To Briefly Broadcast Yesterday\'s Weather',
      'Solar flares bounced yesterday\'s afternoon forecast off the ionosphere, confusing commuters with phantom hail.',
      [
        ch('A) Explain ionospheric skip & apologize clearly on air', ['+Trust', '+FCC'], { cash: 0, ratings: 1.4, listeners: 340, trust: 4, fcc: 3 }, 'Educated listeners about rare AM skywave bounce anomalies.'),
        ch('B) Claim we successfully invented time-travel radio', ['++Ratings', '-Trust', '-FCC Risk'], { cash: 0, ratings: 3.2, listeners: 780, trust: -4, fcc: -3, morale: 4 }, 'Time-travel radio jokes amused truckers and perplexed physics teachers.')
      ]),
    ev('gen_101', 'CIVIC', '🍩', 22, 'Beloved Diner Burns Griddle, Town Crowdfunds Replacement In 3 Hours',
      'Gertie\'s kitchen suffered an electrical short right before the Friday catfish rush.',
      [
        ch('A) Lead live telethon & pledge $1,500 from station funds', ['-$1,500 Cash', '+++Trust', '++Listeners'], { cash: -1500, ratings: 3.3, listeners: 960, trust: 8, morale: 7 }, 'Station-led Gertie Griddle Telethon rebuilt the kitchen by nightfall!'),
        ch('B) Air free community support shout-outs all afternoon', ['++Trust', '+Listeners'], { cash: 0, ratings: 1.8, listeners: 480, trust: 5, morale: 3 }, 'Free airtime helped Gertie\'s fans rally quickly.')
      ]),
    ev('gen_102', 'MEDIA', '🎧', 23, 'National Podcast Visits Somewhere To Mock Small-Town AM Radio',
      'Smug coastal producers set up microphones at the diner expecting backwards yokels.',
      [
        ch('A) Invite them live onto our airwaves & out-charm them completely', ['+++Ratings', '+++Trust', '++Listeners'], { cash: 0, ratings: 4.2, listeners: 1400, trust: 7, morale: 7 }, 'Local hosts outwitted visiting podcast snobs live, winning national praise!'),
        ch('B) Refuse interviews & ignore their documentary', ['Safe'], { cash: 0, ratings: 0.4, listeners: 80, trust: 1 }, 'Declined to engage with visiting coastal podcasters.')
      ]),
    ev('gen_103', 'TECH', '⚡', 23, 'Solar Storm Lights Up Northern Lights Over Mud Creek',
      'Rare emerald auroras shimmer above the pine trees while AM static crackles eerily.',
      [
        ch('A) Run a magical late-night aurora stargazing soundtrack', ['++Trust', '++Listeners', '+Morale'], { cash: 0, ratings: 3.1, listeners: 890, trust: 6, morale: 6 }, 'Listeners parked along scenic overlooks tuned to our aurora soundtrack.'),
        ch('B) Air solar-grid blackout panic speculation', ['++Ratings', '--Trust'], { cash: 0, ratings: 3.6, listeners: 910, trust: -6, fcc: -4 }, 'Solar-apocalypse scare talk caused pointless canned-bean hoarding.')
      ]),
    ev('gen_104', 'CIVIC', '🎈', 24, 'Retired Host Reunites Lost Childhood Bicycle With Listener After 35 Years',
      'A Swap Shop caller described a 1989 chrome BMX that turned out to be hanging in a barn two miles away.',
      [
        ch('A) Air the tearful reunion live on Morning Drive', ['+++Trust', '++Listeners', '+Morale'], { cash: -200, ratings: 3.0, listeners: 860, trust: 7, morale: 6 }, 'The 35-year Swap Shop bicycle reunion reminded everyone why local radio matters.'),
        ch('B) Mention it briefly in community notes', ['+Trust'], { cash: 0, ratings: 0.9, listeners: 210, trust: 2 }, 'Shared the heartwarming bike reunion note on afternoon radio.')
      ]),
    ev('gen_105', 'LEGACY', '🏆', 25, 'State Broadcasters Hall Of Fame Considers Station For Lifetime Honor',
      'Inspectors review decades of signal logs—from goat crises to emergency weather heroism.',
      [
        ch('A) Submit full unedited archive—warts, fish rain, and all', ['+++Trust', '++Listeners', '+FCC'], { cash: -800, ratings: 3.6, listeners: 1200, trust: 8, fcc: 5, morale: 8 }, 'Honest archival submission earned genuine statewide broadcaster admiration!'),
        ch('B) Scrub Carl\'s worst episodes & polish a corporate highlight reel', ['+Ad Sat', '-Morale'], { cash: -400, ratings: 1.4, listeners: 380, adSat: 5, morale: -4 }, 'Sanitized highlight reel satisfied corporate sponsors while hosts rolled eyes.')
      ])
  ];

  // =========================================================================
  // 2. 42 NEW HOST-DRIVEN EVENTS (LOYALTY, FEUDS, POACHING, STAR EGOS)
  // =========================================================================
  const HOST_EVENTS = [
    ev('hx_01', 'HOST LOYALTY', '💼', 2, '{HOST_NAME} Receives Formal Contract Offer From Rival Station',
      'A competing station in the market has slid a signed offer sheet under {HOST_NAME}\'s windshield wiper with a 25% raise.',
      [
        ch('A) Match the offer immediately (+20% Salary, +Loyalty)', ['+Salary', '+Loyalty', '+Morale', 'Keep Host'], { cash: -450, ratings: 1.2, listeners: 240, morale: 5, hostRaisePct: 0.20, hostLoyalty: 14 }, 'Matched rival offer to lock down {HOST_NAME}\'s contract.'),
        ch('B) Offer a $650 spot bonus & prime scheduling guarantee', ['-$650 Cash', '+Loyalty', 'Modest Risk'], { cash: -650, ratings: 0.8, listeners: 150, morale: 3, hostLoyalty: 6, hostLeaveRisk: 0.22 }, 'Negotiated a cash spot bonus to keep {HOST_NAME} in the booth.'),
        ch('C) Refuse to play bidding games ("Good luck over there!")', ['Save Salary', 'HIGH DEPARTURE RISK'], { cash: 0, ratings: -0.6, morale: -5, hostLoyalty: -18, hostLeaveRisk: 0.82 }, 'Refused to match the rival bid for {HOST_NAME}.')
      ], { hostId: null }),
    ev('hx_02', 'HOST CRISIS', '🎙️', 3, '{HOST_NAME} Threatens Walkout Over Coffee Quality & Chair Squeaks',
      '{HOST_NAME} refuses to touch the faders until the studio stops smelling like scorched chicory.',
      [
        ch('A) Replace espresso machine & studio chair today (-$750)', ['-$750 Cash', '+Loyalty', '+Morale'], { cash: -750, ratings: 0.9, listeners: 140, morale: 6, hostLoyalty: 12 }, 'Upgraded studio coffee & seating to appease {HOST_NAME}.'),
        ch('B) Tell them to tough it out like real AM pros', ['Free', '-Loyalty', 'Walkout Risk'], { cash: 0, ratings: -1.1, listeners: -180, morale: -6, hostLoyalty: -15, hostLeaveRisk: 0.38 }, 'Dismissed {HOST_NAME}\'s studio complaints bluntly.')
      ], { hostId: null }),
    ev('hx_03', 'HOST FEUD', '🥊', 3, 'On-Air Feud Erupts Between Studio Hosts',
      'Two hosts spent 12 minutes of cross-talk arguing passive-aggressively about who left tuna wrappers inside the cue rack.',
      [
        ch('A) Lean into the feud as dramatic "Morning vs. Evening Rivalry"', ['++Ratings', '-Morale', '-Ad Sat'], { cash: 0, ratings: 3.1, listeners: 680, adSat: -3, morale: -5, addConsequence: { id: 'cons_studio_feud', title: 'Host Hallway Feud', kind: 'negative', months: 6, moraleMod: -1.5, ratingsMult: 1.04, desc: 'Simmering tension boosts edgy banter while draining staff morale.' } }, 'Turned studio tuna feud into live on-air rivalry.'),
        ch('B) Mediate peace & buy team lunch (-$350)', ['-$350 Cash', '+Morale', '+Trust'], { cash: -350, ratings: 0.4, listeners: 80, trust: 2, morale: 6, hostLoyalty: 5 }, 'Resolved the booth feud cleanly over sandwiches.')
      ], { hostId: null }),
    ev('hx_04', 'HOST STARDOM', '🌟', 4, '{HOST_NAME} Goes Viral Across Regional Diners',
      'A clip of {HOST_NAME} mispronouncing three county roads while dodging a wasp has everyone imitating them.',
      [
        ch('A) Promote {HOST_NAME} as Station Star & print bumper stickers (-$650)', ['-$650', '+++Listeners', '+Popularity', '+Salary Pressure'], { cash: -650, ratings: 3.4, listeners: 950, morale: 5, hostPop: 8, hostStatus: 'Local Star' }, 'Crowned {HOST_NAME} as our breakout regional radio personality.'),
        ch('B) Keep focus on the station brand over individual egos', ['+Trust', '-Host Loyalty'], { cash: 0, ratings: 0.8, listeners: 180, trust: 2, hostLoyalty: -6 }, 'Downplayed {HOST_NAME}\'s viral clip to keep ego in check.')
      ], { hostId: null }),
    ev('hx_05', 'HOST LIABILITY', '⚖️', 4, '{HOST_NAME} Gives Terrible Unlicensed Plumbing Advice On Air',
      'Three callers followed {HOST_NAME}\'s suggestion to thaw pipes using hairdryers and garden hoses.',
      [
        ch('A) Air immediate safety correction & pay $900 repair goodwill', ['-$900 Cash', '+Trust', '+FCC'], { cash: -900, ratings: -0.4, trust: 4, fcc: 3, morale: 1 }, 'Rapidly cleaned up {HOST_NAME}\'s hazardous plumbing improvisation.'),
        ch('B) Defend it as "satirical home humor"', ['+Ratings', '--Trust', '--FCC', 'Lawsuit Risk'], { cash: 0, ratings: 1.9, listeners: 320, trust: -6, fcc: -6, addConsequence: { id: 'cons_plumbing_suit', title: 'Pipe-Thaw Civil Claim', kind: 'negative', months: 8, cashPerMonth: -650, fccMod: -1, desc: 'Paying legal defense fees over botched plumbing advice.' } }, 'Defending {HOST_NAME}\'s wild DIY tip invited an expensive negligence claim.')
      ], { hostId: null }),
    ev('hx_06', 'HOST • BIG EARL', '🍳', 1, 'Big Earl Demands Live Biscuit Delivery Sponsor Or Won\'t Read Traffic',
      'Earl refuses to announce Highway 31 backups without hot gravy biscuits on the console.',
      [
        ch('A) Cut a quick swap trade with Gertie\'s Diner', ['+Morale', '+Ad Sat', '+Ratings'], { cash: -120, ratings: 2.0, listeners: 390, adSat: 3, morale: 4, hostLoyalty: 6 }, 'Secured live biscuit catering to keep Big Earl firing on all cylinders.'),
        ch('B) Put Earl on strict professionalism warning', ['-Earl Loyalty', '-Morale', '+Discipline'], { cash: 0, ratings: -0.9, listeners: -150, morale: -4, hostLoyalty: -12, hostLeaveRisk: 0.18 }, 'Reprimanded Big Earl over console biscuit ultimatums.')
      ], { hostId: 'big_earl' }),
    ev('hx_07', 'HOST • BIG EARL', '🚗', 3, 'Big Earl Accidentally Broadcasts From Drive-Thru Speaker For 8 Minutes',
      'His remote belt-pack stayed live while he argued passionately for extra tartar sauce.',
      [
        ch('A) Turn it into "Earl\'s Drive-Thru Hour" sponsor bit', ['++Ratings', '+Ad Sat'], { cash: 450, ratings: 2.7, listeners: 590, adSat: 3, morale: 3 }, 'Listeners adored Big Earl\'s passionate tartar-sauce negotiation.'),
        ch('B) Apologize & suspend his remote privileges', ['-Earl Loyalty', '+FCC'], { cash: 0, ratings: -0.6, fcc: 2, morale: -3, hostLoyalty: -10 }, 'Pulled Big Earl\'s mobile rig after the hot-mic drive-thru incident.')
      ], { hostId: 'big_earl' }),
    ev('hx_08', 'HOST • CONSPIRACY CARL', '📡', 2, 'Conspiracy Carl Lines Studio Walls With Heavy-Duty Foil',
      'Carl claims FM signals are reading his dental fillings and covered every acoustic tile in aluminum.',
      [
        ch('A) Let him keep the foil—acoustics somehow sound punchier', ['++Ratings', '--FCC', '-Ad Sat'], { cash: 0, ratings: 3.1, listeners: 740, adSat: -4, fcc: -5, hostLoyalty: 8 }, 'Carl\'s foil-lined bunker produced record conspiracy ratings and FCC irritation.'),
        ch('B) Tear down the foil before Fire Marshal inspects', ['+FCC', '+Trust', '-Carl Loyalty'], { cash: -200, ratings: -0.8, trust: 2, fcc: 4, hostLoyalty: -12, hostLeaveRisk: 0.20 }, 'Stripped Carl\'s fire-hazard aluminum studio bunker.')
      ], { hostId: 'conspiracy_carl' }),
    ev('hx_09', 'HOST • CONSPIRACY CARL', '⚖️', 4, 'Conspiracy Carl Names County Sheriff In Pigeon-Drone Ring',
      'On open mic, Carl accused every pigeon near the courthouse of carrying sheriff microfilm.',
      [
        ch('A) Run instant retraction & mandatory 7-second delay rule', ['-$800 Tech', '+FCC', '-Carl Loyalty'], { cash: -800, ratings: -0.5, trust: 3, fcc: 4, hostLoyalty: -10 }, 'Installed 7-second profanity/defamation delay after Carl\'s pigeon tirade.'),
        ch('B) Back Carl\'s free-speech chaos & brace for FCC fallout', ['+++Ratings', '---FCC', 'Violation +1'], { cash: 0, ratings: 4.4, listeners: 1120, trust: -5, adSat: -5, fcc: -9, fccViolation: 1, addConsequence: { id: 'cons_fcc_probe', title: 'FCC Scrutiny Watchlist', kind: 'negative', months: 14, fccMod: -1.8, desc: 'Regulators monitor every broadcast after repeated Conspiracy Carl claims.' } }, 'Backing Carl\'s pigeon rant landed the station on an active FCC watchlist!')
      ], { hostId: 'conspiracy_carl' }),
    ev('hx_10', 'HOST • MISS PATTY', '🎂', 2, 'Miss Patty Accidentally Gives Away Station Van As Bake-Off Door Prize',
      'She read ticket #402 thinking the grand prize was a fruit basket—it was the keys to the 1986 Econoline.',
      [
        ch('A) Honor the raffle & buy a backup car (-$1,600) for massive PR', ['-$1,600 Cash', '+++Trust', '++Listeners'], { cash: -1600, ratings: 2.9, listeners: 840, trust: 8, morale: 5 }, 'Honoring Patty\'s accidental van giveaway made her a regional saint.'),
        ch('B) Reclaim the keys sheepishly & gift $200 pies instead', ['-$200', '--Trust', '-Patty Morale'], { cash: -200, ratings: -1.3, listeners: -290, trust: -6, morale: -4, hostLoyalty: -8 }, 'Taking back the accidental raffle van embarrassed Miss Patty on air.')
      ], { hostId: 'miss_patty' }),
    ev('hx_11', 'HOST • MISS PATTY', '💬', 3, 'Miss Patty Reveals Mayor\'s Secret Disco Bowling Habit Live',
      'She thought she was praising his footwork, unaware nobody knew he wore sequined bowling shoes in neighboring counties.',
      [
        ch('A) Turn it into an endearing charity disco-bowl challenge', ['++Trust', '+Listeners'], { cash: -200, ratings: 2.5, listeners: 590, trust: 4, morale: 4 }, 'Mayor embraced the disco-bowl charity challenge thanks to Patty\'s charm.'),
        ch('B) Scold Patty privately & issue formal press apology', ['+FCC', '-Patty Loyalty'], { cash: 0, ratings: -0.5, fcc: 2, hostLoyalty: -8 }, 'Tightened Miss Patty\'s pre-show script checks.')
      ], { hostId: 'miss_patty' }),
    ev('hx_12', 'HOST • CAPTAIN RADAR', '🌩️', 2, 'Captain Radar Insists A "Dry Hurricane" Is Forming Over The Mall',
      'Clear blue skies outside, yet Radar demands emergency siren alerts for invisible wind shear.',
      [
        ch('A) Sound mild "Gust Advisory" without sirens', ['+Trust', '+Ratings'], { cash: 0, ratings: 1.8, listeners: 410, trust: 2, fcc: 1 }, 'Cleverly framed Radar\'s hunch as a preventive wind advisory.'),
        ch('B) Fire full EBS sirens over sunny skies', ['+Ratings', '---FCC', '---Trust'], { cash: 0, ratings: 2.6, listeners: 420, trust: -8, fcc: -10, fccViolation: 1 }, 'Sounding emergency sirens for a clear sunny sky drew an FCC violation!')
      ], { hostId: 'captain_radar' }),
    ev('hx_13', 'HOST • CAPTAIN RADAR', '📺', 5, 'Regional TV Weather Desk Tries To Poach Captain Radar',
      'Channel 7 wants Radar\'s folksy barometric charm for their 6 PM green screen.',
      [
        ch('A) Give Radar a $350/mo raise & new Doppler software', ['-$1,000 + $350/mo', '+Loyalty', '+Ratings'], { cash: -1000, ratings: 2.0, listeners: 450, morale: 5, hostRaise: 350, hostLoyalty: 15 }, 'Kept Captain Radar out of TV hands with better pay and radar toys.'),
        ch('B) Wish him well & dare him to find better goats on TV', ['HIGH LEAVE RISK'], { cash: 0, ratings: -0.5, morale: -4, hostLoyalty: -20, hostLeaveRisk: 0.78 }, 'Refused to counter Channel 7\'s offer for Captain Radar.')
      ], { hostId: 'captain_radar' }),
    ev('hx_14', 'HOST • DAVE INTERN', '🥤', 1, 'Dave The Intern Builds Working Audio Limiter Out Of Two Toasters',
      'Audio compression sounds shockingly crisp, though the control desk smells faintly of rye bread.',
      [
        ch('A) Promote Dave\'s snack stipend & keep the toaster limiter', ['-$150', '+Morale', '+Ratings'], { cash: -150, ratings: 1.6, listeners: 320, morale: 6, hostPop: 4, hostLoyalty: 10 }, 'Dave\'s toaster limiter boosted signal punch and intern legend.'),
        ch('B) Confiscate appliances before insurance cancels us', ['+FCC', '-Dave Morale'], { cash: 0, ratings: 0.2, fcc: 3, morale: -3, hostLoyalty: -6 }, 'Removed the bread-scented broadcast toaster to keep fire insurance intact.')
      ], { hostId: 'dave_intern' }),
    ev('hx_15', 'HOST • DAVE INTERN', '🌟', 6, 'Dave Accidentally Books National Senator Thinking He Called Hardware Desk',
      'A senator dialing for campaign yard signs got patched live into Dave\'s afternoon banter.',
      [
        ch('A) Roll with it—Dave conducts shockingly honest interview', ['+++Trust', '+++Listeners', '+Dave Fame'], { cash: 0, ratings: 3.8, listeners: 1100, trust: 6, morale: 7, hostPop: 10 }, 'Dave The Intern\'s accidental senator interview made statewide headlines!'),
        ch('B) Yank Dave off mic & apologize profusely to Senator\'s aides', ['-Morale', '+Formal FCC'], { cash: 0, ratings: -0.4, fcc: 2, morale: -5, hostLoyalty: -10 }, 'Cut off Dave\'s accidental political interview abruptly.')
      ], { hostId: 'dave_intern' }),
    ev('hx_16', 'HOST • SHERYL', '📊', 2, 'Sheryl Discovers $1,800 In Unclaimed Station Tax Credits—If You Fire One Snack Fridge',
      'Sheryl insists removing the free soda fridge qualifies the studio as an "austere utility bunker."',
      [
        ch('A) Cash the $1,800 credit & unplug the breakroom fridge', ['+$1,800 Cash', '--Staff Morale'], { cash: 1800, morale: -9, hostLoyalty: -4 }, 'Sheryl banked $1,800 in tax credits while hosts mourned warm sodas.'),
        ch('B) Keep the cold drinks for staff morale', ['-Credit', '+Morale', '-Sheryl Mood'], { cash: 0, morale: 5, hostLoyalty: 4 }, 'Chose cold staff sodas over Sheryl\'s austere tax scheme.')
      ], { hostId: 'sheryl_accounting' }),
    ev('hx_17', 'HOST • MAD DOG', '🤬', 3, 'Mad Dog Kowalski Challenges High School Coach To Parking-Lot Arm Wrestle',
      'After a blown fourth-down punt, Mad Dog invited Coach Vance to settle it behind the press box.',
      [
        ch('A) Air it live as "Friday Night Grudge Match"', ['+++Ratings', '--Trust', '-Ad Sat'], { cash: 0, ratings: 3.7, listeners: 890, trust: -5, adSat: -4, fcc: -3, morale: 4 }, 'Mad Dog\'s live arm-wrestle challenge shattered Friday ratings and upset school trustees.'),
        ch('B) Pull Mad Dog off air for a 1-week cool-down', ['+Trust', '+Ad Sat', '-Mad Dog Loyalty'], { cash: 0, ratings: -1.1, trust: 3, adSat: 4, fcc: 2, hostLoyalty: -12 }, 'Suspended Mad Dog briefly to calm angry athletic boosters.')
      ], { hostId: 'mad_dog' }),
    ev('hx_18', 'HOST • BARNABY', '🐟', 3, 'Professor Barnaby Insists Station Install Live Aquarium Behind Desk',
      'Barnaby says trout barometric agitation predicts ad-market swings better than Wall Street.',
      [
        ch('A) Buy the 120-gallon trout tank (-$850)', ['-$850 Cash', '+Bass Ratings', '+Barnaby Loyalty'], { cash: -850, ratings: 1.9, listeners: 420, morale: 4, hostPop: 5, hostLoyalty: 12 }, 'Studio trout barometer became a beloved quirk of Barnaby\'s broadcasts.'),
        ch('B) Deny aquarium budget due to electrical wires', ['Save Cash', '-Barnaby Loyalty'], { cash: 0, ratings: -0.4, fcc: 2, hostLoyalty: -10 }, 'Vetoed studio fish tanks next to high-voltage tube amps.')
      ], { hostId: 'prof_barnaby' }),
    ev('hx_19', 'HOST • REV HOLLIS', '🙏', 2, 'Reverend Hollis Invited To Keynote State Ethics Summit',
      'Hollis\'s calm voice has attracted statewide admiration—and rival stations are sniffing around.',
      [
        ch('A) Sponsor his trip & honor him on air (-$400)', ['-$400', '++Trust', '++FCC', '+Loyalty'], { cash: -400, ratings: 1.4, listeners: 320, trust: 6, fcc: 6, hostLoyalty: 12 }, 'Reverend Hollis\'s ethics speech burned bright on station reputation.'),
        ch('B) Keep him working normal shifts to avoid missed blocks', ['Save Cash', '-Hollis Loyalty'], { cash: 0, ratings: 0.2, morale: -3, hostLoyalty: -10 }, 'Kept Reverend Hollis on local board duty during the summit.')
      ], { hostId: 'rev_hollis' }),
    ev('hx_20', 'HOST • VELVET VANCE', '🌙', 3, 'Velvet Vance\'s Buick Needs Transmission Work Or He Can\'t Sleep By Tower',
      'Vance\'s beloved midnight sedan broke down across the gravel lot.',
      [
        ch('A) Pay $700 mechanic bill as staff perk', ['-$700 Cash', '++Morale', '+Vance Loyalty'], { cash: -700, ratings: 1.3, listeners: 280, morale: 6, hostLoyalty: 15 }, 'Restored Velvet Vance\'s midnight sedan, earning fierce late-night loyalty.'),
        ch('B) Tell him to take the city bus', ['Save Cash', '-Vance Loyalty', 'Leave Risk'], { cash: 0, ratings: -0.8, morale: -4, hostLoyalty: -14, hostLeaveRisk: 0.28 }, 'Denied mechanic help to Velvet Vance.')
      ], { hostId: 'velvet_vance' })
  ];

  // Add 22 more dynamic host events cleanly (total 42 host events!)
  const EXTRA_HOST_SCENARIOS = [
    ['hx_21', '🎙️', 2, '{HOST_NAME} Accidentally Plays Sound-Effects Cart Of Screaming Goats Over Obituary', 'A sticky cart deck fired goat audio straight across solemn announcements.', -400, 1.8, -5, -4, 'Aired sincere apology after {HOST_NAME}\'s sticky goat-cart mishap.', 'Laughed it off as "the goat mourning period" (+Ratings, --Trust).', 2.6, -7],
    ['hx_22', '🏆', 4, '{HOST_NAME} Nominated For Regional Golden Microphone Award', 'They want $550 for travel and tuxedo rental to attend.', -550, 2.2, 4, 2, 'Sent {HOST_NAME} to the Golden Microphone awards, boosting prestige.', 'Skipped the awards gala to save cash (-Loyalty).', -0.4, -10],
    ['hx_23', '📻', 3, '{HOST_NAME} Refuses To Read Sponsor Script Calling Tires "Round"', 'Claims the ad copy is insulting to listener intelligence.', 0, 1.1, 2, 1, 'Let {HOST_NAME} rewrite the tire ad copy organically (+Trust, -Ad Sat risk).', 'Forced verbatim copy reading (-Morale, -Loyalty).', -0.5, -9],
    ['hx_24', '😴', 2, '{HOST_NAME} Falls Asleep During 20-Minute Steel Guitar Solo', 'Dead-air alarm beeped twice before an intern kicked the studio door.', -200, -1.2, -2, -2, 'Covered {HOST_NAME}\'s booth nap with quick intern banter.', 'Docked pay harshly (-Morale, -Loyalty).', -0.8, -12],
    ['hx_25', '🚗', 5, '{HOST_NAME} Bought A Corvette On Credit & Needs Bonus Work', 'Sudden luxury car payments mean {HOST_NAME} is eyeing lucrative rival gigs.', -950, 1.5, 0, 3, 'Paid {HOST_NAME} a $950 retention advance to stop job shopping.', 'Refused extra pay; {HOST_NAME} started taking rival calls.', -0.6, -15],
    ['hx_26', '🎂', 3, 'Listeners Throw Surprise 100-Pound Cake Party For {HOST_NAME}', 'The lobby is wall-to-wall frosting and homemade casseroles.', -300, 2.4, 5, 5, 'Broadcast {HOST_NAME}\'s giant lobby birthday bash live!', 'Kept guests out of the studio for cleanliness (-Trust).', -0.7, -4],
    ['hx_27', '📢', 6, '{HOST_NAME} Launches Unauthorized Merch Table Selling "Free Goat" Hats', 'Selling unlicensed hats out of the trunk using station logos.', 600, 1.9, -2, 2, 'Split merch profits 50/50 cleanly with {HOST_NAME}.', 'Confiscated hats & issued legal memo (-Morale).', -0.4, -11],
    ['hx_28', '🤝', 4, '{HOST_NAME} Volunteers To Host County Blood Drive Marathon', 'Asks to preempt six commercial blocks for community donors.', -350, 2.1, 7, 4, 'Backed {HOST_NAME}\'s blood drive marathon, earning huge civic love.', 'Denied commercial preemption (-Trust, -Loyalty).', -0.9, -9],
    ['hx_29', '📰', 5, 'Local Paper Prints Snarky Profile Calling {HOST_NAME} "Loud Wallpaper"', '{HOST_NAME} demands airtime to roast the newspaper editor personally.', 0, 3.2, -3, 2, 'Let {HOST_NAME} fire back on air against newspaper snobs.', 'Enforced dignified silence (-Loyalty, +FCC).', 0.3, -8],
    ['hx_30', '🎤', 6, '{HOST_NAME} Caught Recording Secret Audition Tape In Studio B', 'Your chief engineer found a polished reel addressed to a bigger station.', -1100, 1.6, 0, 4, 'Confronted gently & offered $1,100 contract lock-in bonus.', 'Fired warning shot ("Finish your shift or walk") — risky!', -1.1, -18],
    ['hx_31', '🌧️', 3, '{HOST_NAME} Trapped On Wrong Side Of Flooded Creek Before Shift', 'Offering to broadcast via scratchy payphone while standing in boots.', -150, 2.2, 4, 3, 'Put {HOST_NAME} live from the creek bank—authentic grit!', 'Played canned music tapes instead (-Ratings).', -1.4, -4],
    ['hx_32', '🐕', 4, '{HOST_NAME} Brings Adopted Three-Legged Hound Into Booth Daily', 'Dog snores audibly during slow ballads, charming older listeners.', 0, 1.7, 3, 4, 'Gave the studio hound an honorary mic credit.', 'Banned pets from control room (-Morale).', -0.4, -8],
    ['hx_33', '🎧', 7, '{HOST_NAME} Demands Creative Control Over Music Playlist', 'Claims corporate oldies lists are killing spontaneity.', 0, 2.3, 2, 4, 'Granted {HOST_NAME} curated playlist freedom (+Ratings, +Loyalty).', 'Insisted on strict clock sheets (-Morale, -Loyalty).', -0.6, -10],
    ['hx_34', '🔥', 8, '{HOST_NAME} Sparks Regional Debate Calling Barbecue Sauce "Overrated Soup"', 'Angry pitmasters across four counties demand a live apology.', -300, 3.5, -5, 2, 'Booked {HOST_NAME} for a messy live BBQ peace tour.', 'Doubled down on anti-sauce trolling (+++Ratings, ---Trust).', 4.1, -10],
    ['hx_35', '📞', 6, 'Prank Caller Tricks {HOST_NAME} Into Reading Fake School Snow Closure In July', 'Three kids enjoyed an extra hour sleeping in before parents caught on.', -250, 2.0, -3, -3, 'Owned the July snow-day prank with good humor.', 'Screamed at callers on open mic (--FCC, --Trust).', 1.4, -9],
    ['hx_36', '💡', 9, '{HOST_NAME} Pitches Weekend Spin-Off Podcast Experiment', 'Needs $850 for digital editing gear to test new younger audiences.', -850, 2.5, 3, 4, 'Funded {HOST_NAME}\'s digital spin-off pilot early.', 'Rejected new-media experiment (-Loyalty).', -0.5, -9],
    ['hx_37', '🎭', 7, '{HOST_NAME} Voices All 6 Characters In Improvised Radio Soap Opera', 'Listeners are suddenly hooked on "As The Pothole Turns."', -200, 2.8, 3, 5, 'Funded weekly scripts for {HOST_NAME}\'s quirky radio drama.', 'Canceled soap opera as off-brand (-Morale).', -0.7, -8],
    ['hx_38', '🧳', 10, '{HOST_NAME} Mulls Early Retirement To Open Bait & Espresso Stand', 'Burned out after years on the mic unless conditions improve.', -1300, 1.8, 1, 5, 'Gave {HOST_NAME} paid sabbatical & $1,300 appreciation bonus.', 'Refused sabbatical; risk of losing {HOST_NAME} for good!', -1.0, -20],
    ['hx_39', '⚖️', 11, '{HOST_NAME} Subpoenaed As Witness In Great Goat Trial', 'Wants paid legal prep to avoid accidentally incriminating station.', -900, 2.1, 3, 2, 'Provided station legal counsel for {HOST_NAME}\'s testimony.', 'Left {HOST_NAME} to fend for themselves (-Loyalty).', -0.3, -12],
    ['hx_40', '📈', 12, '{HOST_NAME} Ranked #1 Most Trusted Voice In Tri-County Reader Poll', 'Competitors immediately start circling with double-salary rumors.', -1400, 2.9, 5, 5, 'Celebrated poll win with contract extension & billboard.', 'Took loyalty for granted (-Loyalty).', 0.2, -14],
    ['hx_41', '🎤', 14, '{HOST_NAME} Accidentally Triggers Emergency Tone Button With Elbow', 'False alarm beeped 4 seconds before they caught it.', -400, -0.4, -2, -4, 'Logged FCC self-report immediately to dodge harsh fines.', 'Pretended nothing happened (-FCC Risk).', -0.8, -6],
    ['hx_42', '🌟', 16, 'National Syndicator Offers {HOST_NAME} Weekend Guest Hosting Slot', 'Could boost station prestige or tempt them away permanently.', -500, 3.1, 4, 4, 'Co-branded the guest slot to funnel national listeners back!', 'Blocked the guest gig out of paranoia (-Loyalty, Leave Risk!).', -0.9, -18]
  ];

  EXTRA_HOST_SCENARIOS.forEach(function (row) {
    HOST_EVENTS.push(
      ev(row[0], 'HOST INCIDENT • {HOST_NAME}', row[1], row[2], row[3], row[4], [
        ch('A) ' + row[9], ['Support / Fix', (row[5] < 0 ? ENG_CASH(row[5]) : '+Cash')], {
          cash: row[5], ratings: row[6], listeners: Math.round(row[6] * 220),
          trust: row[7], morale: row[8], hostLoyalty: 9
        }, row[9]),
        ch('B) ' + row[10], ['Tough / Alternative', 'Tradeoff'], {
          cash: 0, ratings: row[11], listeners: Math.round(row[11] * 180),
          trust: row[12] < -4 ? -4 : 0, morale: -4, hostLoyalty: row[12],
          hostLeaveRisk: row[12] <= -14 ? 0.45 : 0
        }, row[10])
      ], { hostId: null })
    );
  });

  function ENG_CASH(n) {
    return n < 0 ? '-$' + Math.abs(n) : '+$' + n;
  }

  // =========================================================================
  // 3. 32 ADVERTISER EVENTS (DEMANDS, RENEWALS, SCANDALS, POACHING)
  // =========================================================================
  const ADVERTISER_EVENTS = [
    ev('ax_01', 'SPONSOR DEMAND', '📢', 2, 'Major Sponsor Demands Cleaner Evening Language',
      'Conservative accounts warn that station controversy is scaring off churchgoing customers. Switch programming tone or lose goodwill.',
      [
        ch('A) Promise cleaner broadcast standards & drop edgy reads', ['+Ad Sat', '+Trust', '-Ratings'], { cash: 0, ratings: -1.4, listeners: -220, trust: 4, adSat: 9, fcc: 3 }, 'Adjusted evening copy standards to reassure nervous advertisers.'),
        ch('B) Tell sponsors controversy pays the bills', ['+Ratings', '--Ad Sat', 'Sponsor Risk'], { cash: 0, ratings: 1.8, listeners: 340, adSat: -10, fcc: -2 }, 'Refused sponsor censorship, rattling conservative ad buyers.')
      ]),
    ev('ax_02', 'CONTRACT RENEWAL', '📝', 2, 'Anchor Sponsor Renegotiates Annual Contract Downward',
      'Honest Bob or another longtime sponsor claims rival stations offered 20% cheaper afternoon spots.',
      [
        ch('A) Offer 15% loyalty discount to lock in 12-month renewal', ['-$500 Margin', '+Ad Sat', 'Keep Contract'], { cash: -500, ratings: 0.4, adSat: 8, advSatDelta: 12 }, 'Granted loyalty discount to secure multi-month sponsor renewal.'),
        ch('B) Hold firm on rate card & pitch our rising listener reach', ['Full Rate', '50% Walk Risk'], { cash: 300, ratings: 0.2, adSat: -6, advSatDelta: -14 }, 'Refused discount demands during sponsor contract talks.')
      ]),
    ev('ax_03', 'SPONSOR SCANDAL', '🚨', 3, 'Sponsor Caught Selling "Waterproof" Canoes Made Of Painted Cardboard',
      'Three outraged anglers sank 40 feet off the boat ramp while our jingle played on their portable radio.',
      [
        ch('A) Suspend their spots immediately & issue consumer alert', ['-$900 Revenue', '++Trust', '-Ad Sat'], { cash: -900, ratings: 1.6, listeners: 350, trust: 7, adSat: -5, fcc: 3 }, 'Dropped shady cardboard-canoe ads immediately, earning deep listener trust.'),
        ch('B) Keep cashing checks until court verdict lands', ['+$800 Cash', '---Trust', '+Ad Sat'], { cash: 800, ratings: -0.9, listeners: -380, trust: -8, adSat: 3, addConsequence: { id: 'cons_shady_ads', title: 'Shady Sponsor Backlash', kind: 'negative', months: 10, trustMod: -1.5, desc: 'Listeners distrust advertisements after cardboard-canoe scandal.' } }, 'Keeping questionable sponsor spots on air bruised station credibility.')
      ]),
    ev('ax_04', 'RIVAL POACH', '⚔️', 3, 'Rival Station Tries To Steal Our Highest-Paying Advertiser',
      'WKRK or BASS FM offered free morning mentions if our top sponsor jumps ship next month.',
      [
        ch('A) Spend $850 on bonus live-remote sponsor event', ['-$850 Cash', '++Ad Sat', 'Retain Sponsor'], { cash: -850, ratings: 1.6, listeners: 380, adSat: 9, advSatDelta: 15 }, 'Out-hustled rival sales reps with a live sponsor parking-lot party.'),
        ch('B) Ignore rival sales pitches & let numbers speak', ['-Ad Sat', 'Risk Losing Sponsor'], { cash: 0, adSat: -8, advSatDelta: -16 }, 'Declined to match rival promo perks during sponsor poaching push.')
      ]),
    ev('ax_05', 'AD SCRIPT CRISIS', '🎙️', 2, 'Sponsor Insists Hosts Eat Raw Bait Worms During Live Read',
      'A fishing shop offered a $1,200 bonus if your morning host slurps a live nightcrawler on air.',
      [
        ch('A) Do it! Cash the $1,200 stunt fee', ['+$1,200 Cash', '+Ratings', '-Morale', '-Trust'], { cash: 1200, ratings: 2.2, listeners: 450, trust: -3, adSat: 6, morale: -6 }, 'Morning host swallowed a bait worm live for $1,200 sponsor bonus.'),
        ch('B) Decline politely & preserve booth dignity', ['+Morale', '+Trust', '-$1,200 Missed'], { cash: 0, trust: 2, adSat: -3, morale: 4 }, 'Protected host stomachs by turning down live worm-eating ads.')
      ])
  ];

  const EXTRA_AD_SCENARIOS = [
    ['ax_06', '🏷️', 1, 'Taxidermy Sponsor Sends Stuffed Beaver As Studio Mascot', 'Mabel wants the stuffed beaver placed beside the mic on live reads.', 450, 1.2, 1, 6, 'Placed Mabel\'s glass-eyed beaver beside the console (+Ad Sat).', 'Hid the beaver in the supply closet (-Ad Sat).', -0.2, -6],
    ['ax_07', '🛣️', 2, 'Pothole Sponsor Angry You Praised City Paving Progress', 'They sell pothole repairs—smooth roads hurt business!', 650, -0.5, -2, 6, 'Pivot tone to warn about "hidden winter sinkholes" for sponsor peace.', 'Stick to honest road praise (+Trust, -Ad Sat).', 0.8, -8],
    ['ax_08', '🐐', 3, 'Goat Retrieval Sponsor Wants Live Chase Alerts Embedded In News', 'Offers $1,000 bonus to slip goat-retrieval numbers into news bulletins.', 1000, 0.8, -4, 7, 'Blended sponsor plugs into news bulletins (+Cash, -Trust/-FCC).', 'Kept news firewall sacred (+Trust, -Sponsor).', 0.4, -5],
    ['ax_09', '⚖️', 3, 'Bail Bondsman Protests Early-Morning Church Programming', 'Claims gentle organ music lowers impulsive midnight bail traffic.', 550, 1.4, -3, 6, 'Moved bail spots exclusively into Late Night Skywave.', 'Refused to touch Sunday schedules (+Trust, -Ad Sat).', -0.2, -6],
    ['ax_10', '💥', 4, 'Dept Of Boom Prevention Requires All Explosives Ads Vetted', 'Bans fireworks promos near official safety reads.', -300, 0.6, 5, 4, 'Enforced strict safety ad separation (+Trust, +FCC).', 'Aired fireworks right after Boom Prevention anyway (--FCC, -Ad Sat).', 1.2, -8],
    ['ax_11', '🎆', 4, 'Uncle Luther Offers Triple Rates For July Tent-Sale Saturation', 'Wants 24 commercials an hour warning nothing is flame-retardant.', 1850, -1.8, -5, 5, 'Took Uncle Luther\'s saturation cash despite listener groans.', 'Capped fireworks spots to keep listeners tuned (+Trust).', 1.1, -4],
    ['ax_12', '🏦', 5, 'Mattress & Bait Bank Audits Station Financial Stability', 'Conservative bankers threaten pulling contracts if cash looks shaky.', 0, 0.4, 3, 7, 'Shared transparent books & hosted financial literacy hour.', 'Told bankers to mind their own bait vaults (-Ad Sat).', 0.2, -10],
    ['ax_13', '🔧', 5, 'Dr. Zoid\'s Muffler Clinic Wants "Loudest Exhaust Contest" Remote', 'Wants 50 muscle cars revving outside the studio parking lot.', 1250, 2.5, -3, 6, 'Hosted the roaring muffler remote (+Cash, +Ratings, -Trust).', 'Declined noise-ordinance headache (+Trust, -Ad Sat).', -0.3, -5],
    ['ax_14', '📡', 6, 'Tin Foil Outlet Demands Exclusive Placement On Conspiracy Shows', 'Will pay $1,400 bonus if banned from sharing airtime with normal banks.', 1400, 1.5, -2, 6, 'Granted conspiracy-block exclusivity (+Cash, +Ratings).', 'Kept ad rotation open to everyone (+Ad Sat diversity).', 0.1, -4],
    ['ax_15', '🍲', 6, 'Gertie\'s Gravy Emporium Launches "Beverage Gravy" Campaign', 'Wants hosts drinking warm gravy out of coffee mugs during morning drive.', 1150, 2.2, -1, 6, 'Hosts sipped live gravy cheerfully (+Cash, +Ratings).', 'Kept coffee in coffee mugs (-Ad Sat).', 0.1, -5],
    ['ax_16', '🚁', 7, 'Agri-Drone Sponsor Demands We Never Mention Goose Collisions', 'Two drones met stubborn geese near Route 9 yesterday.', 1500, -0.8, -6, 7, 'Downplayed drone mishaps for $1,500 contract retention.', 'Reported drone-goose collision truthfully (+Trust, --Ad Sat).', 1.6, -11],
    ['ax_17', '📉', 4, 'Sponsor Complains Commercial Volume Is Lower Than Music Volume', 'Wants commercials blasted 40% louder like big-city cable.', 700, -1.5, -4, 6, 'Cranked commercial loudness (+Cash, -Ratings, -FCC risk).', 'Kept FCC-compliant calm audio levels (+FCC, +Trust).', 0.6, -4],
    ['ax_18', '🧾', 5, 'Three Local Sponsors Form "Clean Airwaves Coalition" Boycott Threat', 'Demand lower controversy across Morning & Afternoon blocks.', -600, -0.9, 5, 10, 'Committed to daytime family programming (+Ad Sat, +Trust).', 'Ignored coalition boycott threats (--Ad Sat, +Ratings).', 1.8, -14],
    ['ax_19', '🎉', 6, 'Sponsor Offers Matching Grant For Local High School Band Uniforms', 'Needs $800 station co-sponsorship to trigger $5,000 community goodwill.', -800, 2.1, 7, 8, 'Co-sponsored band uniforms (+Trust, +Ad Sat, +Listeners).', 'Passed on co-sponsorship budget (-Ad Sat).', -0.3, -4],
    ['ax_20', '🚗', 7, 'Used Car Dealer Wants Live Helicopter Ad Drop Over Mall', 'Asks to drop plastic coupons from sky—high litter fine risk!', 1600, 2.4, -5, 5, 'Ran risky coupon drop (+Cash, +Ratings, --FCC).', 'Rejected aerial litter stunt (+Trust, +FCC).', 0.3, -4],
    ['ax_21', '📱', 8, 'Sponsor Wants QR Codes / Website Links Read Character-By-Character', 'Reading "h-t-t-p-colon-slash-slash..." eats 22 seconds of every spot.', 800, -1.1, -1, 6, 'Read full URLs slowly for $800 tech-sponsor bonus.', 'Used clean vanity phone number instead (+Ratings).', 0.8, -5],
    ['ax_22', '🥊', 9, 'Two Competing Sponsors Demand Rival Attack Ads On Air', 'One bail bondsman wants spots accusing the other of cheap pretzels.', 1350, 2.0, -5, 4, 'Aired brutal pretzel-shaming attack ads (+Cash, +Ratings, -Trust).', 'Enforced positive-only ad policy (+Trust, +Ad Sat).', 0.2, -3],
    ['ax_23', '🌾', 10, 'Regional Co-Op Offers Huge Harvest Season Contract—If Ratings Top 25%', 'Contingent payout bonus tied to hitting ratings target.', 1800, 1.5, 2, 7, 'Committed aggressively to harvest sponsorship targets.', 'Took safe flat modest rate instead.', 0.2, 2],
    ['ax_24', '⚡', 11, 'Battery & Generator Sponsor Spikes Budget During Storm Season', 'Wants emergency exclusivity whenever storms threaten.', 1700, 1.3, 2, 7, 'Signed storm-trigger sponsorship rider (+Cash, +Ad Sat).', 'Kept emergency broadcasts ad-free (+Trust).', 0.6, -3],
    ['ax_25', '📉', 12, 'National Ad Agency Audits Listener Demographics', 'Insists we add fresher shows for younger commuters or face rate cuts.', -500, 1.2, 1, 7, 'Invested $500 in audience-research refresh (+Ad Sat).', 'Dismissed big-city agency metrics (-Ad Sat).', -0.4, -9],
    ['ax_26', '📻', 13, 'Sponsor Requests Host Endorse Product As "Doctor Recommended"', 'Illegal medical claim without proof—major FCC/FTC trap!', 1900, 0.5, -7, 4, 'Aired risky medical claim (+Cash, ---FCC, Violation risk!).', 'Blocked illegal medical claim (+Trust, +FCC).', 0.4, -4],
    ['ax_27', '🏆', 14, 'Longtime Sponsor Celebrates 25th Anniversary With Gala Broadcast', 'Requests live remote party from showroom floor.', -900, 2.3, 4, 10, 'Threw full showroom remote celebration (+Ad Sat, +Listeners).', 'Sent congratulations fruit basket only.', 0.2, -3],
    ['ax_28', '💻', 15, 'Sponsors Shift Budgets Toward Internet Banner Ads Unless Proven Value', 'Local shops wonder if AM radio still moves merchandise.', -1000, 1.6, 2, 9, 'Ran "Mention WSTF For 10% Off" proof campaign (-$1,000, +Ad Sat).', 'Shrugged off digital ad competition (-Ad Sat).', -0.5, -10],
    ['ax_29', '🎙️', 16, 'Sponsor Threatens Cancellation Unless Conspiracy Carl Stops Mentioning Them', 'Carl keeps praising their tin foil for blocking orbital lasers.', 0, 1.4, 2, 7, 'Added strict do-not-ad-lib rules for Carl (+Ad Sat, -Morale).', 'Let Carl riff freely (+Ratings, --Ad Sat).', 2.2, -12],
    ['ax_30', '🚚', 18, 'Regional Trucking Fleet Offers Mega-Contract For Overnight Skywave', 'Wants 100% overnight truck-stop coverage & dedicated traffic updates.', 2600, 2.0, 3, 9, 'Tailored overnight programming for truckers (+Cash, +Listeners).', 'Declined overnight format shift.', 0.2, -4],
    ['ax_31', '🌟', 20, 'Statewide Brand Offers Naming Rights To Morning Drive', 'Offers huge cash to call it "The Mega-Drone Morning Show."', 3200, -1.0, -4, 7, 'Sold Morning Drive naming rights (+Cash, -Trust).', 'Protected historic show title (+Trust, +Morale).', 1.4, -4],
    ['ax_32', '📢', 22, 'Legacy Sponsors Demand Discounted Rates For 20-Year Loyalty', 'Founding accounts argue they built the station with you.', -1200, 0.8, 4, 11, 'Honored founding-sponsor loyalty discount (+Ad Sat, +Trust).', 'Applied modern market rate hikes (-Ad Sat).', 0.3, -11]
  ];

  EXTRA_AD_SCENARIOS.forEach(function (row) {
    ADVERTISER_EVENTS.push(
      ev(row[0], 'ADVERTISER RELATIONS', row[1], row[2], row[3], row[4], [
        ch('A) ' + row[9], ['Sponsor Path', (row[5] < 0 ? ENG_CASH(row[5]) : '+Cash')], {
          cash: row[5], ratings: row[6], listeners: Math.round(row[6] * 190),
          trust: row[7], adSat: row[8], advSatDelta: row[8]
        }, row[9]),
        ch('B) ' + row[10], ['Alternative Path', 'Tradeoff'], {
          cash: 0, ratings: row[11], listeners: Math.round(row[11] * 160),
          trust: row[7] < 0 ? 4 : -2, adSat: row[12], advSatDelta: row[12]
        }, row[10])
      ])
    );
  });

  // =========================================================================
  // 4. 26 WEATHER & EMERGENCY EVENTS
  // =========================================================================
  const WEATHER_EMERGENCY_EVENTS = [];
  const WEATHER_TUPLES = [
    ['wx_01', '🌪️', 1, 'EF-2 Tornado Touchdown Near Pine Hollow', 'Sirens wail as a funnel cloud clips three barns and knocks power out west of town.', true],
    ['wx_02', '🧊', 1, 'Freezing Rain Coats Power Lines In 1-Inch Ice', 'Transformers explode like blue firecrackers across County Road 4.', true],
    ['wx_03', '❄️', 2, 'Freak 18-Inch Blizzard Buries County Plows', 'Only snowmobiles and battery radios are moving downtown.', true],
    ['wx_04', '🌊', 2, 'Dam Spillway Seepage Forces Valley Evacuation Alert', 'Engineers warn low bridges may wash out before midnight.', true],
    ['wx_05', '🔥', 3, 'Dry Brush Wildfire Jumps Highway 31 Median', 'Thick cedar smoke drops visibility to ten feet near Exit 12.', true],
    ['wx_06', '☣️', 3, 'Rail Tanker Leaks Mildly Pungent Pickle Brine Vapor', 'Hazmat crews order shelter-in-place within two miles of the depot.', true],
    ['wx_07', '🌡️', 4, '107-Degree Heat Dome Melts Asphalt & AC Grids', 'Emergency cooling shelters open at the VFW and Civic Auditorium.', true],
    ['wx_08', '🌫️', 2, 'Zero-Visibility River Fog Blankets Morning Commute', 'Twelve fender-benders jam the Mud Creek Bridge.', true],
    ['wx_09', '⛈️', 4, 'Baseball-Sized Hail Shreds Car Dealership Canopies', 'Windshields across three zip codes sound like popcorn.', true],
    ['wx_10', '💨', 5, '80-MPH Derecho Straight-Line Winds Flatten Grain Silos', 'Toppled oaks block four major highways simultaneously.', true],
    ['wx_11', '⚡', 3, 'Lightning Strike Trips Main Substation Breaker Twice', 'Rolling blackouts hit hospitals and poultry houses.', true],
    ['wx_12', '🌊', 5, 'Tropical Storm Remnants Stall For 36 Hours Of Rain', 'Nine inches of rainfall turn parking lots into bass ponds.', true],
    ['wx_13', '🌪️', 6, 'Twin Waterspouts Merge Over Lake Somewhere', 'Fishing tournaments scatter as dock ramps wash ashore.', true],
    ['wx_14', '🔥', 7, 'Grain Elevator Dust Explosion Rattles Windows For 10 Miles', 'Fire departments from four counties converge on downtown.', true],
    ['wx_15', '❄️', 6, 'Polar Vortex Plunges Overnight Low To -14°F', 'Frozen water mains burst under Main Street.', true],
    ['wx_16', '🌫️', 8, 'Dust Haboob Rolls Across Freshly Plowed Fields', 'Afternoon skies turn Mars-orange for ninety eerie minutes.', true],
    ['wx_17', '⛈️', 9, 'Flash Flood Washes Out Timber Bridge On Route 9', 'School buses stranded on south bank need instant rerouting.', true],
    ['wx_18', '☣️', 10, 'Fertilizer Tanker Overturns On Interstate Interchange', 'State police shut I-10 ramps for six hours.', true],
    ['wx_19', '🐟', 7, 'Severe Updraft Drops Perch & Pondweed Across High School Track', 'Minor fish rain shower startles Friday track meet.', true],
    ['wx_20', '⚡', 11, 'Regional Transformer Fire Cuts Internet & Cell Towers Together', 'AM radio instantly becomes the sole unbroken public channel.', true],
    ['wx_21', '🌊', 12, 'Coastal Surge Warning Sends Evacuation Traffic Inland', 'Ten thousand coastal vehicles pour up Highway 31 seeking shelter.', true],
    ['wx_22', '🔥', 13, 'Tire Warehouse Fire Sends Plume Visible 60 Miles Away', 'Health alerts urge closing windows countywide.', true],
    ['wx_23', '🌪️', 15, 'Nocturnal Tornado Warning At 2:18 AM', 'Sleeping households rely on loud emergency tone alerts to wake up.', true],
    ['wx_24', '❄️', 16, 'Historic Ice Storm Downs Regional Fiber & Cable Lines', 'Broadcast towers on generator power carry the entire state.', true],
    ['wx_25', '💨', 18, 'Hurricane Eyewall Brushes Inland Corridor With 95-MPH Gusts', 'Roof shingles fly as emergency management relies on our tower.', true],
    ['wx_26', '⚡', 21, 'Regional Grid Cascade Blackout Hits Four Neighboring States', 'Clear-channel AM coverage becomes emergency central for millions.', true]
  ];

  WEATHER_TUPLES.forEach(function (w) {
    WEATHER_EMERGENCY_EVENTS.push(
      ev(w[0], 'EMERGENCY BROADCAST', w[1], w[2], w[3], w[4], [
        ch('A) Interrupt ALL programming for continuous Emergency Coverage', ['++Public Trust', '++Listeners', '+FCC', '-Ad Revenue'], {
          cash: -550, ratings: 3.6, listeners: 1150, trust: 7, adSat: -4, fcc: 5, morale: 3, adPreempt: 0.24,
          addConsequence: { id: 'cons_hero_emerg', title: 'Trusted Emergency Lifeline', kind: 'positive', months: 10, trustMod: 0.9, ratingsMult: 1.05, desc: 'Public remembers station heroism during recent disaster.' }
        }, 'Continuous emergency broadcasts during "' + w[3] + '" saved property and built lasting public trust.'),
        ch('B) Run hourly storm bulletins between scheduled commercials', ['+Trust', '+Listeners', 'Balanced Revenue'], {
          cash: 0, ratings: 1.5, listeners: 400, trust: 2, adSat: 1, fcc: 1, adPreempt: 0.08
        }, 'Threaded timely safety bulletins between sponsor breaks during "' + w[3] + '".'),
        ch('C) Ignore emergency & keep full commercial schedule rolling', ['Full Ads', '---Public Trust (24 mos)', '---FCC'], {
          cash: 450, ratings: -1.6, listeners: -520, trust: -9, adSat: 2, fcc: -9, morale: -4,
          setHistoryFlag: 'ignoredEmergency',
          addConsequence: { id: 'cons_emerg_betrayal', title: 'Emergency Broadcast Betrayal', kind: 'negative', months: 24, trustMod: -2.2, fccMod: -1.4, desc: 'Community backlash and FCC scrutiny linger for years after skipping disaster coverage.' }
        }, 'Ignoring "' + w[3] + '" for commercials triggered years of bitter community distrust.')
      ], { isEmergency: true })
    );
  });

  // =========================================================================
  // 5. 22 INDUSTRY EVOLUTION EVENTS
  // =========================================================================
  const INDUSTRY_EVENTS = [];
  const INDUSTRY_TUPLES = [
    ['ind_01', '📻', 2, 'FM Stereo Expansion Hits Small-Town Dials', 'Car makers drop AM presets to the second page as shiny FM stereo stations steal music listeners.', 'music'],
    ['ind_02', '📺', 3, '24-Hour Cable Weather Channels Launch In County Homes', 'Listeners now check swirling radar graphics on TV before tuning in for static weather reads.', 'weather'],
    ['ind_03', '🗣️', 4, 'National Syndicated Talk Radio Boom Sweeps Daytime', 'Loud syndicated political hosts threaten local Swap Shop & mild chat shows.', 'talk'],
    ['ind_04', '🏢', 5, 'Telecom Deregulation Sparks Corporate Station Roll-Ups', 'Out-of-state conglomerates buy up tiny stations to replace hosts with satellite voice-tracking.', 'news'],
    ['ind_05', '📢', 6, 'Big-Box Megamart Replaces Five Mom-And-Pop Advertisers', 'Local hardware and bait shops struggle, forcing radio sales teams to chase bigger contracts.', 'finance'],
    ['ind_06', '💾', 6, 'Y2K Studio Clock Panic Strikes Broadcast Software', 'Old automation PCs insist today is January 1, 1900 unless patched before air.', 'news'],
    ['ind_07', '🛰️', 8, 'Satellite Radio Commercial-Free Music Debuts In New Cars', 'Wealthy commuters install dashboard dishes offering 100 commercial-free channels.', 'music'],
    ['ind_08', '🌐', 10, 'Dial-Up Web Streams Let Ex-Locals Listen From Across The World', 'College kids and deployed locals beg the station to put an audio stream online.', 'community'],
    ['ind_09', '📱', 11, 'Text-Messaging Traffic Tips Threaten Old Call-In Hotlines', 'Younger listeners text hazards instead of dialing the request desk.', 'absurd_civic'],
    ['ind_10', '🎧', 12, 'MP3 Players & Auxiliary Cables Steal Commuter Attention', 'Dashboard cassette adapters let drivers plug in personal playlists instead of AM oldies.', 'music'],
    ['ind_11', '📡', 13, 'HD Radio Digital Upgrade Mandate Debates Roil AM', 'Engineers urge expensive digital sideband equipment to cut AM electrical buzz.', 'news'],
    ['ind_12', '🎙️', 14, 'Early True-Crime & Paranormal Podcasts Pull Late-Night Ears', 'Insomniac truckers start downloading homemade conspiracy shows onto phones.', 'conspiracy'],
    ['ind_13', '📲', 15, 'Social Media Rumor Pages Break Local Fender-Benders First', 'Volunteer scanner pages beat sluggish hourly radio bulletins.', 'news'],
    ['ind_14', '🚙', 16, 'Electric Vehicles Introduce High-Frequency AM Static Interference', 'Car engineers consider dropping AM tuners from new dashboards entirely!', 'community'],
    ['ind_15', '🎧', 17, 'The Great Podcast Explosion Hits Mainstream Commutes', 'Every local barista and bass angler launches a competing two-hour podcast.', 'talk'],
    ['ind_16', '🤖', 18, 'Algorithmic Streaming Playlists Study Local Listening Habits', 'Music streaming services target county demographics with laser precision.', 'music'],
    ['ind_17', '📢', 19, 'Programmatic Digital Ad Exchanges Undercut Traditional Radio Rates', 'Local dentists demand click-metrics before renewing old-school radio spots.', 'finance'],
    ['ind_18', '🔊', 20, 'Smart Speakers In Kitchens Replace Tabletop Clock Radios', 'Listeners ask voice assistants for weather instead of twisting physical dials.', 'weather'],
    ['ind_19', '📉', 21, 'Regional Print Newspaper Folds—Leaving News Vacuum!', 'The county\'s 110-year-old paper stops printing, making radio the last real newsroom.', 'news'],
    ['ind_20', '🚗', 22, 'Federal Bill Protects AM Radio In Vehicle Dashboards', 'Safety regulators celebrate AM\'s emergency reach, giving legacy signals new life.', 'safety'],
    ['ind_21', '🌐', 23, 'AI-Cloned Voice Scammers Impersonate Local Radio Hosts Online', 'Fake clips claim Big Earl endorsed dubious crypto bait coins.', 'conspiracy'],
    ['ind_22', '🏆', 24, 'Retro Analog Renaissance: Gen-Z Discovers Local AM Radio', 'Young listeners fall in love with unfiltered small-town swap shops and goats.', 'absurd_nature']
  ];

  INDUSTRY_TUPLES.forEach(function (ind) {
    INDUSTRY_EVENTS.push(
      ev(ind[0], 'INDUSTRY SHIFT', ind[1], ind[2], ind[3], ind[4], [
        ch('A) Invest heavily to adapt & modernize (-$2,400 base)', ['-$2,400 Scaled', '+Listeners', '+Ad Sat', '+Future Proof'], {
          cash: -2400, ratings: 2.2, listeners: 650, trust: 3, adSat: 5, morale: 4
        }, 'Invested to adapt proactively to "' + ind[3] + '".'),
        ch('B) Double down on live local personality rivals can\'t copy', ['Free', '+Trust', '+Morale', '-Slight Ad Pressure'], {
          cash: 0, ratings: 1.4, listeners: 380, trust: 5, adSat: -3, morale: 5
        }, 'Countered "' + ind[3] + '" by doubling down on hyper-local community personality.'),
        ch('C) Cut costs & ride out the trend conservatively', ['+$900 Saved', '-Ratings', '-Younger Listeners'], {
          cash: 900, ratings: -1.4, listeners: -320, trust: -1, adSat: -2, morale: -2
        }, 'Kept spending tight while "' + ind[3] + '" reshaped listening habits.')
      ], { isIndustryEvent: true, industryCategory: ind[5] })
    );
  });

  // =========================================================================
  // 6. 20 NEW MULTI-STAGE EVENT CHAINS
  // =========================================================================
  function makeChain(id, minYear, icon, title1, desc1, c1A, c1B, title2A, desc2A, title2B, desc2B, flagName, consA, consB) {
    return {
      id: id,
      minYear: minYear,
      step1: {
        category: 'EVENT CHAIN • WEEK 1',
        icon: icon,
        isEmergency: false,
        title: title1,
        description: desc1,
        choices: [
          ch('A) ' + c1A.label, c1A.tags, c1A.fx, c1A.report, { chainBranch: 'branchA' }),
          ch('B) ' + c1B.label, c1B.tags, c1B.fx, c1B.report, { chainBranch: 'branchB' })
        ]
      },
      step2ByBranch: {
        branchA: {
          category: 'CHAIN RESOLUTION • FOLLOW-UP',
          icon: icon,
          isEmergency: false,
          title: title2A,
          description: desc2A,
          flagGrant: flagName || null,
          choices: [
            ch('A) Go all-in on the payoff coverage', ['++Ratings', '++Listeners', '+Long-Term Effect'], Object.assign({ cash: -450, ratings: 3.4, listeners: 950, trust: 3, morale: 4 }, consA ? { addConsequence: consA } : {}), 'Chain payoff: ' + title2A),
            ch('B) Monetize the climax with rapid sponsors', ['+$1,400 Cash', '+Ad Sat'], { cash: 1400, ratings: 1.6, listeners: 400, adSat: 5 }, 'Monetized chain finale of "' + title2A + '".')
          ]
        },
        branchB: {
          category: 'CHAIN RESOLUTION • BLOWBACK',
          icon: icon,
          isEmergency: false,
          title: title2B,
          description: desc2B,
          choices: [
            ch('A) Scramble to contain fallout & apologize', ['-$850 Cash', 'Limit Damage'], { cash: -850, ratings: 1.0, listeners: 220, trust: 1, fcc: 2 }, 'Contained fallout from "' + title2B + '".'),
            ch('B) Double down stubbornly on air', ['++Ratings', '---Trust', 'Persistent Penalty'], Object.assign({ cash: 0, ratings: 3.2, listeners: 620, trust: -6, fcc: -5 }, consB ? { addConsequence: consB } : {}), 'Stubbornly doubled down during "' + title2B + '".')
          ]
        }
      }
    };
  }

  const MULTI_CHAINS = [
    makeChain('mc_01', 1, '🌉', 'Toll Bridge Tender Threatens To Raise Drawbridge During Rush Hour', 'Bridge operator claims nobody listens to his poetry corner on Sunday afternoons.',
      { label: 'Invite him on air for Sunday Bridge Poetry', tags: ['+Trust', 'Chain: Peace'], fx: { cash: 0, ratings: 1.4, trust: 3, morale: 2 }, report: 'Scheduled bridge tender poetry on Sunday radio.' },
      { label: 'Mock his poetry on morning drive', tags: ['+Ratings', 'Chain: Standoff'], fx: { cash: 0, ratings: 2.3, trust: -3 }, report: 'Roasted the bridge tender\'s poetry ruthlessly.' },
      'Bridge Tender Poetry Hour Becomes Belovéd Traffic Fixture', 'Motorists slow down just to wave at our resident bridge poet!',
      'Drawbridge Raised 45 Minutes Mid-Commute In Poetic Protest!', 'Motorists glare at our bumper stickers as barges crawl underneath.', null,
      { id: 'cons_bridge_poet', title: 'Bridge Poet Goodwill', kind: 'positive', months: 10, trustMod: 1.0, desc: 'Commuters love station\'s poetic drawbridge partnership.' },
      { id: 'cons_bridge_feud', title: 'Drawbridge Commuter Delays', kind: 'negative', months: 8, trustMod: -1.4, desc: 'Bridge operator sporadically delays commuters near our tower.' }),
    makeChain('mc_02', 2, '🚜', 'Mystery Crop Duster Paints Giant Question Mark Over Town', 'A biplane sketched a mile-wide "?" in harmless cornstarch vapor.',
      { label: 'Run polite aviation mystery coverage', tags: ['+Trust', 'Chain: Promo'], fx: { cash: 0, ratings: 1.8, listeners: 420, trust: 2 }, report: 'Tracked the skywriting question mark responsibly.' },
      { label: 'Claim alien crop-chemical warfare!', tags: ['++Ratings', '--FCC', 'Chain: Panic'], fx: { cash: 0, ratings: 3.2, listeners: 740, trust: -4, fcc: -4 }, report: 'Broadcast wild panic over the skywritten question mark.' },
      'Skywriter Revealed As Honest Bob\'s Canoe Insurance Teaser!', 'Honest Bob brings giant checks and smiles to the lobby.',
      'FAA & FCC Investigate Sky-Panic Rumors After Residents Hide In Root Cellars', 'Investigators demand studio logs from our alien-vapor rant.', null, null,
      { id: 'cons_faa_fine', title: 'Sky-Panic Regulatory Audit', kind: 'negative', months: 10, fccMod: -1.6, cashPerMonth: -450, desc: 'Paying compliance review fees after false sky-panic rumors.' }),
    makeChain('mc_03', 2, '🐐', 'Stray Goat Enters County Chili Cook-Off Judging Tent', 'A determined white billy goat swallowed three scorecards and belched victoriously.',
      { label: 'Promote goat as official celebrity judge', tags: ['+Ratings', '+Morale'], fx: { cash: 0, ratings: 2.2, listeners: 490, morale: 4 }, report: 'Celebrated the chili-eating goat on air.' },
      { label: 'Demand goat ban from food tents', tags: ['+Trust', '-Goat Fans'], fx: { cash: 0, ratings: 0.8, trust: 3 }, report: 'Called for strict goat boundaries at food festivals.' },
      'Goat Judge Draws Crowds To Downtown Chili Parade', 'Restaurants create "Goat Approved" spicy specials.',
      'Goat Solidarity March Pickets Outside Studio Doors', 'Forty goats and six farmers chant peacefully beneath our window.', 'sawGoatEvent', null, null),
    makeChain('mc_04', 3, '🐟', 'Local Lake Turns Slightly Neon Green Before Bass Opener', 'Harmless lake-dye testing collided with angler superstition.',
      { label: 'Consult state biologists & reassure anglers', tags: ['+Trust', '+FCC'], fx: { cash: -200, ratings: 1.5, trust: 4, fcc: 2 }, report: 'Interviewed lake biologists about safe dye testing.' },
      { label: 'Declare "Mutant Glowing Bass Season!"', tags: ['++Ratings', '-Trust'], fx: { cash: 0, ratings: 3.1, listeners: 710, trust: -4 }, report: 'Hyped mutant glowing bass fever across fishing shows.' },
      'Record Angler Turnout Thanks Station For Honest Lake Info', 'Tackle shops rush to buy extra spots.',
      'Tourism Board Furious Over False "Radioactive Bass" Scare', 'Canceled fishing charters blame our glowing-bass hype.', 'sawFishRain', null,
      { id: 'cons_tourism_chill', title: 'Lake Tourism Chill', kind: 'negative', months: 12, adSatMod: -1.5, desc: 'Outdoor resorts wary after exaggerated mutant-bass broadcasts.' }),
    makeChain('mc_05', 3, '📻', 'Pirate Micro-FM Transmitter Pops Up Near High School', 'A mysterious teen DJ calls himself "DJ Static" and interrupts our afternoon fade.',
      { label: 'Offer DJ Static a Saturday intern training spot', tags: ['-$300', '+Morale', '+Youth'], fx: { cash: -300, ratings: 2.1, listeners: 520, morale: 5 }, report: 'Recruited pirate teen DJ as weekend assistant.' },
      { label: 'Report pirate transmitter straight to FCC', tags: ['+FCC', '-Youth Cred'], fx: { cash: 0, ratings: 0.5, fcc: 4, trust: -1 }, report: 'Reported local teen pirate transmitter to FCC enforcement.' },
      'DJ Static Brings Fresh Young Listeners To Station!', 'High schoolers start tuning in to AM again.',
      'Teen Listeners Flood Phone Lines Mocking "Narc Radio"', 'High schoolers organize prank call waves.', null,
      { id: 'cons_youth_wave', title: 'Youth Listener Boost', kind: 'positive', months: 12, ratingsMult: 1.06, desc: 'Younger audience segment tunes in thanks to recruited local talent.' }, null),
    makeChain('mc_06', 4, '🕳️', 'Basement Beneath Studio Starts Echoing Like Cathedral', 'Engineers suspect a forgotten 1920s coal chute runs under the broadcast desk.',
      { label: 'Explore safely with structural engineer', tags: ['-$600', '+FCC', '+Trust'], fx: { cash: -600, ratings: 1.4, trust: 3, fcc: 2 }, report: 'Inspected the hollow space under our control desk safely.' },
      { label: 'Broadcast eerie "Studio Ghost" specials from downstairs', tags: ['++Ratings', '-Safety'], fx: { cash: 0, ratings: 2.9, listeners: 660, morale: 3 }, report: 'Aired eerie acoustics from the subterranean studio chamber.' },
      'Hidden 1928 Broadcast Microphone Found Intact—Museum Pays Grant!', 'Historical find boosts station prestige and cash.',
      'Studio Floor Collapses Four Inches During Live Polka!', 'Console drops mid-song; repairs urgently needed.', null, null, null),
    makeChain('mc_07', 4, '🚒', 'Town Buys Used Fire Truck Whose Siren Plays "Dixie"', 'Every emergency call blasts carnival music down residential lanes.',
      { label: 'Raise $750 on air for normal siren horn', tags: ['-$750', '++Trust'], fx: { cash: -750, ratings: 1.8, trust: 6 }, report: 'Launched listener drive for a proper fire-truck siren.' },
      { label: 'Joke about the musical fire engine mercilessly', tags: ['++Ratings', '-Fire Dept'], fx: { cash: 0, ratings: 2.5, trust: -3 }, report: 'Teased the fire department\'s musical siren non-stop.' },
      'Firefighters Honor Station With Honorary Helmet & Plaque', 'Deep community goodwill ripples for months.',
      'Fire Chief Refuses Interview Exclusives With Station', 'Rival station gets first fire-scene access.', null, null, null),
    makeChain('mc_08', 5, '🏛️', 'County Fair Committee Splits Into Two Rival Fairs On Same Weekend', 'One fair keeps the Ferris wheel; the other takes the Butter Sculpture and Goat Pen.',
      { label: 'Cover both fairs evenly as town peacemaker', tags: ['-$500', '++Trust', '+Listeners'], fx: { cash: -500, ratings: 2.1, listeners: 540, trust: 5 }, report: 'Split remote crews between both rival county fairs.' },
      { label: 'Pick sides exclusively for the Goat Fair payout', tags: ['+$1,400', '-Trust'], fx: { cash: 1400, ratings: 1.6, trust: -4 }, report: 'Backed the Goat Fair exclusively for sponsor cash.' },
      'Reunited Fair Committee Names Station Official Voice Forever', 'Permanent civic goodwill!',
      'Ferris-Wheel Faction Boycotts Station Advertisers', 'Half the county skips sponsor booths.', null, null, null),
    makeChain('mc_09', 6, '🚗', 'Highway 31 Repaving Project Uncovers 1957 Time-Capsule Plymouth', 'Work crews unearth a sealed concrete vault holding an immaculate vintage sedan.',
      { label: 'Broadcast unveiling live with Classic Oldies tie-in', tags: ['-$500', '++Listeners', '+Trust'], fx: { cash: -500, ratings: 2.9, listeners: 790, trust: 4 }, report: 'Broadcast live coverage of the unearthed 1957 Plymouth.' },
      { label: 'Skip remote & let regional TV steal the spotlight', tags: ['Save Cash', '-Relevance'], fx: { cash: 0, ratings: -0.9, listeners: -200 }, report: 'Skipped live remote for the 1957 Plymouth unveiling.' },
      'Vintage Car Club Buys Year-Long Sponsorship!', 'Classic car buffs pack station ads.',
      'Rival Station Wins Exclusive Car-Reveal Interview', 'Competitors brag endlessly about scooping us.', null, null, null),
    makeChain('mc_10', 6, '🥤', 'Local Soda Bottler Tests "Sweet Corn & Cinnamon" Cola Formula', 'Hands out 2,000 unlabeled aluminum cans across downtown.',
      { label: 'Give honest blind taste review on air', tags: ['+Trust', '+Ratings'], fx: { cash: 0, ratings: 2.2, listeners: 480, trust: 4 }, report: 'Honest corn-cola taste test earned listener respect.' },
      { label: 'Take $1,300 to call it "Nectar of the Gods" on air', tags: ['+$1,300', '--Trust'], fx: { cash: 1300, ratings: 1.0, trust: -5 }, report: 'Accepted heavy cash to hype questionable corn cola.' },
      'Bottler Pivots Formula Thanks To Our Feedback & Rewards Us!', 'Smart hometown partnership pays off.',
      'Listeners Gag On Sweet-Corn Cola & Blame Radio Hype!', 'Credibility takes a sticky, carbonated hit.', null, null, null),
    makeChain('mc_11', 7, '🐾', 'Forty-Pound Catfish Named "Bumper" Escapes Bait Tank Into Storm Drain', 'Bumper surfaces whenever anyone drops half a cheeseburger near the grate.',
      { label: 'Organize safe wildlife capture & pond release', tags: ['-$350', '++Trust'], fx: { cash: -350, ratings: 2.0, listeners: 510, trust: 5 }, report: 'Organized safe rescue for Bumper the drain catfish.' },
      { label: 'Turn drain into tourist betting attraction', tags: ['++Ratings', '--FCC'], fx: { cash: 500, ratings: 3.1, trust: -5, fcc: -3 }, report: 'Turned drain-catfish feeding into reckless spectator bets.' },
      'Bumper Safely Released Into County Lake—Fish Club Cheers!', 'Anglers celebrate Bumper\'s homecoming.',
      'City Clogs Main Drain With Dropped Burgers; Health Dept Fines Us!', 'Expensive cleanup bill arrives at studio door.', 'sawFishRain', null, null),
    makeChain('mc_12', 8, '📡', 'Mystery Numbers Station Broadcasts Grocery Lists On Nearby Frequency', '"Fourteen... Bananas... Seven... Whole Milk..." echoes at midnight.',
      { label: 'Decode it humorously as Late Night Mystery Theater', tags: ['++Ratings', '+Listeners'], fx: { cash: 0, ratings: 2.9, listeners: 740, morale: 4 }, report: 'Turned midnight grocery-list frequency into cult mystery radio.' },
      { label: 'Alert federal spectrum monitors immediately', tags: ['+FCC', '+Trust'], fx: { cash: 0, ratings: 1.1, trust: 3, fcc: 4 }, report: 'Reported unusual overnight frequency interference to FCC.' },
      'Turns Out It Was Elderly Baker Testing Her Son\'s Ham Rig—Heartwarming Viral Hit!', 'Everyone laughs and orders cinnamon rolls.',
      'Spectrum Agents Confiscate Innocent Baker\'s Hobby Rig Live—Angry Town!', 'Townsfolk grumble we overreacted over harmless banana broadcasts.', null, null, null),
    makeChain('mc_13', 9, '🏆', 'County Enters "Cleanest Small Town" Competition Against Rival County', 'Judges arrive next Friday; stray plastic bags and rogue goats threaten victory.',
      { label: 'Lead volunteer street-sweep marathon on air', tags: ['-$500', '++Trust', '+Listeners'], fx: { cash: -500, ratings: 2.5, listeners: 680, trust: 7 }, report: 'Led massive community cleanup ahead of state judging.' },
      { label: 'Expose rival county\'s litter secrets instead', tags: ['++Ratings', '--Trust'], fx: { cash: 0, ratings: 3.0, trust: -5 }, report: 'Ran trash-talk mudslinging against neighboring county.' },
      'We Win "Cleanest Town" Banner—Station Credited On Courthouse Sign!', 'Historic civic trophy boosts morale & ad value.',
      'Judges Dock Points For "Unsportsmanlike Broadcast Feud"', 'Town loses award and glares at our studio.', null, null, null),
    makeChain('mc_14', 10, '⚡', 'Electric Co-Op Proposes Wind Turbine Directly Behind Our AM Tower', 'Engineers warn spinning steel blades could bounce our AM signal straight into Kansas.',
      { label: 'Fund joint RF engineering study to coexist cleanly', tags: ['-$1,400', '+FCC', '+Trust'], fx: { cash: -1400, ratings: 1.2, trust: 5, fcc: 4 }, report: 'Funded RF coexistence study with electric co-op.' },
      { label: 'Wage furious anti-turbine propaganda war', tags: ['++Ratings', '-Trust', 'Legal Risk'], fx: { cash: 0, ratings: 3.2, trust: -4, fcc: -2 }, report: 'Attacked electric co-op turbine plans loudly on air.' },
      'Clean Compromise Reached—Co-Op Buys Long-Term Sponsorship!', 'Clean energy + clean AM signal!',
      'Signal Null Zone Cuts North County Reception For Months!', 'Legal brawl leaves listeners hearing turbine static.', null, null,
      { id: 'cons_turbine_null', title: 'North County Signal Null', kind: 'negative', months: 9, ratingsMult: 0.92, desc: 'Unmitigated turbine blade reflections degrade northern signal clarity.' }),
    makeChain('mc_15', 11, '🎭', 'Hollywood Indie Film Crew Asks To Shoot Scene Inside Our Aging Studio', 'Director promises $2,500 location fee if hosts stay quiet during takes.',
      { label: 'Accept $2,500 & cooperate smoothly for film credit', tags: ['+$2,500', '+Morale'], fx: { cash: 2500, ratings: 1.5, morale: 4 }, report: 'Hosted indie film crew inside studio for location fee.' },
      { label: 'Sneak live microphone onto set for behind-the-scenes scoops', tags: ['++Ratings', '-Trust', '-Contract'], fx: { cash: 0, ratings: 3.4, listeners: 810, trust: -4 }, report: 'Secretly aired Hollywood film rehearsals live.' },
      'Film Premieres—Station Appears In Opening Credits!', 'Cult movie tourism brings fans to lobby.',
      'Studio Sued For Spoiling Script Endings Live On AM Radio!', 'Lawyers demand location fee refund plus penalties.', null, null, null),
    makeChain('mc_16', 12, '🐕', 'Stray Hound Dial Tone\'s Grandpup Wins Regional Agility Trial', 'A hyperactive basset hound clears hurdles using pure stubbornness.',
      { label: 'Sponsor local animal shelter agility broadcast', tags: ['-$650', '++Trust', '+Listeners'], fx: { cash: -650, ratings: 2.5, listeners: 680, trust: 6 }, report: 'Broadcast the hometown agility dog celebration.' },
      { label: 'Skip dog sports for hard financial market reads', tags: ['+Business Ads', '-Buzz'], fx: { cash: 400, ratings: -0.6 }, report: 'Skipped dog agility celebration for bond charts.' },
      'Animal Shelter Adoptions Double After Broadcast!', 'Community cheers our canine heart.',
      'Rival FM Station Claims Title As "Dog Lovers\' Home"', 'Pet sponsors drift toward rival.', null, null, null),
    makeChain('mc_17', 14, '🌊', 'Historic Drought Exposes Sunken 1934 Ferryboat In Mud Creek', 'Rusty paddlewheels jut out of dry mud holding sealed mail pouches.',
      { label: 'Partner with county museum on live pouch opening', tags: ['-$900', '++Trust', '++Listeners'], fx: { cash: -900, ratings: 3.3, listeners: 950, trust: 7 }, report: 'Broadcast live opening of the 1934 sunken ferry pouches.' },
      { label: 'Encourage treasure hunters to dig before curators arrive', tags: ['++Ratings', '---Trust', '---FCC'], fx: { cash: 0, ratings: 3.8, listeners: 880, trust: -7, fcc: -5 }, report: 'Sparked chaotic mud-creek treasure rush.' },
      '1934 Love Letters Read On Air Move State To Tears!', 'Regional newspapers salute WSTF.',
      'Mud-Creek Treasure Brawl Wrecks Historic Artifact—Blame Falls On Us!', 'Historians condemn reckless broadcast hype.', null, null, null),
    makeChain('mc_18', 16, '📺', 'Rival Station Claims Our Afternoon Ratings Are Fake', 'WKRK runs billboards reading "REAL LISTENERS, NOT EMPTY TRACTORS."',
      { label: 'Prove reach via live town-wide horn-honk roll call at 5 PM', tags: ['-$500', '+++Listeners', '+++Morale'], fx: { cash: -500, ratings: 3.7, listeners: 1150, trust: 5, morale: 7 }, report: 'Thousands of cars honked at 5 PM sharp proving our live audience!' },
      { label: 'File quiet arbitration complaint with ratings bureau', tags: ['+FCC', 'Low Drama'], fx: { cash: -300, ratings: 0.6, fcc: 3 }, report: 'Challenged rival billboard claims quietly.' },
      'The Great 5 PM Horn-Honk Makes National News!', 'Rival quietly paints over smug billboards.',
      'Rival Runs Mockery Spots Calling Us "Silent Cowards"', 'Ratings momentum stalls briefly.', null, null, null),
    makeChain('mc_19', 18, '🌐', 'Tech Billionaire Buys Nearby Ranch & Wants Silence Zone Around Estate', 'Lawyers argue AM radio waves disturb his meditation yurts.',
      { label: 'Defend FCC broadcast license publicly & rally town', tags: ['-$1,500 Legal', '+++Trust', '++Listeners'], fx: { cash: -1500, ratings: 3.9, listeners: 1300, trust: 8, fcc: 4 }, report: 'Fought tech billionaire\'s silence-zone push with fierce hometown support!' },
      { label: 'Accept $3,000 hush payment to lower night power 30%', tags: ['+$3,000', '--Listeners', '--Trust'], fx: { cash: 3000, ratings: -2.2, listeners: -750, trust: -7, morale: -5 }, report: 'Quietly dimmed nighttime transmitter power in exchange for ranch buyout cash.' },
      'Court Upholds Public Airwaves—Town Throws Victory Parade!', 'Station cements legendary status!',
      'Distant Truckers Lose Signal & Switch Permanently To Rivals!', 'Nighttime reach suffers long-term damage.', null, null, null),
    makeChain('mc_20', 21, '📡', 'Aging Main Broadcast Tower Needs Major Structural Guy-Wire Overhaul', 'Inspectors notice hairline fatigue on the 300-foot main mast before hurricane season.',
      { label: 'Pay full $5,500 overhaul now for ironclad reliability', tags: ['-$5,500', '+FCC', '+Tower Safe'], fx: { cash: -5500, ratings: 1.0, trust: 4, fcc: 6, morale: 4 }, report: 'Completed comprehensive tower structural overhaul before storm season.' },
      { label: 'Defer repairs with $400 patch bolts & hope for calm weather', tags: ['Save $5,100', 'COLLAPSE RISK'], fx: { cash: -400, ratings: 0, trust: -2, fcc: -4 }, report: 'Deferred full tower repairs with temporary patch bolts.' },
      'Tower Stands Rock-Solid Through Record Gusts—Zero Downtime!', 'Rivals knocked off air while we broadcast strong!',
      'Gust Snaps Auxiliary Mast—Emergency Broadcast Outage & Heavy Fine!', 'Forced off air for days paying emergency crane repairs.', null, null,
      { id: 'cons_tower_patch', title: 'Weakened Tower Repairs', kind: 'negative', months: 10, cashPerMonth: -1400, ratingsMult: 0.90, desc: 'Temporary mast repairs drain budget and limit signal power.' })
  ];
  // fix mc_16 minYear back to 12
  MULTI_CHAINS[15].minYear = 12;
  // fix mc_10 branchB fx object syntax cleanly
  MULTI_CHAINS[9].step1.choices[1].effects = { cash: 1300, ratings: 1.0, trust: -5 };

  const expExport = {
    GENERIC_INTERRUPTS: GENERIC_INTERRUPTS,
    HOST_EVENTS: HOST_EVENTS,
    ADVERTISER_EVENTS: ADVERTISER_EVENTS,
    WEATHER_EMERGENCY_EVENTS: WEATHER_EMERGENCY_EVENTS,
    INDUSTRY_EVENTS: INDUSTRY_EVENTS,
    MULTI_CHAINS: MULTI_CHAINS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = expExport;
  } else {
    root.AMRT_EXPANSION = expExport;
  }
})(typeof window !== 'undefined' ? window : globalThis);
