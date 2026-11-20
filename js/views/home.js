/* ==========================================================================
   ১. হোম (মন্দির) পেজ
   ফাইল: js/views/home.js
   ========================================================================== */
  function homeScreen() {
      const p = panjikaFor(TODAY_KEY);
      const r = S.rituals[TODAY_KEY] || [false, false, false];
      const doneCount = r.filter(Boolean).length;
      const lv = S.lastVerse, book = DB.books.find(b => b.id === lv.book) || DB.books[0];
      const verseIndex = Math.max(0, Math.min(Number(lv.idx) || 0, book.texts.length - 1));
      const verse = book.texts[verseIndex] || book.texts[0];
      const fest = nextFestival();
      const camp = DB.campaigns[0];
      const raised = camp.raised + (S.raised[camp.id] || 0);
      const pct = Math.min(100, Math.round(raised / camp.goal * 100));
      const obs = todayObservances();
      const bd = bengaliDate(TODAY);
      const CHS = (typeof GITA_CHAPTERS !== 'undefined' && Array.isArray(GITA_CHAPTERS)) ? GITA_CHAPTERS : [];
      const chapInfo = CHS.find(c => c.n === verse.ch) || null;
      const chapName = book.id === 'gita' && chapInfo ? chapInfo.name : '';
      const chapSum = book.id === 'gita' && chapInfo ? chapInfo.sum : '';

      return `
      <div class="ref-home">
        <header class="ref-head">
          <button class="ref-emblem" data-act="nav" data-to="#/home" aria-label="মন্দির">ॐ</button>
          <div class="ref-brand">সনাতন বিদ্যাপীঠ</div>
          ${searchBtn()} ${settingsBtn()}
        </header>
        <div class="ref-home-search" role="search">
          <div class="ref-home-search-field">
            <img src="icons/reference/search-gold.svg" alt="" aria-hidden="true"/>
            <input id="homeSearch" type="search" autocomplete="off" placeholder="খুঁজুন বা তারিখ লিখুন…" aria-label="অ্যাপে খুঁজুন" aria-controls="homeSearchResults" aria-expanded="false"/>
            <button type="button" class="ref-search-clear" data-act="homeSearchClear" aria-label="অনুসন্ধান মুছুন" hidden>×</button>
            <button type="button" class="ref-search-voice" data-act="homeVoiceSearch" aria-label="ভয়েস দিয়ে খুঁজুন" aria-pressed="false" title="ভয়েস দিয়ে খুঁজুন"><img src="icons/reference/voice-gold.svg" alt="" aria-hidden="true"/></button>
          </div>
          <div class="ref-search-voice-status" id="homeVoiceStatus" role="status" aria-live="polite" hidden></div>
          <div id="homeSearchResults" class="ref-home-search-results search-res" aria-label="অনুসন্ধানের ফলাফল" hidden></div>
        </div>
        <div class="ref-today-dates" role="group" aria-label="আজ ${BN_DAY[TODAY.getDay()]}, ${bn(TODAY.getDate())} ${BN_MONTH[TODAY.getMonth()]} ${bn(TODAY.getFullYear())} ইংরেজি; ${bn(bd.d)} ${bd.month} ${bn(bd.year)} বঙ্গাব্দ">
          <span class="ref-today-gregorian" aria-hidden="true">${BN_DAY[TODAY.getDay()]}, ${bn(TODAY.getDate())} ${BN_MONTH[TODAY.getMonth()]} ${bn(TODAY.getFullYear())} ইং</span>
          <span class="ref-today-bangla" aria-hidden="true">${bn(bd.d)} ${bd.month} ${bn(bd.year)} বঙ্গাব্দ</span>
        </div>
        <div class="ref-calendar" aria-label="আজকের পঞ্জিকা ও উৎসব">
          <div class="ref-rot" id="heroRot" aria-live="off">
            ${obs.map((o,i) => `<section class="hx-item${i === 0 ? ' on' : ''}" aria-hidden="${i === 0 ? 'false' : 'true'}">
              <div class="ref-event-copy ref-event-head"><strong class="ref-writing-title" aria-label="${esc(o.name)}"><span class="ref-writing-ink" aria-hidden="true">${esc(o.name)}</span><img class="ref-writing-feather" src="icons/reference/writing-feather.svg" alt="" aria-hidden="true"/></strong></div>
              <div class="ref-cal-main">
                <div class="ref-event"><img class="ref-event-art" src="icons/reference/${o.kind === 'ব্রত' ? 'event-vrata' : o.kind === 'উৎসব' ? 'event-festival' : 'calendar-date'}-3d.png" alt="" aria-hidden="true"/><div class="ref-event-tags"><span>${esc(o.kind)}</span><span>${esc(o.tag)}</span></div></div>
                <div class="ref-cal-note"><div class="ref-time"><img class="ref-inline-icon ref-time-icon" src="icons/reference/calendar-time-3d.png" alt="" aria-hidden="true"/> <span><b>${esc(o.whenLab)}</b><br><span class="ref-hours">${esc(o.when)}</span></span></div><div class="ref-event-note"><b>${esc(o.dateLabel || '')}</b><span>${esc(o.note)}</span></div></div>
              </div>
              <div class="ref-cal-side"><div class="ref-calendar-facts"><small>আজকের পঞ্জিকা</small><div class="ref-fact"><img src="icons/reference/calendar-moon-3d.png" alt="" aria-hidden="true"/><span><em>তিথি:</em> <b>${p.tithi}</b></span></div><div class="ref-fact"><img src="icons/reference/calendar-stars-3d.png" alt="" aria-hidden="true"/><span><em>নক্ষত্র:</em> <b>${p.nak}</b></span></div><div class="ref-sun-times"><div class="ref-fact ref-sun-fact"><img src="icons/reference/calendar-sunrise.svg" alt="" aria-hidden="true"/><span><em>সূর্যোদয়</em><b>${p.sunrise}</b></span></div><div class="ref-fact ref-sun-fact"><img src="icons/reference/calendar-sunset.svg" alt="" aria-hidden="true"/><span><em>সূর্যাস্ত</em><b>${p.sunset}</b></span></div><small>ঢাকা · ২৪ ঘণ্টা</small></div></div><button class="ref-calendar-go" data-act="nav" data-to="#/panjika">পঞ্জিকা</button></div>
            </section>`).join('')}
          </div>
        </div>
        <div class="ref-small-cards">
          <button class="ref-sadhana" data-act="dailyTasksOpen" aria-label="আজকের সাধনা: ${bn(doneCount)}টি কাজ সম্পন্ন, ৩টির মধ্যে। কাজের তালিকা দেখুন">
            <span class="ref-card-inner">
              <span class="ref-sadhana-title">আজকের সাধনা</span>
              <span class="ref-sadhana-summary">${bn(doneCount)}টি কাজ সম্পন্ন</span>
              <span class="ref-card-art-row"><img class="ref-sadhana-sage" src="icons/reference/cal-sage.png" alt="" aria-hidden="true"/>
                <span class="ref-progress-medallion"><img src="icons/reference/card-ring-layer.png" alt="" aria-hidden="true"/><b>${bn(doneCount)}/৩</b></span></span>
            </span>
          </button>
          <button class="ref-reading" data-act="nav" data-to="#/reader/${book.id}/${verseIndex}" aria-label="${esc(book.title)} ${bn(verse.ch)}.${bn(verse.v)} পাঠ করুন">
            <span class="ref-card-inner">
              <span class="ref-reading-title">আজকের শাস্ত্র পাঠ</span>
              <span class="ref-reading-book">${esc(book.title)} <b>${bn(verse.ch)}.${bn(verse.v)}</b></span>
              <span class="ref-reading-chapter">${chapName ? `অধ্যায় ${bn(verse.ch)} · ${esc(chapName)}` : `অধ্যায় ${bn(verse.ch)}`}</span>
              <span class="ref-card-art-row"><img class="ref-reading-feather" src="icons/reference/card-feather-layer.png" alt="" aria-hidden="true"/><span class="ref-reading-go">পাঠ →</span></span>
            </span>
          </button>
        </div>
        <div class="ref-grid">
          ${[['puja','পূজা','#/puja'],['panjika','পঞ্জিকা','#/panjika'],['quiz','কুইজ','#/exam'],['market','কাজ','#/market'],['sadhana','সাধনা','#/sadhana'],['gita','গীতা','#/gita'],['track','হিসাব','#/track'],['notes','নোট','#/notes']].map(([img, label, to]) => `<button data-act="nav" data-to="${to}"><span class="ref-menu-art"><img class="ref-menu-pedestal" src="icons/reference/menu/${img}-pedestal.png" alt=""/><img class="ref-menu-object" src="icons/reference/menu/${img}-icon.png" alt=""/></span><span class="ref-menu-label">${label}</span></button>`).join('')}
        </div>
        <div class="ref-plaque">✿ &nbsp; সনাতন ঐতিহ্য · নীতি · হিসাব · নোট &nbsp; ✿</div>
      </div>

      <div class="pad">
        <div class="sect" style="margin-top:6px"><h4>রিলস</h4><div class="line"></div>
          <button class="act" data-act="nav" data-to="#/reels">সব ›</button></div>
        ${(() => {
          const rl = bpOrdered();
          if (!rl.length) return '';
          const day = Math.floor(new Date(TODAY_KEY + 'T00:00:00') / DAY_MS);
          const show = [];
          for (let k = 0; k < 10 && k < rl.length; k++) show.push(reelAt(rl, (day * 7 + k * 37) % rl.length));
          return `<div class="reelrail">${show.map(r => bpReelCard(r)).join('')}</div>
          <div class="mini muted" style="margin:-2px 0 2px">হিন্দু ধর্মীয় ও ভক্তিমূলক চ্যানেলের ${bn(rl.length)}+ রিলস · প্রতিদিন নতুন বাছাই — অ্যাপের ভেতরেই</div>`;
        })()}

        <div class="sect"><h4>সাধনা</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/sadhana">সব ›</button></div>
        <div class="grid3">
          <div class="card pad" data-act="nav" data-to="#/sadhana/japa" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
            <div style="color:var(--gold-300);display:grid;place-items:center">${ico('om')}</div>
            <div class="mini" style="margin-top:7px">জপ</div>
            <b style="font-size:12px">${bn(S.japa.count)}/১০৮</b></div>
          <div class="card pad" data-act="nav" data-to="#/sadhana/dhyana" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
            <div style="color:var(--gold-300);display:grid;place-items:center">${ico('clock')}</div>
            <div class="mini" style="margin-top:7px">ধ্যান</div>
            <b style="font-size:12px">${bn(S.sessions.length ? S.sessions[S.sessions.length - 1].mins : 0)} মিনিট</b></div>
          <div class="card pad" data-act="nav" data-to="#/sadhana/yoga" role="button" tabindex="0" style="text-align:center;padding:12px 8px;cursor:pointer">
            <div style="color:var(--gold-300);display:grid;place-items:center">${ico('heart')}</div>
            <div class="mini" style="margin-top:7px">যোগা</div>
            <b style="font-size:12px">${bn(Object.keys(S.asanaDone).filter(k => S.asanaDone[k]).length)}/${bn(DB.asanas.length)}</b></div>
        </div>

        <div class="sect"><h4>চলমান পাঠ</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/library">সব ›</button></div>
        <div class="card rowcard oath" data-act="nav" data-to="#/reader/${book.id}/${verseIndex}" role="button" tabindex="0" style="cursor:pointer">
          <div class="cover ${book.cls}"><span class="sym">${book.sym}</span></div>
          <div style="flex:1;min-width:0">
            <div class="kv"><span class="ttl">${book.title}</span><span class="pill">${bn(verse.ch)}.${bn(verse.v)}</span></div>
            <div class="mini muted" style="margin:4px 0 9px">${esc(verse.sk.split('\n')[0].slice(0, 34))}…</div>
            <div class="bar thin"><i style="width:${Math.round((lv.idx + 1) / book.texts.length * 100)}%"></i></div>
            <div class="mini muted" style="margin-top:6px">${bn(lv.idx + 1)}/${bn(book.texts.length)} শ্লোক · ৩ মিনিট বাকি</div>
          </div>
        </div>

        <button class="btn ghost block mt" data-act="openNotes" style="justify-content:space-between">
          <span>${ico('pen', 'sm')} আমার নোট</span><span class="tiny muted">${bn(S.notes.length)} ›</span></button>

        <div class="sect"><h4>আজকের সাধনা</h4><div class="line"></div><span class="mini muted">${bn(doneCount)}/৩</span></div>
        <div class="card pad" style="padding:4px 14px">
          ${['সকালের নিত্যকর্ম সম্পন্ন', `গীতা ${bn(2)}.${bn(47)} পাঠ`, 'সন্ধ্যা আরতি ও কুইজ'].map((label, i) => `
            <div class="ritual ${r[i] ? 'done' : ''}" data-act="ritual" data-i="${i}" role="checkbox" aria-checked="${!!r[i]}" tabindex="0">
              <span class="tick">${ico('check', 'xs')}</span>
              <span class="lab">${label}</span>
              <span class="xp">${r[i] ? '✓' : ['+১০', '+২০', '+৩০'][i]}</span>
            </div>`).join('')}
        </div>

        <div class="sect"><h4>এখনই করার সময়</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/puja">শুরু ›</button></div>
        <div class="card oath rowcard" data-act="nav" data-to="#/puja/sandhya" style="cursor:pointer;gap:14px">
          ${FLAME(34, 46)}
          <div style="flex:1">
            <div class="kv"><span class="ttl">সন্ধ্যা আরতি</span><span class="pill">${p.sunset} সূর্যাস্ত</span></div>
            <div class="mini muted" style="margin-top:5px">প্রদীপ ও ধূপ প্রস্তুত করুন · ${bn(7)} ধাপ</div>
          </div>
          ${ico('arrow', 'sm')}
        </div>

        ${fest ? `
        <div class="sect"><h4>আসন্ন উৎসব</h4><div class="line"></div><button class="act" data-act="nav" data-to="#/panjika">পঞ্জিকা ›</button></div>
        <div class="card rowcard">
          <div class="datebox"><b>${bn(fest.date.getDate())}</b><i>${BN_MONTH[fest.date.getMonth()].slice(0, 4)}</i></div>
          <div style="flex:1">
            <div class="kv"><span class="ttl">${esc(fest.name)}</span><span class="pill">${fest.days === 0 ? 'আজ' : bn(fest.days) + ' দিন'}</span></div>
            <div class="mini muted" style="margin-top:5px">${panjikaFor(key(fest.date)).tithi} · শুভ সময় ${panjikaFor(key(fest.date)).shubho}</div>
          </div>
        </div>` : ''}
      </div>

      <div class="sevaband" data-act="nav" data-to="#/seva" style="cursor:pointer">
        ${vico('heart')}
        <div style="flex:1"><h5>${esc(camp.title)}</h5><p>${esc(camp.sh || camp.blurb)}</p></div>
        <span class="pill ok">${bn(pct)}%</span>
      </div>
      <div style="height:24px"></div>`;
    }
