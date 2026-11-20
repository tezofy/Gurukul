/* ==========================================================================
   ৬. পূজা পেজ (দেবদেবীর কার্ডের তালিকা)
   ফাইল: js/views/puja.js
   ========================================================================== */
  function pujaScreen() {
      return `${appbar('পূজা ও নিত্যকর্ম', 'Achar Guide')}
      <div class="pad" style="padding-top:0">
        ${DB.pujas.map(p => {
        const done = (S.puja[p.id + ':' + TODAY_KEY] || []).length;
        const pct = Math.round(done / p.steps.length * 100);
        return `<div class="card pad stack" data-act="nav" data-to="#/puja/${p.id}" role="button" tabindex="0" style="cursor:pointer">
            <div style="display:flex;gap:13px;align-items:center">
              <div style="width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--glass);border:1px solid var(--card-border);color:var(--gold-300)">${ico('flame')}</div>
              <div style="flex:1">
                <div class="kv"><span class="ttl" style="font-family:var(--f-dis);font-size:14px">${esc(p.title)}</span><span class="pill">${pct ? bn(pct) + '%' : bn(p.mins) + ' মিনিট'}</span></div>
                <div class="mini muted" style="margin-top:4px">${esc(p.time)} · ${bn(p.steps.length)} ধাপ</div>
              </div>
            </div>
            <p class="tiny muted" style="margin:10px 0 8px;line-height:1.7">${esc(p.summary)}</p>
            <div class="bar thin"><i style="width:${pct}%"></i></div>
          </div>`;
      }).join('')}
        <div class="sect"><h4>দেবদেবীর পূজা · ধাপে ধাপে</h4><div class="line"></div>
          <span class="mini muted">${bn(DEVA.length)} দেবতা</span></div>
        <p class="mini muted" style="line-height:1.75;margin:0 0 10px">
          ঘরে বসে ভাচুর্য়াল উপকরণে পূজা — প্রদীপ, ধূপ, অগরবাতি, ফুল, বেলপাতা, নৈবেদ্য,
          পঞ্চপ্রদীপ ও ঘণ্টা। প্রতিটি ধাপে মন্ত্র ও কী করতে হবে তা লেখা।</p>
        ${devaGrid()}
      </div><div style="height:20px"></div>`;
    }
