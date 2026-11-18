/**
 * AM RADIO TYCOON — UI Controller, Dashboard Renderer, Mid-Month Interrupt Stepper & Leaderboard Client
 */
(function () {
  'use strict';

  const DATA = window.AMRT_DATA;
  const ENG = window.AMRT_ENGINE;
  const SFX = window.AMRT_AUDIO;
  const $ = function (id) { return document.getElementById(id); };

  let state = null;
  let activeTab = 'programming';
  let currentSim = null;
  let simTimer = null;
  let activeLeaderboardCat = 'score';
  let lastSubmittedRunKey = null;
  let confirmRetirePending = false;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function byId(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function showScreen(name) {
    $('screen-title').classList.toggle('active', name === 'title');
    $('screen-game').classList.toggle('active', name === 'game');
    const inGame = name === 'game';
    $('stationIdentity').classList.toggle('hidden', !inGame);
    $('hdrCalendar').classList.toggle('hidden', !inGame);
    $('btnHdrMenu').classList.toggle('hidden', !inGame);
  }

  function openModal(id) {
    $(id).classList.remove('hidden');
  }

  function closeModal(id) {
    $(id).classList.add('hidden');
  }

  function syncSfxButton() {
    $('btnHdrSfx').textContent = SFX.muted ? '🔇 SFX: OFF' : '🔊 SFX: ON';
  }

  /* =========================================================
     STARTUP & RETURNING PLAYER FLOW
     ========================================================= */
  function refreshTitleScreen() {
    showScreen('title');
    const saved = ENG.loadCareer();
    if (!saved) {
      $('title-fresh').classList.remove('hidden');
      $('title-returning').classList.add('hidden');
    } else {
      $('title-fresh').classList.add('hidden');
      $('title-returning').classList.remove('hidden');
      $('saveMgr').textContent = saved.managerName;
      $('saveStation').textContent = saved.stationName;
      $('saveYear').textContent = 'Year ' + saved.year + ' (Mo ' + saved.month + ')';
      $('saveListeners').textContent = Number(saved.listeners).toLocaleString('en-US');
      $('saveCash').textContent = ENG.formatMoney(saved.cash);
    }
  }

  function openNewCareerModal() {
    $('inputManagerName').value = '';
    $('inputStationName').value = 'WSTF 1120 AM';
    $('errManagerName').textContent = '';
    openModal('modal-new-career');
    setTimeout(function () { $('inputManagerName').focus(); }, 30);
  }

  function enterGame(loadedState) {
    state = loadedState;
    confirmRetirePending = false;
    activeTab = 'programming';
    syncTabButtons();
    showScreen('game');
    renderDashboard();
    if (state.isEnded && state.endingSummary) {
      openEndgameModal(state.endingSummary);
    }
  }

  /* =========================================================
     DASHBOARD & CORE STATS RENDERING
     ========================================================= */
  function setDeltaBadge(elId, val, isMoney, isPercent) {
    const el = $(elId);
    if (!el) return;
    if (!val || val === 0) {
      el.textContent = '';
      el.className = 'delta';
      return;
    }
    const cls = val > 0 ? 'delta pos' : 'delta neg';
    el.className = cls;
    if (isMoney) {
      el.textContent = ENG.formatSigned(val, true);
    } else if (isPercent) {
      el.textContent = (val > 0 ? '+' : '') + val.toFixed(1) + '%';
    } else {
      el.textContent = ENG.formatSigned(val, false);
    }
  }

  function setMeter(id, pct) {
    const el = $(id);
    if (!el) return;
    const clamped = Math.max(0, Math.min(100, pct));
    el.style.width = clamped + '%';
    el.classList.toggle('low', clamped < 30);
  }

  function renderStatsRack() {
    const d = state.lastMonthDeltas || {};
    const cap = ENG.getMaxAudienceCapacity(state);

    $('hdrStation').textContent = state.stationName;
    $('hdrManager').textContent = state.managerName;
    $('hdrMonthYear').textContent = ENG.getCalendarLabel(state.year, state.month);
    $('hdrTurn').textContent = 'YEAR ' + state.year + '/25 • MO ' + state.turn + '/' + ENG.MAX_MONTHS;
    $('sideStation').textContent = state.stationName;

    $('v-cash').textContent = ENG.formatMoney(state.cash);
    $('v-listeners').textContent = Math.round(state.listeners).toLocaleString('en-US');
    $('v-listeners-cap').textContent = 'Reach Cap: ' + cap.toLocaleString('en-US');
    $('v-ratings').textContent = state.ratings.toFixed(1) + '%';
    $('v-value').textContent = ENG.formatMoney(state.stationValue);
    $('v-coverage').textContent = state.signalCoverage + '%';
    $('v-adsat').textContent = state.advertiserSatisfaction + '%';
    $('v-trust').textContent = state.publicTrust + '%';
    $('v-fcc').textContent = state.fccStanding + '%';
    $('v-fcc-viol').textContent = 'Violations: ' + state.fccViolations;
    $('v-morale').textContent = state.employeeMorale + '%';

    setDeltaBadge('d-cash', d.cash, true, false);
    setDeltaBadge('d-listeners', d.listeners, false, false);
    setDeltaBadge('d-ratings', d.ratings, false, true);
    setDeltaBadge('d-value', d.stationValue, true, false);
    setDeltaBadge('d-coverage', d.signalCoverage, false, false);
    setDeltaBadge('d-adsat', d.adSat, false, false);
    setDeltaBadge('d-trust', d.trust, false, false);
    setDeltaBadge('d-fcc', d.fcc, false, false);
    setDeltaBadge('d-morale', d.morale, false, false);

    setMeter('m-coverage', state.signalCoverage);
    setMeter('m-adsat', state.advertiserSatisfaction);
    setMeter('m-trust', state.publicTrust);
    setMeter('m-fcc', state.fccStanding);
    setMeter('m-morale', state.employeeMorale);

    // Highlight critical danger cards
    const cards = document.querySelectorAll('.stats-rack .stat-card');
    if (cards.length >= 9) {
      cards[0].classList.toggle('danger', state.cash < 0);
      cards[2].classList.toggle('danger', state.ratings <= 4.0);
      cards[5].classList.toggle('danger', state.advertiserSatisfaction <= 25);
      cards[6].classList.toggle('danger', state.publicTrust <= 25);
      cards[7].classList.toggle('danger', state.fccStanding <= 25);
      cards[8].classList.toggle('danger', state.employeeMorale <= 25);
    }
  }

  function renderSidebar() {
    const proj = ENG.calculateMonthlyProjection(state);
    $('p-rev').textContent = ENG.formatMoney(proj.adRevenue);
    $('p-exp').textContent = '-' + ENG.formatMoney(proj.totalExpenses);
    const netEl = $('p-net');
    netEl.textContent = ENG.formatSigned(proj.netProjected, true);
    netEl.className = proj.netProjected >= 0 ? 'pos' : 'neg';
    $('p-rat').textContent = proj.targetRatings.toFixed(1) + '%';
    $('p-cont').textContent = proj.avgControversy + '/100';

    if ($('sideEraName') && proj.era) $('sideEraName').textContent = proj.era.name;
    if ($('sideTierName') && proj.tierObj) $('sideTierName').textContent = proj.tierObj.name;

    const warnings = [];
    if (state.cash < 0) {
      warnings.push({ crit: true, msg: 'Cash is negative (' + state.consecutiveNegativeCash + '/3 months before Bankruptcy).' });
    } else if (state.cash + proj.netProjected < 0) {
      warnings.push({ crit: false, msg: 'Projected deficit this month. Sign sponsors or cut costs.' });
    }
    if (proj.strategyBurnoutPenalty) {
      warnings.push({ crit: false, msg: 'Sensational Tabloid burnout active! Consider pivoting strategy.' });
    }
    if ((state.activeConsequences || []).some(function (c) { return c.kind === 'negative'; })) {
      const negCount = state.activeConsequences.filter(function (c) { return c.kind === 'negative'; }).length;
      warnings.push({ crit: true, msg: negCount + ' active persistent consequence(s) hurting station stats.' });
    }
    if (state.fccStanding <= 30) {
      warnings.push({ crit: true, msg: 'FCC Standing critical! Lower risky shows or hire Reverend Hollis.' });
    }
    if (state.publicTrust <= 30) {
      warnings.push({ crit: true, msg: 'Public Trust dangerously low! Cover local emergencies responsibly.' });
    }
    if (state.advertiserSatisfaction <= 30) {
      warnings.push({ crit: true, msg: 'Advertisers are furious! Reduce commercial load or controversy.' });
    }
    if (state.employeeMorale <= 30) {
      warnings.push({ crit: true, msg: 'Staff Morale near mutiny! Award bonuses or improve studio.' });
    }
    if (state.activeAdvertiserIds.length === 0) {
      warnings.push({ crit: true, msg: 'Zero active advertisers! Visit Advertisers tab to sign sponsors.' });
    }
    const unhosted = DATA.TIME_BLOCKS.filter(function (b) {
      return !state.schedule[b.id] || !state.schedule[b.id].hostId;
    });
    if (unhosted.length > 0) {
      warnings.push({ crit: false, msg: unhosted.length + ' time block(s) running automated tape (no host assigned).' });
    }

    $('sideWarnings').innerHTML = warnings.map(function (w) {
      return '<div class="warn-pill ' + (w.crit ? 'crit' : '') + '">⚠️ ' + esc(w.msg) + '</div>';
    }).join('');

    $('btnViewLastReport').classList.toggle('hidden', !state.lastReport);
    $('btnAdvanceMonth').disabled = Boolean(state.isEnded);
    $('btnAdvanceSub').textContent = state.turn === ENG.MAX_MONTHS
      ? 'FINAL MONTH BEFORE RETIREMENT!'
      : 'Simulate 4 Broadcast Weeks (' + ENG.getCalendarLabel(state.year, state.month) + ')';
  }

  function syncTabButtons() {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === activeTab);
    });
  }

  function renderActiveTab() {
    const panel = $('tab-content');
    if (activeTab === 'programming') renderProgrammingTab(panel);
    else if (activeTab === 'staff') renderStaffTab(panel);
    else if (activeTab === 'advertisers') renderAdvertisersTab(panel);
    else if (activeTab === 'upgrades') renderUpgradesTab(panel);
    else if (activeTab === 'rivals') renderRivalsTab(panel);
    else if (activeTab === 'office') renderOfficeTab(panel);
  }

  function renderDashboard() {
    if (!state) return;
    renderStatsRack();
    renderSidebar();
    renderActiveTab();
  }

  /* =========================================================
     TAB 1: PROGRAMMING SCHEDULE
     ========================================================= */
  function renderProgrammingTab(container) {
    const unlockedShows = ENG.getUnlockedShows(state);
    const lockedShows = DATA.SHOWS.filter(function (s) {
      return unlockedShows.indexOf(s) === -1;
    });
    const era = ENG.getCurrentEra(state.year);
    const trend = state.audienceTrend || { hotCategories: [], coldCategories: [], demographicFocus: 'Balanced', monthsLeft: 8 };

    let html = '<div class="section-intro">' +
      '<div><h2>Daily Broadcast Schedule</h2><p>Rotate stale shows, align with shifting audience trends, and adapt to each Industry Era.</p></div>' +
      '<span class="pill accent">' + unlockedShows.length + ' / ' + DATA.SHOWS.length + ' Shows Unlocked</span>' +
      '</div>';

    html += '<div class="trend-banner">' +
      '<div><b>📡 Era:</b> ' + esc(era.name) + ' (' + esc(era.years) + ') — <span style="color:var(--text-muted)">' + esc(era.desc) + '</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
        '<span class="pill good">🔥 Hot: ' + esc(trend.hotCategories.join(', ')) + '</span>' +
        '<span class="pill warn">❄️ Cold: ' + esc(trend.coldCategories.join(', ')) + '</span>' +
        '<span class="pill">' + esc(trend.demographicFocus) + ' (' + trend.monthsLeft + 'm left)</span>' +
      '</div>' +
    '</div><div class="schedule-grid">';

    DATA.TIME_BLOCKS.forEach(function (blk) {
      const slot = state.schedule[blk.id];
      const perf = ENG.evaluateBlockPerformance(state, blk.id);

      const showOptions = unlockedShows.map(function (s) {
        const sel = slot.showId === s.id ? ' selected' : '';
        const fat = (state.showFatigue && state.showFatigue[s.id]) ? Math.round(state.showFatigue[s.id]) : 0;
        const fatTxt = fat >= 45 ? ' [Stale]' : '';
        return '<option value="' + esc(s.id) + '"' + sel + '>' + esc(s.name) + fatTxt + ' (' + ENG.formatMoney(s.costPerMonth) + '/mo)</option>';
      }).join('');

      const hostOptions = '<option value="">— Automated Tape (No Host) —</option>' +
        state.hiredHostIds.map(function (hid) {
          const h = byId(DATA.HOSTS, hid);
          if (!h) return '';
          const sel = slot.hostId === hid ? ' selected' : '';
          return '<option value="' + esc(hid) + '"' + sel + '>' + esc(h.name) + '</option>';
        }).join('');

      const freshPct = Math.max(0, Math.round(100 - (perf.fatigue || 0)));

      html += '<div class="slot-card">' +
        '<div class="slot-header"><h3>' + esc(blk.name) + '</h3><span class="slot-hours">' + esc(blk.hours) + '</span></div>' +
        '<p class="slot-audience">' + esc(blk.audience) + '</p>' +
        '<div class="slot-controls">' +
          '<div><label>Program</label><select class="sel-show" data-block="' + esc(blk.id) + '">' + showOptions + '</select></div>' +
          '<div><label>On-Air Host</label><select class="sel-host" data-block="' + esc(blk.id) + '">' + hostOptions + '</select></div>' +
        '</div>' +
        '<p class="entity-desc" style="margin-bottom:8px;">' + esc(perf.show.description) + '</p>' +
        '<div class="slot-metrics">' +
          '<span class="pill ' + (perf.synergy ? 'good' : '') + '">' + (perf.synergy ? '★ Great Fit' : 'Off-Peak') + '</span>' +
          '<span class="pill">Pull: ' + perf.ratingContribution.toFixed(1) + '</span>' +
          '<span class="pill ' + (freshPct < 55 ? 'warn' : 'good') + '">Fresh: ' + freshPct + '%</span>' +
          (perf.trendTag === 'HOT' ? '<span class="pill good">🔥 Trend +26%</span>' : (perf.trendTag === 'COLD' ? '<span class="pill warn">❄️ Cold -22%</span>' : '')) +
          '<span class="pill">Cost: ' + ENG.formatMoney(perf.cost) + '/mo</span>' +
          '<span class="pill ' + (perf.fccRisk >= 8 ? 'warn' : '') + '">FCC Risk: ' + perf.fccRisk + '</span>' +
        '</div>' +
      '</div>';
    });

    html += '</div>';

    if (lockedShows.length > 0) {
      html += '<div class="locked-shows-box"><h4>🔒 Upcoming Absurd Shows To Unlock</h4><div class="locked-grid">';
      lockedShows.forEach(function (s) {
        html += '<div class="locked-item"><b>' + esc(s.name) + '</b><span>Unlock: ' + esc(s.unlockHint) + '</span><p class="entity-desc">' + esc(s.description) + '</p></div>';
      });
      html += '</div></div>';
    }

    container.innerHTML = html;

    container.querySelectorAll('.sel-show').forEach(function (sel) {
      sel.addEventListener('change', function () {
        SFX.playClick();
        ENG.assignSlot(state, sel.dataset.block, sel.value, undefined);
        renderDashboard();
      });
    });

    container.querySelectorAll('.sel-host').forEach(function (sel) {
      sel.addEventListener('change', function () {
        SFX.playClick();
        ENG.assignSlot(state, sel.dataset.block, undefined, sel.value || null);
        renderDashboard();
      });
    });
  }

  /* =========================================================
     TAB 2: HOSTS & STAFF
     ========================================================= */
  function renderStaffTab(container) {
    const hired = DATA.HOSTS.filter(function (h) { return state.hiredHostIds.indexOf(h.id) !== -1; });
    const applicants = DATA.HOSTS.filter(function (h) { return state.hiredHostIds.indexOf(h.id) === -1; });
    const era = ENG.getCurrentEra(state.year);
    const bonusCost = Math.round(450 * ENG.getCareerScale(state).cashScale);

    let html = '<div class="section-intro">' +
      '<div><h2>On-Air Talent, Contracts &amp; Loyalty</h2><p>Manage host loyalty and expiring contracts. Mistreated or underpaid hosts leave for rival stations.</p></div>' +
      '<span class="pill accent">Staff Employed: ' + hired.length + ' / ' + DATA.HOSTS.length + '</span>' +
      '</div>';

    html += '<h3 class="subhead">Current Station Staff</h3><div class="cards-grid">';
    hired.forEach(function (h) {
      const hs = state.hostStats[h.id] || h;
      const assignedBlocks = DATA.TIME_BLOCKS.filter(function (b) {
        return state.schedule[b.id] && state.schedule[b.id].hostId === h.id;
      }).map(function (b) { return b.name; });
      const renewBonus = Math.round((hs.salary * 0.6) + (hs.popularity >= 85 ? 800 : 250));
      const loyalty = Math.round(hs.loyalty || 75);

      html += '<div class="entity-card owned">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(h.name) + ' <small style="color:var(--amber)">(' + esc(hs.statusTier || 'Regular') + ')</small></h4><span class="pill good">' + ENG.formatMoney(hs.salary) + '/mo</span></div>' +
          '<div class="entity-tagline">"' + esc(h.tagline) + '"</div>' +
          '<p class="entity-desc"><b>Trait — ' + esc(h.traitTitle) + ':</b> ' + esc(h.traitDesc) + '</p>' +
        '</div>' +
        '<div class="stat-mini-row">' +
          '<span>Pop: ' + Math.round(hs.popularity) + '</span>' +
          '<span>Rel: ' + Math.round(hs.reliability) + '%</span>' +
          '<span style="color:' + (loyalty < 45 ? 'var(--red)' : 'var(--green)') + '">Loyalty: ' + loyalty + '%</span>' +
          '<span>Contract: ' + (hs.contractMonthsLeft || 0) + 'm</span>' +
        '</div>' +
        '<div class="entity-desc">Assigned: <b>' + (assignedBlocks.length ? esc(assignedBlocks.join(', ')) : 'Unassigned (Losing Loyalty!)') + '</b></div>' +
        '<div class="entity-actions">' +
          '<button class="btn btn-sm btn-secondary btn-bonus" data-id="' + esc(h.id) + '" ' + (state.cash < bonusCost ? 'disabled' : '') + '>🎁 Bonus (' + ENG.formatMoney(bonusCost) + ')</button>' +
          '<button class="btn btn-sm btn-primary btn-renew-host" data-id="' + esc(h.id) + '" ' + (state.cash < renewBonus ? 'disabled' : '') + '>📝 Renew (' + ENG.formatMoney(renewBonus) + ')</button>' +
          '<button class="btn btn-sm btn-ghost btn-fire" data-id="' + esc(h.id) + '" ' + (hired.length <= 1 ? 'disabled' : '') + '>Release</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    if (applicants.length > 0) {
      html += '<h3 class="subhead">Available Broadcast Talent (Era Inflation: ' + era.salaryInflation.toFixed(2) + 'x)</h3><div class="cards-grid">';
      applicants.forEach(function (h) {
        const dep = state.departedHosts && state.departedHosts[h.id];
        const cooldownLeft = dep ? Math.max(0, 24 - (state.monthsCompleted - dep.monthLeft)) : 0;
        const hireCost = Math.round(h.hireCost * era.salaryInflation * (1 + (state.expansionTier - 1) * 0.35));
        const startSalary = Math.round(h.salary * era.salaryInflation * (1 + (state.expansionTier - 1) * 0.25));
        const canAfford = state.cash >= hireCost && cooldownLeft === 0;

        html += '<div class="entity-card">' +
          '<div>' +
            '<div class="entity-title-row"><h4>' + esc(h.name) + '</h4><span class="pill">Salary: ' + ENG.formatMoney(startSalary) + '/mo</span></div>' +
            '<div class="entity-tagline">"' + esc(h.tagline) + '"</div>' +
            '<p class="entity-desc"><b>Trait — ' + esc(h.traitTitle) + ':</b> ' + esc(h.traitDesc) + '</p>' +
            (cooldownLeft > 0 ? '<p class="entity-desc" style="color:var(--red);margin-top:4px;"><b>Poached by ' + esc(dep.rivalName) + ':</b> Non-compete ' + cooldownLeft + ' mos remaining.</p>' : '') +
          '</div>' +
          '<div class="stat-mini-row">' +
            '<span>Pop: ' + h.popularity + '</span>' +
            '<span>Rel: ' + h.reliability + '%</span>' +
            '<span>Cont: ' + h.controversy + '</span>' +
          '</div>' +
          '<div class="entity-actions">' +
            '<span class="pill">Signing Fee: ' + ENG.formatMoney(hireCost) + '</span>' +
            '<button class="btn btn-sm btn-primary btn-hire" data-id="' + esc(h.id) + '" ' + (!canAfford ? 'disabled' : '') + '>' + (cooldownLeft > 0 ? 'Locked at Rival' : 'Hire Talent') + '</button>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    container.innerHTML = html;

    container.querySelectorAll('.btn-hire').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.hireHost(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-fire').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.fireHost(state, btn.dataset.id);
        if (res.ok) SFX.playClick(); else SFX.playWarning();
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-bonus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.giveHostBonus(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-renew-host').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.renewHostContract(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });
  }

  /* =========================================================
     TAB 3: ADVERTISERS & CONTRACTS
     ========================================================= */
  function renderAdvertisersTab(container) {
    const maxSlots = ENG.getMaxAdvertiserSlots(state);
    const active = DATA.ADVERTISERS.filter(function (a) { return state.activeAdvertiserIds.indexOf(a.id) !== -1; });
    const available = DATA.ADVERTISERS.filter(function (a) { return state.activeAdvertiserIds.indexOf(a.id) === -1; });
    const proj = ENG.calculateMonthlyProjection(state);
    const onAirCategories = DATA.TIME_BLOCKS.map(function (b) {
      const slot = state.schedule[b.id];
      const sh = slot ? byId(DATA.SHOWS, slot.showId) : null;
      return sh ? sh.category : '';
    });

    let html = '<div class="section-intro">' +
      '<div><h2>Advertising Sponsors &amp; Contracts</h2><p>Sponsors operate on timed contracts and track whether you air their preferred programming with manageable controversy.</p></div>' +
      '<span class="pill accent">Sponsor Slots: ' + active.length + ' / ' + maxSlots + '</span>' +
      '</div>';

    html += '<div class="slot-card" style="margin-bottom:16px;">' +
      '<div class="slot-header"><h3>Commercial Ad Load</h3><span class="pill">Controls Revenue vs. Listener Patience</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">';
    DATA.COMMERCIAL_LOADS.forEach(function (cl) {
      const sel = state.commercialLoadId === cl.id ? 'btn-primary' : 'btn-ghost';
      html += '<button class="btn btn-sm ' + sel + ' btn-comm-load" data-id="' + esc(cl.id) + '">' + esc(cl.name) + '</button>';
    });
    html += '</div></div>';

    html += '<h3 class="subhead">Active Sponsor Contracts (' + active.length + ' / ' + maxSlots + ')</h3><div class="cards-grid">';
    if (active.length === 0) {
      html += '<div class="entity-card"><p class="entity-desc">No active advertisers signed. Sign a sponsor below!</p></div>';
    }
    active.forEach(function (adv) {
      const pItem = proj.adBreakdown.find(function (x) { return x.id === adv.id; });
      const est = pItem ? pItem.payout : adv.basePayout;
      const earnedTotal = state.advertiserRevenueMap[adv.id] || 0;
      const contract = (state.advertiserContracts && state.advertiserContracts[adv.id]) || { monthsLeft: 8, satisfaction: 72, rateMult: 1.0 };
      const prefersMatched = onAirCategories.indexOf(adv.preferredCategory) !== -1;
      const promoCost = Math.round((adv.basePayout * 0.35) * (1 + (state.expansionTier - 1) * 0.3));

      html += '<div class="entity-card active-card">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(adv.name) + '</h4><span class="pill good">Est. ' + ENG.formatMoney(est) + '/mo</span></div>' +
          '<div class="entity-tagline">"' + esc(adv.tagline) + '"</div>' +
          '<p class="entity-desc">Personality: ' + esc(adv.personality) + '</p>' +
        '</div>' +
        '<div class="stat-mini-row">' +
          '<span style="color:' + (contract.satisfaction < 45 ? 'var(--red)' : 'var(--green)') + '">Sponsor Sat: ' + Math.round(contract.satisfaction) + '%</span>' +
          '<span>Expires: ' + contract.monthsLeft + 'm</span>' +
          '<span>Rate: ' + (contract.rateMult || 1).toFixed(2) + 'x</span>' +
          '<span>Paid: ' + ENG.formatMoney(earnedTotal) + '</span>' +
        '</div>' +
        '<div class="slot-metrics">' +
          '<span class="pill ' + (prefersMatched ? 'good' : 'warn') + '">Wants: ' + esc(adv.preferredCategory) + (prefersMatched ? ' ✓' : ' (Missing)') + '</span>' +
          '<span class="pill">Max Controversy: ' + (adv.sensitivity + 20) + '</span>' +
        '</div>' +
        '<div class="entity-actions">' +
          '<button class="btn btn-sm btn-primary btn-renew-adv" data-id="' + esc(adv.id) + '" ' + (state.cash < promoCost ? 'disabled' : '') + '>Extend (+5% Rate, ' + ENG.formatMoney(promoCost) + ')</button>' +
          '<button class="btn btn-sm btn-ghost btn-drop-adv" data-id="' + esc(adv.id) + '">Drop</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    html += '<h3 class="subhead">Prospective Regional Sponsors</h3><div class="cards-grid">';
    available.forEach(function (adv) {
      const meetsListeners = state.listeners >= adv.minListeners;
      const hasSlot = active.length < maxSlots;
      const canSign = meetsListeners && hasSlot;
      html += '<div class="entity-card">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(adv.name) + '</h4><span class="pill">Base ' + ENG.formatMoney(adv.basePayout) + '+</span></div>' +
          '<div class="entity-tagline">"' + esc(adv.tagline) + '"</div>' +
          '<p class="entity-desc">Personality: ' + esc(adv.personality) + ' • Prefers: <b>' + esc(adv.preferredCategory) + '</b></p>' +
        '</div>' +
        '<div class="stat-mini-row">' +
          '<span>Min Listeners: ' + adv.minListeners.toLocaleString('en-US') + '</span>' +
          '<span>Sensitivity: ' + adv.sensitivity + '</span>' +
          '<span>Risk: ' + adv.risk + '</span>' +
        '</div>' +
        '<div class="entity-actions">' +
          (!meetsListeners ? '<span class="pill warn">Needs ' + adv.minListeners.toLocaleString('en-US') + ' Listeners</span>' : '') +
          '<button class="btn btn-sm btn-primary btn-sign-adv" data-id="' + esc(adv.id) + '" ' + (!canSign ? 'disabled' : '') + '>Sign Contract</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    container.innerHTML = html;

    container.querySelectorAll('.btn-comm-load').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SFX.playClick();
        ENG.setCommercialLoad(state, btn.dataset.id);
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-sign-adv').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.signAdvertiser(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-renew-adv').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.renewAdvertiserContract(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });

    container.querySelectorAll('.btn-drop-adv').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SFX.playClick();
        ENG.dropAdvertiser(state, btn.dataset.id);
        renderDashboard();
      });
    });
  }

  /* =========================================================
     TAB 4: STATION UPGRADES
     ========================================================= */
  function renderUpgradesTab(container) {
    let html = '<div class="section-intro">' +
      '<div><h2>Engineering &amp; Facility Upgrades</h2><p>Expand signal reach, unlock absurd programming, and open extra sponsor slots.</p></div>' +
      '<span class="pill accent">Owned: ' + state.upgradeIds.length + ' / ' + DATA.UPGRADES.length + '</span>' +
      '</div><div class="cards-grid">';

    DATA.UPGRADES.forEach(function (upg) {
      const owned = state.upgradeIds.indexOf(upg.id) !== -1;
      const canBuy = !owned && state.cash >= upg.cost;

      html += '<div class="entity-card ' + (owned ? 'owned' : '') + '">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(upg.name) + '</h4>' +
          (owned ? '<span class="pill good">✓ INSTALLED</span>' : '<span class="pill accent">' + ENG.formatMoney(upg.cost) + '</span>') +
          '</div>' +
          '<p class="entity-desc" style="margin:6px 0;">' + esc(upg.description) + '</p>' +
          '<p class="entity-desc" style="color:var(--amber);"><b>Unlock:</b> ' + esc(upg.specialUnlock) + '</p>' +
        '</div>' +
        '<div class="stat-mini-row">' +
          '<span>Cov +' + upg.coverageBonus + '%</span>' +
          '<span>Rat +' + upg.ratingsBonus + '</span>' +
          '<span>Upkeep ' + ENG.formatMoney(upg.maintenance) + '/mo</span>' +
          '<span>Val +' + ENG.formatMoney(upg.valueBonus) + '</span>' +
        '</div>' +
        '<div class="entity-actions">' +
          (owned
            ? '<span class="pill good">Active On Air</span>'
            : '<button class="btn btn-sm btn-primary btn-buy-upg" data-id="' + esc(upg.id) + '" ' + (!canBuy ? 'disabled' : '') + '>Buy Upgrade (' + ENG.formatMoney(upg.cost) + ')</button>') +
        '</div>' +
      '</div>';
    });

    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.btn-buy-upg').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.buyUpgrade(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });
  }

  /* =========================================================
     TAB 5: RIVALS, EXPANSION TIERS & MONEY SINKS
     ========================================================= */
  function renderRivalsTab(container) {
    const rivals = ENG.getActiveRivals(state);
    const curTier = ENG.getExpansionTierObj(state.expansionTier || 1);
    const nextTier = ENG.getExpansionTierObj((state.expansionTier || 1) + 1);
    const hasNext = nextTier && nextTier.tier > curTier.tier;
    const canExpand = hasNext && state.signalCoverage >= nextTier.minCoverage && state.cash >= nextTier.cost;
    const era = ENG.getCurrentEra(state.year);

    let html = '<div class="section-intro">' +
      '<div><h2>Market Rivals, Regional Expansion &amp; Capital Projects</h2><p>Compete against rival stations across evolving eras and invest capital into statewide &amp; national syndication.</p></div>' +
      '<span class="pill accent">Tier ' + curTier.tier + ' / 7: ' + esc(curTier.name) + '</span>' +
      '</div>';

    html += '<h3 class="subhead">Regional Broadcast &amp; Syndication Ladder</h3>' +
      '<div class="tier-ladder">';
    DATA.EXPANSION_TIERS.forEach(function (t) {
      const cls = t.tier === curTier.tier ? 'current' : (t.tier < curTier.tier ? 'completed' : '');
      html += '<div class="tier-step ' + cls + '">' +
        '<h4>' + t.tier + '. ' + esc(t.name) + '</h4>' +
        '<div class="entity-desc">Cap: ' + t.maxListenersCap.toLocaleString('en-US') + ' • Ad ' + t.adTierMult.toFixed(2) + 'x</div>' +
        '<div class="entity-desc">Upkeep: ' + ENG.formatMoney(t.monthlyUpkeep) + '/mo</div>' +
        '<div class="entity-desc" style="color:var(--amber)">' + (t.tier === curTier.tier ? '★ ACTIVE TIER' : (t.tier < curTier.tier ? '✓ Surpassed' : 'Cost: ' + ENG.formatMoney(t.cost) + ' (Cov ' + t.minCoverage + '%)')) + '</div>' +
      '</div>';
    });
    html += '</div>';

    if (hasNext) {
      html += '<div class="slot-card" style="margin-bottom:18px;">' +
        '<div class="slot-header"><h3>Next Footprint: ' + esc(nextTier.name) + '</h3><span class="pill accent">' + ENG.formatMoney(nextTier.cost) + '</span></div>' +
        '<p class="entity-desc" style="margin:6px 0;">Requires <b>' + nextTier.minCoverage + '% Signal Coverage</b> (currently ' + state.signalCoverage + '%). Unlocks audience cap up to <b>' + nextTier.maxListenersCap.toLocaleString('en-US') + '</b> and ' + nextTier.adTierMult.toFixed(2) + 'x ad rates. Monthly network lease: ' + ENG.formatMoney(nextTier.monthlyUpkeep) + '/mo. <i>' + esc(nextTier.riskNote) + '</i></p>' +
        '<button id="btnExpandTier" class="btn btn-primary" type="button" ' + (!canExpand ? 'disabled' : '') + '>📡 Expand to ' + esc(nextTier.name) + ' (' + ENG.formatMoney(nextTier.cost) + ')</button>' +
      '</div>';
    }

    html += '<h3 class="subhead">Competing Broadcast Stations (' + esc(era.name) + ')</h3><div class="cards-grid">';
    rivals.forEach(function (r) {
      const poached = r.poachedHosts && r.poachedHosts.length ? r.poachedHosts.join(', ') : 'None';
      html += '<div class="entity-card">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(r.callSign) + '</h4><span class="pill warn">' + r.ratings.toFixed(1) + '% Share</span></div>' +
          '<div class="entity-tagline">"' + esc(r.nickname) + '"</div>' +
          '<p class="entity-desc">' + esc(r.personality) + '</p>' +
          (r.lastHeadline ? '<p class="entity-desc" style="color:var(--amber);margin-top:6px;">📰 ' + esc(r.lastHeadline) + '</p>' : '') +
        '</div>' +
        '<div class="stat-mini-row">' +
          '<span>Listeners: ' + Number(r.listeners).toLocaleString('en-US') + '</span>' +
          '<span>Strong In: ' + esc(r.strengths.join(', ')) + '</span>' +
          '<span>Poached: ' + esc(poached) + '</span>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    html += '<h3 class="subhead">Executive Capital Operations (Money Sinks)</h3><div class="cards-grid">';
    DATA.EXECUTIVE_PROJECTS.forEach(function (proj) {
      const cost = ENG.getExecutiveProjectCost(state, proj.id);
      const canRun = state.cash >= cost;
      html += '<div class="entity-card">' +
        '<div>' +
          '<div class="entity-title-row"><h4>' + esc(proj.name) + '</h4><span class="pill accent">' + ENG.formatMoney(cost) + '</span></div>' +
          '<p class="entity-desc" style="margin-top:6px;">' + esc(proj.desc) + '</p>' +
        '</div>' +
        '<div class="entity-actions">' +
          '<button class="btn btn-sm btn-primary btn-exec-proj" data-id="' + esc(proj.id) + '" ' + (!canRun ? 'disabled' : '') + '>Execute (' + ENG.formatMoney(cost) + ')</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    container.innerHTML = html;

    const expandBtn = $('btnExpandTier');
    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        const res = ENG.upgradeExpansionTier(state);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    }

    container.querySelectorAll('.btn-exec-proj').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const res = ENG.runExecutiveProject(state, btn.dataset.id);
        if (res.ok) SFX.playSuccess(); else SFX.playWarning();
        renderDashboard();
      });
    });
  }

  /* =========================================================
     TAB 6: OFFICE, STRATEGY, PERSISTENT CONSEQUENCES & LOG
     ========================================================= */
  function renderOfficeTab(container) {
    let html = '<div class="section-intro">' +
      '<div><h2>Editorial Posture, Persistent Consequences &amp; Log</h2><p>Every strategy carries sharp tradeoffs over time. Past mistakes linger across years.</p></div>' +
      '<button id="btnOfficeRetire" class="btn btn-sm btn-danger" type="button">' +
        (confirmRetirePending ? 'Confirm Early Retirement?' : '🏖️ Retire Early') +
      '</button>' +
      '</div>';

    html += '<h3 class="subhead">Editorial &amp; Management Strategy (Active Streak: ' + (state.strategyMonthsActive || 0) + ' mos)</h3><div class="strategy-grid">';
    DATA.STRATEGIES.forEach(function (st) {
      const sel = state.strategyId === st.id ? ' selected' : '';
      html += '<button class="strategy-card' + sel + '" data-id="' + esc(st.id) + '" type="button">' +
        '<b>' + esc(st.name) + (sel ? ' (ACTIVE)' : '') + '</b>' +
        '<small>' + esc(st.desc) + '</small>' +
      '</button>';
    });
    html += '</div>';

    html += '<h3 class="subhead">Active Persistent Consequences (' + (state.activeConsequences || []).length + ')</h3>';
    if (!state.activeConsequences || state.activeConsequences.length === 0) {
      html += '<p class="entity-desc" style="margin-bottom:14px;">No active lawsuits, FCC probes, or long-term reputation effects currently running.</p>';
    } else {
      html += '<div class="consequence-list">';
      state.activeConsequences.forEach(function (c) {
        html += '<div class="consequence-card ' + (c.kind === 'positive' ? 'positive' : '') + '">' +
          '<b><span>' + esc(c.title) + '</span><span>' + c.monthsLeft + ' mos left</span></b>' +
          '<div class="entity-desc">' + esc(c.desc) + '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    html += '<h3 class="subhead">Career Achievements (' + state.achievements.length + ' / ' + DATA.ACHIEVEMENTS.length + ')</h3><div class="ach-grid">';
    DATA.ACHIEVEMENTS.forEach(function (ach) {
      const unlocked = state.achievements.indexOf(ach.id) !== -1;
      html += '<div class="ach-item ' + (unlocked ? 'unlocked' : '') + '">' +
        '<b>' + (unlocked ? '🏆 ' : '🔒 ') + esc(ach.name) + '</b>' +
        '<span>' + esc(ach.desc) + '</span>' +
      '</div>';
    });
    html += '</div>';

    html += '<h3 class="subhead">Major Special Incidents Experienced</h3>';
    if (state.majorEventsExperienced.length === 0) {
      html += '<p class="entity-desc">No historic run-defining special incidents yet. Keep broadcasting!</p>';
    } else {
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">' +
        state.majorEventsExperienced.map(function (ev) { return '<span class="pill accent">⚡ ' + esc(ev) + '</span>'; }).join('') +
      '</div>';
    }

    html += '<h3 class="subhead">Station Career Log</h3><ul class="log-list">' +
      state.careerLog.slice().reverse().map(function (line) { return '<li>' + esc(line) + '</li>'; }).join('') +
    '</ul>';

    container.innerHTML = html;

    container.querySelectorAll('.strategy-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SFX.playClick();
        ENG.setStrategy(state, btn.dataset.id);
        renderDashboard();
      });
    });

    const retireBtn = $('btnOfficeRetire');
    if (retireBtn) {
      retireBtn.addEventListener('click', triggerEarlyRetirement);
    }
  }

  function triggerEarlyRetirement() {
    if (!confirmRetirePending) {
      confirmRetirePending = true;
      SFX.playWarning();
      renderActiveTab();
      const sideRet = $('btnRetireEarly');
      if (sideRet) sideRet.textContent = '⚠️ Click Again to Retire';
      return;
    }
    SFX.playSuccess();
    const summary = ENG.retireEarly(state);
    renderDashboard();
    openEndgameModal(summary);
  }

  /* =========================================================
     MID-MONTH 4-WEEK SIMULATION & INTERRUPT DIALOGS
     ========================================================= */
  function startMonthTurn() {
    if (!state || state.isEnded) return;
    SFX.playClick();
    confirmRetirePending = false;
    currentSim = ENG.beginMonthSimulation(state);
    $('simHeader').textContent = currentSim.calendarLabel;
    $('simLogBox').innerHTML = '<div>[' + esc(currentSim.calendarLabel) + '] Transmitter warmed up. Starting Month ' + state.turn + '...</div>';
    $('simInterruptCard').classList.add('hidden');
    $('simRunningBanner').classList.remove('hidden');
    $('simStatusText').textContent = 'Simulating Week 1 broadcast...';
    updateWeekPills(0);
    openModal('modal-simulation');

    clearTimeout(simTimer);
    simTimer = setTimeout(stepSimulationWeek, 260);
  }

  function updateWeekPills(activeWeek) {
    document.querySelectorAll('.wk-pill').forEach(function (pill) {
      const w = Number(pill.dataset.wk);
      pill.classList.toggle('active', w === activeWeek);
      pill.classList.toggle('done', w < activeWeek);
    });
  }

  function appendSimLog(text) {
    const log = $('simLogBox');
    const div = document.createElement('div');
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function stepSimulationWeek() {
    if (!currentSim) return;
    const step = ENG.advanceSimulationWeek(state, currentSim);
    if (step.done) {
      updateWeekPills(5);
      $('simStatusText').textContent = 'Tallying monthly ratings & advertiser ledger...';
      simTimer = setTimeout(finishMonthTurn, 260);
      return;
    }

    updateWeekPills(step.week);
    if (!step.event) {
      $('simStatusText').textContent = 'Week ' + step.week + ' clear across the dial...';
      appendSimLog('Week ' + step.week + ': Smooth programming across all four daily time blocks.');
      simTimer = setTimeout(stepSimulationWeek, 280);
      return;
    }

    // Pause simulation for interrupt choice!
    const ev = step.event;
    if (ev.isEmergency || ev.isSpecialIncident) {
      SFX.playEmergencyAlert();
    } else {
      SFX.playTeletype();
    }

    $('simRunningBanner').classList.add('hidden');
    $('simInterruptCard').classList.remove('hidden');
    $('intBadge').textContent = ev.category || 'BREAKING NEWS';
    $('intEmergencyTag').classList.toggle('hidden', !ev.isEmergency);
    $('intIcon').textContent = ev.icon || '📻';
    $('intTitle').textContent = ev.title;
    $('intDesc').textContent = ev.description;

    const choicesBox = $('intChoices');
    choicesBox.innerHTML = '';
    step.choices.forEach(function (ch, idx) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      const tagsHtml = (ch.tags || []).map(function (t) {
        const isNeg = t.indexOf('-') === 0 || t.indexOf('--') !== -1;
        const isPos = t.indexOf('+') === 0;
        const cls = isNeg ? 'warn' : (isPos ? 'good' : 'accent');
        return '<span class="pill ' + cls + '">' + esc(t) + '</span>';
      }).join('');
      btn.innerHTML = '<span class="choice-label">' + esc(ch.label) + '</span><div class="choice-tags">' + tagsHtml + '</div>';
      btn.addEventListener('click', function () {
        handleInterruptChoice(ev, idx);
      });
      choicesBox.appendChild(btn);
    });
  }

  function handleInterruptChoice(ev, choiceIndex) {
    const res = ENG.resolveInterruptChoice(state, currentSim, ev, choiceIndex);
    if (res && (res.trustDelta < -3 || res.fccDelta < -3)) {
      SFX.playWarning();
    } else {
      SFX.playClick();
    }

    $('simInterruptCard').classList.add('hidden');
    $('simRunningBanner').classList.remove('hidden');
    $('simStatusText').textContent = 'Resuming broadcast schedule...';
    if (res && res.reportLine) {
      appendSimLog('→ ' + res.reportLine);
    }

    simTimer = setTimeout(stepSimulationWeek, 320);
  }

  function finishMonthTurn() {
    const report = ENG.finalizeMonth(state, currentSim);
    currentSim = null;
    closeModal('modal-simulation');
    renderDashboard();
    openMonthlyReportModal(report);
  }

  /* =========================================================
     MONTHLY REPORT MODAL
     ========================================================= */
  function openMonthlyReportModal(rep) {
    if (!rep) return;
    $('repHeader').textContent = rep.header;
    $('repTurnBadge').textContent = 'MONTH ' + rep.turnCompleted + ' / ' + ENG.MAX_MONTHS;

    const d = rep.deltas;
    const items = [
      { lbl: 'Listeners', val: d.listeners, money: false, pct: false },
      { lbl: 'Ratings', val: d.ratings, money: false, pct: true },
      { lbl: 'Public Trust', val: d.trust, money: false, pct: false },
      { lbl: 'Ad Sat', val: d.adSat, money: false, pct: false },
      { lbl: 'FCC Standing', val: d.fcc, money: false, pct: false },
      { lbl: 'Morale', val: d.morale, money: false, pct: false }
    ];

    $('repDeltas').innerHTML = items.map(function (it) {
      const txt = it.pct ? ((it.val >= 0 ? '+' : '') + Number(it.val).toFixed(1) + '%') : ENG.formatSigned(it.val, false);
      const cls = it.val > 0 ? 'pos' : (it.val < 0 ? 'neg' : '');
      return '<div class="rep-delta-pill">' + esc(it.lbl) + ' <b class="' + cls + '">' + esc(txt) + '</b></div>';
    }).join('');

    $('repHighlights').innerHTML = rep.highlights.map(function (h) {
      return '<li>' + esc(h) + '</li>';
    }).join('');

    $('repAdRev').textContent = ENG.formatMoney(rep.adRevenue);
    const bonusTotal = (rep.bonusSponsorCash || 0) + Math.max(0, rep.eventCashNet || 0);
    $('repBonusCash').textContent = '+' + ENG.formatMoney(bonusTotal);
    $('repBonusRow').classList.toggle('hidden', bonusTotal === 0);

    const opCosts = rep.totalExpenses - (rep.fccFine || 0);
    $('repExp').textContent = '-' + ENG.formatMoney(opCosts);
    $('repFccFine').textContent = '-' + ENG.formatMoney(rep.fccFine || 0);
    $('repFccFineRow').classList.toggle('hidden', !rep.fccFine);

    const netEl = $('repNet');
    netEl.textContent = ENG.formatSigned(rep.netProfit, true);
    netEl.className = rep.netProfit >= 0 ? 'pos' : 'neg';

    $('btnReportNext').textContent = rep.ended ? 'VIEW CAREER SUMMARY ▶' : 'NEXT MONTH ▶';

    if (rep.netProfit >= 0 && !rep.ended) SFX.playSuccess();
    openModal('modal-report');
  }

  /* =========================================================
     ENDGAME CAREER REPORT & SCORE SUBMISSION
     ========================================================= */
  function openEndgameModal(summary) {
    if (!summary) return;
    const isRetirement = summary.careerResult === 'Retired Legend' || summary.careerResult === 'Early Retirement';
    $('endBanner').classList.toggle('failed', !isRetirement);
    $('endTitle').textContent = summary.careerResult.toUpperCase();
    $('endReason').textContent = summary.reason || '';
    $('endBiography').textContent = '"' + summary.biography + '"';

    const majorStr = summary.majorEventsExperienced && summary.majorEventsExperienced.length
      ? summary.majorEventsExperienced.join(', ')
      : 'None (Quiet Small-Town Run)';

    const gridItems = [
      { k: 'Manager Name', v: summary.managerName },
      { k: 'Station Name', v: summary.stationName },
      { k: 'Years Survived', v: summary.yearsSurvived + ' yrs (' + summary.monthsSurvived + ' mos)' },
      { k: 'Final Cash', v: ENG.formatMoney(summary.finalCash) },
      { k: 'Peak Listeners', v: Number(summary.peakListeners).toLocaleString('en-US') },
      { k: 'Peak Ratings', v: summary.peakRatings.toFixed(1) + '%' },
      { k: 'Highest Station Value', v: ENG.formatMoney(summary.highestStationValue) },
      { k: 'FCC Violations', v: String(summary.fccViolations) },
      { k: 'Most Popular Host', v: summary.mostPopularHost },
      { k: 'Most Profitable Sponsor', v: summary.mostProfitableAdvertiser },
      { k: 'Strongest Show', v: summary.strongestShow },
      { k: 'Career Score', v: Number(summary.careerScore).toLocaleString('en-US') }
    ];

    $('endStatsGrid').innerHTML = gridItems.map(function (it) {
      return '<div class="end-stat"><span>' + esc(it.k) + '</span><b>' + esc(it.v) + '</b></div>';
    }).join('') +
      '<div class="end-stat" style="grid-column: 1 / -1;"><span>Major Events Experienced</span><b>' + esc(majorStr) + '</b></div>';

    const runKey = summary.managerName + '|' + summary.stationName + '|' + summary.careerScore + '|' + summary.monthsSurvived;
    const alreadySubmitted = lastSubmittedRunKey === runKey;
    $('submitIdentityPreview').textContent = 'Manager: ' + summary.managerName + ' • Station: ' + summary.stationName + ' • Score: ' + summary.careerScore.toLocaleString('en-US');
    $('btnSubmitScore').disabled = alreadySubmitted;
    $('btnSubmitScore').textContent = alreadySubmitted ? '✓ SCORE SUBMITTED' : '🏆 SUBMIT SCORE';
    $('submitScoreStatus').textContent = alreadySubmitted ? 'Career score uploaded to leaderboard.' : '';

    openModal('modal-endgame');
  }

  function submitCurrentScore() {
    if (!state || !state.endingSummary) return;
    const sum = state.endingSummary;
    const runKey = sum.managerName + '|' + sum.stationName + '|' + sum.careerScore + '|' + sum.monthsSurvived;
    if (lastSubmittedRunKey === runKey) return;

    const btn = $('btnSubmitScore');
    const status = $('submitScoreStatus');
    btn.disabled = true;
    status.textContent = 'Uploading career record...';
    status.className = 'submit-status';

    const payload = {
      manager_name: sum.managerName,
      station_name: sum.stationName,
      score: sum.careerScore,
      years_survived: sum.yearsSurvived,
      months_survived: sum.monthsSurvived,
      peak_listeners: sum.peakListeners,
      peak_ratings: sum.peakRatings,
      station_value: sum.highestStationValue,
      fcc_violations: sum.fccViolations,
      career_result: sum.careerResult
    };

    fetch('api/submit_score.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || ct.indexOf('application/json') === -1) throw new Error('PHP unavailable');
        return r.json();
      })
      .then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.error) || 'Upload failed');
        lastSubmittedRunKey = runKey;
        btn.textContent = '✓ SCORE SUBMITTED';
        status.textContent = 'Uploaded to Global Leaderboard! Overall Rank #' + res.rank;
        status.className = 'submit-status pos';
        SFX.playSuccess();
      })
      .catch(function () {
        // Fallback to localStorage leaderboard if PHP server isn't active
        const rank = saveLocalLeaderboardEntry(payload);
        lastSubmittedRunKey = runKey;
        btn.textContent = '✓ SAVED LOCALLY';
        status.textContent = 'Saved to Local Leaderboard (Rank #' + rank + '). Deploy with PHP for global SQLite storage.';
        status.className = 'submit-status pos';
        SFX.playSuccess();
      });
  }

  /* =========================================================
     LEADERBOARD (PHP + SQLite + Local Fallback)
     ========================================================= */
  function getLocalLeaderboardRows() {
    try {
      const raw = localStorage.getItem(ENG.LOCAL_BOARD_KEY);
      const custom = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(custom) ? custom : [];
      return DATA.SEED_LEADERBOARD.concat(list);
    } catch (e) {
      return DATA.SEED_LEADERBOARD.slice();
    }
  }

  function saveLocalLeaderboardEntry(payload) {
    let custom = [];
    try {
      const raw = localStorage.getItem(ENG.LOCAL_BOARD_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) custom = parsed;
    } catch (e) {}

    const entry = Object.assign({}, payload, {
      date_completed: new Date().toISOString().slice(0, 10)
    });
    custom.push(entry);
    if (custom.length > 100) custom = custom.slice(-100);
    try {
      localStorage.setItem(ENG.LOCAL_BOARD_KEY, JSON.stringify(custom));
    } catch (e) {}

    const all = getLocalLeaderboardRows().sort(function (a, b) {
      return b.score - a.score;
    });
    return all.findIndex(function (x) { return x === entry || (x.manager_name === entry.manager_name && x.score === entry.score); }) + 1 || 1;
  }

  function sortLocalEntries(rows, category) {
    const copy = rows.slice();
    copy.sort(function (a, b) {
      if (category === 'listeners') return (b.peak_listeners - a.peak_listeners) || (b.score - a.score);
      if (category === 'value') return (b.station_value - a.station_value) || (b.score - a.score);
      if (category === 'longest') return (b.months_survived - a.months_survived) || (b.score - a.score);
      if (category === 'fcc') return (b.fcc_violations - a.fcc_violations) || (b.months_survived - a.months_survived) || (b.score - a.score);
      return (b.score - a.score) || (b.months_survived - a.months_survived);
    });
    return copy.slice(0, 25).map(function (row, idx) {
      return Object.assign({}, row, { rank: idx + 1 });
    });
  }

  function getPrimaryMetricHeader(cat) {
    if (cat === 'listeners') return 'Peak Listeners';
    if (cat === 'value') return 'Station Value';
    if (cat === 'longest') return 'Months Survived';
    if (cat === 'fcc') return 'FCC Violations';
    return 'Score';
  }

  function formatPrimaryMetric(row, cat) {
    if (cat === 'listeners') return Number(row.peak_listeners).toLocaleString('en-US');
    if (cat === 'value') return ENG.formatMoney(row.station_value);
    if (cat === 'longest') return row.months_survived + ' mos (' + row.years_survived + 'y)';
    if (cat === 'fcc') return Number(row.fcc_violations).toLocaleString('en-US') + ' violations';
    return Number(row.score).toLocaleString('en-US');
  }

  function renderLeaderboardRows(entries, cat) {
    $('lbPrimaryCol').textContent = getPrimaryMetricHeader(cat);
    const body = $('lbBody');
    if (!entries || entries.length === 0) {
      body.innerHTML = '';
      $('lbMessage').textContent = 'No completed station careers recorded yet.';
      return;
    }
    $('lbMessage').textContent = '';
    const activeMgr = state ? state.managerName.toLowerCase() : '';

    body.innerHTML = entries.map(function (row) {
      const isMe = activeMgr && row.manager_name.toLowerCase() === activeMgr && state && state.stationName.toLowerCase() === row.station_name.toLowerCase();
      return '<tr class="' + (isMe ? 'me' : '') + '">' +
        '<td>' + row.rank + '</td>' +
        '<td><b>' + esc(row.manager_name) + '</b></td>' +
        '<td>' + esc(row.station_name) + '</td>' +
        '<td><b>' + esc(formatPrimaryMetric(row, cat)) + '</b></td>' +
        '<td>' + row.years_survived + 'y (' + row.months_survived + 'm)</td>' +
        '<td>' + esc(row.career_result) + '</td>' +
        '<td>' + esc(row.date_completed) + '</td>' +
      '</tr>';
    }).join('');
  }

  function loadLeaderboard(cat) {
    activeLeaderboardCat = cat || activeLeaderboardCat || 'score';
    document.querySelectorAll('#lbCategoryTabs .lb-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.cat === activeLeaderboardCat);
    });
    $('lbBody').innerHTML = '';
    $('lbMessage').textContent = 'Loading broadcast records...';

    fetch('api/leaderboard.php?category=' + encodeURIComponent(activeLeaderboardCat) + '&limit=25&_=' + Date.now(), { cache: 'no-store' })
      .then(function (r) {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || ct.indexOf('application/json') === -1) throw new Error('PHP unavailable');
        return r.json();
      })
      .then(function (res) {
        if (!res || !res.ok) throw new Error('Bad payload');
        $('lbModeNotice').textContent = 'Global Leaderboard (PHP + SQLite)';
        renderLeaderboardRows(res.entries, activeLeaderboardCat);
      })
      .catch(function () {
        $('lbModeNotice').textContent = 'Local Leaderboard Active (Run via PHP for shared SQLite board)';
        const rows = sortLocalEntries(getLocalLeaderboardRows(), activeLeaderboardCat);
        renderLeaderboardRows(rows, activeLeaderboardCat);
      });
  }

  function openLeaderboard(cat) {
    openModal('modal-leaderboard');
    loadLeaderboard(cat || 'score');
  }

  /* =========================================================
     EVENT WIRING & INITIALIZATION
     ========================================================= */
  function bindEvents() {
    $('btnHdrSfx').addEventListener('click', function () {
      SFX.toggleMute();
      syncSfxButton();
    });

    $('btnHdrBoard').addEventListener('click', function () {
      SFX.playClick();
      openLeaderboard('score');
    });

    $('btnHdrMenu').addEventListener('click', function () {
      SFX.playClick();
      refreshTitleScreen();
    });

    // Title Screen Buttons
    $('btnFreshNew').addEventListener('click', function () {
      SFX.playClick();
      openNewCareerModal();
    });
    $('btnFreshBoard').addEventListener('click', function () {
      SFX.playClick();
      openLeaderboard('score');
    });

    $('btnContinue').addEventListener('click', function () {
      SFX.playClick();
      const saved = ENG.loadCareer();
      if (saved) enterGame(saved);
      else refreshTitleScreen();
    });

    $('btnStartNewSaved').addEventListener('click', function () {
      SFX.playWarning();
      openModal('modal-confirm-new');
    });

    $('btnSavedBoard').addEventListener('click', function () {
      SFX.playClick();
      openLeaderboard('score');
    });

    $('btnConfirmNo').addEventListener('click', function () {
      SFX.playClick();
      closeModal('modal-confirm-new');
    });

    $('btnConfirmYes').addEventListener('click', function () {
      SFX.playClick();
      ENG.clearSavedCareer();
      closeModal('modal-confirm-new');
      refreshTitleScreen();
      openNewCareerModal();
    });

    // New Career Form & Presets
    document.querySelectorAll('.preset-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        SFX.playClick();
        $('inputStationName').value = pill.dataset.preset;
      });
    });

    $('formNewCareer').addEventListener('submit', function (e) {
      e.preventDefault();
      const mgr = $('inputManagerName').value.trim();
      const stn = $('inputStationName').value.trim() || 'WSTF 1120 AM';
      if (!mgr) {
        $('errManagerName').textContent = 'Manager Name is required to begin your broadcasting career.';
        SFX.playWarning();
        $('inputManagerName').focus();
        return;
      }
      SFX.playSuccess();
      const newState = ENG.createNewCareer(mgr, stn);
      closeModal('modal-new-career');
      enterGame(newState);
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SFX.playClick();
        confirmRetirePending = false;
        activeTab = btn.dataset.tab;
        syncTabButtons();
        renderActiveTab();
      });
    });

    // Sidebar controls
    $('btnAdvanceMonth').addEventListener('click', startMonthTurn);
    $('btnViewLastReport').addEventListener('click', function () {
      SFX.playClick();
      if (state && state.lastReport) openMonthlyReportModal(state.lastReport);
    });
    $('btnRetireEarly').addEventListener('click', triggerEarlyRetirement);

    // Report next button
    $('btnReportNext').addEventListener('click', function () {
      SFX.playClick();
      closeModal('modal-report');
      if (state && state.isEnded && state.endingSummary) {
        openEndgameModal(state.endingSummary);
      }
    });

    // Endgame modal buttons
    $('btnSubmitScore').addEventListener('click', submitCurrentScore);
    $('btnEndBoard').addEventListener('click', function () {
      SFX.playClick();
      openLeaderboard('score');
    });
    $('btnEndNew').addEventListener('click', function () {
      SFX.playClick();
      closeModal('modal-endgame');
      openNewCareerModal();
    });
    $('btnEndMenu').addEventListener('click', function () {
      SFX.playClick();
      closeModal('modal-endgame');
      refreshTitleScreen();
    });

    // Leaderboard category tabs
    document.querySelectorAll('#lbCategoryTabs .lb-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        SFX.playClick();
        loadLeaderboard(tab.dataset.cat);
      });
    });
    $('btnLbRefresh').addEventListener('click', function () {
      SFX.playClick();
      loadLeaderboard(activeLeaderboardCat);
    });

    // Generic modal close triggers
    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SFX.playClick();
        closeModal(btn.dataset.close);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncSfxButton();
    bindEvents();
    refreshTitleScreen();
  });
})();
