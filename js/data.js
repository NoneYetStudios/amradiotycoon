/**
 * AM RADIO TYCOON — Game Catalog Data
 * Shows, Hosts, Advertisers, Upgrades, Strategies, Interrupt Events, Event Chains, and Special Incidents.
 */
(function (root) {
  'use strict';

  const EXP = (typeof module !== 'undefined' && module.exports)
    ? require('./events_expansion.js')
    : (root.AMRT_EXPANSION || {});

  const MONTHS = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const STATION_PRESETS = [
    'WSTF 1120 AM',
    'WTON 980 AM',
    'WKRAK 1470 AM',
    'Radio Chicken 900 AM'
  ];

  const TIME_BLOCKS = [
    {
      id: 'morning',
      name: 'Morning Drive',
      hours: '6 AM - 10 AM',
      weight: 1.30,
      audience: 'Commuters, coffee-shop mayors & early-shift anglers',
      favoredCategories: ['news', 'weather', 'community', 'absurd_civic']
    },
    {
      id: 'afternoon',
      name: 'Afternoon Block',
      hours: '10 AM - 3 PM',
      weight: 1.00,
      audience: 'Retirees, mechanics, flea-market barterers & parking enthusiasts',
      favoredCategories: ['community', 'music', 'finance', 'absurd_civic']
    },
    {
      id: 'evening',
      name: 'Evening Drive',
      hours: '3 PM - 8 PM',
      weight: 1.25,
      audience: 'Little League parents, bass trackers & talk-radio callers',
      favoredCategories: ['sports', 'talk', 'news', 'fish', 'safety']
    },
    {
      id: 'latenight',
      name: 'Late Night Skywave',
      hours: '8 PM - 6 AM',
      weight: 0.85,
      audience: 'Long-haul truckers, ham-radio insomniacs & cloud watchers',
      favoredCategories: ['conspiracy', 'music', 'absurd_nature', 'weather']
    }
  ];

  const SHOWS = [
    // --- 12 Starter Shows ---
    {
      id: 'local_news',
      name: 'Local News',
      category: 'news',
      starter: true,
      costPerMonth: 350,
      baseRatings: 11.5,
      trustDelta: 1.4,
      fccRisk: 1,
      controversy: 12,
      bestSlots: ['morning', 'evening'],
      unlockHint: 'Unlocked from Day 1',
      description: 'City council minutes, diner openings, and mild sheriff blotter mysteries.'
    },
    {
      id: 'swap_shop',
      name: 'Swap Shop',
      category: 'community',
      starter: true,
      costPerMonth: 120,
      baseRatings: 10.5,
      trustDelta: 1.0,
      fccRisk: 3,
      controversy: 18,
      bestSlots: ['morning', 'afternoon'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Callers trade mildly cursed lawnmowers, Tupperware lids, and suspicious canoes.'
    },
    {
      id: 'fishing_report',
      name: 'Fishing Report',
      category: 'fish',
      starter: true,
      costPerMonth: 180,
      baseRatings: 10.2,
      trustDelta: 0.9,
      fccRisk: 1,
      controversy: 8,
      bestSlots: ['morning', 'evening'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Lake levels, crappie whispers, and unverified reports of 40-pound carp.'
    },
    {
      id: 'county_sports',
      name: 'County Sports',
      category: 'sports',
      starter: true,
      costPerMonth: 320,
      baseRatings: 12.2,
      trustDelta: 0.6,
      fccRisk: 4,
      controversy: 25,
      bestSlots: ['evening'],
      unlockHint: 'Unlocked from Day 1',
      description: 'High school football, JV softball rivalries, and aggressive referee critiques.'
    },
    {
      id: 'classic_country',
      name: 'Classic Country',
      category: 'music',
      starter: true,
      costPerMonth: 220,
      baseRatings: 11.0,
      trustDelta: 0.7,
      fccRisk: 1,
      controversy: 6,
      bestSlots: ['afternoon', 'latenight'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Steel guitars, heartbroken pickups, and vinyl crackle warm enough to toast bread.'
    },
    {
      id: 'bluegrass_hour',
      name: 'Bluegrass Hour',
      category: 'music',
      starter: true,
      costPerMonth: 160,
      baseRatings: 9.2,
      trustDelta: 1.1,
      fccRisk: 1,
      controversy: 4,
      bestSlots: ['afternoon', 'morning'],
      unlockHint: 'Unlocked from Day 1',
      description: 'High-speed banjo solos recorded live behind the hardware store.'
    },
    {
      id: 'community_calendar',
      name: 'Community Calendar',
      category: 'community',
      starter: true,
      costPerMonth: 90,
      baseRatings: 7.8,
      trustDelta: 1.6,
      fccRisk: 0,
      controversy: 2,
      bestSlots: ['afternoon', 'morning'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Casserole potlucks, lost schnauzers, and bridge club turf announcements.'
    },
    {
      id: 'church_services',
      name: 'Church Services',
      category: 'community',
      starter: true,
      costPerMonth: 60,
      baseRatings: 7.4,
      trustDelta: 1.8,
      fccRisk: 0,
      controversy: 3,
      bestSlots: ['morning', 'afternoon'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Organ music, organ-adjacent sermons, and gentle reminders about parking etiquette.'
    },
    {
      id: 'weather_watch',
      name: 'Weather Watch',
      category: 'weather',
      starter: true,
      costPerMonth: 200,
      baseRatings: 11.4,
      trustDelta: 1.3,
      fccRisk: 1,
      controversy: 8,
      bestSlots: ['morning', 'evening'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Barometric pressure readings mostly sourced from a wet flagpole.'
    },
    {
      id: 'market_report',
      name: 'Market Report',
      category: 'finance',
      starter: true,
      costPerMonth: 190,
      baseRatings: 8.6,
      trustDelta: 0.8,
      fccRisk: 2,
      controversy: 10,
      bestSlots: ['afternoon', 'morning'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Soybean futures, hog bellies, and suspiciously specific gravel pricing.'
    },
    {
      id: 'talk_radio',
      name: 'Talk Radio',
      category: 'talk',
      starter: true,
      costPerMonth: 280,
      baseRatings: 13.0,
      trustDelta: -0.4,
      fccRisk: 7,
      controversy: 48,
      bestSlots: ['evening', 'afternoon'],
      unlockHint: 'Unlocked from Day 1',
      description: 'Open phone lines where seven regular callers argue about zoning ordinances.'
    },
    {
      id: 'oldies',
      name: 'Oldies',
      category: 'music',
      starter: true,
      costPerMonth: 170,
      baseRatings: 10.0,
      trustDelta: 0.8,
      fccRisk: 1,
      controversy: 5,
      bestSlots: ['latenight', 'afternoon'],
      unlockHint: 'Unlocked from Day 1',
      description: '1950s doo-wop and reassuring station IDs echoing across empty highways.'
    },

    // --- 10 Unlockable Absurd Shows ---
    {
      id: 'conspiracy_carl_live',
      name: 'Conspiracy Carl Live',
      category: 'conspiracy',
      starter: false,
      costPerMonth: 520,
      baseRatings: 22.0,
      trustDelta: -1.8,
      fccRisk: 18,
      controversy: 88,
      bestSlots: ['latenight', 'evening'],
      unlockHint: 'Hire Conspiracy Carl OR reach Year 3',
      unlockCheck: function (s) {
        return s.hiredHostIds.indexOf('conspiracy_carl') !== -1 || s.year >= 3;
      },
      description: 'Three breathless hours linking municipal water meters to lunar seagulls.'
    },
    {
      id: 'boom_prevention_report',
      name: 'Department of Boom Prevention Report',
      category: 'safety',
      starter: false,
      costPerMonth: 390,
      baseRatings: 15.2,
      trustDelta: 1.8,
      fccRisk: 3,
      controversy: 28,
      bestSlots: ['evening', 'morning'],
      unlockHint: 'Reach Year 2 OR Public Trust 68+',
      unlockCheck: function (s) {
        return s.year >= 2 || s.publicTrust >= 68;
      },
      description: 'Official updates on unexplained thunderclaps, smoking sheds, and humming crates.'
    },
    {
      id: 'competitive_parking',
      name: 'Competitive Parking Analysis',
      category: 'absurd_civic',
      starter: false,
      costPerMonth: 340,
      baseRatings: 14.8,
      trustDelta: 0.7,
      fccRisk: 3,
      controversy: 24,
      bestSlots: ['afternoon', 'morning'],
      unlockHint: 'Reach 2,500+ Listeners OR buy Remote Broadcast Van',
      unlockCheck: function (s) {
        return s.listeners >= 2500 || s.upgradeIds.indexOf('remote_van') !== -1;
      },
      description: 'Play-by-play breakdown of strip-mall parallel maneuvers and diagonal hubris.'
    },
    {
      id: 'pothole_watch',
      name: 'Emergency Pothole Watch',
      category: 'absurd_civic',
      starter: false,
      costPerMonth: 300,
      baseRatings: 14.4,
      trustDelta: 1.7,
      fccRisk: 2,
      controversy: 20,
      bestSlots: ['morning', 'evening'],
      unlockHint: 'Reach Year 2 OR buy Newsroom Expansion',
      unlockCheck: function (s) {
        return s.year >= 2 || s.upgradeIds.indexOf('newsroom_expansion') !== -1;
      },
      description: 'Live depth measurements of craters deep enough to qualify for their own ZIP code.'
    },
    {
      id: 'bass_forecast',
      name: 'Bass Forecast Network',
      category: 'fish',
      starter: false,
      costPerMonth: 450,
      baseRatings: 17.0,
      trustDelta: 0.8,
      fccRisk: 4,
      controversy: 30,
      bestSlots: ['evening', 'morning'],
      unlockHint: 'Reach 4,000+ Listeners OR hire Professor Barnaby OR survive Fish Rain',
      unlockCheck: function (s) {
        return s.listeners >= 4000 || s.hiredHostIds.indexOf('prof_barnaby') !== -1 || s.flags.sawFishRain;
      },
      description: 'Doppler projections of largemouth bass migration on land, sea, and sky.'
    },
    {
      id: 'goat_watch',
      name: 'Goat Watch',
      category: 'absurd_nature',
      starter: false,
      costPerMonth: 360,
      baseRatings: 16.5,
      trustDelta: 0.6,
      fccRisk: 6,
      controversy: 42,
      bestSlots: ['latenight', 'afternoon'],
      unlockHint: 'Reach Year 3 OR experience a Goat event',
      unlockCheck: function (s) {
        return s.year >= 3 || s.flags.sawGoatEvent;
      },
      description: 'Real-time dispatch tracking rogue billy goats, culvert standoffs, and ballot theft.'
    },
    {
      id: 'hamster_hour',
      name: 'Hamster Hour',
      category: 'absurd_nature',
      starter: false,
      costPerMonth: 410,
      baseRatings: 17.5,
      trustDelta: 0.4,
      fccRisk: 7,
      controversy: 38,
      bestSlots: ['latenight', 'afternoon'],
      unlockHint: 'Reach Year 4 OR 6,500+ Listeners',
      unlockCheck: function (s) {
        return s.year >= 4 || s.listeners >= 6500;
      },
      description: 'Tiny wheel acoustics, rodent municipal politics, and urgent bedding alerts.'
    },
    {
      id: 'weather_panic',
      name: 'Interstate Weather Panic Center',
      category: 'weather',
      starter: false,
      costPerMonth: 560,
      baseRatings: 19.4,
      trustDelta: 0.9,
      fccRisk: 8,
      controversy: 52,
      bestSlots: ['morning', 'evening'],
      unlockHint: 'Buy Weather Radar OR hire Captain Radar',
      unlockCheck: function (s) {
        return s.upgradeIds.indexOf('weather_radar') !== -1 || s.hiredHostIds.indexOf('captain_radar') !== -1;
      },
      description: 'Every drizzle is treated as an imminent meteorological apocalypse.'
    },
    {
      id: 'suspicious_cloud',
      name: 'Suspicious Cloud Hotline',
      category: 'conspiracy',
      starter: false,
      costPerMonth: 540,
      baseRatings: 20.5,
      trustDelta: -0.9,
      fccRisk: 12,
      controversy: 66,
      bestSlots: ['latenight'],
      unlockHint: 'Reach Year 5 OR buy Satellite Feed',
      unlockCheck: function (s) {
        return s.year >= 5 || s.upgradeIds.indexOf('satellite_feed') !== -1;
      },
      description: 'Callers describe cumulonimbus formations that looked at them disrespectfully.'
    },
    {
      id: 'fish_monitoring',
      name: 'National Fish Monitoring Service',
      category: 'fish',
      starter: false,
      costPerMonth: 690,
      baseRatings: 23.0,
      trustDelta: 1.5,
      fccRisk: 4,
      controversy: 32,
      bestSlots: ['evening', 'morning'],
      unlockHint: 'Reach 12,000+ Listeners OR own Weather Radar + Satellite Feed',
      unlockCheck: function (s) {
        return s.listeners >= 12000 || (s.upgradeIds.indexOf('weather_radar') !== -1 && s.upgradeIds.indexOf('satellite_feed') !== -1);
      },
      description: 'Coast-to-coast telemetry on airborne trout, rogue perch, and suspicious bait shifts.'
    }
  ];

  const HOSTS = [
    {
      id: 'dave_intern',
      name: 'Dave The Intern',
      tagline: 'Works for snacks. May accidentally save the station.',
      salary: 150,
      hireCost: 0,
      popularity: 42,
      reliability: 66,
      controversy: 22,
      traitTitle: 'Duct Tape & Vending Machine Savant',
      traitDesc: 'Ultra-cheap labor. Occasionally fixes blown transmitters or books shock celebrities by mistake.',
      preferredShows: ['community_calendar', 'oldies', 'swap_shop', 'hamster_hour'],
      starter: true
    },
    {
      id: 'sheryl_accounting',
      name: 'Sheryl From Accounting',
      tagline: 'Cheap. Awful on-air performance.',
      salary: 450,
      hireCost: 400,
      popularity: 18,
      reliability: 99,
      controversy: 6,
      traitTitle: 'Double-Entry Bookkeeper',
      traitDesc: 'Cuts total station monthly overhead & salaries by 10%, but drags down ratings in her slot.',
      preferredShows: ['market_report', 'community_calendar'],
      starter: false
    },
    {
      id: 'miss_patty',
      name: 'Miss Patty',
      tagline: 'Loved by everybody. Starts accidental scandals.',
      salary: 1100,
      hireCost: 1200,
      popularity: 78,
      reliability: 85,
      controversy: 44,
      traitTitle: 'Sweetheart Gossip',
      traitDesc: 'Adds +2.5 Public Trust monthly, but occasionally airs private sheriff gossip on a hot mic.',
      preferredShows: ['swap_shop', 'community_calendar', 'church_services', 'local_news'],
      starter: false
    },
    {
      id: 'big_earl',
      name: 'Big Earl',
      tagline: 'Huge ratings. Always late.',
      salary: 1450,
      hireCost: 1800,
      popularity: 85,
      reliability: 42,
      controversy: 38,
      traitTitle: 'Prime-Time Legend / Chronically Tardy',
      traitDesc: '+25% ratings boost in his assigned block, but frequent tardiness or roadside detours.',
      preferredShows: ['county_sports', 'classic_country', 'talk_radio', 'local_news'],
      starter: false
    },
    {
      id: 'captain_radar',
      name: 'Captain Radar',
      tagline: 'Outstanding weather forecaster. Sometimes predicts impossible events.',
      salary: 1350,
      hireCost: 1650,
      popularity: 80,
      reliability: 76,
      controversy: 42,
      traitTitle: 'Barometric Prophet',
      traitDesc: '+35% ratings on weather shows & unlocks Weather Panic Center. Foresees Fish Rain.',
      preferredShows: ['weather_watch', 'weather_panic', 'pothole_watch', 'suspicious_cloud'],
      starter: false
    },
    {
      id: 'conspiracy_carl',
      name: 'Conspiracy Carl',
      tagline: 'Massive ratings. Constant FCC issues.',
      salary: 1650,
      hireCost: 2400,
      popularity: 93,
      reliability: 70,
      controversy: 95,
      traitTitle: 'Tin-Foil Lightning Rod',
      traitDesc: 'Unlocks Conspiracy Carl Live. Massive audience magnet that regularly enrages the FCC.',
      preferredShows: ['conspiracy_carl_live', 'suspicious_cloud', 'talk_radio', 'goat_watch'],
      starter: false
    },
    {
      id: 'rev_hollis',
      name: 'Reverend Hollis',
      tagline: 'Velvet baritone. Calms regulators and angry mobs alike.',
      salary: 900,
      hireCost: 1000,
      popularity: 58,
      reliability: 92,
      controversy: 8,
      traitTitle: 'FCC Whisperer',
      traitDesc: 'Passively restores +2 FCC Standing and +1.5 Public Trust every month.',
      preferredShows: ['church_services', 'bluegrass_hour', 'community_calendar', 'oldies'],
      starter: false
    },
    {
      id: 'mad_dog',
      name: 'Mad Dog Kowalski',
      tagline: 'Treats JV basketball and competitive parking like thermonuclear war.',
      salary: 1500,
      hireCost: 2000,
      popularity: 84,
      reliability: 78,
      controversy: 72,
      traitTitle: 'Press Box Berserker',
      traitDesc: '+30% ratings on Sports & Competitive Parking, though nervous sponsors sweat heavily.',
      preferredShows: ['county_sports', 'competitive_parking', 'talk_radio', 'boom_prevention_report'],
      starter: false
    },
    {
      id: 'prof_barnaby',
      name: 'Professor Barnaby',
      tagline: 'Disgraced ichthyologist who believes bass control the bond market.',
      salary: 1250,
      hireCost: 1500,
      popularity: 75,
      reliability: 80,
      controversy: 52,
      traitTitle: 'Ichthyology Guru',
      traitDesc: '+35% ratings on all Fishing & Bass shows. Unlocks Bass Forecast Network.',
      preferredShows: ['fishing_report', 'bass_forecast', 'fish_monitoring', 'market_report'],
      starter: false
    },
    {
      id: 'velvet_vance',
      name: 'Velvet Vance',
      tagline: 'Smooth midnight crooner living in his Buick by the tower.',
      salary: 800,
      hireCost: 950,
      popularity: 69,
      reliability: 74,
      controversy: 28,
      traitTitle: 'Night Owl Crooner',
      traitDesc: '+30% Late Night block ratings and boosts Employee Morale +2 each month.',
      preferredShows: ['oldies', 'classic_country', 'hamster_hour', 'suspicious_cloud'],
      starter: false
    }
  ];

  const ADVERTISERS = [
    {
      id: 'honest_bob_canoe',
      name: "Honest Bob's Canoe Insurance",
      tagline: 'Full dry-land collision coverage for fiberglass canoes.',
      basePayout: 1150,
      listenerFactor: 0.16,
      minListeners: 0,
      risk: 15,
      sensitivity: 55,
      personality: 'Folksy & risk-averse',
      preferredCategory: 'fish',
      starter: true
    },
    {
      id: 'mabel_taxidermy',
      name: "Mabel's Discount Taxidermy",
      tagline: 'We Stuff Anything. Glass Eyes Mostly Pointing Forward.',
      basePayout: 1250,
      listenerFactor: 0.17,
      minListeners: 0,
      risk: 28,
      sensitivity: 30,
      personality: 'Unflappable & macabre',
      preferredCategory: 'community',
      starter: true
    },
    {
      id: 'barnaby_bass_removal',
      name: 'Barnaby Bass Removal',
      tagline: '24-hour tactical extraction of uninvited attic and sofa bass.',
      basePayout: 1550,
      listenerFactor: 0.20,
      minListeners: 1200,
      risk: 35,
      sensitivity: 35,
      personality: 'Hyper-specialized & intense',
      preferredCategory: 'fish',
      starter: false
    },
    {
      id: 'emergency_pothole',
      name: 'Emergency Pothole Services',
      tagline: 'Rapid asphalt deployment before your axle disappears.',
      basePayout: 1700,
      listenerFactor: 0.21,
      minListeners: 1600,
      risk: 22,
      sensitivity: 60,
      personality: 'Civic-minded & impatient',
      preferredCategory: 'absurd_civic',
      starter: false
    },
    {
      id: 'corporate_goat_retrieval',
      name: 'Corporate Goat Retrieval',
      tagline: 'Discreet executive livestock recovery across three counties.',
      basePayout: 1850,
      listenerFactor: 0.22,
      minListeners: 2800,
      risk: 45,
      sensitivity: 45,
      personality: 'Deadpan corporate absurdists',
      preferredCategory: 'absurd_nature',
      starter: false
    },
    {
      id: 'quick_bail_bonds',
      name: 'Quick Bail Bonds',
      tagline: 'Wait in our lobby, not the county tank! Free stale pretzels.',
      basePayout: 2100,
      listenerFactor: 0.24,
      minListeners: 3200,
      risk: 62,
      sensitivity: 18,
      personality: 'Loves scandal & late-night ratings',
      preferredCategory: 'conspiracy',
      starter: false
    },
    {
      id: 'boom_prevention_sponsor',
      name: 'Department of Boom Prevention',
      tagline: 'Public Safety Sponsor: Please Do Not Poke The Humming Crate.',
      basePayout: 2500,
      listenerFactor: 0.27,
      minListeners: 4500,
      risk: 18,
      sensitivity: 78,
      personality: 'Strict government bureaucrats',
      preferredCategory: 'safety',
      starter: false
    },
    {
      id: 'uncle_luther_fireworks',
      name: "Uncle Luther's Fireworks & Propane",
      tagline: 'Two volatile industries, one convenient smoking-permitted tent.',
      basePayout: 2400,
      listenerFactor: 0.25,
      minListeners: 5200,
      risk: 74,
      sensitivity: 12,
      personality: 'Loves chaos; zero safety standards',
      preferredCategory: 'talk',
      starter: false
    },
    {
      id: 'stf_industrial_surplus',
      name: 'Stab The Finger Industrial Surplus',
      tagline: 'Bulk staplers, mysterious anodes, and mildly damp office chairs.',
      basePayout: 2900,
      listenerFactor: 0.28,
      minListeners: 7500,
      risk: 30,
      sensitivity: 50,
      personality: 'Corporate surrealists',
      preferredCategory: 'news',
      starter: false
    },
    {
      id: 'mattress_bait_bank',
      name: 'First National Mattress & Bait Bank',
      tagline: 'Earn 2.4% APY paid out in cold-stored live nightcrawlers.',
      basePayout: 3200,
      listenerFactor: 0.30,
      minListeners: 10000,
      risk: 25,
      sensitivity: 68,
      personality: 'Conservative & suspicious of Carl',
      preferredCategory: 'finance',
      starter: false
    },
    {
      id: 'zoid_chiro_muffler',
      name: "Dr. Zoid's Chiropractic & Muffler",
      tagline: 'We align human spines and rusted tailpipes while you wait.',
      basePayout: 3500,
      listenerFactor: 0.32,
      minListeners: 14000,
      risk: 42,
      sensitivity: 38,
      personality: 'Loud & proudly unlicensed',
      preferredCategory: 'sports',
      starter: false
    },
    {
      id: 'tinfoil_faraday_outlet',
      name: 'Tri-County Tin Foil & Faraday Outlet',
      tagline: 'Heavy-gauge cranial shielding for discerning late-night callers.',
      basePayout: 4100,
      listenerFactor: 0.36,
      minListeners: 18000,
      risk: 80,
      sensitivity: 10,
      personality: 'Thrives on panic & conspiracies',
      preferredCategory: 'conspiracy',
      starter: false
    },
    {
      id: 'gertie_gravy_emporium',
      name: "Gertie's All-Night Gravy Emporium",
      tagline: 'Beverage-grade pepper gravy available by the thermos or drum.',
      basePayout: 4600,
      listenerFactor: 0.38,
      minListeners: 24000,
      risk: 28,
      sensitivity: 52,
      personality: 'Warm-hearted culinary menace',
      preferredCategory: 'music',
      starter: false
    },
    {
      id: 'megacorp_agri_drones',
      name: 'Regional Megacorp Agri-Drones',
      tagline: 'Autonomous crop-dusting and high-altitude goose intimidation.',
      basePayout: 5800,
      listenerFactor: 0.44,
      minListeners: 35000,
      risk: 52,
      sensitivity: 65,
      personality: 'Deep pockets, hates bad PR',
      preferredCategory: 'weather',
      starter: false
    }
  ];

  const UPGRADES = [
    {
      id: 'improved_mic',
      name: 'Improved Microphone',
      cost: 1800,
      maintenance: 45,
      coverageBonus: 3,
      ratingsBonus: 2.2,
      trustBonus: 0.4,
      moraleBonus: 4,
      valueBonus: 3200,
      adSlotsBonus: 0,
      specialUnlock: 'Reduces broadcast static and improves host morale.',
      description: 'Replaces the 1974 drive-thru headset held together with masking tape.'
    },
    {
      id: 'backup_generator',
      name: 'Backup Generator',
      cost: 3200,
      maintenance: 80,
      coverageBonus: 2,
      ratingsBonus: 0.8,
      trustBonus: 1.0,
      moraleBonus: 2,
      valueBonus: 5500,
      adSlotsBonus: 0,
      specialUnlock: 'Keeps WSTF on the air during Power Failures & Blackouts.',
      description: 'Diesel generator behind the broom closet. Loud enough to rattle fillings.'
    },
    {
      id: 'studio_renovation',
      name: 'Studio Renovation',
      cost: 4800,
      maintenance: 110,
      coverageBonus: 0,
      ratingsBonus: 3.0,
      trustBonus: 0.6,
      moraleBonus: 8,
      valueBonus: 9500,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot and raises Employee Morale.',
      description: 'Acoustic foam that no longer smells like damp mackerel plus real swivel chairs.'
    },
    {
      id: 'weather_radar',
      name: 'Weather Radar',
      cost: 6500,
      maintenance: 160,
      coverageBonus: 4,
      ratingsBonus: 2.8,
      trustBonus: 1.2,
      moraleBonus: 2,
      valueBonus: 13000,
      adSlotsBonus: 0,
      specialUnlock: 'Unlocks Interstate Weather Panic Center & gives early storm bonuses.',
      description: 'Surplus naval Doppler dish bolted to the roof. Sees clouds and suspicious geese.'
    },
    {
      id: 'emergency_alert',
      name: 'Emergency Alert Equipment',
      cost: 7800,
      maintenance: 150,
      coverageBonus: 5,
      ratingsBonus: 1.8,
      trustBonus: 2.4,
      moraleBonus: 3,
      valueBonus: 15500,
      adSlotsBonus: 0,
      specialUnlock: 'Boosts Public Trust & Listeners during all Emergency Broadcasts.',
      description: 'Certified brass EBS tone generator that commands instant regional attention.'
    },
    {
      id: 'remote_van',
      name: 'Remote Broadcast Van',
      cost: 10500,
      maintenance: 240,
      coverageBonus: 8,
      ratingsBonus: 3.8,
      trustBonus: 1.0,
      moraleBonus: 4,
      valueBonus: 21000,
      adSlotsBonus: 0,
      specialUnlock: 'Unlocks Competitive Parking Analysis & live remote event bonuses.',
      description: 'A 1986 Econoline with a telescoping mast and suspiciously soft suspension.'
    },
    {
      id: 'newsroom_expansion',
      name: 'Newsroom Expansion',
      cost: 13500,
      maintenance: 320,
      coverageBonus: 4,
      ratingsBonus: 4.5,
      trustBonus: 2.0,
      moraleBonus: 5,
      valueBonus: 28000,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot & Emergency Pothole Watch.',
      description: 'Three wire-service teletype machines and an intern-proof coffee urn.'
    },
    {
      id: 'tower_upgrade',
      name: 'Transmission Tower Upgrade',
      cost: 16000,
      maintenance: 380,
      coverageBonus: 22,
      ratingsBonus: 3.5,
      trustBonus: 0.5,
      moraleBonus: 2,
      valueBonus: 42000,
      adSlotsBonus: 0,
      specialUnlock: 'Massively boosts Signal Coverage and regional listener cap.',
      description: '50,000-watt clear-channel boost audible on dental braces two counties over.'
    },
    {
      id: 'mobile_trailer',
      name: 'Mobile Broadcast Trailer',
      cost: 21000,
      maintenance: 420,
      coverageBonus: 10,
      ratingsBonus: 4.2,
      trustBonus: 1.4,
      moraleBonus: 4,
      valueBonus: 48000,
      adSlotsBonus: 0,
      specialUnlock: 'Maximizes ratings at County Fairs, State Fairs, and Goat Rallies.',
      description: 'Double-wide mobile studio with hydraulic awning and fold-out applause sign.'
    },
    {
      id: 'digital_archive',
      name: 'Digital Archive',
      cost: 25000,
      maintenance: 350,
      coverageBonus: 4,
      ratingsBonus: 3.5,
      trustBonus: 1.6,
      moraleBonus: 6,
      valueBonus: 58000,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot & cuts FCC fine severity by 25%.',
      description: 'Indexed DAT tapes allowing instant legal playback when Carl denies everything.'
    },
    {
      id: 'traffic_helicopter',
      name: 'Traffic Helicopter',
      cost: 32000,
      maintenance: 780,
      coverageBonus: 12,
      ratingsBonus: 6.5,
      trustBonus: 1.5,
      moraleBonus: 7,
      valueBonus: 78000,
      adSlotsBonus: 0,
      specialUnlock: 'Enables aerial pursuit choices during Goat & Pothole emergencies.',
      description: 'Refurbished crop-duster chopper with a megaphone and bold insurance deductible.'
    },
    {
      id: 'satellite_feed',
      name: 'Satellite Feed',
      cost: 42000,
      maintenance: 920,
      coverageBonus: 26,
      ratingsBonus: 7.5,
      trustBonus: 1.0,
      moraleBonus: 5,
      valueBonus: 115000,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot, Suspicious Cloud Hotline & national syndication.',
      description: 'Uplink dish capable of broadcasting Somewhere nonsense to six time zones.'
    },
    {
      id: 'major_studio_complex',
      name: 'Major Studio Complex',
      cost: 68000,
      maintenance: 1450,
      coverageBonus: 0,
      ratingsBonus: 5.5,
      trustBonus: 1.5,
      moraleBonus: 10,
      valueBonus: 165000,
      adSlotsBonus: 0,
      specialUnlock: 'Slows Show Fatigue buildup by 25% & boosts host retention.',
      description: 'Three soundproof glass suites, cedar reception, and an actual lobby receptionist.'
    },
    {
      id: 'broadcast_fleet',
      name: 'Regional Broadcast Fleet',
      cost: 115000,
      maintenance: 2400,
      coverageBonus: 6,
      ratingsBonus: 6.0,
      trustBonus: 1.8,
      moraleBonus: 6,
      valueBonus: 260000,
      adSlotsBonus: 0,
      specialUnlock: 'Unlocks faster regional disaster response & live multi-county coverage.',
      description: 'Four matching satellite vans painted in aggressive highway-cone orange.'
    },
    {
      id: 'legal_retainer',
      name: 'Broadcast Legal Defense Desk',
      cost: 165000,
      maintenance: 2900,
      coverageBonus: 0,
      ratingsBonus: 2.0,
      trustBonus: 1.0,
      moraleBonus: 5,
      valueBonus: 320000,
      adSlotsBonus: 0,
      specialUnlock: 'Cuts FCC fines & lawsuit penalties by 35% and reduces FCC compliance decay.',
      description: 'Three caffeine-fueled communications attorneys permanently stationed outside Carl\'s booth.'
    },
    {
      id: 'gulf_microwave_relay',
      name: 'Gulf Coast Microwave Relay',
      cost: 240000,
      maintenance: 4500,
      coverageBonus: 8,
      ratingsBonus: 7.0,
      trustBonus: 1.2,
      moraleBonus: 4,
      valueBonus: 520000,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot & supports Gulf Coast / Southeast Syndication.',
      description: 'Network of coastal tower dishes carrying clean signal from swamp to shore.'
    },
    {
      id: 'ionospheric_array',
      name: 'Clear-Channel Ionospheric Array',
      cost: 390000,
      maintenance: 6800,
      coverageBonus: 10,
      ratingsBonus: 8.5,
      trustBonus: 1.4,
      moraleBonus: 4,
      valueBonus: 850000,
      adSlotsBonus: 0,
      specialUnlock: 'Overpowers nighttime FM/digital noise and expands distant skywave reach.',
      description: 'Phase-array towers powerful enough to harmonize fillings across four states.'
    },
    {
      id: 'national_syndication_hq',
      name: 'National Syndication HQ',
      cost: 650000,
      maintenance: 11500,
      coverageBonus: 12,
      ratingsBonus: 10.0,
      trustBonus: 2.0,
      moraleBonus: 8,
      valueBonus: 1450000,
      adSlotsBonus: 1,
      specialUnlock: 'Unlocks +1 Advertiser Slot & sustains National Syndication tier.',
      description: 'Full affiliate network routing Somewhere\'s finest chaos to coast-to-coast AM dials.'
    }
  ];

  const RIVAL_STATIONS = [
    {
      id: 'wkrk_am',
      callSign: 'WKRK 980 AM',
      nickname: 'The Heritage Blowtorch',
      minYear: 1,
      baseListeners: 1400,
      baseRatings: 16.5,
      growthRate: 1.04,
      strengths: ['news', 'sports', 'community'],
      personality: 'Button-down civic rival competing aggressively for reliable hosts and local banks.'
    },
    {
      id: 'wgoat_am',
      callSign: 'WGOAT 1470 AM',
      nickname: 'The Barnyard Rebel',
      minYear: 1,
      baseListeners: 1050,
      baseRatings: 13.5,
      growthRate: 1.035,
      strengths: ['absurd_nature', 'absurd_civic', 'fish'],
      personality: 'Scrappy local imitator undercutting sponsor rates and staging rival animal stunts.'
    },
    {
      id: 'wkrk_fm',
      callSign: 'WKRK-FM 99.5',
      nickname: 'Crystal Stereo 99',
      minYear: 3,
      baseListeners: 6500,
      baseRatings: 22.0,
      growthRate: 1.045,
      strengths: ['music'],
      personality: 'Glossy FM stereo powerhouse siphoning music commuters away from aging AM bands.'
    },
    {
      id: 'bass_fm',
      callSign: 'BASS 101.7 FM',
      nickname: 'Maximum Largemouth Radio',
      minYear: 5,
      baseListeners: 14000,
      baseRatings: 24.0,
      growthRate: 1.04,
      strengths: ['fish', 'weather', 'sports'],
      personality: 'Outdoors lifestyle station poaching marine advertisers and fishing personalities.'
    },
    {
      id: 'wtalk_am',
      callSign: 'WTALK 1560 AM',
      nickname: 'The Outrage Furnace',
      minYear: 7,
      baseListeners: 24000,
      baseRatings: 26.5,
      growthRate: 1.042,
      strengths: ['talk', 'conspiracy'],
      personality: 'High-decibel talk titan breaking sensational rumors first and wooing Carl & Mad Dog.'
    },
    {
      id: 'strm_net',
      callSign: 'STRM-NET Digital',
      nickname: 'CloudCast Audio Grid',
      minYear: 13,
      baseListeners: 52000,
      baseRatings: 30.0,
      growthRate: 1.045,
      strengths: ['conspiracy', 'talk', 'music', 'absurd_civic'],
      personality: 'Algorithmic streaming/podcast network hunting younger listeners and national ad budgets.'
    }
  ];

  const INDUSTRY_ERAS = [
    {
      id: 'era_am_heritage',
      name: 'Local AM Heritage',
      years: 'Years 1–2',
      minYear: 1,
      maxYear: 2,
      salaryInflation: 1.00,
      fccStrictness: 1.00,
      categoryMods: { news: 1.08, community: 1.10, music: 1.04, weather: 1.05, talk: 0.94, conspiracy: 0.92 },
      desc: 'Classic hometown dial where local swap shops, sports, and civic trust rule.'
    },
    {
      id: 'era_fm_boom',
      name: 'FM Stereo Expansion',
      years: 'Years 3–5',
      minYear: 3,
      maxYear: 5,
      salaryInflation: 1.15,
      fccStrictness: 1.08,
      categoryMods: { music: 0.72, news: 1.10, community: 1.12, weather: 1.06, fish: 1.08, absurd_civic: 1.12 },
      desc: 'Crisp FM stereo slashes AM music appeal. Personality, weather, and news must carry the dial.'
    },
    {
      id: 'era_cable_talk',
      name: '24-Hour Cable & Talk Boom',
      years: 'Years 6–9',
      minYear: 6,
      maxYear: 9,
      salaryInflation: 1.35,
      fccStrictness: 1.20,
      categoryMods: { talk: 1.26, conspiracy: 1.22, weather: 0.84, sports: 1.16, safety: 1.12 },
      desc: 'Cable weather squeezes plain forecasts while fiery talk radio and emergencies surge.'
    },
    {
      id: 'era_satellite',
      name: 'Satellite Radio Wave',
      years: 'Years 10–13',
      minYear: 10,
      maxYear: 13,
      salaryInflation: 1.60,
      fccStrictness: 1.28,
      categoryMods: { music: 0.65, conspiracy: 1.24, absurd_civic: 1.20, fish: 1.18, finance: 0.92 },
      desc: 'Subscription satellites draw commercial-averse drivers; hyper-local weirdness shines.'
    },
    {
      id: 'era_streaming',
      name: 'Internet Streaming Shift',
      years: 'Years 14–17',
      minYear: 14,
      maxYear: 17,
      salaryInflation: 1.90,
      fccStrictness: 1.35,
      categoryMods: { music: 0.60, absurd_nature: 1.24, news: 1.15, weather: 1.08, talk: 1.12 },
      desc: 'Online streams disrupt static formats; urgent local breaking news wins commuters back.'
    },
    {
      id: 'era_podcast',
      name: 'The Podcast Explosion',
      years: 'Years 18–21',
      minYear: 18,
      maxYear: 21,
      salaryInflation: 2.25,
      fccStrictness: 1.40,
      categoryMods: { talk: 1.18, conspiracy: 1.15, fish: 1.24, safety: 1.22, community: 1.16 },
      desc: 'Recorded shows flood phones; live unpredictability and crisis leadership command real ears.'
    },
    {
      id: 'era_algorithmic',
      name: 'Algorithmic Media Reckoning',
      years: 'Years 22–25',
      minYear: 22,
      maxYear: 25,
      salaryInflation: 2.65,
      fccStrictness: 1.48,
      categoryMods: { community: 1.25, absurd_civic: 1.28, absurd_nature: 1.28, news: 1.18, music: 0.78 },
      desc: 'Exhausted by algorithms, audiences flock back to authentic local chaos and veteran stations.'
    }
  ];

  const EXPANSION_TIERS = [
    {
      tier: 1,
      id: 'tier_county',
      name: 'County Coverage',
      cost: 0,
      monthlyUpkeep: 0,
      minCoverage: 16,
      maxListenersCap: 14500,
      adTierMult: 1.00,
      eventScale: 1.0,
      riskNote: 'Low Stakes: modest local payroll & small-town regulators.'
    },
    {
      tier: 2,
      id: 'tier_regional',
      name: 'Regional Coverage',
      cost: 7500,
      monthlyUpkeep: 1000,
      minCoverage: 22,
      maxListenersCap: 36000,
      adTierMult: 1.15,
      eventScale: 1.6,
      riskNote: 'Rival stations begin poaching sponsors & hosts aggressively.'
    },
    {
      tier: 3,
      id: 'tier_multicounty',
      name: 'Multi-County Coverage',
      cost: 28000,
      monthlyUpkeep: 3200,
      minCoverage: 38,
      maxListenersCap: 76000,
      adTierMult: 1.30,
      eventScale: 2.5,
      riskNote: 'Heavy FM competition and higher sponsor expectations.'
    },
    {
      tier: 4,
      id: 'tier_statewide',
      name: 'Statewide Coverage',
      cost: 75000,
      monthlyUpkeep: 8200,
      minCoverage: 52,
      maxListenersCap: 165000,
      adTierMult: 1.45,
      eventScale: 3.8,
      riskNote: 'Statewide press & FCC scrutiny magnify every slip-up.'
    },
    {
      tier: 5,
      id: 'tier_gulf',
      name: 'Gulf Coast Network',
      cost: 175000,
      monthlyUpkeep: 18500,
      minCoverage: 68,
      maxListenersCap: 320000,
      adTierMult: 1.60,
      eventScale: 5.2,
      riskNote: 'Hurricane alerts, coastal litigation & steep network lease fees.'
    },
    {
      tier: 6,
      id: 'tier_southeast',
      name: 'Southeast Syndication',
      cost: 360000,
      monthlyUpkeep: 38000,
      minCoverage: 82,
      maxListenersCap: 580000,
      adTierMult: 1.75,
      eventScale: 7.0,
      riskNote: 'Affiliate demands & national ad audits raise pressure.'
    },
    {
      tier: 7,
      id: 'tier_national',
      name: 'National Syndication',
      cost: 720000,
      monthlyUpkeep: 74000,
      minCoverage: 92,
      maxListenersCap: 1150000,
      adTierMult: 1.90,
      eventScale: 9.5,
      riskNote: 'Maximum audience scale, legal exposure & relentless operating burn.'
    }
  ];

  const EXECUTIVE_PROJECTS = [
    {
      id: 'exec_transmitter_overhaul',
      name: 'Major Transmitter & Tube Overhaul',
      baseCost: 4500,
      desc: 'Replaces aging vacuum tubes and cleans RF filters. Boosts FCC Standing +10 and Ratings +1.8.'
    },
    {
      id: 'exec_marketing_blitz',
      name: 'Regional Billboard & Diner Placemat Blitz',
      baseCost: 5500,
      desc: 'Floods highway diners with station ads. Boosts Listeners (+6% reach) and cuts Show Fatigue in half.'
    },
    {
      id: 'exec_legal_cleanup',
      name: 'FCC & Legal Defense Settlement',
      baseCost: 7500,
      desc: 'Pays off one active lawsuit/FCC probe consequence immediately and restores +12 FCC Standing.'
    },
    {
      id: 'exec_staff_retreat',
      name: 'All-Staff Fishing & Morale Summit',
      baseCost: 3800,
      desc: 'Restores +16 Staff Morale and boosts every hired host\'s Loyalty by +12.'
    },
    {
      id: 'exec_chopper_fleet_service',
      name: 'Fleet & Helicopter Avionics Overhaul',
      baseCost: 6200,
      desc: 'Improves Public Trust +7, Ad Satisfaction +6, and protects remote equipment.'
    },
    {
      id: 'exec_rival_counter',
      name: 'Rival Counter-Programming Signal Raid',
      baseCost: 6800,
      desc: 'Poaches 8% of the top rival station\'s listener momentum and boosts Ratings +2.2.'
    }
  ];

  const STRATEGIES = [
    {
      id: 'balanced',
      name: 'Balanced Community',
      ratingsMult: 0.93,
      trustMod: 0.5,
      adMult: 0.98,
      fccMod: 0.5,
      expenseMult: 1.00,
      growthMult: 0.95,
      controversyBonus: 0,
      moraleMod: 0.4,
      desc: 'Steady neighborhood stability across Trust & FCC, with a slightly modest ratings ceiling.'
    },
    {
      id: 'sensational',
      name: 'Sensational Tabloid',
      ratingsMult: 1.22,
      trustMod: -3.8,
      adMult: 1.02,
      fccMod: -3.2,
      expenseMult: 1.08,
      growthMult: 1.14,
      controversyBonus: 26,
      moraleMod: -0.6,
      desc: '+22% Ratings hype, BUT severe Public Trust (-3.8/mo) & FCC (-3.2/mo) decay plus burnout over time!'
    },
    {
      id: 'public_service',
      name: 'Community Service',
      ratingsMult: 0.90,
      trustMod: 2.8,
      adMult: 0.76,
      fccMod: 2.2,
      expenseMult: 1.06,
      growthMult: 0.92,
      controversyBonus: -10,
      moraleMod: 0.8,
      desc: 'High Public Trust (+2.8/mo) & FCC goodwill (+2.2/mo), at the cost of 24% lower ad revenue.'
    },
    {
      id: 'aggressive',
      name: 'Aggressive Expansion',
      ratingsMult: 1.14,
      trustMod: -0.7,
      adMult: 1.16,
      fccMod: -0.9,
      expenseMult: 1.30,
      growthMult: 1.25,
      controversyBonus: 8,
      moraleMod: -1.8,
      desc: '+25% faster audience growth & +16% ad yield, but +30% operating costs & staff burnout.'
    },
    {
      id: 'conservative',
      name: 'Conservative Stability',
      ratingsMult: 0.85,
      trustMod: 1.2,
      adMult: 0.92,
      fccMod: 1.2,
      expenseMult: 0.78,
      growthMult: 0.72,
      controversyBonus: -8,
      moraleMod: 0.3,
      desc: 'Slashes expenses 22% and fortifies Trust/FCC, at much slower audience growth.'
    }
  ];

  const COMMERCIAL_LOADS = [
    {
      id: 'light',
      name: 'Light (4 min/hr)',
      adRevenueMult: 0.82,
      ratingsBonus: 1.5,
      adSatMod: -0.5,
      trustMod: 0.6
    },
    {
      id: 'balanced',
      name: 'Balanced (8 min/hr)',
      adRevenueMult: 1.00,
      ratingsBonus: 0,
      adSatMod: 0.2,
      trustMod: 0
    },
    {
      id: 'heavy',
      name: 'Heavy Saturation (16 min/hr)',
      adRevenueMult: 1.28,
      ratingsBonus: -2.4,
      adSatMod: 1.2,
      trustMod: -1.1
    }
  ];

  /**
   * Regular Mid-Month Interrupt Events & Emergency Broadcasts
   */
  const INTERRUPT_EVENTS = [
    {
      id: 'highway_31_goat',
      category: 'BREAKING NEWS',
      icon: '🐐',
      isEmergency: true,
      minYear: 1,
      maxYear: 25,
      title: 'Loose Goat Blocking Highway 31',
      description: 'A deeply stubborn Toggenburg goat named Senator Nibbles is standing in the center lane of Highway 31 holding an abandoned traffic cone. Commuters are honking.',
      flagGrant: 'sawGoatEvent',
      choices: [
        {
          label: 'A) Interrupt programming and go live from the roadside',
          tags: ['+Ratings', '+Public Trust', '-Ad Revenue / -$650'],
          effects: { cash: -650, ratings: 2.8, listeners: 620, trust: 4, adSat: -2, fcc: 1, morale: 3, adPreempt: 0.14 },
          requiresUpgrade: null,
          reportLine: 'Live Highway 31 goat standoff coverage captivated commuters across the county.'
        },
        {
          label: 'B) Mention it briefly during the next news block',
          tags: ['+Minor Trust', 'No Cost'],
          effects: { cash: 0, ratings: 0.7, listeners: 140, trust: 1, adSat: 1, fcc: 0, morale: 0 },
          reportLine: 'Station delivered polite Highway 31 goat traffic updates between spots.'
        },
        {
          label: 'C) Ignore it and keep playing scheduled commercials',
          tags: ['+Ad Satisfaction', '-Public Trust'],
          effects: { cash: 350, ratings: -0.8, listeners: -120, trust: -4, adSat: 3, fcc: -1, morale: -1 },
          reportLine: 'Listeners fumed in traffic while the station ran uninterrupted mattress commercials.'
        },
        {
          label: 'D) Deploy Traffic Helicopter to herd Senator Nibbles from above',
          tags: ['Helicopter Bonus', '++Ratings', '++Listeners', '-$1,100 Fuel'],
          requiresUpgrade: 'traffic_helicopter',
          effects: { cash: -1100, ratings: 5.0, listeners: 1450, trust: 5, adSat: 2, fcc: 0, morale: 5 },
          reportLine: 'Aerial helicopter coverage of the Highway 31 goat pursuit shattered local ratings.'
        }
      ]
    },
    {
      id: 'county_fair',
      category: 'COMMUNITY EVENT',
      icon: '🎡',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'Tri-County Fair Opens With Suspicious Butter Sculpture',
      description: 'The Tri-County Fair asks the station to broadcast live beside the prize-winning 900-pound butter replica of the County Courthouse.',
      choices: [
        {
          label: 'A) Broadcast live from the Midway all weekend',
          tags: ['++Listeners', '+Public Trust', '-$900 Setup'],
          effects: { cash: -900, ratings: 2.5, listeners: 850, trust: 4, adSat: 4, fcc: 1, morale: 4 },
          reportLine: 'Live booth at the County Fair drew crowds and thrilled local sponsors.'
        },
        {
          label: 'B) Auction off discounted sponsor shout-outs from the studio',
          tags: ['+$1,400 Cash', '+Ad Sat', '-Minor Trust'],
          effects: { cash: 1400, ratings: 0.6, listeners: 150, trust: -1, adSat: 5, fcc: 0, morale: -1 },
          reportLine: 'Fairground sponsor blitz padded the station ledger.'
        },
        {
          label: 'C) Run an exposé questioning where the butter came from',
          tags: ['++Ratings', '-Trust', '-Ad Sat', '-FCC'],
          effects: { cash: 0, ratings: 3.4, listeners: 740, trust: -3, adSat: -4, fcc: -3, morale: 2 },
          reportLine: 'Butter-gate conspiracy coverage spiked ratings and offended three dairy farmers.'
        }
      ]
    },
    {
      id: 'hurricane_watch',
      category: 'EMERGENCY BROADCAST',
      icon: '🌀',
      isEmergency: true,
      minYear: 1,
      maxYear: 25,
      title: 'Inland Hurricane Watch & Lawn Chair Advisory',
      description: 'Barometric pressure is plummeting and lawn furniture is achieving low earth orbit. County Emergency Management requests immediate radio warnings.',
      choices: [
        {
          label: 'A) Interrupt programming for continuous Emergency Broadcasts',
          tags: ['++Public Trust', '++Listeners', '+FCC', '-Ad Revenue'],
          effects: { cash: -450, ratings: 3.6, listeners: 1100, trust: 7, adSat: -4, fcc: 5, morale: 2, adPreempt: 0.22 },
          reportLine: 'Continuous hurricane emergency broadcasts saved porches and won fierce civic loyalty.'
        },
        {
          label: 'B) Provide limited storm bulletins between commercials',
          tags: ['+Trust', '+Listeners', 'Balanced Revenue'],
          effects: { cash: 0, ratings: 1.4, listeners: 380, trust: 2, adSat: 1, fcc: 1, morale: 0, adPreempt: 0.08 },
          reportLine: 'Station threaded storm advisories cleanly between paid commercial breaks.'
        },
        {
          label: 'C) Continue regular programming and play soothing music',
          tags: ['Full Ad Revenue', '--Public Trust', '--FCC'],
          effects: { cash: 400, ratings: -1.5, listeners: -450, trust: -8, adSat: 2, fcc: -8, morale: -3 },
          reportLine: 'FCC issued a sharp reprimand after the station played banjo hits during a gale.'
        }
      ]
    },
    {
      id: 'power_failure',
      category: 'EMERGENCY BROADCAST',
      icon: '⚡',
      isEmergency: true,
      minYear: 1,
      maxYear: 25,
      title: 'Substation Squirrel Causes County Power Failure',
      description: 'Half the county just went dark after an ambitious squirrel bridged a 69kV transformer. Listeners are cranking battery radios.',
      choices: [
        {
          label: 'A) Go wall-to-wall with emergency grid & flashlight updates',
          tags: ['++Trust', '+Listeners', '-$700 Fuel / -Ads'],
          effects: { cash: -700, ratings: 3.0, listeners: 950, trust: 6, adSat: -3, fcc: 4, morale: 2, adPreempt: 0.18 },
          reportLine: 'Station stayed loud through the blackout, becoming the county lifeline.'
        },
        {
          label: 'B) Run backup generator power at reduced wattage',
          tags: ['+$0 if Generator owned', '+Trust', 'Balanced'],
          effects: { cash: -250, ratings: 1.2, listeners: 320, trust: 2, adSat: 0, fcc: 2, morale: 1, adPreempt: 0.08 },
          reportLine: 'Low-wattage emergency updates kept battery radios tuned in.'
        },
        {
          label: 'C) Go off the air until utility crews finish lunch',
          tags: ['Save Cash', '--Ratings', '--Ad Sat', '-FCC'],
          effects: { cash: 200, ratings: -3.2, listeners: -700, trust: -5, adSat: -6, fcc: -4, morale: -4 },
          reportLine: 'Dead air during the outage drove disappointed battery-radio listeners to rivals.'
        }
      ]
    },
    {
      id: 'flooding_crisis',
      category: 'EMERGENCY BROADCAST',
      icon: '🌊',
      isEmergency: true,
      minYear: 1,
      maxYear: 25,
      title: 'Mud Creek Overflows Into Downtown Bowling Alley',
      description: 'Flash flooding has turned Main Street into a competitive kayaking venue. Police ask for evacuation route announcements.',
      choices: [
        {
          label: 'A) Interrupt programming for 24-hour flood & canoe rescue coverage',
          tags: ['++Trust', '++Listeners', '+Canoe Ads', '-Ad Preemption'],
          effects: { cash: -500, ratings: 3.5, listeners: 1050, trust: 7, adSat: -2, fcc: 4, morale: 3, adPreempt: 0.20 },
          reportLine: 'Flood rescue coverage prompted Honest Bob to praise our heroic canoe advisories.'
        },
        {
          label: 'B) Air hourly flood bulletins with sponsor tags',
          tags: ['+Trust', '+Small Revenue'],
          effects: { cash: 300, ratings: 1.3, listeners: 300, trust: 2, adSat: 2, fcc: 1, morale: 0, adPreempt: 0.05 },
          reportLine: 'Sponsored flood bulletins kept Main Street dry and accounts balanced.'
        },
        {
          label: 'C) Treat it as a lighthearted watersports feature',
          tags: ['+Ratings', '--Public Trust', '-FCC'],
          effects: { cash: 0, ratings: 2.1, listeners: 280, trust: -6, adSat: -3, fcc: -5, morale: -2 },
          reportLine: 'Calling the bowling alley disaster "Lane 7 Rapids" sparked angry civic letters.'
        }
      ]
    },
    {
      id: 'fish_rain_warning',
      category: 'WEATHER ANOMALY',
      icon: '🐟',
      isEmergency: true,
      minYear: 2,
      maxYear: 25,
      title: 'Fish Rain Warning Issued for Route 9',
      description: 'Meteorologists report a waterspout vacuumed up an entire catfish farm. Barometric pressure smells strongly of tartar sauce.',
      flagGrant: 'sawFishRain',
      choices: [
        {
          label: 'A) Sound the Emergency Fish Rain Siren and warn motorists',
          tags: ['++Trust', '++Listeners', '-Ad Preemption'],
          effects: { cash: -400, ratings: 3.4, listeners: 980, trust: 5, adSat: -2, fcc: 3, morale: 4, adPreempt: 0.15 },
          reportLine: 'Emergency Fish Rain warnings saved dozens of windshields from airborne bullheads.'
        },
        {
          label: 'B) Run tongue-in-cheek fish pun coverage with Bass sponsors',
          tags: ['+$950 Cash', '+Ratings', '+Ad Sat'],
          effects: { cash: 950, ratings: 2.2, listeners: 450, trust: 1, adSat: 4, fcc: 0, morale: 3 },
          reportLine: 'Monetized the Fish Rain warning with live bait and windshield coupons.'
        },
        {
          label: 'C) Dismiss it as nonsense and stick to normal schedule',
          tags: ['No Cost', '-Trust if fish fall'],
          effects: { cash: 0, ratings: -0.6, listeners: -140, trust: -4, adSat: 1, fcc: -1, morale: -1 },
          reportLine: 'Listeners took dim view of our skepticism when perch landed on the post office.'
        }
      ]
    },
    {
      id: 'state_fair',
      category: 'REGIONAL EVENT',
      icon: '🎪',
      isEmergency: false,
      minYear: 2,
      maxYear: 25,
      title: 'State Fair Deep-Fried Everything Pavilion',
      description: 'The State Fair invited regional stations to cover the Deep-Fried Tractor Tire Eating Contest and Governor\'s Hog Call.',
      choices: [
        {
          label: 'A) Send a full broadcast crew and host a listener meet-up',
          tags: ['-$1,600 Cost', '++Listeners', '++Morale'],
          effects: { cash: -1600, ratings: 3.6, listeners: 1400, trust: 3, adSat: 3, fcc: 1, morale: 6 },
          reportLine: 'State Fair broadcast pavilion brought hundreds of new out-of-county listeners.'
        },
        {
          label: 'B) Sell State Fair VIP sponsorship bundles over the phone',
          tags: ['+$2,200 Cash', '+Ad Sat', '-Morale'],
          effects: { cash: 2200, ratings: 0.5, listeners: 220, trust: 0, adSat: 5, fcc: 0, morale: -3 },
          reportLine: 'Aggressive State Fair ad bundles brought strong mid-month cashflow.'
        },
        {
          label: 'C) Broadcast only the Hog Calling Championship live',
          tags: ['-$400 Cost', '+Ratings', '+Trust'],
          effects: { cash: -400, ratings: 2.1, listeners: 520, trust: 2, adSat: 1, fcc: 0, morale: 2 },
          reportLine: 'Unedited State Fair hog-calling audio became an instant carpool favorite.'
        }
      ]
    },
    {
      id: 'celebrity_visit',
      category: 'LOCAL BUZZ',
      icon: '🌟',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: '1970s Sitcom Sidekick Stops for Gas Nearby',
      description: 'Buckley "Buckets" Malone, famed fourth-billed neighbor from "Barn Door Barnaby," is stranded at the Exit 14 Exxon with alternator trouble.',
      choices: [
        {
          label: 'A) Send a tow truck and book him for an exclusive 2-hour interview',
          tags: ['-$1,100 Tow/Fee', '++Ratings', '++Listeners'],
          effects: { cash: -1100, ratings: 4.0, listeners: 1150, trust: 2, adSat: 4, fcc: 0, morale: 5 },
          reportLine: 'Exclusive stranded-celebrity interview had switchboards glowing red.'
        },
        {
          label: 'B) Call his flip-phone for a quick 5-minute phoner',
          tags: ['$0 Cost', '+Ratings', '+Listeners'],
          effects: { cash: 0, ratings: 1.5, listeners: 340, trust: 1, adSat: 1, fcc: 0, morale: 1 },
          reportLine: 'Brief payphone chat with Buckets Malone gave afternoon drive a nice lift.'
        },
        {
          label: 'C) Auction off his current GPS location to autograph hunters',
          tags: ['+$1,300 Cash', '--Trust', '-FCC'],
          effects: { cash: 1300, ratings: 2.3, listeners: 380, trust: -5, adSat: -2, fcc: -4, morale: -2 },
          reportLine: 'Celebrity location auction outraged polite society and the Exit 14 cashier.'
        }
      ]
    },
    {
      id: 'massive_yard_sale',
      category: 'LOCAL CULTURE',
      icon: '🏷️',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'The 12-Mile Highway Yard Sale Gridlock',
      description: 'Four hundred driveways are selling collectible porcelain frogs simultaneously, paralyzing county commerce.',
      choices: [
        {
          label: 'A) Run live Swap Shop specials guiding shoppers to rare lamps',
          tags: ['+Listeners', '+Trust', '+Morale'],
          effects: { cash: 250, ratings: 2.0, listeners: 540, trust: 3, adSat: 2, fcc: 1, morale: 3 },
          reportLine: 'Live yard-sale lamp dispatches turned WSTF into the official bargain radar.'
        },
        {
          label: 'B) Charge sellers $25 a pop for on-air driveway shout-outs',
          tags: ['+$1,650 Cash', '+Ad Sat', '-Ratings'],
          effects: { cash: 1650, ratings: -0.9, listeners: 80, trust: -1, adSat: 4, fcc: 0, morale: 0 },
          reportLine: 'Pay-per-driveway yard sale marathon brought brisk cashflow.'
        },
        {
          label: 'C) Broadcast stern traffic lectures urging everyone to go home',
          tags: ['+FCC', '-Listeners'],
          effects: { cash: 0, ratings: -1.1, listeners: -220, trust: 1, adSat: -1, fcc: 2, morale: -2 },
          reportLine: 'Anti-yard-sale scolding alienated bargain hunters countywide.'
        }
      ]
    },
    {
      id: 'water_tower_dispute',
      category: 'CIVIC DRAMA',
      icon: '🗼',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'Water Tower Repainting Color Brawl',
      description: 'Town Council is deadlocked 3-3 on whether the water tower should be painted "Heritage Beige" or "Bass Pro Chartreuse."',
      choices: [
        {
          label: 'A) Host a serious town hall debate between both paint factions',
          tags: ['+Trust', '+FCC', '+Ratings'],
          effects: { cash: -200, ratings: 1.8, listeners: 400, trust: 4, adSat: 1, fcc: 3, morale: 1 },
          reportLine: 'Civil water-tower color forum cemented the station as fair civic ground.'
        },
        {
          label: 'B) Endorse Bass Pro Chartreuse and hand out neon bumper stickers',
          tags: ['++Ratings', '-$600 Stickers', '-Trust'],
          effects: { cash: -600, ratings: 3.1, listeners: 780, trust: -2, adSat: 2, fcc: -1, morale: 4 },
          reportLine: 'Pro-Chartreuse editorial crusade triggered joyous horn-honking downtown.'
        },
        {
          label: 'C) Sell naming rights to the highest station advertiser',
          tags: ['+$1,800 Cash', '-Trust', '+Ad Sat'],
          effects: { cash: 1800, ratings: 0.4, listeners: 90, trust: -4, adSat: 6, fcc: -2, morale: -1 },
          reportLine: 'Pitching "The Mabel Taxidermy Water Tower" delighted sponsors and baffled aldermen.'
        }
      ]
    },
    {
      id: 'bake_sale_riot',
      category: 'LOCAL NEWS',
      icon: '🥧',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'VFW Lemon Bar Bake Sale Controversy',
      description: 'Accusations of store-bought crust have fractured the VFW Auxiliary bake-off. Two folding tables were flipped.',
      choices: [
        {
          label: 'A) Dispatch a reporter to taste-test every tray on air',
          tags: ['+Ratings', '+Listeners', '-$250'],
          effects: { cash: -250, ratings: 2.4, listeners: 490, trust: 1, adSat: 1, fcc: 0, morale: 4 },
          reportLine: 'Live blind lemon-bar forensics glued listeners to their dashboards.'
        },
        {
          label: 'B) Offer the station lobby as neutral pastry arbitration space',
          tags: ['+Public Trust', '+FCC'],
          effects: { cash: -150, ratings: 0.9, listeners: 180, trust: 4, adSat: 1, fcc: 2, morale: 1 },
          reportLine: 'Hosting the VFW Pastry Accords won warm applause from town elders.'
        },
        {
          label: 'C) Air dramatic wrestling commentary over the folding-table footage',
          tags: ['++Ratings', '-Trust', '-FCC'],
          effects: { cash: 0, ratings: 3.3, listeners: 660, trust: -4, adSat: -2, fcc: -4, morale: 3 },
          reportLine: 'Play-by-play pastry riot call went viral while irritating the VFW.'
        }
      ]
    },
    {
      id: 'cb_trucker_jam',
      category: 'TECHNICAL ALERT',
      icon: '🚛',
      isEmergency: false,
      minYear: 2,
      maxYear: 25,
      title: 'Rogue Convoy Bleeding Into Our AM Frequency',
      description: 'Thirty eighteen-wheelers hauling inflatable kayaks have illegally boosted their CB amplifiers, stomping over our afternoon broadcast.',
      choices: [
        {
          label: 'A) Hire an RF engineer to re-tune the transmitter filters',
          tags: ['-$1,200 Tech', '+FCC', '+Trust'],
          effects: { cash: -1200, ratings: 1.2, listeners: 250, trust: 3, adSat: 2, fcc: 4, morale: 2 },
          reportLine: 'Clean RF engineering scrubbed CB bleed-over and impressed FCC inspectors.'
        },
        {
          label: 'B) Invite the convoy leader onto the show as co-host',
          tags: ['++Ratings', '++Listeners', '-FCC'],
          effects: { cash: 0, ratings: 3.4, listeners: 920, trust: -1, adSat: 2, fcc: -5, morale: 4 },
          reportLine: 'Turning the hijacked frequency into "Convoy Live" delighted truckers and vexed the FCC.'
        },
        {
          label: 'C) Blast carrier static back until they drive out of range',
          tags: ['Free', '-Ratings', '-FCC'],
          effects: { cash: 0, ratings: -1.6, listeners: -310, trust: -3, adSat: -3, fcc: -6, morale: -2 },
          reportLine: 'Static warfare drove away both truckers and regular afternoon listeners.'
        }
      ]
    },
    {
      id: 'stray_emu_runway',
      category: 'BREAKING NEWS',
      icon: '🦤',
      isEmergency: false,
      minYear: 2,
      maxYear: 25,
      title: 'Six-Foot Emu Commands Municipal Airstrip',
      description: 'An escaped emu wearing a reflective vest is chasing the airport riding mower down Runway 2.',
      choices: [
        {
          label: 'A) Do live sports-style play-by-play of the emu chase',
          tags: ['++Ratings', '+Listeners', '-$300'],
          effects: { cash: -300, ratings: 3.2, listeners: 820, trust: 2, adSat: 1, fcc: 0, morale: 5 },
          reportLine: 'Live emu runway play-by-play had office workers cheering around breakroom radios.'
        },
        {
          label: 'B) Broadcast calm airport delay notices only',
          tags: ['+Trust', '+FCC'],
          effects: { cash: 0, ratings: 0.6, listeners: 150, trust: 3, adSat: 1, fcc: 2, morale: 0 },
          reportLine: 'Measured airport advisory kept general aviation calm.'
        },
        {
          label: 'C) Pitch Mabel Taxidermy live sponsorship during the standoff',
          tags: ['+$1,100 Cash', '+Ad Sat', '--Trust'],
          effects: { cash: 1100, ratings: 1.5, listeners: 220, trust: -5, adSat: 5, fcc: -2, morale: -1 },
          reportLine: 'Suggesting discount taxidermy mid-chase horrified animal lovers and delighted Mabel.'
        }
      ]
    },
    {
      id: 'roadside_flamingo_migration',
      category: 'LOCAL MYSTERY',
      icon: '🦩',
      isEmergency: false,
      minYear: 3,
      maxYear: 25,
      title: '300 Plastic Flamingos Appear on Mayor\'s Lawn',
      description: 'Overnight, an organized prank squad planted three hundred pink lawn flamingos facing the station tower in formation.',
      choices: [
        {
          label: 'A) Launch a tongue-in-cheek "Flamingo Watch" listener scavenger hunt',
          tags: ['++Listeners', '+Morale', '-$500 Prizes'],
          effects: { cash: -500, ratings: 2.6, listeners: 890, trust: 2, adSat: 3, fcc: 0, morale: 5 },
          reportLine: 'Flamingo scavenger hunt turned into an all-week listener craze.'
        },
        {
          label: 'B) Interview the furious Mayor about lawn integrity',
          tags: ['+Trust', '+Ratings'],
          effects: { cash: 0, ratings: 1.5, listeners: 320, trust: 2, adSat: 0, fcc: 1, morale: 0 },
          reportLine: 'Mayor\'s live 12-minute flamingo rant drew steady civic curiosity.'
        },
        {
          label: 'C) Claim the flamingos are covert radar beacons',
          tags: ['++Ratings', '-Trust', '--FCC'],
          effects: { cash: 0, ratings: 3.8, listeners: 940, trust: -5, adSat: -3, fcc: -6, morale: 2 },
          reportLine: 'Claiming plastic flamingos were federal radar dishes triggered 400 panicky calls.'
        }
      ]
    },
    {
      id: 'coffee_pot_embargo',
      category: 'LOCAL POLITICS',
      icon: '☕',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'City Hall Bans Non-Decaf After 2 PM',
      description: 'County commissioners blame high-octane dark roast for last week\'s zoning fistfight. Truckers and clerks are protesting.',
      choices: [
        {
          label: 'A) Hand out free espresso shots outside City Hall on remote broadcast',
          tags: ['-$650 Coffee', '++Morale', '++Listeners'],
          effects: { cash: -650, ratings: 2.8, listeners: 760, trust: 2, adSat: 2, fcc: -1, morale: 6 },
          reportLine: 'Station espresso relief van won eternal devotion from sleepy clerks.'
        },
        {
          label: 'B) Moderate a calm public-health roundtable',
          tags: ['+Trust', '+FCC'],
          effects: { cash: 0, ratings: 0.7, listeners: 160, trust: 3, adSat: 2, fcc: 2, morale: 0 },
          reportLine: 'Balanced caffeine forum earned polite nods from civic leaders.'
        },
        {
          label: 'C) Run continuous coffee-roaster commercials during their meeting',
          tags: ['+$1,200 Cash', '+Ad Sat', '-Trust'],
          effects: { cash: 1200, ratings: 0.9, listeners: 140, trust: -2, adSat: 4, fcc: 0, morale: 1 },
          reportLine: 'Weaponized espresso ad spots padded the mid-month budget.'
        }
      ]
    },
    {
      id: 'scoreboard_fire',
      category: 'SPORTS CRISIS',
      icon: '🔥',
      isEmergency: false,
      minYear: 1,
      maxYear: 25,
      title: 'High School Scoreboard Spontaneously Combusts',
      description: 'During the third quarter of Friday\'s big game, the scoreboard shorted out and started glowing purple before catching fire.',
      choices: [
        {
          label: 'A) Sponsor a replacement scoreboard fund on air',
          tags: ['-$1,400 Donation', '++Trust', '+Listeners'],
          effects: { cash: -1400, ratings: 2.2, listeners: 680, trust: 6, adSat: 3, fcc: 2, morale: 4 },
          reportLine: 'Station Scoreboard Relief Drive made WSTF a hometown hero.'
        },
        {
          label: 'B) Broadcast the rest of the game with dramatic score-guessing',
          tags: ['+Ratings', '+Morale'],
          effects: { cash: 0, ratings: 2.4, listeners: 480, trust: 1, adSat: 1, fcc: 0, morale: 3 },
          reportLine: 'Improvised scorekeeping kept Friday night sports entertaining.'
        },
        {
          label: 'C) Blame rival county boosters for electrical sabotage',
          tags: ['++Ratings', '--Trust', '-FCC'],
          effects: { cash: 0, ratings: 3.5, listeners: 740, trust: -5, adSat: -2, fcc: -4, morale: 1 },
          reportLine: 'Wild scoreboard sabotage accusations inflamed halftime tempers.'
        }
      ]
    }
  ];

  /**
   * 6 Multi-Step Event Chains: Step 1 fires early in month, schedules Step 2 later in same month.
   */
  const EVENT_CHAINS = [
    {
      id: 'chain_fish_rain',
      minYear: 2,
      step1: {
        category: 'EVENT CHAIN • WEEK 1',
        icon: '🌩️',
        isEmergency: false,
        title: 'Barometric Anomaly: Fish Rain Forecasted',
        description: 'Instruments (and Captain Radar\'s left knee) indicate an 84% probability of literal largemouth bass falling from the sky later this month.',
        flagGrant: 'sawFishRain',
        choices: [
          {
            label: 'A) Fully endorse the Fish Rain forecast & urge tin-roof helmets',
            tags: ['Sets Chain: Prepared', '+Trust', '-Minor Ad Sat'],
            effects: { cash: -200, ratings: 1.8, listeners: 380, trust: 2, adSat: -1, fcc: 0, morale: 2 },
            chainBranch: 'supported',
            reportLine: 'Station boldly backed the controversial Fish Rain advisory.'
          },
          {
            label: 'B) Mock the forecast as pure fishing-bait folklore',
            tags: ['Sets Chain: Mocked', '+Ratings', '+Ad Sat', '-Trust'],
            effects: { cash: 400, ratings: 2.2, listeners: 410, trust: -2, adSat: 2, fcc: 0, morale: 1 },
            chainBranch: 'mocked',
            reportLine: 'Broadcast team spent all week roasting the Fish Rain prediction.'
          },
          {
            label: 'C) Ignore the forecast completely',
            tags: ['Sets Chain: Ignored', 'No Immediate Cost'],
            effects: { cash: 0, ratings: -0.4, listeners: -50, trust: 0, adSat: 1, fcc: 0, morale: 0 },
            chainBranch: 'ignored',
            reportLine: 'Station skipped the Fish Rain warning in favor of regular commercials.'
          }
        ]
      },
      step2ByBranch: {
        supported: {
          category: 'SPECIAL INCIDENT • ACTUAL FISH RAIN',
          icon: '🐟',
          isEmergency: true,
          isSpecialIncident: true,
          incidentTitle: 'Actual Fish Rain',
          title: 'ACTUAL FISH RAIN STRIKES DOWNTOWN!',
          description: 'Because WSTF warned listeners early, citizens had umbrellas and frying pans ready as 4,000 bewildered perch rained onto Main Street!',
          choices: [
            {
              label: 'A) Go wall-to-wall live coverage as "The Fish Rain Authority"',
              tags: ['+++Listeners', '+++Trust', '++Ratings', '-$600'],
              effects: { cash: -600, ratings: 6.5, listeners: 2800, trust: 8, adSat: 4, fcc: 3, morale: 8, adPreempt: 0.12 },
              reportLine: 'Vindicated by Actual Fish Rain, the station earned legendary prophetic status!'
            },
            {
              label: 'B) Air emergency street-clearing bulletins & Bass Removal spots',
              tags: ['+$2,800 Cash', '++Trust', '++Listeners'],
              effects: { cash: 2800, ratings: 4.5, listeners: 1900, trust: 5, adSat: 8, fcc: 2, morale: 5 },
              reportLine: 'Prepared listeners hailed our Actual Fish Rain safety & sponsorship blitz.'
            }
          ]
        },
        mocked: {
          category: 'SPECIAL INCIDENT • ACTUAL FISH RAIN',
          icon: '🐟',
          isEmergency: true,
          isSpecialIncident: true,
          incidentTitle: 'Actual Fish Rain',
          title: 'ACTUAL FISH RAIN HUMILIATES STUDIO!',
          description: 'A three-pound crappie just crashed through the station skylight mid-laugh. Listeners who left sunroofs open after our mockery are furious!',
          choices: [
            {
              label: 'A) Issue a tearful on-air apology to every catfish and listener',
              tags: ['-$1,500 Skylight', '+Ratings', 'Recover Some Trust'],
              effects: { cash: -1500, ratings: 3.5, listeners: 900, trust: -2, adSat: -3, fcc: -2, morale: -2 },
              reportLine: 'Station apologized live while sweeping bass off the console during Actual Fish Rain.'
            },
            {
              label: 'B) Pivot instantly to emergency coverage & claim it was satire',
              tags: ['-$800 Repair', '++Ratings', '--Trust', '-FCC'],
              effects: { cash: -800, ratings: 5.2, listeners: 1500, trust: -7, adSat: -4, fcc: -5, morale: 1 },
              reportLine: 'Mocking Fish Rain right before Actual Fish Rain damaged credibility despite sky-high curiosity.'
            }
          ]
        },
        ignored: {
          category: 'SPECIAL INCIDENT • ACTUAL FISH RAIN',
          icon: '🐟',
          isEmergency: true,
          isSpecialIncident: true,
          incidentTitle: 'Actual Fish Rain',
          title: 'SURPRISE FISH RAIN CATCHES COUNTY OFF GUARD!',
          description: 'Without any radio warning, commuters were blindsided by falling walleye on Route 9. Emergency dispatch is screaming for airtime.',
          choices: [
            {
              label: 'A) Interrupt everything immediately for emergency cleanup bulletins',
              tags: ['-$900', '+Listeners', 'Mitigate Trust Drop'],
              effects: { cash: -900, ratings: 3.4, listeners: 1100, trust: -1, adSat: -3, fcc: 0, morale: 1, adPreempt: 0.16 },
              reportLine: 'Late emergency coverage softened the blow of missing the Actual Fish Rain warning.'
            },
            {
              label: 'B) Keep playing classic country and pretend the thuds are hail',
              tags: ['Full Ads', '---Trust', '---FCC'],
              effects: { cash: 400, ratings: -2.0, listeners: -550, trust: -9, adSat: -2, fcc: -7, morale: -4 },
              reportLine: 'Ignoring Actual Fish Rain caused severe public outrage and an FCC inquiry.'
            }
          ]
        }
      }
    },
    {
      id: 'chain_goat_election',
      minYear: 2,
      step1: {
        category: 'EVENT CHAIN • CIVIC DRAMA',
        icon: '🐐',
        isEmergency: false,
        title: 'Goat Nominated as Write-In Candidate for Mayor',
        description: 'Someone registered "Barnaby the Goat" on the municipal ballot, and early diner polling shows him leading the incumbent by 14 points.',
        flagGrant: 'sawGoatEvent',
        choices: [
          {
            label: 'A) Host an official on-air debate between the Mayor and the Goat',
            tags: ['Sets Chain: Debate', '++Ratings', '-$400'],
            effects: { cash: -400, ratings: 3.0, listeners: 750, trust: 1, adSat: 1, fcc: 0, morale: 4 },
            chainBranch: 'debate',
            reportLine: 'Broadcast a historic Mayoral vs. Goat debate (the Goat ate the podium).'
          },
          {
            label: 'B) Treat the Goat candidacy as serious investigative journalism',
            tags: ['Sets Chain: Endorsed', '+Listeners', '-Trust'],
            effects: { cash: 0, ratings: 2.2, listeners: 520, trust: -2, adSat: 0, fcc: -1, morale: 2 },
            chainBranch: 'serious',
            reportLine: 'Station ran 4-part investigative profiles on the Goat\'s alfalfa policy.'
          },
          {
            label: 'C) Refuse to mention the Goat on air out of civic dignity',
            tags: ['Sets Chain: Ignored', '+FCC', '-Ratings'],
            effects: { cash: 0, ratings: -1.0, listeners: -150, trust: 2, adSat: 1, fcc: 2, morale: -1 },
            chainBranch: 'dignity',
            reportLine: 'Station maintained strict dignity regarding the Goat election frenzy.'
          }
        ]
      },
      step2ByBranch: {
        debate: {
          category: 'CHAIN RESOLUTION • ELECTION SCANDAL',
          icon: '🗳️',
          isEmergency: false,
          title: 'Goat Election Scandal: Candidate Eats 400 Absentee Ballots',
          description: 'Having tasted microphone foam during our debate, Barnaby the Goat broke into the clerk\'s office and consumed Precinct 4.',
          choices: [
            {
              label: 'A) Air non-stop "Ballot Belly" breaking coverage',
              tags: ['+++Ratings', '++Listeners', '+$800 Merch'],
              effects: { cash: 800, ratings: 4.8, listeners: 1600, trust: 1, adSat: 3, fcc: -2, morale: 5 },
              reportLine: 'The Goat Election Scandal became the station\'s highest-rated civic circus.'
            },
            {
              label: 'B) Donate airtime for an emergency county re-vote drive',
              tags: ['++Public Trust', '+FCC', '-Ad Revenue'],
              effects: { cash: -450, ratings: 1.8, listeners: 620, trust: 6, adSat: -1, fcc: 4, morale: 2 },
              reportLine: 'Station helped organize emergency replacement ballots after the Goat scandal.'
            }
          ]
        },
        serious: {
          category: 'CHAIN RESOLUTION • ELECTION SCANDAL',
          icon: '🗳️',
          isEmergency: false,
          title: 'Goat Wins Precinct 2 & Demands Hay Subsidy',
          description: 'After our glowing profiles, the Goat actually won a council seat and promptly headbutted the municipal budget binder.',
          choices: [
            {
              label: 'A) Embrace it with a live Goat Inauguration Special',
              tags: ['++Ratings', '++Listeners', '-Trust'],
              effects: { cash: 300, ratings: 4.0, listeners: 1300, trust: -3, adSat: 2, fcc: -3, morale: 4 },
              reportLine: 'Live Goat Inauguration coverage riveted listeners while horrified purists groaned.'
            },
            {
              label: 'B) Distance the station and cover the legal annulment quietly',
              tags: ['+Trust', '+FCC'],
              effects: { cash: -300, ratings: 0.6, listeners: 150, trust: 3, adSat: 1, fcc: 3, morale: -1 },
              reportLine: 'Careful legal coverage calmed City Hall after the Goat Election Scandal.'
            }
          ]
        },
        dignity: {
          category: 'CHAIN RESOLUTION • ELECTION SCANDAL',
          icon: '🗳️',
          isEmergency: false,
          title: 'Goat Election Chaos Happens Anyway Without Us',
          description: 'Everyone in town is glued to rival radios as the Goat candidate leads a parade past our empty parking lot.',
          choices: [
            {
              label: 'A) Pivot late and join the Goat Scandal live coverage',
              tags: ['+Ratings', '+Listeners', '-$500'],
              effects: { cash: -500, ratings: 2.0, listeners: 520, trust: 0, adSat: 1, fcc: 0, morale: 1 },
              reportLine: 'Station scrambled to join late coverage of the Goat Election Scandal.'
            },
            {
              label: 'B) Stick to our dignified civic neutrality',
              tags: ['+FCC', '-Listeners'],
              effects: { cash: 0, ratings: -1.4, listeners: -320, trust: 2, adSat: -2, fcc: 3, morale: -2 },
              reportLine: 'While dignified, skipping the Goat Election Scandal cost local relevance.'
            }
          ]
        }
      }
    },
    {
      id: 'chain_mysterious_boom',
      minYear: 3,
      step1: {
        category: 'EVENT CHAIN • UNEXPLAINED PHENOMENON',
        icon: '💥',
        isEmergency: false,
        title: 'Mysterious Subterranean Boom Shakes Studio',
        description: 'A window-rattling BOOM echoed from beneath the old gravel pit, knocking every mug off the console.',
        choices: [
          {
            label: 'A) Broadcast urgent speculation about secret underground tunnels',
            tags: ['Sets Chain: Panic', '++Ratings', '-FCC'],
            effects: { cash: 0, ratings: 3.2, listeners: 840, trust: -3, adSat: -1, fcc: -3, morale: 2 },
            chainBranch: 'speculate',
            reportLine: 'On-air boom theories sent half the town staring suspiciously at basements.'
          },
          {
            label: 'B) Coordinate quietly with Department of Boom Prevention',
            tags: ['Sets Chain: Cooperate', '+Trust', '+FCC'],
            effects: { cash: -250, ratings: 1.4, listeners: 320, trust: 4, adSat: 3, fcc: 3, morale: 1 },
            chainBranch: 'cooperate',
            reportLine: 'Station partnered cleanly with Boom Prevention officials following the tremor.'
          }
        ]
      },
      step2ByBranch: {
        speculate: {
          category: 'SPECIAL INCIDENT • BOOM LOCKDOWN',
          icon: '🚧',
          isEmergency: true,
          isSpecialIncident: true,
          incidentTitle: 'Department of Boom Prevention Lockdown',
          title: 'DEPARTMENT OF BOOM PREVENTION LOCKDOWN!',
          description: 'Federal agents in bright yellow hardhats taped off four blocks around the studio after our tunnel rumors sparked unauthorized backyard digging.',
          choices: [
            {
              label: 'A) Broadcast live from inside the yellow tape perimeter',
              tags: ['+++Ratings', '++Listeners', '--FCC', '-$1,400 Fine'],
              effects: { cash: -1400, ratings: 5.5, listeners: 1900, trust: -2, adSat: -3, fcc: -7, morale: 3 },
              reportLine: 'Defiant broadcast from inside the Boom Prevention Lockdown made national wire stories!'
            },
            {
              label: 'B) Hand the mic to Boom Prevention Director for calm PSA',
              tags: ['+Trust', '+FCC', '+$1,800 Sponsor Grant'],
              effects: { cash: 1800, ratings: 2.0, listeners: 650, trust: 5, adSat: 6, fcc: 5, morale: 1 },
              reportLine: 'Turning the Boom Prevention Lockdown into an official PSA won a safety grant.'
            }
          ]
        },
        cooperate: {
          category: 'SPECIAL INCIDENT • BOOM LOCKDOWN',
          icon: '🚧',
          isEmergency: true,
          isSpecialIncident: true,
          incidentTitle: 'Department of Boom Prevention Lockdown',
          title: 'OFFICIAL BOOM PREVENTION LOCKDOWN ZONE',
          description: 'The Department of Boom Prevention designated WSTF as the exclusive authorized emergency voice during the 48-hour acoustic perimeter lockdown.',
          choices: [
            {
              label: 'A) Lead official Boom Lockdown safety & shelter coverage',
              tags: ['+++Trust', '++Listeners', '+$2,400 Federal Grant'],
              effects: { cash: 2400, ratings: 4.4, listeners: 1550, trust: 7, adSat: 5, fcc: 6, morale: 4 },
              reportLine: 'Official Boom Prevention Lockdown partnership delivered prestige, listeners, and grant cash.'
            },
            {
              label: 'B) Run light hourly lockdown clearances while keeping music on',
              tags: ['+Trust', '+Ad Sat', '+$900'],
              effects: { cash: 900, ratings: 1.8, listeners: 520, trust: 3, adSat: 3, fcc: 2, morale: 2 },
              reportLine: 'Smooth Boom Lockdown bulletins kept traffic calm and sponsors happy.'
            }
          ]
        }
      }
    },
    {
      id: 'chain_weather_balloon',
      minYear: 4,
      step1: {
        category: 'EVENT CHAIN • SKY WATCH',
        icon: '🎈',
        isEmergency: true,
        title: 'Suspicious Silver Weather Balloon Hovers Over Transmitter',
        description: 'A 40-foot shiny balloon trailing dangling toaster ovens is drifting silently at 600 feet above the tower.',
        choices: [
          {
            label: 'A) Issue an Emergency Airspace Alert & call listeners to watch the sky',
            tags: ['Sets Chain: Alert', '++Listeners', '+Ratings'],
            effects: { cash: -300, ratings: 3.1, listeners: 910, trust: 2, adSat: 0, fcc: 1, morale: 3 },
            chainBranch: 'alert',
            reportLine: 'Alerted the entire valley to the suspicious silver balloon above the tower.'
          },
          {
            label: 'B) Sell "Balloon Watch" ad reads while tracking it from the porch',
            tags: ['Sets Chain: Sponsor', '+$1,200 Cash', '+Ad Sat'],
            effects: { cash: 1200, ratings: 1.6, listeners: 420, trust: 0, adSat: 4, fcc: 0, morale: 1 },
            chainBranch: 'sponsor',
            reportLine: 'Monetized the hovering balloon mystery with porchside live reads.'
          }
        ]
      },
      step2ByBranch: {
        alert: {
          category: 'SPECIAL INCIDENT • RADAR ANOMALY',
          icon: '📡',
          isEmergency: false,
          isSpecialIncident: true,
          incidentTitle: 'Weather Radar Sees Something Weird',
          title: 'WEATHER RADAR SEES SOMETHING WEIRD!',
          description: 'The balloon burst over the reservoir—and now regional radar shows a 9-mile hexagonal echo rotating at 40 knots that refuses to rain.',
          choices: [
            {
              label: 'A) Keep live sky-watchers on air until dawn',
              tags: ['+++Ratings', '++Listeners', '-FCC'],
              effects: { cash: -400, ratings: 5.8, listeners: 2100, trust: -1, adSat: 1, fcc: -4, morale: 5 },
              reportLine: 'All-night coverage of Weather Radar Seeing Something Weird drew sky-watchers from three states.'
            },
            {
              label: 'B) Consult university meteorologists to calm panic',
              tags: ['++Trust', '+FCC', '+Listeners'],
              effects: { cash: -600, ratings: 3.0, listeners: 950, trust: 6, adSat: 3, fcc: 4, morale: 2 },
              reportLine: 'Scientist interviews turned a weird radar anomaly into trusted public science.'
            }
          ]
        },
        sponsor: {
          category: 'SPECIAL INCIDENT • RADAR ANOMALY',
          icon: '📡',
          isEmergency: false,
          isSpecialIncident: true,
          incidentTitle: 'Weather Radar Sees Something Weird',
          title: 'WEATHER RADAR SEES SOMETHING WEIRD (SPONSORED BY TIN FOIL OUTLET)!',
          description: 'The balloon dropped twelve cases of promotional hot-dog buns before radar picked up an unexplained glowing ring over County Line.',
          choices: [
            {
              label: 'A) Cash in with midnight anomaly coverage',
              tags: ['+$2,400 Cash', '++Ratings', '-Trust'],
              effects: { cash: 2400, ratings: 4.5, listeners: 1450, trust: -4, adSat: 6, fcc: -3, morale: 3 },
              reportLine: 'Sponsored coverage of the weird radar ring generated windfall cash and wild phone calls.'
            },
            {
              label: 'B) Donate the bun drop & explain the radar glitch honestly',
              tags: ['+Trust', '+FCC', '+Listeners'],
              effects: { cash: -200, ratings: 2.2, listeners: 780, trust: 5, adSat: 2, fcc: 3, morale: 3 },
              reportLine: 'Honest reporting on the weird radar return won bipartisan diner applause.'
            }
          ]
        }
      }
    },
    {
      id: 'chain_giant_sinkhole',
      minYear: 3,
      step1: {
        category: 'EVENT CHAIN • INFRASTRUCTURE',
        icon: '🕳️',
        isEmergency: false,
        title: 'Alarming Crack Splits Strip Mall Parking Lot',
        description: 'A suspiciously round crevice has opened directly under space #14 outside Quick Bail Bonds, emitting faint bluegrass music.',
        choices: [
          {
            label: 'A) Demand immediate evacuation & daily Pothole Watch updates',
            tags: ['Sets Chain: Warned', '++Trust', '-Ad Sat'],
            effects: { cash: -350, ratings: 2.0, listeners: 480, trust: 5, adSat: -2, fcc: 2, morale: 1 },
            chainBranch: 'warned',
            reportLine: 'Pothole Watch sounded early alarms about the strip-mall parking crack.'
          },
          {
            label: 'B) Joke about it as "discount underground parking"',
            tags: ['Sets Chain: Joked', '+Ratings', '-Trust'],
            effects: { cash: 300, ratings: 2.4, listeners: 520, trust: -3, adSat: 2, fcc: -1, morale: 2 },
            chainBranch: 'joked',
            reportLine: 'Hosts made light of the expanding crack behind the strip mall.'
          }
        ]
      },
      step2ByBranch: {
        warned: {
          category: 'CHAIN RESOLUTION • GIANT SINKHOLE',
          icon: '⚠️',
          isEmergency: true,
          title: 'Giant Sinkhole Swallows Three Sedans & A Vending Machine',
          description: 'The crack collapsed into a 70-foot Giant Sinkhole! Because of our earlier warnings, nobody was inside the cars.',
          choices: [
            {
              label: 'A) Run emergency sinkhole detour & relief coverage',
              tags: ['+++Trust', '++Listeners', '+FCC'],
              effects: { cash: -500, ratings: 3.8, listeners: 1350, trust: 7, adSat: 1, fcc: 4, morale: 4, adPreempt: 0.12 },
              reportLine: 'Early warnings prevented injury when the Giant Sinkhole opened, making WSTF a hero.'
            },
            {
              label: 'B) Broadcast live with Emergency Pothole Services sponsorship',
              tags: ['+$2,100 Cash', '+Trust', '++Ad Sat'],
              effects: { cash: 2100, ratings: 3.1, listeners: 980, trust: 4, adSat: 6, fcc: 2, morale: 3 },
              reportLine: 'Emergency Pothole Services funded full sinkhole traffic recovery coverage.'
            }
          ]
        },
        joked: {
          category: 'CHAIN RESOLUTION • GIANT SINKHOLE',
          icon: '⚠️',
          isEmergency: true,
          title: 'Giant Sinkhole Claims Quick Bail Bonds Mascot Van!',
          description: 'The strip mall collapsed into a Giant Sinkhole while we were running parking jokes. Angry car owners blame our casual tone.',
          choices: [
            {
              label: 'A) Pay for tow-crane sponsorship & go live with apologies',
              tags: ['-$1,600 Relief', '+Ratings', 'Stop Trust Bleed'],
              effects: { cash: -1600, ratings: 2.5, listeners: 620, trust: -1, adSat: -2, fcc: 0, morale: 0 },
              reportLine: 'Station helped fund sinkhole towing after our early parking jokes aged poorly.'
            },
            {
              label: 'B) Double down with "Competitive Sinkhole Parking" broadcast',
              tags: ['++Ratings', '---Trust', '-Ad Sat'],
              effects: { cash: 0, ratings: 4.1, listeners: 940, trust: -8, adSat: -6, fcc: -4, morale: -2 },
              reportLine: 'Mocking the Giant Sinkhole disaster outraged sponsors and strip-mall tenants.'
            }
          ]
        }
      }
    },
    {
      id: 'chain_rival_feud',
      minYear: 4,
      step1: {
        category: 'EVENT CHAIN • RIVALRY',
        icon: '📻',
        isEmergency: false,
        title: 'Rival Station WAMM 1490 AM Steals Our Slogan',
        description: 'Cross-county rival WAMM 1490 began calling themselves "The REAL Voice of Somewhere" and poaching local diner flyers.',
        choices: [
          {
            label: 'A) Fire back on air with comedic diss jingles',
            tags: ['Sets Chain: War', '++Ratings', '+Morale'],
            effects: { cash: -350, ratings: 2.7, listeners: 640, trust: 0, adSat: 1, fcc: -2, morale: 5 },
            chainBranch: 'feud',
            reportLine: 'Aired biting diss jingles mocking rival WAMM 1490 AM.'
          },
          {
            label: 'B) File formal FCC complaint & focus on community loyalty',
            tags: ['Sets Chain: Legal', '+Trust', '+FCC', '-$600 Legal'],
            effects: { cash: -600, ratings: 0.6, listeners: 180, trust: 3, adSat: 1, fcc: 4, morale: 0 },
            chainBranch: 'legal',
            reportLine: 'Filed clean trademark & FCC interference paperwork against WAMM 1490.'
          }
        ]
      },
      step2ByBranch: {
        feud: {
          category: 'SPECIAL INCIDENT • RIVAL SABOTAGE',
          icon: '🔧',
          isEmergency: false,
          isSpecialIncident: true,
          incidentTitle: 'Rival Radio Sabotage',
          title: 'RIVAL RADIO SABOTAGE!',
          description: 'Overnight, masked interns from WAMM 1490 welded our studio door shut and replaced our bumper jingles with kazoo loops!',
          choices: [
            {
              label: 'A) Break in through the snack-room window and air a legendary comeback show',
              tags: ['+++Ratings', '++Listeners', '+Morale', '-$1,100 Repairs'],
              effects: { cash: -1100, ratings: 6.2, listeners: 2200, trust: 3, adSat: 3, fcc: -1, morale: 7 },
              reportLine: 'Rival Radio Sabotage backfired spectacularly as our defiant comeback show ruled the dial!'
            },
            {
              label: 'B) Press charges & seek emergency FCC sanctions',
              tags: ['+$1,600 Settlement', '+FCC', '+Trust'],
              effects: { cash: 1600, ratings: 1.8, listeners: 600, trust: 4, adSat: 2, fcc: 5, morale: 2 },
              reportLine: 'WAMM 1490 paid damages after their clumsy Rival Radio Sabotage attempt.'
            }
          ]
        },
        legal: {
          category: 'SPECIAL INCIDENT • RIVAL SABOTAGE',
          icon: '🔧',
          isEmergency: false,
          isSpecialIncident: true,
          incidentTitle: 'Rival Radio Sabotage',
          title: 'RIVAL RADIO SABOTAGE FOILED AT GATE',
          description: 'Rival WAMM engineers tried to jam our transmitter tower with an antique microwave oven—right while FCC auditors were checking our paperwork!',
          choices: [
            {
              label: 'A) Broadcast live as FCC agents haul away the rival\'s microwave',
              tags: ['++Ratings', '++Trust', '++FCC', '+$2,200 Damages'],
              effects: { cash: 2200, ratings: 4.5, listeners: 1500, trust: 6, adSat: 4, fcc: 8, morale: 6 },
              reportLine: 'Foiled Rival Radio Sabotage handed WSTF victory, cash damages, and huge public trust!'
            },
            {
              label: 'B) Quietly absorb their shaken local advertisers',
              tags: ['+$1,400 Cash', '++Ad Sat', '+Listeners'],
              effects: { cash: 1400, ratings: 2.2, listeners: 900, trust: 3, adSat: 8, fcc: 4, morale: 3 },
              reportLine: 'Ex-WAMM advertisers jumped ship to WSTF following the sabotage scandal.'
            }
          ]
        }
      }
    }
  ];

  /**
   * 10 Rare Run-Defining Special Incidents (4 are in chains above; remaining 6 standalone rare incidents below)
   */
  const SPECIAL_INCIDENTS = [
    {
      id: 'incident_goat_rebellion',
      category: 'SPECIAL INCIDENT',
      icon: '🐐',
      isEmergency: true,
      isSpecialIncident: true,
      incidentTitle: 'The Great Goat Rebellion',
      minYear: 4,
      title: 'THE GREAT GOAT REBELLION!',
      description: 'Seventy-four escaped goats from the County 4-H annex have seized the courthouse lawn, eaten the fire chief\'s hat, and surrounded our transmitter shack!',
      flagGrant: 'sawGoatEvent',
      choices: [
        {
          label: 'A) Broadcast nonstop Goat Rebellion crisis updates from the roof',
          tags: ['+++Listeners', '+++Ratings', '+Trust', '-$1,200 Fence'],
          effects: { cash: -1200, ratings: 6.5, listeners: 2600, trust: 5, adSat: 2, fcc: 2, morale: 6, adPreempt: 0.14 },
          reportLine: 'Rooftop broadcasts during The Great Goat Rebellion turned WSTF into regional folklore.'
        },
        {
          label: 'B) Hire Corporate Goat Retrieval live on air to negotiate terms',
          tags: ['-$2,400 Retrieval', '++Trust', '++Ad Sat', '+Listeners'],
          effects: { cash: -2400, ratings: 4.2, listeners: 1600, trust: 6, adSat: 7, fcc: 3, morale: 4 },
          reportLine: 'Live tactical negotiation ended The Great Goat Rebellion cleanly.'
        },
        {
          label: 'C) Play soothing bluegrass to calm the rebel herd',
          tags: ['$0 Cost', '+Trust', '+Morale', '+Moderate Ratings'],
          effects: { cash: 0, ratings: 3.4, listeners: 1100, trust: 4, adSat: 1, fcc: 2, morale: 5 },
          reportLine: 'Emergency banjo melodies pacified The Great Goat Rebellion before dusk.'
        }
      ]
    },
    {
      id: 'incident_statewide_blackout',
      category: 'SPECIAL INCIDENT • EMERGENCY',
      icon: '🌑',
      isEmergency: true,
      isSpecialIncident: true,
      incidentTitle: 'Statewide Blackout',
      minYear: 5,
      title: 'STATEWIDE BLACKOUT!',
      description: 'The entire regional power grid just collapsed across 18 counties. Cell towers are failing; AM radio is the ONLY surviving voice across the state!',
      choices: [
        {
          label: 'A) Burn every drop of diesel to run 24/7 Statewide Emergency Aid',
          tags: ['++++Listeners', '++++Trust', '+++FCC', '-$2,800 Fuel'],
          effects: { cash: -2800, ratings: 8.0, listeners: 4500, trust: 11, adSat: -2, fcc: 8, morale: 5, adPreempt: 0.25 },
          reportLine: 'During the Statewide Blackout, WSTF became the sole lifeline across eighteen darkened counties.'
        },
        {
          label: 'B) Alternate emergency shelter info with battery & generator sponsors',
          tags: ['+$1,500 Cash', '++Listeners', '+Trust'],
          effects: { cash: 1500, ratings: 4.8, listeners: 2400, trust: 5, adSat: 6, fcc: 3, morale: 2, adPreempt: 0.10 },
          reportLine: 'Balanced Statewide Blackout coverage kept lights flickering and cash reserves intact.'
        },
        {
          label: 'C) Conserve power and sign off until grid restoration',
          tags: ['Save Cash', '---Ratings', '---Listeners', '--Trust'],
          effects: { cash: 300, ratings: -5.5, listeners: -1800, trust: -10, adSat: -8, fcc: -6, morale: -5 },
          reportLine: 'Signing off during the Statewide Blackout squandered a historic broadcast moment.'
        }
      ]
    },
    {
      id: 'incident_hamster_crisis',
      category: 'SPECIAL INCIDENT',
      icon: '🐹',
      isEmergency: false,
      isSpecialIncident: true,
      incidentTitle: 'The Hamster Crisis',
      minYear: 5,
      title: 'THE HAMSTER CRISIS!',
      description: 'An overturned pet-supply semi has released 11,000 Syrian hamsters into the downtown storm drains. They are organizing.',
      choices: [
        {
          label: 'A) Launch continuous "Hamster Watch" with live drain-grate correspondents',
          tags: ['+++Ratings', '+++Listeners', '-$1,000'],
          effects: { cash: -1000, ratings: 6.4, listeners: 2500, trust: 3, adSat: 2, fcc: 0, morale: 6 },
          reportLine: 'Drain-by-drain reporting of The Hamster Crisis broke every afternoon drive record.'
        },
        {
          label: 'B) Coordinate volunteer sunflower-seed trap stations',
          tags: ['-$1,400 Seeds', '++Trust', '++Listeners'],
          effects: { cash: -1400, ratings: 3.8, listeners: 1500, trust: 8, adSat: 4, fcc: 4, morale: 4 },
          reportLine: 'Sunflower-seed containment drive safely ended The Hamster Crisis.'
        },
        {
          label: 'C) Claim the hamsters have formed an alternative municipal treasury',
          tags: ['++Ratings', '--Trust', '--FCC'],
          effects: { cash: 0, ratings: 5.0, listeners: 1700, trust: -7, adSat: -4, fcc: -6, morale: 3 },
          reportLine: 'Covering The Hamster Crisis as a monetary coup drew massive ratings and an FCC frown.'
        }
      ]
    },
    {
      id: 'incident_inflatable_disaster',
      category: 'SPECIAL INCIDENT',
      icon: '🎈',
      isEmergency: false,
      isSpecialIncident: true,
      incidentTitle: 'Inflatable Promotional Disaster',
      minYear: 3,
      title: 'INFLATABLE PROMOTIONAL DISASTER!',
      description: 'Our 45-foot inflatable promotional radio microphone broke its tether during a gust and is currently dragging a Taco Cabana sign toward the interstate.',
      choices: [
        {
          label: 'A) Own it live: turn the rogue inflatable into a county-wide chase contest',
          tags: ['+++Ratings', '++Listeners', '-$1,800 Damages'],
          effects: { cash: -1800, ratings: 6.0, listeners: 2300, trust: 1, adSat: 3, fcc: -2, morale: 6 },
          reportLine: 'Turning the Inflatable Promotional Disaster into a live chase contest earned cult notoriety.'
        },
        {
          label: 'B) Pay full restitution quietly & issue sincere traffic warning',
          tags: ['-$2,900 Restitution', '+Trust', '+FCC'],
          effects: { cash: -2900, ratings: 1.5, listeners: 450, trust: 5, adSat: 3, fcc: 4, morale: -1 },
          reportLine: 'Prompt restitution contained fallout from the Inflatable Promotional Disaster.'
        },
        {
          label: 'C) Blame high-altitude wind shear & deny ownership on air',
          tags: ['$0 Cash', '--Trust', '---Ad Sat', '--FCC'],
          effects: { cash: 0, ratings: 2.2, listeners: 300, trust: -8, adSat: -8, fcc: -6, morale: -4 },
          reportLine: 'Denying ownership of a 45-foot microphone with our logo on it fooled nobody.'
        }
      ]
    },
    {
      id: 'incident_bass_shoplifting',
      category: 'SPECIAL INCIDENT',
      icon: '🏆',
      isEmergency: false,
      isSpecialIncident: true,
      incidentTitle: 'Bass Shoplifting Championship Scandal',
      minYear: 4,
      title: 'BASS SHOPLIFTING CHAMPIONSHIP SCANDAL!',
      description: 'Winners of the Annual County Bass Tournament were caught stuffing frozen supermarket carp inside their prize catch—while our station broadcast live!',
      flagGrant: 'sawFishRain',
      choices: [
        {
          label: 'A) Air the unedited live audio of the fish-scale weigh-in brawl',
          tags: ['++++Ratings', '+++Listeners', '-FCC', '-Some Sponsors'],
          effects: { cash: 500, ratings: 7.2, listeners: 2900, trust: 2, adSat: -4, fcc: -3, morale: 5 },
          reportLine: 'Broadcast of the Bass Shoplifting Championship Scandal became most-requested tape in station history.'
        },
        {
          label: 'B) Host an earnest sports-ethics panel with local anglers',
          tags: ['++Trust', '+FCC', '+Listeners'],
          effects: { cash: -350, ratings: 2.8, listeners: 950, trust: 6, adSat: 3, fcc: 3, morale: 1 },
          reportLine: 'Thoughtful coverage of the Bass Shoplifting Scandal restored integrity to regional angling.'
        },
        {
          label: 'C) Launch a quick Barnaby Bass Removal discount promo during the chaos',
          tags: ['+$2,600 Cash', '++Ad Sat', '-Trust'],
          effects: { cash: 2600, ratings: 3.1, listeners: 800, trust: -4, adSat: 7, fcc: -1, morale: 2 },
          reportLine: 'Flash sponsor spots during the Bass Scandal brought in tidy profit.'
        }
      ]
    },
    {
      id: 'incident_host_shortage',
      category: 'SPECIAL INCIDENT',
      icon: '🎙️',
      isEmergency: false,
      isSpecialIncident: true,
      incidentTitle: 'Emergency Host Shortage',
      minYear: 3,
      title: 'EMERGENCY HOST SHORTAGE!',
      description: 'Bad diner potato salad just benched almost every broadcaster in the tri-county area. Our airwaves are hanging by one microphone cord!',
      choices: [
        {
          label: 'A) Take the mic yourself for a heroic 24-hour Manager Marathon',
          tags: ['++Trust', '+++Morale', '++Ratings', '-$500 Coffee'],
          effects: { cash: -500, ratings: 4.8, listeners: 1750, trust: 6, adSat: 3, fcc: 2, morale: 9 },
          reportLine: 'Manager\'s solo marathon broadcast saved the schedule during the Emergency Host Shortage.'
        },
        {
          label: 'B) Let random callers co-host open-mic "Citizen Radio Day"',
          tags: ['+++Ratings', '++Listeners', '--FCC Risk'],
          effects: { cash: 0, ratings: 5.5, listeners: 2100, trust: -1, adSat: -2, fcc: -7, morale: 3 },
          reportLine: 'Unscreened caller co-hosts produced unforgettable chaos during the Host Shortage.'
        },
        {
          label: 'C) Run automated music tapes & pre-recorded weather loops',
          tags: ['Save Cash', '-Ratings', '-Ad Sat'],
          effects: { cash: 200, ratings: -2.4, listeners: -480, trust: -2, adSat: -5, fcc: 1, morale: -2 },
          reportLine: 'Automated tape loops kept power on through the Emergency Host Shortage.'
        }
      ]
    }
  ];

  /**
   * Host-Driven Interrupt Events (triggered only if the named host is currently hired)
   */
  const HOST_EVENTS = [
    {
      id: 'host_big_earl_late',
      hostId: 'big_earl',
      category: 'HOST INCIDENT • BIG EARL',
      icon: '⏰',
      title: 'Big Earl Nowhere to Be Found 4 Minutes Before Air',
      description: 'Big Earl\'s truck is parked outside the bait shop and his thermos is warm, but Earl himself is chasing an allegedly record-breaking snapping turtle.',
      choices: [
        {
          label: 'A) Patch him in by payphone live from the ditch!',
          tags: ['++Ratings', '+Listeners', '+Morale'],
          effects: { cash: -200, ratings: 3.4, listeners: 780, trust: 0, adSat: 1, fcc: -1, morale: 3 },
          reportLine: 'Big Earl\'s live payphone turtle chase turned his tardiness into ratings gold.'
        },
        {
          label: 'B) Dock his pay & put an intern on backup vinyl',
          tags: ['+$450 Saved', '-Morale', '-Ratings'],
          effects: { cash: 450, ratings: -1.6, listeners: -260, trust: 1, adSat: -1, fcc: 1, morale: -6 },
          reportLine: 'Docking Big Earl\'s pay kept discipline tight, though morale dipped.'
        }
      ]
    },
    {
      id: 'host_carl_geese',
      hostId: 'conspiracy_carl',
      category: 'HOST INCIDENT • CONSPIRACY CARL',
      icon: '🦢',
      title: 'Conspiracy Carl Accuses Migratory Geese of IRS Surveillance',
      description: 'On live open-mic air, Conspiracy Carl has named fourteen specific Canada geese "flying federal wiretaps" and is reading license plates.',
      choices: [
        {
          label: 'A) Let him roll—listeners are eating it up!',
          tags: ['+++Ratings', '++Listeners', '--FCC', '-Ad Sat'],
          effects: { cash: 0, ratings: 4.8, listeners: 1350, trust: -4, adSat: -4, fcc: -8, morale: 2, fccViolation: 1 },
          reportLine: 'Conspiracy Carl received a formal FCC warning after accusing geese of wiretapping.'
        },
        {
          label: 'B) Cut to a 90-second Canoe Insurance spot & pull him into your office',
          tags: ['+FCC', '+Ad Sat', '-Carl Morale'],
          effects: { cash: 250, ratings: -0.8, listeners: -120, trust: 2, adSat: 4, fcc: 2, morale: -4 },
          reportLine: 'Quick dump button stopped Conspiracy Carl before the FCC got involved.'
        }
      ]
    },
    {
      id: 'host_miss_patty_fundraiser',
      hostId: 'miss_patty',
      category: 'HOST INCIDENT • MISS PATTY',
      icon: '🧁',
      title: 'Miss Patty Accidentally Starts a 14-Hour Goat Ambulance Fundraiser',
      description: 'Miss Patty misread a community bulletin and accidentally pledged the station to raise $3,000 for a motorized goat wheelchair by 5 PM.',
      choices: [
        {
          label: 'A) Go all-in and match $800 from station petty cash',
          tags: ['-$800 Cash', '+++Trust', '++Listeners', '+Morale'],
          effects: { cash: -800, ratings: 2.8, listeners: 890, trust: 7, adSat: 4, fcc: 3, morale: 6 },
          reportLine: 'Miss Patty\'s accidental goat-ambulance telethon raised cheers across three counties.'
        },
        {
          label: 'B) Gently correct the flyer on air and return pledges',
          tags: ['+FCC', 'Mild Embarrassment'],
          effects: { cash: 0, ratings: -0.6, listeners: -90, trust: 0, adSat: 0, fcc: 1, morale: -2 },
          reportLine: 'Miss Patty sheepishly walked back the accidental fundraiser announcement.'
        }
      ]
    },
    {
      id: 'host_miss_patty_scandal',
      hostId: 'miss_patty',
      category: 'HOST INCIDENT • MISS PATTY',
      icon: '🎙️',
      title: 'Miss Patty Leaves Hot Mic On During Sheriff Gossip',
      description: 'Thinking we were in commercial break, Miss Patty innocently revealed the County Sheriff\'s secret passion for competitive line dancing.',
      choices: [
        {
          label: 'A) Turn it into an adorable human-interest dance-off segment',
          tags: ['++Ratings', '+Listeners', '+Trust'],
          effects: { cash: -200, ratings: 3.1, listeners: 740, trust: 2, adSat: 2, fcc: 0, morale: 3 },
          reportLine: 'Miss Patty\'s hot-mic sheriff story turned into a beloved Friday dance-off.'
        },
        {
          label: 'B) Issue formal on-air apology and pull the tape',
          tags: ['+FCC', '-Ratings'],
          effects: { cash: 0, ratings: -0.9, listeners: -160, trust: 1, adSat: 1, fcc: 2, morale: -2 },
          reportLine: 'Formal apology smoothed over Miss Patty\'s accidental hot-mic gossip.'
        }
      ]
    },
    {
      id: 'host_dave_celebrity',
      hostId: 'dave_intern',
      category: 'HOST INCIDENT • DAVE THE INTERN',
      icon: '🌟',
      title: 'Dave The Intern Somehow Books Country Legend In Studio',
      description: 'While ordering curly fries on the wrong phone line, Dave accidentally convinced Hall-of-Fame ballad singer Waylon "Gravel" Vance to stop by!',
      choices: [
        {
          label: 'A) Clear the whole afternoon block for an acoustic live session!',
          tags: ['+++Ratings', '+++Listeners', '+++Morale', '-$300 Snacks'],
          effects: { cash: -300, ratings: 5.2, listeners: 1650, trust: 4, adSat: 5, fcc: 2, morale: 8 },
          reportLine: 'Dave The Intern\'s accidental celebrity booking gave the station its best afternoon all year!'
        },
        {
          label: 'B) Record 30 station ID promos with him & rush back to ads',
          tags: ['+$1,400 Promo', '+Ad Sat', '+Ratings'],
          effects: { cash: 1400, ratings: 2.1, listeners: 520, trust: 1, adSat: 6, fcc: 1, morale: 2 },
          reportLine: 'Syndicated promo bumpers cut by Dave\'s mystery guest thrilled sponsors.'
        }
      ]
    },
    {
      id: 'host_dave_saves_transmitter',
      hostId: 'dave_intern',
      category: 'HOST INCIDENT • DAVE THE INTERN',
      icon: '📎',
      title: 'Transmitter Overheats—Dave Fixes It With Foil & Pretzels',
      description: 'Smoke began pouring out of the main tube rack right before evening drive. While engineers panicked, Dave popped open a pretzel bag and went to work.',
      choices: [
        {
          label: 'A) Praise Dave\'s miracle engineering & buy him a real steak dinner',
          tags: ['-$250 Dinner', '++Morale', '+FCC Saved', '+Ratings'],
          effects: { cash: -250, ratings: 1.5, listeners: 280, trust: 2, adSat: 2, fcc: 2, morale: 7 },
          reportLine: 'Dave The Intern accidentally saved the transmitter with vending-machine ingenuity.'
        },
        {
          label: 'B) Quietly call a licensed tech anyway just to be safe',
          tags: ['-$1,100 Tech', '++FCC', '+Trust'],
          effects: { cash: -1100, ratings: 0.4, listeners: 80, trust: 3, adSat: 2, fcc: 4, morale: 1 },
          reportLine: 'Certified technician verified Dave\'s pretzel-clip repair held nominal impedance.'
        }
      ]
    },
    {
      id: 'host_captain_radar_impossible',
      hostId: 'captain_radar',
      category: 'HOST INCIDENT • CAPTAIN RADAR',
      icon: '🌪️',
      title: 'Captain Radar Predicts "Upward Horizontal Fog"',
      description: 'Captain Radar is on the studio chalkboard claiming tomorrow between 2:14 and 2:19 PM, fog will travel sideways and smell like peppermint.',
      choices: [
        {
          label: 'A) Stand behind the Captain with full storm graphics',
          tags: ['++Ratings', '+Listeners', '-Trust Risk'],
          effects: { cash: 0, ratings: 3.4, listeners: 820, trust: -1, adSat: 1, fcc: -1, morale: 4 },
          reportLine: 'Captain Radar\'s impossible peppermint-fog forecast captivated curious commuters.'
        },
        {
          label: 'B) Add a playful disclaimer ("Entertainment Forecast")',
          tags: ['+Trust', '+Ad Sat', '+Moderate Ratings'],
          effects: { cash: 0, ratings: 1.5, listeners: 320, trust: 2, adSat: 2, fcc: 1, morale: 0 },
          reportLine: 'Entertainment disclaimer let Captain Radar stay eccentric without spooking sponsors.'
        }
      ]
    },
    {
      id: 'host_sheryl_live_audit',
      hostId: 'sheryl_accounting',
      category: 'HOST INCIDENT • SHERYL',
      icon: '🧾',
      title: 'Sheryl Audits Local Listeners\' Utility Deductions On Air',
      description: 'Left unattended in the booth, Sheryl started reading IRS mileage depreciation tables in monotone.',
      choices: [
        {
          label: 'A) Let her finish—somehow five CPA firms just called to buy ads',
          tags: ['+$1,350 Ad Bonus', '+Ad Sat', '--Ratings'],
          effects: { cash: 1350, ratings: -1.8, listeners: -340, trust: 2, adSat: 5, fcc: 2, morale: -1 },
          reportLine: 'Sheryl\'s live tax-table reading bored commuters senseless yet hooked CPA sponsors.'
        },
        {
          label: 'B) Cut to classic country immediately',
          tags: ['Preserve Ratings', '-Sheryl Morale'],
          effects: { cash: 0, ratings: 0.5, listeners: 80, trust: 0, adSat: 0, fcc: 0, morale: -3 },
          reportLine: 'Bumped Sheryl back to her desk before listeners dozed off at intersections.'
        }
      ]
    },
    {
      id: 'host_raise_demand',
      hostId: null, // picks any hired host dynamically
      category: 'STAFF DEVELOPMENT',
      icon: '💵',
      title: 'Star Host Demands Contract Raise',
      description: '{HOST_NAME} marches into your office waving a rival station offer and demanding a $300/month pay bump.',
      choices: [
        {
          label: 'A) Grant the $300/mo raise & keep morale soaring',
          tags: ['+$300/mo Salary', '++Morale', '+Popularity'],
          effects: { cash: -300, ratings: 1.4, listeners: 220, trust: 0, adSat: 1, fcc: 0, morale: 6, hostRaise: 300, hostPop: 4 },
          reportLine: 'Approved a contract extension for {HOST_NAME}, cementing booth loyalty.'
        },
        {
          label: 'B) Counter with free diner meal vouchers & a $100 raise',
          tags: ['+$100/mo Salary', 'Balanced'],
          effects: { cash: -100, ratings: 0.4, listeners: 50, trust: 0, adSat: 0, fcc: 0, morale: 1, hostRaise: 100 },
          reportLine: 'Compromised on a modest raise plus diner vouchers with {HOST_NAME}.'
        },
        {
          label: 'C) Refuse outright ("Budget is tight")',
          tags: ['Save Salary', '--Morale'],
          effects: { cash: 0, ratings: -0.6, listeners: -100, trust: 0, adSat: 0, fcc: 0, morale: -8 },
          reportLine: 'Turned down {HOST_NAME}\'s raise request, leaving frost in the hallway.'
        }
      ]
    },
    {
      id: 'host_poach_attempt',
      hostId: null,
      category: 'STAFF POACHING ALERT',
      icon: '🦅',
      title: 'Big-City Station Tries to Poach {HOST_NAME}',
      description: 'A slick 100,000-watt station in the state capital is courting {HOST_NAME} with brushed-steel headphones and dental coverage.',
      choices: [
        {
          label: 'A) Pay $1,400 retention bonus + prime billing',
          tags: ['-$1,400 Cash', 'Keep Host', '+Popularity', '+Morale'],
          effects: { cash: -1400, ratings: 1.8, listeners: 380, trust: 1, adSat: 2, fcc: 0, morale: 6, hostPop: 5 },
          reportLine: 'Fended off a metro poaching raid to retain {HOST_NAME}.'
        },
        {
          label: 'B) Appeal to hometown pride & promise creative freedom',
          tags: ['$0 Cash', '50/50 Loyalty Check'],
          effects: { cash: 0, ratings: 0.6, listeners: 100, trust: 2, adSat: 0, fcc: 0, morale: -2, hostLeaveRisk: 0.35 },
          reportLine: 'Pitched hometown pride to keep {HOST_NAME} off big-city airwaves.'
        }
      ]
    }
  ];

  const ACHIEVEMENTS = [
    { id: 'first_year', name: 'Survive Year 1', desc: 'Complete 12 months on the air without going broke.' },
    { id: 'listeners_5k', name: 'Regional Voice', desc: 'Reach 5,000 active listeners.' },
    { id: 'listeners_25k', name: 'Statewide Sensation', desc: 'Reach 25,000 active listeners.' },
    { id: 'listeners_100k', name: 'AM Titan', desc: 'Reach 100,000 active listeners.' },
    { id: 'cash_100k', name: 'Deep Pockets', desc: 'Hold $100,000 in station cash.' },
    { id: 'value_1m', name: 'Million-Dollar Signal', desc: 'Push Station Value past $1,000,000.' },
    { id: 'full_staff', name: 'Crowded Booth', desc: 'Employ 4 or more hosts simultaneously.' },
    { id: 'upgrade_half', name: 'Engineering Marvel', desc: 'Own at least 6 station upgrades.' },
    { id: 'fish_witness', name: 'Ichthyological Witness', desc: 'Survive Actual Fish Rain on the air.' },
    { id: 'fcc_survivor', name: 'Teflon Broadcaster', desc: 'Survive 5 or more FCC violations.' },
    { id: 'year_15', name: 'Broadcast Veteran', desc: 'Reach Year 15 in one career.' },
    { id: 'year_25', name: '25-Year Legend', desc: 'Complete the full 300-month career to retirement.' }
  ];

  const SEED_LEADERBOARD = [
    { rank: 1, manager_name: 'Evelyn Vance', station_name: 'WSTF 1120 AM', score: 184200, years_survived: 25, months_survived: 300, peak_listeners: 148500, peak_ratings: 62.4, station_value: 3450000, fcc_violations: 4, career_result: 'Retired Legend', date_completed: '2026-01-12' },
    { rank: 2, manager_name: 'Big Tony', station_name: 'WKRAK 1470 AM', score: 142900, years_survived: 21, months_survived: 254, peak_listeners: 196200, peak_ratings: 71.8, station_value: 2890000, fcc_violations: 19, career_result: 'Early Retirement', date_completed: '2026-02-04' },
    { rank: 3, manager_name: 'Mabel Jenkins', station_name: 'Radio Chicken 900 AM', score: 118500, years_survived: 25, months_survived: 300, peak_listeners: 92400, peak_ratings: 48.5, station_value: 4120000, fcc_violations: 2, career_result: 'Retired Legend', date_completed: '2026-02-19' },
    { rank: 4, manager_name: 'Carl Sr.', station_name: 'WTON 980 AM', score: 89400, years_survived: 14, months_survived: 172, peak_listeners: 112000, peak_ratings: 58.2, station_value: 1420000, fcc_violations: 27, career_result: 'FCC Disaster', date_completed: '2026-03-08' },
    { rank: 5, manager_name: 'Barnaby', station_name: 'WBAS 1290 AM', score: 64800, years_survived: 11, months_survived: 134, peak_listeners: 68400, peak_ratings: 41.0, station_value: 960000, fcc_violations: 6, career_result: 'Early Retirement', date_completed: '2026-04-02' },
    { rank: 6, manager_name: 'Dave (Former Intern)', station_name: 'WSTF 1120 AM', score: 31200, years_survived: 6, months_survived: 75, peak_listeners: 24100, peak_ratings: 29.4, station_value: 410000, fcc_violations: 1, career_result: 'Goat Rebellion', date_completed: '2026-05-14' }
  ];

  const ALL_GENERIC_INTERRUPTS = INTERRUPT_EVENTS.concat(EXP.GENERIC_INTERRUPTS || []);
  const ALL_WEATHER_EVENTS = EXP.WEATHER_EMERGENCY_EVENTS || [];
  const ALL_INDUSTRY_EVENTS = EXP.INDUSTRY_EVENTS || [];
  const ALL_ADVERTISER_EVENTS = EXP.ADVERTISER_EVENTS || [];
  const ALL_HOST_EVENTS = HOST_EVENTS.concat(EXP.HOST_EVENTS || []);
  const ALL_EVENT_CHAINS = EVENT_CHAINS.concat(EXP.MULTI_CHAINS || []);

  const dataExport = {
    MONTHS,
    STATION_PRESETS,
    TIME_BLOCKS,
    SHOWS,
    HOSTS,
    ADVERTISERS,
    UPGRADES,
    RIVAL_STATIONS,
    INDUSTRY_ERAS,
    EXPANSION_TIERS,
    EXECUTIVE_PROJECTS,
    STRATEGIES,
    COMMERCIAL_LOADS,
    INTERRUPT_EVENTS: ALL_GENERIC_INTERRUPTS,
    WEATHER_EMERGENCY_EVENTS: ALL_WEATHER_EVENTS,
    INDUSTRY_EVENTS: ALL_INDUSTRY_EVENTS,
    ADVERTISER_EVENTS: ALL_ADVERTISER_EVENTS,
    EVENT_CHAINS: ALL_EVENT_CHAINS,
    SPECIAL_INCIDENTS,
    HOST_EVENTS: ALL_HOST_EVENTS,
    ACHIEVEMENTS,
    SEED_LEADERBOARD
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataExport;
  } else {
    root.AMRT_DATA = dataExport;
  }
})(typeof window !== 'undefined' ? window : globalThis);
