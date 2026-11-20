/* ==========================================================================
   ১১. সেবা ও কাজ (প্রোভাইডার)
   ফাইল: js/views/market.js
   ========================================================================== */
  function providerCards() {
      const q = U.marketQ.trim().toLowerCase();
      const all = (S.provider ? [{ ...S.provider, mine: true }] : []).concat(DB.providers);
      const list = all.filter(p => (U.marketCat === 'সব' || p.cat === U.marketCat) &&
        (!q || (p.name + p.role).toLowerCase().includes(q)));
      if (!list.length) return `<div class="card empty"><div class="illu">${ico('bag')}</div><h5>এই বিভাগে কেউ নেই</h5><p>অন্য বিভাগ বেছে নিন, অথবা নিজেই প্রোফাইল খুলুন।</p></div>`;
      return list.map(p => `<div class="card provider">
        <div class="av">${esc(p.ini || p.name.slice(0, 1))}</div>
        <div style="flex:1;min-width:0">
          <h5>${esc(p.name)} ${p.mine ? '<span class="pill">আপনি</span>' : '<span class="badge-v">✓</span>'}</h5>
          <div class="role">${esc(p.role)}</div>
          <div class="kv"><span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))} <span class="mini muted">${bn(p.rating)} (${bn(p.reviews || 0)})</span></span>
            <b style="font-size:12.5px;color:var(--gold-200)">৳ ${bnN(p.rate)}/${esc(p.rateLabel || 'কাজ')}</b></div>
          <button class="btn ghost sm mt" data-act="order" data-id="${p.id}">বুক করুন · এসক্রো সুরক্ষা</button>
        </div></div>`).join('');
    }
  function marketScreen() {
      const cats = ['সব', 'টিউটর', 'পুরোহিত', 'গ্রাফিক্স', 'কথক'];
      return `${appbar('সেবা ও কাজ', 'Skills · Income')}
      <div class="pad" style="padding-top:0">
        <div class="search">${ico('search', 'sm')}<input id="marketSearch" placeholder="টিউটর, পুরোহিত, ডিজাইনার…" value="${esc(U.marketQ)}" aria-label="সেবা খুঁজুন"/></div>
        <div class="tiny muted" style="margin-top:9px">ভেরিফায়েড প্রোভাইডার · ১২% প্ল্যাটফর্ম ফি · পেআউট প্রতি রবিবার</div>
      </div>
      <div class="cats">${cats.map(c => `<button class="chip ${U.marketCat === c ? 'on' : ''}" data-act="mcat" data-c="${c}">${c}</button>`).join('')}</div>
      <div class="pad" style="padding-top:12px">
        <div id="marketList">${providerCards()}</div>
        <div class="card oath pad">
          <div class="kv"><b style="font-size:12.8px">আপনার দক্ষতা দিয়ে আয় করুন</b>${ico('wallet', 'sm')}</div>
          <p class="mini muted" style="margin:7px 0 11px;line-height:1.65">শিক্ষক, ডিজাইনার, লেখক, কথক — প্রোফাইল খুলে কাজ নিন। ৮৫% আপনার শেয়ার।</p>
          ${S.provider
          ? `<div class="mini">প্রোফাইল সক্রিয়: <b>${esc(S.provider.name)}</b> · ${esc(S.provider.cat)} · ৳${bnN(S.provider.rate)}</div>
               <button class="btn ghost sm mt" data-act="myProfile">আয়ের হিসাব দেখুন</button>`
          : `<button class="btn gold block sm" data-act="providerForm">প্রোফাইল খুলুন</button>`}
        </div>
        ${S.orders.filter(o => o.kind === 'service').length ? `<div class="sect"><h4>আপনার অর্ডার</h4><div class="line"></div></div>
          <div class="card pad">${S.orders.filter(o => o.kind === 'service').slice(-4).reverse().map(o => `
            <div class="ledger"><span>${esc(o.title)}</span><span>৳ ${bnN(o.amount)} · ${o.status}</span></div>`).join('')}</div>` : ''}
      </div><div style="height:20px"></div>`;
    }
