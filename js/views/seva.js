/* ==========================================================================
   ১০. সেবা ও দান
   ফাইল: js/views/seva.js
   ========================================================================== */
  function sevaScreen() {
      const totalRaised = DB.campaigns.reduce((s, c) => s + c.raised + (S.raised[c.id] || 0), 0);
      const totalSpent = Math.round(totalRaised * .93);
      return `${appbar('সেবা ও সহায়তা', 'Seva · স্বচ্ছ দান', undefined, true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div class="kv"><div><div class="mini muted">এই মাসে সংগ্রহ</div>
            <div class="display" style="font-size:20px;color:var(--gold-200);margin-top:3px">৳ ${bnN(totalRaised)}</div></div>
            <div style="text-align:right"><div class="mini muted">সেবায় ব্যয়</div>
              <div class="display" style="font-size:20px;color:var(--ok);margin-top:3px">৳ ${bnN(totalSpent)}</div></div></div>
          <div class="dualbar mt"><i style="width:93%;background:linear-gradient(90deg,#3f8d68,#8fd6b0)"></i><i style="width:7%;background:rgba(215,169,79,.6)"></i></div>
          <div class="kv" style="margin-top:8px"><span class="mini muted">৯৩% সরাসরি সেবা</span><span class="mini muted">৭% অপারেশনাল (ঘোষিত)</span></div>
        </div>

        ${(() => {
          const c = DB.campaigns.find(x => x.id === 'gita');
          if (!c) return '';
          const raised = c.raised + (S.raised[c.id] || 0), pct = Math.min(100, Math.round(raised / c.goal * 100));
          const gitas = Math.round(raised / c.perUnit);
          return `<div class="sect"><h4>গীতা দান</h4><div class="line"></div><span class="mini muted">${bn(gitas)}টি গীতা</span></div>
          <div class="card oath pad stack gita-daan">
            <div class="kv"><div><div class="mini muted">শ্রীমদ্ভগবদ্গীতা · এক ঘরে এক গীতা</div>
              <h5 style="margin-top:4px">৳ ${bn(c.perUnit)} দিয়ে একটি পরিবারে গীতা পৌঁছাবে</h5></div>
              ${ico('book', 'sm')}</div>
            <p class="mini muted" style="margin:8px 0 0;line-height:1.75">${esc(c.blurb)}</p>
            <div class="kv mini muted" style="margin-top:10px"><span>৳ ${bnN(raised)} সংগ্রহ</span><span>লক্ষ্য ৳ ${bnN(c.goal)}</span></div>
            <div class="bar mt"><i style="width:${pct}%"></i></div>
            <div class="kv mini muted" style="margin-top:7px"><span>${bn(pct)}% পূর্ণ</span><span>${bn(Math.max(0, Math.round(c.goal / c.perUnit) - gitas))}টি গীতা বাকি</span></div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
              <button class="btn gold sm" style="flex:1" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit}">১টি গীতা · ৳${bn(c.perUnit)}</button>
              <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 5}">৫টি · ৳${bn(c.perUnit * 5)}</button>
              <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 11}">১১টি · ৳${bn(c.perUnit * 11)}</button>
            </div>
            <div class="mini muted" style="margin-top:9px;text-align:center">প্রতিটি দানের রিসিট ও বিতরণের প্রমাণ অ্যাপে সংরক্ষিত থাকবে</div>
          </div>`;
        })()}

        <div class="sect"><h4>চলমান অভিযান</h4><div class="line"></div></div>
        ${DB.campaigns.filter(c => c.id !== 'gita').map(c => {
        const raised = c.raised + (S.raised[c.id] || 0), pct = Math.min(100, Math.round(raised / c.goal * 100));
        return `<div class="card pad campaign stack">
            <div class="kv"><h5>${esc(c.title)}</h5><span class="pill ok">${bn(pct)}%</span></div>
            <p>${esc(c.blurb)}</p>
            <div class="kv mini muted"><span>৳ ${bnN(raised)} সংগ্রহ</span><span>লক্ষ্য ৳ ${bnN(c.goal)}</span></div>
            <div class="bar mt"><i style="width:${pct}%"></i></div>
            <div style="display:flex;gap:8px;margin-top:11px">
              <button class="btn gold sm" style="flex:1" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit}">৳ ${bn(c.perUnit)} — ${esc(c.unit)}</button>
              <button class="btn ghost sm" data-act="donate" data-id="${c.id}" data-amt="${c.perUnit * 5}">৳ ${bn(c.perUnit * 5)}</button>
            </div>
          </div>`;
      }).join('')}
        ${S.orders.filter(o => o.kind === 'donation').length ? `<div class="sect"><h4>আপনার দান</h4><div class="line"></div></div>
          <div class="card pad">${S.orders.filter(o => o.kind === 'donation').slice(-4).reverse().map(o => `
            <div class="ledger"><span>${esc(o.title)}</span><span>৳ ${bnN(o.amount)}</span></div>`).join('')}</div>` : ''}

        <div class="card pad mt" style="background:var(--glass)">
          <div class="kv"><b style="font-size:12.5px">স্বচ্ছতার প্রতিশ্রুতি</b>${ico('shield', 'sm')}</div>
          <p class="mini muted" style="margin:8px 0 0;line-height:1.7">প্রতিটি দানের রিসিট ও ব্যয়ের প্রমাণ প্রকাশ্যে থাকবে। দানের টাকা প্লাটফর্মের খরচে ব্যবহার হবে না — আলাদা ট্রাস্ট অ্যাকাউন্ট।</p>
        </div>
      </div><div style="height:20px"></div>`;
    }
