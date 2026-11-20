/* ==========================================================================
   BINDINGS — ক্লিক, ইনপুট, কীবোর্ড, স্ক্রল ধরা
   ফাইল: js/core/86-bindings.js
   ========================================================================== */
  /* ফাইল-স্টোরেজ: ফাইল বেছে নিলে সাথে সাথে যোগ হবে */
  document.addEventListener('change', async e => {
    if (!e.target || e.target.id !== 'medFile') return;
    const files = e.target.files;
    if (!files || !files.length) return;
    toast('যোগ করা হচ্ছে…');
    const added = await MEDIA.addFiles(files);
    e.target.value = '';
    toast(added.length + 'টি ফাইল যোগ হলো ✓');
    render();
  });
  window.addEventListener('pagehide', apHalt);
  window.addEventListener('beforeunload', apHalt);
  document.addEventListener('freeze', apHalt);
  document.addEventListener('visibilitychange', () => {
      /* অ্যাপ পিছনে গেলেই অডিও থামে (তাই অ্যাপ বন্ধ করলে শব্দ থাকবে না);
         ফিরে এলে আগে চলছিল এমন হলে নিজেই আবার চালু হয় */
      if (!AP.player) return;
      if (document.visibilityState === 'hidden') {
        if (apPlaying()) { AP.resumeOnShow = true; try { AP.player.pauseVideo(); } catch (e) {} }
      } else if (AP.resumeOnShow) {
        AP.resumeOnShow = false;
        try { AP.player.playVideo(); } catch (e) {}
        apRender();
      }
    });
  let homeRecognition = null;
  function homeVoiceStatus(message, listening) {
      const status = document.getElementById('homeVoiceStatus');
      const button = document.querySelector('.ref-search-voice');
      if (status) { status.textContent = message; status.hidden = !message; }
      if (button) { button.classList.toggle('is-listening', !!listening); button.setAttribute('aria-pressed', listening ? 'true' : 'false'); button.setAttribute('aria-label', listening ? 'ভয়েস শোনা বন্ধ করুন' : 'ভয়েস দিয়ে খুঁজুন'); }
    }
  function toggleHomeVoice() {
      if (homeRecognition) { homeRecognition.stop(); homeRecognition = null; homeVoiceStatus('', false); return; }
      const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Speech) { homeVoiceStatus('এই ব্রাউজারে ভয়েস অনুসন্ধান সমর্থিত নয়। লিখে খুঁজুন।', false); return; }
      const recognition = new Speech(); homeRecognition = recognition;
      recognition.lang = 'bn-BD'; recognition.interimResults = false; recognition.maxAlternatives = 1;
      let reportedError = false;
      recognition.onresult = event => {
        const input = document.getElementById('homeSearch');
        const transcript = event.results && event.results[0] && event.results[0][0] && event.results[0][0].transcript;
        if (input && transcript) { input.value = transcript; updateHomeSearch(input); }
        homeVoiceStatus(transcript ? 'শোনা শব্দ দিয়ে খোঁজা হয়েছে।' : 'কথা শোনা যায়নি। আবার চেষ্টা করুন।', false);
      };
      recognition.onerror = event => {
        reportedError = true;
        const message = event.error === 'not-allowed' || event.error === 'service-not-allowed' ? 'মাইক্রোফোনের অনুমতি দিন, অথবা লিখে খুঁজুন।' : event.error === 'no-speech' ? 'কথা শোনা যায়নি। আবার চেষ্টা করুন।' : 'ভয়েস অনুসন্ধান করা যায়নি। লিখে খুঁজুন।';
        homeVoiceStatus(message, false);
      };
      recognition.onend = () => { if (homeRecognition === recognition) { homeRecognition = null; const button = document.querySelector('.ref-search-voice'); if (button) { button.classList.remove('is-listening'); button.setAttribute('aria-pressed','false'); button.setAttribute('aria-label','ভয়েস দিয়ে খুঁজুন'); } if (!reportedError && document.getElementById('homeVoiceStatus')?.textContent === 'শুনছি… এখন বলুন।') homeVoiceStatus('কথা শোনা যায়নি। আবার চেষ্টা করুন।', false); } };
      try { recognition.start(); homeVoiceStatus('শুনছি… এখন বলুন।', true); }
      catch (e) { homeRecognition = null; homeVoiceStatus('ভয়েস অনুসন্ধান করা যায়নি। লিখে খুঁজুন।', false); }
    }
  function updateHomeSearch(input) {
      const box = document.getElementById('homeSearchResults');
      const clear = document.querySelector('.ref-search-clear');
      if (!box || !input) return;
      const query = input.value.trim();
      if (clear) clear.hidden = !query;
      box.hidden = !query;
      input.setAttribute('aria-expanded', query ? 'true' : 'false');
      box.innerHTML = query ? searchResultsHTML(query) : '';
    }
  document.addEventListener('click', e => {
      if (!e.target.closest('.ref-home-search')) {
        const input = document.getElementById('homeSearch'), box = document.getElementById('homeSearchResults');
        if (box) box.hidden = true;
        if (input) input.setAttribute('aria-expanded', 'false');
      }
      const move = e.target.closest('[data-hero-move]');
      if (move) { _hxUserAt = Date.now(); heroShow(_hxIdx + Number(move.dataset.heroMove)); return; }
      const hd = e.target.closest('.hx-d');
      if (hd) { heroShow(+hd.dataset.hd); return; }
      if (e.target.closest('.hx-rot')) { heroShow(_hxIdx + 1); return; }
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const fn = ACTIONS[el.dataset.act];
      if (fn) { e.preventDefault(); fn(el, e); }
    });
  document.addEventListener('change', e => {
      if (e.target && e.target.id === 'bgmFile') { ACTIONS.bgmFilePicked(e.target); e.target.value = ''; return; }
      if (e.target && e.target.id === 'pdfFile') { pdfAddFiles(e.target.files).catch(() => toast('PDF পড়া যায়নি')); e.target.value = ''; }
    });
  document.addEventListener('dragover', e => {
      if (location.hash.indexOf('#/library/pdf') !== 0) return;
      if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files')) { e.preventDefault(); }
    });
  document.addEventListener('drop', e => {
      if (location.hash.indexOf('#/library/pdf') !== 0) return;
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        e.preventDefault(); pdfAddFiles(e.dataTransfer.files).catch(() => toast('PDF পড়া যায়নি'));
      }
    });
  document.addEventListener('input', e => {
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-role') === 'bgmVol') {
        if (window.BGM) BGM.setVol(Number(e.target.value) / 100);
        const t = document.getElementById('bgmVolTxt'); if (t) t.textContent = e.target.value + '%';
        return;
      }
      if (e.target && e.target.id === 'pdfQ') {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('#pdfList .pdf-row').forEach(r => {
          const t = (r.innerText || '').toLowerCase();
          r.style.display = !q || t.includes(q) ? '' : 'none';
        });
      }
    });
  let _pdfTouch = null;
  document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('#pdfStage')) _pdfTouch = { x: e.clientX, y: e.clientY }; }, { passive: true });
  document.addEventListener('pointerup', e => {
      if (!_pdfTouch) return;
      const dx = e.clientX - _pdfTouch.x, dy = e.clientY - _pdfTouch.y; _pdfTouch = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) pdfRender(PDFVIEW.num + (dx < 0 ? 1 : -1)).catch(() => { });
    });
  document.addEventListener('keydown', e => {
      if (location.hash.indexOf('#/library/pdf/') !== 0) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); pdfRender(PDFVIEW.num + 1).catch(() => { }); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); pdfRender(PDFVIEW.num - 1).catch(() => { }); }
    });
  document.addEventListener('keydown', e => {
      const taskPop = document.getElementById('dailyTaskPop');
      if (e.key === 'Tab' && taskPop && taskPop.classList.contains('on')) {
        const controls = [...taskPop.querySelectorAll('.daily-task-card button:not([disabled])')];
        if (controls.length) {
          const first = controls[0], last = controls[controls.length - 1];
          if (e.shiftKey && (document.activeElement === first || !taskPop.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && (document.activeElement === last || !taskPop.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
        }
      }
      if (e.key === 'Escape' && e.target.id === 'homeSearch') { const box = document.getElementById('homeSearchResults'); if (box) box.hidden = true; e.target.setAttribute('aria-expanded','false'); return; }
      if (e.key === 'Enter' && e.target.id === 'homeSearch') { const result = document.querySelector('#homeSearchResults .ref-date-open, #homeSearchResults .sres'); if (result) { e.preventDefault(); result.click(); } return; }
      if (e.key === 'Escape') { closeDailyTasks(); closeSetPop(); closeSearchPop(); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target.closest('[data-act][role="button"],[data-act][role="checkbox"]');
      if (el) { e.preventDefault(); el.click(); }
    });
  document.addEventListener('focusin', e => { if (e.target.id === 'homeSearch' && e.target.value.trim()) updateHomeSearch(e.target); });
  document.addEventListener('input', e => {
      if (e.target && e.target.id === 'homeSearch') { updateHomeSearch(e.target); return; }
      if (e.target && e.target.id === 'sq') {
        SI.q = e.target.value;
        clearTimeout(SI.t); SI.t = setTimeout(() => runSearch(SI.q), 110);
        return;
      }
      if (e.target.id === 'chatDraft') { U.chatDraft = e.target.value; return; }
      if (e.target.id === 'noteText') { U.note.text = e.target.value; return; }
      if (e.target.id === 'noteSearch') {
        U.noteQ = e.target.value; render();
        const ni = document.getElementById('noteSearch');
        if (ni) { ni.focus(); ni.setSelectionRange(ni.value.length, ni.value.length); }
        return;
      }
      if (e.target.id === 'libSearch') {
        U.libQ = e.target.value;
        const list = document.getElementById('libList');
        if (list) list.innerHTML = bookCards();
      }
      if (e.target.dataset && e.target.dataset.field) {
        const f = e.target.dataset.field;
        const entry = entryFor(TODAY_KEY);
        entry[f] = e.target.value;
        save('daily');
        return;
      }
      if (e.target.id === 'apSeekBig') {
        const v = +e.target.value, d = (AP.player && AP.player.getDuration) ? AP.player.getDuration() : 0;
        if (d) { AP.player.seekTo(v, true); apFillPct(e.target, v / d * 100); }
        const t = document.getElementById('apTimeBig'); if (t) t.textContent = apTime(v);
        return;
      }
      if (e.target.id === 'apVol') { apSetVol(+e.target.value); apFillPct(e.target, +e.target.value); return; }
      if (e.target.id === 'jyDate' || e.target.id === 'jyTime' || e.target.id === 'jyCity') {
        const st = jyState();
        if (e.target.id === 'jyDate') st.date = e.target.value;
        else if (e.target.id === 'jyTime') st.time = e.target.value;
        else st.city = +e.target.value;
        render();
        return;
      }
      if (e.target.id === 'gitaSearch') {
        U.gitaQ = e.target.value; render();
        const gi = document.getElementById('gitaSearch');
        if (gi) { gi.focus(); gi.setSelectionRange(gi.value.length, gi.value.length); }
        return;
      }
      if (e.target.id === 'adminSearch') {
        U.adminQ = e.target.value; render();
        const inp = document.getElementById('adminSearch');
        if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      }
      if (e.target.id === 'marketSearch') {
        U.marketQ = e.target.value;
        const list = document.getElementById('marketList');
        if (list) list.innerHTML = providerCards();
      }
    });
  window.addEventListener('hashchange', render);
  initDragEngine();
  const _renderOld = render;
  render = function () {
      const r = _renderOld.apply(this, arguments);
      try { if (window.__cmdSlim) window.__cmdSlim(); } catch (e) { }
      /* নাদ-সারি চোখের সামনে এলে পাঁচটি প্লেয়ার নীরব অবস্থায় তৈরি করে রাখি */
      setTimeout(function () {
        try {
          if (!document.querySelector('.nad-foot') || !NPLR || !NPLR.warm) return;
          if (window.__nadWarmed) return;
          window.__nadWarmed = true;
          NPLR.warm();
        } catch (e) { }
      }, 500);
      return r;
    };
