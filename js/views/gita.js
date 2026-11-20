/* ==========================================================================
   ৩. গীতা — অধ্যায়, শ্লোক, বাংলা অডিও পাঠ
   ফাইল: js/views/gita.js
   ========================================================================== */
  function bookScreen(id) {
      const b = DB.books.find(x => x.id === id) || DB.books[0];
      return `${appbar(b.title, esc(b.author), '#/library')}
      <div class="pad">
        <div class="card oath pad stack">
          <div style="display:flex;gap:14px;align-items:center">
            <div class="cover ${b.cls}" style="width:64px;height:84px"><span class="sym" style="font-size:24px">${b.sym}</span></div>
            <div style="flex:1">
              <div class="kv"><span class="ttl" style="font-size:14px">${esc(b.title)}</span><span class="pill">${b.tag}</span></div>
              <div class="mini muted" style="margin:5px 0 9px">${bn(b.chapters)} অধ্যায় · ${bn(b.verses)} শ্লোক</div>
              <div class="bar thin"><i style="width:${S.read[b.id + ':any'] ? 60 : 25}%"></i></div>
            </div>
          </div>
          <p class="tiny muted" style="margin:12px 0 0;line-height:1.8">${esc(b.desc)}</p>
        </div>

        ${b.chapterMeta ? `<button class="btn gold block mt" data-act="nav" data-to="#/gita">অধ্যায়ভিত্তিক সম্পূর্ণ পাঠ ▸</button>` : ''}
        <div class="sect"><h4>${b.chapterMeta ? 'অধ্যায়' : 'এই ডেমোতে পাঠ'}</h4><div class="line"></div><span class="mini muted">${b.chapterMeta ? bn(18) + ' অধ্যায়' : bn(b.texts.length) + ' শ্লোক'}</span></div>
        ${b.chapterMeta ? b.chapterMeta.map(m => `<div class="card rowcard stack" data-act="nav" data-to="#/gita/${m.n}" role="button" tabindex="0" style="cursor:pointer">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(m.n)}</b><i>অধ্যায়</i></div>
            <div style="flex:1;min-width:0"><div class="kv"><span class="ttl" style="font-size:12.6px">${esc(m.name)}</span><span class="pill">${bn(m.count)}</span></div>
            <div class="mini muted" style="margin-top:5px">${esc(m.sum.slice(0, 66))}…</div></div>${ico('arrow', 'sm')}</div>`).join('') : ''}
        ${b.chapterMeta ? '' : b.texts.map((t, i) => {
          const done = !!S.read[`${b.id}:${i}`];
          const saved = S.bookmarks.includes(`${b.id}:${i}`);
          return `<div class="card rowcard stack" data-act="nav" data-to="#/reader/${b.id}/${i}" role="button" tabindex="0" style="cursor:pointer">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(t.ch)}.${bn(t.v)}</b><i>শ্লোক</i></div>
            <div style="flex:1;min-width:0">
              <div class="mini muted" style="margin-bottom:4px">${esc(t.bn.slice(0, 54))}…</div>
              <div style="display:flex;gap:6px">${done ? '<span class="pill ok">পঠিত</span>' : ''}${saved ? '<span class="pill">বুকমার্ক</span>' : ''}</div>
            </div>${ico('arrow', 'sm')}</div>`;
        }).join('')}
      </div><div style="height:20px"></div>`;
    }
  const SPK = {
      krishna: { name: 'শ্রীভগবান উবাচ', short: 'শ্রীভগবান', to: 'ভগবান শ্রীকৃষ্ণ অর্জুনকে বলছেন', cls: 'k' },
      arjuna: { name: 'অর্জুন উবাচ', short: 'অর্জুন', to: 'অর্জুন শ্রীকৃষ্ণের কাছে বলছেন', cls: 'a' },
      sanjaya: { name: 'সঞ্জয় উবাচ', short: 'সঞ্জয়', to: 'সঞ্জয় ধৃতরাষ্ট্রকে বলছেন', cls: 's' },
      dhritarashtra: { name: 'ধৃতরাষ্ট্র উবাচ', short: 'ধৃতরাষ্ট্র', to: 'ধৃতরাষ্ট্র সঞ্জয়কে বলছেন', cls: 'd' }
    };
  const spkOf = (ch, v) => (typeof GITA_SPEAKER !== 'undefined' && GITA_SPEAKER[ch + ':' + v]) || '';
  const spkName = (ch, v) => { const x = SPK[spkOf(ch, v)]; return x ? x.name : ''; };
  const spkLine = (ch, v) => {
      const x = SPK[spkOf(ch, v)]; if (!x) return '';
      return `<div class="uvacha ${x.cls}">
          <div class="u-row"><span class="u-orn">॥</span><span class="u-name">${esc(x.name)}</span><span class="u-orn">॥</span></div>
          <div class="u-sub">${esc(x.to)}</div>
        </div>`;
    };
  const spkTag = (ch, v) => {
      const x = SPK[spkOf(ch, v)]; if (!x) return '';
      return `<span class="utag ${x.cls}">${esc(x.short)}</span>`;
    };
  const GITA_BOOK = () => DB.books.find(b => b.id === 'gita');
  const gitaMeta = () => { const b = GITA_BOOK(); return (b && b.chapterMeta) || []; };
  const gitaBnCount = () => { const b = GITA_BOOK(); return b ? b.texts.filter(t => t.bn).length : 0; };
  const gitaKathaCount = () => { const b = GITA_BOOK(); return b ? b.texts.filter(t => t.katha).length : 0; };
  function gitaScreen() {
      const b = GITA_BOOK();
      const meta = gitaMeta();
      const total = b ? b.texts.length : 0;
      const done = gitaBnCount();
      const kcount = gitaKathaCount();
      const pct = total ? Math.round(done / total * 100) : 0;
      const q = U.gitaQ.trim().toLowerCase();
      const hits = q && b ? b.texts.map((t, i) => ({ t, i })).filter(x =>
        (x.t.bn + ' ' + x.t.sk + ' ' + x.t.arth + ' ' + (x.t.katha || '') + ' ' + (x.t.prayog || '')).toLowerCase().includes(q)).slice(0, 30) : [];

      return `${appbar('শ্রীমদ্ভগবদ্গীতা', `${bn(18)} অধ্যায় · ${bn(total)} শ্লোক`, '#/library', true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div class="reuse-gita-head"><img class="reuse-scripture" src="icons/reference/cal-scripture.png" alt="" aria-hidden="true"/><div class="reuse-gita-copy"><div class="mini muted">মূল সংস্কৃত পাঠ · সম্পূর্ণ</div>
            <div class="display" style="font-size:17px;color:var(--gold-200);margin-top:3px">৭০১ শ্লোক, ১৮ অধ্যায়</div></div>
            <span class="pill ok">${bn(pct)}%</span></div>
          <div class="bar mt"><i style="width:${pct}%"></i></div>
          <div class="kv mini muted" style="margin-top:7px"><span>বাংলা অনুবাদ হয়েছে ${bn(done)}টি শ্লোকে</span><span>বাকি ${bn(total - done)}টি</span></div>
          <div class="kv mini muted" style="margin-top:4px"><span>উদাহরণ-কথা + জীবনে প্রয়োগ</span><span>${bn(kcount)}/${bn(total)} শ্লোক</span></div>
        </div>

        <div class="search mt">${ico('search', 'sm')}<input id="gitaSearch" placeholder="শ্লোক খুঁজুন — বাংলা অর্থ বা সংস্কৃত শব্দ…" value="${esc(U.gitaQ)}" aria-label="গীতায় খুঁজুন"/></div>

        ${q ? `<div class="sect"><h4>সন্ধান: “${esc(U.gitaQ)}”</h4><div class="line"></div><span class="mini muted">${bn(hits.length)}টি ফল</span></div>
          ${hits.length ? hits.map(x => `<div class="card rowcard stack" data-act="nav" data-to="#/reader/gita/${x.i}" role="button" tabindex="0" style="cursor:pointer">
              <div class="datebox" style="width:44px;height:48px"><b>${bn(x.t.ch)}.${bn(x.t.v)}</b><i>শ্লোক</i></div>
              <div style="flex:1;min-width:0"><div class="mini" style="margin-bottom:4px">${esc((x.t.bn || x.t.sk).slice(0, 70))}${(x.t.bn || x.t.sk).length > 70 ? '…' : ''}</div>
                <div class="tiny muted">${esc(x.t.sk.split('\n').filter(l => !/উবাচ/.test(l))[0].slice(0, 42))}…</div></div>${ico('arrow', 'sm')}</div>`).join('')
            : `<div class="card empty"><div class="illu">${ico('search')}</div><h5>কিছু পাওয়া যায়নি</h5><p>অন্য শব্দে চেষ্টা করুন — যেমন “কর্ম”, “ভক্তি”, “আত্মা”।</p></div>`}`
          : `<div class="sect"><h4>১৮ অধ্যায়</h4><div class="line"></div><span class="mini muted">শ্লোক সংখ্যা</span></div>
          ${meta.map(m => {
            const doneCh = b.texts.filter(t => t.ch === m.n && t.bn).length;
            const kathCh = b.texts.filter(t => t.ch === m.n && t.katha).length;
            const all = kathCh === m.count;
            return `<div class="card rowcard stack" data-act="nav" data-to="#/gita/${m.n}" role="button" tabindex="0" style="cursor:pointer">
              <div class="datebox" style="width:44px;height:48px"><b>${bn(m.n)}</b><i>অধ্যায়</i></div>
              <div style="flex:1;min-width:0">
                <div class="kv"><span class="ttl" style="font-size:12.6px">${esc(m.name)}</span>
                  <span class="pill ${all ? 'ok' : ''}">${bn(m.count)} শ্লোক</span></div>
                <div class="mini muted" style="margin-top:5px;line-height:1.6">${esc(m.sum.slice(0, 78))}…</div>
                <div class="tiny muted" style="margin-top:5px">${doneCh ? `অনুবাদ ${bn(doneCh)}/${bn(m.count)}` : ''}${kathCh ? ` · কথা ${bn(kathCh)}/${bn(m.count)}` : ''}</div>
              </div>${ico('arrow', 'sm')}</div>`;
          }).join('')}

          <p class="mini muted" style="margin-top:16px;line-height:1.75">মূল সংস্কৃত পাঠ সম্পূর্ণ ও দুই উৎস মিলিয়ে যাচাই করা (৭০১টি শ্লোকের ৬৭৮টি হুবহু মিলেছে; বাকিগুলো ভিন্ন-পাঠ)। শ্লোকগুলো <b>বাংলা লিপিতে</b> দেখা যায় — রিডারে চাইলে দেবনাগরীতেও বদলানো যায়। কোনো সংস্করণে ১৩শ অধ্যায়ে ৩৪, কোনোতে ৩৫ শ্লোক। প্রতিটি শ্লোকের সঙ্গে <b>বাংলা অনুবাদ ও সহজ অর্থ</b> সম্পূর্ণ (৭০১/৭০১)। এর সঙ্গে ধাপে ধাপে যোগ হচ্ছে <b>উদাহরণ-কথা</b> — শাস্ত্রীয় বা বাস্তব জীবনের গল্প, আর তার নীচে <b>জীবনে প্রয়োগ</b>। অনুবাদ ও গল্প সাধারণ পাঠকের জন্য সহজ ভাষায় লেখা; প্রকাশের আগে পণ্ডিত-পর্যালোচনা বাঞ্ছনীয়।</p>`}
      </div><div style="height:20px"></div>`;
    }
  function gitaChapterScreen(nStr) {
      const n = Math.max(1, Math.min(18, parseInt(nStr || '1', 10)));
      const b = GITA_BOOK(); if (!b) return gitaScreen();
      const m = gitaMeta().find(x => x.n === n) || { n, name: 'অধ্যায় ' + n, count: 0, sum: '' };
      const items = b.texts.map((t, i) => ({ t, i })).filter(x => x.t.ch === n);
      const doneCh = items.filter(x => x.t.bn).length;
      const kathCh = items.filter(x => x.t.katha).length;
      return `${appbar(`অধ্যায় ${bn(n)} · ${m.name}`, `${bn(m.count)} শ্লোক · অনুবাদ ${bn(doneCh)} · কথা ${bn(kathCh)}`, '#/gita', true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div class="mini muted">${esc(m.sum)}</div>
          <div class="bar thin mt"><i style="width:${m.count ? Math.round(doneCh / m.count * 100) : 0}%"></i></div>
        </div>
        ${items.map(x => {
          const t = x.t;
          const first = t.sk.split('\n').filter(l => !/উবাচ/.test(l))[0] || t.sk.split('\n')[0];
          return `<div class="card rowcard stack" data-act="nav" data-to="#/reader/gita/${x.i}" role="button" tabindex="0" style="cursor:pointer">
            <div class="datebox" style="width:44px;height:48px"><b>${bn(t.v)}</b><i>শ্লোক</i></div>
            <div style="flex:1;min-width:0">
              <div class="mini" style="color:var(--ink-2);margin-bottom:4px">${esc(first.slice(0, 46))}…</div>
              <div class="tiny muted">${t.bn ? esc(t.bn.slice(0, 60)) + '…' : 'বাংলা অনুবাদ যুক্ত হচ্ছে'}</div>
              <div class="tiny" style="margin-top:5px;display:flex;gap:6px;align-items:center">${spkTag(t.ch, t.v)}</div>
              ${t.katha ? `<div class="tiny" style="margin-top:5px;color:var(--gold-300)">কথা · ${esc(t.ksrc || 'উদাহরণ')}</div>` : ''}
            </div>${ico('arrow', 'sm')}</div>`;
        }).join('')}
        <div style="display:flex;gap:9px;margin-top:14px">
          <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/gita/${n - 1}" ${n === 1 ? 'disabled' : ''}>আগের অধ্যায়</button>
          <button class="btn ghost" style="flex:1" data-act="nav" data-to="#/gita/${n + 1}" ${n === 18 ? 'disabled' : ''}>পরের অধ্যায়</button>
        </div>
      </div><div style="height:20px"></div>`;
    }
