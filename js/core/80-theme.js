/* ==========================================================================
   থিম, ব্যাকগ্রাউন্ড, কণ্ঠ (speak) ও ভয়েস-বার
   ফাইল: js/core/80-theme.js
   ========================================================================== */
  function bumpActivity(min) {
      S.activity[TODAY_KEY] = (S.activity[TODAY_KEY] || 0) + min;
      save('activity');
    }
  function setTheme(v) {
      S.theme = v; save('theme');
      document.documentElement.dataset.theme = v;
      const bv = document.querySelector('.brandav');
      if (bv) bv.src = v === 'light' ? bv.dataset.light : bv.dataset.dark;
      document.querySelector('meta[name="theme-color"]').setAttribute('content', v === 'light' ? '#fdf7e4' : '#180304');
    }
  function applyBg() {
      document.documentElement.dataset.bg = S.bg ? 'on' : 'off';
    }
  function speak(text, opt) {
      try {
        if (!window.VOICE || !VOICE.has()) return toast('এই ব্রাউজারে উচ্চারণ সমর্থিত নয়');
        VOICE.play(text, opt);
        const best = VOICE.best();
        toast(best ? 'মাধুর্যময় কণ্ঠে পড়া হচ্ছে · ' + best.name : 'পড়া হচ্ছে… (বাংলা কণ্ঠ পাওয়া যায়নি — ফোনের সেটিংসে বাংলা ভয়েস যোগ করুন)');
      } catch (e) { toast('উচ্চারণ সম্ভব হয়নি'); }
    }
  function askNotify() {
      if (!('Notification' in window)) return toast('এই ব্রাউজারে নোটিফিকেশন নেই — তবু অ্যাপে রিমাইন্ডার দেখাবে');
      if (Notification.permission === 'granted') { S.notifyOn = !S.notifyOn; save('notifyOn'); toast(S.notifyOn ? 'রিমাইন্ডার চালু' : 'রিমাইন্ডার বন্ধ'); render(); return; }
      Notification.requestPermission().then(p => {
        S.notifyOn = p === 'granted'; save('notifyOn');
        toast(S.notifyOn ? 'রিমাইন্ডার চালু — উৎসবের আগের দিন জানানো হবে' : 'অনুমতি দেওয়া হয়নি — অ্যাপের ভেতরে রিমাইন্ডার দেখাবে');
        render();
      }).catch(() => { S.notifyOn = true; save('notifyOn'); render(); });
    }
  function nextFestInfo() {
      const keys = Object.keys(P.festivals).filter(k => k >= TODAY_KEY).sort();
      if (!keys.length) return null;
      const k = keys[0], d = new Date(k + 'T00:00:00');
      return { k, name: P.festivals[k], days: Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS) };
    }
  function maybeNotify() {
      if (!S.notifyOn) return;
      const f = nextFestInfo();
      if (!f || f.days > 1) return;
      if (S.notifiedKey === f.k) return;
      S.notifiedKey = f.k; save('notifiedKey');
      const body = f.days === 0 ? `আজ ${f.name}` : `কাল ${f.name}`;
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('সনাতন বিদ্যাপীঠ · পঞ্জিকা', { body, icon: 'icons/icon-light-192.png' });
        } else toast(body);
      } catch (e) { toast(body); }
    }
  function mountVoiceBar() {
      if (document.getElementById('vbar')) return;
      document.body.insertAdjacentHTML('beforeend', `<div id="vbar" class="vbar" hidden>
        <button class="vbar-x" data-act="voiceStop" aria-label="বন্ধ">✕</button>
        <span class="vbar-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="vbar-tx"><b id="vbarTitle">পড়া হচ্ছে…</b><i id="vbarMode">সাধারণ পাঠ</i></div>
        <button class="vbar-btn" data-act="voicePause" id="vbarPause" aria-label="বিরতি">❚❚</button>
        <button class="vbar-btn" data-act="nav" data-to="#/voice" aria-label="কণ্ঠ সেটিংস">⚙</button>
      </div>`);
      if (window.VOICE) VOICE.onState(st => {
        const el = document.getElementById('vbar'); if (!el) return;
        el.hidden = !st.playing;
        el.classList.toggle('paused', !!st.pause);
        const t = document.getElementById('vbarTitle'); if (t && st.label) t.textContent = st.label;
        const m = document.getElementById('vbarMode');
        if (m) m.textContent = st.mode === 'story' ? 'গল্প-পাঠ · মধুর কণ্ঠ' : st.mode === 'mantra' ? 'মন্ত্র-পাঠ · ধীর, স্পষ্ট' : 'সাধারণ পাঠ';
        const p = document.getElementById('vbarPause'); if (p) p.textContent = st.pause ? '▶' : '❚❚';
      });
    }
  function voiceScreen() {
      const st = window.VOICE ? VOICE.settings() : { rate: 1, pitch: 1, voice: 'auto', breath: true, pauses: true };
      const best = window.VOICE ? VOICE.best() : null;
      const vs = window.VOICE ? VOICE.voices() : [];
      const sample = 'আজ সন্ধ্যায় প্রদীপ জ্বালিয়ে আমরা শান্ত মনে ভগবানের নাম করব। মা সরস্বতীর কৃপায় জ্ঞান ও বাণী সবার জীবনে জেগে উঠুক।';
      const modes = [['normal', 'সাধারণ পাঠ', 'খবর, নোট, সাধারণ লেখা'], ['story', 'গল্প-পাঠ', 'কথা, কীর্তন, ভাগবত-কথা — মাধুর্যপূর্ণ'], ['mantra', 'মন্ত্র-পাঠ', 'শ্লোক ও মন্ত্র — ধীর, স্পষ্ট, গুরুগম্ভীর']];
      return `${appbar('কণ্ঠ ও উচ্চারণ', 'মানুষের মতো মধুর বাংলা পাঠ', '#/me')}
      <div class="pad">
        <div class="card pad vs-now">
          <div class="kv"><div><div class="mini muted">এই মুহূর্তে কণ্ঠ</div>
            <div class="display" style="font-size:15px;margin-top:3px">${best ? esc(best.name) : 'বাংলা কণ্ঠ পাওয়া যায়নি'}</div>
            <div class="tiny muted" style="margin-top:3px">${best ? esc(best.lang) : 'ফোনের সেটিংস → ভাষা ও ইনপুট → টেক্সট-টু-স্পিচ → বাংলা ভয়েস ডাউনলোড করুন'}</div></div>
            <span class="pill ${best ? 'ok' : ''}">${best ? 'প্রস্তুত' : 'যোগ করুন'}</span></div>
          <button class="btn gold block mt" data-act="voiceDemo" data-mode="${stmtMode()}">এই কণ্ঠে শুনুন</button>
        </div>

        <div class="sect"><h4>পাঠের ধরন</h4><div class="line"></div></div>
        <div class="vs-modes">${modes.map(([k, n, d]) => `<button class="vs-mode ${(st.mode || 'normal') === k ? 'on' : ''}" data-act="voiceMode" data-m="${k}">
          <b>${n}</b><i>${d}</i></button>`).join('')}</div>

        <div class="sect"><h4>কণ্ঠের রঙ</h4><div class="line"></div></div>
        <div class="vs-voices">${(window.VOICE ? VOICE.VOICES : []).map(v => `<button class="vs-voice ${st.voice === v.id ? 'on' : ''}" data-act="voicePick" data-v="${v.id}">
          <b>${v.n}</b><i>${v.d}</i></button>`).join('')}</div>

        <div class="sect"><h4>সূক্ষ্ম নিয়ন্ত্রণ</h4><div class="line"></div></div>
        <div class="card pad">
          <div class="vs-row"><span>গতি</span><input class="vs-range" type="range" min="70" max="130" value="${Math.round((st.rate || 1) * 100)}" data-act="voiceRate" aria-label="গতি"><b id="vsRate">${Math.round((st.rate || 1) * 100)}%</b></div>
          <div class="vs-row"><span>স্বর (উঁচু–নিচু)</span><input class="vs-range" type="range" min="80" max="125" value="${Math.round((st.pitch || 1) * 100)}" data-act="voicePitch" aria-label="স্বর"><b id="vsPitch">${Math.round((st.pitch || 1) * 100)}%</b></div>
          <label class="vs-check"><input type="checkbox" data-act="voiceBreath" ${st.breath ? 'checked' : ''}> শ্বাস-শব্দ (মানুষের মতো)</label>
          <label class="vs-check"><input type="checkbox" data-act="voicePauses" ${st.pauses ? 'checked' : ''}> স্বাভাবিক বিরতি ও থামা</label>
          <button class="btn ghost block mt" data-act="voiceReset">আবার ডিফল্টে</button>
        </div>

        <p class="mini muted" style="line-height:1.8;margin-top:12px">কণ্ঠ তৈরি হয় আপনার ফোনের ভেতরেই — কোনো লেখা সার্ভারে যায় না। যদি কণ্ঠ এখনও রোবটের মতো শোনায়, ফোনের সেটিংস → টেক্সট-টু-স্পিচ থেকে <b>Google বাংলা / Natural বাংলা</b> ভয়েস ডাউনলোড করলে গুণমান অনেক বাড়ে।</p>
        ${vs.length ? `<div class="tiny muted" style="margin-top:8px">পাওয়া বাংলা কণ্ঠ: ${vs.map(v => esc(v.name)).join(' · ')}</div>` : ''}
      </div><div style="height:20px"></div>`;
    }
  function stmtMode() { try { return (window.VOICE && VOICE.settings().mode) || 'normal'; } catch (e) { return 'normal'; } }
  function saveVoice() { try { save('voicePrefs', VOICE.settings()); S.speakMode = VOICE.settings().mode; save('speakMode'); } catch (e) { } }
