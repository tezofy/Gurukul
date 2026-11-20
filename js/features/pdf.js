/* ==========================================================================
   ১৯. PDF গ্রন্থাগার ও রিডার
   ফাইল: js/features/pdf.js
   ========================================================================== */
  const PDFVIEW = { doc: null, num: 1, scale: 1, fit: 1, key: '', task: null, renderTask: null, lib: null };
  function pdfStore() { return S.pdfBooks || (S.pdfBooks = []); }
  const PDFDB = { db: null };
  function pdfDb() {
      if (PDFDB.db) return Promise.resolve(PDFDB.db);
      return new Promise((res, rej) => {
        if (!('indexedDB' in window)) return rej(new Error('no-idb'));
        const rq = indexedDB.open('svp-pdf', 1);
        rq.onupgradeneeded = () => { const db = rq.result; if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' }); };
        rq.onsuccess = () => { PDFDB.db = rq.result; res(rq.result); };
        rq.onerror = () => rej(rq.error);
      });
    }
  async function pdfPut(key, bytes, title) {
      const db = await pdfDb();
      return new Promise((res, rej) => {
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').put({ key, title, bytes });
        tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error);
      });
    }
  async function pdfGet(key) {
      try {
        const db = await pdfDb();
        return await new Promise((res, rej) => {
          const rq = db.transaction('files', 'readonly').objectStore('files').get(key);
          rq.onsuccess = () => res(rq.result ? rq.result.bytes : null);
          rq.onerror = () => rej(rq.error);
        });
      } catch (e) { return null; }
    }
  async function pdfDel(key) {
      try { const db = await pdfDb(); const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').delete(key); } catch (e) { }
    }
  function pdfItems() { return pdfStore().slice().sort((a, b) => (b.at || 0) - (a.at || 0)); }
  const isCustomPdf = id => id === 'custom';
  function pdfLibraryScreen() {
      const items = pdfItems();
      const db = (typeof DB !== 'undefined' && DB.books) || [];
      return `${appbar('PDF গ্রন্থাগার', 'নিজের বই নিজের কাছে — অফলাইনেও পড়ুন', undefined, true)}
      <div class="pad" style="padding-top:0">
        <div class="search">${ico('search', 'sm')}<input id="pdfQ" placeholder="PDF বই খুঁজুন…" aria-label="PDF বই খুঁজুন"/></div>
        <label class="pdf-add">
          <input type="file" id="pdfFile" accept="application/pdf,.pdf" multiple hidden/>
          <span class="pdf-add-ico">＋</span>
          <span class="pdf-add-tx"><b>নিজের PDF যোগ করুন</b><i>ফোনের ফাইল থেকে বেছে নিন বা শেয়ার করুন — বইটি এই ডিভাইসেই থাকে</i></span>
        </label>
        <p class="mini muted" style="margin:8px 2px 0;line-height:1.7">আপনার PDF কোথাও আপলোড হয় না — শুধু এই ব্রাউজারে/ডিভাইসে সংরক্ষিত থাকে, তাই ইন্টারনেট ছাড়াও পড়া যায়।</p>
      </div>
      <div class="sect"><h4>সংরক্ষিত বই</h4><div class="line"></div><span class="mini muted">${bn(items.length)}টি</span></div>
      <div class="pad" id="pdfList" style="padding-top:0">
        ${items.length ? items.map(b => `<div class="card rowcard pdf-row" data-pdf-key="${esc(b.key)}">
          <div class="pdf-thumb" data-pdf-thumb="${esc(b.key)}">${b.pages ? '<b>PDF</b>' : ico('book', 'sm')}</div>
          <div style="flex:1;min-width:0">
            <div class="ttl" style="font-size:.92rem;line-height:1.45">${esc(b.title)}</div>
            <div class="mini muted" style="margin-top:4px">${b.pages ? bn(b.pages) + ' পৃষ্ঠা · ' : ''}${esc(b.author || 'নিজের যোগ করা')}</div>
            <div class="pdf-mini"><i style="width:${b.pages ? Math.min(100, Math.round(((b.page || 1) / b.pages) * 100)) : 0}%"></i></div>
            <div class="tiny muted" style="margin-top:3px">${b.pages ? bn(b.page || 1) + '/' + bn(b.pages) + ' পৃষ্ঠা' : 'খুললে লোড হবে'}${b.size ? ' · ' + (b.size > 1048576 ? (Math.round(b.size / 104857.6) / 10) + ' MB' : Math.round(b.size / 1024) + ' KB') : ''}</div>
          </div>
          <div class="pdf-row-act">
            <button class="btn gold sm" data-act="pdfOpen" data-key="${esc(b.key)}">পড়ুন</button>
            <button class="cbtn" data-act="pdfRemove" data-key="${esc(b.key)}" aria-label="${esc(b.title)} সরান">✕</button>
          </div>
        </div>`).join('') : `<div class="card pad" style="text-align:center;padding:22px 16px"><div style="font-size:28px">📖</div><b style="display:block;margin:8px 0 6px">এখনও কোনো PDF বই নেই</b><p class="mini muted" style="margin:0;line-height:1.75">উপরের “নিজের PDF যোগ করুন” চেপে ফোন/ল্যাপটপ থেকে বই বেছে নিন। যোগ করা বই এখানেই থেকে যাবে।</p></div>`}
      </div>
      <div class="sect"><h4>অ্যাপের গ্রন্থ</h4><div class="line"></div></div>
      <div class="pad" style="padding-top:0">
        ${(db || []).slice(0, 6).map(b => `<button class="card rowcard" style="width:100%;text-align:left" data-act="nav" data-to="#/book/${b.id}">
          <div class="cover ${b.cls}" style="width:40px;height:54px"><span class="sym" style="font-size:17px">${b.sym || '॥'}</span></div>
          <div style="flex:1;min-width:0"><div class="ttl" style="font-size:.9rem">${esc(b.title)}</div><div class="mini muted" style="margin-top:4px">${esc(b.author || '')}</div></div>
          ${ico('arrow', 'sm')}</button>`).join('')}
      </div><div style="height:20px"></div>`;
    }
  function pdfReaderScreen(arg) {
      const key = (arg && decodeURIComponent(arg)) || '';
      const b = pdfStore().find(x => x.key === key) || pdfStore()[0];
      if (!b) return `${appbar('PDF পাঠ', '', '#/library/pdf')}<div class="pad"><div class="card pad">কোনো বই পাওয়া যায়নি। <button class="btn ghost sm" data-act="nav" data-to="#/library/pdf">গ্রন্থাগারে যান</button></div></div>`;
      PDFVIEW.key = b.key;
      PDFVIEW.num = Math.max(1, b.page || 1);
      return `${appbar(b.title, esc(b.author || 'PDF গ্রন্থ'), '#/library/pdf')}
      <div class="pdf-wrap">
        <div class="pdf-ctl">
          <button class="cbtn" data-act="pdfPage" data-d="-1" aria-label="আগের পৃষ্ঠা">‹</button>
          <span class="pdf-pg"><b id="pdfPageNo">${bn(PDFVIEW.num)}</b> / <span id="pdfPageCount">…</span></span>
          <button class="cbtn" data-act="pdfPage" data-d="1" aria-label="পরের পৃষ্ঠা">›</button>
          <span class="pdf-sp"></span>
          <button class="cbtn" data-act="pdfZoom" data-d="-1" aria-label="ছোট">A−</button>
          <button class="cbtn" data-act="pdfZoom" data-d="1" aria-label="বড়">A+</button>
          <button class="cbtn" data-act="pdfWidth" aria-label="পৃষ্ঠার প্রস্থে মাপ">⤢</button>
          <button class="cbtn" data-act="pdfSave" aria-label="পৃষ্ঠা সেভ করুন">🔖</button>
        </div>
        <div class="pdf-stage" id="pdfStage" tabindex="0" aria-label="PDF পৃষ্ঠা">
          <div class="pdf-loading" id="pdfLoading">PDF খোলা হচ্ছে…</div>
          <canvas id="pdfCanvas"></canvas>
        </div>
        <div class="pdf-foot"><span id="pdfTitleFoot">${esc(b.title)}</span><span id="pdfPct">${b.pages ? bn(Math.min(100, Math.round((PDFVIEW.num / b.pages) * 100))) + '%' : ''}</span></div>
      </div>`;
    }
  async function pdfEnsureLib() {
      if (PDFVIEW.lib) return PDFVIEW.lib;
      const lib = await import('../vendor/pdfjs/pdf.min.mjs');
      lib.GlobalWorkerOptions.workerSrc = '../vendor/pdfjs/pdf.worker.min.mjs';
      PDFVIEW.lib = lib;
      return lib;
    }
  async function pdfLoadDoc(key) {
      const b = pdfStore().find(x => x.key === key) || pdfStore()[0];
      if (!b) return null;
      if (PDFVIEW.docKey === b.key && PDFVIEW.doc) return PDFVIEW.doc;
      const lib = await pdfEnsureLib();
      PDFVIEW.bytes = PDFVIEW.bytes || {};
      let data = PDFVIEW.bytes[b.key];
      if (!data) { data = await pdfGet(b.key); if (data) PDFVIEW.bytes[b.key] = data; }
      if (!data) return null;
      /* ওয়ার্কারে পাঠানোর সময় বাফার সরে যায় — তাই কপি পাঠাই */
      PDFVIEW.doc = await lib.getDocument({ data: new Uint8Array(data).slice(), cMapUrl: '../vendor/pdfjs/cmaps/', cMapPacked: true }).promise;
      PDFVIEW.docKey = b.key;
      PDFVIEW.num = Math.max(1, Math.min(b.page || 1, PDFVIEW.doc.numPages));
      const rec = pdfStore().find(x => x.key === b.key);
      if (rec && rec.pages !== PDFVIEW.doc.numPages) { rec.pages = PDFVIEW.doc.numPages; save('pdfBooks'); }
      return PDFVIEW.doc;
    }
  async function pdfRender(num) {
      const stage = document.getElementById('pdfStage');
      if (!stage) return;
      const doc = await pdfLoadDoc(PDFVIEW.key);
      if (!doc) { const l = document.getElementById('pdfLoading'); if (l) l.textContent = 'ফাইল পাওয়া যায়নি — আবার যোগ করুন।'; return; }
      PDFVIEW.num = Math.max(1, Math.min(num, doc.numPages));
      const page = await doc.getPage(PDFVIEW.num);
      const cv = document.getElementById('pdfCanvas');
      if (!cv) return;
      const base = page.getViewport({ scale: 1 });
      const availW = Math.max(240, stage.clientWidth - 16);
      PDFVIEW.fit = availW / base.width;
      const vp = page.getViewport({ scale: PDFVIEW.fit * PDFVIEW.scale * (window.devicePixelRatio || 1) });
      const ctx = cv.getContext('2d');
      cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
      cv.style.width = Math.round(vp.width / (window.devicePixelRatio || 1)) + 'px';
      cv.style.height = Math.round(vp.height / (window.devicePixelRatio || 1)) + 'px';
      try { if (PDFVIEW.task) PDFVIEW.task.cancel(); } catch (e) { }
      PDFVIEW.task = page.render({ canvasContext: ctx, viewport: vp });
      try { await PDFVIEW.task.promise; } catch (e) { if (e && e.name === 'RenderingCancelledException') return; }
      const l = document.getElementById('pdfLoading'); if (l) l.remove();
      const pn = document.getElementById('pdfPageNo'); if (pn) pn.textContent = bn(PDFVIEW.num);
      const pc = document.getElementById('pdfPageCount'); if (pc) pc.textContent = bn(doc.numPages);
      const pct = document.getElementById('pdfPct'); if (pct) pct.textContent = bn(Math.min(100, Math.round((PDFVIEW.num / doc.numPages) * 100))) + '%';
      /* শেষ পঠিত পৃষ্ঠা মনে রাখা */
      const b = pdfStore().find(x => x.key === PDFVIEW.key);
      if (b) { b.page = PDFVIEW.num; b.at = Date.now(); b.pages = doc.numPages; save('pdfBooks'); }
      S.read['pdf:' + PDFVIEW.key + ':' + PDFVIEW.num] = 1; save('read');
    }
  function pdfBoot() {
      const stage = document.getElementById('pdfStage');
      if (!stage || !PDFVIEW.key) return;
      const start = PDFVIEW.num;
      pdfRender(start).catch(err => {
        const l = document.getElementById('pdfLoading');
        if (l) l.textContent = 'PDF খোলা যায়নি — ফাইলটি আবার যোগ করুন।';
        try { console.error(err); } catch (e) { }
      });
    }
  async function pdfAddFiles(files) {
      const list = [...(files || [])].filter(f => /\.pdf$/i.test(f.name) || f.type === 'application/pdf');
      if (!list.length) return toast('PDF ফাইল বেছে নিন');
      PDFVIEW.bytes = PDFVIEW.bytes || {};
      let n = 0;
      for (const f of list) {
        const key = 'p' + Date.now().toString(36) + n;
        const bytes = new Uint8Array(await f.arrayBuffer());
        const title = f.name.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim() || 'PDF বই';
        PDFVIEW.bytes[key] = bytes;
        try { await pdfPut(key, bytes, title); } catch (e) { }
        pdfStore().unshift({ key, title, author: 'নিজের যোগ করা', size: f.size, pages: 0, page: 1, at: Date.now() });
        n++;
      }
      save('pdfBooks');
      toast(bn(n) + 'টি PDF যোগ হয়েছে ✓');
      render();
      setTimeout(() => {
        const first = pdfStore()[0];
        if (first) { U.pdfQ = ''; location.hash = '#/library/pdf/' + encodeURIComponent(first.key); render(); }
      }, 120);
    }
  function pdfRemove(key) {
      const b = pdfStore().find(x => x.key === key);
      if (!b) return;
      if (!confirm('“' + b.title + '” গ্রন্থাগার থেকে সরাবেন?')) return;
      S.pdfBooks = pdfStore().filter(x => x.key !== key);
      if (PDFVIEW.bytes) delete PDFVIEW.bytes[key];
      pdfDel(key);
      if (PDFVIEW.docKey === key) { PDFVIEW.doc = null; PDFVIEW.docKey = ''; }
      save('pdfBooks'); toast('সরানো হয়েছে'); render();
    }
