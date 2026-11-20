/* ==========================================================================
   ৯. পঞ্জিকা — ১৬ বিভাগ, ক্যালেন্ডার, রাশিফল, বিবাহ-লগ্ন
   ফাইল: js/views/panjika.js
   ========================================================================== */
  /* দেশ-সিলেক্টর — বাংলাদেশ / ভারত (দুই দেশের ঘড়ি ও তিথি) */
  function regionPicker(compact) {
      const cur = regionKey();
      return `<div class="region-bar" role="group" aria-label="পঞ্জিকার দেশ নির্বাচন">
        <span class="region-lab">${compact ? '' : 'পঞ্জিকার দেশ'}</span>
        <div class="segment region-seg">
          ${['BD', 'IN'].map(k => `<button class="${cur === k ? 'on' : ''}" data-act="regionSet" data-v="${k}" aria-pressed="${cur === k}">
            ${PLACES[k].name}<span class="region-clock">${PLACES[k].clock}</span></button>`).join('')}
        </div>
      </div>`;
    }
  function regionNote() {
      const pl = placeOf();
      return `<p class="mini muted region-note">এখন <b>${pl.name}</b>-এর পঞ্জিকা দেখছেন — সময় ${pl.city} শহরের ঘড়ি ${pl.clock} অনুযায়ী। উৎসবের দিন দুই দেশের তিথি মিলিয়ে দেখানো হচ্ছে। দেশ বদলে অন্য দেশের দিনক্ষণ ও সময় দেখুন।</p>`;
    }
  /* দুই দেশের তুলনা কার্ড — একই দিনে তিথি/উৎসব আলাদা হলে স্পষ্ট দেখায় */
  function regionCompareCard(k) {
      const c = regionCompare(k || U.panjika.day || TODAY_KEY);
      const rows = [c.rb, c.ri].map(r => `<div class="rcmp-row ${r.rk === regionKey() ? 'on' : ''}">
        <span class="rcmp-p">${r.place.name}<i>${r.place.city} ${r.place.clock}</i></span>
        <span class="rcmp-t">${r.tithi}</span>
        <span class="rcmp-s">সূর্যোদয় ${r.sunrise}</span></div>`).join('');
      const fBD = (festivalOn(c.dateKey, 'BD') || '').trim(), fIN = (festivalOn(c.dateKey, 'IN') || '').trim();
      const diffFest = fBD !== fIN;
      return `<div class="card pad rcmp">
        <div class="kv"><div><div class="mini muted">একই দিনে দুই দেশ</div>
          <div class="ttl" style="margin-top:3px;font-size:.95rem">${c.tithiSame ? 'তিথি মিলে গেছে' : 'তিথি আলাদা'}</div></div>
          <span class="pill ${c.tithiSame ? 'ok' : ''}">${c.tithiSame ? 'একই' : 'পার্থক্য'}</span></div>
        ${rows}
        ${diffFest ? `<div class="mini rcmp-note" style="margin-top:9px;line-height:1.7"><b>উৎসবের পার্থক্য:</b> বাংলাদেশে ${esc(fBD || 'কিছু নেই')} · ভারতে ${esc(fIN || 'কিছু নেই')}</div>` : ''}
        <button class="btn ghost sm block" style="margin-top:10px" data-act="regionOther">অন্য দেশের পঞ্জিকা দেখুন ›</button>
      </div>`;
    }
  function panjikaScreen() {
      const bt = bengaliDate(TODAY);
      const FL = festivalsFor(regionKey());
      if (U.panjika.by == null) { U.panjika.by = bt.year; U.panjika.bm = bt.m; }
      const isBn = U.panjika.view === 'bn';
      const selKey = U.panjika.day;
      const sel = panjikaFor(selKey);
      const selDate = new Date(selKey + 'T00:00:00');
      const selBn = bengaliDate(selDate);

      let head, cellsHtml, nav, note, monthStart, monthEnd;

      if (isBn) {
        const y = U.panjika.by, m = U.panjika.bm;
        const cells = banglaMonthCells(y, m);
        const lead = cells.length ? cells[0].date.getDay() : 0;
        monthStart = cells.length ? key(cells[0].date) : '0000-00-00';
        monthEnd = cells.length ? key(cells[cells.length - 1].date) : '9999-99-99';
        cellsHtml = Array.from({ length: lead }, () => '<div class="day mut"></div>').join('') +
          cells.map(c => {
            const k = key(c.date), pk = panjikaFor(k), ek = pk.ekadashi, now = k === TODAY_KEY, selected = k === selKey;
            return `<button class="day bn-day ${ek ? 'ek' : ''} ${pk.fest ? 'fest' : ''} ${now ? 'now' : ''} ${selected ? 'sel' : ''}" data-act="pday" data-k="${k}"
              title="${esc(pk.fest || '')}" aria-label="${bn(c.d)} ${BM_NAMES[m]} ${bn(y)}">
              <span class="bnn">${bn(c.d)}</span><span class="eng">${bn(c.date.getDate())}</span></button>`;
          }).join('');
        head = `${BM_NAMES[m]} ${bn(y)} বঙ্গাব্দ`;
        nav = `<button class="act" data-act="pbm" data-d="-1">◀</button><button class="act" data-act="pbm" data-d="1">▶</button>`;
        note = `ঋতু: ${BM_SEASON[m]} · ${bn(cells.length)} দিন · ইংরেজি ${bn(cells.length ? cells[0].date.getDate() : 0)} ${BN_MONTH[cells.length ? cells[0].date.getMonth() : 0]} – ${bn(cells.length ? cells[cells.length - 1].date.getDate() : 0)} ${BN_MONTH[cells.length ? cells[cells.length - 1].date.getMonth() : 0]}`;
      } else {
        const { y, m } = U.panjika;
        const first = new Date(y, m - 1, 1);
        const startDow = first.getDay();
        const daysInMonth = new Date(y, m, 0).getDate();
        const prevDays = new Date(y, m - 1, 0).getDate();
        const cells = [];
        for (let i = startDow - 1; i >= 0; i--) cells.push({ d: prevDays - i, mut: true, date: new Date(y, m - 2, prevDays - i) });
        for (let d = 1; d <= daysInMonth; d++) cells.push({ d, date: new Date(y, m - 1, d) });
        while (cells.length % 7) cells.push({ d: cells.length - startDow - daysInMonth + 1, mut: true, date: new Date(y, m - 1, daysInMonth + (cells.length - startDow - daysInMonth + 1)) });
        monthStart = key(new Date(y, m - 1, 1));
        monthEnd = key(new Date(y, m - 1, daysInMonth));
        cellsHtml = cells.map(c => {
          const k = key(c.date), pk = panjikaFor(k), ek = pk.ekadashi, now = k === TODAY_KEY, selected = k === selKey;
          const bd = bengaliDate(c.date);
          return `<button class="day bn-day ${c.mut ? 'mut' : ''} ${ek ? 'ek' : ''} ${pk.fest ? 'fest' : ''} ${now ? 'now' : ''} ${selected ? 'sel' : ''}" data-act="pday" data-k="${k}" title="${esc(pk.fest || '')}">
            <span class="bnn">${bn(c.d)}</span><span class="eng">${bn(bd.d)}</span></button>`;
        }).join('');
        head = `${BN_MONTH[m - 1]} ${bn(y)}`;
        nav = `<button class="act" data-act="pmonth" data-d="-1">◀</button><button class="act" data-act="pmonth" data-d="1">▶</button>`;
        note = `বঙ্গাব্দ ${bn(bt.year)} · ${bn(daysInMonth)} দিন`;
      }

      const festList = Object.keys(FL).filter(k => k >= monthStart && k <= monthEnd).sort();
      const selectedDayCard = `<div class="card oath pad mt pj-top-card">
          <div class="kv"><div><div class="mini muted">নির্বাচিত দিন · ${placeOf().name}</div>
            <div class="display" style="font-size:15px;margin-top:3px">${bn(selBn.d)} ${selBn.month}, ${BN_DAY[selDate.getDay()]}</div>
            <div class="mini muted" style="margin-top:3px">${bn(selDate.getDate())} ${BN_MONTH[selDate.getMonth()]} ${bn(selDate.getFullYear())} · ${bn(selBn.year)} বঙ্গাব্দ</div></div>
            <span class="pill">${sel.tithi}</span></div>
          ${sel.fest ? `<div class="mini pj-festival">✦ ${esc(sel.fest)}</div>` : ''}
          <div class="grid2 mt">
            <div class="stat"><div class="k">শুভ সময়</div><div class="v" style="color:var(--ok)">${sel.shubho}</div></div>
            <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${sel.rahu}</div></div>
            <div class="stat"><div class="k">সূর্যোদয় (${placeOf().city})</div><div class="v">${sel.sunrise}</div></div>
            <div class="stat"><div class="k">ঋতু</div><div class="v">${selBn.season}</div></div>
          </div>
          <button class="btn ghost block mt pj-card-action" data-act="pjsub" data-s="daily">দিনের মুহূর্ত ও পঞ্চাঙ্গ দেখুন</button>
        </div>`;

      return `${appbar('পঞ্জিকা ও একাদশী', 'Panjika · বঙ্গাব্দ ' + bn(bt.year))}
      <div class="pj-page pj-home-page"><div class="pad" style="padding-top:0">
        ${selectedDayCard}
        <div class="segment">
          <button class="${isBn ? 'on' : ''}" data-act="pview" data-v="bn">বাংলা (বঙ্গাব্দ)</button>
          <button class="${!isBn ? 'on' : ''}" data-act="pview" data-v="en">ইংরেজি</button>
        </div>
        ${regionPicker()}

        <div class="card pad" style="margin-bottom:12px;border:1px solid rgba(215,169,79,.45);background:linear-gradient(160deg,rgba(215,169,79,.13),rgba(215,169,79,.03))">
          <div class="kv"><div style="min-width:0"><div class="mini muted">নতুন যোগ হয়েছে — জ্যোতিষ</div>
            <div class="ttl" style="margin-top:3px;font-size:.98rem">বিয়ে-শুভদিন · মৃতদোষ · রাশি নির্ণয়</div></div>
            <span class="pill ok">নতুন</span></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px">
            <button data-act="pjsub" data-s="bibaho" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">বিয়ে-শুভদিন<div class="mini muted" style="font-weight:400;margin-top:3px">বিবাহ লগ্ন</div></button>
            <button data-act="pjsub" data-s="mritdosh" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">মৃতদোষ<div class="mini muted" style="font-weight:400;margin-top:3px">পাদ ও শান্তি</div></button>
            <button data-act="pjsub" data-s="rashi" style="padding:10px 6px;border-radius:12px;border:1px solid rgba(215,169,79,.35);background:rgba(215,169,79,.08);color:inherit;font-family:inherit;font-size:.82rem;font-weight:700;line-height:1.5;cursor:pointer">রাশি নির্ণয়<div class="mini muted" style="font-weight:400;margin-top:3px">জন্মলগ্ন ও গ্রহ</div></button>
          </div>
        </div>

        ${regionCompareCard(selKey)}


        <div class="sect"><h4>${head}</h4><div class="line"></div>${nav}</div>
        <div class="card pad">
          <div class="cal">${BN_DAYS.map(d => `<div class="h">${d}</div>`).join('')}${cellsHtml}</div>
          <div class="legend"><span><i style="background:#7e2127;border:1px solid #d7a94f"></i>একাদশী</span>
            <span><i style="background:transparent;border:1px solid var(--gold-400)"></i>উৎসব</span>
            <span><i style="background:rgba(215,169,79,.5)"></i>আজ</span>
            <span class="mini muted">${note}</span></div>
        </div>

        <div class="sect"><h4>ব্রত ও উৎসব</h4><div class="line"></div></div>
        ${festList.length ? festList.map(k => {
          const d = new Date(k + 'T00:00:00'), diff = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
          const bD = bengaliDate(d);
          return `<div class="card rowcard stack"><div class="datebox"><b>${bn(bD.d)}</b><i>${bD.month.slice(0, 4)}</i></div>
            <div style="flex:1"><div class="kv"><span class="ttl">${esc(FL[k])}</span>
              <span class="pill">${diff === 0 ? 'আজ' : diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
              <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} · ${panjikaFor(k).tithi} · শুভ ${panjikaFor(k).shubho}</div></div></div>`;
        }).join('') : '<p class="tiny muted">এই মাসে কোনো ব্রত নেই।</p>'}

        ${(() => {
          const f = nextFestInfo();
          if (!f) return '';
          return `<div class="sect"><h4>আসন্ন উৎসব</h4><div class="line"></div><span class="mini muted">${f.days === 0 ? 'আজ' : bn(f.days) + ' দিন বাকি'}</span></div>
          <div class="card pad" style="border:1px solid rgba(215,169,79,.3)">
            <div class="kv"><div style="min-width:0"><div class="ttl" style="color:var(--gold-200)">${esc(f.name)}</div>
              <div class="mini muted" style="margin-top:5px">${bn(new Date(f.k + 'T00:00:00').getDate())} ${BN_MONTH[new Date(f.k + 'T00:00:00').getMonth()]} · ${panjikaFor(f.k).tithi}</div></div>
              <span class="pill">${f.days === 0 ? 'আজ' : bn(f.days) + ' দিন'}</span></div>
            <div style="display:flex;gap:8px;margin-top:11px">
              <button class="btn ghost sm" style="flex:1" data-act="notifyAsk">${S.notifyOn ? 'রিমাইন্ডার বন্ধ করুন' : 'রিমাইন্ডার চালু করুন'}</button>
              <button class="btn ghost sm" style="flex:1" data-act="pjsub" data-s="broto">পুরো তালিকা</button>
            </div>
          </div>`;
        })()}

        <div class="sect"><h4>পঞ্জিকার বিভাগ</h4><div class="line"></div><span class="mini muted">সবই অ্যাপের ভেতরে</span></div>
        <div class="card pad xlinks">
          <div class="xchips">${PJ_SUBS.map(([sl, lb]) => pjChip(sl, lb, '')).join('')}</div>
          <div class="mini muted" style="margin-top:10px;line-height:1.65">ব্রত, একাদশী, পূর্ণিমা, অমাবস্যা, পূজা, বিশেষ দিন, দিবস, দৈনিক পঞ্জিকা, শুভকর্মের দিন, <b>বিয়ে-শুভদিন</b>, <b>মৃতদোষ</b>, <b>রাশি নির্ণয়</b>, পঞ্চাঙ্গ, রাশিফল, গ্রহণ ও ক্যালেন্ডার — সব এখানেই খুলবে।
          তারিখ মিলিয়ে নেওয়া হয়েছে <a href="https://banglapanjika.com/" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">বাংলা পঞ্জিকা</a>-র তালিকা থেকে।</div>
        </div>

        ${regionNote()}
        <p class="mini muted" style="margin-top:16px;line-height:1.7">বঙ্গাব্দ গণনা: বাংলাদেশ সংশোধিত পঞ্জিকা অনুযায়ী <b>বৈশাখ ১ = ১৪ এপ্রিল</b>. উপরের ছোট সংখ্যা ইংরেজি তারিখ। কিছু ক্ষেত্রে আঞ্চলিক পঞ্জিকায় ১ দিন পার্থক্য হতে পারে। তারিখ ও ব্রতের তালিকা মিলিয়ে নেওয়া হয়েছে <a href="https://banglapanjika.com/" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">বাংলা পঞ্জিকা</a> থেকে; বিস্তারিত জানতে মূল সাইট দেখুন।</p>
      </div><div style="height:20px"></div></div>`;
    }
  const PJ_SUBS = [
      ['broto', 'ব্রতের তালিকা'], ['ekadashi', 'একাদশী'], ['purnima', 'পূর্ণিমা'], ['amavasya', 'অমাবস্যা'],
      ['puja', 'পূজার দিন'], ['bishesh', 'বিশেষ দিন'], ['dibosh', 'দিবস'], ['daily', 'দৈনিক পঞ্জিকা'],
      ['shubho', 'শুভকর্মের দিন'], ['bibaho', 'বিয়ে-শুভদিন'], ['mritdosh', 'মৃতদোষ'], ['rashi', 'রাশি নির্ণয়'], ['panchang', 'পঞ্চাঙ্গ'], ['rashifal', 'রাশিফল'], ['grohon', 'গ্রহণ'], ['calendar', 'ক্যালেন্ডার']
    ];
  const pjChip = (slug, label, on) =>
      `<button class="xlink ${on ? 'on' : ''}" data-act="pjsub" data-s="${slug}">${label}</button>`;
  const pjChips = active =>
      `<div class="xchips">${PJ_SUBS.filter(([sl]) => sl !== 'calendar').map(([s, l]) => pjChip(s, l, s === active)).join('')}</div>`;
  const pjPairs = () => { const FL = festivalsAll(); return Object.keys(FL).sort().map(k => [k, FL[k]]); };
  const pjWhen = k => {
      const d = new Date(k + 'T00:00:00'), diff = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
      return { d, diff };
    };
  function pjRow(k, name, note) {
      const { d, diff } = pjWhen(k), bD = bengaliDate(d), pk = panjikaFor(k);
      if (!note && /একাদশী/.test(name)) note = `পারণ ${pk.mh.parana[0]}–${pk.mh.parana[1]}`;
      return `<div class="card rowcard stack"><div class="datebox"><b>${bn(bD.d)}</b><i>${bD.month.slice(0, 4)}</i></div>
        <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${esc(name)}</span>
          <span class="pill">${diff === 0 ? 'আজ' : diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
          <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${BN_DAY[d.getDay()]} · ${pk.tithi}${note ? ' · ' + note : ''}</div></div></div>`;
    }
  const pjShell = (title, sub, body, active) =>
      `${appbar(title, sub, '#/panjika')}
      <div class="pj-page"><div class="pad" style="padding-top:0">
        ${regionPicker(true)}
        ${pjChips(active)}
        <div style="height:12px"></div>${body}
      </div><div style="height:20px"></div></div>`;
  const pjEmpty = msg => `<p class="tiny muted" style="padding:14px 2px">${msg}</p>`;
  function pjList(title, sub, active, filter, desc) {
      const rows = pjPairs().filter(([k, n]) => filter(k, n));
      const shown = U.panjika.all ? rows : rows.filter(([k]) => k >= TODAY_KEY);
      const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.65">${desc}</p>
        <div class="kv" style="margin-bottom:10px"><span class="mini muted">মোট ${bn(rows.length)}টির মধ্যে ${bn(shown.length)}টি দেখানো হচ্ছে</span>
          <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>
        ${shown.length ? shown.slice(0, 150).map(([k, n]) => pjRow(k, n)).join('') : pjEmpty('এই তালিকায় এখন কোনো দিন নেই।')}`;
      return pjShell(title, sub, body, active);
    }
  function pjDaily() {
      const k = U.panjika.day || TODAY_KEY, pk = panjikaFor(k), d = new Date(k + 'T00:00:00'), bD = bengaliDate(d);
      const body = `
        <div class="sect" style="margin-top:4px"><h4>${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${BN_DAY[d.getDay()]}</h4>
          <div class="line"></div>
          <button class="act" data-act="pjday" data-d="-1">◀</button><button class="act" data-act="pjnow">আজ</button>
          <button class="act" data-act="pjday" data-d="1">▶</button></div>
        <div class="card oath pad">
          <div class="kv"><div><div class="mini muted">বঙ্গাব্দ</div>
            <div class="display" style="font-size:15px;margin-top:3px">${bn(bD.d)} ${bD.month} ${bn(bD.year)}</div>
            <div class="mini muted" style="margin-top:3px">${bD.season} ঋতু</div></div>
            <span class="pill">${pk.tithi}</span></div>
          ${(() => {
            const obs = dateObservances(k);
            if (!obs.length) return '';
            const byLab = {};
            obs.forEach(o => { (byLab[o.label] = byLab[o.label] || []).push(o.value); });
            return `<div class="mini" style="color:var(--gold-300);margin-top:9px;line-height:1.75">${Object.keys(byLab).map(l => `✦ <b>${esc(l)}:</b> ${byLab[l].map(v => esc(v)).join(' · ')}`).join('<br/>')}</div>`;
          })()}
          <div class="mini muted" style="margin-top:9px;line-height:1.5">তথ্য ${placeOf().city}-ভিত্তিক আনুমানিক গণনা ও অ্যাপের সীমিত তালিকা থেকে। স্থানীয় পঞ্জিকা মিলিয়ে নিন।</div>
          <div class="grid2 mt">
            <div class="stat"><div class="k">নক্ষত্র</div><div class="v">${pk.nak}</div></div>
            <div class="stat"><div class="k">তিথি</div><div class="v">${pk.tithi}</div></div>
            <div class="stat"><div class="k">সূর্যোদয়</div><div class="v">${pk.sunrise}</div></div>
            <div class="stat"><div class="k">সূর্যাস্ত</div><div class="v">${pk.sunset}</div></div>
            <div class="stat"><div class="k">শুভ সময়</div><div class="v" style="color:var(--ok)">${pk.shubho}</div></div>
            <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${pk.rahu}</div></div>
          </div>
          ${pk.ekadashi ? `<div class="mini" style="margin-top:10px;color:var(--gold-200)">একাদশী তিথি — উপবাসের দিন।</div>` : ''}
        </div>

        ${regionCompareCard(k)}
        <div class="sect"><h4>দিনের মুহূর্ত</h4><div class="line"></div><span class="mini muted">${placeOf().city} · ${placeOf().name}</span></div>
        <div class="card pad">
          <div class="grid2">
            <div class="stat"><div class="k">অভিজিৎ (শুভ)</div><div class="v" style="color:var(--ok)">${pk.mh.abhijit[0]}–${pk.mh.abhijit[1]}</div></div>
            <div class="stat"><div class="k">রাহুকাল</div><div class="v" style="color:var(--danger)">${pk.mh.rahu[0]}–${pk.mh.rahu[1]}</div></div>
            <div class="stat"><div class="k">যমগণ্ড</div><div class="v" style="color:var(--danger)">${pk.mh.yama[0]}–${pk.mh.yama[1]}</div></div>
            <div class="stat"><div class="k">গুলিক</div><div class="v" style="color:var(--danger)">${pk.mh.guli[0]}–${pk.mh.guli[1]}</div></div>
            <div class="stat"><div class="k">মধ্যাহ্ন</div><div class="v">${pk.mh.noon}</div></div>
            <div class="stat"><div class="k">দিনের দৈর্ঘ্য</div><div class="v">${Math.floor(pk.mh.len / 60)} ঘ ${String(Math.round(pk.mh.len % 60)).padStart(2, '0')} মি</div></div>
          </div>
          ${pk.ekadashi ? `<div class="card pad mt" style="background:rgba(215,169,79,.08);border:1px solid rgba(215,169,79,.25)">
            <div class="mini" style="color:var(--gold-200);font-weight:600">একাদশীর পারণ</div>
            <div class="mini" style="margin-top:5px;line-height:1.7">সূর্যোদয় ${pk.mh.parana[0]} থেকে ${pk.mh.parana[1]}-এর মধ্যে (দিনের প্রথম ১/৪ ভাগ)। গোস্বামী ও স্মার্ত মতে সময়ে সামান্য পার্থক্য হতে পারে — পারণের আগে স্থানীয় পঞ্জিকা মিলিয়ে নিন।</div></div>` : ''}
          <div class="mini muted" style="margin-top:10px;line-height:1.7">সূর্যোদয়-সূর্যাস্ত আট ভাগে ভাগ করে বার অনুসারে রাহু, যমগণ্ড ও গুলিকের কাল গণনা করা হয়েছে (${placeOf().city}-এর অক্ষাংশ-দ্রাঘিমা, ${placeOf().clock})।</div>
        </div>
        <div class="sect"><h4>আগামী ৪ দিন</h4><div class="line"></div></div>
        ${[1, 2, 3, 4].map(i => {
          const kk = key(new Date(d.getTime() + i * DAY_MS));
          return pjRow(kk, festivalsAll()[kk] || panjikaFor(kk).tithi, '');
        }).join('')}`;
      return pjShell('দৈনিক পঞ্জিকা', 'Daily panjika', body, 'daily');
    }
  function pjPanchang() {
      const y = U.panjika.by, m = U.panjika.bm, cells = banglaMonthCells(y, m);
      const rows = cells.map(c => {
        const k = key(c.date), pk = panjikaFor(k);
        return `<div class="pgrow"><span class="pgd">${bn(c.d)}</span><span class="pgw">${BN_DAY[c.date.getDay()].slice(0, 3)}</span>
          <span class="pgt">${pk.tithi}</span><span class="pgn">${pk.nak}</span>
          <span class="pgf">${pk.fest ? esc(pk.fest) : '—'}</span></div>`;
      }).join('');
      const body = `<div class="sect" style="margin-top:4px"><h4>${BM_NAMES[m]} ${bn(y)} বঙ্গাব্দ</h4><div class="line"></div>
          <button class="act" data-act="pbm" data-d="-1">◀</button><button class="act" data-act="pbm" data-d="1">▶</button></div>
        <div class="card pad"><div class="pghead"><span class="pgd">তারিখ</span><span class="pgw">বার</span><span class="pgt">তিথি</span><span class="pgn">নক্ষত্র</span><span class="pgf">উৎসব</span></div>
          ${rows}</div>
        <p class="mini muted" style="margin-top:12px;line-height:1.7">তিথি ও নক্ষত্র সূর্যোদয়-ভিত্তিক; স্থানীয় পঞ্জিকায় সামান্য পার্থক্য হতে পারে।</p>`;
      return pjShell('পঞ্চাঙ্গ', 'Panchang · মাসিক তিথি-নক্ষত্র', body, 'panchang');
    }
  function pjRashifal() {
      const R = P.rashi, day = new Date(TODAY_KEY).getDate(), mon = TODAY.getMonth() + 1;
      const cards = R.names.map((n, i) => {
        const t = R.lines[(day + i * 7 + mon * 3) % R.lines.length];
        return `<div class="card pad" style="margin-bottom:9px">
          <div class="kv"><span class="ttl">${n} রাশি</span><span class="pill">শুভ ${R.lucky[(day + i) % R.lucky.length]} · ${R.color[(mon + i) % R.color.length]}</span></div>
          <div class="mini" style="margin-top:7px;line-height:1.75">${t}</div>
          <div class="mini muted" style="margin-top:6px">ইষ্টদেব: ${R.deity[i]}</div></div>`;
      }).join('');
      const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">আজ ${bn(new Date(TODAY_KEY).getDate())} ${BN_MONTH[TODAY.getMonth()]} — ১২ রাশির দিনফল।</p>${cards}
        <p class="mini muted" style="margin-top:10px;line-height:1.7">রাশিফল সাধারণ পঞ্জিকার ধারা অনুসারে সাজানো; জীবনের বড় সিদ্ধান্তে নিজের বিচার ও গুরুজনের পরামর্শই প্রধান।</p>`;
      return pjShell('রাশিফল', 'Rashifal · আজকের দিনফল', body, 'rashifal');
    }
  function pjGrohon() {
      const rows = P.eclipse.map(e => {
        const { d, diff } = pjWhen(e.d), bD = bengaliDate(d);
        return `<div class="card rowcard stack"><div class="datebox"><b>${bn(d.getDate())}</b><i>${BN_MONTH[d.getMonth()].slice(0, 4)}</i></div>
          <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${e.t} · ${e.k}</span>
            <span class="pill ${diff < 0 ? 'flat' : ''}">${diff > 0 ? bn(diff) + ' দিন' : 'সম্পন্ন'}</span></div>
            <div class="mini muted" style="margin-top:5px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${bn(bD.d)} ${bD.month} · ${e.n}</div></div></div>`;
      }).join('');
      return pjShell('গ্রহণ', 'Grahan · ২০২৬–২০২৮',
        `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সূর্যগ্রহণ ও চন্দ্রগ্রহণের তালিকা। কোথা থেকে কতটা দেখা যাবে তা লেখা আছে — বাংলাদেশ থেকে দৃশ্যমানতা স্থানীয় পঞ্জিকা দেখে নিন।</p>${rows}`,
        'grohon');
    }
  function pjDibosh() {
      const items = P.dibosh.map(([md, name]) => {
        const [mm, dd] = md.split('-').map(Number);
        let d = new Date(TODAY.getFullYear(), mm - 1, dd);
        if (key(d) < TODAY_KEY) d = new Date(TODAY.getFullYear() + 1, mm - 1, dd);
        return { d, name, diff: Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS) };
      }).sort((a, b) => a.diff - b.diff);
      const rows = items.map(o => `<div class="card rowcard stack"><div class="datebox"><b>${bn(o.d.getDate())}</b><i>${BN_MONTH[o.d.getMonth()].slice(0, 4)}</i></div>
        <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${o.name}</span><span class="pill ${o.diff > 30 ? 'flat' : ''}">${bn(o.diff)} দিন</span></div>
          <div class="mini muted" style="margin-top:5px">${bn(o.d.getDate())} ${BN_MONTH[o.d.getMonth()]} ${bn(o.d.getFullYear())} · ${BN_DAY[o.d.getDay()]}</div></div></div>`).join('');
      return pjShell('দিবস', 'National & international days',
        `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">জাতীয় ও আন্তর্জাতিক দিবস — আসন্ন দিনগুলো আগে দেখানো হচ্ছে।</p>${rows}`, 'dibosh');
    }
  function pjCalendar() {
      const y = U.panjika.by;
      const cards = BM_NAMES.map((nm, m) => {
        const cells = banglaMonthCells(y, m);
        if (!cells.length) return '';
        const a = cells[0].date, z = cells[cells.length - 1].date;
        const ks = key(a), kz = key(z);
        const count = Object.keys(festivalsAll()).filter(k => k >= ks && k <= kz).length;
        return `<button class="card pad" style="width:100%;text-align:left;border:1px solid rgba(215,169,79,.22);margin-bottom:8px;background:transparent"
          data-act="pjmonth" data-y="${y}" data-m="${m}">
          <div class="kv"><span class="ttl">${nm} ${bn(y)}</span><span class="pill">${bn(cells.length)} দিন · ${bn(count)} ব্রত</span></div>
          <div class="mini muted" style="margin-top:5px">${bn(a.getDate())} ${BN_MONTH[a.getMonth()]} – ${bn(z.getDate())} ${BN_MONTH[z.getMonth()]} ${bn(z.getFullYear())}</div></button>`;
      }).join('');
      const body = `<div class="sect" style="margin-top:4px"><h4>বঙ্গাব্দ ${bn(y)}</h4><div class="line"></div>
          <button class="act" data-act="pjyear" data-d="-1">◀</button><button class="act" data-act="pjyear" data-d="1">▶</button></div>
        ${cards}<p class="mini muted" style="margin-top:12px;line-height:1.7">মাসে ট্যাপ করলে সেই মাসের ক্যালেন্ডার খুলবে।</p>`;
      return pjShell('ক্যালেন্ডার', 'Calendar · বছরের মাস', body, 'calendar');
    }
  const NAK_CLASS = {
      sthir: [3, 11, 20, 25],            /* রোহিণী · উত্তরফাল্গুনী · উত্তরাষাঢ়া · উত্তরভাদ্রপদ */
      mridu: [4, 13, 16, 26],            /* মৃগশিরা · চিত্রা · অনুরাধা · রেবতী */
      kshipra: [0, 7, 12, 14, 22],       /* অশ্বিনী · পুষ্যা · হস্তা · স্বাতী · ধনিষ্ঠা */
      shubha: [3, 4, 9, 11, 12, 13, 16, 17, 18, 20, 21, 22, 23, 25, 26]
    };
  function karmaDates(item, fromKey, limit) {
      const out = [], start = new Date(fromKey + 'T00:00:00'), FALL = festivalsAll();
      const keys = Array.isArray(item.nak) ? item.nak : [item.nak];
      const naks = [];
      keys.forEach(x => { if (typeof x === 'number') naks.push(x); else (NAK_CLASS[x] || []).forEach(y => { if (!naks.includes(y)) naks.push(y); }); });
      for (let i = 0; i < 420 && out.length < limit; i++) {
        const d = new Date(start.getTime() + i * DAY_MS), k = key(d);
        if (item.months && !item.months.includes(bengaliDate(d).m)) continue;
        if (!item.bar.includes(d.getDay())) continue;
        const rise = sunTimes(k).rise / 60;
        const ti = tithiIndex(k, rise);
        const tno = ti < 15 ? ti + 1 : ti - 14;
        if (tno === 11 || tno === 15) continue;                 /* একাদশী ও পূর্ণিমা বর্জিত */
        if (!item.tithi.includes(tno)) continue;
        if (!naks.includes(nakIndex(k, rise))) continue;
        if (/একাদশী|অমাবস্যা|পূর্ণিমা|সংক্রান্তি/.test(FALL[k] || '')) continue;
        out.push(k);
      }
      return out;
    }
  function pjShubho() {
      const today = TODAY_KEY;
      const cards = (P.shubhoKarma || []).map(it => {
        const ds = karmaDates(it, today, 3);
        const first = ds[0];
        const { diff } = first ? pjWhen(first) : { diff: 0 };
        const fd = first ? new Date(first + 'T00:00:00') : null;
        return `<div class="card pad stack" style="margin-bottom:9px">
          <div class="kv"><div style="min-width:0"><div class="ttl">${it.name}</div>
            <div class="mini muted" style="margin-top:4px">${it.sub}</div></div>
            ${first ? `<span class="pill ${diff <= 7 ? 'ok' : ''}">${diff === 0 ? 'আজ' : bn(diff) + ' দিন'}</span>` : '<span class="pill flat">—</span>'}</div>
          ${first ? `<div class="mini" style="margin-top:8px;color:var(--gold-200)">
              পরের দিন: ${BN_DAY[fd.getDay()]}, ${bn(fd.getDate())} ${BN_MONTH[fd.getMonth()]} ${bn(fd.getFullYear())}
              <span class="muted"> · ${panjikaFor(first).tithi} · ${panjikaFor(first).nak}</span></div>
            <div class="mini muted" style="margin-top:4px">${ds.slice(1).map(k => {
              const d2 = new Date(k + 'T00:00:00');
              return `${bn(d2.getDate())} ${BN_MONTH[d2.getMonth()]}`;
            }).join(' · ') || 'আরও দিন খুঁজছি…'}</div>` : `<div class="mini muted" style="margin-top:8px">আগামী ৪২০ দিনে শুভ যোগ মেলেনি — উপনয়নের ক্ষেত্রে শুভ মাসের অপেক্ষা।</div>`}
        </div>`;
      }).join('');
      const body = `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">১৭টি শুভকর্মের পরবর্তী শুভ দিন — <b>শুভ তিথি + শুভ নক্ষত্র + শুভ বার</b> মিলিয়ে সরল নিয়মে গণনা করা, আর একাদশী/অমাবস্যা/পূর্ণিমা/সংক্রান্তি বাদ দেওয়া হয়েছে।</p>
        ${cards}
        <p class="mini muted" style="margin-top:12px;line-height:1.7">⚠️ এটি নির্দেশক তালিকা। বিয়ে, প্রতিষ্ঠা বা গৃহপ্রবেশের পূর্ণাঙ্গ মুহূর্তের জন্য লগ্ন, যোগ-করণ ও স্থানীয় পঞ্জিকা মিলিয়ে <b>পণ্ডিত/পুরোহিতের পরামর্শ</b> নিন।</p>`;
      return pjShell('শুভকর্মের দিন', 'Shubho Karma · ১৭টি সংস্কার', body, 'shubho');
    }
  const JY_CITY = [
      ['ঢাকা', 23.8103, 90.4125], ['চট্টগ্রাম', 22.3569, 91.7832], ['খুলনা', 22.8456, 89.5403],
      ['রাজশাহী', 24.3745, 88.6042], ['সিলেট', 24.8949, 91.8687], ['বরিশাল', 22.7010, 90.3535],
      ['রংপুর', 25.7439, 89.2752], ['ময়মনসিংহ', 24.7471, 90.4203], ['কুমিল্লা', 23.4607, 91.1809],
      ['নারায়ণগঞ্জ', 23.6238, 90.5000],
      /* ---- ভারত ---- */
      ['উজ্জয়িন', 23.1765, 75.7885], ['দিল্লি', 28.6139, 77.2090], ['বারাণসী', 25.3176, 82.9739],
      ['কলকাতা', 22.5726, 88.3639], ['মুম্বাই', 19.0760, 72.8777], ['বেঙ্গালুরু', 12.9716, 77.5946],
      ['চেন্নাই', 13.0827, 80.2707], ['হায়দরাবাদ', 17.3850, 78.4867], ['অমৃতসর', 31.6340, 74.8723],
      ['আহমেদাবাদ', 23.0225, 72.5714], ['পাটনা', 25.5941, 85.1376], ['গুয়াহাটি', 26.1445, 91.7362]
    ];
  const jyCityList = () => (regionKey() === 'IN' ? JY_CITY.slice(10).concat(JY_CITY.slice(0, 10)) : JY_CITY);
  const LAGNA_GOOD = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1];
  const jyState = () => {
      if (!U.jyoti) U.jyoti = { date: '1995-06-15', time: '06:30', city: regionKey() === 'IN' ? 10 : 0, day: TODAY_KEY, bday: TODAY_KEY };
      if (!U.jyoti.day) U.jyoti.day = TODAY_KEY;
      if (!U.jyoti.bday) U.jyoti.bday = TODAY_KEY;
      return U.jyoti;
    };
  const hhmm = h => {
      let t = Math.round((((h % 24) + 24) % 24) * 60) % 1440;
      const H = Math.floor(t / 60), M = t % 60;
      return bn((H < 10 ? '0' : '') + H) + ':' + bn((M < 10 ? '0' : '') + M);
    };
  const jyOK = () => typeof window.JY === 'object' && window.JY;
  function pjBibaho() {
      const JY = jyOK();
      const st = jyState();
      const k = st.bday, d = new Date(k + 'T00:00:00');
      const st2 = sunTimes(k);
      const rise = st2.rise / 60, set = st2.set / 60;
      const pk = panjikaFor(k);
      let wins = [];
      if (JY) wins = JY.lagnaWindows(k, geoFor().lat, geoFor().lon, Math.max(0, rise - 0.02), set);
      const lagnaRows = wins.map(w => {
        const good = LAGNA_GOOD[w.idx];
        return `<div class="kv" style="padding:9px 0;border-bottom:1px dashed rgba(215,169,79,.16)">
          <span class="ttl" style="font-size:.95rem">${w.name} লগ্ন</span>
          <span class="mini"><b>${hhmm(w.start)} – ${hhmm(w.end)}</b>
            <span class="pill ${good ? 'ok' : 'flat'}" style="margin-left:6px">${good ? 'শুভ' : 'চল'}</span></span></div>`;
      }).join('');
      /* আসন্ন শুভ বিবাহ-দিন */
      const TITHI = [2, 3, 5, 7, 10, 11, 12, 13];
      const NAKV = [3, 4, 9, 11, 12, 13, 14, 16, 18, 20, 21, 22, 23, 25, 26];
      const BAR = [1, 3, 4, 5];
      const days = [];
      for (let i = 0; i < 400 && days.length < 6; i++) {
        const dd = new Date(new Date(TODAY_KEY + 'T00:00:00').getTime() + i * DAY_MS), kk = key(dd);
        if ([2, 8, 11].indexOf(bengaliDate(dd).m) >= 0) continue;   /* আষাঢ় · পৌষ · চৈত্র বর্জিত */
        if (BAR.indexOf(dd.getDay()) < 0) continue;
        const r0 = sunTimes(kk).rise / 60;
        const ti = tithiIndex(kk, r0), tno = ti < 15 ? ti + 1 : ti - 14;
        if (TITHI.indexOf(tno) < 0) continue;
        if (NAKV.indexOf(nakIndex(kk, r0)) < 0) continue;
        if (/একাদশী|অমাবস্যা|পূর্ণিমা|সংক্রান্তি/.test(festivalsAll()[kk] || '')) continue;
        days.push(kk);
      }
      const dayRows = days.map(kk => {
        const d2 = new Date(kk + 'T00:00:00'), p2 = panjikaFor(kk);
        let best = '';
        if (JY) {
          const s2 = sunTimes(kk);
          const w2 = JY.lagnaWindows(kk, geoFor().lat, geoFor().lon, Math.max(0, s2.rise / 60 - 0.02), s2.set / 60)
            .filter(w => LAGNA_GOOD[w.idx]);
          const w3 = w2.filter(w => (w.end - w.start) >= 0.6);
          const pick = w3[0] || w2[0];
          if (pick) best = `শুভ লগ্ন ${hhmm(pick.start)}–${hhmm(pick.end)} (${pick.name})`;
        }
        const diff = Math.round((d2 - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
        return `<div class="card rowcard stack" style="margin-bottom:8px"><div class="datebox"><b>${bn(d2.getDate())}</b><i>${BN_MONTH[d2.getMonth()].slice(0, 4)}</i></div>
          <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${BN_DAY[d2.getDay()]} · ${p2.tithi}</span>
            <span class="pill ${diff <= 30 ? 'ok' : ''}">${diff === 0 ? 'আজ' : bn(diff) + ' দিন'}</span></div>
            <div class="mini muted" style="margin-top:4px">${p2.nak}${best ? ' · ' + best : ''}</div></div></div>`;
      }).join('');
      const body = `<div class="card oath pad stack" style="margin-bottom:10px">
          <div class="kv"><div><div class="mini muted">নির্বাচিত দিনের লগ্ন</div>
            <div class="display" style="font-size:19px;margin-top:3px">${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}</div>
            <div class="mini muted" style="margin-top:4px">${BN_DAY[d.getDay()]} · ${pk.tithi} · ${pk.nak}</div></div>
            <div style="text-align:right"><div class="mini muted">সূর্যোদয়–অস্ত</div>
              <div class="mini" style="margin-top:4px">${hhmm(rise)} – ${hhmm(set)}</div></div></div>
          <div class="kv" style="margin-top:8px">
            <button class="act" data-act="bbDay" data-d="-1">◀ আগের</button>
            <button class="act" data-act="bbNow">আজ</button>
            <button class="act" data-act="bbDay" data-d="1">পরের ▶</button></div></div>
        <div class="sect" style="margin-top:2px"><h4>এই দিনের লগ্ন ও শুভ সময়</h4><div class="line"></div>
          <span class="mini muted">${wins.length ? bn(wins.length) + 'টি লগ্ন' : ''}</span></div>
        ${lagnaRows || '<p class="mini muted" style="line-height:1.7">লগ্ন গণনার জন্য জ্যোতিষ মডিউল লোড হয়নি।</p>'}
        <p class="mini muted" style="margin-top:8px;line-height:1.7">স্থির (বৃষ, সিংহ, বৃশ্চিক, কুম্ভ) ও দ্বিস্বভাব (মিথুন, কন্যা, ধনু, মীন) লগ্ন বিবাহে শুভ; চল লগ্ন (মেষ, কর্কট, তুলা, মকর) সাধারণত বর্জনীয়।</p>
        <div class="sect" style="margin-top:16px"><h4>আসন্ন শুভ বিবাহ-দিন</h4><div class="line"></div>
          <span class="mini muted">শুভ তিথি + নক্ষত্র + বার</span></div>
        ${dayRows || '<p class="mini muted">আগামী ৪০০ দিনে শুভ যোগ পাওয়া যায়নি।</p>'}
        <p class="mini muted" style="margin-top:12px;line-height:1.7">নিয়ম: শুভ তিথি ${bn('২,৩,৫,৭,১০,১১,১২,১৩')} · শুভ নক্ষত্র রোহিণী, মৃগশিরা, মঘা, উত্তরফাল্গুনী, হস্তা, চিত্রা, স্বাতী, অনুরাধা, মূলা, উত্তরাষাঢ়া, শ্রবণা, ধনিষ্ঠা, শতভিষা*, উত্তরভাদ্রপদ, রেবতী · শুভ বার সোম, বুধ, বৃহস্পতি, শুক্র · বর্জিত মাস আষাঢ়, পৌষ, চৈত্র; একাদশী, অমাবস্যা, পূর্ণিমা ও সংক্রান্তি বাদ। <b>*</b> তালিকাটি নির্দেশক — লগ্ন-মুহূর্ত চূড়ান্ত করার আগে <b>পণ্ডিতের পরামর্শ</b> নিন।</p>`;
      return pjShell('বিয়ে-শুভদিন', 'Vivaha Lagna · বিবাহ লগ্ন ও শুভ দিন', body, 'bibaho');
    }
  const MRIT_INFO = {
      'একপাদ দোষ': '১ পাদ — হালকা দোষ',
      'দ্বিপাদ দোষ': '২ পাদ — মধ্যম দোষ',
      'ত্রিপাদ দোষ': '৩ পাদ — প্রবল দোষ',
      'চতুষ্পাদ দোষ': '৪ পাদ — ত্রিপুষ্কর, সর্বাধিক দোষ',
      'দোষ নাই': 'কোনো মৃতদোষ নেই'
    };
  function pjMritdosh() {
      const st = jyState();
      const k = st.day, d = new Date(k + 'T00:00:00');
      const pk = panjikaFor(k), raw = (P.mritdosh || {})[k] || '';
      const segs = raw ? raw.split('|') : [];
      const label = sl => MRIT_INFO[sl] || sl;
      const card = !raw
        ? `<div class="card pad stack"><div class="ttl">এই দিনের যাচাইকৃত তথ্য নেই</div>
            <p class="mini muted" style="margin:6px 0 0;line-height:1.7">মৃতদোষের যাচাইকৃত তালিকা ১৫ এপ্রিল ২০২৬ – ১৪ এপ্রিল ২০২৭ পর্যন্ত সংকলিত হয়েছে (বাংলা পঞ্জিকার প্রকাশিত সীমা)। এই দিনটির জন্য উৎসে তথ্য না থাকায় <b>অনুমান করা হয়নি</b>।</p></div>`
        : `<div class="card oath pad stack">
            <div class="kv"><div><div class="mini muted">সূর্যোদয়ের পর</div>
              <div class="display" style="font-size:18px;margin-top:3px;color:${segs[0] === 'দোষ নাই' ? 'var(--ok)' : 'var(--gold-200)'}">${segs[0]}</div>
              <div class="mini muted" style="margin-top:4px">${label(segs[0])}</div></div>
              ${segs[1] ? `<div style="text-align:right"><div class="mini muted">পরে</div>
                <div class="display" style="font-size:18px;margin-top:3px;color:${segs[1] === 'দোষ নাই' ? 'var(--ok)' : 'var(--gold-200)'}">${segs[1]}</div>
                <div class="mini muted" style="margin-top:4px">${label(segs[1])}</div></div>` : ''}</div></div>`;
      /* পরের ৩০ দিন */
      const rows = [];
      for (let i = 0; i <= 30; i++) {
        const dd = new Date(d.getTime() + i * DAY_MS), kk = key(dd), rr = (P.mritdosh || {})[kk];
        const p2 = panjikaFor(kk);
        rows.push(`<div class="card rowcard stack" style="margin-bottom:7px"><div class="datebox"><b>${bn(dd.getDate())}</b><i>${BN_MONTH[dd.getMonth()].slice(0, 4)}</i></div>
          <div style="flex:1;min-width:0"><div class="kv"><span class="ttl">${rr ? rr.split('|')[0] : '—'}</span>
            <span class="mini muted">${BN_DAY[dd.getDay()]}</span></div>
            <div class="mini muted" style="margin-top:4px">${p2.tithi} · ${p2.nak}${rr && rr.split('|')[1] ? ' · পরে ' + rr.split('|')[1] : ''}</div></div></div>`);
      }
      const body = `<p class="mini muted" style="margin:0 0 10px;line-height:1.7"><b>মৃতদোষ</b> — শাস্ত্রমতে যে যোগে জন্ম বা মৃত্যু হলে বিশেষ শান্তি বিধি পালন করতে হয়। বার, তিথি ও নক্ষত্রের দোষ মিলে পাদ সংখ্যা ঠিক হয় — এক পাদ (হালকা) থেকে চতুষ্পাদ (ত্রিপুষ্কর, প্রবল)।</p>
        <div class="kv" style="margin-bottom:8px">
          <button class="act" data-act="mdDay" data-d="-1">◀ আগের</button>
          <button class="act" data-act="mdNow">আজ</button>
          <button class="act" data-act="mdDay" data-d="1">পরের ▶</button></div>
        <div class="mini muted" style="text-align:center;margin-bottom:8px">${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())} · ${pk.tithi} · ${pk.nak}</div>
        ${card}
        <div class="sect" style="margin-top:16px"><h4>শান্তি বিধি</h4><div class="line"></div></div>
        <div class="card pad stack">
          <p class="mini" style="margin:0;line-height:1.85">
            <b>একপাদ:</b> ১০৮টি তুলসীপত্রে বিষ্ণুর পূজা, ১০৮ দুর্গানাম ও মধুসূদন জপ, ১টি শিবপূজা, সহস্রনাম ১ পাঠ।<br>
            <b>দ্বিপাদ:</b> অষ্টোত্তরশত (১০৮) তুলসীপত্র, ১০০০ দুর্গানাম, ৪টি শিবপূজা, দেবীমাহাত্ম্য ১ পাঠ, কাঞ্চনদান।<br>
            <b>ত্রিপাদ:</b> ষোড়শোপচারে বিষ্ণুপূজা, ১০০৮ তুলসীদান; ত্রিপুষ্কর খণ্ডনে ১০,০০০ তুলসীদান।<br>
            <b>গ্রহণ-বর্জন:</b> দোষ অনুসারে ১ মাস / ৬ মাস / ১ বছর গৃহত্যাগ ও স্বস্ত্যয়ন, গোদান-পিণ্ডদান; পুষ্কর তীর্থে ব্রহ্মার মন্দিরে যজ্ঞ।</p></div>
        <p class="mini muted" style="margin-top:10px;line-height:1.7">সূত্র: বাংলা পঞ্জিকার প্রতিদিনের প্রকাশিত ‘মৃতদোষ’ ও তার প্রশ্নোত্তর-শান্তি বিধি। বিধি পালনের আগে <b>পুরোহিতের পরামর্শ</b> অবশ্যই নিন।</p>
        <div class="sect" style="margin-top:16px"><h4>আগামী ৩০ দিন</h4><div class="line"></div></div>
        ${rows}
        <p class="mini muted" style="margin-top:10px;line-height:1.7">যাচাইকৃত তালিকা: ১৫ এপ্রিল ২০২৬ – ১৪ এপ্রিল ২০২৭। এর বাইরের দিনে উৎসের তথ্য না থাকায় কিছু দেখানো হয় না।</p>`;
      return pjShell('মৃতদোষ', 'Mrita Dosha · পাদ ও শান্তি', body, 'mritdosh');
    }
  function pjRashi() {
      const JY = jyOK();
      const st = jyState();
      const city = JY_CITY[st.city] || JY_CITY[0];
      const [dy, dm, dd2] = st.date.split('-').map(Number);
      const [th, tm] = st.time.split(':').map(Number);
      const jd = JY ? JY.jdLocal(dy, dm, dd2, th + tm / 60, geoFor().tz) : 0;
      const bD = bengaliDate(new Date(dy, dm - 1, dd2));
      let asc = null, pos = [];
      if (JY) {
        asc = JY.ascSid(jd, city[1], city[2]);
        pos = JY.positions(jd);
      }
      /* জন্মসময় ±২ মিনিটে লগ্ন কতটা স্থির — স্বচ্ছতা দেখানোর জন্য */
      let ascM = null, ascP = null;
      if (JY) {
        ascM = JY.ascSid(jd - 2 / 1440, city[1], city[2]);
        ascP = JY.ascSid(jd + 2 / 1440, city[1], city[2]);
      }
      const ascMName = JY ? JY.rashiOf(ascM).name : '', ascPName = JY ? JY.rashiOf(ascP).name : '';
      const ascUnstable = JY && (ascMName !== JY.RASHI[Math.floor(asc / 30)] || ascPName !== JY.RASHI[Math.floor(asc / 30)]);
      const ascSandhi = JY ? JY.sandhiDist(asc) : 99;
      const moon = pos[1] || null, sunP = pos[0] || null;
      const ascR = JY ? JY.rashiOf(asc) : null;
      const cards = JY ? `<div class="dualrow" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="card pad" style="text-align:center"><div class="mini muted">জন্মরাশি (চন্দ্র)</div>
            <div class="display" style="font-size:20px;margin-top:4px;color:var(--gold-200)">${moon.rashi}</div>
            <div class="mini muted" style="margin-top:3px">${moon.nak} ${bn(moon.pada)} পাদ</div></div>
          <div class="card pad" style="text-align:center"><div class="mini muted">জন্মলগ্ন</div>
            <div class="display" style="font-size:20px;margin-top:4px;color:var(--gold-200)">${ascR.name}</div>
            <div class="mini muted" style="margin-top:3px">${BN_DAY[new Date(dy, dm - 1, dd2).getDay()]} · ${hhmm(th + tm / 60)}</div></div>
        </div>
        <div class="card pad" style="text-align:center;margin-top:8px">
          <div class="mini muted">সূর্যরাশি</div>
          <div class="mini" style="margin-top:4px">${sunP.rashi} · ${sunP.nak} (${bn(sunP.pada)} পাদ)</div>
          <div class="mini muted" style="margin-top:4px">নবাংশ (D9): চন্দ্র ${JY.navamsaOf(moon.lon).name} · লগ্ন ${JY.navamsaOf(asc).name}</div></div>
        <div class="card pad" style="margin-top:8px;${ascUnstable || ascSandhi < 1 ? 'border-color:rgba(226,120,60,.45)' : ''}">
          <div class="mini muted">জন্মসময়ের নিশ্চয়তা (লগ্ন ${bn(-2)}–+${bn(2)} মিনিটে)</div>
          <div class="mini" style="margin-top:5px">${ascMName} · <b>${ascR.name}</b> · ${ascPName}</div>
          <div class="mini muted" style="margin-top:5px;line-height:1.7">${ascUnstable
            ? '⚠️ জন্মসময় ২ মিনিট এদিক-ওদিক হলে লগ্ন বদলে যাচ্ছে — জন্মসময় যতটা জানা আছে ঠিকভাবে দিন, নইলে লগ্ন-সংক্রান্ত ফল নির্ভরযোগ্য নয়।'
            : (ascSandhi < 1 ? '⚠️ লগ্ন রাশি-সন্ধির খুব কাছে (' + JY.dms(ascSandhi) + ') — ২–৩ মিনিটের পার্থক্যেও লগ্ন বদলাতে পারে।' : '✓ লগ্ন স্থির — ২ মিনিটের পার্থক্যে রাশি বদলায় না।')}</div></div>` : '';

      /* ১২ ঘর — লগ্ন থেকে */
      let houses = '';
      if (JY) {
        const rows = [];
        for (let h = 0; h < 12; h++) {
          const rIdx = (ascR.i + h) % 12;
          const inH = pos.filter(p => p.rashiIdx === rIdx).map(p => p.name).join(', ');
          rows.push(`<div class="kv" style="padding:7px 0;border-bottom:1px dashed rgba(215,169,79,.14)">
            <span class="mini" style="min-width:74px">${bn(h + 1)}ম ঘর · ${JY.RASHI[rIdx]}</span>
            <span class="mini" style="color:${inH ? 'var(--gold-200)' : 'var(--muted, #8a8378)'}">${inH || '—'}</span></div>`);
        }
        houses = rows.join('');
      }
      const grahaRows = JY ? pos.map(p => `<div class="kv" style="padding:7px 0;border-bottom:1px dashed rgba(215,169,79,.14)">
          <span class="ttl" style="font-size:.92rem;min-width:86px">${p.name}${p.retro ? ' <span class="mini muted">(বক্রী)</span>' : ''}</span>
          <span class="mini">${p.rashi} ${JY.dms(p.deg)}</span>
          <span class="mini muted" style="min-width:96px;text-align:right">${p.nak} ${bn(p.pada)}<br><span style="opacity:.7">D9 ${JY.navamsaOf(p.lon).name}</span></span></div>`).join('') : '';
      const cityOpts = jyCityList().map(c => JY_CITY.indexOf(c)).map(i => `<option value="${i}" ${i === st.city ? 'selected' : ''}>${JY_CITY[i][0]}</option>`).join('');
      const body = `<p class="mini muted" style="margin:0 0 10px;line-height:1.7">জন্ম তারিখ, সময় ও স্থান দিয়ে <b>চন্দ্ররাশি, জন্মলগ্ন, জন্মনক্ষত্র ও নবগ্রহের অবস্থান</b> — লহিড়ী অয়নাংশে (নিরয়ণ) প্রকৃত গণিত দিয়ে। জন্মসময় যত নিখুঁত, লগ্ন তত নিখুঁত।</p>
        <div class="card pad stack">
          <label class="mini muted" for="jyDate">জন্মতারিখ</label>
          <input id="jyDate" type="date" value="${st.date}" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px">
          <div class="kv" style="margin-top:8px;gap:8px">
            <div style="flex:1"><label class="mini muted" for="jyTime">জন্মসময়</label>
              <input id="jyTime" type="time" value="${st.time}" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px"></div>
            <div style="flex:1"><label class="mini muted" for="jyCity">জন্মস্থান</label>
              <select id="jyCity" style="width:100%;padding:10px;border-radius:12px;border:1px solid rgba(215,169,79,.3);background:transparent;color:inherit;font-family:inherit;margin-top:4px">${cityOpts}</select></div>
          </div>
        </div>
        <div class="mini muted" style="text-align:center;margin:8px 0 10px">বঙ্গাব্দ ${bn(bD.d)} ${bD.month} ${bn(bD.year)} · ${BN_DAY[new Date(dy, dm - 1, dd2).getDay()]} · ${city[0]}</div>
        ${cards}
        <div class="sect" style="margin-top:16px"><h4>গ্রহস্থিতি</h4><div class="line"></div>
          <span class="mini muted">নিরয়ণ · লহিড়ী</span></div>
        <div class="card pad stack">${grahaRows}</div>
        <div class="sect" style="margin-top:16px"><h4>১২ ঘর</h4><div class="line"></div></div>
        <div class="card pad stack">${houses}</div>
        <p class="mini muted" style="margin-top:10px;line-height:1.7">গণনা: গ্রহের কক্ষপথ-উপাদান (JPL), চন্দ্রের Meeus সিরিজ, লহিড়ী অয়নাংশ ২৩°৫১′১১″ (J2000) থেকে বছরে ৫০.২৯″ বৃদ্ধি, উদয়লগ্ন = স্থানীয় নাক্ষত্রিক কাল + অক্ষাংশ। যাচাই: প্রকাশিত নিরয়ণ গ্রহস্থিতির সঙ্গে সব গ্রহ ০.১°-এর মধ্যে মেলে; চন্দ্র ০.০৬°। ২৬,২৮০টি নমুনায় দেখা গেছে ৪ মিনিট জন্মসময় ভুল হলে লগ্ন-রাশি বদলায় মাত্র ৩.৩% ক্ষেত্রে, নক্ষত্র বদলায় ০.২%-এ (docs/guide/JYOTISH-VERIFY.md)।</p>`;
      return pjShell('রাশি নির্ণয়', 'Rashi · জন্মরাশি ও জন্মলগ্ন', body, 'rashi');
    }
  function panjikaSub(slug) {
      if (U.panjika.by == null) { const bt = bengaliDate(TODAY); U.panjika.by = bt.year; U.panjika.bm = bt.m; }
      switch (slug) {
        case 'broto':
          return pjList('ব্রতের তালিকা', 'Brata · ব্রত ও উৎসব', 'broto',
            () => true, 'সারা বছরের ব্রত, উপবাস ও উৎসব — একাদশী, পূর্ণিমা, অমাবস্যা, সংক্রান্তি ও পূজা-পার্বণ।');
        case 'ekadashi':
          return pjList('একাদশী', 'Ekadashi · উপবাস', 'ekadashi',
            (k, n) => n.includes('একাদশী'), 'শুক্লা ও কৃষ্ণ পক্ষের একাদশী — উপবাস ও পারণের দিন।');
        case 'purnima': {
          const rows = Object.keys(P.purnima).sort().filter(k => U.panjika.all || k >= TODAY_KEY);
          return pjShell('পূর্ণিমা', 'Purnima · পূর্ণিমার তিথি',
            `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সারা বছরের পূর্ণিমা তিথি — স্নান, দান ও ব্রতের দিন।</p>
             ${rows.map(k => pjRow(k, P.purnima[k], 'ভারতে এক দিন আগে-পরে হতে পারে')).join('')}
             <div class="kv" style="margin-top:10px"><span class="mini muted">মোট ${bn(Object.keys(P.purnima).length)}টি</span>
               <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>`, 'purnima');
        }
        case 'amavasya': {
          const rows = Object.keys(P.amavasya).sort().filter(k => U.panjika.all || k >= TODAY_KEY);
          return pjShell('অমাবস্যা', 'Amavasya · পিতৃতর্পণ',
            `<p class="mini muted" style="margin:0 0 12px;line-height:1.7">সারা বছরের অমাবস্যা — পিতৃতর্পণ, দীপদান ও তর্পণের দিন।</p>
             ${rows.map(k => pjRow(k, P.amavasya[k], 'ভারতে এক দিন আগে-পরে হতে পারে')).join('')}
             <div class="kv" style="margin-top:10px"><span class="mini muted">মোট ${bn(Object.keys(P.amavasya).length)}টি</span>
               <button class="act" data-act="pjall">${U.panjika.all ? 'শুধু আসন্ন' : 'সব দেখুন'}</button></div>`, 'amavasya');
        }
        case 'puja':
          return pjList('পূজার দিন', 'Puja · পূজা-পার্বণ', 'puja',
            (k, n) => n.includes('পূজা') || n.includes('পূজো'), 'দেব-দেবীর পূজার দিন — দুর্গা, লক্ষ্মী, কালী, সরস্বতী, শিব, গণেশ ও বিশ্বকর্মা।');
        case 'bishesh':
          return pjList('বিশেষ দিন', 'Special days · ব্রত ও পালন', 'bishesh',
            (k, n) => !n.includes('একাদশী'), 'একাদশী ছাড়া বছরের সব বিশেষ ধর্মীয় ও পালনীয় দিন — জন্মাষ্টমী, রথ, ঝুলন, শিবরাত্রি, দোল, সংক্রান্তি।');
        case 'shubho': return pjShubho();
        case 'bibaho': return pjBibaho();
        case 'mritdosh': return pjMritdosh();
        case 'rashi': return pjRashi();
        case 'dibosh': return pjDibosh();
        case 'daily': return pjDaily();
        case 'panchang': return pjPanchang();
        case 'rashifal': return pjRashifal();
        case 'grohon': return pjGrohon();
        case 'calendar': return pjCalendar();
        default: return pjCalendar();
      }
    }
