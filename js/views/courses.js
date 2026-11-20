/* ==========================================================================
   ৫. কোর্স · পরীক্ষা · কুইজ · ফলাফল
   ফাইল: js/views/courses.js
   ========================================================================== */
  function coursesScreen() {
      return `${appbar('কোর্স ও পাঠ্যক্রম', 'Pathshala')}
      <div class="pad" style="padding-top:0">
        ${DB.courses.map(c => {
        const done = (S.lessons[c.id] || []).length;
        const pct = Math.round(done / c.lessons.length * 100);
        return `<div class="card pad stack" data-act="nav" data-to="#/course/${c.id}" role="button" tabindex="0" style="cursor:pointer">
            <div class="kv"><span class="ttl" style="font-family:var(--f-dis);font-size:14px">${esc(c.title)}</span><span class="pill">${done ? bn(pct) + '%' : 'নতুন'}</span></div>
            <div class="mini muted" style="margin:5px 0 8px">${esc(c.level)} · ${esc(c.teacher)}</div>
            <p class="tiny muted" style="margin:0 0 10px;line-height:1.7">${esc(c.summary)}</p>
            <div class="bar thin"><i style="width:${pct}%"></i></div>
          </div>`;
      }).join('')}
      </div><div style="height:20px"></div>`;
    }
  function courseScreen(id) {
      const c = DB.courses.find(x => x.id === id) || DB.courses[0];
      const done = S.lessons[c.id] || [];
      const pct = Math.round(done.length / c.lessons.length * 100);
      return `${appbar(c.title, esc(c.level), '#/courses')}
      <div class="pad">
        <div class="card oath pad stack">
          <div class="kv"><div><div class="mini muted">কোর্স অগ্রগতি</div><div class="display" style="font-size:14px;margin-top:3px">${esc(c.teacher)}</div></div>
            <div class="ring" style="--p:${pct}%;width:48px;height:48px"><div><div class="n" style="font-size:12px">${bn(pct)}%</div></div></div></div>
          <div class="grid3 mt"><div class="stat"><div class="k">লেসন</div><div class="v">${bn(done.length)}/${bn(c.lessons.length)}</div></div>
            <div class="stat"><div class="k">সময়</div><div class="v">${bn(c.hours)} ঘণ্টা</div></div>
            <div class="stat"><div class="k">কুইজ</div><div class="v">৩</div></div></div>
        </div>
        <div class="sect"><h4>সিলেবাস</h4><div class="line"></div><span class="mini muted">ট্যাপ করে সম্পন্ন করুন</span></div>
        <div class="timeline">
          ${c.lessons.map((l, i) => `<div class="card tl ${done.includes(i) ? 'done' : ''}" data-act="lesson" data-id="${c.id}" data-i="${i}" role="button" tabindex="0">
            <div class="node">${done.includes(i) ? ico('check', 'xs') : bn(i + 1)}</div>
            <h5>${esc(l.t)} ${!done.includes(i) && done.length === i ? '<span class="pill">এখনই</span>' : ''}</h5>
            <p>${esc(l.d)} · ${bn(l.m)} মিনিট</p></div>`).join('')}
        </div>
        <button class="btn gold block" data-act="nav" data-to="#/quiz">লেসন শেষে কুইজ দিন</button>
      </div><div style="height:20px"></div>`;
    }
  function nextFriday() {
      const d = new Date(TODAY);
      d.setHours(20, 0, 0, 0);
      const add = (5 - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + (add === 0 && Date.now() > d.getTime() ? 7 : add));
      return d;
    }
  function examScreen() {
      const target = nextFriday();
      const diff = Math.max(0, target - Date.now());
      const hh = Math.floor(diff / 3600000), mm = Math.floor(diff % 3600000 / 60000), dd = Math.floor(hh / 24);
      const best = S.attempts.length ? Math.max(...S.attempts.map(a => a.score)) : 0;
      const rows = DB.leaderboard.concat([{ n: S.name + ' (আপনি)', c: 'ঢাকা', s: best, me: true }])
        .sort((a, b) => b.s - a.s);
      return `${appbar('পরীক্ষা ও কুইজ', 'Pariksha Kendra', undefined, true)}
      <div class="pad" style="padding-top:0">
        <div class="card oath pad">
          <div class="kv" style="align-items:flex-start">
            <div><span class="pill">সাপ্তাহিক কুইজ · ৪৭তম</span>
              <div class="display" style="font-size:16px;margin-top:9px">${esc(DB.quizzes.weekly.topic)}</div>
              <div class="mini muted" style="margin-top:4px">${bn(DB.quizzes.weekly.questions.length)}টি প্রশ্ন · ${bn(DB.quizzes.weekly.minutes)} মিনিট · নেগেটিভ মার্কিং নেই</div></div>
            <div style="text-align:center"><div class="mini muted">পুরস্কার</div><div style="font-size:16px;margin-top:4px">🥇</div>
              <div class="mini" style="color:var(--gold-300);margin-top:2px">স্বর্ণ পদক</div></div>
          </div>
          <div class="cd"><div><b>${bn(dd)}</b><i>দিন</i></div><div><b>${bn(String(hh % 24).padStart(2, '0'))}</b><i>ঘণ্টা</i></div><div><b>${bn(String(mm).padStart(2, '0'))}</b><i>মিনিট</i></div></div>
          <button class="btn gold block mt" data-act="quizStart">এখনই অংশ নিন</button>
        </div>

        <div class="grid3 mt">
          <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('cal')}</div><div class="mini" style="margin-top:7px">মাসিক</div></div>
          <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('trophy')}</div><div class="mini" style="margin-top:7px">বার্ষিক</div></div>
          <div class="card pad" style="text-align:center;padding:12px 6px"><div style="color:var(--gold-300);display:grid;place-items:center">${ico('shield')}</div><div class="mini" style="margin-top:7px">সার্টিফিকেট</div></div>
        </div>

        <div class="sect"><h4>লিডারবোর্ড</h4><div class="line"></div><span class="mini muted">আপনার সেরা: ${best ? bn(best) : '—'}</span></div>
        <div class="card pad" style="padding:6px 13px">
          ${rows.slice(0, 6).map((r, i) => `
            <div class="li ${r.me ? 'me-row' : ''}">
              <span class="rankbox ${i === 0 ? 'g1' : i === 1 ? 'g2' : i === 2 ? 'g3' : ''}">${bn(i + 1)}</span>
              <div class="av round" style="width:30px;height:30px;font-size:12px">${esc(r.n.slice(0, 1))}</div>
              <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${esc(r.n)}</div><div class="mini muted">${esc(r.c)} · ${r.s ? bn(r.s) : '—'}</div></div>
              ${r.me ? '<span class="pill">আপনি</span>' : ''}
            </div>`).join('')}
        </div>

        ${S.attempts.length ? `<div class="sect"><h4>আগের ফলাফল</h4><div class="line"></div></div>
        ${S.attempts.slice(-3).reverse().map(a => `<div class="card rowcard stack">
          <div class="datebox" style="width:44px;height:48px"><b>${bn(a.score)}</b><i>নম্বর</i></div>
          <div style="flex:1"><div class="ttl">${esc(a.title)}</div><div class="mini muted" style="margin-top:4px">${bn(a.correct)}/${bn(a.total)} সঠিক · ${esc(a.when)}</div></div>
          <span class="pill ${a.score >= 50 ? 'ok' : ''}">${a.score >= 50 ? 'উত্তীর্ণ' : 'আবার চেষ্টা'}</span></div>`).join('')}` : ''}
      </div><div style="height:20px"></div>`;
    }
  function quizScreen() {
      const q = U.quiz;
      if (!q) return `<div class="pad" style="padding-top:24px"><div class="card empty"><h5>কুইজ শুরু হয়নি</h5><p>পরীক্ষা পাতায় গিয়ে “এখনই অংশ নিন” চাপুন।</p><button class="btn gold sm" data-act="nav" data-to="#/exam">পরীক্ষায় যান</button></div></div>`;
      const Q = DB.quizzes.weekly.questions;
      const cur = Q[q.i];
      const left = q.left;
      return `${appbar(`প্রশ্ন ${bn(q.i + 1)} / ${bn(Q.length)}`, DB.quizzes.weekly.topic, '#/exam')}
      <div class="pad">
        <div class="kv" style="margin-top:4px"><span class="mini muted">সময় বাকি</span><span class="pill" id="quizTimer">${bn(String(Math.floor(left / 60)).padStart(2, '0'))}:${bn(String(left % 60).padStart(2, '0'))}</span></div>
        <div class="qbar">${Q.map((_, i) => `<i class="${i <= q.i ? 'on' : ''}"></i>`).join('')}</div>
        <div class="card pad" style="margin-bottom:15px;padding:16px">
          <div class="mini muted" style="margin-bottom:9px">${esc(DB.quizzes.weekly.topic)} · প্রশ্ন ${bn(q.i + 1)}</div>
          <div style="font-size:14px;line-height:1.75">${esc(cur.q)}</div>
        </div>
        ${cur.opts.map((o, i) => `<button class="opt ${q.answers[q.i] === i ? 'sel' : ''}" data-act="pick" data-i="${i}">
          <span class="k">${['ক', 'খ', 'গ', 'ঘ'][i]}</span>${esc(o)}</button>`).join('')}
        <div style="display:flex;gap:9px;margin-top:16px">
          <button class="btn ghost" style="flex:1" data-act="quizPrev" ${q.i === 0 ? 'disabled' : ''}>আগের</button>
          ${q.i === Q.length - 1
          ? `<button class="btn gold" style="flex:1.5" data-act="quizSubmit">জমা দিন</button>`
          : `<button class="btn gold" style="flex:1.5" data-act="quizNext">পরের প্রশ্ন</button>`}
        </div>
        <p class="mini muted" style="text-align:center;margin-top:14px">উত্তর দেওয়া হয়েছে ${bn(Object.keys(q.answers).length)}/${bn(Q.length)}</p>
      </div><div style="height:20px"></div>`;
    }
  function resultScreen() {
      const r = U.result;
      if (!r) return homeScreen();
      const Q = DB.quizzes.weekly.questions;
      const pct = Math.round(r.correct / Q.length * 100);
      return `${appbar('ফলাফল', DB.quizzes.weekly.topic, '#/exam')}
      <div class="pad">
        <div class="card oath pad" style="text-align:center">
          <div class="eyebrow">আপনার স্কোর</div>
          <div class="display" style="font-size:40px;margin:8px 0 4px;color:var(--gold-200)">${bn(r.score)}</div>
          <div class="tiny muted">১০০-এর মধ্যে · ${bn(r.correct)}/${bn(Q.length)} সঠিক</div>
          <div class="bar" style="margin:14px 0 6px"><i style="width:${pct}%"></i></div>
          <div class="mini muted">${pct >= 80 ? 'অসাধারণ! শাস্ত্রজ্ঞান দৃঢ় হচ্ছে 🌸' : pct >= 50 ? 'ভালো — আরেকটু অনুশীলন করুন' : 'চিন্তা নেই, ব্যাখ্যা পড়ে আবার দিন'}</div>
        </div>
        <div class="sect"><h4>উত্তরপত্র ও ব্যাখ্যা</h4><div class="line"></div></div>
        ${Q.map((q, i) => {
          const mine = r.answers[i], ok = mine === q.ans;
          return `<div class="card pad stack">
            <div class="kv"><span class="tiny" style="flex:1;line-height:1.6">${bn(i + 1)}. ${esc(q.q)}</span>
              <span class="pill ${ok ? 'ok' : ''}">${ok ? 'সঠিক' : 'ভুল'}</span></div>
            <div class="mini" style="margin-top:8px">আপনার উত্তর: <b>${mine === undefined ? '—' : esc(q.opts[mine])}</b></div>
            ${!ok ? `<div class="mini" style="color:var(--ok);margin-top:4px">সঠিক: ${esc(q.opts[q.ans])}</div>` : ''}
            <div class="arth" style="margin-top:9px;font-size:11.5px">${esc(q.ex)}</div>
          </div>`;
        }).join('')}
        <div style="display:flex;gap:9px"><button class="btn ghost" style="flex:1" data-act="nav" data-to="#/exam">শেষ</button>
          <button class="btn gold" style="flex:1" data-act="quizStart">আবার দিন</button></div>
      </div><div style="height:20px"></div>`;
    }
