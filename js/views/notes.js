/* ==========================================================================
   ১৮. নোট — পড়ার পাশে লিখে রাখা
   ফাইল: js/views/notes.js
   ========================================================================== */
  const NOTE_TAGS = ['শ্লোক', 'প্রশ্ন', 'সাধনা', 'প্রার্থনা', 'পূজা', 'অনুপ্রেরণা', 'কথা'];
  const noteCtxLabel = ctx => {
      if (!ctx) return '';
      const b = DB.books.find(x => x.id === ctx.book);
      let l = b ? b.title : 'পাঠ';
      if (ctx.ch) l += ' · অধ্যায় ' + bn(ctx.ch);
      if (ctx.v) l += ' · শ্লোক ' + bn(ctx.v);
      return l;
    };
  const noteDayLabel = d => {
      const t = new Date();
      if (d === key(t)) return 'আজ';
      const y = new Date(t); y.setDate(y.getDate() - 1);
      if (d === key(y)) return 'গতকাল';
      const dd = new Date(d + 'T00:00:00');
      if (isNaN(dd.getTime())) return d;
      return `${bn(dd.getDate())} ${BN_MONTH[dd.getMonth()]} ${bn(dd.getFullYear())}`;
    };
  const noteTagList = () => {
      const set = [];
      S.notes.forEach(n => (n.tags || []).forEach(t => { if (!set.includes(t)) set.push(t); }));
      return set;
    };
  function notesScreen() {
      const q = U.noteQ.trim().toLowerCase();
      const tag = U.noteTag;
      let rows = S.notes.slice().sort((a, b) => b.id - a.id);
      if (tag !== 'সব') rows = rows.filter(n => (n.tags || []).includes(tag));
      if (q) rows = rows.filter(n => (n.t + ' ' + (n.tags || []).join(' ') + ' ' + noteCtxLabel(n.ctx)).toLowerCase().includes(q));
      const groups = [];
      rows.forEach(n => {
        const g = groups.find(x => x.d === n.d);
        if (g) g.items.push(n); else groups.push({ d: n.d, items: [n] });
      });
      const allTags = noteTagList();
      const count = t => S.notes.filter(n => (n.tags || []).includes(t)).length;

      return `${appbar('আমার নোট', `${bn(S.notes.length)}টি নোট · ${bn(allTags.length)}টি ট্যাগ`, '#/home', true, true)}
      <div class="pad" style="padding-top:0">
        <div class="search">${ico('search', 'sm')}<input id="noteSearch" placeholder="নোট, ট্যাগ বা শ্লোক খুঁজুন" value="${esc(U.noteQ)}"/></div>
        <div class="cats" style="margin-top:10px">${['সব'].concat(allTags).map(t => `<button class="chip ${tag === t ? 'on' : ''}" data-act="noteFilter" data-t="${esc(t)}">${t === 'সব' ? 'সব' : '#' + esc(t)}${t === 'সব' ? ' · ' + bn(S.notes.length) : ' · ' + bn(count(t))}</button>`).join('')}</div>

        ${S.notes.length === 0
          ? `<div class="card pad mt"><div class="mini muted" style="line-height:1.9">এখনো কোনো নোট নেই। বই পড়তে পড়তে যা মনে আসে, নিচের <b>＋</b> চিহ্ন দিয়ে লিখে রাখুন — শ্লোকের পাশ থেকেই।</div></div>`
          : (rows.length === 0
            ? `<div class="card pad mt"><div class="mini muted">এই ছাঁকনিতে কোনো নোট নেই — অন্য ট্যাগ দেখুন।</div></div>`
            : groups.map(g => `
          <div class="sect"><h4>${noteDayLabel(g.d)}</h4><div class="line"></div><span class="mini muted">${bn(g.items.length)}</span></div>
          ${g.items.map(n => `<div class="card pad">
            <div class="kv"><div class="tiny" style="color:var(--gold-300)">${esc(noteCtxLabel(n.ctx) || 'সাধারণ নোট')}</div>
              <div class="tiny muted">${(n.tags || []).map(t => '#' + esc(t)).join(' ')}</div></div>
            <p style="margin:8px 0 0;font-size:12.8px;line-height:1.85;white-space:pre-wrap">${esc(n.t)}</p>
            <div class="kv" style="margin-top:10px">
              <div class="tiny" style="display:flex;gap:10px">
                ${n.ctx && n.ctx.book ? `<button class="act" data-act="noteGo" data-b="${esc(n.ctx.book)}" data-i="${n.ctx.idx}">পাঠে ফিরুন ›</button>` : ''}
              </div>
              <div class="tiny" style="display:flex;gap:10px">
                <button class="act" data-act="noteEdit" data-id="${n.id}">সম্পাদনা</button>
                <button class="act" data-act="noteDel" data-id="${n.id}" style="color:var(--danger)">মুছুন</button>
              </div>
            </div>
          </div>`).join('')}`).join(''))}

        <button class="btn gold block mt" data-act="noteNew">${ico('plus', 'sm')} নতুন নোট</button>
        <p class="tiny muted" style="margin-top:12px;line-height:1.8;text-align:center">সব নোট আপনার এই ব্রাউজারেই থাকে — কারও সঙ্গে ভাগ হয় না।</p>
      </div><div style="height:20px"></div>`;
    }
  function noteComposerScreen() {
      const n = U.note;
      const tags = n.tags || [];
      return `${appbar(n.edit ? 'নোট সম্পাদনা' : 'নতুন নোট', 'পাঠের পাশে যা মনে আসে, লিখে রাখুন', '#/notes', false, true)}
      <div class="pad" style="padding-top:0">
        ${n.ctx ? `<div class="card pad" style="padding:10px 13px;margin-bottom:10px"><div class="kv">
            <div class="mini" style="color:var(--gold-300)">${esc(noteCtxLabel(n.ctx))}</div>
            <button class="act" data-act="noteCtxClear">লাগবে না ✕</button></div></div>` : ''}
        <textarea class="input" id="noteText" rows="7" placeholder="যেমন — এই শ্লোকটি পড়ে মনে হলো, রাগের সময় মনে রাখতে হবে…">${esc(n.text)}</textarea>
        <div class="mini muted" style="margin-top:14px">ট্যাগ দিন (একাধিক)</div>
        <div class="cats" style="margin-top:7px">${NOTE_TAGS.map(t => `<button class="chip ${tags.includes(t) ? 'on' : ''}" data-act="noteTag" data-t="${esc(t)}">#${esc(t)}</button>`).join('')}</div>
        <div style="display:flex;gap:8px;margin-top:11px">
          <input class="input" id="noteTagNew" placeholder="নিজের ট্যাগ — যেমন: গীতা-১৮" style="flex:1"/>
          <button class="btn ghost sm" data-act="noteTagAdd">যোগ</button>
        </div>
        ${tags.length ? `<div class="tiny" style="margin-top:10px;color:var(--gold-300)">${tags.map(t => '#' + esc(t)).join(' ')}</div>` : ''}
        <button class="btn gold block mt" data-act="noteSave">${n.edit ? 'পরিবর্তন রাখুন' : 'নোট রাখুন'}</button>
        ${n.edit ? `<button class="btn ghost block mt" data-act="noteEditCancel">বাতিল</button>` : ''}
      </div><div style="height:20px"></div>`;
    }
