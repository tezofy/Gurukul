/* ==========================================================================
   ৪. পাঠ-পৃষ্ঠা (একটি শ্লোক পড়া)
   ফাইল: js/views/reader.js
   ========================================================================== */
  function readerScreen(id, idx) {
      const b = DB.books.find(x => x.id === id) || DB.books[0];
      const i = Math.max(0, Math.min(parseInt(idx || '0', 10), b.texts.length - 1));
      const t = b.texts[i];
      const k = `${b.id}:${i}`;
      const saved = S.bookmarks.includes(k);
      const hasCh = !!b.chapterMeta;
      return `${appbar(b.title, `অধ্যায় ${bn(t.ch)} · শ্লোক ${bn(t.v)}`, hasCh ? '#/gita/' + t.ch : '#/book/' + b.id, false, true)}
      <div class="pad">
        ${t.dev ? `<div class="prefbar" style="justify-content:center">
          <div class="grp"><b class="${S.script === 'bn' ? 'on' : ''}" data-act="scriptSet" data-v="bn">বাংলা লিপি</b>
            <b class="${S.script === 'dev' ? 'on' : ''}" data-act="scriptSet" data-v="dev">দেবনাগরী</b></div>
        </div>` : ''}

        <div class="card oath verse">
          <div class="vnum"><span class="l"></span><b>শ্লোক ${bn(t.ch)}.${bn(t.v)}</b><span class="l r"></span></div>
          ${spkLine(t.ch, t.v)}
          <div class="sk" style="font-size:${S.font}px">${(S.script === 'dev' && t.dev ? t.dev : t.sk).split('\n').map(esc).join('<br/>')}
            <div class="mini muted" style="text-align:right;margin-top:8px;font-size:10.5px">॥ ${bn(t.ch)}।${bn(t.v)} ॥</div></div>
          <div class="bn"><span class="lbl">বাংলা অনুবাদ</span>${esc(t.bn)}</div>
          <div class="arth"><b style="color:var(--gold-300)">সহজ অর্থ ·</b> ${esc(t.arth)}</div>
        </div>

        ${t.katha ? `<div class="card oath pad katha">
          <div class="kv" style="align-items:center">
            <div style="font-family:var(--f-dis);font-size:13.6px;color:var(--gold-200)">উদাহরণ-কথা</div>
            <span class="pill">${esc(t.ksrc || 'উদাহরণ')}</span>
          </div>
          <p class="ktext">${esc(t.katha)}</p>
          ${t.prayog ? `<div class="prayog"><b>জীবনে প্রয়োগ ·</b> ${esc(t.prayog)}</div>` : ''}
          <div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">
            <button class="btn ghost sm" data-act="speakKatha" data-i="${i}">${vico('play', 'xs')} কথা শুনুন</button>
            <button class="btn ghost sm" data-act="speakFull" data-i="${i}">${vico('play', 'xs')} শ্লোক + কথা</button>
            <button class="btn ghost sm" data-act="speakStop">থামান</button>
          </div>
          <div class="tiny muted" style="margin-top:10px;line-height:1.7">কথাটি শ্লোকের ভাব অনুসরণ করে লেখা — শাস্ত্রীয় ঘটনা বা দৈনন্দিন জীবনের দৃষ্টান্ত; উদ্দেশ্য কেবল শিক্ষা, বিনোদন নয়।</div>
        </div>` : `<div class="card pad"><div class="mini muted">এই শ্লোকের উদাহরণ-কথা এখনো যুক্ত হয়নি — ধাপে ধাপে যোগ হচ্ছে।</div></div>`}

        <div style="display:flex;gap:9px;margin-top:14px">
          <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/reader/${b.id}/${i - 1}" ${i === 0 ? 'disabled' : ''}>আগের</button>
          <button class="btn ghost" style="width:52px;padding:0" data-act="bookmark" data-i="${i}" aria-label="বুকমার্ক">${vico('mark', 'sm')}</button>
          <button class="btn ghost" style="width:52px;padding:0" data-act="noteFromReader" data-i="${i}" aria-label="এই শ্লোকের নোট">${ico('pen', 'sm')}</button>
          <button class="btn gold" style="flex:1.3" data-act="markread" data-i="${i}">${S.read[k] ? 'পঠিত ✓' : 'পাঠ সম্পন্ন'}</button>
        </div>
        ${(() => { const c = S.notes.filter(n => n.ctx && n.ctx.book === b.id && n.ctx.idx === i).length;
          return c ? `<button class="btn ghost block mt" data-act="openNotes">${ico('pen', 'sm')} এই শ্লোকে ${bn(c)}টি নোট আছে</button>` : ''; })()}
        <button class="btn ghost block mt" data-act="nav" data-to="#/reader/${b.id}/${i + 1}" ${i === b.texts.length - 1 ? 'disabled' : ''}>পরের শ্লোক ${ico('arrow', 'sm')}</button>
        ${hasCh ? `<button class="btn ghost block mt" data-act="nav" data-to="#/gita/${t.ch}">অধ্যায় ${bn(t.ch)}-এর সব শ্লোক ▸</button>` : ''}
        ${saved ? '<p class="mini muted" style="text-align:center;margin-top:10px">বুকমার্ক করা আছে · লাইব্রেরিতে দেখুন</p>' : ''}
      </div><div style="height:20px"></div>`;
    }
