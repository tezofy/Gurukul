/* ==========================================================================
   ৭. পূজা-মঞ্চ — লেয়ার, ধাপ ও মন্ত্র, ঘণ্টা, আরতি, অর্পণ
   ফাইল: js/features/puja-temple.js
   ========================================================================== */
  const DEVA = (typeof DARPAN_DEVAS !== 'undefined') ? DARPAN_DEVAS : [];
  const UPK = (typeof DARPAN_UPOKARAN !== 'undefined') ? DARPAN_UPOKARAN : {};
  const AAR = (typeof AARTI !== 'undefined') ? AARTI : {};
  const NADS = (typeof NAD !== 'undefined') ? NAD : {};
  const NENG = (typeof NAD_ENGINE !== 'undefined') ? NAD_ENGINE : null;
  const NPLR = (typeof NAD_PLAYER !== 'undefined') ? NAD_PLAYER : null;
  const AENG = (typeof AARTI_ENGINE !== 'undefined') ? AARTI_ENGINE : null;
  const ART_Q = '?v=88';
  const artSrc = (kind, name) => `icons/${kind}/${name}.png${ART_Q}`;
  const ART_LOAD = 'this.parentNode.classList.add(\'has-art\')';
  const ART_FAIL = "this.remove()";
  const devaKey = id => id + ':' + TODAY_KEY;
  const devaDone = id => (S.deva && S.deva[devaKey(id)]) || [];
  const upkGlyph = k => ({ aasan: 'আ', jal: 'জ', ful: 'ফ', diya: 'দী', dhup: 'ধূ', agarbati: 'অ',
      chandan: 'চ', bel: 'বেল', durba: 'দূ', noi: 'নৈ', pancha: 'প', ganti: 'ঘ' }[k] || '•');
  function hydrateArt() {
      document.querySelectorAll('img.artimg').forEach(img => {
        if (img.dataset.hyd) return;
        img.dataset.hyd = '1';
        const box = img.closest('[data-artbox]');
        const done = () => { if (box) box.classList.add('has-art'); };
        if (img.complete && img.naturalWidth > 0) return done();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', () => { img.remove(); }, { once: true });
      });
    }
  function devaGrid() {
      const illustratedDevas = new Set(DEVA.map(d => d.id));   /* সব দেবতার নিজস্ব কাট-আউট ছবি */
      return `<div class="dv-grid">${DEVA.map(d => {
        const steps = darpanSteps(d);
        const done = Math.min(devaDone(d.id).length, steps.length);
        const pct = steps.length ? Math.round(done / steps.length * 100) : 0;
        const art = d.id === 'ganesh' ? 'icons/reference/cal-deity.png' : artSrc('deva/card', d.id);
        return `<button type="button" class="dv-card" data-act="nav" data-to="#/puja/deva/${d.id}" aria-label="${esc(d.n)} পূজা, ${bn(done)}টি ধাপ সম্পন্ন, ${bn(steps.length)}টির মধ্যে">
          <span class="dv-scroll-content">
            <span class="dv-cname">${esc(d.n)} পূজা</span>
            <span class="dv-csub">${esc(d.sub)}</span>
            <span class="dv-art-row">
              <span class="dv-thumb" data-artbox>
                ${illustratedDevas.has(d.id) ? `<img class="artimg dv-img" src="${art}" alt="" aria-hidden="true" loading="lazy" decoding="async" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>` : ''}
                <span class="dv-glyph fallback" aria-hidden="true">${esc(d.murti || d.beej)}</span>
              </span>
              <span class="dv-medallion"><img src="icons/reference/card-ring-layer.png" alt="" aria-hidden="true"/><b>${bn(done)}/${bn(steps.length)}</b></span>
            </span>
            <span class="dv-cbar" aria-hidden="true"><i style="width:${pct}%"></i></span>
            <span class="dv-cmeta">${done ? bn(done) + '/' + bn(steps.length) + ' ধাপ · ' + bn(pct) + '%' : bn(steps.length) + ' ধাপ'}</span>
          </span>
        </button>`;
      }).join('')}</div>`;
    }
  const nadOn = k => !!(NPLR && NPLR.isOn(k));
  function nadChip(k) {
      const o = NADS[k] || { n: k, t: '', g: '•' };
      const on = nadOn(k);
      return `<button class="nad-chip${on ? ' on' : ''}" data-act="nad" data-k="${k}" aria-pressed="${on ? 'true' : 'false'}"
          aria-label="${esc(o.n)} — ${on ? 'বন্ধ করুন' : 'চালু করুন'}" title="${esc(o.n)} · ${esc(o.t)} (চাপ দিলে চালু/বন্ধ)">
        <span class="nad-ic" data-artbox>
          <img class="artimg" src="icons/nad/${k}.png${ART_Q}" alt="" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
          <span class="fallback">${esc(o.g || '•')}</span>
        </span>
        <b>${esc(o.n)}</b>
      </button>`;
    }
  const NAD_LINKS = ['shankha', 'ulu', 'dhak', 'kashar', 'ganti'];
  const NAD_YT = (typeof window !== 'undefined' && window.NAD_YT) || {
      shankha: '7JLJPuSDuVM', ulu: 'PvzGO7b-VTM', dhak: '6eZ-3e5KbZo',
      kashar: 'FXKJQakZJMs', ganti: 'FYYBqNV9res'
    };
  const NAD_LEFT = ['shankha', 'ulu'];
  const NAD_RIGHT = ['dhak', 'kashar'];
  function nadRow(keys) {
      return `<div class="nad-row">${keys.map(nadChip).join('')}</div>`;
    }
  function nadFoot() {
      return `<div class="nad-foot">
        ${nadChip('ganti')}
        <button class="nad-chip nad-stop" data-act="nadStop" aria-label="সব নাদ বন্ধ করুন" title="সব নাদ বন্ধ — এক চাপে সব ধ্বনি থামবে">
          <span class="nad-ic" data-artbox>
            <img class="artimg" src="icons/nad/stop.png${ART_Q}" alt="" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
            <span class="fallback">✕</span>
          </span>
          <b>সব বন্ধ</b>
        </button>
      </div>
      <p class="nad-note"></p>
      <p class="nad-links">ইউটিউবে শুনুন: ${NAD_LINKS.map(k => `<a href="https://youtu.be/${NAD_YT[k]}" target="_blank" rel="noopener noreferrer">${esc((NADS[k] || {}).n || k)}</a>`).join(' · ')}</p>`;
    }
  function nadNoteText() {
      const on = (NPLR && NPLR.active) ? NPLR.active() : [];
      if (!on.length) return 'নাদ বন্ধ — যেটি চালু করবেন, সেটি বাজতেই থাকবে';
      const nm = ks => ks.map(k => (NADS[k] || {}).n).join(' · ');
      const yt = on.filter(k => NPLR.mode(k) === 'yt');
      const sy = on.filter(k => NPLR.mode(k) === 'synth');
      const pd = on.filter(k => NPLR.mode(k) === 'pending');
      const parts = [];
      if (yt.length) parts.push('ইউটিউবে বাজছে: ' + nm(yt));
      if (sy.length) parts.push('অ্যাপের ধ্বনি: ' + nm(sy));
      if (pd.length) parts.push('লোড হচ্ছে: ' + nm(pd));
      const bl = on.filter(k => NPLR.blocked && NPLR.blocked(k));
      if (bl.length) parts.push('ইউটিউব আটকাচ্ছে (' + nm(bl) + ') — নিচের লিংক থেকে শুনুন');
      return parts.join(' · ');
    }
  function syncNadUI() {
      document.querySelectorAll('.nad-chip[data-k]').forEach(el => {
        const on = nadOn(el.dataset.k);
        el.classList.toggle('on', on);
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
        const nm = (NADS[el.dataset.k] || {}).n || '';
        el.setAttribute('aria-label', nm + ' — ' + (on ? 'বন্ধ করুন' : 'চালু করুন'));
        el.classList.toggle('synth', on && !!(NPLR && NPLR.mode(el.dataset.k) === 'synth'));
        el.classList.toggle('pending', on && !!(NPLR && NPLR.mode(el.dataset.k) === 'pending'));
      });
      document.querySelectorAll('.nad-note').forEach(n => { n.textContent = nadNoteText(); });
    }
  function toggleNad(el, k) {
      if (!NPLR || !NENG) { toast('এই ব্রাউজারে নাদ বাজানো যাচ্ছে না'); return; }
      /* চাপের মুহূর্তেই অডিও-কনটেক্সট চালু (iOS/Chrome-এর নিয়ম) */
      try { if (NENG.prime) NENG.prime(); } catch (e) { }
      const nowOn = NPLR.toggle(k);
      if (!S.sound) { S.sound = true; save('sound'); }
      syncNadUI();
      if (el && nowOn) { el.classList.remove('kick'); void el.offsetWidth; el.classList.add('kick'); }
      toast((NADS[k] || {}).n + (nowOn ? ' চালু — বাজছে ✓' : ' বন্ধ'));
    }
  function nadStopAll() {
      if (NPLR) NPLR.stopAll();
      syncNadUI();
      toast('সব নাদ বন্ধ হলো');
    }
  const aartiOf = id => AAR[id] || null;
  const aartiYT = t => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t + ' আরতি');
  function aartiState() {
      return AENG ? AENG.state() : { playing: false, id: null, line: 0, elapsed: 0, total: 0 };
    }
  function syncAartiUI() {
      const st = aartiState();
      document.querySelectorAll('[data-aarti]').forEach(box => {
        const on = st.playing && st.id === box.dataset.aarti;
        box.classList.toggle('playing', !!on);
        box.classList.toggle('paused', !on && st.id === box.dataset.aarti && st.line > 0);
        const btn = box.querySelector('[data-act="aartiPlay"]');
        if (btn) btn.innerHTML = on ? '⏸ থামান' : (st.id === box.dataset.aarti && st.elapsed > 0 ? '▶ আবার সুর' : '▶ অ্যাপের সুর');
        const bar = box.querySelector('.ar-bar > i');
        if (bar) bar.style.width = (on && st.total ? Math.round(st.elapsed / st.total * 100) : 0) + '%';
        const cur = box.querySelector('.ar-cur');
        if (cur) {
          const line = on ? ((AAR[st.id] || {}).lines || [])[st.line] : '';
          cur.textContent = line ? '“' + line + '”' : '';
        }
        box.querySelectorAll('.ar-line').forEach(el => {
          const i = +el.dataset.i;
          el.classList.toggle('on', on && i === st.line);
          el.classList.toggle('past', on && i < st.line);
        });
      });
    }
  function aartiFocusLine(i) {
      const box = document.querySelector('.dv-aarti');
      if (!box || !S.motion) return;
      const el = box.querySelector('.ar-line[data-i="' + i + '"]');
      if (!el) return;
      try {
        const r = el.getBoundingClientRect(), br = box.getBoundingClientRect();
        if (r.top < br.top + 30 || r.bottom > br.bottom - 30) {
          window.scrollTo({ top: window.scrollY + r.top - br.top - 60, behavior: 'smooth' });
        }
      } catch (e) { }
    }
  function openYt(id) {
      const a = aartiOf(id);
      if (!a || !a.yt) { if (a) window.open(aartiYT(a.t), '_blank', 'noopener'); return; }
      if (AENG && aartiState().playing) { AENG.stop(); syncAartiUI(); }
      document.querySelectorAll('.yt-slot').forEach(slot => {
        if (slot.dataset.for !== id) slot.innerHTML = '';
      });
      const slot = document.querySelector('.dv-aarti .yt-slot') || document.querySelector('.aarti .yt-slot');
      if (!slot) return;
      slot.dataset.for = id;
      slot.innerHTML = `<div class="yt-frame">
          <iframe src="https://www.youtube-nocookie.com/embed/${a.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
            title="${esc(a.t)} — ইউটিউব" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <div class="yt-bar"><span>ইউটিউব থেকে বাজছে · ${esc(a.t)}</span>
          <button class="cbtn" data-act="ytClose">বন্ধ করুন</button></div>`;
      toast('ইউটিউবে গাওয়া আরতি চালু হলো');
    }
  function closeYt() {
      document.querySelectorAll('.yt-slot').forEach(slot => { slot.innerHTML = ''; delete slot.dataset.for; });
    }
  function startAarti(id) {
      closeYt();                         /* দুটো একসঙ্গে নয় */
      const a = aartiOf(id);
      if (!a) { toast('এই দেবতার আরতি এখনো যোগ হয়নি'); return; }
      if (!AENG) { toast('এই ব্রাউজারে সুর বাজানো যাচ্ছে না'); return; }
      if (!S.sound) { S.sound = true; save('sound'); }   /* নিজে চাপ দিলে শব্দ চালু */
      AENG.play(id, {
        onLine: i => { syncAartiUI(); aartiFocusLine(i); },
        onTick: () => syncAartiUI(),
        onEnd: () => { syncAartiUI(); bellTone(.7); toast(a.t + ' — আরতি সম্পূর্ণ 🌸'); }
      });
      syncAartiUI();
    }
  function aartiToggle(id) {
      const st = aartiState();
      if (st.playing && st.id === id) { AENG.stop(); syncAartiUI(); toast('আরতি থামানো হলো'); return; }
      startAarti(id);
    }
  function aartiCard(id) {
      const a = aartiOf(id);
      if (!a) return '';
      const st = aartiState();
      const on = st.playing && st.id === id;
      return `<div class="card pad dv-aarti${on ? ' playing' : ''}" data-aarti="${id}">
        <div class="ar-head">
          <span class="ar-ico" aria-hidden="true">${FLAME(18, 26)}</span>
          <span class="ar-htx">
            <b>আরতি · ${esc(a.t)}</b>
            <i>${esc(a.src)} · ${bn(a.lines.length)} পঙক্তি · ${bn(Math.round(a.bpm))} মাত্রা/মিনিট</i>
          </span>
          <span class="ar-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="ar-lines">${a.lines.map((ln, i) =>
          `<p class="ar-line${on && st.line === i ? ' on' : ''}" data-i="${i}">${esc(ln)}</p>`).join('')}</div>
        <div class="ar-bar"><i style="width:${on && st.total ? Math.round(st.elapsed / st.total * 100) : 0}%"></i></div>
        <div class="ar-acts">
          <button class="btn gold sm ar-play" data-act="aartiPlay" data-id="${id}">${on ? '⏸ থামান' : '▶ অ্যাপের সুর'}</button>
          ${a.yt
            ? `<button class="btn maroon sm ar-ytb" data-act="ytPlay" data-id="${id}">▶ ইউটিউবে গান</button>`
            : `<a class="btn maroon sm ar-ytb" href="${aartiYT(a.t)}" target="_blank" rel="noopener">▶ ইউটিউবে খুঁজুন</a>`}
          <button class="cbtn cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা</button>
          <a class="cbtn ar-yt" href="${aartiYT(a.t)}" target="_blank" rel="noopener">অন্য সংস্করণ</a>
        </div>
        <div class="yt-slot"></div>
        <p class="ar-note">${a.yt
          ? 'ইউটিউবে গাওয়া আরতি — চাপ দিলেই এখানেই বাজবে। '
          : 'এই দেবতার যাচাই করা ভিডিও এখনো যোগ করা হয়নি — সার্চ-লিংক কাজ করবে। '}
          “অ্যাপের সুর” নেট ছাড়াও বাজে (তানপুরা · মঞ্জীরা · ঢোল · হারমোনিয়াম)। ${a.own ? 'কথা প্রচলিত আরতি।' : 'কথা এই দেবের নামে রচিত নাম-আরতি।'}</p>
      </div>`;
    }
  function bellTone(vol) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ac = bellTone.ac || (bellTone.ac = new AC());
        if (ac.state === 'suspended') ac.resume();
        const t0 = ac.currentTime;
        [[587.33, .22, 2.4], [880, .13, 1.9], [1318.5, .07, 1.4]].forEach(([f, g0, dur], n) => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = n === 0 ? 'triangle' : 'sine';
          o.frequency.setValueAtTime(f, t0);
          o.frequency.exponentialRampToValueAtTime(f * .996, t0 + dur);
          g.gain.setValueAtTime(.0001, t0);
          g.gain.exponentialRampToValueAtTime(g0 * (vol || 1), t0 + .012);
          g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
          o.connect(g); g.connect(ac.destination);
          o.start(t0); o.stop(t0 + dur + .1);
        });
      } catch (e) {}
    }
  function openAarti(id) {
      const d = DEVA.find(x => x.id === id) || DEVA[0];
      if (!d) return;
      const a = aartiOf(d.id);
      let ov = document.getElementById('aarti');
      if (!ov) {
        ov = document.createElement('div');
        ov.id = 'aarti'; ov.className = 'aarti';
        document.body.appendChild(ov);
      }
      ov.innerHTML = `<div class="aarti-card">
        <div class="aarti-stage" data-artbox>
          <div class="aarti-glow" aria-hidden="true"></div>
          <img class="artimg aarti-deva" src="icons/deva/${d.id}.png" alt="${esc(d.n)}"/>
          <span class="aarti-fb fallback">${esc(d.murti || d.beej)}</span>
          <div class="aarti-lamp" aria-hidden="true">
            <img class="artimg" src="icons/upakaran/diya.png" alt=""/>
            <span class="fallback">${FLAME(22, 32)}</span>
          </div>
        </div>
        <div class="aarti-ttl">${esc(d.n)} — আরতি</div>
        ${a ? `<div class="aarti-lyr" data-aarti="${d.id}">
          <div class="ar-head">
            <span class="ar-htx"><b>${esc(a.t)}</b><i>${esc(a.src)} · ${bn(a.lines.length)} পঙক্তি</i></span>
            <span class="ar-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="ar-lines">${a.lines.map((ln, i) => `<p class="ar-line" data-i="${i}">${esc(ln)}</p>`).join('')}</div>
          <div class="ar-bar"><i style="width:0%"></i></div>
        </div>` : `<div class="aarti-note">এই দেবতার আরতির কথা এখনো যোগ হয়নি</div>`}
        <div class="aarti-note">প্রদীপ ঘুরছে — ঘণ্টা বাজিয়ে সঙ্গে গাইতে পারেন</div>
        ${a ? `<div class="yt-slot"></div>` : ''}
        <div class="aarti-acts">
          ${a ? `<button class="btn gold sm" data-act="aartiPlay" data-id="${d.id}">▶ অ্যাপের সুর</button>` : ''}
          ${a && a.yt ? `<button class="btn maroon sm" data-act="ytPlay" data-id="${d.id}">▶ ইউটিউবে গান</button>` : ''}
          ${a && !a.yt ? `<a class="btn maroon sm" href="${aartiYT(a.t)}" target="_blank" rel="noopener">▶ ইউটিউবে খুঁজুন</a>` : ''}
          <button class="btn ghost sm cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা বাজান</button>
          <button class="btn ghost sm" data-act="aartiClose">থামান</button>
        </div>
      </div>`;
      try { hydrateArt(); } catch (e) {}
      requestAnimationFrame(() => { ov.classList.add('on'); syncAartiUI(); });
      bellTone(.9);
    }
  function closeAarti() {
      if (AENG && aartiState().playing) { AENG.stop(); syncAartiUI(); }
      closeYt();
      const ov = document.getElementById('aarti');
      if (!ov) return;
      ov.classList.remove('on');
      setTimeout(() => { if (ov && ov.parentNode) ov.remove(); }, 240);
    }
  function flyOffering(k) {
      const core = document.querySelector('.ref-altar-drop') || document.querySelector('.tcore');
      if (!core) return;
      const el = document.createElement('span');
      el.className = 'fly-in';
      el.innerHTML = `<img class="artimg" src="icons/upakaran/${k}.png" alt=""/><b>${FLAME(16, 24)}</b>`;
      core.appendChild(el);
      const img = el.querySelector('img');
      if (img) img.onerror = () => img.remove();
      setTimeout(() => { if (el.parentNode) el.remove(); }, 1100);
    }
  function offerStep(id, k) {
      const d = DEVA.find(x => x.id === id);
      if (!d) return false;
      const steps = darpanSteps(d);
      const done = devaDone(id).filter(i => i < steps.length);
      const i = Math.min(done.length, steps.length);
      if (!steps[i]) { toast('পূজা সম্পন্ন ✓ — এখন আরতি করুন'); return false; }
      if (steps[i].k !== k) {
        toast('এই ধাপে দরকার: ' + ((UPK[steps[i].k] || {}).n || ''));
        return false;
      }
      done.push(i);
      S.deva[devaKey(id)] = done; save('deva');
      U.keepTop = location.hash;
      bellTone(.45);
      toast(((UPK[k] || {}).n || '') + ' অর্পিত ✓');
      render();
      flyOffering(k);
      return true;
    }
  const DRAG = { on: false, moved: false, el: null, ghost: null, sx: 0, sy: 0, k: '', id: '', swiped: false };
  function dragTargetAt(x, y) {
      try { if (document.elementFromPoint) { const el = document.elementFromPoint(x, y); if (el) return el.closest('.tcore'); } } catch (e) {}
      const core = document.querySelector('.tcore');
      if (!core) return null;
      const r = core.getBoundingClientRect();
      const pad = 26;
      return (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) ? core : null;
    }
  function dragStart(e) {
      if (e.button !== undefined && e.button > 0) return;   /* ডান-ক্লিক/মাঝ-ক্লিক নয় */
      const card = e.target.closest && e.target.closest('.tside-it');
      if (!card || !card.dataset.k) return;
      DRAG.on = true; DRAG.moved = false; DRAG.swiped = false;
      DRAG.el = card; DRAG.k = card.dataset.k; DRAG.id = card.dataset.id;
      DRAG.sx = e.clientX; DRAG.sy = e.clientY;
    }
  function dragMove(e) {
      if (!DRAG.on) return;
      const dx = e.clientX - DRAG.sx, dy = e.clientY - DRAG.sy;
      if (!DRAG.moved) {
        /* অনুভূমিক ঝোঁকেই টানা শুরু — খাড়া টানে পৃষ্ঠা স্ক্রল হবে */
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
        DRAG.moved = true;
        const r = DRAG.el.getBoundingClientRect();
        const g = document.createElement('div');
        g.className = 'drag-ghost';
        g.innerHTML = `<img src="${artSrc('upakaran', DRAG.k)}" alt=""/><span>${esc((UPK[DRAG.k] || {}).n || '')}</span>`;
        g.style.left = (r.left + r.width / 2) + 'px';
        g.style.top = (r.top + r.height / 2) + 'px';
        document.body.appendChild(g);
        DRAG.ghost = g;
        DRAG.el.classList.add('grabbed');
        document.body.classList.add('dragging');
      }
      if (DRAG.ghost) {
        DRAG.ghost.style.left = e.clientX + 'px';
        DRAG.ghost.style.top = e.clientY + 'px';
        const over = !!dragTargetAt(e.clientX, e.clientY);
        DRAG.ghost.classList.toggle('hot', over);
        const core = document.querySelector('.tcore');
        if (core) core.classList.toggle('drop-hot', over);
      }
      if (e.cancelable) e.preventDefault();
    }
  function dragEnd(e) {
      if (!DRAG.on) return;
      const wasDrag = DRAG.moved;
      const k = DRAG.k, id = DRAG.id;
      const ghost = DRAG.ghost;
      DRAG.on = false; DRAG.moved = false; DRAG.ghost = null; DRAG.swiped = wasDrag;
      document.body.classList.remove('dragging');
      const core = document.querySelector('.tcore');
      if (core) core.classList.remove('drop-hot');
      if (DRAG.el) DRAG.el.classList.remove('grabbed');
      if (ghost) {
        const over = e.type !== 'pointercancel' && !!dragTargetAt(e.clientX, e.clientY);
        ghost.classList.add(over ? 'drop' : 'back');
        setTimeout(() => ghost.remove(), 320);
        if (over) {
          const ok = offerStep(id, k);
          if (!ok) bellTone(.25);
        }
      }
      if (wasDrag) {
        /* ড্র্যাগ শেষে যে click আসবে সেটি আর ধরা হবে না */
        U.swallowClick = true;
        setTimeout(() => { U.swallowClick = false; }, 400);
      }
      DRAG.el = null;
    }
  function initDragEngine() {
      document.addEventListener('pointerdown', dragStart, { passive: true });
      document.addEventListener('pointermove', dragMove, { passive: false });
      document.addEventListener('pointerup', dragEnd);
      document.addEventListener('pointercancel', dragEnd);
      /* ড্র্যাগের পরে ভুল করে আবার অর্পণ যেন না হয় */
      document.addEventListener('click', e => {
        if (!U.swallowClick) return;
        const onCard = e.target && e.target.closest && e.target.closest('.tside-it, .cmd-go');
        if (!onCard) return;                 /* অন্য কোথাও চাপলে বাধা নয় */
        U.swallowClick = false;
        e.stopPropagation();
        e.preventDefault();
      }, true);
    }
  function devaPujaScreen(id) {
      const d = DEVA.find(x => x.id === id) || DEVA[0];
      if (!d) return pujaScreen();
      const steps = darpanSteps(d);
      const done = devaDone(d.id).filter(n => n < steps.length);
      const i = Math.min(done.length, steps.length);
      const cur = steps[i] || null;
      const doneKeys = done.map(n => steps[n] && steps[n].k).filter(Boolean);
      const has = k => doneKeys.includes(k);
      const pct = Math.round(done.length / steps.length * 100);
      const finished = !cur;
      const keys = [...new Set(steps.map(x => x.k))];
      // All controls below are real individual elements, never baked into a screenshot.
      const preferredOrder = ['aasan','jal','ful','diya','dhup','chandan','noi','pancha','ganti','agarbati','bel','durba'];
      const displayKeys = preferredOrder.filter(k => keys.includes(k)).concat(keys.filter(k => !preferredOrder.includes(k)));
      const generatedOfferings = new Set(['aasan','jal','ful','ganti']);
      const offeringLayer = (k,n) => {
        const src = generatedOfferings.has(k) ? `icons/reference/puja-layered/${k}.png` : artSrc('upakaran', k);
        return `<button type="button" class="layer-offering${cur && cur.k === k ? ' current' : ''}${has(k) ? ' offered' : ''}" data-act="devaOffer" data-id="${d.id}" data-k="${k}" aria-label="${esc((UPK[k] || {}).n || k)} অর্পণ"><span class="layer-offering-no">${bn(n+1)}</span><span class="layer-offering-picture"><img src="${src}" alt=""/></span><span class="layer-offering-label">${esc((UPK[k] || {}).n || k)}</span></button>`;
      };
      const soundLayer = (k) => {
        const o = NADS[k] || {n:k}; const on = nadOn(k);
        return `<button type="button" class="nad-chip layer-sound${on ? ' on' : ''}" data-act="nad" data-k="${k}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${esc(o.n)} — ${on ? 'বন্ধ করুন' : 'চালু করুন'}" title="${esc(o.n)}"><span class="layer-sound-art"><img class="layer-pedestal" src="icons/reference/menu/puja-pedestal.png" alt=""/><img class="layer-instrument" src="icons/reference/puja-layered/${k}.png" alt=""/></span><b>${esc(o.n)}</b></button>`;
      };

      const item = (st, n) => {
        const state = n < done.length ? 'done' : (n === i ? 'now' : 'todo');
        const up = UPK[st.k] || {};
        return `<button class="tside-it ${state}" data-act="devaOffer" data-id="${d.id}" data-k="${st.k}" data-n="${n}"
            aria-label="ধাপ ${bn(n + 1)} — ${esc(up.n || st.t)} (মূর্তির দিকে টেনে আনুন)" draggable="false"${state === 'todo' ? ' aria-disabled="true"' : ''}>
          <span class="tside-no">${state === 'done' ? ico('check', 'xs') : bn(n + 1)}</span>
          <span class="tside-ico" data-artbox>
            <img class="artimg tside-img" src="${artSrc('upakaran', st.k)}" alt="${esc(up.n || '')}" loading="lazy" decoding="async" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
            <span class="tside-glyph fallback">${upkGlyph(st.k)}</span>
          </span>
          <span class="tside-tx">
            <span class="tside-nm">${esc(up.n || st.t)}</span>
            <span class="tside-cap">${esc(st.t)}</span>
          </span>
        </button>`;
      };

      const last = steps.length - 1;
      const rest = last;
      const leftN = Math.ceil(rest / 2);
      const leftRows = steps.slice(0, leftN).map((st, n) => item(st, n)).join('');
      const rightRows = steps.slice(leftN, last).map((st, n) => item(st, n + leftN)).join('');
      const wideRow = item(steps[last], last);

      const legend = [
        ['aasan', 'আসন', 'শুদ্ধি ও সংকল্প'],
        ['jal', 'জল', 'পবিত্রতা'],
        ['ful', 'পুষ্প', 'ভক্তি'],
        ['dhup', 'ধূপ', 'গন্ধ-অর্পণ'],
        ['noi', 'নৈবেদ্য', 'সমর্পণ']
      ].map(([k, n, c]) => `<span class="m-leg">
          <span class="m-legic" data-artbox>
            <img class="artimg" src="${artSrc('upakaran', k)}" alt="${esc(n)}" loading="lazy" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
            <span class="fallback">${upkGlyph(k)}</span>
          </span>
          <b>${esc(n)}</b><i>${esc(c)}</i>
        </span>`).join('');

      const order = steps.map((st, n) =>
        `<span class="cmd-dot${n < done.length ? ' done' : ''}${n === i ? ' cur' : ''}" title="${esc((UPK[st.k] || {}).n || st.t)}">${n < done.length ? '✓' : bn(n + 1)}</span>`
      ).join('<span class="cmd-sep">›</span>');

      const cmd = finished ? `
        <div class="cmdbar ref-cmdbar done">
          <div class="cmd-order">${order}</div>
          <div class="cmd-now">
            <div class="li-badge">পূজা সম্পূর্ণ 🌸</div>
            <div class="cmd-m">মন্ত্রহীনং ক্রিয়াহীনং ভক্তিহীনং মহেশ্বর। যৎ পূজিতং ময়া দেব পরিপূর্ণং তদস্তু মে॥</div>
          </div>
          <div class="cmd-acts">
            <button class="btn gold sm cmd-go" data-act="pujaAarti" data-id="${d.id}">আরতি করুন</button>
            <button class="cbtn" data-act="devaReset" data-id="${d.id}">আবার শুরু</button>
            <button class="cbtn" data-act="nav" data-to="#/puja">আরেক দেবতা</button>
          </div>
        </div>` : `
        <div class="cmdbar ref-cmdbar">
          <div class="cmd-order">${order}</div>
          <div class="cmd-now">
            <div class="li-badge">ধাপ ${bn(i + 1)} · ${esc(cur.t)}</div>
            <div class="cmd-m li-mantra">${esc(cur.m)}</div>
          </div>
          <div class="cmd-acts">
            <button class="btn gold sm cmd-go" data-act="devaOffer" data-id="${d.id}" data-k="${cur.k}">
              ${esc((UPK[cur.k] || {}).n || '')} দিন</button>
            <button class="cbtn" data-act="speak" data-mode="mantra" data-text="${esc(cur.m)}">উচ্চারণ</button>
            <button class="cbtn cbtn-ico" data-act="bellRing"><img class="cbtn-art" src="icons/nad/ganti.png${ART_Q}" alt="" aria-hidden="true"/>ঘণ্টা</button>
            <button class="cbtn" data-act="pujaAarti" data-id="${d.id}">আরতি</button>
          </div>
        </div>`;

      return `<header class="ref-puja-header"><button type="button" class="ref-puja-back" data-act="nav" data-to="#/puja" aria-label="পূজার তালিকায় ফিরুন">‹</button><div class="ref-puja-brand"><small>বিদ্যা · বাণী</small><b>সনাতন বিদ্যাপীঠ</b></div></header>
      <div class="pad mandir reference-puja${has('diya') ? ' lamp-on' : ''}${finished ? ' finished' : ''}">
        <section class="ref-puja">
          <div class="ref-shrine" aria-label="${esc(d.n)} পূজার মন্দির">
            <div class="ref-shrine-heading"><h2>॥ ${esc(d.n)} পূজা ॥</h2><span>❧ পূজা দর্পণ ❧</span></div>
            <span class="temple-bell temple-bell-left" aria-hidden="true"><img src="icons/reference/temple-bell-layer.png" alt=""/></span>
            <span class="temple-bell temple-bell-right" aria-hidden="true"><img src="icons/reference/temple-bell-layer.png" alt=""/></span>
            <span class="temple-hanging-lamp temple-lamp-left" aria-hidden="true"><img src="icons/reference/temple-lamp-layer.png" alt=""/><i class="temple-flame"></i></span>
            <span class="temple-hanging-lamp temple-lamp-right" aria-hidden="true"><img src="icons/reference/temple-lamp-layer.png" alt=""/><i class="temple-flame"></i></span>
            <div class="ref-altar-drop" data-artbox>
              <img class="artimg ref-altar-deity" src="${artSrc('deva', d.id)}" alt="${esc(d.n)} দেবতার মূর্তি" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
              <span class="ref-altar-fallback fallback" aria-label="${esc(d.n)}">${esc(d.murti || d.beej)}</span>
            </div>
          </div>
          <div class="layered-puja-lower">
            <div class="layered-offerings${displayKeys.length > 10 ? ' has-extra' : ''}" aria-label="পূজার উপকরণ">${displayKeys.map(offeringLayer).join('')}</div>
            <div class="layered-sounds" aria-label="পূজার নাদ">${NAD_LINKS.map(soundLayer).join('')}</div>
            ${cmd}
          </div>
        </section>
        <div class="m-frame">
          <i class="m-orn tl" aria-hidden="true"></i><i class="m-orn tr" aria-hidden="true"></i>
          <i class="m-orn bl" aria-hidden="true"></i><i class="m-orn br" aria-hidden="true"></i>
          <span class="m-bell lm" data-artbox>
            <img class="artimg" src="${artSrc('upakaran', 'ganti')}" alt="" onload="${ART_LOAD}" onerror="${ART_FAIL}"/><span class="fallback">ঘ</span>
          </span>
          <span class="m-bell rm" data-artbox>
            <img class="artimg" src="${artSrc('upakaran', 'ganti')}" alt="" onload="${ART_LOAD}" onerror="${ART_FAIL}"/><span class="fallback">ঘ</span>
          </span>

          <div class="m-head">
            <div class="m-eyebrow">সনাতন বিদ্যাপীঠ · পূজা দর্পণ</div>
            <h2 class="m-title"><span>॥</span> ${esc(d.n)} পূজা <span>॥</span></h2>
            <div class="m-flourish" aria-hidden="true"><i></i><b>✦</b><i></i></div>
            <p class="m-lead">এক দেবতা · ${bn(steps.length)} ধাপ · ${bn(keys.length)} উপকরণ</p>
            <p class="m-lead2">আচমন থেকে প্রণাম — পুরোহিতের ক্রমে</p>
          </div>

          <div class="tpl">
            <div class="tside left" aria-label="প্রথমার্ধের উপকরণ">${leftRows}${nadRow(NAD_LEFT)}</div>

            <div class="tcore" data-artbox>
              <div class="tc-halo" aria-hidden="true"></div>
              <div class="tc-arch" aria-hidden="true"></div>
              <img class="artimg t-figure" src="${artSrc('deva', d.id)}" alt="${esc(d.n)} দেবতার মূর্তি" onload="${ART_LOAD}" onerror="${ART_FAIL}"/>
              <span class="tc-glyph fallback">${esc(d.murti || d.beej)}</span>
              <div class="tc-pedestal" aria-hidden="true"><i></i></div>
              <div class="tc-lamps" aria-hidden="true">
                <span class="tc-di${has('diya') ? ' on' : ''}">${FLAME(13, 19)}</span>
                <span class="tc-dh${has('dhup') ? ' on' : ''}"><i></i><i></i><i></i></span>
                <span class="tc-pa${has('pancha') ? ' on' : ''}"><b></b><b></b><b></b><b></b><b></b></span>
              </div>
              <div class="tc-bar"><i style="width:${pct}%"></i></div>
              <div class="tc-pct">${finished ? 'সম্পূর্ণ 🌸' : `${bn(pct)}% · ধাপ ${bn(i + 1)}/${bn(steps.length)}`}</div>
            </div>

            <div class="tside right" aria-label="দ্বিতীয়ার্ধের উপকরণ">${rightRows}${nadRow(NAD_RIGHT)}</div>
          </div>

          ${nadFoot()}

          <div class="m-wide">${wideRow}</div>

          <div class="m-legend">
            <div class="m-legttl"><i></i><span>এই উপকরণগুলোর অর্থ কী?</span><i></i></div>
            <div class="m-legrow">${legend}</div>
          </div>

          <div class="m-foot"><span>সনাতন বিদ্যাপীঠ</span><i>যেখানে প্রতিটি আরতির একটি কারণ আছে</i></div>
        </div>

        <p class="m-hint">সোনালি আলোয় চিহ্নিত উপকরণ বা নিচের বোতামে চাপ দিয়ে প্রতিটি ধাপ সম্পন্ন করুন। নাদ-বাটনে চাপ দিয়ে ধ্বনি চালু বা বন্ধ করা যায়।</p>

        ${aartiCard(d.id)}

        <div class="sect"><h4>এই পূজার মন্ত্র</h4><div class="line"></div>
          <span class="mini muted">${bn(d.mantras.length)}টি</span></div>
        <div class="card pad dv-mantras">
          <p class="mini muted" style="line-height:1.7;margin:0 0 8px">${esc(d.dhyan)}</p>
          ${d.mantras.map(([lab, m]) => `
            <div class="dv-mrow">
              <div style="flex:1;min-width:0">
                <div class="dv-mlab">${esc(lab)}</div>
                <div class="dv-mtxt">${esc(m)}</div>
              </div>
              <button class="iconbtn dv-play" data-act="speak" data-text="${esc(m)}" aria-label="শুনুন">${ico('play', 'sm')}</button>
            </div>`).join('')}
          <div class="dv-note">উপকরণ: ${esc(d.items)}</div>
        </div>

        <div class="card pad dv-disc">
          <b>সৎ নোট</b>
          <p class="mini muted">ধাপের ক্রম সাধারণ পূজা-পদ্ধতি অনুসারে; মন্ত্রগুলো প্রচলিত বীজ/নাম মন্ত্র ও সুপরিচিত ধ্যানশ্লোকের সংক্ষিপ্ত রূপ। পূর্ণ বিধি (ন্যাস, কল্প, সংস্কার) অঞ্চল ও সম্প্রদায়ভেদে ভিন্ন — গুরুর কাছে শেখাই শ্রেষ্ঠ। অসুস্থতা, বিগ্রহ-স্থাপনা বা বিশেষ ব্রতে পুরোহিতের পরামর্শ নিন।</p>
          <button class="btn ghost sm" data-act="nav" data-to="#/panjika">আজকের তিথি-নক্ষত্র দেখুন</button>
        </div>
      </div>
      <div style="height:14px"></div>`;
    }
  function pujaGuideScreen(id) {
      const p = DB.pujas.find(x => x.id === id) || DB.pujas[0];
      const k = p.id + ':' + TODAY_KEY;
      const done = S.puja[k] || [];
      return `${appbar(p.title, `${esc(p.time)} · ${bn(p.steps.length)} ধাপ`, '#/puja')}
      <div class="pad">
        <div class="card oath pad stack">
          <div class="diya" style="display:flex;gap:12px;align-items:center">
            ${FLAME(34, 46)}
            <div style="flex:1"><div class="mini muted">আজকের অগ্রগতি</div>
              <div style="font-size:12.5px;font-weight:600;margin-top:4px">${bn(done.length)}/${bn(p.steps.length)} ধাপ সম্পন্ন</div></div>
            <span class="pill ${done.length === p.steps.length ? 'ok' : ''}">${done.length === p.steps.length ? 'সম্পূর্ণ' : bn(Math.round(done.length / p.steps.length * 100)) + '%'}</span>
          </div>
          <div class="bar thin mt"><i style="width:${done.length / p.steps.length * 100}%"></i></div>
        </div>
        <div class="sect"><h4>পূজা ক্রম</h4><div class="line"></div><span class="mini muted">≈ ${bn(p.mins)} মিনিট</span></div>
        ${p.steps.map((s, i) => `
          <div class="card step ${done.includes(i) ? 'done' : ''}" data-act="pujaStep" data-id="${p.id}" data-i="${i}" role="button" tabindex="0">
            <div class="sno">${done.includes(i) ? ico('check', 'xs') : bn(i + 1)}</div>
            <div style="flex:1"><h5>${esc(s.t)}</h5><p>${esc(s.d)}</p>
              ${s.m ? `<div class="mantra">${esc(s.m)}</div>
                <button class="btn ghost sm" style="margin-top:8px" data-act="speak" data-text="${esc(s.m)}">${vico('play', 'xs')} উচ্চারণ শুনুন</button>` : ''}
            </div>
          </div>`).join('')}
        <button class="btn ghost block" data-act="nav" data-to="#/panjika">আজকের শুভ সময় দেখুন</button>
      </div><div style="height:20px"></div>`;
    }
