/* ==========================================================================
   ২১. ফাইল-স্টোরেজ পেজ — নিজের PDF · ছবি · গান · ভিডিও
   --------------------------------------------------------------------------
   রুট:   #/storage          (সব ফাইল)
          #/storage/pdf      (শুধু PDF)
          #/storage/image    (শুধু ছবি)
          #/storage/audio    (শুধু গান)
          #/storage/video    (শুধু ভিডিও)
   সংযোগ: MEDIA (js/core/72-media.js) · PDF গ্রন্থাগার · মন্দির-সংগীত (BGM)
   বদলাতে: এই ফাইলে কার্ডের চেহারা/নতুন বিভাগ যোগ করুন।
   ========================================================================== */
function storageScreen(kind) {
  const k = MEDIA.KIND_ORDER.includes(kind) ? kind : 'all';
  const all = MEDIA.list();
  const items = k === 'all' ? all : all.filter(r => r.kind === k);
  const u = MEDIA.usage();
  const tabs = [['all', 'সব']].concat(MEDIA.KIND_ORDER.map(x => [x, MEDIA.KIND_BN[x]]));

  const cardFor = r => {
    const when = new Date(r.at || Date.now());
    const dateTxt = bn(when.getDate()) + ' ' + BN_MONTH[when.getMonth()].slice(0, 4);
    let action = '';
    if (r.kind === 'pdf') action = `<button class="btn gold sm" data-act="mediaOpen" data-key="${r.key}">পড়ুন</button>`;
    else if (r.kind === 'audio') action = `<button class="btn gold sm" data-act="mediaMusic" data-key="${r.key}">সংগীত করুন</button>`;
    else if (r.kind === 'image' || r.kind === 'video') action = `<button class="btn gold sm" data-act="mediaOpen" data-key="${r.key}">দেখুন</button>`;
    return `<div class="card pad stack med-card" data-kind="${r.kind}">
        <div class="kv">
          <div style="display:flex;gap:10px;align-items:center;min-width:0">
            <span class="med-ico">${MEDIA.KIND_ICON[r.kind]}</span>
            <div style="min-width:0">
              <h5 style="margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.title)}</h5>
              <div class="mini muted">${MEDIA.KIND_BN[r.kind]} · ${MEDIA.sizeTxt(r.size || 0)} · ${dateTxt}</div>
            </div>
          </div>
          <span class="pill flat">${MEDIA.KIND_BN[r.kind]}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:9px">
          ${action}
          <button class="btn ghost sm" data-act="mediaRemove" data-key="${r.key}">মুছুন</button>
        </div>
      </div>`;
  };

  return `${appbar('ফাইল স্টোরেজ', 'PDF · ছবি · গান · ভিডিও — সব আপনার ব্রাউজারেই', '#/me')}
    <div class="pad" style="padding-top:0">
      <div class="card pad" style="background:var(--glass)">
        <div class="kv"><div><div class="mini muted">সংরক্ষিত ফাইল</div>
          <div class="display" style="font-size:20px;margin-top:3px">${bn(u.count)} টি</div></div>
          <div style="text-align:right"><div class="mini muted">জায়গা</div>
          <div class="display" style="font-size:16px;margin-top:3px">${MEDIA.sizeTxt(u.bytes)}</div></div></div>
        <label class="btn gold block mt" style="cursor:pointer;text-align:center">
          ＋ ফাইল যোগ করুন (PDF / ছবি / গান / ভিডিও)
          <input type="file" id="medFile" accept=".pdf,application/pdf,image/*,audio/*,video/*" multiple hidden/>
        </label>
        <div class="tiny muted" style="margin-top:8px;line-height:1.7">ফাইলগুলো ফোন/কম্পিউটারের ব্রাউজারে জমা থাকে — কোনো সার্ভারে যায় না। সংগীত বানালে সেটাই ব্যাকগ্রাউন্ডে বাজবে।</div>
      </div>

      <div class="sect"><h4>ধরন</h4><div class="line"></div></div>
      <div class="cchips">${tabs.map(([id, label]) => `<button class="cbtn ${k === id ? 'on' : ''}" data-act="mediaTab" data-k="${id}">${label}${u.by[id] ? ' ' + bn(u.by[id]) : ''}</button>`).join('')}</div>

      <div class="sect"><h4>${k === 'all' ? 'সব ফাইল' : MEDIA.KIND_BN[k]}</h4><div class="line"></div>
        <span class="mini muted">${bn(items.length)} টি</span></div>
      ${items.length ? items.map(cardFor).join('')
        : `<div class="card empty"><div class="illu">${ico('book')}</div><h5>এখনো কিছু নেই</h5>
            <p>উপরের বোতাম থেকে নিজের PDF বই, ছবি, গান বা ভিডিও যোগ করুন।</p></div>`}
    </div><div style="height:20px"></div>`;
}

/* ---- একটি ফাইল খুলে দেখা/শোনা: #/file/<key> ---- */
function mediaViewScreen(key) {
  const rec = MEDIA.readList().find(r => r.key === key);
  if (!rec) return `${appbar('ফাইল', 'পাওয়া যায়নি', '#/storage')}<div class="pad"><div class="card empty"><h5>ফাইলটি নেই</h5><p>মুছে ফেলা হয়েছে বা অন্য ব্রাউজারে যোগ করা হয়েছিল।</p></div></div>`;
  let body = '';
  if (rec.kind === 'pdf') body = `<div class="card pad" style="text-align:center">
      <div class="illu">${ico('book')}</div>
      <h5>${esc(rec.title)}</h5>
      <p class="mini muted">PDF হিসেবে পড়তে লাইব্রেরিতে নিয়ে যান</p>
      <button class="btn gold block mt" data-act="nav" data-to="#/library/pdf">PDF গ্রন্থাগার খুলুন</button></div>`;
  else if (rec.kind === 'image') body = `<div class="card pad" style="text-align:center"><img id="medImg" alt="${esc(rec.title)}" style="max-width:100%;border-radius:12px"/></div>`;
  else if (rec.kind === 'video') body = `<div class="card pad"><video id="medVid" controls playsinline style="width:100%;border-radius:12px"></video></div>`;
  else if (rec.kind === 'audio') body = `<div class="card pad" style="text-align:center"><div class="illu" style="font-size:30px;font-weight:700">গ</div><h5>${esc(rec.title)}</h5>
      <audio id="medAud" controls style="width:100%;margin-top:10px"></audio>
      <button class="btn gold block mt" data-act="mediaMusic" data-key="${rec.key}">এই গানটাই মন্দির-সংগীত করুন</button></div>`;
  else body = `<div class="card pad"><h5>${esc(rec.title)}</h5><p class="mini muted">এই ধরনের ফাইল অ্যাপে খোলা যায় না, তবে সংরক্ষিত আছে।</p></div>`;
  return `${appbar(rec.title, MEDIA.KIND_BN[rec.kind] + ' · ' + MEDIA.sizeTxt(rec.size || 0), '#/storage')}
    <div class="pad" style="padding-top:0">${body}</div><div style="height:20px"></div>`;
}

/* ফাইল-পেজ খোলার পর ঠিকানা (blob URL) বসানো */
function mediaViewBoot() {
  const rec = MEDIA.readList().find(r => r.key === (location.hash.split('/')[2] || ''));
  if (!rec) return;
  MEDIA.url(rec.key).then(u => {
    if (!u) return;
    const img = document.getElementById('medImg'); if (img) img.src = u;
    const vid = document.getElementById('medVid'); if (vid) vid.src = u;
    const aud = document.getElementById('medAud'); if (aud) aud.src = u;
  });
}
