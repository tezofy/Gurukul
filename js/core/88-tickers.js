/* ==========================================================================
   হেডার, ব্র্যান্ড-বার্তা ও ঘোরানো শিরোনাম
   ফাইল: js/core/88-tickers.js
   ========================================================================== */
  const BL_LINES = [
      '॥ ধর্মো রক্ষতি রক্ষিতঃ ॥',
      'প্রতিদিন এক শ্লোক · প্রতিদিন এক ধাপ',
      'গীতা · উপনিষদ · পুরাণ — সব এক জায়গায়',
      '৮০৫ চ্যানেলের কথা, কীর্তন ও শাস্ত্রপাঠ',
      'নিয়মিত জপে মন স্থির হয়, পূজায় ঘর পবিত্র'
    ];
  const BL_PROMO = ['আপনার শিশুকে প্রাতিষ্ঠানিক শিক্ষার', 'পাশাপাশি ধর্মীয় শিক্ষায় শিক্ষিত করুন।'];
  let _blTimer = null, _blCount = 0, _blSince = 0, _blPhase = 'line';
  function brandLineSet(text) {
      const el = document.getElementById('brandline');
      if (!el || el.dataset.txt === text) return;
      el.dataset.txt = text;
      el.classList.add('out');
      setTimeout(() => {
        el.textContent = text;
        el.classList.remove('out');
        el.classList.add('in');
        setTimeout(() => el.classList.remove('in'), 460);
      }, 220);
    }
  function brandTicker() {
      clearTimeout(_blTimer);
      const tick = () => {
        const el = document.getElementById('brandline');
        if (!el) { _blTimer = null; return; }
        if (_blPhase === 'promo1') {
          brandLineSet(BL_PROMO[0]); el.classList.add('promo');
          _blPhase = 'promo2'; _blTimer = setTimeout(tick, 5000); return;
        }
        if (_blPhase === 'promo2') {
          brandLineSet(BL_PROMO[1]);
          _blPhase = 'line'; _blSince = 0; _blTimer = setTimeout(tick, 5000); return;
        }
        el.classList.remove('promo');
        brandLineSet(BL_LINES[_blCount % BL_LINES.length]);
        _blCount++; _blSince++;
        _blPhase = (_blSince >= 4) ? 'promo1' : 'line';
        _blTimer = setTimeout(tick, 3000);
      };
      tick();
    }
  let _hdrRaf = null;
  function hdrUpdate() {
      const v = document.getElementById('view');
      const h = document.querySelector('.home-head');
      if (!h) return;
      const on = !!v && v.scrollTop > 52;
      if (on !== h.classList.contains('hdr-min')) h.classList.toggle('hdr-min', on);
    }
  function hdrInit() {
      const v = document.getElementById('view');
      if (!v || v.dataset.hdrBound) return;
      v.dataset.hdrBound = '1';
      v.addEventListener('scroll', () => {
        if (_hdrRaf) return;
        _hdrRaf = (window.requestAnimationFrame || (f => setTimeout(f, 16)))(() => { _hdrRaf = null; hdrUpdate(); });
      }, { passive: true });
    }
  let _abTimer = null, _abCount = 0;
  function appbarTicker() {
      clearInterval(_abTimer); _abTimer = null;
      const h0 = document.querySelector('.appbar h3');
      if (!h0) return;
      if (h0.dataset.orig === undefined) h0.dataset.orig = h0.innerHTML;
      const orig = h0.dataset.orig, alt = 'সনাতন বিদ্যাপীঠ';
      _abCount = 0;
      const swap = (txt) => {
        const el = document.querySelector('.appbar h3');
        if (!el) return;
        el.classList.toggle('ab-brand', txt === alt);
        el.classList.add('ab-out');
        setTimeout(() => {
          const e2 = document.querySelector('.appbar h3');
          if (!e2) return;
          e2.innerHTML = txt;
          e2.classList.toggle('ab-brand', txt === alt);
          e2.classList.remove('ab-out');
          e2.classList.add('ab-in');
          setTimeout(() => { const e3 = document.querySelector('.appbar h3'); if (e3) e3.classList.remove('ab-in'); }, 430);
        }, 180);
      };
      _abTimer = setInterval(() => {
        const el = document.querySelector('.appbar h3');
        if (!el) { clearInterval(_abTimer); _abTimer = null; return; }
        if (document.hidden) return;
        _abCount++;
        swap(_abCount % 3 === 0 ? alt : orig);
      }, 3600);
    }
  let _hxTimer = null, _hxIdx = 0, _hxUserAt = 0, _writeTimer = null;
  function writeHeroTitle(slide) {
      clearTimeout(_writeTimer); _writeTimer = null;
      if (!slide) return;
      const ink = slide.querySelector('.ref-writing-ink');
      const quill = slide.querySelector('.ref-writing-feather');
      const title = slide.querySelector('.ref-writing-title');
      if (!ink || !quill || !title) return;
      const text = title.getAttribute('aria-label') || ink.textContent;
      ink.textContent = text;
      quill.classList.remove('is-writing');
      if (document.documentElement.classList.contains('no-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
      const parts = typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter('bn', { granularity: 'grapheme' }).segment(text), x => x.segment) : Array.from(text);
      ink.textContent = '';
      const fragment = document.createDocumentFragment();
      const letters = parts.map(part => { const node = document.createElement('span'); node.className = 'ref-writing-letter'; node.textContent = part; fragment.appendChild(node); return node; });
      ink.appendChild(fragment);
      let index = 0; const delay = Math.max(55, Math.min(260, 2700 / Math.max(1, letters.length)));
      function step() {
        if (!slide.isConnected || !slide.classList.contains('on')) return;
        if (index >= letters.length) { _writeTimer = setTimeout(() => quill.classList.remove('is-writing'), 250); return; }
        const letter = letters[index++]; letter.classList.add('written');
        const rect = letter.getBoundingClientRect(), area = title.getBoundingClientRect();
        quill.style.left = (rect.right - area.left - 27) + 'px';
        quill.style.top = (rect.bottom - area.top - 30) + 'px';
        quill.classList.add('is-writing');
        _writeTimer = setTimeout(step, delay);
      }
      _writeTimer = setTimeout(step, 120);
    }
  function heroItems() { const r = document.getElementById('heroRot'); return r ? Array.from(r.children) : []; }
  function heroShow(i) {
      const items = heroItems(); if (!items.length) return;
      _hxIdx = ((i % items.length) + items.length) % items.length;
      items.forEach((el, k) => { el.classList.toggle('on', k === _hxIdx); el.setAttribute('aria-hidden', k === _hxIdx ? 'false' : 'true'); });
      writeHeroTitle(items[_hxIdx]);
      const count = document.getElementById('heroCount');
      if (count) count.textContent = `${bn(_hxIdx + 1)} / ${bn(items.length)}`;
      document.querySelectorAll('.hx-d').forEach((d, k) => d.classList.toggle('on', k === _hxIdx));
    }
  function heroTicker() {
      clearInterval(_hxTimer); _hxTimer = null;
      if (!heroItems().length) return;
      heroShow(0);
      if (heroItems().length < 2) return;
      const slow = document.documentElement.classList.contains('no-motion')
        || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      _hxTimer = setInterval(() => {
        if (!document.getElementById('heroRot')) { clearInterval(_hxTimer); _hxTimer = null; return; }
        if (document.hidden || Date.now() - _hxUserAt < 6500) return;
        heroShow(_hxIdx + 1);
      }, slow ? 14000 : 6500);
    }
