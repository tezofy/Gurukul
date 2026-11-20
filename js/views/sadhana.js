/* ==========================================================================
   ১৩. সাধনা — জপ, ধ্যান, যোগা (+ ইঞ্জিন)
   ফাইল: js/views/sadhana.js
   ========================================================================== */
  const JAPA_C = 2 * Math.PI * 104;
  function sadhanaScreen() {
      const t = U.sadhanaTab;
      const tabs = [['japa', 'জপ'], ['dhyana', 'ধ্যান'], ['yoga', 'যোগা']];
      let body = t === 'dhyana' ? dhyanaView() : t === 'yoga' ? yogaView() : japaView();
      return `${appbar('সাধনা', 'Japa · Dhyana · Yoga', '#/home', true)}
      <div class="pad" style="padding-top:0">
        <div class="segment">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="sadhanaTab" data-t="${k}">${l}</button>`).join('')}</div>
        ${t === 'dhyana' ? `<div class="reuse-meditation"><img class="reuse-scene" src="icons/reference/calendar-devotion.png" alt="" aria-hidden="true"/><div class="reuse-meditation-copy"><b>ধ্যান ও মনসংযোগ</b><span>শান্ত মনে শ্বাসে মন ফেরান</span></div><img class="reuse-sage" src="icons/reference/cal-sage.png" alt="" aria-hidden="true"/></div>` : ''}
        <div class="mt">${body}</div>
      </div><div style="height:22px"></div>`;
    }
  function japaView() {
      const j = S.japa;
      const m = DB.japas.find(x => x.id === j.mantra) || DB.japas[0];
      const pct = j.count / 108;
      const off = (JAPA_C * (1 - pct)).toFixed(1);
      return `<div class="card oath pad">
        <div class="kv"><div><div class="mini muted">জপ চলছে</div>
          <div class="display" style="font-size:14px;margin-top:3px">${esc(m.title)}</div></div>
          <span class="pill">${bn(j.rounds)} মালা</span></div>

        <div class="japa-wrap">
          <button class="japa-btn" data-act="japaTap" aria-label="জপ গণনা">
            <svg class="japa-ring" viewBox="0 0 226 226" aria-hidden="true">
              <defs><linearGradient id="jg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f8e3b3"/><stop offset="1" stop-color="#b1842e"/></linearGradient></defs>
              <circle class="bg" cx="113" cy="113" r="104"/>
              <circle class="fg" id="japaFg" cx="113" cy="113" r="104" stroke-dasharray="${JAPA_C.toFixed(1)}" stroke-dashoffset="${off}"/>
            </svg>
            <span class="japa-core">
              <span class="c" id="japaCount">${bn(j.count)}</span>
              <span class="of">/ ১০৮</span>
              <span class="hint">ট্যাপ করুন</span>
            </span>
          </button>
        </div>

        <div class="mala-dots" id="malaDots">${Array.from({ length: 18 }, (_, i) =>
          `<i class="${j.count >= (i + 1) * 6 ? 'on' : ''}"></i>`).join('')}</div>

        <div class="kv" style="margin-top:14px">
          <span class="mini muted">মোট জপ</span>
          <b style="font-size:12.5px">${bn(j.rounds * 108 + j.count)}</b></div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn ghost sm" style="flex:1" data-act="japaReset">রিসেট</button>
          <button class="btn gold sm" style="flex:1.4" data-act="japaFinish">মালা সম্পূর্ণ</button>
        </div>
      </div>

      <div class="sect"><h4>মন্ত্র বেছে নিন</h4><div class="line"></div></div>
      ${DB.japas.map(x => `<div class="card rowcard stack" data-act="japaMantra" data-id="${x.id}" role="button" tabindex="0" style="cursor:pointer">
        <div class="datebox" style="width:42px;height:44px"><b>ॐ</b></div>
        <div style="flex:1"><div class="kv"><span class="ttl">${esc(x.title)}</span>
          ${x.id === S.japa.mantra ? '<span class="pill ok">চলছে</span>' : ''}</div>
          <div class="mini muted" style="margin-top:4px">${esc(x.note)} · ${bn(108)} জপ = ১ মালা</div></div>
      </div>`).join('')}`;
    }
  function dhyanaView() {
      const md = U.med;
      const sel = DB.meditations.find(x => x.mins === md.mins) || DB.meditations[1];
      const mm = String(Math.floor(md.left / 60)).padStart(2, '0'), ss = String(md.left % 60).padStart(2, '0');
      const total = md.mins * 60;
      const pct = (1 - md.left / total) * 100;
      return `<div class="card oath pad">
        <div class="kv"><div><div class="mini muted">ধ্যান সেশন</div>
          <div class="display" style="font-size:14px;margin-top:3px">${esc(sel.title)}</div></div>
          <span class="pill ${md.running ? 'ok' : ''}">${md.running ? 'চলছে' : 'প্রস্তুত'}</span></div>

        <div class="breath-stage">
          <div class="breath ${md.running ? 'in' : ''}" id="breathCircle">
            <div>
              <div class="ph" id="breathPhase">${md.running ? 'শ্বাস নিন' : 'প্রস্তুত'}</div>
              <div class="tm" id="medTime">${bn(mm)}:${bn(ss)}</div>
            </div>
          </div>
        </div>
        <div class="bar"><i id="medBar" style="width:${pct}%"></i></div>
        <div class="kv" style="margin-top:9px"><span class="mini muted">শ্বাস: ৪-৪-৮ ছন্দ</span>
          <span class="mini muted">${esc(sel.note)}</span></div>

        <div style="display:flex;gap:8px;margin-top:13px">
          <button class="btn ghost sm" style="flex:1" data-act="medReset">রিসেট</button>
          <button class="btn gold sm" style="flex:1.6" data-act="medToggle">${md.running ? 'বিরতি দিন' : 'ধ্যান শুরু করুন'}</button>
        </div>
      </div>

      <div class="sect"><h4>সময় বেছে নিন</h4><div class="line"></div></div>
      <div class="preset">
        ${DB.meditations.map(x => `<button class="${md.mins === x.mins ? 'on' : ''}" data-act="medPreset" data-m="${x.mins}">${bn(x.mins)} মিনিট</button>`).join('')}
      </div>

      ${S.sessions.length ? `<div class="sect"><h4>আগের সেশন</h4><div class="line"></div></div>
        <div class="card pad">${S.sessions.slice(-4).reverse().map(x => `
          <div class="ledger"><span>${esc(x.title)}</span><span>${bn(x.mins)} মিনিট · ${esc(x.when)}</span></div>`).join('')}</div>` : ''}
      <p class="mini muted" style="text-align:center;margin-top:14px;line-height:1.7">চোখ বন্ধ করে বসুন, মেরুদণ্ড সোজা রাখুন।<br/>শ্বাসে মন ফেরান — বিচার করবেন না, শুধু লক্ষ্য করুন।</p>`;
    }
  function yogaView() {
      const doneCount = Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length;
      return `<div class="card oath rowcard stack" data-act="nav" data-to="#/sadhana/seq" role="button" tabindex="0" style="cursor:pointer">
        <div class="datebox" style="width:44px;height:48px"><b>১২</b><i>ধাপ</i></div>
        <div style="flex:1"><div class="kv"><span class="ttl" style="font-family:var(--f-dis)">সূর্য নমস্কার</span><span class="pill">গাইডেড</span></div>
          <div class="mini muted" style="margin-top:4px">১২ ধাপ · ≈ ৫ মিনিট · সকালে খালি পেটে</div></div>
        ${ico('arrow', 'sm')}</div>

      <div class="sect"><h4>যোগাসন</h4><div class="line"></div><span class="mini muted">${bn(doneCount)}/${bn(DB.asanas.length)} আজ</span></div>
      ${DB.asanas.map(a => `<div class="card pad asana stack">
        <div class="kv"><h5>${esc(a.name)}</h5>
          <span class="pill ${S.asanaDone[a.id] ? 'ok' : 'flat'}">${S.asanaDone[a.id] ? 'সম্পন্ন' : a.level}</span></div>
        <div class="mini muted" style="margin-top:3px">${bn(a.time)} সেকেন্ড · ${esc(a.benefit)}</div>
        <ol class="st">${a.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn ghost sm" style="flex:1" data-act="asanaToggle" data-id="${a.id}">${S.asanaDone[a.id] ? 'আবার শুরু' : 'সম্পন্ন করুন'}</button>
        </div>
      </div>`).join('')}
      <p class="mini muted" style="text-align:center;margin-top:12px;line-height:1.7">শরীরে ব্যথা বা উচ্চ রক্তচাপ থাকলে চিকিৎসকের পরামর্শ নিন।<br/>প্রতিটি আসনে শ্বাস স্বাভাবিক রাখুন — জোর করবেন না।</p>`;
    }
  function seqScreen() {
      const st = DB.suryaNamaskar, cur = U.seq.i;
      return `${appbar('সূর্য নমস্কার', '১২ ধাপ · গাইডেড', '#/sadhana/yoga')}
      <div class="pad">
        <div class="seq-head">
          <div style="text-align:center">
            <div class="n">${esc(st[cur].n)}</div>
            <div class="d">${esc(st[cur].d)}</div>
            <div class="pill" style="margin-top:10px" id="seqTimer">${bn(st[cur].s)} সে.</div>
          </div>
        </div>
        <div class="bar" style="margin:12px 0"><i id="seqBar" style="width:${(cur / st.length) * 100}%"></i></div>
        <div class="kv"><span class="mini muted">ধাপ ${bn(cur + 1)} / ${bn(st.length)}</span>
          <span class="mini muted">${U.seq.running ? 'চলছে' : 'বিরতিতে'}</span></div>

        <div style="display:flex;gap:8px;margin:12px 0">
          <button class="btn ghost sm" style="flex:1" data-act="seqPrev" ${cur === 0 ? 'disabled' : ''}>আগের</button>
          <button class="btn gold sm" style="flex:1.5" data-act="seqToggle">${U.seq.running ? 'বিরতি' : 'শুরু করুন'}</button>
          <button class="btn ghost sm" style="flex:1" data-act="seqNext">পরের</button>
        </div>

        <div id="seqList">${st.map((x, i) => `
          <div class="card rowcard stack" data-seq-step="${i}" style="${i === cur ? 'border-color:var(--card-border-strong)' : 'opacity:' + (i < cur ? '.62' : '1') + ';background:transparent'}">
            <div class="datebox" style="width:38px;height:40px"><b>${bn(i + 1)}</b></div>
            <div style="flex:1"><div class="kv"><span class="ttl">${esc(x.n)}</span><span class="mini muted">${bn(x.s)} সে.</span></div>
              <div class="mini muted" style="margin-top:3px">${esc(x.d)}</div></div>
            ${i < cur ? `<span class="pill ok">✓</span>` : i === cur ? '<span class="pill">এখন</span>' : ''}
          </div>`).join('')}</div>
      </div><div style="height:20px"></div>`;
    }
  function japaUpdate() {
      const j = S.japa;
      const c = document.getElementById('japaCount'), fg = document.getElementById('japaFg'), dots = document.getElementById('malaDots');
      if (c) c.textContent = bn(j.count);
      if (fg) fg.setAttribute('stroke-dashoffset', (JAPA_C * (1 - j.count / 108)).toFixed(1));
      if (dots) [...dots.children].forEach((d, i) => d.classList.toggle('on', j.count >= (i + 1) * 6));
    }
  function japaTap() {
      const j = S.japa;
      j.count++;
      if (j.count >= 108) {
        j.count = 0; j.rounds++;
        chime('complete'); bumpActivity(6);
        setTimeout(() => burst(window.innerWidth / 2, 260, 22), 60);
        toast(`এক মালা সম্পূর্ণ 🌸 · মোট ${bn(j.rounds)} মালা`);
      } else {
        if (j.count % 9 === 0) chime('soft');
        if (navigator.vibrate) navigator.vibrate(8);
      }
      save('japa'); japaUpdate();
    }
  function medTick() {
      const md = U.med;
      md.left--;
      if (md.left <= 0) { medComplete(); return; }
      const mm = String(Math.floor(md.left / 60)).padStart(2, '0'), ss = String(md.left % 60).padStart(2, '0');
      const tEl = document.getElementById('medTime'); if (tEl) tEl.textContent = `${bn(mm)}:${bn(ss)}`;
      const bar = document.getElementById('medBar'); if (bar) bar.style.width = (1 - md.left / (md.mins * 60)) * 100 + '%';
      const el = (md.mins * 60 - md.left) % 16;
      const phase = el < 4 ? 'শ্বাস নিন' : el < 8 ? 'ধরে রাখুন' : 'শ্বাস ছাড়ুন';
      if (phase !== md.phase) {
        md.phase = phase;
        const pEl = document.getElementById('breathPhase'); if (pEl) pEl.textContent = phase;
        const circ = document.getElementById('breathCircle');
        if (circ) { circ.classList.toggle('in', phase === 'শ্বাস নিন'); circ.classList.toggle('out', phase === 'শ্বাস ছাড়ুন'); }
      }
    }
  function medStart() {
      clearInterval(U.medTimer);
      U.med.running = true;
      U.medTimer = setInterval(medTick, 1000);
    }
  function medComplete() {
      clearInterval(U.medTimer); U.medTimer = null;
      U.med.running = false;
      const mins = U.med.mins;
      S.sessions.push({ title: (DB.meditations.find(x => x.mins === mins) || {}).title || 'ধ্যান', mins, date: TODAY_KEY, when: `${bn(new Date().getDate())} ${BN_MONTH[new Date().getMonth()].slice(0, 4)}` });
      S.sessions = S.sessions.slice(-20); save('sessions');
      bumpActivity(mins);
      U.med.left = mins * 60;
      chime('complete');
      setTimeout(() => burst(window.innerWidth / 2, 300, 26), 80);
      toast(`ধ্যান সম্পূর্ণ 🌸 · ${bn(mins)} মিনিট`);
      render();
    }
  function seqTick() {
      const st = DB.suryaNamaskar;
      U.seq.left--;
      if (U.seq.left <= 0) {
        if (U.seq.i >= st.length - 1) {
          clearInterval(U.seqTimer); U.seqTimer = null; U.seq.running = false;
          bumpActivity(5); chime('complete');
          setTimeout(() => burst(window.innerWidth / 2, 250, 24), 80);
          toast('সূর্য নমস্কার সম্পূর্ণ 🌸 · ৫ মিনিট');
          render(); return;
        }
        U.seq.i++; U.seq.left = st[U.seq.i].s; render(); return;
      }
      const tEl = document.getElementById('seqTimer'); if (tEl) tEl.textContent = `${bn(U.seq.left)} সে.`;
    }
  function seqStart() {
      clearInterval(U.seqTimer);
      U.seq.running = true;
      U.seqTimer = setInterval(seqTick, 1000);
    }
