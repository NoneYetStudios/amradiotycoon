/**
 * AM RADIO TYCOON — Core Simulation Engine v2
 * Includes Competing AI Rivals, Industry Eras, Audience Trends, Show Fatigue,
 * Host Loyalty & Contracts, Advertiser Contracts, Regional Expansion Tiers,
 * Money Sinks, Diminishing Returns, Persistent Consequences, and Save Migration.
 */
(function (root) {
  'use strict';

  const DATA = (typeof module !== 'undefined' && module.exports) ? require('./data.js') : root.AMRT_DATA;
  const SAVE_KEY = 'amrt_career_save_v1';
  const LOCAL_BOARD_KEY = 'amrt_local_leaderboard_v1';
  const MAX_MONTHS = 300;
  const START_YEAR = 1994;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function byId(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function formatMoney(n) {
    const val = Math.round(n);
    const abs = Math.abs(val).toLocaleString('en-US');
    return val < 0 ? '-$' + abs : '$' + abs;
  }

  function formatSigned(n, isMoney) {
    const val = Math.round(n);
    if (isMoney) {
      return val >= 0 ? '+$' + val.toLocaleString('en-US') : '-$' + Math.abs(val).toLocaleString('en-US');
    }
    return val >= 0 ? '+' + val.toLocaleString('en-US') : val.toLocaleString('en-US');
  }

  function getCalendarLabel(yearIndex, monthIndex) {
    const calYear = START_YEAR + (yearIndex - 1);
    const monthName = DATA.MONTHS[(monthIndex - 1) % 12];
    return monthName + ' ' + calYear;
  }

  function getCurrentEra(year) {
    const list = DATA.INDUSTRY_ERAS || [];
    for (let i = 0; i < list.length; i++) {
      if (year >= list[i].minYear && year <= list[i].maxYear) return list[i];
    }
    return list[list.length - 1] || { id: 'era_default', name: 'Modern Era', salaryInflation: 1.0, fccStrictness: 1.0, categoryMods: {} };
  }

  function getExpansionTierObj(tierNum) {
    const tiers = DATA.EXPANSION_TIERS || [];
    for (let i = 0; i < tiers.length; i++) {
      if (tiers[i].tier === tierNum) return tiers[i];
    }
    return tiers[0] || { tier: 1, name: 'County Coverage', cost: 0, monthlyUpkeep: 0, minCoverage: 16, maxListenersCap: 7500, adTierMult: 1.0, eventScale: 1.0 };
  }

  function getCareerScale(state) {
    const tierObj = getExpansionTierObj(state.expansionTier || 1);
    const cashScale = 1 + (tierObj.eventScale - 1) * 0.90 + (state.year - 1) * 0.12;
    const listenerScale = Math.max(1, 1 + (state.listeners / 6000) * 0.55);
    return {
      cashScale: Math.min(16, Math.max(1, cashScale)),
      listenerScale: Math.min(20, Math.max(1, listenerScale))
    };
  }

  function createInitialRivalStates() {
    const map = {};
    (DATA.RIVAL_STATIONS || []).forEach(function (r) {
      map[r.id] = {
        id: r.id,
        active: r.minYear <= 1,
        listeners: r.baseListeners,
        ratings: r.baseRatings,
        poachedHosts: [],
        stolenSponsors: 0,
        lastHeadline: ''
      };
    });
    return map;
  }

  function generateAudienceTrend(rng) {
    const rand = rng || Math.random;
    const cats = ['news', 'community', 'fish', 'sports', 'music', 'weather', 'finance', 'talk', 'conspiracy', 'safety', 'absurd_civic', 'absurd_nature'];
    const pool = cats.slice();
    function pull() {
      const idx = Math.floor(rand() * pool.length);
      return pool.splice(idx, 1)[0];
    }
    const demos = ['Older Heritage Listeners', 'Younger Commuters & Night Owls', 'Balanced Tri-County Mix'];
    return {
      hotCategories: [pull(), pull()],
      coldCategories: [pull(), pull()],
      demographicFocus: demos[Math.floor(rand() * demos.length)],
      monthsLeft: 8 + Math.floor(rand() * 5)
    };
  }

  function applyDiminishingGain(currentVal, delta) {
    if (delta <= 0) return delta;
    // Step point-by-point so large single spikes cannot blow straight through 90 -> 100
    let cur = currentVal;
    let remaining = delta;
    while (remaining > 0.01) {
      const step = Math.min(1, remaining);
      let mult = 1.0;
      if (cur >= 92) mult = 0.12;
      else if (cur >= 84) mult = 0.28;
      else if (cur >= 72) mult = 0.55;
      cur = Math.min(100, cur + step * mult);
      remaining -= step;
    }
    return cur - currentVal;
  }

  function highStatGravity(val) {
    if (val >= 94) return -4.5;
    if (val >= 88) return -2.8;
    if (val >= 78) return -1.3;
    return 0;
  }

  /**
   * Migrates any legacy localStorage save to v2 schema seamlessly
   */
  function migrateSaveState(state) {
    if (!state) return null;
    if (!state.expansionTier) state.expansionTier = 1;
    if (typeof state.strategyMonthsActive !== 'number') state.strategyMonthsActive = 0;
    if (!state.showFatigue) state.showFatigue = {};
    if (!state.audienceTrend) state.audienceTrend = generateAudienceTrend();
    if (!state.rivalStates) state.rivalStates = createInitialRivalStates();
    if (!state.departedHosts) state.departedHosts = {};
    if (!state.activeConsequences) state.activeConsequences = [];
    if (!state.historyFlags) state.historyFlags = {};
    if (!state.recentChainIds) state.recentChainIds = [];
    if (!state.recentEventIds) state.recentEventIds = [];
    if (!state.advertiserContracts) state.advertiserContracts = {};

    DATA.HOSTS.forEach(function (h) {
      if (!state.hostStats[h.id]) {
        state.hostStats[h.id] = {
          popularity: h.popularity,
          reliability: h.reliability,
          salary: h.salary,
          morale: 75,
          loyalty: 78,
          contractMonthsLeft: 14,
          statusTier: 'Regular',
          monthsEmployed: 0,
          famePoints: 0
        };
      } else {
        const hs = state.hostStats[h.id];
        if (typeof hs.loyalty !== 'number') hs.loyalty = 78;
        if (typeof hs.contractMonthsLeft !== 'number') hs.contractMonthsLeft = 14;
        if (!hs.statusTier) hs.statusTier = hs.popularity >= 85 ? 'Local Star' : 'Regular';
      }
    });

    (state.activeAdvertiserIds || []).forEach(function (aid) {
      if (!state.advertiserContracts[aid]) {
        state.advertiserContracts[aid] = {
          monthsLeft: 8 + Math.floor(Math.random() * 5),
          satisfaction: clamp(state.advertiserSatisfaction || 72, 40, 95),
          rateMult: 1.0
        };
      }
    });

    state.version = 2;
    return state;
  }

  function createNewCareer(managerName, stationName) {
    const cleanMgr = String(managerName || '').trim().slice(0, 32) || 'Station Manager';
    const cleanStation = String(stationName || '').trim().slice(0, 40) || 'WSTF 1120 AM';

    const hostStats = {};
    DATA.HOSTS.forEach(function (h) {
      hostStats[h.id] = {
        popularity: h.popularity,
        reliability: h.reliability,
        salary: h.salary,
        morale: 76,
        loyalty: 80,
        contractMonthsLeft: 14,
        statusTier: h.popularity >= 85 ? 'Local Star' : 'Regular',
        monthsEmployed: h.starter ? 1 : 0,
        famePoints: 0
      };
    });

    const state = {
      version: 2,
      managerName: cleanMgr,
      stationName: cleanStation,
      turn: 1,
      monthsCompleted: 0,
      year: 1,
      month: 1,
      cash: 18000,
      listeners: 900,
      peakListeners: 900,
      ratings: 14.0,
      peakRatings: 14.0,
      signalCoverage: 16,
      expansionTier: 1,
      stationValue: 45000,
      peakStationValue: 45000,
      advertiserSatisfaction: 72,
      publicTrust: 65,
      fccStanding: 85,
      fccViolations: 0,
      employeeMorale: 76,
      schedule: {
        morning: { showId: 'local_news', hostId: 'dave_intern' },
        afternoon: { showId: 'swap_shop', hostId: null },
        evening: { showId: 'county_sports', hostId: null },
        latenight: { showId: 'oldies', hostId: null }
      },
      hiredHostIds: ['dave_intern'],
      hostStats: hostStats,
      departedHosts: {},
      activeAdvertiserIds: ['honest_bob_canoe', 'mabel_taxidermy'],
      advertiserContracts: {
        honest_bob_canoe: { monthsLeft: 9, satisfaction: 78, rateMult: 1.0 },
        mabel_taxidermy: { monthsLeft: 11, satisfaction: 80, rateMult: 1.0 }
      },
      advertiserRevenueMap: {
        honest_bob_canoe: 0,
        mabel_taxidermy: 0
      },
      showUsageMap: {},
      showFatigue: {},
      upgradeIds: [],
      strategyId: 'balanced',
      strategyMonthsActive: 0,
      commercialLoadId: 'balanced',
      audienceTrend: generateAudienceTrend(),
      rivalStates: createInitialRivalStates(),
      activeConsequences: [],
      historyFlags: {},
      majorEventsExperienced: [],
      achievements: [],
      recentEventIds: [],
      recentChainIds: [],
      flags: {
        sawFishRain: false,
        sawGoatEvent: false
      },
      consecutiveNegativeCash: 0,
      consecutiveLowRatings: 0,
      consecutiveOwnerCrisis: 0,
      lastMonthDeltas: {
        cash: 0, listeners: 0, ratings: 0, stationValue: 0,
        signalCoverage: 0, adSat: 0, trust: 0, fcc: 0, morale: 0
      },
      lastReport: null,
      careerLog: [
        'January 1994: ' + cleanMgr + ' took command of ' + cleanStation + ' ("The Voice of Somewhere").'
      ],
      isEnded: false,
      careerResult: null,
      endingSummary: null
    };

    saveCareer(state);
    return state;
  }

  function saveCareer(state) {
    if (typeof localStorage === 'undefined') return false;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadCareer() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.managerName || !parsed.stationName) return null;
      return migrateSaveState(parsed);
    } catch (e) {
      return null;
    }
  }

  function clearSavedCareer() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {}
  }

  function getUnlockedShows(state) {
    return DATA.SHOWS.filter(function (show) {
      if (show.starter) return true;
      if (typeof show.unlockCheck === 'function') {
        return show.unlockCheck(state);
      }
      return false;
    });
  }

  function isShowUnlocked(state, showId) {
    const show = byId(DATA.SHOWS, showId);
    if (!show) return false;
    if (show.starter) return true;
    return typeof show.unlockCheck === 'function' ? show.unlockCheck(state) : false;
  }

  function getMaxAdvertiserSlots(state) {
    let slots = 3;
    state.upgradeIds.forEach(function (uid) {
      const upg = byId(DATA.UPGRADES, uid);
      if (upg && upg.adSlotsBonus) slots += upg.adSlotsBonus;
    });
    return slots;
  }

  function getMaxAudienceCapacity(state) {
    const tierObj = getExpansionTierObj(state.expansionTier || 1);
    const cov = clamp(state.signalCoverage, 10, 100);
    return Math.round(tierObj.maxListenersCap * (0.52 + (cov / 100) * 0.55));
  }

  function getConsequenceModifiers(state) {
    const mods = { trustMod: 0, fccMod: 0, adSatMod: 0, moraleMod: 0, cashPerMonth: 0, ratingsMult: 1.0 };
    (state.activeConsequences || []).forEach(function (c) {
      mods.trustMod += c.trustMod || 0;
      mods.fccMod += c.fccMod || 0;
      mods.adSatMod += c.adSatMod || 0;
      mods.moraleMod += c.moraleMod || 0;
      mods.cashPerMonth += c.cashPerMonth || 0;
      if (c.ratingsMult) mods.ratingsMult *= c.ratingsMult;
    });
    return mods;
  }

  function evaluateBlockPerformance(state, blockId) {
    const slot = state.schedule[blockId];
    const block = byId(DATA.TIME_BLOCKS, blockId);
    if (!slot || !block) {
      return { ratingContribution: 0, trustContribution: 0, fccRisk: 0, controversy: 0, cost: 0, synergy: false, fatigue: 0, trendTag: 'Normal', eraMult: 1.0 };
    }
    const show = byId(DATA.SHOWS, slot.showId) || DATA.SHOWS[0];
    const host = slot.hostId && state.hiredHostIds.indexOf(slot.hostId) !== -1 ? byId(DATA.HOSTS, slot.hostId) : null;
    const hostStat = host ? (state.hostStats[host.id] || host) : null;

    const era = getCurrentEra(state.year);
    const eraMult = (era.categoryMods && era.categoryMods[show.category]) ? era.categoryMods[show.category] : 1.0;

    const trend = state.audienceTrend || { hotCategories: [], coldCategories: [] };
    let trendMult = 1.0;
    let trendTag = 'Normal';
    if (trend.hotCategories.indexOf(show.category) !== -1) {
      trendMult = 1.26;
      trendTag = 'HOT';
    } else if (trend.coldCategories.indexOf(show.category) !== -1) {
      trendMult = 0.78;
      trendTag = 'COLD';
    }

    const fatigue = (state.showFatigue && state.showFatigue[show.id]) || 0;
    const fatigueMult = 1 - Math.min(0.38, fatigue * 0.004);

    // FM penalty on un-upgraded AM music blocks from Year 3 onward
    let fmMusicPenalty = 1.0;
    if (state.year >= 3 && show.category === 'music' && state.upgradeIds.indexOf('studio_renovation') === -1) {
      fmMusicPenalty = 0.85;
    }

    const synergy = show.bestSlots.indexOf(blockId) !== -1;
    let rating = show.baseRatings * (synergy ? 1.18 : 0.86) * block.weight * eraMult * trendMult * fatigueMult * fmMusicPenalty;
    let controversy = show.controversy;
    let fccRisk = show.fccRisk;
    let trustContribution = show.trustDelta;

    if (host && hostStat) {
      const pop = hostStat.popularity || host.popularity;
      let hostMult = 0.72 + (pop / 100) * 0.62;
      if (host.preferredShows.indexOf(show.id) !== -1) hostMult += 0.22;
      if (host.id === 'big_earl') hostMult += 0.24;
      if (host.id === 'sheryl_accounting') hostMult *= 0.62;
      if (host.id === 'captain_radar' && show.category === 'weather') hostMult += 0.34;
      if (host.id === 'mad_dog' && (show.id === 'county_sports' || show.id === 'competitive_parking')) hostMult += 0.28;
      if (host.id === 'prof_barnaby' && show.category === 'fish') hostMult += 0.34;
      if (host.id === 'velvet_vance' && blockId === 'latenight') hostMult += 0.28;

      rating *= hostMult;
      controversy = Math.round(controversy * 0.6 + host.controversy * 0.5);
      if (host.id === 'conspiracy_carl') fccRisk += 9;
    } else {
      rating *= 0.60;
    }

    return {
      show: show,
      host: host,
      synergy: synergy,
      ratingContribution: rating,
      trustContribution: trustContribution,
      fccRisk: fccRisk,
      controversy: controversy,
      cost: Math.round(show.costPerMonth * (1 + (state.expansionTier - 1) * 0.28)),
      fatigue: fatigue,
      trendTag: trendTag,
      eraMult: eraMult
    };
  }

  function getActiveRivals(state) {
    return (DATA.RIVAL_STATIONS || []).filter(function (r) {
      return state.year >= r.minYear;
    }).map(function (r) {
      const rs = (state.rivalStates && state.rivalStates[r.id]) || { listeners: r.baseListeners, ratings: r.baseRatings, poachedHosts: [], stolenSponsors: 0, lastHeadline: '' };
      return Object.assign({}, r, rs);
    });
  }

  function calculateMonthlyProjection(state) {
    const strategy = byId(DATA.STRATEGIES, state.strategyId) || DATA.STRATEGIES[0];
    const commLoad = byId(DATA.COMMERCIAL_LOADS, state.commercialLoadId) || DATA.COMMERCIAL_LOADS[1];
    const tierObj = getExpansionTierObj(state.expansionTier || 1);
    const era = getCurrentEra(state.year);
    const cons = getConsequenceModifiers(state);

    let totalRatingsRaw = 0;
    let totalControversy = 0;
    let showCosts = 0;
    let avgTrustDelta = 0;
    let totalFccRisk = 0;

    DATA.TIME_BLOCKS.forEach(function (blk) {
      const perf = evaluateBlockPerformance(state, blk.id);
      totalRatingsRaw += perf.ratingContribution;
      totalControversy += perf.controversy;
      showCosts += perf.cost;
      avgTrustDelta += perf.trustContribution;
      totalFccRisk += perf.fccRisk;
    });

    totalControversy = clamp(Math.round(totalControversy / 4) + (strategy.controversyBonus || 0), 0, 100);

    let upgradeRatings = 0;
    let upgradeMaint = 0;
    let upgradeTrust = 0;
    let upgradesValue = 0;
    state.upgradeIds.forEach(function (uid) {
      const upg = byId(DATA.UPGRADES, uid);
      if (upg) {
        upgradeRatings += upg.ratingsBonus;
        upgradeMaint += upg.maintenance;
        upgradeTrust += upg.trustBonus;
        upgradesValue += upg.cost;
      }
    });

    // Sensational burnout degrades ratings upside if left active > 4 months continuously
    let stratRatingsMult = strategy.ratingsMult;
    if (state.strategyId === 'sensational' && (state.strategyMonthsActive || 0) > 4) {
      const burnout = Math.min(0.28, (state.strategyMonthsActive - 4) * 0.025);
      stratRatingsMult = Math.max(0.92, stratRatingsMult - burnout);
    }

    // Rival pressure reduces peak share slightly when competitors are strong
    const activeRivals = getActiveRivals(state);
    const avgRivalRating = activeRivals.length
      ? activeRivals.reduce(function (acc, r) { return acc + r.ratings; }, 0) / activeRivals.length
      : 15;
    const rivalDrag = clamp(0.86 + (state.ratings - avgRivalRating) * 0.004, 0.80, 1.06);

    const moraleFactor = 0.76 + (state.employeeMorale / 100) * 0.34;
    const trustFactor = 0.80 + (state.publicTrust / 100) * 0.28;

    let rawTarget = (((totalRatingsRaw / 4) * 1.08 + upgradeRatings * 0.85 + commLoad.ratingsBonus) *
      stratRatingsMult * moraleFactor * trustFactor * rivalDrag * cons.ratingsMult);

    // Diminishing returns curve above 55% ratings
    if (rawTarget > 55) {
      rawTarget = 55 + (rawTarget - 55) * 0.55;
    }
    const targetRatings = Math.round(clamp(rawTarget, 2.0, 92.0) * 10) / 10;

    // Advertiser revenue scaled by tier + contract satisfaction (smooth 0.62 curve avoids $200M late-game runaway)
    const adSatFactor = 0.62 + (state.advertiserSatisfaction / 100) * 0.52;
    let adRevenue = 0;
    const adBreakdown = [];
    state.activeAdvertiserIds.forEach(function (aid) {
      const adv = byId(DATA.ADVERTISERS, aid);
      if (!adv) return;
      const contract = (state.advertiserContracts && state.advertiserContracts[aid]) || { rateMult: 1.0, satisfaction: 72 };
      const effListeners = state.listeners <= 35000
        ? state.listeners
        : 35000 + Math.pow(state.listeners - 35000, 0.75) * 6;
      const listenerScale = Math.pow(Math.max(100, effListeners), 0.68) * adv.listenerFactor * 2.50;
      const ratingScale = 0.74 + (state.ratings / 56);
      const payout = Math.round((adv.basePayout + listenerScale) * ratingScale * commLoad.adRevenueMult * strategy.adMult * adSatFactor * tierObj.adTierMult * (contract.rateMult || 1.0));
      adRevenue += payout;
      adBreakdown.push({ id: adv.id, name: adv.name, payout: payout });
    });

    // Salaries & era inflation
    let salaries = 0;
    state.hiredHostIds.forEach(function (hid) {
      const hs = state.hostStats[hid];
      const h = byId(DATA.HOSTS, hid);
      if (h) salaries += hs ? hs.salary : h.salary;
    });

    const baseOverhead = 480 + Math.round((state.year - 1) * 75) + Math.round(state.signalCoverage * 14) + Math.round(state.listeners * 0.032) + tierObj.monthlyUpkeep;
    const hasSheryl = state.hiredHostIds.indexOf('sheryl_accounting') !== -1;
    const sherylDiscount = hasSheryl ? 0.90 : 1.0;
    const legalSavings = Math.max(0, -cons.cashPerMonth);

    const totalExpenses = Math.round((baseOverhead + salaries + showCosts + upgradeMaint) * strategy.expenseMult * sherylDiscount) + legalSavings;

    return {
      targetRatings: targetRatings,
      avgControversy: totalControversy,
      totalFccRisk: totalFccRisk,
      avgTrustDelta: (avgTrustDelta / 4) + upgradeTrust * 0.30 + strategy.trustMod + commLoad.trustMod + cons.trustMod,
      adRevenue: adRevenue,
      adBreakdown: adBreakdown,
      salaries: salaries,
      showCosts: showCosts,
      upgradeMaint: upgradeMaint,
      baseOverhead: baseOverhead,
      legalDrain: legalSavings,
      sherylDiscountApplied: hasSheryl,
      totalExpenses: totalExpenses,
      netProjected: adRevenue - totalExpenses + Math.max(0, cons.cashPerMonth),
      upgradesValue: upgradesValue,
      maxListeners: getMaxAudienceCapacity(state),
      era: era,
      tierObj: tierObj,
      strategyBurnoutPenalty: (state.strategyId === 'sensational' && state.strategyMonthsActive > 4)
    };
  }

  /* =========================================================
     PLAYER MANAGEMENT ACTIONS
     ========================================================= */
  function assignSlot(state, blockId, showId, hostId) {
    if (!state.schedule[blockId]) return { ok: false, error: 'Invalid time block.' };
    if (showId && !isShowUnlocked(state, showId)) {
      return { ok: false, error: 'That show is not unlocked yet.' };
    }
    if (hostId && state.hiredHostIds.indexOf(hostId) === -1) {
      return { ok: false, error: 'You must hire that host first.' };
    }
    state.schedule[blockId].showId = showId || state.schedule[blockId].showId;
    state.schedule[blockId].hostId = hostId === undefined ? state.schedule[blockId].hostId : (hostId || null);
    saveCareer(state);
    return { ok: true };
  }

  function hireHost(state, hostId) {
    const host = byId(DATA.HOSTS, hostId);
    if (!host) return { ok: false, error: 'Host not found.' };
    if (state.hiredHostIds.indexOf(hostId) !== -1) return { ok: false, error: 'Already on staff.' };
    if (state.departedHosts && state.departedHosts[hostId]) {
      const dep = state.departedHosts[hostId];
      if ((state.monthsCompleted - dep.monthLeft) < 24) {
        return { ok: false, error: host.name + ' signed a non-compete with ' + dep.rivalName + ' (' + (24 - (state.monthsCompleted - dep.monthLeft)) + ' mos left).' };
      }
    }

    const era = getCurrentEra(state.year);
    const hireCost = Math.round(host.hireCost * era.salaryInflation * (1 + (state.expansionTier - 1) * 0.35));
    const startSalary = Math.round(host.salary * era.salaryInflation * (1 + (state.expansionTier - 1) * 0.25));

    if (state.cash < hireCost) return { ok: false, error: 'Need ' + formatMoney(hireCost) + ' signing bonus.' };

    state.cash -= hireCost;
    state.hiredHostIds.push(hostId);
    if (state.departedHosts && state.departedHosts[hostId]) delete state.departedHosts[hostId];

    state.hostStats[hostId] = {
      popularity: host.popularity,
      reliability: host.reliability,
      salary: startSalary,
      morale: 80,
      loyalty: 82,
      contractMonthsLeft: 14,
      statusTier: host.popularity >= 85 ? 'Local Star' : 'Regular',
      monthsEmployed: 1,
      famePoints: 0
    };
    state.employeeMorale = clamp(state.employeeMorale + 2, 0, 100);
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': Hired ' + host.name + ' (' + formatMoney(startSalary) + '/mo).');
    saveCareer(state);
    return { ok: true, host: host };
  }

  function fireHost(state, hostId) {
    if (state.hiredHostIds.length <= 1) {
      return { ok: false, error: 'You must keep at least one staff member to run the board.' };
    }
    const idx = state.hiredHostIds.indexOf(hostId);
    if (idx === -1) return { ok: false, error: 'Host not employed.' };
    const host = byId(DATA.HOSTS, hostId);
    state.hiredHostIds.splice(idx, 1);
    Object.keys(state.schedule).forEach(function (blk) {
      if (state.schedule[blk].hostId === hostId) state.schedule[blk].hostId = null;
    });
    state.employeeMorale = clamp(state.employeeMorale - 8, 0, 100);
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': Released ' + (host ? host.name : hostId) + '.');
    saveCareer(state);
    return { ok: true };
  }

  function giveHostBonus(state, hostId) {
    const host = byId(DATA.HOSTS, hostId);
    const hs = state.hostStats[hostId];
    if (!host || !hs) return { ok: false, error: 'Host not found.' };
    const cost = Math.round(450 * getCareerScale(state).cashScale);
    if (state.cash < cost) return { ok: false, error: 'Need ' + formatMoney(cost) + ' for a retention bonus.' };
    state.cash -= cost;
    hs.morale = clamp((hs.morale || 70) + 14, 0, 100);
    hs.loyalty = clamp((hs.loyalty || 70) + 12, 0, 100);
    hs.popularity = clamp((hs.popularity || host.popularity) + 1, 1, 100);
    state.employeeMorale = clamp(state.employeeMorale + 4, 0, 100);
    saveCareer(state);
    return { ok: true, cost: cost };
  }

  function renewHostContract(state, hostId) {
    const host = byId(DATA.HOSTS, hostId);
    const hs = state.hostStats[hostId];
    if (!host || !hs) return { ok: false, error: 'Host not found.' };
    const renewalBonus = Math.round((hs.salary * 0.6) + (hs.popularity >= 85 ? 800 : 250));
    if (state.cash < renewalBonus) return { ok: false, error: 'Need ' + formatMoney(renewalBonus) + ' signing bonus.' };
    const raisePct = hs.popularity >= 88 ? 0.16 : 0.10;
    state.cash -= renewalBonus;
    hs.salary = Math.round(hs.salary * (1 + raisePct));
    hs.contractMonthsLeft = 18;
    hs.loyalty = clamp((hs.loyalty || 70) + 18, 0, 100);
    hs.morale = clamp((hs.morale || 75) + 10, 0, 100);
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': Renewed ' + host.name + '\'s contract for 18 months at ' + formatMoney(hs.salary) + '/mo.');
    saveCareer(state);
    return { ok: true, bonus: renewalBonus, newSalary: hs.salary };
  }

  function signAdvertiser(state, advId) {
    const adv = byId(DATA.ADVERTISERS, advId);
    if (!adv) return { ok: false, error: 'Advertiser not found.' };
    if (state.activeAdvertiserIds.indexOf(advId) !== -1) return { ok: false, error: 'Already signed.' };
    if (state.activeAdvertiserIds.length >= getMaxAdvertiserSlots(state)) {
      return { ok: false, error: 'All advertiser slots are full. Upgrade studio or drop a sponsor.' };
    }
    if (state.listeners < adv.minListeners) {
      return { ok: false, error: 'Requires at least ' + adv.minListeners.toLocaleString('en-US') + ' listeners.' };
    }
    state.activeAdvertiserIds.push(advId);
    state.advertiserContracts[advId] = {
      monthsLeft: 8 + Math.floor(Math.random() * 5),
      satisfaction: 76,
      rateMult: 1.0
    };
    if (typeof state.advertiserRevenueMap[advId] !== 'number') {
      state.advertiserRevenueMap[advId] = 0;
    }
    state.advertiserSatisfaction = clamp(state.advertiserSatisfaction + 3, 0, 100);
    saveCareer(state);
    return { ok: true, adv: adv };
  }

  function renewAdvertiserContract(state, advId) {
    const adv = byId(DATA.ADVERTISERS, advId);
    const c = state.advertiserContracts && state.advertiserContracts[advId];
    if (!adv || !c) return { ok: false, error: 'Sponsor contract not found.' };
    const promoCost = Math.round((adv.basePayout * 0.35) * (1 + (state.expansionTier - 1) * 0.3));
    if (state.cash < promoCost) return { ok: false, error: 'Need ' + formatMoney(promoCost) + ' for sponsor renewal promo.' };
    state.cash -= promoCost;
    c.monthsLeft = 10;
    c.satisfaction = clamp(c.satisfaction + 20, 0, 100);
    c.rateMult = Math.min(1.30, Math.round((c.rateMult + 0.05) * 100) / 100);
    state.advertiserSatisfaction = clamp(state.advertiserSatisfaction + 4, 0, 100);
    saveCareer(state);
    return { ok: true, cost: promoCost };
  }

  function dropAdvertiser(state, advId) {
    const idx = state.activeAdvertiserIds.indexOf(advId);
    if (idx === -1) return { ok: false, error: 'Advertiser not active.' };
    state.activeAdvertiserIds.splice(idx, 1);
    if (state.advertiserContracts) delete state.advertiserContracts[advId];
    state.advertiserSatisfaction = clamp(state.advertiserSatisfaction - 4, 0, 100);
    saveCareer(state);
    return { ok: true };
  }

  function buyUpgrade(state, upgradeId) {
    const upg = byId(DATA.UPGRADES, upgradeId);
    if (!upg) return { ok: false, error: 'Upgrade not found.' };
    if (state.upgradeIds.indexOf(upgradeId) !== -1) return { ok: false, error: 'Already owned.' };
    if (state.cash < upg.cost) return { ok: false, error: 'Insufficient cash.' };

    state.cash -= upg.cost;
    state.upgradeIds.push(upgradeId);
    state.signalCoverage = clamp(state.signalCoverage + upg.coverageBonus, 10, 100);
    state.employeeMorale = clamp(state.employeeMorale + upg.moraleBonus, 0, 100);
    state.publicTrust = clamp(state.publicTrust + Math.round(upg.trustBonus), 0, 100);
    state.stationValue += upg.valueBonus;
    state.peakStationValue = Math.max(state.peakStationValue, state.stationValue);
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': Installed ' + upg.name + '.');
    saveCareer(state);
    return { ok: true, upgrade: upg };
  }

  function upgradeExpansionTier(state) {
    const nextTier = getExpansionTierObj((state.expansionTier || 1) + 1);
    if (!nextTier || nextTier.tier <= state.expansionTier) {
      return { ok: false, error: 'Already at maximum National Syndication reach.' };
    }
    if (state.signalCoverage < nextTier.minCoverage) {
      return { ok: false, error: 'Requires ' + nextTier.minCoverage + '% Signal Coverage first.' };
    }
    if (state.cash < nextTier.cost) {
      return { ok: false, error: 'Need ' + formatMoney(nextTier.cost) + ' expansion capital.' };
    }
    state.cash -= nextTier.cost;
    state.expansionTier = nextTier.tier;
    state.stationValue += Math.round(nextTier.cost * 1.4);
    state.peakStationValue = Math.max(state.peakStationValue, state.stationValue);
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': Expanded broadcast footprint to ' + nextTier.name + '!');
    saveCareer(state);
    return { ok: true, tier: nextTier };
  }

  function getExecutiveProjectCost(state, projectId) {
    const proj = byId(DATA.EXECUTIVE_PROJECTS || [], projectId);
    if (!proj) return 0;
    const scale = getCareerScale(state).cashScale;
    return Math.round(proj.baseCost * scale);
  }

  function runExecutiveProject(state, projectId) {
    const proj = byId(DATA.EXECUTIVE_PROJECTS || [], projectId);
    if (!proj) return { ok: false, error: 'Project not found.' };
    const cost = getExecutiveProjectCost(state, projectId);
    if (state.cash < cost) return { ok: false, error: 'Insufficient cash (' + formatMoney(cost) + ' required).' };

    state.cash -= cost;
    let summary = proj.name + ' completed.';
    if (projectId === 'exec_transmitter_overhaul') {
      state.fccStanding = clamp(state.fccStanding + 10, 0, 100);
      state.ratings = Math.round(clamp(state.ratings + 1.8, 1, 95) * 10) / 10;
    } else if (projectId === 'exec_marketing_blitz') {
      const gain = Math.max(250, Math.round(state.listeners * 0.06));
      state.listeners = Math.min(getMaxAudienceCapacity(state), state.listeners + gain);
      Object.keys(state.showFatigue || {}).forEach(function (k) {
        state.showFatigue[k] = Math.round(state.showFatigue[k] * 0.5);
      });
      summary = 'Marketing Blitz added +' + gain.toLocaleString('en-US') + ' listeners & refreshed shows.';
    } else if (projectId === 'exec_legal_cleanup') {
      const negIdx = (state.activeConsequences || []).findIndex(function (c) { return c.kind === 'negative'; });
      if (negIdx !== -1) {
        const removed = state.activeConsequences.splice(negIdx, 1)[0];
        summary = 'Cleared persistent issue: ' + removed.title + '!';
      }
      state.fccStanding = clamp(state.fccStanding + 12, 0, 100);
    } else if (projectId === 'exec_staff_retreat') {
      state.employeeMorale = clamp(state.employeeMorale + 16, 0, 100);
      state.hiredHostIds.forEach(function (hid) {
        if (state.hostStats[hid]) {
          state.hostStats[hid].loyalty = clamp((state.hostStats[hid].loyalty || 70) + 12, 0, 100);
        }
      });
    } else if (projectId === 'exec_chopper_fleet_service') {
      state.publicTrust = clamp(state.publicTrust + 7, 0, 100);
      state.advertiserSatisfaction = clamp(state.advertiserSatisfaction + 6, 0, 100);
    } else if (projectId === 'exec_rival_counter') {
      const rivals = getActiveRivals(state).sort(function (a, b) { return b.listeners - a.listeners; });
      if (rivals.length > 0 && state.rivalStates[rivals[0].id]) {
        const lost = Math.round(state.rivalStates[rivals[0].id].listeners * 0.08);
        state.rivalStates[rivals[0].id].listeners = Math.max(500, state.rivalStates[rivals[0].id].listeners - lost);
        state.listeners = Math.min(getMaxAudienceCapacity(state), state.listeners + Math.round(lost * 0.35));
      }
      state.ratings = Math.round(clamp(state.ratings + 2.2, 1, 95) * 10) / 10;
    }

    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': ' + summary + ' (' + formatMoney(cost) + ').');
    saveCareer(state);
    return { ok: true, summary: summary, cost: cost };
  }

  function setStrategy(state, strategyId) {
    if (!byId(DATA.STRATEGIES, strategyId)) return { ok: false };
    if (state.strategyId !== strategyId) {
      state.strategyId = strategyId;
      state.strategyMonthsActive = 0;
    }
    saveCareer(state);
    return { ok: true };
  }

  function setCommercialLoad(state, loadId) {
    if (!byId(DATA.COMMERCIAL_LOADS, loadId)) return { ok: false };
    state.commercialLoadId = loadId;
    saveCareer(state);
    return { ok: true };
  }

  /* =========================================================
     MID-MONTH 4-WEEK STAGED SIMULATION PLANNER
     ========================================================= */
  function pickRandom(arr, rng) {
    const fn = rng || Math.random;
    return arr[Math.floor(fn() * arr.length)];
  }

  function instantiateHostEvent(template, state, rng) {
    const ev = JSON.parse(JSON.stringify(template));
    let targetHost = null;
    if (ev.hostId) {
      targetHost = byId(DATA.HOSTS, ev.hostId);
    } else {
      const candidates = state.hiredHostIds.map(function (id) { return byId(DATA.HOSTS, id); }).filter(Boolean);
      targetHost = candidates.length ? pickRandom(candidates, rng) : DATA.HOSTS[0];
    }
    ev.targetHostId = targetHost ? targetHost.id : null;
    const hostName = targetHost ? targetHost.name : 'The Staff';
    ev.category = (ev.category || 'HOST INCIDENT').replace(/\{HOST_NAME\}/g, hostName.toUpperCase());
    ev.title = ev.title.replace(/\{HOST_NAME\}/g, hostName);
    ev.description = ev.description.replace(/\{HOST_NAME\}/g, hostName);
    ev.choices.forEach(function (ch) {
      ch.label = ch.label.replace(/\{HOST_NAME\}/g, hostName);
      if (ch.reportLine) ch.reportLine = ch.reportLine.replace(/\{HOST_NAME\}/g, hostName);
    });
    return ev;
  }

  function beginMonthSimulation(state, rng) {
    const rand = rng || Math.random;
    const roll = rand();
    let eventCount = 1;
    if (roll < 0.10) eventCount = 0;
    else if (roll < 0.56) eventCount = 1;
    else if (roll < 0.90) eventCount = 2;
    else eventCount = 3;

    if (state.year === 1 && state.month === 1) eventCount = 1;

    const weekSlots = [1, 2, 3, 4];
    const weekEvents = { 1: null, 2: null, 3: null, 4: null };
    const usedIds = (state.recentEventIds || []).slice();
    const recentChains = (state.recentChainIds || []).slice();

    const eligibleGeneric = DATA.INTERRUPT_EVENTS.filter(function (e) {
      return state.year >= (e.minYear || 1) && state.year <= (e.maxYear || 25) && usedIds.indexOf(e.id) === -1;
    });
    const eligibleWeather = (DATA.WEATHER_EMERGENCY_EVENTS || []).filter(function (e) {
      return state.year >= (e.minYear || 1) && usedIds.indexOf(e.id) === -1;
    });
    const eligibleIndustry = (DATA.INDUSTRY_EVENTS || []).filter(function (e) {
      return state.year >= (e.minYear || 1) && usedIds.indexOf(e.id) === -1;
    });
    const eligibleAdv = (DATA.ADVERTISER_EVENTS || []).filter(function (e) {
      return state.year >= (e.minYear || 1) && state.activeAdvertiserIds.length > 0 && usedIds.indexOf(e.id) === -1;
    });
    const eligibleChains = DATA.EVENT_CHAINS.filter(function (c) {
      return state.year >= (c.minYear || 2) && usedIds.indexOf(c.id) === -1 && recentChains.indexOf(c.id) === -1;
    });
    const eligibleSpecials = DATA.SPECIAL_INCIDENTS.filter(function (s) {
      return state.year >= (s.minYear || 3) && state.majorEventsExperienced.indexOf(s.incidentTitle) === -1;
    });
    const eligibleHostEvents = DATA.HOST_EVENTS.filter(function (he) {
      if (usedIds.indexOf(he.id) !== -1) return false;
      if (he.hostId) return state.hiredHostIds.indexOf(he.hostId) !== -1;
      return state.hiredHostIds.length > 0 && state.year >= (he.minYear || 1);
    });

    // Multi-step chain chance
    const chainChance = state.year <= 4 ? 0.16 : (state.year <= 14 ? 0.25 : 0.30);
    if (eventCount > 0 && eligibleChains.length > 0 && rand() < chainChance) {
      const chain = pickRandom(eligibleChains, rand);
      const startWeek = rand() < 0.6 ? 1 : 2;
      const step1Ev = JSON.parse(JSON.stringify(chain.step1));
      step1Ev.id = chain.id;
      step1Ev.chainId = chain.id;
      step1Ev.chainTargetWeek = startWeek === 1 ? 3 : 4;
      weekEvents[startWeek] = step1Ev;
      usedIds.push(chain.id);
      eventCount = Math.max(0, eventCount - 1);
    }

    // Rare Special Incident chance
    const specialChance = state.year < 3 ? 0 : (state.year <= 8 ? 0.08 : (state.year <= 16 ? 0.14 : 0.20));
    if (eventCount > 0 && eligibleSpecials.length > 0 && rand() < specialChance) {
      const freeWeeks = weekSlots.filter(function (w) { return !weekEvents[w]; });
      if (freeWeeks.length > 0) {
        const w = pickRandom(freeWeeks, rand);
        const sp = JSON.parse(JSON.stringify(pickRandom(eligibleSpecials, rand)));
        weekEvents[w] = sp;
        usedIds.push(sp.id);
        eventCount--;
      }
    }

    // Fill remaining slots from weighted category pools (Generic, Host, Advertiser, Weather, Industry)
    for (let i = 0; i < eventCount; i++) {
      const freeWeeks = weekSlots.filter(function (w) {
        const claimedByChain = Object.keys(weekEvents).some(function (k) {
          return weekEvents[k] && weekEvents[k].chainTargetWeek === w;
        });
        return !weekEvents[w] && !claimedByChain;
      });
      if (!freeWeeks.length) break;
      const week = pickRandom(freeWeeks, rand);
      const bucketRoll = rand();
      let chosen = null;

      if (bucketRoll < 0.24 && eligibleHostEvents.length > 0) {
        const hPool = eligibleHostEvents.filter(function (e) { return usedIds.indexOf(e.id) === -1; });
        if (hPool.length) chosen = instantiateHostEvent(pickRandom(hPool, rand), state, rand);
      } else if (bucketRoll < 0.42 && eligibleAdv.length > 0) {
        const aPool = eligibleAdv.filter(function (e) { return usedIds.indexOf(e.id) === -1; });
        if (aPool.length) chosen = JSON.parse(JSON.stringify(pickRandom(aPool, rand)));
      } else if (bucketRoll < 0.58 && eligibleWeather.length > 0) {
        const wPool = eligibleWeather.filter(function (e) { return usedIds.indexOf(e.id) === -1; });
        if (wPool.length) chosen = JSON.parse(JSON.stringify(pickRandom(wPool, rand)));
      } else if (bucketRoll < 0.72 && eligibleIndustry.length > 0) {
        const iPool = eligibleIndustry.filter(function (e) { return usedIds.indexOf(e.id) === -1; });
        if (iPool.length) chosen = JSON.parse(JSON.stringify(pickRandom(iPool, rand)));
      }

      if (!chosen) {
        const gPool = eligibleGeneric.filter(function (e) { return usedIds.indexOf(e.id) === -1; });
        chosen = JSON.parse(JSON.stringify(gPool.length ? pickRandom(gPool, rand) : pickRandom(DATA.INTERRUPT_EVENTS, rand)));
      }

      // Dynamic callback flavor if past history flag exists
      if (state.historyFlags && state.historyFlags.ignoredEmergency && chosen.isEmergency && rand() < 0.45) {
        chosen.description += ' (Callers still bring up the storm you ignored years ago!)';
      }

      weekEvents[week] = chosen;
      usedIds.push(chosen.id);
    }

    return {
      calendarLabel: getCalendarLabel(state.year, state.month),
      currentWeek: 0,
      weekEvents: weekEvents,
      pendingFollowUps: {},
      eventEffects: {
        cash: 0, ratings: 0, listeners: 0, trust: 0, adSat: 0,
        fcc: 0, morale: 0, fccViolations: 0, adPreempt: 0, advSatDelta: 0
      },
      highlights: [],
      weekLog: [],
      resolvedEvents: [],
      startSnapshot: {
        cash: state.cash, listeners: state.listeners, ratings: state.ratings,
        stationValue: state.stationValue, signalCoverage: state.signalCoverage,
        adSat: state.advertiserSatisfaction, trust: state.publicTrust,
        fcc: state.fccStanding, morale: state.employeeMorale
      }
    };
  }

  function getAvailableChoices(state, ev) {
    if (!ev || !ev.choices) return [];
    return ev.choices.filter(function (ch) {
      if (!ch.requiresUpgrade) return true;
      return state.upgradeIds.indexOf(ch.requiresUpgrade) !== -1;
    });
  }

  function advanceSimulationWeek(state, sim) {
    sim.currentWeek += 1;
    if (sim.currentWeek > 4) return { done: true, event: null };
    const w = sim.currentWeek;
    const ev = sim.pendingFollowUps[w] || sim.weekEvents[w] || null;
    if (!ev) {
      sim.weekLog.push('Week ' + w + ': Smooth broadcasting across ' + state.stationName + '.');
      return { done: false, week: w, event: null };
    }
    return { done: false, week: w, event: ev, choices: getAvailableChoices(state, ev) };
  }

  function handleHostDeparture(state, hostId, reasonText, randFn) {
    const rand = randFn || Math.random;
    if (state.hiredHostIds.length <= 1) return null; // Keep last board op unless forced
    const host = byId(DATA.HOSTS, hostId);
    const hs = state.hostStats[hostId];
    if (!host || !hs) return null;

    const idx = state.hiredHostIds.indexOf(hostId);
    if (idx !== -1) state.hiredHostIds.splice(idx, 1);
    Object.keys(state.schedule).forEach(function (blk) {
      if (state.schedule[blk].hostId === hostId) state.schedule[blk].hostId = null;
    });

    const rivals = getActiveRivals(state);
    const rival = rivals.length ? pickRandom(rivals, rand) : DATA.RIVAL_STATIONS[0];
    if (rival && state.rivalStates[rival.id]) {
      state.rivalStates[rival.id].listeners += Math.round(1200 + (hs.popularity * 45));
      state.rivalStates[rival.id].ratings = Math.min(48, Math.round((state.rivalStates[rival.id].ratings + 2.4) * 10) / 10);
      state.rivalStates[rival.id].poachedHosts.push(host.name);
      state.rivalStates[rival.id].lastHeadline = rival.callSign + ' signed away ' + host.name + '!';
    }

    state.departedHosts = state.departedHosts || {};
    state.departedHosts[hostId] = {
      rivalId: rival ? rival.id : 'wkrk_am',
      rivalName: rival ? rival.callSign : 'WKRK 980 AM',
      reason: reasonText,
      monthLeft: state.monthsCompleted
    };

    const listenerHit = -Math.round(state.listeners * (0.06 + (hs.popularity / 100) * 0.09));
    state.listeners = Math.max(120, state.listeners + listenerHit);
    state.ratings = Math.max(2.0, Math.round((state.ratings - (1.8 + hs.popularity * 0.03)) * 10) / 10);
    state.advertiserSatisfaction = clamp(state.advertiserSatisfaction - 5, 0, 100);

    addOrRefreshConsequence(state, {
      id: 'cons_host_exit_' + hostId,
      title: host.name + ' Defection Slump',
      kind: 'negative',
      months: 6,
      ratingsMult: 0.92,
      moraleMod: -1.0,
      desc: host.name + ' jumped to ' + (rival ? rival.callSign : 'a rival') + ', dragging listener loyalty.'
    });

    const msg = 'HOST DEPARTED: ' + host.name + ' walked out and signed with ' + (rival ? rival.callSign : 'a rival station') + '! (' + listenerHit.toLocaleString('en-US') + ' listeners lost)';
    state.careerLog.push(getCalendarLabel(state.year, state.month) + ': ' + msg);
    return msg;
  }

  function addOrRefreshConsequence(state, consObj) {
    state.activeConsequences = state.activeConsequences || [];
    const existing = state.activeConsequences.find(function (c) { return c.id === consObj.id; });
    if (existing) {
      existing.monthsLeft = Math.max(existing.monthsLeft, consObj.months || 6);
      return;
    }
    state.activeConsequences.push({
      id: consObj.id,
      title: consObj.title,
      kind: consObj.kind || 'negative',
      monthsLeft: consObj.months || 6,
      trustMod: consObj.trustMod || 0,
      fccMod: consObj.fccMod || 0,
      adSatMod: consObj.adSatMod || 0,
      moraleMod: consObj.moraleMod || 0,
      cashPerMonth: consObj.cashPerMonth || 0,
      ratingsMult: consObj.ratingsMult || 1.0,
      desc: consObj.desc || ''
    });
  }

  function resolveInterruptChoice(state, sim, ev, choiceIndex, rng) {
    const rand = rng || Math.random;
    const choices = getAvailableChoices(state, ev);
    const choice = choices[choiceIndex] || choices[0];
    if (!choice) return null;

    const fx = choice.effects || {};
    const scale = getCareerScale(state);

    let cashDelta = Math.round((fx.cash || 0) * scale.cashScale);
    let ratingsDelta = fx.ratings || 0;
    let listenersDelta = Math.round((fx.listeners || 0) * (fx.listeners > 0 ? scale.listenerScale * 0.65 : scale.listenerScale * 0.45));
    let trustDelta = fx.trust || 0;
    let adSatDelta = fx.adSat || 0;
    let fccDelta = fx.fcc || 0;
    let moraleDelta = fx.morale || 0;
    let adPreempt = fx.adPreempt || 0;

    // Upgrade synergies
    if (ev.isEmergency && state.upgradeIds.indexOf('emergency_alert') !== -1 && trustDelta > 0) {
      trustDelta = Math.round(trustDelta * 1.3);
      listenersDelta = Math.round(listenersDelta * 1.25);
    }
    if ((ev.id === 'power_failure' || ev.id === 'incident_statewide_blackout') && state.upgradeIds.indexOf('backup_generator') !== -1 && cashDelta < 0) {
      cashDelta = Math.round(cashDelta * 0.45);
      ratingsDelta += 0.8;
    }
    if ((ev.id === 'county_fair' || ev.id === 'state_fair') && state.upgradeIds.indexOf('mobile_trailer') !== -1 && listenersDelta > 0) {
      listenersDelta = Math.round(listenersDelta * 1.35);
      ratingsDelta += 1.0;
    }
    if (fccDelta < 0 && state.upgradeIds.indexOf('digital_archive') !== -1) {
      fccDelta = Math.ceil(fccDelta * 0.75);
    }
    if (fccDelta < 0 && state.upgradeIds.indexOf('legal_retainer') !== -1) {
      fccDelta = Math.ceil(fccDelta * 0.65);
    }

    sim.eventEffects.cash += cashDelta;
    sim.eventEffects.ratings += ratingsDelta;
    sim.eventEffects.listeners += listenersDelta;
    sim.eventEffects.trust += trustDelta;
    sim.eventEffects.adSat += adSatDelta;
    sim.eventEffects.fcc += fccDelta;
    sim.eventEffects.morale += moraleDelta;
    sim.eventEffects.adPreempt += adPreempt;
    if (fx.advSatDelta) sim.eventEffects.advSatDelta += fx.advSatDelta;

    if (fx.fccViolation) sim.eventEffects.fccViolations += fx.fccViolation;
    if (ev.flagGrant) state.flags[ev.flagGrant] = true;
    if (fx.setHistoryFlag) {
      state.historyFlags = state.historyFlags || {};
      state.historyFlags[fx.setHistoryFlag] = true;
    }
    if (fx.addConsequence) {
      const scaledCons = Object.assign({}, fx.addConsequence);
      if (scaledCons.cashPerMonth) scaledCons.cashPerMonth = Math.round(scaledCons.cashPerMonth * scale.cashScale * 0.65);
      addOrRefreshConsequence(state, scaledCons);
    }

    if (ev.isSpecialIncident && ev.incidentTitle && state.majorEventsExperienced.indexOf(ev.incidentTitle) === -1) {
      state.majorEventsExperienced.push(ev.incidentTitle);
    }

    // Host-specific effects & real departure checks
    if (ev.targetHostId && state.hostStats[ev.targetHostId]) {
      const hs = state.hostStats[ev.targetHostId];
      if (fx.hostRaise) hs.salary += Math.round(fx.hostRaise * scale.cashScale * 0.55);
      if (fx.hostRaisePct) hs.salary = Math.round(hs.salary * (1 + fx.hostRaisePct));
      if (fx.hostPop) hs.popularity = clamp(hs.popularity + fx.hostPop, 1, 100);
      if (fx.hostLoyalty) hs.loyalty = clamp((hs.loyalty || 70) + fx.hostLoyalty, 0, 100);
      if (fx.hostStatus) hs.statusTier = fx.hostStatus;
      if (fx.hostLeaveRisk && (rand() < fx.hostLeaveRisk || hs.loyalty < 25)) {
        const leaveNote = handleHostDeparture(state, ev.targetHostId, ev.title, rand);
        if (leaveNote) sim.highlights.push(leaveNote);
      }
    }

    // Chain scheduling
    if (ev.chainId && choice.chainBranch) {
      state.recentChainIds = state.recentChainIds || [];
      state.recentChainIds.push(ev.chainId);
      if (state.recentChainIds.length > 8) state.recentChainIds = state.recentChainIds.slice(-8);
      const chain = byId(DATA.EVENT_CHAINS, ev.chainId);
      if (chain && chain.step2ByBranch && chain.step2ByBranch[choice.chainBranch]) {
        const followUp = JSON.parse(JSON.stringify(chain.step2ByBranch[choice.chainBranch]));
        followUp.id = chain.id + '_step2';
        sim.pendingFollowUps[ev.chainTargetWeek || 3] = followUp;
      }
    }

    if (choice.reportLine) sim.highlights.push(choice.reportLine);
    sim.weekLog.push('Week ' + sim.currentWeek + ' [' + ev.title + ']: ' + choice.label);
    sim.resolvedEvents.push({ id: ev.id, title: ev.title, choiceLabel: choice.label });

    state.recentEventIds = state.recentEventIds || [];
    state.recentEventIds.push(ev.id);
    if (state.recentEventIds.length > 30) state.recentEventIds = state.recentEventIds.slice(-30);

    return {
      cashDelta: cashDelta, ratingsDelta: ratingsDelta, listenersDelta: listenersDelta,
      trustDelta: trustDelta, adSatDelta: adSatDelta, fccDelta: fccDelta,
      moraleDelta: moraleDelta, reportLine: choice.reportLine
    };
  }

  /* =========================================================
     MONTHLY ROLLUP: TRENDS, RIVALS, CONTRACTS, GRAVITY & CONSEQUENCE TICK
     ========================================================= */
  function updateRivalsMonthly(state, sim, randFn) {
    const rand = randFn || Math.random;
    const trend = state.audienceTrend || { hotCategories: [] };

    (DATA.RIVAL_STATIONS || []).forEach(function (r) {
      const rs = state.rivalStates[r.id];
      if (!rs) return;
      const wasActive = rs.active;
      rs.active = state.year >= r.minYear;
      if (!rs.active) return;

      if (!wasActive) {
        sim.highlights.push('NEW RIVAL ON AIR: ' + r.callSign + ' ("' + r.nickname + '") has launched in your market!');
        rs.lastHeadline = 'Launched competing signal in Year ' + state.year;
        return;
      }

      const hotMatch = r.strengths.some(function (cat) { return trend.hotCategories.indexOf(cat) !== -1; });
      const tierObj = getExpansionTierObj(state.expansionTier || 1);
      const targetRivalListeners = Math.round(
        r.baseListeners * (1 + state.year * 0.55) * (0.65 + tierObj.eventScale * 0.32) * (hotMatch ? 1.18 : 1.0)
      );
      const drift = Math.round((targetRivalListeners - rs.listeners) * 0.14);
      rs.listeners = clamp(rs.listeners + drift, 800, 850000);
      rs.ratings = Math.round(clamp(rs.ratings + (hotMatch ? 0.35 : -0.1) + (rand() * 1.1 - 0.55), 8.0, 48.0) * 10) / 10;

      if (rand() < 0.14) {
        const scoops = [
          r.callSign + ' broke a highway story 20 minutes ahead of our newsroom.',
          r.callSign + ' ran aggressive discount ad promos targeting our afternoon sponsors.',
          r.callSign + ' hosted a live parking-lot remote pulling commuters off our frequency.'
        ];
        const msg = pickRandom(scoops, rand);
        rs.lastHeadline = msg;
        sim.highlights.push('RIVAL PRESSURE: ' + msg);
      }
    });
  }

  function finalizeMonth(state, sim, rng) {
    const rand = rng || Math.random;
    const prevUnlocked = getUnlockedShows(state).map(function (s) { return s.id; });
    const prevAch = state.achievements.slice();
    const calLabel = sim.calendarLabel;
    const proj = calculateMonthlyProjection(state);
    const era = proj.era;
    const cons = getConsequenceModifiers(state);
    const scale = getCareerScale(state);

    // 1. Update Show Fatigue (on-air shows build fatigue, off-air recover)
    const onAirShowIds = [];
    const onAirCategories = [];
    DATA.TIME_BLOCKS.forEach(function (blk) {
      const slot = state.schedule[blk.id];
      if (!slot) return;
      onAirShowIds.push(slot.showId);
      const perf = evaluateBlockPerformance(state, blk.id);
      if (perf.show) {
        onAirCategories.push(perf.show.category);
        state.showUsageMap[perf.show.id] = (state.showUsageMap[perf.show.id] || 0) + Math.round(perf.ratingContribution);
      }
      if (perf.host && state.hostStats[perf.host.id]) {
        const hs = state.hostStats[perf.host.id];
        hs.monthsEmployed = (hs.monthsEmployed || 0) + 1;
        hs.famePoints = (hs.famePoints || 0) + Math.round(perf.ratingContribution);
      }
    });

    const fatigueRate = state.upgradeIds.indexOf('major_studio_complex') !== -1 ? 4.2 : 5.6;
    DATA.SHOWS.forEach(function (s) {
      const cur = state.showFatigue[s.id] || 0;
      if (onAirShowIds.indexOf(s.id) !== -1) {
        state.showFatigue[s.id] = clamp(Math.round((cur + fatigueRate) * 10) / 10, 0, 100);
      } else if (cur > 0) {
        state.showFatigue[s.id] = clamp(Math.round((cur - 15) * 10) / 10, 0, 100);
      }
    });

    // 2. Host Loyalty, Contracts, Status & Passive Host Traits
    let passiveTrustFromHosts = 0;
    let passiveFccFromHosts = 0;
    let passiveMoraleFromHosts = 0;
    let fccViolationsThisMonth = sim.eventEffects.fccViolations || 0;

    state.hiredHostIds.slice().forEach(function (hid) {
      const hs = state.hostStats[hid];
      const h = byId(DATA.HOSTS, hid);
      if (!hs || !h) return;

      const assignedSlot = DATA.TIME_BLOCKS.find(function (b) { return state.schedule[b.id] && state.schedule[b.id].hostId === hid; });
      if (assignedSlot) {
        const showId = state.schedule[assignedSlot.id].showId;
        if (h.preferredShows.indexOf(showId) !== -1) hs.loyalty = clamp(hs.loyalty + 1.4, 0, 100);
      } else {
        hs.loyalty = clamp(hs.loyalty - 0.9, 0, 100);
      }
      if (state.employeeMorale < 45) hs.loyalty = clamp(hs.loyalty - 2.2, 0, 100);

      if (hs.popularity >= 85 && hs.statusTier === 'Regular') hs.statusTier = 'Local Star';
      if (h.controversy >= 80 && hs.famePoints > 250) hs.statusTier = 'Celebrity Liability';

      hs.contractMonthsLeft = Math.max(0, (hs.contractMonthsLeft || 12) - 1);
      if (hs.contractMonthsLeft === 0 && state.hiredHostIds.length > 1) {
        if (hs.loyalty < 45) {
          const exitMsg = handleHostDeparture(state, hid, 'Contract expired with low loyalty', rand);
          if (exitMsg) sim.highlights.push(exitMsg);
          return;
        } else {
          // Loyal host auto-renews with modest market raise
          hs.salary = Math.round(hs.salary * 1.07);
          hs.contractMonthsLeft = 14;
          sim.highlights.push(h.name + '\'s contract renewed cleanly (+7% market adjustment).');
        }
      }

      if (hid === 'miss_patty') passiveTrustFromHosts += 2.0;
      if (hid === 'rev_hollis') {
        passiveFccFromHosts += 2.0;
        passiveTrustFromHosts += 1.4;
      }
      if (hid === 'velvet_vance') passiveMoraleFromHosts += 1.8;
      if (hid === 'conspiracy_carl') {
        passiveFccFromHosts -= 2.2 * (era.fccStrictness || 1.0);
        if (rand() < 0.28 * (era.fccStrictness || 1.0)) {
          const warnCount = rand() < 0.3 ? 2 : 1;
          fccViolationsThisMonth += warnCount;
          passiveFccFromHosts -= warnCount * 2.2;
          sim.highlights.push('Conspiracy Carl triggered ' + warnCount + ' FCC citation(s) during live broadcast.');
        }
      }
    });

    // 3. Strategy Duration & Sensational Tabloid Burnout / Reckoning
    state.strategyMonthsActive = (state.strategyMonthsActive || 0) + 1;
    let strategyExtraAdSat = 0;
    let strategyExtraFcc = 0;
    if (state.strategyId === 'sensational') {
      if (state.strategyMonthsActive > 5) {
        strategyExtraAdSat -= 2.5;
        strategyExtraFcc -= 1.2;
        if (rand() < 0.25) {
          fccViolationsThisMonth += 1;
          sim.highlights.push('Sensational Tabloid burnout drew an unscheduled FCC indecency audit!');
        }
      }
      if (state.strategyMonthsActive === 8) {
        addOrRefreshConsequence(state, {
          id: 'cons_tabloid_rep',
          title: 'Tabloid Junk-News Reputation',
          kind: 'negative',
          months: 10,
          trustMod: -1.8,
          adSatMod: -1.4,
          desc: 'Continuous tabloid sensationalism scarred civic & sponsor reputation.'
        });
        sim.highlights.push('LONG-TERM CONSEQUENCE: Station branded "Tabloid Junk-News" by civic leaders.');
      }
    }

    // 4. Ratings & Listener Growth
    const rawNewRatings = (state.ratings * 0.56) + (proj.targetRatings * 0.44) + sim.eventEffects.ratings * 0.60;
    const newRatings = Math.round(clamp(rawNewRatings, 1.0, 96.0) * 10) / 10;

    const strategy = byId(DATA.STRATEGIES, state.strategyId) || DATA.STRATEGIES[0];
    const cap = proj.maxListeners;
    const ratingShare = newRatings / 100;
    const trustMultiplier = 0.62 + (state.publicTrust / 100) * 0.62;
    const targetListeners = Math.round(cap * Math.pow(ratingShare, 1.32) * trustMultiplier);
    const organicGrowth = Math.round((targetListeners - state.listeners) * 0.20 * (strategy.growthMult || 1.0));
    let newListeners = state.listeners + organicGrowth + sim.eventEffects.listeners;
    newListeners = Math.max(120, Math.min(Math.round(cap * 1.10), newListeners));

    // 5. Stats Update with Diminishing Returns & High-Stat Gravity (applied AFTER diminishing gain)
    const commLoad = byId(DATA.COMMERCIAL_LOADS, state.commercialLoadId) || DATA.COMMERCIAL_LOADS[1];

    const rawTrustGain = proj.avgTrustDelta * 0.60 + passiveTrustFromHosts + sim.eventEffects.trust;
    const adjTrustGain = rawTrustGain > 0 ? applyDiminishingGain(state.publicTrust, rawTrustGain) : rawTrustGain;
    let newTrust = clamp(Math.round((state.publicTrust + adjTrustGain + highStatGravity(state.publicTrust)) * 10) / 10, 0, 100);

    let fccRiskDrag = proj.totalFccRisk > 22 ? -1.8 * (era.fccStrictness || 1.0) : (proj.totalFccRisk > 14 ? -0.6 : 0.4);
    if (state.upgradeIds.indexOf('legal_retainer') !== -1 && fccRiskDrag < 0) fccRiskDrag *= 0.65;
    const rawFccGain = strategy.fccMod + fccRiskDrag + passiveFccFromHosts + sim.eventEffects.fcc + cons.fccMod + strategyExtraFcc;
    const adjFccGain = rawFccGain > 0 ? applyDiminishingGain(state.fccStanding, rawFccGain) : rawFccGain;
    let newFcc = clamp(Math.round((state.fccStanding + adjFccGain + highStatGravity(state.fccStanding)) * 10) / 10, 0, 100);

    if (newFcc < 34 && rand() < 0.35) {
      fccViolationsThisMonth += 1;
      sim.highlights.push('FCC field inspector issued a formal compliance citation.');
    }

    const controversyDrag = proj.avgControversy > 52 ? -2.0 : 0.5;
    const rawAdGain = commLoad.adSatMod + controversyDrag + sim.eventEffects.adSat + cons.adSatMod + strategyExtraAdSat;
    const adjAdGain = rawAdGain > 0 ? applyDiminishingGain(state.advertiserSatisfaction, rawAdGain) : rawAdGain;
    let newAdSat = clamp(Math.round((state.advertiserSatisfaction + adjAdGain + highStatGravity(state.advertiserSatisfaction)) * 10) / 10, 0, 100);

    const rawMoraleGain = (strategy.moraleMod || 0) + passiveMoraleFromHosts + sim.eventEffects.morale + cons.moraleMod - (state.cash < 0 ? 3.5 : 0);
    const adjMoraleGain = rawMoraleGain > 0 ? applyDiminishingGain(state.employeeMorale, rawMoraleGain) : rawMoraleGain;
    let newMorale = clamp(Math.round((state.employeeMorale + adjMoraleGain + highStatGravity(state.employeeMorale)) * 10) / 10, 0, 100);

    // 6. Advertiser Contracts, Renewals, Demands & Revenue
    const preemptMult = 1 - Math.min(0.45, sim.eventEffects.adPreempt || 0);
    let adRevenue = Math.round(proj.adRevenue * preemptMult);
    let bonusSponsorCash = 0;

    state.activeAdvertiserIds.slice().forEach(function (aid) {
      const adv = byId(DATA.ADVERTISERS, aid);
      if (!adv) return;
      const contract = state.advertiserContracts[aid] || { monthsLeft: 8, satisfaction: 72, rateMult: 1.0 };
      const item = proj.adBreakdown.find(function (x) { return x.id === aid; });
      const earned = item ? Math.round(item.payout * preemptMult) : 0;
      state.advertiserRevenueMap[aid] = (state.advertiserRevenueMap[aid] || 0) + earned;

      // Sponsor likes preferred category on air, dislikes controversy exceeding sensitivity
      if (onAirCategories.indexOf(adv.preferredCategory) !== -1) {
        contract.satisfaction = clamp(contract.satisfaction + 3.0, 0, 100);
      } else {
        contract.satisfaction = clamp(contract.satisfaction - 1.2, 0, 100);
      }
      if (proj.avgControversy > adv.sensitivity + 20) {
        contract.satisfaction = clamp(contract.satisfaction - 4.5, 0, 100);
      }
      if (sim.eventEffects.advSatDelta) {
        contract.satisfaction = clamp(contract.satisfaction + sim.eventEffects.advSatDelta, 0, 100);
      }
      contract.monthsLeft = Math.max(0, contract.monthsLeft - 1);

      if (contract.satisfaction <= 18 && state.activeAdvertiserIds.length > 0) {
        state.activeAdvertiserIds.splice(state.activeAdvertiserIds.indexOf(aid), 1);
        delete state.advertiserContracts[aid];
        newAdSat = clamp(newAdSat - 6, 0, 100);
        sim.highlights.push(adv.name + ' terminated their contract over excessive controversy/mismatch and moved to a rival!');
      } else if (contract.monthsLeft === 0) {
        if (contract.satisfaction >= 62) {
          contract.monthsLeft = 9;
          sim.highlights.push(adv.name + ' renewed their sponsorship contract for 9 more months.');
        } else {
          state.activeAdvertiserIds.splice(state.activeAdvertiserIds.indexOf(aid), 1);
          delete state.advertiserContracts[aid];
          sim.highlights.push(adv.name + '\'s contract expired and they declined renewal (satisfaction too low).');
        }
      }
    });

    const listenerGain = newListeners - state.listeners;
    if ((listenerGain >= 550 || (newRatings - state.ratings) >= 2.0) && rand() < 0.45) {
      const pkgSponsor = state.activeAdvertiserIds.length
        ? byId(DATA.ADVERTISERS, pickRandom(state.activeAdvertiserIds, rand))
        : DATA.ADVERTISERS[6];
      if (pkgSponsor) {
        const pkgVal = Math.round((650 + Math.min(8000, newListeners * 0.06)) * (1 + (state.expansionTier - 1) * 0.35));
        bonusSponsorCash += pkgVal;
        state.advertiserRevenueMap[pkgSponsor.id] = (state.advertiserRevenueMap[pkgSponsor.id] || 0) + pkgVal;
        sim.highlights.push(pkgSponsor.name + ' purchased a premium bonus ad package (+' + formatMoney(pkgVal) + ').');
      }
    }

    // 7. FCC Fines & Financial Settlement
    let fccFine = 0;
    if (fccViolationsThisMonth > 0) {
      let rawFine = fccViolationsThisMonth * Math.round((700 + state.year * 140) * scale.cashScale * 0.55);
      if (state.upgradeIds.indexOf('digital_archive') !== -1) rawFine *= 0.75;
      if (state.upgradeIds.indexOf('legal_retainer') !== -1) rawFine *= 0.65;
      fccFine = Math.round(rawFine);
      sim.highlights.push('Paid ' + formatMoney(fccFine) + ' in FCC administrative compliance fines.');
    }

    const eventCashNet = sim.eventEffects.cash;
    const totalRevenue = adRevenue + bonusSponsorCash + Math.max(0, eventCashNet) + Math.max(0, cons.cashPerMonth);
    const totalExpenses = proj.totalExpenses + fccFine + Math.max(0, -eventCashNet);
    const netProfit = totalRevenue - totalExpenses;
    const newCash = state.cash + netProfit;

    // 8. Station Value
    const newStationValue = Math.max(
      10000,
      Math.round(
        newCash +
        proj.upgradesValue +
        (newListeners * 15) +
        (newRatings * 1350) +
        (newTrust * 520) +
        (state.signalCoverage * 1750) +
        ((state.expansionTier - 1) * 45000)
      )
    );

    // 9. Tick Persistent Consequences & Audience Trends & Rivals
    state.activeConsequences = (state.activeConsequences || []).filter(function (c) {
      c.monthsLeft -= 1;
      if (c.monthsLeft <= 0) {
        sim.highlights.push('Consequence resolved: "' + c.title + '" has concluded.');
        return false;
      }
      return true;
    });

    if (state.audienceTrend) {
      state.audienceTrend.monthsLeft -= 1;
      if (state.audienceTrend.monthsLeft <= 0) {
        state.audienceTrend = generateAudienceTrend(rand);
        sim.highlights.push('AUDIENCE SHIFT: Listeners now favor ' + state.audienceTrend.hotCategories.join(' & ') + ' (' + state.audienceTrend.demographicFocus + ').');
      }
    }

    updateRivalsMonthly(state, sim, rand);

    // Commit state
    state.lastMonthDeltas = {
      cash: newCash - state.cash,
      listeners: newListeners - state.listeners,
      ratings: Math.round((newRatings - state.ratings) * 10) / 10,
      stationValue: newStationValue - state.stationValue,
      signalCoverage: state.signalCoverage - sim.startSnapshot.signalCoverage,
      adSat: Math.round((newAdSat - state.advertiserSatisfaction) * 10) / 10,
      trust: Math.round((newTrust - state.publicTrust) * 10) / 10,
      fcc: Math.round((newFcc - state.fccStanding) * 10) / 10,
      morale: Math.round((newMorale - state.employeeMorale) * 10) / 10
    };

    state.cash = newCash;
    state.listeners = newListeners;
    state.ratings = newRatings;
    state.publicTrust = Math.round(newTrust);
    state.fccStanding = Math.round(newFcc);
    state.fccViolations += fccViolationsThisMonth;
    state.advertiserSatisfaction = Math.round(newAdSat);
    state.employeeMorale = Math.round(newMorale);
    state.stationValue = newStationValue;

    state.peakListeners = Math.max(state.peakListeners, state.listeners);
    state.peakRatings = Math.max(state.peakRatings, state.ratings);
    state.peakStationValue = Math.max(state.peakStationValue, state.stationValue);

    state.monthsCompleted += 1;

    state.consecutiveNegativeCash = state.cash < 0 ? state.consecutiveNegativeCash + 1 : 0;
    state.consecutiveLowRatings = (state.monthsCompleted >= 6 && state.ratings <= 2.2) ? state.consecutiveLowRatings + 1 : 0;
    state.consecutiveOwnerCrisis = (netProfit < -2500 && state.stationValue < 32000 && state.monthsCompleted >= 6) ? state.consecutiveOwnerCrisis + 1 : 0;

    // Newly Unlocked Shows & Achievements
    const nowUnlocked = getUnlockedShows(state).map(function (s) { return s.id; });
    const unlockedShowNames = [];
    nowUnlocked.forEach(function (id) {
      if (prevUnlocked.indexOf(id) === -1) {
        const s = byId(DATA.SHOWS, id);
        if (s) {
          unlockedShowNames.push(s.name);
          sim.highlights.push('NEW PROGRAM UNLOCKED: "' + s.name + '" is now available to schedule!');
        }
      }
    });

    const newAchievements = checkAchievements(state);
    newAchievements.forEach(function (a) {
      if (prevAch.indexOf(a.id) === -1) sim.highlights.push('ACHIEVEMENT UNLOCKED: ' + a.name + '!');
    });

    // End Checks
    const endCheck = evaluateCareerEnd(state);
    if (!endCheck) {
      if (state.turn >= MAX_MONTHS) {
        completeCareer(state, 'Retired Legend', '25-Year Retirement Achieved!');
      } else {
        const prevYear = state.year;
        state.turn += 1;
        state.month += 1;
        if (state.month > 12) {
          state.month = 1;
          state.year += 1;
          const nextEra = getCurrentEra(state.year);
          if (nextEra.id !== getCurrentEra(prevYear).id) {
            sim.highlights.push('NEW INDUSTRY ERA (' + nextEra.years + '): ' + nextEra.name + ' — ' + nextEra.desc);
          }
        }
      }
    } else {
      completeCareer(state, endCheck.result, endCheck.reason);
    }

    if (sim.highlights.length === 0) {
      sim.highlights.push('Steady local broadcasting across all four daily blocks.');
    }

    const report = {
      header: calLabel + ' REPORT',
      calendarLabel: calLabel,
      turnCompleted: state.monthsCompleted,
      adRevenue: adRevenue,
      bonusSponsorCash: bonusSponsorCash,
      eventCashNet: eventCashNet,
      totalRevenue: totalRevenue,
      totalExpenses: totalExpenses,
      fccFine: fccFine,
      netProfit: netProfit,
      deltas: state.lastMonthDeltas,
      highlights: sim.highlights,
      weekLog: sim.weekLog,
      unlockedShows: unlockedShowNames,
      newAchievements: newAchievements.map(function (a) { return a.name; }),
      ended: state.isEnded,
      endingSummary: state.endingSummary
    };

    state.lastReport = report;
    state.careerLog.push(calLabel + ': Net ' + formatSigned(netProfit, true) + ', Listeners ' + state.listeners.toLocaleString('en-US') + '.');
    if (state.careerLog.length > 80) state.careerLog = state.careerLog.slice(-80);

    saveCareer(state);
    return report;
  }

  function checkAchievements(state) {
    const unlockedNow = [];
    function grant(id) {
      if (state.achievements.indexOf(id) === -1) {
        state.achievements.push(id);
        const obj = byId(DATA.ACHIEVEMENTS, id);
        if (obj) unlockedNow.push(obj);
      }
    }
    if (state.monthsCompleted >= 12) grant('first_year');
    if (state.listeners >= 5000) grant('listeners_5k');
    if (state.listeners >= 25000) grant('listeners_25k');
    if (state.listeners >= 100000) grant('listeners_100k');
    if (state.cash >= 100000) grant('cash_100k');
    if (state.stationValue >= 1000000) grant('value_1m');
    if (state.hiredHostIds.length >= 4) grant('full_staff');
    if (state.upgradeIds.length >= 6) grant('upgrade_half');
    if (state.flags.sawFishRain) grant('fish_witness');
    if (state.fccViolations >= 5) grant('fcc_survivor');
    if (state.year >= 15) grant('year_15');
    if (state.monthsCompleted >= MAX_MONTHS) grant('year_25');
    return unlockedNow;
  }

  function evaluateCareerEnd(state) {
    if (state.cash < -7500 || state.consecutiveNegativeCash >= 3) {
      return {
        result: 'Bankruptcy',
        reason: 'The electric company repossessed the transmitter copper and sold the coffee urn for scrap.'
      };
    }
    if (state.fccStanding <= 0) {
      return {
        result: 'FCC Disaster',
        reason: 'Federal inspectors welded a padlock onto the broadcast rack while reading a 94-page citation.'
      };
    }
    if (state.publicTrust <= 0) {
      return {
        result: 'Public Trust Meltdown',
        reason: 'Even the town stray dogs changed the dial when ' + state.stationName + ' came on.'
      };
    }
    if (state.advertiserSatisfaction <= 0) {
      return {
        result: 'Advertiser Exodus',
        reason: 'Every local canoe insurer, bail bondsman, and taxidermist pulled their commercials simultaneously.'
      };
    }
    if (state.employeeMorale <= 0) {
      return {
        result: 'Host Revolt',
        reason: 'Your hosts locked you out of the booth and spent 4 hours broadcasting live kazoo grievances.'
      };
    }
    if (state.consecutiveLowRatings >= 2) {
      return {
        result: 'Ratings Collapse',
        reason: 'Ratings flatlined below 2.2% for consecutive months. Literally four people were listening, including Dave.'
      };
    }
    if (state.consecutiveOwnerCrisis >= 3) {
      return {
        result: 'Owner Termination',
        reason: 'The station owners replaced you with a glowing plastic drinking bird that taps the play button.'
      };
    }
    return null;
  }

  function computeCareerSummary(state, resultLabel, reasonText) {
    const yearsSurvived = Math.min(25, Math.floor(state.monthsCompleted / 12));
    const isFullRetirement = resultLabel === 'Retired Legend';
    const isEarlyRetirement = resultLabel === 'Early Retirement';

    let topHostName = 'Dave The Intern';
    let topHostScore = -1;
    Object.keys(state.hostStats || {}).forEach(function (hid) {
      const hs = state.hostStats[hid];
      if (!hs || hs.monthsEmployed <= 0) return;
      const h = byId(DATA.HOSTS, hid);
      const val = (hs.famePoints || 0) + (hs.popularity || 0) * 5;
      if (val > topHostScore && h) {
        topHostScore = val;
        topHostName = h.name;
      }
    });

    let topAdvName = "Honest Bob's Canoe Insurance";
    let topAdvCash = -1;
    Object.keys(state.advertiserRevenueMap || {}).forEach(function (aid) {
      const amt = state.advertiserRevenueMap[aid] || 0;
      const adv = byId(DATA.ADVERTISERS, aid);
      if (amt >= topAdvCash && adv) {
        topAdvCash = amt;
        topAdvName = adv.name;
      }
    });

    let topShowName = 'Local News';
    let topShowScore = -1;
    const showPairs = [];
    Object.keys(state.showUsageMap || {}).forEach(function (sid) {
      const s = byId(DATA.SHOWS, sid);
      const pts = state.showUsageMap[sid] || 0;
      if (s && pts > 0) {
        showPairs.push({ name: s.name, pts: pts });
        if (pts > topShowScore) {
          topShowScore = pts;
          topShowName = s.name;
        }
      }
    });
    showPairs.sort(function (a, b) { return b.pts - a.pts; });
    const secondShowName = showPairs[1] ? showPairs[1].name : 'emergency weather dispatches';

    const score = Math.max(
      0,
      Math.round(
        (state.monthsCompleted * 180) +
        (state.peakListeners * 0.9) +
        (state.peakRatings * 420) +
        (state.peakStationValue * 0.03) +
        (Math.max(0, state.cash) * 0.015) +
        (state.majorEventsExperienced.length * 1800) +
        (state.fccViolations * 300) +
        (isFullRetirement ? 25000 : (isEarlyRetirement ? 8000 : 0))
      )
    );

    const incidentFlavor = state.majorEventsExperienced.length > 0
      ? state.majorEventsExperienced.slice(0, 2).join(' and ').toLowerCase()
      : 'unverified pothole journalism';

    let bio = '';
    if (isFullRetirement) {
      bio = state.managerName + ' transformed ' + state.stationName + ' from a sputtering rural signal into ' +
        getExpansionTierObj(state.expansionTier || 1).name + '\'s undisputed beacon of ' +
        topShowName.toLowerCase() + ', ' + secondShowName.toLowerCase() + ', and heroic ' + incidentFlavor + ', retiring after 25 unforgettable years with ' +
        topHostName + ' still holding the mic.';
    } else if (isEarlyRetirement) {
      bio = 'After ' + state.monthsCompleted + ' months at the helm of ' + state.stationName + ', ' + state.managerName +
        ' cashed out ahead of the next goat crisis—leaving behind a legacy built on ' + topShowName +
        ', generous sponsorship from ' + topAdvName + ', and ' + state.fccViolations + ' surviving FCC citations.';
    } else {
      bio = state.managerName + '\'s wild ' + state.monthsCompleted + '-month run at ' + state.stationName + ' ended in ' + resultLabel +
        '—yet locals still swap bootleg cassette tapes of ' + topHostName + ' hosting ' + topShowName +
        ' through ' + incidentFlavor + '.';
    }

    return {
      managerName: state.managerName,
      stationName: state.stationName,
      yearsSurvived: yearsSurvived,
      monthsSurvived: state.monthsCompleted,
      finalCash: Math.round(state.cash),
      peakListeners: Math.round(state.peakListeners),
      peakRatings: Math.round(state.peakRatings * 10) / 10,
      highestStationValue: Math.round(state.peakStationValue),
      fccViolations: state.fccViolations,
      majorEventsExperienced: state.majorEventsExperienced.slice(),
      mostPopularHost: topHostName,
      mostProfitableAdvertiser: topAdvName + (topAdvCash > 0 ? ' (' + formatMoney(topAdvCash) + ')' : ''),
      strongestShow: topShowName,
      careerScore: score,
      careerResult: resultLabel,
      reason: reasonText,
      biography: bio
    };
  }

  function completeCareer(state, resultLabel, reasonText) {
    state.isEnded = true;
    state.careerResult = resultLabel;
    state.endingSummary = computeCareerSummary(state, resultLabel, reasonText);
    saveCareer(state);
    return state.endingSummary;
  }

  function retireEarly(state) {
    return completeCareer(
      state,
      'Early Retirement',
      state.managerName + ' handed over the transmitter keys, packed the prize coffee mug, and retired on their own terms.'
    );
  }

  function runAutomatedMonth(state, rng) {
    const sim = beginMonthSimulation(state, rng);
    for (let i = 0; i < 4; i++) {
      const step = advanceSimulationWeek(state, sim);
      if (step.event) {
        resolveInterruptChoice(state, sim, step.event, 0, rng);
      }
    }
    return finalizeMonth(state, sim, rng);
  }

  const engineExport = {
    SAVE_KEY,
    LOCAL_BOARD_KEY,
    MAX_MONTHS,
    START_YEAR,
    formatMoney,
    formatSigned,
    getCalendarLabel,
    getCurrentEra,
    getExpansionTierObj,
    getCareerScale,
    getActiveRivals,
    getExecutiveProjectCost,
    migrateSaveState,
    createNewCareer,
    saveCareer,
    loadCareer,
    clearSavedCareer,
    getUnlockedShows,
    isShowUnlocked,
    getMaxAdvertiserSlots,
    getMaxAudienceCapacity,
    evaluateBlockPerformance,
    calculateMonthlyProjection,
    assignSlot,
    hireHost,
    fireHost,
    giveHostBonus,
    renewHostContract,
    signAdvertiser,
    renewAdvertiserContract,
    dropAdvertiser,
    buyUpgrade,
    upgradeExpansionTier,
    runExecutiveProject,
    setStrategy,
    setCommercialLoad,
    beginMonthSimulation,
    getAvailableChoices,
    advanceSimulationWeek,
    resolveInterruptChoice,
    finalizeMonth,
    retireEarly,
    completeCareer,
    runAutomatedMonth
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = engineExport;
  } else {
    root.AMRT_ENGINE = engineExport;
  }
})(typeof window !== 'undefined' ? window : globalThis);
