/* ==========================================================================
   ১৪. ব্যবহারকারী ব্যবস্থাপনা (অ্যাডমিন)
   ফাইল: js/views/manage.js
   ========================================================================== */
  const ROLES = [
      { id: 'student', label: 'শিক্ষার্থী', icon: 'user' },
      { id: 'parent', label: 'অভিভাবক', icon: 'heart' },
      { id: 'teacher', label: 'শিক্ষক', icon: 'book' },
      { id: 'reviewer', label: 'পর্যালোচক', icon: 'shield' },
      { id: 'admin', label: 'অ্যাডমিন', icon: 'gear' }
    ];
  const roleLabel = id => (ROLES.find(r => r.id === id) || ROLES[0]).label;
  const uStatus = u => S.userState[u.id] || u.status;
  const statusPill = st => st === 'active' ? '<span class="pill ok">সক্রিয়</span>'
      : st === 'pending' ? '<span class="pill">অপেক্ষমাণ</span>'
        : '<span class="pill" style="color:var(--danger);border-color:rgba(224,114,106,.45)">স্থগিত</span>';
  function logAction(text) {
      S.audit.unshift({ text, at: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) });
      S.audit = S.audit.slice(0, 12); save('audit');
    }
  function roleSwitch() {
      return `<div class="card pad" style="padding:12px">
        <div class="kv" style="margin-bottom:9px"><b style="font-size:12px">ভূমিকা (রোল) বদলে দেখুন</b>
          <span class="mini muted">ডেমো</span></div>
        <div class="cats" style="padding:0;gap:6px">
          ${ROLES.map(r => `<button class="chip ${S.role === r.id ? 'on' : ''}" data-act="setRole" data-r="${r.id}">${r.label}</button>`).join('')}
        </div>
        <div class="mini muted" style="margin-top:9px;line-height:1.6">বর্তমানে আপনি <b>${roleLabel(S.role)}</b> হিসেবে আছেন — এই ভূমিকা অনুযায়ী স্ক্রিন ও অনুমতি বদলাবে।</div>
      </div>`;
    }
  function rolePanel() {
      if (S.role === 'parent') {
        return `<div class="card oath pad">
          <div class="kv"><b style="font-size:12.8px">আমার সন্তান</b><button class="act" data-act="addChild">+ যোগ করুন</button></div>
          ${S.children.map((c, i) => `<div class="li">
            <div class="av round">${esc(c.n.slice(0, 1))}</div>
            <div style="flex:1">
              <div style="font-size:12.5px;font-weight:600">${esc(c.n)} <span class="mini muted">· ${esc(c.cls)}</span></div>
              <div class="bar thin" style="margin-top:6px"><i style="width:${c.pct}%"></i></div>
              <div class="mini muted" style="margin-top:5px">শাস্ত্র পাঠ ${bn(c.pct)}% · সাপ্তাহিক কুইজে অংশ নিয়েছে</div>
            </div>
            <button class="iconbtn" data-act="toast" data-msg="${esc(c.n)}-এর রিপোর্ট কার্ড শীঘ্রই">${ico('arrow', 'sm')}</button>
          </div>`).join('')}
          <div class="mini muted" style="margin-top:10px;line-height:1.6">অভিভাবক হিসেবে আপনি সন্তানের অগ্রগতি দেখতে পাবেন — তার পাসওয়ার্ড বা ব্যক্তিগত চ্যাট নয়।</div>
        </div>`;
      }
      if (S.role === 'teacher') {
        const earn = S.orders.filter(o => o.kind === 'service').reduce((a, o) => a + o.amount, 0);
        return `<div class="card oath pad">
          <div class="kv"><b style="font-size:12.8px">শিক্ষক প্যানেল</b><span class="pill ok">যাচাইকৃত</span></div>
          <div class="grid3 mt">
            <div class="stat"><div class="k">শিক্ষার্থী</div><div class="v">${bn(24)}</div></div>
            <div class="stat"><div class="k">চলমান কোর্স</div><div class="v">${bn(3)}</div></div>
            <div class="stat"><div class="k">এই মাসের আয়</div><div class="v">৳ ${bnN(12450)}</div></div>
          </div>
          <div class="li" style="margin-top:4px"><div class="av round">আ</div>
            <div style="flex:1"><div style="font-size:12.5px">আরাধ্যা — গীতা ২.৪৭</div><div class="mini muted">২ দিন আগে · অগ্রগতি ৪৫%</div></div>
            <span class="pill">ফিডব্যাক দিন</span></div>
          <div class="li"><div class="av round">ঈ</div>
            <div style="flex:1"><div style="font-size:12.5px">ঈশান — নিত্যকর্ম লেসন ৪</div><div class="mini muted">আজ · ৭২%</div></div>
            <span class="pill ok">সম্পূর্ণ</span></div>
          <button class="btn ghost block sm mt" data-act="nav" data-to="#/courses">আমার কোর্স দেখুন</button>
        </div>`;
      }
      if (S.role === 'reviewer') {
        return `<div class="card oath pad">
          <div class="kv"><b style="font-size:12.8px">পর্যালোচনা কিউ</b><span class="pill">${bn(DB.reports.length)} টি</span></div>
          <p class="mini muted" style="margin:8px 0 10px;line-height:1.6">শাস্ত্রীয় নির্ভুলতা ও নীতিমালা — অনুমোদনের আগে দুইজন পর্যালোচকের সম্মতি লাগবে।</p>
          <button class="btn ghost block sm" data-act="nav" data-to="#/manage">মডারেশন কিউ খুলুন</button>
        </div>`;
      }
      if (S.role === 'admin') {
        return `<div class="card oath pad">
          <div class="kv"><b style="font-size:12.8px">অ্যাডমিন সারসংক্ষেপ</b><span class="pill ok">পূর্ণ অনুমতি</span></div>
          <div class="grid3 mt">
            <div class="stat"><div class="k">ব্যবহারকারী</div><div class="v">${bn(DB.users.length)}</div></div>
            <div class="stat"><div class="k">যাচাই বাকি</div><div class="v">${bn(DB.applications.filter(a => !S.appState[a.id]).length)}</div></div>
            <div class="stat"><div class="k">রিপোর্ট</div><div class="v">${bn(DB.reports.filter(r => !S.reportState[r.id]).length)}</div></div>
          </div>
          <button class="btn gold block sm mt" data-act="nav" data-to="#/manage">ম্যানেজমেন্ট প্যানেল</button>
        </div>`;
      }
      return `<div class="card pad">
        <div class="kv"><b style="font-size:12.8px">আমার শিক্ষা-প্রোফাইল</b><span class="pill">শিক্ষার্থী</span></div>
        <p class="mini muted" style="margin:8px 0 0;line-height:1.7">পাঠ, কুইজ ও কোর্সের অগ্রগতি নিচে দেখুন। অভিভাবক লিংক বা শিক্ষক-অনুমতি দরকার হলে প্রোফাইল থেকে যোগ করুন।</p>
      </div>`;
    }
  function manageScreen() {
      if (S.role !== 'admin' && S.role !== 'reviewer') {
        return `${appbar('ম্যানেজমেন্ট', 'User Management')}
        <div class="pad"><div class="card oath empty" style="margin-top:6px">
          <div class="illu">${ico('shield')}</div>
          <h5>শুধু অনুমোদিত ভূমিকার জন্য</h5>
          <p>এই প্যানেলে পৌঁছাতে অ্যাডমিন বা পর্যালোচক হতে হবে।<br/>ডেমোতে ভূমিকা বদলে দেখতে পারেন।</p>
          <button class="btn gold sm" data-act="setRole" data-r="admin">অ্যাডমিন হিসেবে দেখুন</button>
        </div>
        <div class="mt">${roleSwitch()}</div></div>`;
      }
      const tabs = [['users', 'ব্যবহারকারী'], ['verify', 'যাচাই'], ['moderation', 'মডারেশন'], ['payouts', 'পেআউট'], ['audit', 'লগ']];
      let body = '';

      if (U.adminTab === 'users') {
        const q = U.adminQ.trim().toLowerCase();
        const list = DB.users.filter(u => !q || (u.name + u.role + u.city).toLowerCase().includes(q));
        const counts = { active: 0, pending: 0, suspended: 0 };
        DB.users.forEach(u => { counts[uStatus(u)] = (counts[uStatus(u)] || 0) + 1; });
        body = `<div class="grid3">
            <div class="stat"><div class="k">সক্রিয়</div><div class="v">${bn(counts.active)}</div></div>
            <div class="stat"><div class="k">অপেক্ষমাণ</div><div class="v">${bn(counts.pending)}</div></div>
            <div class="stat"><div class="k">স্থগিত</div><div class="v">${bn(counts.suspended)}</div></div>
          </div>
          <div class="search mt">${ico('search', 'sm')}<input id="adminSearch" placeholder="নাম, ভূমিকা বা শহর…" value="${esc(U.adminQ)}" aria-label="ব্যবহারকারী খুঁজুন"/></div>
          <div class="mt">${list.map(u => {
          const st = uStatus(u);
          return `<div class="card pad stack">
              <div style="display:flex;gap:11px;align-items:center">
                <div class="av">${esc(u.name.slice(0, 1))}</div>
                <div style="flex:1;min-width:0">
                  <div class="kv"><b style="font-size:12.8px">${esc(u.name)}</b>${statusPill(st)}</div>
                  <div class="mini muted" style="margin-top:3px">${esc(u.role)} · ${esc(u.city)} · যোগ ${esc(u.joined)}</div>
                </div>
              </div>
              <div style="display:flex;gap:7px;margin-top:10px">
                ${st !== 'active' ? `<button class="btn ghost sm" style="flex:1" data-act="uStatus" data-id="${u.id}" data-v="active">${st === 'pending' ? 'অনুমোদন' : 'পুনর্বহাল'}</button>` : ''}
                ${st !== 'suspended' ? `<button class="btn ghost sm" style="flex:1;color:var(--danger)" data-act="uStatus" data-id="${u.id}" data-v="suspended">স্থগিত</button>` : ''}
                <button class="btn ghost sm" data-act="toast" data-msg="${esc(u.name)}-কে বার্তা পাঠানো হবে (ডেমো)">বার্তা</button>
              </div>
            </div>`;
        }).join('')}</div>`;
      }

      if (U.adminTab === 'verify') {
        body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">শিক্ষক/কথক হিসেবে যোগ দিতে আবেদন — NID ও যোগ্যতার প্রমাণ যাচাই করে অনুমোদন দিন।</p>
          ${DB.applications.map(a => {
          const st = S.appState[a.id];
          return `<div class="card pad stack">
              <div class="kv"><b style="font-size:12.8px">${esc(a.name)}</b>
                ${st === 'approved' ? '<span class="pill ok">অনুমোদিত</span>' : st === 'rejected' ? '<span class="pill" style="color:var(--danger)">বাতিল</span>' : '<span class="pill">অপেক্ষমাণ</span>'}</div>
              <div class="mini muted" style="margin:4px 0 8px">${esc(a.type)} · ${esc(a.subject)} · ${esc(a.at)}</div>
              <div class="mini" style="color:var(--ok)">${esc(a.docs)}</div>
              ${!st ? `<div style="display:flex;gap:7px;margin-top:10px">
                <button class="btn gold sm" style="flex:1" data-act="appDecide" data-id="${a.id}" data-v="approved">অনুমোদন</button>
                <button class="btn ghost sm" style="flex:1" data-act="appDecide" data-id="${a.id}" data-v="rejected">বাতিল</button></div>` : ''}
            </div>`;
        }).join('')}`;
      }

      if (U.adminTab === 'moderation') {
        body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">নীতিমালা অনুযায়ী রিপোর্ট — ভয়/অলৌকিক প্রতিশ্রুতি, অন্য সম্প্রদায় নিয়ে অবমাননা, আর্থিক অনিয়ম।</p>
          ${DB.reports.map(r => {
          const st = S.reportState[r.id];
          return `<div class="card pad stack">
              <div class="kv"><b style="font-size:12.8px">${esc(r.kind)} · ${esc(r.target)}</b>
                ${st ? '<span class="pill ok">নিষ্পত্তি</span>' : '<span class="pill">খোলা</span>'}</div>
              <div class="tiny muted" style="margin:6px 0 8px;line-height:1.65">${esc(r.text)}</div>
              <div class="mini muted">${esc(r.by)}</div>
              ${!st ? `<div style="display:flex;gap:7px;margin-top:10px">
                <button class="btn gold sm" style="flex:1" data-act="repDecide" data-id="${r.id}" data-v="actioned">কনটেন্ট সরান</button>
                <button class="btn ghost sm" style="flex:1" data-act="repDecide" data-id="${r.id}" data-v="dismissed">রিপোর্ট খারিজ</button></div>` : ''}
            </div>`;
        }).join('')}`;
      }

      if (U.adminTab === 'payouts') {
        body = `<p class="mini muted" style="margin:6px 0 12px;line-height:1.7">দ্বৈত নিয়ন্ত্রণ: প্রতিটি পেআউটে <b>দুইজন</b> অনুমোদনকারীর সম্মতি লাগবে।</p>
          ${DB.payouts.map(p => {
          const n = S.payoutAppr[p.id] !== undefined ? S.payoutAppr[p.id] : p.approvals;
          const done = n >= 2;
          return `<div class="card pad stack">
              <div class="kv"><b style="font-size:12.8px">${esc(p.provider)}</b>
                <span class="pill ${done ? 'ok' : ''}">${done ? 'রিলিজ হয়েছে' : bn(n) + '/২ অনুমোদন'}</span></div>
              <div class="kv" style="margin-top:6px"><span class="mini muted">${esc(p.method)}</span>
                <b style="font-size:13px;color:var(--gold-200)">৳ ${bnN(p.amount)}</b></div>
              <div class="bar thin" style="margin-top:9px"><i style="width:${Math.min(100, n / 2 * 100)}%"></i></div>
              ${!done ? `<button class="btn gold block sm mt" data-act="payoutAppr" data-id="${p.id}">আমি অনুমোদন করছি</button>` : ''}
            </div>`;
        }).join('')}`;
      }

      if (U.adminTab === 'audit') {
        body = S.audit.length ? `<div class="card pad">${S.audit.map(a =>
          `<div class="ledger"><span>${esc(a.text)}</span><span class="mini muted">${esc(a.at)}</span></div>`).join('')}</div>`
          : `<div class="card empty"><div class="illu">${ico('clock')}</div><h5>এখনো কোনো লগ নেই</h5><p>যেকোনো অনুমোদন/স্থগিত করার পর এখানে অডিট লগ দেখা যাবে।</p></div>`;
      }

      return `${appbar('ব্যবহারকারী ব্যবস্থাপনা', 'User Management · ' + roleLabel(S.role), '#/me', true)}
      <div class="pad" style="padding-top:0">
        <div class="segment">${tabs.map(([k, l]) => `<button class="${U.adminTab === k ? 'on' : ''}" data-act="adminTab" data-t="${k}">${l}</button>`).join('')}</div>
        <div class="mt">${body}</div>
      </div><div style="height:22px"></div>`;
    }
