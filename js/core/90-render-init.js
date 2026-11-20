/* ==========================================================================
   শেষ ধাপ · render(), init() ও অ্যাপ চালু
   ফাইল: js/core/90-render-init.js
   ========================================================================== */
  function render() {
      /* অন্য পাতায় চলে গেলে আরতি থেমে যাবে */
      const ast = aartiState();
      if (ast.playing && location.hash.indexOf('#/puja/deva/' + ast.id) !== 0) {
        AENG.stop(); setTimeout(syncAartiUI, 0);
      }
      route(); hdrInit(); hdrUpdate(); appbarTicker(); if (document.getElementById('brandline')) brandTicker();
      if (document.getElementById('heroRot')) heroTicker();
      refreshSetPop(); refreshDailyTasks();
      setTimeout(syncAartiUI, 0);
      setTimeout(syncNadUI, 0);
      if (location.hash.indexOf('#/library/pdf') === 0 && document.getElementById('pdfStage')) setTimeout(pdfBoot, 30);
    if (location.hash.indexOf('#/file/') === 0) setTimeout(mediaViewBoot, 30);
    }
  function init() {
      /* ডিফল্ট থিম এখন লাইট — পুরনো সেভ করা 'dark' একবার বদলে দেওয়া হয় */
      if (!store.get('themeLight2', false)) { store.set('themeLight2', true); S.theme = 'light'; save('theme'); }
      document.body.insertAdjacentHTML('afterbegin', SPRITE);
      /* নেভিগেশন-বারের বাইরে, ডান পাশে ভাসমান নোট-বাটন */
      document.body.insertAdjacentHTML('beforeend',
        `<div id="sheetHost"></div>
        <div class="fabwrap">
          <button class="notefab musicfab" data-act="sheetOpen" aria-label="আজকের হিসাব ও নোট — মন্দির-সংগীত চালু আছে" title="আজকের হিসাব ও নোট">
            <span class="mf-ring" aria-hidden="true"></span>
            <span class="mf-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="mf-ico" aria-hidden="true">${ico('plus')}</span>
            <span class="mf-badge" id="mfBadge" aria-hidden="true"></span>
          </button>
          <button class="mf-mini" data-act="bgmToggle" id="bgmMini" aria-label="মন্দির-সংগীত চালু/বন্ধ" title="মন্দির-সংগীত">♪</button>
        </div>`);
      document.documentElement.dataset.theme = S.theme;
      applyBg();
      /* কণ্ঠের পছন্দ ফিরিয়ে আনা + ভয়েস-বার */
      try {
        const vp = store.get('voicePrefs', null);
        if (vp && window.VOICE) Object.keys(vp).forEach(k => VOICE.set(k, vp[k]));
        S.speakMode = store.get('speakMode', 'normal');
        if (window.VOICE) VOICE.set('mode', S.speakMode);
      } catch (e) { }
      mountVoiceBar();
      /* মন্দির-সংগীত: নিজে থেকেই মৃদু background-এ */
      try {
        if (window.BGM) {
          BGM.boot();
          BGM.onState(st => {
            const b = document.getElementById('mfBadge'); const mini = document.getElementById('bgmMini');
            const fab = document.querySelector('.musicfab');
            if (b) b.textContent = st.muted || !st.on ? '⏸' : '♪';
            const fab2 = document.querySelector('.musicfab');
            if (fab2) fab2.title = 'আজকের হিসাব ও নোট — সংগীত: ' + st.track;
            if (mini) { mini.textContent = st.muted || !st.on ? '🔇' : '♪'; mini.classList.toggle('off', st.muted || !st.on); }
            if (fab) fab.classList.toggle('music-off', st.muted || !st.on);
          });
          if (window.VOICE && VOICE.onState) VOICE.onState(st => BGM.duck(!!st.playing));
        }
      } catch (e) { }
      document.documentElement.classList.toggle('no-motion', !S.motion);
      /* নিচের কমান্ড-বার ছোট হয়ে যায় — পোস্টারের নিচের বাটনগুলো ঢাকা না পড়ে */
      let _cmdMin = null;
      const cmdSlim = () => {
        const bar = document.querySelector('.cmdbar');
        if (!bar) { _cmdMin = null; return; }
        /* স্ক্রল হয় ভেতরের .view-তে, window-এ নয় */
        const view = document.querySelector('.view');
        const sy = Math.max(window.scrollY || 0, view ? view.scrollTop : 0);
        const min = sy > 60 || window.innerHeight < 700;
        if (min !== _cmdMin) { _cmdMin = min; bar.classList.toggle('min', min); }
      };
      window.__cmdSlim = cmdSlim;
      window.addEventListener('scroll', cmdSlim, { passive: true });
      document.addEventListener('scroll', cmdSlim, { passive: true, capture: true });
      setTimeout(cmdSlim, 0); setTimeout(cmdSlim, 300);
      try { if (NPLR && NPLR.preload) NPLR.preload(); } catch (e) { }
      document.addEventListener('click', function () { try { if (NPLR && NPLR.preload) NPLR.preload(); } catch (e) { } }, { once: true, capture: true });
      window.addEventListener('resize', cmdSlim, { passive: true });
      if (NPLR) NPLR.onChange = () => { try { syncNadUI(); } catch (e) { } };
      if (NPLR) NPLR.onNote = msg => { try { toast(msg); } catch (e) { } };
      if (!location.hash) location.hash = '#/home';
      render();
      /* Refresh the date after local midnight even when the app remains open. */
      const refreshCalendarDate = () => {
        const now = new Date(), nextKey = key(now);
        if (nextKey === TODAY_KEY) return;
        const oldKey = TODAY_KEY; TODAY = now; TODAY_KEY = nextKey;
        if (U.panjika && U.panjika.day === oldKey) U.panjika.day = nextKey;
        render();
      };
      setInterval(refreshCalendarDate, 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshCalendarDate(); });
      setTimeout(maybeNotify, 2500);
      setTimeout(() => {
        if (!store.get('seen', false)) {
          store.set('seen', true);
          toast('স্বাগতম 🙏 ডেমো মোড — সব ডেটা আপনার ব্রাউজারেই থাকে');
        }
      }, 900);
    }
