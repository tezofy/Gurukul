/* ==========================================================================
   ২. লাইব্রেরি · বইয়ের তালিকা ও অডিও প্লেয়ার
   ফাইল: js/views/library.js
   ========================================================================== */
  function bookCards() {
      const q = U.libQ.trim().toLowerCase();
      const list = DB.books.filter(b => {
        const okCat = U.libCat === 'সব' || b.tag === U.libCat;
        const okQ = !q || (b.title + b.author + b.desc).toLowerCase().includes(q);
        return okCat && okQ;
      });
      if (!list.length) return `<div class="card empty"><div class="illu">${ico('book')}</div><h5>কিছু পাওয়া যায়নি</h5><p>অন্য শব্দ বা বিভাগ দিয়ে খুঁজুন।</p></div>`;
      return list.map(b => {
        const lv = S.lastVerse.book === b.id ? S.lastVerse.idx : 0;
        const pct = Math.round((lv + 1) / b.texts.length * 100);
        return `<div class="card book lib-book" data-act="nav" data-to="${b.chapterMeta ? '#/gita' : '#/book/' + b.id}" role="button" tabindex="0" aria-label="${esc(b.title)} পড়ুন">
          <div class="cover ${b.cls} lib-cover"><span class="sym">${b.sym}</span><i aria-hidden="true">✦</i></div>
          <div class="lib-book-body">
            <div class="kv lib-book-title"><span class="ttl">${esc(b.title)}</span><span class="pill ${b.tag === 'নতুন' ? 'ok' : 'flat'}">${b.tag}</span></div>
            <div class="mini muted lib-author">${esc(b.author || 'শাস্ত্র পাঠ')}</div>
            <div class="mini muted lib-book-facts">${bn(b.chapters)} অধ্যায় <span>·</span> ${bn(b.verses)} শ্লোক${b.audio ? ' <span>·</span> অডিও' : ''}</div>
            <div class="bar thin lib-progress"><i style="width:${pct}%"></i></div>
            <div class="kv lib-book-foot"><span class="mini muted">${bn(pct)}% পড়া হয়েছে</span><span class="mini muted">${bn(b.texts.length)} নমুনা শ্লোক</span></div>
          </div><span class="lib-book-arrow" aria-hidden="true">›</span></div>`;
      }).join('');
    }
  const AP = { player: null, api: false, ready: false, pending: null, timer: null, id: null, dur: 0, rate: 1 };
  const bhaktiAudio = () => DB.bhaktiAudio || [];
  const apItem = id => (DB.gitaAudio || []).find(x => x.id === id) || bhaktiAudio().find(x => x.id === id) || null;
  const isBhaktiIt = it => !!it && typeof it.ch !== 'number';
  const apListOf = it => isBhaktiIt(it) ? bhaktiAudio() : (DB.gitaAudio || []);
  const apHeadOf = it => isBhaktiIt(it)
      ? ((it.cat || 'কথা') + ' · ' + (it.ch || 'রিলস'))
      : ((it.ch === 0 ? 'উপসংহার' : (typeof BN_CH !== 'undefined' ? BN_CH[it.ch] : '') + ' অধ্যায়') + ' · যথার্থ গীতা');
  function apLoadApi() {
      /* হ্যান্ডলার সবসময় বসিয়ে রাখি — স্ক্রিপ্ট আগে থেকেই থাকলেও API প্রস্তুত হলে ডাক পাব */
      window.onYouTubeIframeAPIReady = () => {
        AP.api = true;
        if (AP.pending) { const p = AP.pending; AP.pending = null; apStart(p); }
      };
      if (AP.api) return;
      if (document.getElementById('ytApiScript')) return;
      const sc = document.createElement('script');
      sc.id = 'ytApiScript'; sc.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(sc);
    }
  function apStart(id) {
      const item = apItem(id);
      AP.id = id; AP.dur = 0;
      /* স্ক্রিনের কার্ড/তালিকা যেন সবসময় চলতি অডিওটাই দেখায় */
      U.audioId = id;
      if (item) U.audioSrc = isBhaktiIt(item) ? 'bhakti' : 'gita';
      apLoadApi();
      if (!AP.api) {
        AP.pending = id;
        apRender();
        toast('অডিও প্লেয়ার তৈরি হচ্ছে…');
        setTimeout(() => {
          if (!AP.api && AP.id === id) toast('প্লেয়ার লোড হয়নি — ইন্টারনেট দেখুন বা “ইউটিউবে ↗” চাপুন');
        }, 6000);
        return;
      }
      if (AP.player && AP.player.loadVideoById) { AP.player.loadVideoById(id); apRender(); apTick(); return; }
      let host = document.getElementById('ytHost');
      if (!host) {
        host = document.createElement('div');
        host.id = 'ytHost';
        host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
        document.body.appendChild(host);
      }
      host.innerHTML = '<div id="ytFrame"></div>';
      try {
        AP.player = new window.YT.Player('ytFrame', {
          videoId: id,
          playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1 },
          events: {
            onReady: () => {
              AP.ready = true;
              try {
                AP.player.setVolume(S.audioVol == null ? 80 : S.audioVol);
                if (AP.player.unMute) AP.player.unMute();
                if (AP.player.setPlaybackRate && (AP.rate || 1) !== 1) AP.player.setPlaybackRate(AP.rate);
              } catch (e) {}
              if (item) toast('অডিও চালু: ' + item.name);
              apRender(); apTick();
            },
            onStateChange: () => apRender(),
            onError: () => toast('এই অডিওটি চালানো যাচ্ছে না — ইন্টারনেট দেখুন')
          }
        });
      } catch (e) { toast('প্লেয়ার তৈরি করা গেল না'); }
      apRender(); apTick();
    }
  function apFillPct(el, pct) {
      if (el && el.style) el.style.setProperty('--p', Math.max(0, Math.min(100, +pct || 0)) + '%');
    }
  const AP_RATES = [1, 1.25, 1.5, 0.75];
  const AP_RATE_TXT = { '1': '১×', '1.25': '১.২৫×', '1.5': '১.৫×', '0.75': '০.৭৫×' };
  const apRateTxt = () => AP_RATE_TXT[String(AP.rate || 1)] || '১×';
  function apSpeed() {
      const i = AP_RATES.indexOf(AP.rate || 1);
      AP.rate = AP_RATES[(i + 1) % AP_RATES.length];
      if (AP.player && AP.player.setPlaybackRate) { try { AP.player.setPlaybackRate(AP.rate); } catch (e) {} }
      toast('গতি: ' + apRateTxt());
      apRender();
    }
  const apTime = t => {
      t = Math.max(0, Math.floor(t || 0));
      const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
      const p2 = n => (n < 10 ? '0' : '') + n;
      return h ? bn(h) + ':' + bn(p2(m)) + ':' + bn(p2(sec)) : bn(m) + ':' + bn(p2(sec));
    };
  function apState() {
      try { return AP.player && AP.player.getPlayerState ? AP.player.getPlayerState() : -1; } catch (e) { return -1; }
    }
  const apPlaying = () => apState() === 1;
  function apToggle() {
      if (!AP.player) return;
      if (apPlaying()) AP.player.pauseVideo(); else AP.player.playVideo();
      setTimeout(apRender, 150);
    }
  function apSeek(frac) {
      if (!AP.player || !AP.player.getDuration) return;
      const d = AP.player.getDuration() || 0;
      AP.player.seekTo(Math.max(0, Math.min(0.999, frac)) * d, true);
    }
  function apJump(sec) {
      if (!AP.player || !AP.player.getCurrentTime) return;
      AP.player.seekTo((AP.player.getCurrentTime() || 0) + sec, true);
    }
  function apStep(dir) {
      const it0 = apItem(AP.id);
      const list = apListOf(it0);
      if (!list.length) return;
      let i = list.findIndex(x => x.id === AP.id);
      if (i < 0) i = 0;
      i = (i + dir + list.length) % list.length;
      const nxt = list[i];
      U.audioId = nxt.id;
      U.audioSrc = isBhaktiIt(nxt) ? 'bhakti' : 'gita';
      apStart(nxt.id);
      /* মুখ্যস্থান: কার্ডের নাম, থাম্বনেইল, অধ্যায়-শ্রেণি নতুন অডিও অনুযায়ী আঁকা হয়
         (অন্য পর্দায় থাকলে সেটি আবার না আঁকিয়ে শুধু মিনি-বার হালনাগাদ থাকে) */
      if ((location.hash || '').indexOf('#/library') === 0) render();
      toast((dir > 0 ? 'পরের: ' : 'আগের: ') + nxt.name);
    }
  function apSetVol(v) {
      if (AP.player && AP.player.setVolume) AP.player.setVolume(v);
      if (v > 0 && AP.player && AP.player.unMute) AP.player.unMute();
      S.audioVol = v; save('audioVol');
    }
  function apBarHTML() {
      const item = apItem(AP.id);
      if (!item) return '';
      const btn = 'width:34px;height:34px;border-radius:50%;border:1px solid rgba(215,169,79,.32);background:rgba(215,169,79,.12);color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 auto;font-size:13px;padding:0;font-family:inherit';
      return `<div class="apseek" style="position:absolute;left:0;right:0;top:0;height:3px;background:rgba(215,169,79,.18);border-radius:3px 3px 0 0;overflow:hidden"><i id="apFill" style="display:block;height:100%;width:0%;background:#d7a94f"></i></div>
        <img src="https://i.ytimg.com/vi/${item.id}/mqdefault.jpg" alt="" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex:0 0 auto;box-shadow:0 0 0 1px rgba(215,169,79,.35)">
        <div style="flex:1 1 auto;min-width:0">
          <div class="apt" style="font-size:11.6px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(isBhaktiIt(item) ? (item.cat ? item.cat + ' · ' : '') + item.name : (item.ch === 0 ? 'উপসংহার · ' : BN_CH[item.ch] + ' অধ্যায় · ') + item.name)}</div>
          <div class="aps" style="font-size:9.6px;opacity:.72;margin-top:2px;font-variant-numeric:tabular-nums"><span id="apCur">০:০০</span> / <span id="apDur">${item.dur ? bn(item.dur) : '—'}</span></div></div>
        <button style="${btn}" data-act="apPrev" aria-label="আগের">◀</button>
        <button style="${btn};background:#d7a94f;color:#2a0b0d;border-color:transparent;box-shadow:0 8px 18px -10px rgba(215,169,79,.95)" data-act="apToggle" id="apBtn" aria-label="চালান/থামান">${apPlaying() ? '❚❚' : '▶'}</button>
        <button style="${btn}" data-act="apNext" aria-label="পরের">▶</button>
        <button style="${btn}" data-act="apStop" aria-label="বন্ধ">✕</button>`;
    }
  function apRender() {
      let bar = document.getElementById('apbar');
      const item = apItem(AP.id);
      if (!item) { if (bar) { bar.style.display = 'none'; bar.innerHTML = ''; } document.body.classList.remove('has-audio'); return; }
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'apbar'; bar.className = 'apbar';
        /* inline styles: CSS পুরোনো ক্যাশে থাকলেও লেআউট ভাঙবে না */
        bar.style.cssText = 'position:fixed;left:0;right:0;bottom:calc(78px + env(safe-area-inset-bottom));z-index:60;'
          + 'margin:0 10px;display:none;align-items:center;gap:10px;padding:11px 11px 10px;border-radius:17px;'
          + 'background:var(--surface-1,#1b1410);border:1px solid var(--card-border,rgba(215,169,79,.35));'
          + 'box-shadow:0 16px 34px -18px rgba(0,0,0,.8);color:inherit;backdrop-filter:blur(10px)';
        document.body.appendChild(bar);
      }
      bar.innerHTML = apBarHTML();
      bar.style.display = 'flex';
      bar.classList.add('on');
      document.body.classList.add('has-audio');
      const b = document.getElementById('apBtn');
      if (b) b.textContent = apPlaying() ? '❚❚' : '▶';
      const big = document.getElementById('apBigBtn');
      if (big) big.textContent = apPlaying() ? '❚❚' : '▶';
      const card = document.getElementById('apCard'); if (card) card.classList.toggle('playing', apPlaying());
      const live = document.querySelector('#apCard .apl-live'); if (live) live.style.display = apPlaying() ? 'inline' : 'none';
      const sp = document.getElementById('apSpeedBtn'); if (sp) sp.textContent = apRateTxt();
      const vol = document.getElementById('apVol'); if (vol) apFillPct(vol, S.audioVol == null ? 80 : S.audioVol);
      const durB = document.getElementById('apDurBig');
      const it = apItem(AP.id); if (durB && it && it.dur) durB.textContent = bn(it.dur);
    }
  function apTick() {
      clearInterval(AP.timer);
      const paint = () => {
        const cur = AP.player && AP.player.getCurrentTime ? (AP.player.getCurrentTime() || 0) : 0;
        const dur = AP.player && AP.player.getDuration ? (AP.player.getDuration() || 0) : 0;
        const cc = document.getElementById('apCur'); if (cc) cc.textContent = apTime(cur);
        const dd = document.getElementById('apDur'); if (dd && dur) dd.textContent = apTime(dur);
        const fill = document.getElementById('apFill'); if (fill && dur) fill.style.width = Math.min(100, cur / dur * 100) + '%';
        const seek = document.getElementById('apSeekBig');
        if (seek && dur) {
          seek.max = String(Math.floor(dur)); seek.value = String(Math.floor(cur));
          if (!seek.dataset.drag) apFillPct(seek, cur / dur * 100);
        }
        const tcur = document.getElementById('apTimeBig'); if (tcur) tcur.textContent = apTime(cur);
        const tdur = document.getElementById('apDurBig'); if (tdur && dur) tdur.textContent = apTime(dur);
        const b = document.getElementById('apBtn'); if (b) b.textContent = apPlaying() ? '❚❚' : '▶';
        const big = document.getElementById('apBigBtn'); if (big) big.textContent = apPlaying() ? '❚❚' : '▶';
        const card = document.getElementById('apCard'); if (card) card.classList.toggle('playing', apPlaying());
      };
      paint();
      AP.timer = setInterval(paint, 800);
    }
  function apHalt() {
      try { AP.player && AP.player.stopVideo && AP.player.stopVideo(); } catch (e) {}
      AP.id = null; AP.dur = 0; AP.pending = null;
      clearInterval(AP.timer); AP.timer = null;
    }
  function apStop() {
      try { AP.player && AP.player.stopVideo && AP.player.stopVideo(); } catch (e) {}
      AP.id = null; clearInterval(AP.timer); AP.timer = null;
      const bar = document.getElementById('apbar'); if (bar) { bar.classList.remove('on'); bar.style.display = 'none'; bar.innerHTML = ''; }
      document.body.classList.remove('has-audio');
      render();
    }
  const BN_CH = ['', 'প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম', 'ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম',
      'একাদশ', 'দ্বাদশ', 'ত্রয়োদশ', 'চতুর্দশ', 'পঞ্চদশ', 'ষোড়শ', 'সপ্তদশ', 'অষ্টাদশ'];
  const audioChLabel = x => x.ch === 0 ? 'উপসংহার' : BN_CH[x.ch] + ' অধ্যায়';
  const AUDIO_CATS = [['all', 'সব'], ['কথা', 'কথা'], ['গান', 'কীর্তন · গান'], ['শাস্ত্র', 'শাস্ত্র পাঠ'], ['ভাগবত', 'ভাগবত']];
  function gitaAudioScreen() {
      const src = U.audioSrc || 'gita';
      const list = src === 'bhakti' ? bhaktiAudio() : (DB.gitaAudio || []);
      const cat = U.audioCat || 'all';
      const inCat = x => cat === 'all' ? true
        : src === 'bhakti' ? x.cat === cat
          : cat === 'c' ? x.ch === 0
            : cat === '1' ? (x.ch >= 1 && x.ch <= 6)
              : cat === '2' ? (x.ch >= 7 && x.ch <= 12) : (x.ch >= 13 && x.ch <= 18);
      const cur = U.audioId ? apItem(U.audioId) : null;
      const playing = cur && AP.id === cur.id;
      const srcChips = `<div class="cats" style="padding:0 0 10px">
          <button class="chip ${src !== 'bhakti' ? 'on' : ''}" data-act="audioSrc" data-s="gita">গীতা · ${bn((DB.gitaAudio || []).length)}</button>
          <button class="chip ${src === 'bhakti' ? 'on' : ''}" data-act="audioSrc" data-s="bhakti">কথা · কীর্তন · ভাগবত · ${bn(bhaktiAudio().length)}</button>
        </div>`;
      const sub = cur ? (isBhaktiIt(cur)
        ? `<span>${esc(cur.ch || 'চ্যানেল')}</span><span>·</span><span>${esc(cur.cat || 'কথা')}</span>`
        : `<span>${audioChLabel(cur)}</span><span>·</span><span>⏱ ${bn(cur.dur)}</span>`) : '';
      const player = cur ? `<div class="apl" id="apCard">
          <div class="apl-glow" style="background-image:url('https://i.ytimg.com/vi/${cur.id}/mqdefault.jpg')"></div>
          <div class="apl-top">
            <div class="apl-art">
              <img src="https://i.ytimg.com/vi/${cur.id}/mqdefault.jpg" alt="">
              <span class="apl-eq"><i></i><i></i><i></i><i></i><i></i></span>
            </div>
            <div class="apl-meta">
              <div class="apl-kicker">${isBhaktiIt(cur) ? 'কথা · কীর্তন · শাস্ত্র' : 'অডিও পাঠ · যথার্থ গীতা'}</div>
              <div class="apl-title">${esc(cur.name)}</div>
              <div class="apl-sub">${sub}
                <span class="apl-dot"></span><span class="apl-live" style="display:none">চলছে</span></div>
            </div>
            <button class="apl-play" id="apBigBtn" data-act="apToggle" aria-label="চালান/থামান">${playing && apPlaying() ? '❚❚' : '▶'}</button>
          </div>
          <div class="apl-seek">
            <input class="aplrange" id="apSeekBig" type="range" min="0" max="100" value="0" step="1" aria-label="সময়">
            <div class="apl-time"><span id="apTimeBig">০:০০</span><span id="apDurBig">${cur.dur ? bn(cur.dur) : '—'}</span></div>
          </div>
          <div class="apl-ctl">
            <button class="apl-btn" data-act="apJump" data-s="-15" aria-label="১৫ সেকেন্ড পিছনে">↺<b>১৫</b></button>
            <button class="apl-btn" data-act="apPrev" aria-label="আগের">◀◀</button>
            <button class="apl-btn" data-act="apNext" aria-label="পরের">▶▶</button>
            <button class="apl-btn" data-act="apJump" data-s="15" aria-label="১৫ সেকেন্ড সামনে"><b>১৫</b>↻</button>
            <button class="apl-btn speed" id="apSpeedBtn" data-act="apSpeed" aria-label="গতির হার">${apRateTxt()}</button>
          </div>
          <div class="apl-vol">
            <span class="apl-vico">🔊</span>
            <input class="aplrange sm" id="apVol" type="range" min="0" max="100" value="${S.audioVol == null ? 80 : S.audioVol}" step="1" style="flex:1 1 auto" aria-label="ভলিউম">
            <a href="https://www.youtube.com/watch?v=${cur.id}" target="_blank" rel="noopener noreferrer">ইউটিউবে ↗</a>
          </div>
        </div>` : '';
      const rows = list.filter(inCat).map(x => {
        const on = cur && cur.id === x.id;
        const b = isBhaktiIt(x);
        return `<button class="card rowcard" data-act="audioPlay" data-id="${x.id}" style="width:100%;text-align:left;cursor:pointer;margin-bottom:7px;${on ? 'border-color:var(--gold-400)' : ''}">
          <div class="datebox" style="min-width:44px"><b style="font-size:13px">${b ? esc((x.cat || 'ক').slice(0, 2)) : (x.ch === 0 ? '॥' : bn(x.ch))}</b><i>${b ? 'শ্রেণি' : (x.ch === 0 ? 'শেষ' : 'অধ্যায়')}</i></div>
          <div style="flex:1;min-width:0">
            <div class="ttl" style="font-size:.9rem;line-height:1.5">${esc(x.name)}</div>
            <div class="mini muted" style="margin-top:3px">${b ? esc((x.ch || 'চ্যানেল') + ' · ' + (x.cat || 'কথা')) : audioChLabel(x) + ' · ' + bn(x.dur)}</div></div>
          <span class="pill ${on ? 'ok' : ''}">${on ? '▶ চলছে' : '▶'}</span></button>`;
      }).join('');
      const note = src === 'bhakti'
        ? `<b>কথা · কীর্তন · শাস্ত্র · ভাগবত পাঠ</b> — বাংলা ভক্তিমূলক চ্যানেলগুলোর দীর্ঘ অডিও (প্রবচন, কথামৃত, কীর্তন, ভাগবত-গীতা পাঠ)। ▶ চাপলেই একই অডিও প্লেয়ারে বাজবে — পাতা বদলালেও চলবে।`
        : `<b>গীতার সম্পূর্ণ বাংলা অডিও পাঠ</b> — ১৮টি অধ্যায় ও উপসংহার, স্বামী অদ্গদানন্দজীর যথার্থ গীতা থেকে। ▶ চাপলেই <b>অডিও প্লেয়ার</b> চালু হয়।`;
      return `${srcChips}
        <p class="mini muted" style="margin:0 0 10px;line-height:1.75">${note}</p>
        ${player}
        ${rows || '<p class="mini muted">এই শ্রেণিতে কিছু নেই।</p>'}
        <p class="mini muted" style="margin-top:10px;line-height:1.7">উৎস: YouTube-এর বাংলা ভক্তিমূলক চ্যানেল (oEmbed দিয়ে নাম যাচাই করা)। লিংক অ্যাপের ভেতরে সাজানো; ভিডিও/অডিও ফাইল ডাউনলোড হয় না।</p>`;
    }
  function libraryFeatureCards() {
      const cards = [
        { key: 'books', title: 'শাস্ত্র পাঠ', sub: `${bn((DB.books || []).length)}টি গ্রন্থ · নিজের গতিতে`, art: 'library-art-scripture.webp', action: 'গ্রন্থ দেখুন' },
        { key: 'audio', title: 'ভক্তির অডিও', sub: `${bn((DB.gitaAudio || []).length + bhaktiAudio().length)}টি পাঠ ও শ্রবণ`, art: 'library-art-audio.webp', action: 'শুনতে যান' },
        { key: 'pdf', title: 'নিজের PDF', sub: 'ব্যক্তিগত বই · অফলাইন পাঠ', art: '', action: 'সংগ্রহ খুলুন' }
      ];
      return `<div class="lib-feature-wrap"><div class="lib-feature-heading"><span>পাঠের পথ বেছে নিন</span><i aria-hidden="true"></i></div>
        <div class="lib-feature-grid">${cards.map(c => `<button class="card lib-feature ${U.libSeg === c.key ? 'is-current' : ''} lib-feature-${c.key}" type="button" data-act="seg" data-s="${c.key}" aria-pressed="${U.libSeg === c.key}">
          <span class="lib-art">${c.art ? `<img src="icons/reference/${c.art}" alt="" loading="eager"/>` : `<span class="lib-pdf-art" aria-hidden="true"><i>॥</i><b>PDF</b><small>শাস্ত্র · পাঠ · সংগ্রহ</small></span>`}</span>
          <span class="lib-feature-copy"><b>${c.title}</b><small>${c.sub}</small></span>
          <span class="lib-cta" aria-hidden="true">${c.action}<i>↗</i></span>
        </button>`).join('')}</div></div>`;
    }
  function libraryScreen() {
      const cats = ['সব', 'চলমান', 'নতুন', 'মুখস্থ', 'সংক্ষিপ্ত'];
      return `${appbar('শাস্ত্র গ্রন্থাগার', 'Digital Granthagar', undefined, true)}
      <section class="library-page">
      <div class="pad lib-controls" style="padding-top:0">
        <div class="search">${ico('search', 'sm')}<input id="libSearch" placeholder="গ্রন্থ, শ্লোক বা শব্দ খুঁজুন…" value="${esc(U.libQ)}" aria-label="খুঁজুন"/></div>
        <div class="segment mt">
          ${[['books', 'গ্রন্থ'], ['pdf', 'PDF বই'], ['verse', 'শ্লোক'], ['audio', 'অডিও']].map(([k, l]) =>
            `<button class="${U.libSeg === k ? 'on' : ''}" data-act="seg" data-s="${k}">${l}</button>`).join('')}
        </div>
      </div>
      ${libraryFeatureCards()}
      <div class="cats">${U.libSeg === 'audio'
        ? ((U.audioSrc || 'gita') === 'bhakti'
            ? AUDIO_CATS.map(([k, l]) => `<button class="chip ${(U.audioCat || 'all') === k ? 'on' : ''}" data-act="audioCat" data-c="${k}">${l}${k === 'all' ? ' · ' + bn(bhaktiAudio().length) : ' · ' + bn(bhaktiAudio().filter(x => x.cat === k).length)}</button>`).join('')
            : [['all', 'সব ১৮'], ['1', 'অধ্যায় ১–৬'], ['2', 'অধ্যায় ৭–১২'], ['3', 'অধ্যায় ১৩–১৮'], ['c', 'উপসংহার']]
              .map(([k, l]) => `<button class="chip ${(U.audioCat || 'all') === k ? 'on' : ''}" data-act="audioCat" data-c="${k}">${l}</button>`).join(''))
        : cats.map(c => `<button class="chip ${U.libCat === c ? 'on' : ''}" data-act="cat" data-c="${c}">${c}</button>`).join('')}</div>
      <div class="pad" style="padding-top:12px">
        ${U.libSeg === 'pdf' ? `<div class="card pad" style="text-align:center">
                <div style="font-size:26px">📚</div>
                <b style="display:block;margin:7px 0 6px;font-family:var(--f-dis)">PDF বই পড়ুন</b>
                <p class="mini muted" style="margin:0 0 12px;line-height:1.75">নিজের PDF বই যোগ করুন বা আগে যোগ করা বই খুলুন — অ্যাপের ভেতরেই, জুম ও পৃষ্ঠা-নিয়ন্ত্রণসহ।</p>
                <button class="btn gold block" data-act="nav" data-to="#/library/pdf">PDF গ্রন্থাগার খুলুন ▸</button>
              </div>`
          : U.libSeg === 'audio' ? gitaAudioScreen()
          : U.libSeg === 'verse' ? `<div class="card pad"><div class="mini muted" style="margin-bottom:8px">শ্লোক অনুসন্ধান — বাংলা বা শব্দ দিয়ে</div>
              <div class="mini muted">সার্চ বক্সে লিখে গ্রন্থ খুঁজুন, তারপর গ্রন্থ খুলে শ্লোক বেছে নিন।</div></div>`
            : `<div class="card oath pad" style="margin-bottom:12px">
                <div class="kv"><div><div class="mini muted">পাঠ-অগ্রগতি</div><div class="display" style="font-size:14px;margin-top:3px">গীতা · অধ্যায় ম্যাপ</div></div>
                  <span class="pill">${bn(S.chapters.length)}/১৮</span></div>
                <div class="map">${Array.from({ length: 18 }, (_, i) => {
          const n = i + 1, done = S.chapters.includes(n), cur = n === Math.max(...S.chapters) + 1;
          return `<button class="ch ${done ? 'done' : cur ? 'cur' : ''}" data-act="chapter" data-n="${n}">${bn(n)}</button>`;
        }).join('')}</div>
                <div class="mapkey"><span><i style="background:linear-gradient(180deg,#f8e3b3,#b1842e)"></i>সম্পূর্ণ</span>
                  <span><i style="border:1px solid #d7a94f"></i>চলমান</span><span><i style="background:rgba(255,255,255,.1)"></i>বাকি</span></div>
              </div>
              <div id="libList">${bookCards()}</div>`}
      </div><div style="height:20px"></div></section>`;
    }
