/* ==========================================================================
   ＋ প্যানেল (আজকের হিসাব ও নোট শিট)
   ফাইল: js/core/70-sheet.js
   ========================================================================== */
  function quickSheetHTML() {
      const e = entryFor(TODAY_KEY);
      const auto = todayAuto();
      const sc = scoreOf(e, auto);
      const pillars = [['আধ্যাত্মিক', sc.sadhana], ['চরিত্র', sc.charitra], ['কর্ম', sc.karma], ['জীবন', sc.jibon]];
      const tab = U.sheetTab === 'note' ? 'note' : 'hisab';
      const notes = S.notes.slice().sort((a, b) => b.id - a.id).slice(0, 4);

      const hisabPane = `
        <div class="grid2 sp-pillars">
          ${pillars.map(([n, v]) => `<div class="stat"><div class="k">${n}</div>
            <div class="v">${bn(v)}<span class="tiny muted">/১০০</span></div>
            <div class="bar thin" style="margin-top:5px"><i style="width:${v}%"></i></div></div>`).join('')}
        </div>
        <div class="sp-scroll">
          ${stepper('puja', 'নিত্য পূজা', e.puja, 5, 'মিনিট')}
          ${stepper('japaExtra', 'জপ', e.japaExtra, 1, 'মালা', `অ্যাপে ${bn(auto.japa)} জপ`)}
          ${stepper('dhyanaExtra', 'ধ্যান', e.dhyanaExtra, 5, 'মিনিট', `অ্যাপে ${bn(auto.dhyana)} মিনিট`)}
          ${stepper('pathMin', 'শাস্ত্র পাঠ', e.pathMin, 5, 'মিনিট')}
          ${stepper('daanTaka', 'দান', e.daanTaka, 50, '৳')}
          ${stepper('daanMin', 'সেবায় সময়', e.daanMin, 5, 'মিনিট')}
          ${stepper('workMin', 'কর্ম', e.workMin, 15, 'মিনিট')}
          ${stepper('familyMin', 'পরিবারের সঙ্গে', e.familyMin, 15, 'মিনিট')}
          ${stepper('lies', 'মিথ্যা বলা', e.lies, 1, 'বার')}
        </div>`;

      const notePane = `
        <div class="sp-notes">
          ${notes.length ? notes.map(n => `<button class="sp-nrow" data-act="nav" data-to="#/notes">
              <span class="sp-nd">${bn(new Date(n.id).getDate())} ${BN_MONTH[new Date(n.id).getMonth()].slice(0, 4)}</span>
              <span class="sp-nt">${esc((n.t || '').slice(0, 58))}${(n.t || '').length > 58 ? '…' : ''}</span>
              ${(n.tags || []).length ? `<span class="sp-ntag">${esc(n.tags.slice(0, 2).join(' · '))}</span>` : ''}
            </button>`).join('')
            : `<div class="sres-empty" style="padding:14px 8px"><div class="mini muted">এখনও কোনো নোট নেই — প্রথম নোটটি লিখুন।</div></div>`}
        </div>
        <button class="btn ghost block" style="margin-top:9px" data-act="nav" data-to="#/notes">সব নোট (${bn(S.notes.length)}) ›</button>`;

      return `<div class="setpop-bg" data-act="sheetClose" aria-hidden="true"></div>
      <div class="setpop-card sheetpop" role="dialog" aria-modal="true" aria-label="আজকের হিসাব ও নোট">
        <div class="setpop-head">
          <div>
            <div class="mini muted sp-eyebrow">আজকের হিসাব ও নোট</div>
            <div class="display sp-score">${bn(sc.total)}<span class="tiny muted" style="font-family:var(--f-body)"> /১০০</span></div>
          </div>
          <button class="iconbtn" data-act="sheetClose" aria-label="বন্ধ করুন">${ico('close')}</button>
        </div>

        <div class="segment sp-seg">
          <button class="${tab === 'hisab' ? 'on' : ''}" data-act="sheetTab" data-t="hisab">হিসাব</button>
          <button class="${tab === 'note' ? 'on' : ''}" data-act="sheetTab" data-t="note">নোট · ${bn(S.notes.length)}</button>
        </div>

        ${tab === 'note' ? notePane : hisabPane}

        <div class="sp-acts">
          <button class="btn gold" style="flex:1.2" data-act="noteNew">${ico('pen', 'sm')} নোট লিখুন</button>
          <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/track">পূর্ণ হিসাব ›</button>
        </div>
        <p class="tiny muted sp-foot">প্রতিটি কাজ পয়েন্টে গোনা হয় · আধ্যাত্মিক ৪০% · চরিত্র ২৫% · কর্ম ২০% · জীবন ১৫%</p>
      </div>`;
    }
  function openSheet() {
      const host = document.getElementById('sheetHost');
      if (!host) return;
      const prev = host.querySelector('.sp-scroll');
      const keep = prev ? prev.scrollTop : 0;
      host.innerHTML = quickSheetHTML();
      host.classList.add('on');
      const scl = host.querySelector('.sp-scroll');
      if (scl && keep) scl.scrollTop = keep;
      U.sheet = true;
    }
  function refreshSheet() { if (U.sheet) openSheet(); }
  function closeSheet() {
      const host = document.getElementById('sheetHost');
      if (host) { host.classList.remove('on'); host.innerHTML = ''; }
      U.sheet = false;
    }
