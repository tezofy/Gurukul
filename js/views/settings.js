/* ==========================================================================
   ১২½. সেটিংস ও প্রোফাইল পেজ
   ফাইল: js/views/settings.js
   ========================================================================== */
  function settingsScreen() {
      return `${appbar('সেটিংস', 'Settings', '#/home')}
      <div class="pad settings-pop" style="padding-top:0">
        <div class="sect"><h4>প্রদর্শন</h4><div class="line"></div>
          <span class="pill">${S.theme === 'light' ? 'লাইট' : 'ডার্ক'}</span></div>
        <div class="card pad stack" style="gap:6px">
          <div class="mini muted" style="line-height:1.75">থিম বদলাতে নিচের <b>লাইট মোড</b> সারিতে ট্যাপ করুন — পুরো অ্যাপ সঙ্গে সঙ্গে বদলে যাবে।</div>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn ${S.theme === 'light' ? 'gold' : 'ghost'} sm" data-act="themeSet" data-v="light">☀ লাইট</button>
            <button class="btn ${S.theme === 'dark' ? 'gold' : 'ghost'} sm" data-act="themeSet" data-v="dark">🌙 ডার্ক</button>
          </div>
        </div>
        <div class="sect"><h4>মন্দির-সংগীত</h4><div class="line"></div>
          <span class="pill ${(window.BGM && BGM.state().on && !BGM.state().muted) ? 'ok' : ''}">${(window.BGM && BGM.state().on && !BGM.state().muted) ? 'চালু' : 'বন্ধ'}</span></div>
        <div class="card pad">
          <div class="kv"><div><div class="mini muted">ব্যাকগ্রাউন্ড সংগীত</div>
            <div style="font-size:12.5px;font-weight:700;margin-top:3px">মন্দির-পরিবেশ · মৃদু, বাধাহীন</div></div>
            <div style="display:flex;gap:6px">
              <button class="cbtn" data-act="bgmPlay">▶ চালু</button>
              <button class="cbtn" data-act="bgmMute">🔇 বন্ধ</button>
            </div></div>
          <div class="vs-row" style="margin-top:10px"><span>ভলিউম</span>
            <input class="vs-range" type="range" min="0" max="100" value="${window.BGM ? Math.round(BGM.state().vol * 100) : 22}" data-role="bgmVol" aria-label="সংগীতের ভলিউম">
            <b id="bgmVolTxt">${window.BGM ? Math.round(BGM.state().vol * 100) : 22}%</b></div>
          <div class="bgm-src" style="margin-top:10px">
            <div class="mini" style="font-weight:800;margin-bottom:6px">যে গানটি বাজবে</div>
            <div class="tiny muted" id="bgmSrcNow" style="line-height:1.6;margin-bottom:8px">${window.BGM ? esc(BGM.state().track) : 'মঙ্গলম্ ভগবান বিষ্ণু মন্ত্র'}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <label class="cbtn bgm-up">♪ ফোন থেকে গান দিন<input type="file" id="bgmFile" accept="audio/*" hidden/></label>
              <button class="cbtn" data-act="bgmLink">🔗 লিংক</button>
              <button class="cbtn" data-act="bgmYT">▶ মঙ্গলম্ মন্ত্র (YouTube)</button>
              <button class="cbtn" data-act="bgmDefault">↺ অ্যাপের সংগীত</button>
            </div>
            <div class="tiny muted" style="line-height:1.65;margin-top:7px">YouTube-এর গান ইন্টারনেটে চলে (মিডিয়া লাইসেন্স মেনে, অফিসিয়াল প্লেয়ারে)। নিজের ফাইল দিলে সেটাই বাজবে — অফলাইনেও।</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px">
              <button class="cbtn" data-act="nav" data-to="#/storage/audio">স্টোরেজের গান</button>
              <button class="cbtn" data-act="nav" data-to="#/storage">ফাইল স্টোরেজ</button>
            </div>
          </div>
          <div class="tiny muted" style="line-height:1.7;margin-top:8px">অ্যাপ খুললেই এই সংগীত মৃদু স্বরে নিজে থেকেই বাজে; আপনি না থামালে এটি চলতেই থাকে। ভয়েস বা আরতি চললে সংগীত নিজে নেমে যায়, শেষে আবার ফিরে আসে।</div>
        </div>
        <div class="sect"><h4>পছন্দ ও সেটিংস</h4><div class="line"></div></div>
  <div class="card pad" style="padding:4px 14px">
          <div class="setting" data-act="toggleTheme">
            <span style="color:var(--gold-300)">${ico('sun', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">লাইট মোড (পাটা-থিম)</div>
            <span class="toggle ${S.theme === 'light' ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleBg">
            <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">পটভূমি থিম (মন্দির-পত্র)</div>
            <span class="toggle ${S.bg ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleSound">
            <span style="color:var(--gold-300)">${ico('bell', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">মৃদু ঘণ্টাধ্বনি</div>
            <span class="toggle ${S.sound ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleMotion">
            <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">অ্যানিমেশন</div>
            <span class="toggle ${S.motion ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleName">
            <span style="color:var(--gold-300)">${vico('user', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">নাম পরিবর্তন</div>
            <span class="mini muted">${esc(S.name.split(' ')[0])} ›</span></div>
          <div class="setting" data-act="reset">
            <span style="color:var(--danger)">${ico('close', 'sm')}</span>
            <div style="flex:1;font-size:12.5px;color:var(--danger)">ডেমো ডেটা রিসেট</div>
            <span class="mini muted">›</span></div>
        </div>
        <p class="mini muted" style="text-align:center;margin:18px 0 0;line-height:1.7">সনাতন বিদ্যাপীঠ · ডেমো সংস্করণ ১.০<br/>আপনার ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</p>
        <div style="height:24px"></div>
      </div>`;
    }
  function meScreen() {
      const days = Object.keys(S.activity).sort().slice(-7);
      const max = Math.max(...days.map(d => S.activity[d]), 100);
      const weekDone = days.filter(d => S.activity[d] > 0).length;
      const avg = Math.round(days.reduce((s, d) => s + S.activity[d], 0) / days.length);
      const earnings = S.provider ? S.orders.filter(o => o.kind === 'service').reduce((s, o) => s + o.amount, 0) : 0;
      return `${appbar('আমার অগ্রগতি', 'Dashboard', undefined, true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad stack">
          <div style="display:flex;gap:14px;align-items:center">
            <div class="av round" style="width:56px;height:56px;font-size:19px">${esc(S.name.slice(0, 2))}</div>
            <div style="flex:1">
              <div class="display" style="font-size:15px">${esc(S.name)}</div>
              <div class="mini muted" style="margin-top:4px">শিক্ষার্থী · স্তর ${bn(2)} · যোগ দিয়েছেন জুন ২০২৬</div>
              <div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">
                <span class="pill">🔥 ${bn(S.streak)} দিন</span>
                <span class="pill">${bn(Object.keys(S.read).length)} শ্লোক</span>
                <span class="pill ok">${bn(S.attempts.length)} কুইজ</span></div>
            </div>
          </div>
        </div>

        <div class="mt">${roleSwitch()}</div>
        <div class="mt">${rolePanel()}</div>

        <div class="sect"><h4>এই সপ্তাহের সাধনা</h4><div class="line"></div><span class="mini muted">${bn(weekDone)}/৭ দিন</span></div>
        <div class="card pad">
          <div class="chart">
            ${days.map(d => {
          const v = S.activity[d] || 0;
          const h = Math.max(6, Math.round(v / max * 100));
          const dd = new Date(d + 'T00:00:00');
          return `<div class="col"><div class="bwrap"><div class="b ${v ? '' : 'empty'}" style="height:${h}%"></div></div>
                <div class="d">${BN_DAYS[dd.getDay()]}</div></div>`;
        }).join('')}
          </div>
          <div class="kv" style="margin-top:13px;padding-top:11px;border-top:1px solid var(--hairline)">
            <span class="mini muted">দৈনিক লক্ষ্য ${bn(25)} মিনিট</span>
            <span class="mini" style="color:var(--ok)">গড় ${bn(avg)} মিনিট</span></div>
        </div>

        <div class="sect"><h4>দৈনিক হিসাব</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/track/history">হিস্ট্রি ›</button></div>
        <div class="card pad" style="display:flex;align-items:center;gap:12px" data-act="nav" data-to="#/track" role="button" tabindex="0">
          <div class="ring" style="--p:${scoreOf(entryFor(TODAY_KEY), todayAuto()).total}%;width:46px;height:46px"><div><div class="n" style="font-size:12px">${bn(scoreOf(entryFor(TODAY_KEY), todayAuto()).total)}</div></div></div>
          <div style="flex:1"><div style="font-size:12.5px;font-weight:600">আজকের স্কোর</div>
            <div class="mini muted" style="margin-top:3px">গড় ${bn((() => { const ks = Object.keys(S.daily); if (!ks.length) return 0; return Math.round(ks.reduce((a, k) => a + scoreOf(S.daily[k], k === TODAY_KEY ? todayAuto() : null).total, 0) / ks.length); })())}/১০০ · ${bn(Object.keys(S.daily).length)} দিনের হিসাব</div></div>
          ${ico('arrow', 'sm')}
        </div>

        <div class="sect"><h4>আমার আয়</h4><div class="line"></div>
          <span class="pill ${S.provider ? 'ok' : ''}">${S.provider ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span></div>
        <div class="card pad">
          ${S.provider ? `
            <div class="kv"><div><div class="mini muted">মোট আয়</div>
              <div class="display" style="font-size:21px;color:var(--gold-200);margin-top:3px">৳ ${bnN(earnings)}</div></div>
              <div style="text-align:right"><div class="mini muted">পরবর্তী পেআউট</div>
                <div style="font-size:12.5px;font-weight:600;margin-top:5px">রবিবার · ৳ ${bnN(Math.round(earnings * .85))}</div></div></div>
            <div class="mt">
              <div class="ledger"><span>মোট অর্ডার (৮৫% শেয়ার)</span><span>৳ ${bnN(Math.round(earnings * .85))}</span></div>
              <div class="ledger"><span>প্লাটফর্ম ফি ১২%</span><span style="color:var(--danger)">− ৳ ${bnN(Math.round(earnings * .12))}</span></div>
            </div>`
          : `<p class="mini muted" style="margin:0 0 11px;line-height:1.7">এখনো প্রোভাইডার প্রোফাইল নেই। দক্ষতা দিয়ে আয় শুরু করতে প্রোফাইল খুলুন।</p>
               <button class="btn gold block sm" data-act="nav" data-to="#/market">মার্কেটপ্লেসে যান</button>`}
        </div>

        <div class="sect"><h4>পছন্দ ও সেটিংস</h4><div class="line"></div></div>
        ${prefCard()}
        <p class="mini muted" style="text-align:center;margin:18px 0 0;line-height:1.7">সনাতন বিদ্যাপীঠ · ডেমো সংস্করণ ১.০<br/>আপনার ডেটা শুধু এই ব্রাউজারে সংরক্ষিত</p>
      </div><div style="height:24px"></div>`;
    }
