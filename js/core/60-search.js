/* ==========================================================================
   সার্চ ইঞ্জিন · সব পেজ একসাথে ও তারিখ দিয়ে খোঁজা
   ফাইল: js/core/60-search.js
   ========================================================================== */
  const SI = { idx: null, q: '', t: null };
  function bangNorm(v) {
      return (v || '').toString().toLowerCase()
        .replace(/[\u09e6-\u09ef]/g, d => String(d.charCodeAt(0) - 0x09e6))
        .replace(/[\u0966-\u096f]/g, d => String(d.charCodeAt(0) - 0x0966))
        .replace(/[।॥,;:!?"'“”‘’()\[\]{}··–—-]/g, ' ')
        .replace(/\s+/g, ' ').trim();
    }
  function buildSearchIndex() {
      const out = [];
      const add = (t, sub, r, k) => out.push({ t, s: sub || '', r, k: k || '', tt: bangNorm(t), ss: bangNorm(sub + ' ' + (k || '')) });
      [['হোম', 'আজকের পাঠ ও পঞ্জিকা', '#/home', 'পর্দা'],
       ['গ্রন্থাগার', 'শাস্ত্র, বই ও অডিও', '#/library', 'পর্দা'],
       ['পঞ্জিকা', 'তিথি · নক্ষত্র · উৎসব', '#/panjika', 'পর্দা'],
       ['উৎসব পঞ্জি', 'বছরের পার্বণ-তালিকা', '#/panjika/calendar', 'পঞ্জিকা'],
       ['শুভ সময়', 'শুভক্ষণ ও লগ্ন', '#/panjika/shubho', 'পঞ্জিকা'],
       ['রাশিফল', 'দৈনিক রাশিফল', '#/panjika/rashifal', 'পঞ্জিকা'],
       ['বিবাহ মিলন', 'কুষ্ঠি মিলন', '#/panjika/bibaho', 'পঞ্জিকা'],
       ['ফিড', 'পোস্ট ও আলোচনা', '#/feed', 'পর্দা'],
       ['রিলস', 'ভিডিও ফিড', '#/reels', 'পর্দা'],
       ['পরীক্ষা', 'সাপ্তাহিক পরীক্ষা ও কুইজ', '#/exam', 'পর্দা'],
       ['সাধনা', 'জপ · ধ্যান · যোগা', '#/sadhana', 'পর্দা'],
       ['সেবা ও দান', 'অভিযান ও সহায়তা', '#/seva', 'পর্দা'],
       ['মার্কেটপ্লেস', 'দক্ষ সেবা ও টিউটর', '#/market', 'পর্দা'],
       ['আমার অগ্রগতি', 'প্রোফাইল ও পরিসংখ্যান', '#/me', 'পর্দা'],
       ['সেটিংস', 'থিম, ধ্বনি, নাম', '#/settings', 'পর্দা'],
       ['নোট', 'ব্যক্তিগত নোট', '#/notes', 'পর্দা']
      ].forEach(x => add(x[0], x[1], x[2], x[3]));

      (DB.books || []).forEach(b => {
        add(b.title, b.author + ' · ' + (b.tag || ''), '#/book/' + b.id, 'গ্রন্থ');
        (b.texts || []).forEach((x, i) => {
          if (!x) return;
          const t = x.ch ? 'অধ্যায় ' + x.ch + ' · শ্লোক ' + (x.v || i + 1) : 'শ্লোক ' + (i + 1);
          add(t, (x.bn || x.sk || '').toString().replace(/\s+/g, ' ').slice(0, 100), '#/reader/' + b.id + '/' + i, 'শ্লোক');
        });
      });
      (DB.courses || []).forEach(c => add(c.title, c.summary || c.level || '', '#/course/' + c.id, 'কোর্স'));
      (DB.pujas || []).forEach(p => add(p.title, p.summary || p.time || '', '#/puja/' + p.id, 'পূজা'));
      (DEVA || []).forEach(d => add(d.n + ' পূজা', d.sub + ' · ' + d.items, '#/puja/deva/' + d.id, 'পূজা দর্পণ'));
      (DB.quizzes && DB.quizzes.weekly ? [DB.quizzes.weekly] : []).forEach(q => add(q.title, q.topic || '', '#/quiz', 'কুইজ'));
      (DB.asanas || []).forEach(a => add(a.name, a.benefit || a.level || '', '#/sadhana', 'যোগাসন'));
      (DB.japas || []).forEach(j => add(j.title, j.note || '', '#/sadhana', 'জপ'));
      (DB.meditations || []).forEach(m => add(m.title, m.note || (m.mins + ' মিনিট'), '#/sadhana', 'ধ্যান'));
      (DB.campaigns || []).forEach(c => add(c.title, c.blurb || c.sh || '', '#/seva', 'অভিযান'));
      (DB.providers || []).forEach(p => add(p.name, p.role || p.cat || '', '#/market', 'সেবাদাতা'));
      ((DB.feed && DB.feed.posts) || []).forEach(p => add(p.name + ' — পোস্ট', (p.text || '').slice(0, 90), '#/feed', 'ফিড'));
      ((DB.feed && DB.feed.reels) || []).forEach(r => add(r.title, r.sub || '', '#/reels/' + r.id, 'রিলস'));
      (DB.gitaAudio || []).forEach(g => add('গীতা অডিও · অধ্যায় ' + g.ch, g.name + ' · ' + g.dur, '#/gita/' + g.ch, 'অডিও'));
      (DB.bhaktiAudio || []).forEach(b => add(b.name, (b.cat || '') + ' · ' + (b.ch || ''), '#/gita', 'কীর্তন'));
      Object.entries((DB.panjika && DB.panjika.festivals) || {}).forEach(([d, n]) =>
        add(n, d, '#/panjika/calendar', 'উৎসব'));
      return out;
    }
  function searchAll(qRaw) {
      const q = bangNorm(qRaw);
      if (!q) return [];
      if (!SI.idx) SI.idx = buildSearchIndex();
      const toks = q.split(' ').filter(Boolean);
      const strict = [], loose = [];
      for (const e of SI.idx) {
        let sc = 0, hit = 0;
        for (const t of toks) {
          let s = 0;
          if (e.tt === t) s = 130;
          else if (e.tt.startsWith(t)) s = 100;
          else if (e.tt.includes(t)) s = 70;
          else if (e.ss.includes(t)) s = 32;
          if (s) { sc += s; hit++; }
        }
        if (!hit) continue;
        const KW = { 'গ্রন্থ': 30, 'পর্দা': 14, 'কোর্স': 12, 'পূজা': 10, 'অভিযান': 10, 'কুইজ': 8, 'উৎসব': 6 };
        sc += KW[e.k] || 0;
        sc += Math.min(18, hit * 6) - Math.min(14, e.t.length / 6);
        (hit === toks.length ? strict : loose).push([sc, e]);
      }
      const rank = a => a.sort((x, y) => y[0] - x[0] || x[1].t.length - y[1].t.length);
      return (strict.length ? rank(strict) : rank(loose)).slice(0, 12).map(x => x[1]);
    }
  function parseSearchDate(raw) {
      const text = String(raw || '').trim().replace(/[০-৯]/g, d => String(d.charCodeAt(0) - 0x09e6)).replace(/[०-९]/g, d => String(d.charCodeAt(0) - 0x0966));
      let day, month, year, assumed = '';
      let match = text.match(/^(\d{4})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})$/);
      if (match) { year = +match[1]; month = +match[2]; day = +match[3]; }
      else if ((match = text.match(/^(\d{1,2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{4})$/)) || (match = text.match(/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})$/))) { day = +match[1]; month = +match[2]; year = +match[3]; }
      else if (/^\d{8}$/.test(text)) {
        const yFirst = +text.slice(0,4), mFirst = +text.slice(4,6), dFirst = +text.slice(6,8);
        if (yFirst >= 1900 && yFirst <= 2100 && mFirst >= 1 && mFirst <= 12 && dFirst >= 1 && dFirst <= 31) { year = yFirst; month = mFirst; day = dFirst; }
        else { day = +text.slice(0,2); month = +text.slice(2,4); year = +text.slice(4,8); }
      }
      else if ((match = text.match(/^(\d{1,2})\s*[-/]\s*(\d{1,2})$/)) && +match[2] <= 12) { day = +match[1]; month = +match[2]; year = TODAY.getFullYear(); assumed = 'বছর না থাকায় চলতি বছর ধরা হয়েছে'; }
      else if ((match = text.match(/^(\d{1,2})$/)) && +match[1] >= 1 && +match[1] <= 31) { day = +match[1]; month = TODAY.getMonth() + 1; year = TODAY.getFullYear(); assumed = 'শুধু দিন থাকায় চলতি মাস ও বছর ধরা হয়েছে'; }
      else return null;
      if (year < 1900 || year > 2100) return { invalid: true, reason: '১৯০০ থেকে ২১০০ সালের একটি তারিখ লিখুন।' };
      const date = new Date(year, month - 1, day);
      if (month < 1 || month > 12 || day < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return { invalid: true, reason: 'তারিখটি সঠিক নয়। দিন/মাস/বছর লিখুন।' };
      return { date, key: key(date), assumed, lone: /^\d{1,2}$/.test(text) };
    }
  function dateObservances(k) {
      const entries = [];
      const add = (label, value) => { if (value) entries.push({label, value}); };
      const festivals = (P.festivals[k] || '').split('·').map(x => x.trim()).filter(Boolean);
      festivals.forEach(value => add('ব্রত ও উৎসব', value));
      for (const [field, label] of [['purnima','পূর্ণিমা'], ['amavasya','অমাবস্যা']]) {
        const value = P[field] && P[field][k];
        if (value && !festivals.some(f => f === value)) add(label, value);
      }
      (P.dibosh || []).filter(x => x[0] === k.slice(5)).forEach(x => add('দিবস', x[1]));
      (P.eclipse || []).filter(x => x.d === k).forEach(x => add('গ্রহণ', `${x.t} · ${x.k} — ${x.n}`));
      if (P.mritdosh && P.mritdosh[k]) add('মৃতদোষের তালিকা', P.mritdosh[k].split('|').join(' / ') + ' (সময় স্থানীয় পঞ্জিকায় যাচাই করুন)');
      return entries;
    }
  function searchDateHTML(info) {
      if (info.invalid) return `<div class="ref-date-result"><b>তারিখটি পরীক্ষা করুন</b><p>${esc(info.reason)}</p></div>`;
      const d = info.date, k = info.key, bd = bengaliDate(d), pk = panjikaFor(k), events = dateObservances(k);
      const inFestRange = k >= '2026-04-14' && k <= '2028-04-13';
      return `<div class="ref-date-result">
        <div class="ref-date-result-head"><span>তারিখের ফলাফল · আরও দেখতে নিচে স্ক্রল করুন ↓</span><strong>${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}</strong>
          <small>${bnDateShort(bd)} · ${bd.season} ঋতু</small>${info.assumed ? `<small>${esc(info.assumed)}</small>` : ''}</div>
        <div class="ref-date-facts"><span>তিথি <b>${esc(pk.tithi)}</b></span><span>নক্ষত্র <b>${esc(pk.nak)}</b></span><span>সূর্যোদয় <b>${esc(pk.sunrise)}</b></span><span>সূর্যাস্ত <b>${esc(pk.sunset)}</b></span><span>শুভ সময় <b>${esc(pk.shubho)}</b></span><span>রাহুকাল <b>${esc(pk.rahu)}</b></span></div>
        <div class="ref-date-events"><b>এই তারিখের বিষয়</b>${events.length ? events.map(o => `<div><small>${esc(o.label)}</small><span>${esc(o.value)}</span></div>`).join('') : '<p>অ্যাপের তালিকায় এই তারিখে কোনো বিষয় পাওয়া যায়নি।</p>'}</div>
        <p class="ref-date-caution">ঢাকাভিত্তিক আনুমানিক পঞ্জিকা। স্থানীয় পঞ্জিকার সঙ্গে মিলিয়ে নিন। ${inFestRange ? 'উৎসবের তালিকা সীমিত।' : 'এই তারিখ অ্যাপের মূল উৎসব-তালিকার বাইরে; সব উৎসব দেখানো সম্ভব নয়।'}</p>
        <button type="button" class="ref-date-open" data-act="searchDateGo" data-k="${k}">এই দিনের বিস্তারিত পঞ্জিকা দেখুন →</button>
      </div>`;
    }
  function searchResultsHTML(q) {
      if (!bangNorm(q)) {
        return `<div class="sres-empty">${vico('search', 'sm')}<div>কিছু লিখুন — যেমন <b>গীতা</b>, <b>ধ্যান</b>, <b>অক্ষয়</b>, <b>২:৪৭</b>, <b>যোগাসন</b></div></div>`;
      }
      const dateInfo = parseSearchDate(q);
      const dateResult = dateInfo ? searchDateHTML(dateInfo) : '';
      if (dateInfo && !dateInfo.lone) return dateResult;
      const list = searchAll(q);
      if (!list.length && dateResult) return dateResult;
      if (!list.length) {
        return `<div class="sres-empty">${vico('search', 'sm')}<div>“${esc(q)}” — কিছু পাওয়া যায়নি।<br/><span class="mini muted">অন্য শব্দ বা ছোট কীওয়ার্ড দিয়ে দেখুন।</span></div></div>`;
      }
      return dateResult + list.map(e => `<button class="sres" data-act="searchGo" data-to="${e.r}">
          <span class="sres-k">${esc(e.k || '·')}</span>
          <span class="sres-t"><b>${esc(e.t)}</b>${e.s ? `<i>${esc(e.s)}</i>` : ''}</span>
          ${vico('arrow', 'sm sr-arrow')}
        </button>`).join('') + `<div class="sres-count">${bn(list.length)}টি মিল পাওয়া গেল</div>`;
    }
  function searchPopHTML() {
      return `<div class="setpop-bg" data-act="searchClose" aria-hidden="true"></div>
        <div class="setpop-card search-card" role="dialog" aria-modal="true" aria-label="সার্চ">
          <div class="setpop-head">
            <div>
              <div class="mini muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700;font-size:9px">Search</div>
              <div class="display" style="font-size:16px;margin-top:2px">খুঁজুন</div>
            </div>
            <button class="iconbtn" data-act="searchClose" aria-label="বন্ধ করুন">${vico('close')}</button>
          </div>
          <div class="sbar">
            ${vico('search', 'sm')}
            <input id="sq" class="sq" type="search" inputmode="search" autocomplete="off"
              placeholder="গীতা, ধ্যান, অক্ষয় তৃতীয়া, ২:৪৭…" aria-label="যা খুঁজছেন লিখুন" />
          </div>
          <div class="search-res" id="searchRes">${searchResultsHTML('')}</div>
        </div>`;
    }
  function openSearchPop() {
      let host = document.getElementById('searchPop');
      if (!host) {
        document.body.insertAdjacentHTML('beforeend', '<div id="searchPop" class="setpop searchpop"></div>');
        host = document.getElementById('searchPop');
      }
      host.innerHTML = searchPopHTML();
      host.classList.add('on');
      document.body.classList.add('setpop-lock');
      setTimeout(() => { const q = document.getElementById('sq'); if (q) q.focus(); }, 90);
    }
  function closeSearchPop() {
      const host = document.getElementById('searchPop');
      if (host) { host.classList.remove('on'); host.innerHTML = ''; }
      document.body.classList.remove('setpop-lock');
    }
  function runSearch(val) {
      const box = document.getElementById('searchRes');
      if (box) box.innerHTML = searchResultsHTML(val);
    }
  const DAILY_TASK_LABELS = ['সকালের নিত্যকর্ম সম্পন্ন', 'গীতা ২.৪৭ পাঠ', 'সন্ধ্যা আরতি ও কুইজ'];
  function dailyTasksHTML() {
      const values = S.rituals[TODAY_KEY] || [false, false, false];
      const count = values.filter(Boolean).length;
      return `<div class="setpop-bg" data-act="dailyTasksClose" aria-hidden="true"></div>
        <div class="setpop-card daily-task-card" role="dialog" aria-modal="true" aria-labelledby="daily-task-title">
          <div class="setpop-head"><div><div class="daily-task-kicker">দৈনিক কাজ</div><h2 id="daily-task-title">আজকের সাধনা</h2></div>
            <button class="iconbtn" data-act="dailyTasksClose" aria-label="বন্ধ করুন">${vico('close')}</button></div>
          <div class="daily-task-progress"><b>${bn(count)} / ৩ সম্পন্ন</b><span>${count === 3 ? 'আজকের সব কাজ সম্পন্ন' : `আর ${bn(3-count)}টি বাকি`}</span></div>
          <div class="daily-task-bar" aria-hidden="true"><i style="width:${count / 3 * 100}%"></i></div>
          <p class="daily-task-hint">কাজ শেষ হলে নিজে চিহ্নিত করুন।</p>
          <div class="daily-task-list">${DAILY_TASK_LABELS.map((label,i) => `<button class="daily-task-row${values[i] ? ' is-done' : ''}" type="button" role="checkbox" aria-checked="${values[i] ? 'true' : 'false'}" data-act="dailyTaskToggle" data-i="${i}"><span class="daily-task-check" aria-hidden="true">${values[i] ? '✓' : ''}</span><span>${esc(label)}</span></button>`).join('')}</div>
          <button class="btn gold block daily-task-go" data-act="dailyTaskGo">সাধনা বিভাগে যান →</button>
          <div class="daily-task-foot">অগ্রগতি এই ব্রাউজারে সংরক্ষিত থাকে</div>
        </div>`;
    }
  function openDailyTasks() {
      let host = document.getElementById('dailyTaskPop');
      if (!host) { document.body.insertAdjacentHTML('beforeend', '<div id="dailyTaskPop" class="setpop daily-task-pop"></div>'); host = document.getElementById('dailyTaskPop'); }
      host.innerHTML = dailyTasksHTML(); host.classList.add('on'); document.body.classList.add('setpop-lock');
      const close = host.querySelector('button[data-act="dailyTasksClose"]'); if (close) close.focus();
    }
  function refreshDailyTasks() {
      const host = document.getElementById('dailyTaskPop');
      if (host && host.classList.contains('on')) host.innerHTML = dailyTasksHTML();
    }
  function closeDailyTasks() {
      const host = document.getElementById('dailyTaskPop');
      if (!host || !host.classList.contains('on')) return;
      host.classList.remove('on'); host.innerHTML = ''; document.body.classList.remove('setpop-lock');
      const card = document.querySelector('.ref-sadhana'); if (card) card.focus();
    }
  function setPopHTML() {
      return `<div class="setpop-bg" data-act="setPopupClose" aria-hidden="true"></div>
        <div class="setpop-card" role="dialog" aria-modal="true" aria-label="সেটিংস">
          <div class="setpop-head">
            <div>
              <div class="mini muted" style="letter-spacing:.14em;text-transform:uppercase;font-weight:700;font-size:9px">Preferences</div>
              <div class="display" style="font-size:16px;margin-top:2px">সেটিংস</div>
            </div>
            <button class="iconbtn" data-act="setPopupClose" aria-label="বন্ধ করুন">${vico('close')}</button>
          </div>
          <div class="setpop-theme">
            <button class="segt ${S.theme === 'light' ? 'on' : ''}" data-act="themeSet" data-v="light">☀ লাইট</button>
            <button class="segt ${S.theme === 'dark' ? 'on' : ''}" data-act="themeSet" data-v="dark">🌙 ডার্ক</button>
          </div>
          ${prefCard()}
          <div class="mini muted" style="text-align:center;margin-top:10px;line-height:1.6">ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</div>
        </div>`;
    }
  function openSetPop() {
      let host = document.getElementById('setPop');
      if (!host) {
        document.body.insertAdjacentHTML('beforeend', '<div id="setPop" class="setpop"></div>');
        host = document.getElementById('setPop');
      }
      host.innerHTML = setPopHTML();
      host.classList.add('on');
      document.body.classList.add('setpop-lock');
    }
  function refreshSetPop() {
      const host = document.getElementById('setPop');
      if (host && host.classList.contains('on')) host.innerHTML = setPopHTML();
    }
  function closeSetPop() {
      const host = document.getElementById('setPop');
      if (host) { host.classList.remove('on'); host.innerHTML = ''; }
      document.body.classList.remove('setpop-lock');
    }
