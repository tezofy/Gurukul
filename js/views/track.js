/* ==========================================================================
   ১৫. দৈনিক হিসাব (ট্র্যাকার)
   ফাইল: js/views/track.js
   ========================================================================== */
  const TRAK_DEF = () => ({
      puja: 0, japaExtra: 0, dhyanaExtra: 0, pathMin: 0, daanTaka: 0, daanMin: 0,
      workMin: 0, income: 0, studyMin: 0, familyMin: 0, sleepH: 8,
      lies: 0, anger: 0,
      gratitude: '', sankalpa: '', helpToday: '', learned: '', tomorrow: '', done: false
    });
  const entryFor = k => { if (!S.daily[k]) S.daily[k] = TRAK_DEF(); return S.daily[k]; };
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const todayAuto = () => ({
      japa: S.japa.rounds * 108 + S.japa.count,
      dhyana: S.sessions.filter(x => x.date === TODAY_KEY).reduce((a, x) => a + x.mins, 0),
      path: Object.keys(S.read).length,
      yoga: Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length
    });
  function scoreOf(e, auto) {
      const japa = e.japaExtra * 108 + (auto ? auto.japa : 0);
      const dhyana = e.dhyanaExtra + (auto ? auto.dhyana : 0);
      const path = e.pathMin + (auto ? auto.path * 2 : 0);
      const sadhana = clamp(
        20 * Math.min(1, e.puja / 20) + 25 * Math.min(1, japa / 108) + 20 * Math.min(1, dhyana / 10) +
        15 * Math.min(1, path / 10) + 20 * ((e.daanTaka > 0 || e.daanMin > 0) ? 1 : 0));
      const charitra = clamp(100 - e.lies * 15 - e.anger * 10);
      const karma = clamp(60 * Math.min(1, e.workMin / 240) + 25 * Math.min(1, e.income / 500) + 15 * Math.min(1, e.studyMin / 30));
      const jibon = clamp(50 * Math.min(1, e.familyMin / 60) + 30 * (e.sleepH >= 6 && e.sleepH <= 9 ? 1 : .4) + 20 * Math.min(1, (auto ? auto.yoga : 0) / 3));
      const total = Math.round(sadhana * .4 + charitra * .25 + karma * .2 + jibon * .15);
      const engaged = (e.puja + e.japaExtra + e.dhyanaExtra + e.pathMin + e.daanTaka + e.daanMin +
        e.workMin + e.income + e.studyMin + e.familyMin + e.lies + e.anger) > 0 ||
        (auto && (auto.japa || auto.dhyana || auto.path || auto.yoga));
      if (!engaged) return { sadhana: 0, charitra: 0, karma: 0, jibon: 0, total: 0, japa: auto ? auto.japa : 0, dhyana: auto ? auto.dhyana : 0, path: auto ? auto.path : 0 };
      return { sadhana: Math.round(sadhana), charitra: Math.round(charitra), karma: Math.round(karma), jibon: Math.round(jibon), total, japa, dhyana, path };
    }
  function stepper(k, label, val, step, unit, hint) {
      return `<div class="trow">
        <div style="flex:1;min-width:0">
          <div style="font-size:12.5px">${label}</div>
          ${hint ? `<div class="mini muted" style="margin-top:2px">${hint}</div>` : ''}
        </div>
        <div class="stepr">
          <button data-act="tfield" data-k="${k}" data-d="-1" aria-label="কমান">−</button>
          <span id="tv-${k}">${bn(val)}${unit ? ' <i>' + unit + '</i>' : ''}</span>
          <button data-act="tfield" data-k="${k}" data-d="1" aria-label="বাড়ান">+</button>
        </div>
      </div>`;
    }
  function trackScreen() {
      const e = entryFor(TODAY_KEY);
      const auto = todayAuto();
      const sc = scoreOf(e, auto);
      const ringPct = sc.total;
      const _bt = bengaliDate(TODAY);
      return `${appbar('আজকের হিসাব', `${bn(_bt.d)} ${_bt.month} ${bn(_bt.year)} · ${_bt.season}`, '#/home', true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div style="display:flex;gap:14px;align-items:center">
            <div class="ring" style="--p:${ringPct}%;width:64px;height:64px"><div><div class="n" style="font-size:16px">${bn(sc.total)}</div><div class="u">স্কোর</div></div></div>
            <div style="flex:1;min-width:0">
              <div class="kv"><b style="font-size:13px">আজকের ভারসাম্য</b>
                <span class="pill ${e.done ? 'ok' : ''}">${e.done ? 'হিসাব সম্পন্ন' : 'চলমান'}</span></div>
              <div class="mini muted" style="margin-top:5px">৪টি স্তম্ভের গড় — আধ্যাত্মিক ৪০%, চরিত্র ২৫%, কর্ম ২০%, জীবন ১৫%</div>
            </div>
            <img class="reuse-balance" src="icons/reference/cal-balance.png" alt="" aria-hidden="true"/>
          </div>
          <div class="grid2 mt">
            ${[['আধ্যাত্মিক', sc.sadhana], ['চরিত্র', sc.charitra], ['কর্ম', sc.karma], ['জীবন', sc.jibon]].map(([n, v]) => `
              <div class="stat"><div class="k">${n}</div><div class="v">${bn(v)}/১০০</div>
                <div class="bar thin" style="margin-top:6px"><i style="width:${v}%"></i></div></div>`).join('')}
          </div>
        </div>

        <div class="sect"><h4>১ · ভগবান ও আধ্যাত্মিক সময়</h4><div class="line"></div></div>
        <div class="card pad" style="padding:4px 14px">
          ${stepper('puja', 'নিত্য পূজা', e.puja, 5, 'মিনিট', 'আরতি, দীপ, পুষ্পাঞ্জলিসহ')}
          ${stepper('japaExtra', 'জপ (অ্যাপের বাইরে)', e.japaExtra, 1, 'মালা', `অ্যাপে গণনা: ${bn(auto.japa)} জপ`)}
          ${stepper('dhyanaExtra', 'ধ্যান (অ্যাপের বাইরে)', e.dhyanaExtra, 5, 'মিনিট', `অ্যাপে সেশন: ${bn(auto.dhyana)} মিনিট`)}
          ${stepper('pathMin', 'শাস্ত্র পাঠ', e.pathMin, 5, 'মিনিট', `অ্যাপে পঠিত শ্লোক: ${bn(auto.path)}`)}
          ${stepper('daanTaka', 'দান', e.daanTaka, 50, '৳')}
          ${stepper('daanMin', 'সেবায় সময়', e.daanMin, 5, 'মিনিট', 'সাহায্য, সেবা, স্বেচ্ছাসেবা')}
        </div>
        <div class="mini muted" style="margin:8px 4px 0">স্বয়ংক্রিয়: জপ ${bn(auto.japa)} · ধ্যান ${bn(auto.dhyana)} মিনিট · শ্লোক ${bn(auto.path)} · যোগাসন ${bn(auto.yoga)}</div>

        <div class="sect"><h4>২ · চরিত্র ও মন</h4><div class="line"></div></div>
        <div class="card pad" style="padding:4px 14px">
          ${stepper('lies', 'আজ কতবার মিথ্যা বলেছি', e.lies, 1, 'বার', 'সৎ হিসাবই সবচেয়ে বড় সাধনা — বিচার নয়, সচেতনতা')}
          ${stepper('anger', 'ক্রোধ / রাগ', e.anger, 1, 'বার')}
          <div style="padding:11px 0;border-top:1px solid var(--hairline)">
            <div class="mini muted" style="margin-bottom:6px">আজকের কৃতজ্ঞতা</div>
            <textarea class="input" data-field="gratitude" rows="2" placeholder="আজ যা পেয়েছি তার জন্য কৃতজ্ঞ…">${esc(e.gratitude)}</textarea>
          </div>
          <div style="padding:0 0 11px">
            <div class="mini muted" style="margin-bottom:6px">কালকের সংকল্প</div>
            <textarea class="input" data-field="sankalpa" rows="2" placeholder="কাল একটি ছোট ভালো কাজ করব…">${esc(e.sankalpa)}</textarea>
          </div>
        </div>

        <div class="sect"><h4>৩ · কর্ম, ইনকাম ও শেখা</h4><div class="line"></div></div>
        <div class="card pad" style="padding:4px 14px">
          ${stepper('workMin', 'নিজের কাজ / ইনকামের কাজ', e.workMin, 15, 'মিনিট')}
          ${stepper('income', 'আজকের আয়', e.income, 100, '৳')}
          ${stepper('studyMin', 'নতুন কিছু শেখা', e.studyMin, 10, 'মিনিট', 'স্কিল, পড়াশোনা, কোর্স')}
          ${stepper('familyMin', 'পরিবার ও প্রিয়জনের সাথে', e.familyMin, 15, 'মিনিট')}
          ${stepper('sleepH', 'ঘুম', e.sleepH, 1, 'ঘণ্টা', '৬–৯ ঘণ্টা স্বাস্থ্যকর')}
        </div>

        <div class="sect"><h4>৪ · আত্মপর্যালোচনা</h4><div class="line"></div></div>
        <div class="card pad">
          <div style="margin-bottom:10px"><div class="mini muted" style="margin-bottom:6px">আজ কারও উপকার করেছি?</div>
            <textarea class="input" data-field="helpToday" rows="2" placeholder="ছোট হলেও লিখে রাখুন…">${esc(e.helpToday)}</textarea></div>
          <div style="margin-bottom:10px"><div class="mini muted" style="margin-bottom:6px">আজ কী শিখলাম?</div>
            <textarea class="input" data-field="learned" rows="2" placeholder="শাস্ত্র থেকে বা জীবনের ঘটনা থেকে…">${esc(e.learned)}</textarea></div>
          <div><div class="mini muted" style="margin-bottom:6px">কাল কী আরও ভালো করতে পারি?</div>
            <textarea class="input" data-field="tomorrow" rows="2" placeholder="একটি নির্দিষ্ট পদক্ষেপ…">${esc(e.tomorrow)}</textarea></div>
        </div>

        <div style="display:flex;gap:9px;margin-top:14px">
          <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/track/history">হিস্ট্রি</button>
          <button class="btn gold" style="flex:1.5" data-act="trackDone">${e.done ? 'হিসাব আপডেট রাখুন' : 'আজকের হিসাব সম্পূর্ণ'}</button>
        </div>
        <p class="mini muted" style="text-align:center;margin-top:12px;line-height:1.7">হিসাব প্রতিটি পরিবর্তনে স্বয়ংক্রিয়ভাবে সেভ হয়।<br/>এটি বিচারের খাতা নয় — নিজেকে জানার আয়না।</p>
      </div><div style="height:24px"></div>`;
    }
  function historyScreen() {
      const days = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(TODAY); d.setDate(d.getDate() - i);
        const k = key(d);
        const e = S.daily[k];
        const auto = k === TODAY_KEY ? todayAuto() : null;
        const sc = e ? scoreOf(e, auto) : { total: 0, sadhana: 0, charitra: 0, karma: 0, jibon: 0, japa: 0, dhyana: 0, path: 0 };
        days.push({ k, d, e, sc });
      }
      const real = days.filter(x => x.e);
      const avg = real.length ? Math.round(real.reduce((s, x) => s + x.sc.total, 0) / real.length) : 0;
      const best = real.slice().sort((a, b) => b.sc.total - a.sc.total)[0];
      const totals = real.reduce((acc, x) => {
        acc.japa += x.sc.japa; acc.dhyana += x.sc.dhyana; acc.daan += x.e.daanTaka;
        acc.income += x.e.income; acc.lies += x.e.lies; acc.puja += x.e.puja; acc.work += x.e.workMin;
        return acc;
      }, { japa: 0, dhyana: 0, daan: 0, income: 0, lies: 0, puja: 0, work: 0 });
      const last7 = days.slice(-7);

      // মাস্টারমাইন্ড ইনসাইট
      const insights = [];
      if (!real.length) insights.push('আজ প্রথম হিসাব শুরু করুন — ৭ দিনেই নিজের ছন্দ বোঝা যাবে।');
      else {
        if (avg >= 70) insights.push('ভারসাম্য চমৎকার — এই ছন্দ ধরে রাখলে এক মাসেই বড় পরিবর্তন।');
        else if (avg >= 45) insights.push('ভালো শুরু। সবচেয়ে দুর্বল স্তম্ভে ৫ মিনিট বাড়ালেই স্কোর লাফ দেবে।');
        else insights.push('স্কোর কম — চিন্তা নেই। শুধু প্রতিদিন হিসাব লিখতে থাকুন, প্রথমে সচেতনতাই লক্ষ্য।');
        const weakest = ['sadhana', 'charitra', 'karma', 'jibon'].map(k => ({ k, v: real.reduce((s, x) => s + x.sc[k], 0) / real.length })).sort((a, b) => a.v - b.v)[0];
        const names = { sadhana: 'আধ্যাত্মিক সময়', charitra: 'চরিত্র (সত্য-পালন)', karma: 'কর্ম ও ইনকাম', jibon: 'জীবনযাত্রা ও পরিবার' };
        insights.push(`সবচেয়ে দুর্বল স্তম্ভ: ${names[weakest.k]} (গড় ${bn(Math.round(weakest.v))}/১০০)।`);
        if (totals.lies > 0) insights.push(`এই সময়ে মোট ${bn(totals.lies)} বার মিথ্যা লিপিবদ্ধ — এটি কমাতে চেষ্টা করাই সবচেয়ে বড় পুণ্য।`);
        else insights.push('মিথ্যা শূন্য — সত্য-পালনে আপনি ঈর্ষণীয়। 🌸');
        if (totals.japa >= 108) insights.push(`মোট ${bn(Math.round(totals.japa / 108))} মালা জপ সম্পন্ন।`);
      }

      return `${appbar('হিস্ট্রি ও বিশ্লেষণ', 'সর্বশেষ ১৪ দিন', '#/track')}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div class="kv"><div><div class="mini muted">গড় স্কোর</div>
            <div class="display" style="font-size:24px;color:var(--gold-200);margin-top:3px">${bn(avg)}<span style="font-size:12px;color:var(--ink-3)">/১০০</span></div></div>
            <div style="text-align:right"><div class="mini muted">হিসাব করা দিন</div><b style="font-size:13px">${bn(real.length)}/১৪</b></div></div>
          <div class="chart" style="height:70px;margin-top:14px">
            ${last7.map(x => {
        const h = Math.max(5, Math.round(x.sc.total));
        return `<div class="col"><div class="bwrap"><div class="b ${x.e ? '' : 'empty'}" style="height:${h}%"></div></div>
                <div class="d">${BN_DAYS[x.d.getDay()]}</div></div>`;
      }).join('')}
          </div>
          <div class="kv mini muted" style="margin-top:8px"><span>শেষ ৭ দিন</span>${best ? `<span>সেরা দিন: ${bn(best.d.getDate())} ${BN_MONTH[best.d.getMonth()].slice(0, 4)} · ${bn(best.sc.total)}</span>` : ''}</div>
        </div>

        <div class="sect"><h4>মোট অর্জন (হিসাব করা দিনগুলোতে)</h4><div class="line"></div></div>
        <div class="grid2">
          <div class="stat"><div class="k">জপ</div><div class="v">${bn(totals.japa)} জপ</div></div>
          <div class="stat"><div class="k">ধ্যান</div><div class="v">${bn(totals.dhyana)} মিনিট</div></div>
          <div class="stat"><div class="k">পূজা</div><div class="v">${bn(totals.puja)} মিনিট</div></div>
          <div class="stat"><div class="k">দান</div><div class="v">৳ ${bnN(totals.daan)}</div></div>
          <div class="stat"><div class="k">ইনকাম</div><div class="v">৳ ${bnN(totals.income)}</div></div>
          <div class="stat"><div class="k">কাজ</div><div class="v">${bn(Math.round(totals.work / 60))} ঘণ্টা</div></div>
        </div>

        <div class="sect"><h4>মাস্টারমাইন্ড পর্যালোচনা</h4><div class="line"></div></div>
        <div class="card pad">${insights.map(t => `<div class="li" style="align-items:flex-start"><span style="color:var(--gold-300);margin-top:2px">${ico('target', 'xs')}</span>
          <div class="tiny" style="line-height:1.8;flex:1">${t}</div></div>`).join('')}</div>

        <div class="sect"><h4>দিন-ভিত্তিক হিসাব</h4><div class="line"></div></div>
        ${days.slice().reverse().map(x => `
          <div class="card rowcard stack" style="opacity:${x.e ? 1 : .62}">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(x.d.getDate())}</b><i>${BN_MONTH[x.d.getMonth()].slice(0, 4)}</i></div>
            <div style="flex:1"><div class="kv"><span class="ttl">${BN_DAY[x.d.getDay()]}</span>
              <span class="pill ${x.sc.total >= 60 ? 'ok' : ''}">${bn(x.sc.total)}</span></div>
              <div class="mini muted" style="margin-top:4px">${x.e ? `পূজা ${bn(x.e.puja)} মি · জপ ${bn(x.sc.japa)} · ধ্যান ${bn(x.sc.dhyana)} মি · মিথ্যা ${bn(x.e.lies)}` : 'হিসাব নেই — ট্যাপ করে যোগ করুন'}</div></div>
          </div>`).join('')}
      </div><div style="height:24px"></div>`;
    }
