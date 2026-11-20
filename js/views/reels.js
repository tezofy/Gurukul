/* ==========================================================================
   ৮. রিলস ও ভিডিও ফিড
   ফাইল: js/views/reels.js
   ========================================================================== */
  const bpList = () => {
      const p = (DB.panjika || {});
      return (p.reelsBP || []).concat(p.reelsDev || []);
    };
  const bpChans = () => (DB.panjika && DB.panjika.reelsCh) || [];
  const chOf = r => { const c = bpChans(); return (r && r[2] >= 0 && c[r[2]]) ? c[r[2]] : null; };
  const reelAt = (pool, i) => pool[i < pool.length ? i : (i * 7919) % pool.length];
  let _bpOrder = null, _bpLen = 0;
  function bpOrdered() {
      const all = bpList();
      if (_bpOrder && _bpLen === all.length) return _bpOrder;
      const groups = new Map();
      all.forEach(r => {
        const k = r[2] >= 0 ? r[2] : -1;
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(r);
      });
      let seed = (U.reelSeed || 20261118) % 2147483647;
      if (seed <= 0) seed = 20261118;
      const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      const keys = Array.from(groups.keys());
      for (let i = keys.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
      keys.forEach(k => {
        const a = groups.get(k);
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
      });
      let maxLen = 0; keys.forEach(k => { if (groups.get(k).length > maxLen) maxLen = groups.get(k).length; });
      const out = [];
      for (let round = 0; round < maxLen; round++) keys.forEach(k => { const a = groups.get(k); if (round < a.length) out.push(a[round]); });
      _bpOrder = out; _bpLen = all.length;
      return out;
    }
  const REEL_CATS = ['কথা', 'গান', 'শাস্ত্র', 'ভাগবত'];
  const reelCat = r => (r && r[3]) || 'কথা';
  const BP_YT = id => 'https://www.youtube.com/shorts/' + id;
  const BP_THUMB = id => 'https://i.ytimg.com/vi/' + id + '/oar2.jpg';
  const bpReelCard = r => `<button class="reel" data-act="bpOpen" data-id="${r[0]}" style="--tint:#3a1b1b">
        <img class="rthumb" src="${BP_THUMB(r[0])}" alt="" loading="lazy" referrerpolicy="no-referrer"
          onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${r[0]}/hqdefault.jpg'">
        <span class="rbgtint"></span>
        <span class="rl-ico">${vico('play', 'sm')}</span>
        <span class="rl-txt"><b>${esc(r[1])}</b><i>${esc(reelCat(r))} · ${esc((chOf(r) || ['রিলস'])[0].trim())}</i></span></button>`;
  function reelsScreen() {
      const everything = bpOrdered();
      const chans = bpChans();
      const selCh = (U.reelCh == null) ? -1 : U.reelCh;
      const selCat = U.reelCat || 'all';
      const all = selCat === 'all' ? everything : everything.filter(r => reelCat(r) === selCat);
      const catChips = `<div class="cats" style="padding:0 0 8px">
          <button class="chip ${selCat === 'all' ? 'on' : ''}" data-act="reelCat" data-c="all">সব শ্রেণি · ${bn(everything.length)}</button>
          ${REEL_CATS.map(c => `<button class="chip ${selCat === c ? 'on' : ''}" data-act="reelCat" data-c="${c}">${c} · ${bn(everything.filter(r => reelCat(r) === c).length)}</button>`).join('')}
        </div>`;
      const pool = selCh >= 0 ? all.filter(r => r[2] === selCh) : all;
      const n = U.reelsN || 30;
      const shown = [];
      for (let i = 0; i < Math.min(n, selCh >= 0 ? pool.length : n); i++) shown.push(reelAt(pool, i));
      const topIdx = chans.map((c, i) => i).filter(i => chans[i][2] > 1).slice(0, 16);
      const chips = `<div class="cats" style="padding:0 0 10px">
          <button class="chip ${selCh < 0 ? 'on' : ''}" data-act="reelCh" data-i="-1">সব · ${bn(all.length)}</button>
          ${topIdx.map(i => `<button class="chip ${selCh === i ? 'on' : ''}" data-act="reelCh" data-i="${i}">${esc(chans[i][0].trim())} · ${bn(chans[i][2])}</button>`).join('')}
          <button class="chip" data-act="nav" data-to="#/reelsch">সব চ্যানেল (${bn(chans.length)}) ›</button>
          <button class="chip" data-act="reelsShuffle">🔀 অন্য ক্রমে</button>
        </div>`;
      const headNote = selCh >= 0
        ? `<b>${esc(chans[selCh][0].trim())}</b> চ্যানেলের <b>${bn(pool.length)}টি</b> রিলস${chans[selCh][1] ? ` · <a href="${chans[selCh][1]}" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">চ্যানেল দেখুন</a>` : ''}`
        : `<b>${bn(all.length)}টি রিলস</b>, <b>${bn(chans.length)}টি</b> হিন্দু ধর্মীয় ও ভক্তিমূলক চ্যানেল — <b>কথা</b> (প্রবচন, কথামৃত), <b>গান</b> (কীর্তন, ভজন, আরতি), <b>শাস্ত্র</b> (গীতা-রামায়ণ-পুরাণ পাঠ) ও <b>ভাগবত</b>। নিচে স্ক্রল করলে <b>নতুন রিলস আসতেই থাকবে</b>।`;
      return `${appbar('রিলস', 'Reels · হিন্দু ধর্মীয় ও ভক্তিমূলক', '#/home')}
      <div class="pad" style="padding-top:0">
        <p class="mini muted" style="margin:0 0 10px;line-height:1.75">${headNote}</p>
        ${catChips}
        ${chips}
        <div class="rgrid" id="reelGrid">${shown.map(r => bpReelCard(r)).join('')}</div>
        <div id="reelSentinel" style="height:8px"></div>
        <button class="btn ghost block mt" data-act="reelsMore" id="reelsMoreBtn">আরও ${bn(30)}টি দেখুন</button>
        <div style="height:16px"></div></div>`;
    }
  function chanListScreen() {
      const chans = bpChans();
      const rows = chans.map((c, i) => `<div class="card rowcard stack" style="margin-bottom:7px">
          <div style="flex:1;min-width:0">
            <div class="kv"><span class="ttl" style="font-size:.92rem">${esc(c[0].trim())}</span>
              <span class="pill">${bn(c[2])}টি</span></div>
            <div class="kv" style="margin-top:6px;gap:8px">
              <button class="act" data-act="reelCh" data-i="${i}">রিলস দেখুন</button>
              ${c[1] ? `<a class="act" href="${c[1]}" target="_blank" rel="noopener noreferrer">চ্যানেল ↗</a>` : ''}
            </div></div></div>`).join('');
      return `${appbar('চ্যানেল', 'Channels · '+chans.length, '#/reels')}
      <div class="pad" style="padding-top:0">
        <p class="mini muted" style="margin:0 0 12px;line-height:1.75">যেসব ইউটিউব চ্যানেল থেকে রিলসগুলো নেওয়া হয়েছে — <b>${bn(chans.length)}টি চ্যানেল</b>, সবই হিন্দু ধর্মীয় বা ভক্তিমূলক। রিলসের সংখ্যা অনুযায়ী সাজানো।</p>
        ${rows}
        <div style="height:16px"></div></div>`;
    }
  function attachReelScroll() {
      const sent = document.getElementById('reelSentinel');
      if (!sent || typeof IntersectionObserver === 'undefined') return;
      if (U.reelObs) { try { U.reelObs.disconnect(); } catch (e) {} }
      U.reelObs = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) ACTIONS.reelsMore();
      }, { root: document.getElementById('view'), rootMargin: '600px' });
      U.reelObs.observe(sent);
    }
  const reelSoundOn = () => S.reelMute !== true;
  const posterInner = id => `<img class="rthumb" src="${BP_THUMB(id)}" alt="" loading="lazy" referrerpolicy="no-referrer"
        onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'">
        <span class="rshade"></span>
        <button class="rplay" data-act="reelPlay2" data-id="${id}" aria-label="শব্দ নিয়ে চালান">${vico('play', 'sm')}</button>`;
  function activateFeedSection(sec) {
      if (!sec || sec.dataset.playing === '1') return;
      const id = sec.dataset.id, box = sec.querySelector('.rvp');
      if (!box) return;
      document.querySelectorAll('#rfeed .rsec').forEach(o => {
        if (o !== sec && o.dataset.playing === '1') {
          o.dataset.playing = '0';
          const b = o.querySelector('.rvp');
          if (b) b.innerHTML = posterInner(o.dataset.id);
        }
      });
      const mute = reelSoundOn() ? 0 : 1;
      box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=${mute}&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}"
        title="রিলস" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      sec.dataset.playing = '1';
    }
  function attachFeedPlay() {
      const box = document.getElementById('rfeed');
      if (!box || typeof IntersectionObserver === 'undefined') return;
      if (U.playObs) { try { U.playObs.disconnect(); } catch (e) {} }
      U.playObs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) activateFeedSection(e.target); });
      }, { root: box, rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      box.querySelectorAll('.rsec').forEach(sc => U.playObs.observe(sc));
    }
  const FEED_PAGE = 12;
  function feedItemHTML(r, abs) {
      const ch = chOf(r);
      const saved = !!(S.savedReels && S.savedReels[r[0]]);
      return `<section class="rsec" data-abs="${abs}" data-id="${r[0]}">
        <div class="rvp" data-id="${r[0]}">${posterInner(r[0])}</div>
        <div class="rmeta">
          <div class="rt">${esc(r[1])}</div>
          <div class="rc">${ch ? esc(ch[0].trim()) : 'রিলস'}${ch && ch[1] ? ` · <a href="${ch[1]}" target="_blank" rel="noopener noreferrer" style="color:var(--gold-300)">চ্যানেল ↗</a>` : ''}</div>
          <div class="racts">
            <button class="ract ${saved ? 'on' : ''}" data-act="reelSave" data-id="${r[0]}">${saved ? '✓ সেভ হয়েছে' : '⤓ সেভ করুন'}</button>
            <button class="ract" data-act="reelThumb" data-id="${r[0]}">ছবি ডাউনলোড ⤓</button>
            <button class="ract" data-act="reelCopy" data-id="${r[0]}">লিংক কপি</button>
            <a class="ract" href="${BP_YT(r[0])}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
          </div>
        </div>
      </section>`;
    }
  function reelVideoScreen(id) {
      const pool = bpOrdered();
      const start = Math.max(0, pool.findIndex(x => x[0] === id));
      U.reelAbs = start;
      const rows = [];
      for (let k = 0; k < FEED_PAGE; k++) rows.push(feedItemHTML(reelAt(pool, start + k), start + k));
      const savedN = Object.keys(S.savedReels || {}).length;
      return `${appbar('রিলস', 'সোয়াইপ করে উপর-নিচ', '#/reels')}
      <div class="pad" style="padding-top:0">
        <div class="rhead mini muted"><span>▲ নিচে সোয়াইপ = পরের রিলস · অটো প্লে · ${bn(start + 1)}/${bn(pool.length)}</span>
          <span style="display:flex;gap:6px">
            <button class="ract" data-act="reelSound">${reelSoundOn() ? '🔊 শব্দ চালু' : '🔇 নীরব'}</button>
            <button class="ract" data-act="nav" data-to="#/reelssaved">সেভ (${bn(savedN)})</button>
          </span></div>
        <div class="rfeed" id="rfeed">${rows.join('')}<div id="rfeedEnd" style="height:1px"></div></div>
        <div class="mini muted" style="margin-top:8px;line-height:1.7">▶ <b>অটো প্লে</b> — স্ক্রল করলেই দেখানো রিলস <b>শব্দ নিয়ে</b> নিজে থেকে চলে; নীরব করতে চাইলে উপরে <b>🔊 শব্দ চালু</b> বাটনে চেপে মিউট করুন (পছন্দ মনে রাখা হয়)। ⤓ <b>সেভ করুন</b> — রিলসটি তালিকায় জমা থাকে ও ইন্টারনেট ছাড়াই তালিকা দেখা যায়। <b>ছবি ডাউনলোড</b> — থাম্বনেইল ছবি ফাইল হিসেবে সেভ হয়। ইউটিউব ভিডিও ফাইল সরাসরি ডাউনলোড করতে দেয় না, তাই ভিডিওর জন্য “ইউটিউবে ↗” বাটন।</div>
      </div>`;
    }
  function savedReelsScreen() {
      const all = bpList();
      const saved = S.savedReels || {};
      const ids = Object.keys(saved).sort((a, b) => (saved[b].ts || 0) - (saved[a].ts || 0));
      const rows = ids.map(id => {
        const r = all.find(x => x[0] === id);
        const s0 = saved[id];
        return `<div class="card rowcard stack" style="margin-bottom:8px">
          <img src="${BP_THUMB(id)}" alt="" style="width:52px;height:92px;object-fit:cover;border-radius:10px" loading="lazy" referrerpolicy="no-referrer">
          <div style="flex:1;min-width:0">
            <div class="ttl" style="font-size:.9rem;line-height:1.5">${esc(r ? r[1] : (s0.t || 'রিলস'))}</div>
            <div class="mini muted" style="margin-top:4px">${esc(s0.ch || (r && chOf(r) ? chOf(r)[0] : 'রিলস'))}</div>
            <div class="racts">
              <button class="ract" data-act="nav" data-to="#/reels/${id}">চালান</button>
              <a class="ract" href="${BP_YT(id)}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
              <button class="ract" data-act="reelUnsave" data-id="${id}">মুছুন</button>
            </div></div></div>`;
      }).join('');
      return `${appbar('সেভ করা রিলস', 'Saved · '+ids.length, '#/reels')}
      <div class="pad" style="padding-top:0">
        <p class="mini muted" style="margin:0 0 12px;line-height:1.75">সেভ করা রিলস এখানে জমা থাকে — ইন্টারনেট ছাড়াও তালিকা ও ছবি দেখা যায়। ভিডিও চালাতে ইন্টারনেট লাগবে।</p>
        ${rows || '<div class="card empty"><h5>এখনো কিছু সেভ করা হয়নি</h5><p>রিলস ফিডে “⤓ সেভ করুন” চাপলে এখানে জমা হবে।</p></div>'}
        <div style="height:16px"></div></div>`;
    }
  function attachFeedScroll() {
      const box = document.getElementById('rfeed');
      if (!box || typeof IntersectionObserver === 'undefined') return;
      if (U.feedObs) { try { U.feedObs.disconnect(); } catch (e) {} }
      const pool = bpOrdered();
      U.feedObs = new IntersectionObserver(es => {
        if (!es.some(e => e.isIntersecting)) return;
        const end = document.getElementById('rfeedEnd');
        if (!end) return;
        let html = '';
        for (let k = 0; k < 6; k++) {
          const abs = (U.reelAbs || 0) + 1 + k;
          html += feedItemHTML(reelAt(pool, abs), abs);
        }
        U.reelAbs = (U.reelAbs || 0) + 6;
        end.insertAdjacentHTML('beforebegin', html);
        U.feedObs.disconnect();
        attachFeedScroll();
        attachFeedPlay();
      }, { root: box, rootMargin: '900px' });
      const end = document.getElementById('rfeedEnd');
      if (end) U.feedObs.observe(end);
    }
