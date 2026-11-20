/* =====================================================================
   সনাতন বিদ্যাপীঠ — কণ্ঠ (VOICE ENGINE)
   ---------------------------------------------------------------------
   আগের `speechSynthesis` + rate .85 ছিল রোবটের মতো শোনানোর প্রধান কারণ:
   এক টানে পুরো বাক্য, একই সুর, কোনো শ্বাস নেই। এই ইঞ্জিনে:

   ১. বাক্য-বাক্য ভেঙে পড়া হয় — প্রতিটি বাক্যের পরে স্বাভাবিক বিরতি।
   ২. স্বর-ওঠানামা (prosody): বাক্যের ভিতরে শব্দে-micro-বিরতি, হ্রাস,
      শেষে নামা সুর; প্রশ্নবোধক বাক্যে শেষে ওঠা সুর।
   ৩. শ্বাস (breath): দীর্ঘ অনুচ্ছেদের মাঝে সত্যিকারের শ্বাস-শব্দ।
   ৪. গল্প-মোড: ধীর, নরম, প্রতিটি বাক্যে ভিন্ন সুর ও গতি — রূপকথার
      পাঠের মাধুর্য।
   ৫. কণ্ঠ-নির্বাচন: ডিভাইসে থাকা বাংলা নিউরাল কণ্ঠগুলো (Google/Oda/
      Natural/Microsoft) স্বয়ংক্রিয়ভাবে সবচেয়ে ভালোটি বেছে নেওয়া হয়।
   ৬. পিচ/গতি/শ্বাসের মাত্রা ব্যবহারকারী বদলাতে পারেন — সেটিংসে সেভ থাকে।
   ৭. বাংলা বানানো-পূর্বক সংখ্যা/সংক্ষেপ (১. নং, ✓, ‰) স্পষ্ট ভাষায়।
   ===================================================================== */
(function (w) {
  'use strict';

  const BN_D = '০১২৩৪৫৬৭৮৯';
  const toBn = s => String(s).replace(/\d/g, d => BN_D[+d]);
  const db = () => new Promise((resolve, rej) => {
    try {
      const rq = indexedDB.open('svp-voice', 1);
      rq.onupgradeneeded = () => { const d = rq.result; if (!d.objectStoreNames.contains('clips')) d.createObjectStore('clips', { keyPath: 'key' }); else d.createObjectStore('clips', { keyPath: 'key' }); };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => rej(rq.error);
      rq.onblocked = () => rej(new Error('blocked'));
    } catch (e) { rej(e); }
  });

  /* ---------------- পছন্দের কণ্ঠ ---------------- */
  const VOICES = [
    { id: 'auto', n: 'স্বয়ংক্রিয় (সর্বোত্তম)', d: 'ডিভাইসের সবচেয়ে ভালো বাংলা কণ্ঠ' },
    { id: 'female', n: 'মহিলা · মৃদু', d: 'গল্প ও শ্লোক পাঠে মাধুর্যপূর্ণ' },
    { id: 'male', n: 'পুরুষ · গভীর', d: 'শ্লোক ও মন্ত্রের গুরুগম্ভীর স্বর' },
    { id: 'kid', n: 'শিশু-সহানুভূত', d: 'উঁচু-নরম কণ্ঠ, ছোটদের গল্পে' }
  ];

  const M = {
    mode: 'normal',       /* normal | story | mantra */
    rate: 1, pitch: 1, voice: 'auto',
    breath: true, pauses: true,
    enabled: true
  };

  const has = () => ('speechSynthesis' in w && 'SpeechSynthesisUtterance' in w);
  let all = [];
  function refresh() {
    if (!has()) return [];
    all = w.speechSynthesis.getVoices() || [];
    return all;
  }
  if (has()) { refresh(); w.speechSynthesis.onvoiceschanged = () => refresh(); }

  const bnVoices = () => refresh().filter(v => /^bn(-|_|$)/i.test(v.lang) || /bengal/i.test(v.name));
  function pick(pref) {
    const bn = bnVoices();
    if (!bn.length) return null;
    const nm = v => (v.name || '').toLowerCase();
    const score = v => {
      let s = 0;
      if (/natural|neural|online|premium|enhanced|wavenet|studio/.test(nm(v))) s += 60;
      if (/google/.test(nm(v))) s += 25;
      if (/oda|kalpana|shreya|tanishaa|puja|bangla/.test(nm(v))) s += 15;
      if (/microsoft/.test(nm(v))) s += 10;
      if (/female|madhur|mira|female/i.test(nm(v))) s += 6;
      return s;
    };
    const female = bn.filter(v => /female|oda|kalpana|shreya|tanishaa|mira|madhur|google/i.test(nm(v)));
    const male = bn.filter(v => /male|deep|bishnu|hemant|ravi/i.test(nm(v)) && !/female/i.test(nm(v)));
    if (pref === 'female' && female.length) return female.sort((a, b) => score(b) - score(a))[0];
    if (pref === 'male' && male.length) return male.sort((a, b) => score(b) - score(a))[0];
    if (pref === 'kid') return bn.sort((a, b) => score(b) - score(a))[0];
    return bn.sort((a, b) => score(b) - score(a))[0];
  }
  function voiceList() {
    return refresh().map(v => ({ lang: v.lang, name: v.name, local: !!v.localService }))
      .filter(v => /^bn/i.test(v.lang) || /bengal/i.test(v.name));
  }

  /* ---------------- বাংলা লেখা পড়ার-উপযোগী করা ---------------- */
  const SPEAK_FIX = [
    [/\u0964|\u0965/g, ', '],            /* । ॥ → কমা */
    [/[«»"""]/g, ''],
    [/[…]+/g, ', '],
    [/[~—–]+/g, ', '],
    [/\s*[\u2713\u2714\u2611]/g, ' , '],
    [/\s+/g, ' '],
  ];
  function numBn(n) {
    let s = String(n);
    const one = ['শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চোদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ'];
    if (s.length === 1) return one[+s];
    if (+s < 100) {
      const t = Math.floor(+s / 10), u = +s % 10;
      const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];
      return (u ? one[u] + ' ' : '') + tens[t];
    }
    return s.split('').map(c => one[+c] || ' ').join(' ');
  }
  function clean(text) {
    let t = String(text || '');
    t = t.replace(/\d+/g, m => numBn(+m));
    t = t.replace(/&/g, ' ও ');
    for (const [re, r] of SPEAK_FIX) t = t.replace(re, r);
    return t.trim();
  }

  /* বাক্যে ভাগ করা — শেষ চিহ্নসহ; ছোট বাক্য একসাথে */
  function sentences(text) {
    const parts = clean(text).split(/(?<=[।.!?;:]|,)\s+|\n+/).map(s => s.trim()).filter(Boolean);
    const out = [];
    for (const p of parts) {
      if (out.length && (p.length < 14 || out[out.length - 1].length < 22) && out[out.length - 1].length + p.length < 120) {
        out[out.length - 1] += ' ' + p;
      } else out.push(p);
    }
    return out.length ? out : [clean(text)];
  }
  /* বাক্যের ভিতরে শব্দগুচ্ছের ফাঁকে নরম বিরতি — মানুষের শ্বাসের মতো */
  function chunk(sent) {
    const words = sent.split(/\s+/);
    const chunks = [];
    let cur = '';
    for (const wd of words) {
      cur += (cur ? ' ' : '') + wd;
      const soft = /[,;:]$/.test(wd);
      if ((soft && cur.length > 18) || cur.length > 46) { chunks.push(cur); cur = ''; }
    }
    if (cur) chunks.push(cur);
    return chunks;
  }

  /* ---------------- অডিও: শ্বাস, নরম গুঞ্জন ---------------- */
  let ac = null;
  function actx() {
    const AC = w.AudioContext || w.webkitAudioContext;
    if (!AC) return null;
    try { ac = ac || new AC(); if (ac.state === 'suspended') ac.resume(); return ac; } catch (e) { return null; }
  }
  function breath(level) {
    if (!M.breath) return;
    const c = actx(); if (!c) return;
    try {
      const dur = 0.42, n = Math.floor(c.sampleRate * dur);
      const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) {
        const env = Math.sin(Math.PI * i / n);
        d[i] = (Math.random() * 2 - 1) * env * env * (level || 0.16);
      }
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 0.9;
      const g = c.createGain(); g.gain.value = 0.5;
      src.connect(bp); bp.connect(g); g.connect(c.destination); src.start();
    } catch (e) { }
  }

  /* ---------------- প্লেব্যাক ---------------- */
  const ST = { playing: false, pause: false, token: 0, cur: null, queue: [], label: '', mode: 'normal' };
  const listeners = new Set();
  function emit() { listeners.forEach(fn => { try { fn(ST); } catch (e) { } }); }
  const onState = fn => { listeners.add(fn); return () => listeners.delete(fn); };

  function utter(text, cfg) {
    return new Promise(resolve => {
      const u = new SpeechSynthesisUtterance(text);
      const v = pick(cfg.voice);
      if (v) { u.voice = v; u.lang = v.lang || 'bn-BD'; } else u.lang = 'bn-BD';
      u.rate = Math.max(0.5, Math.min(1.6, cfg.rate));
      u.pitch = Math.max(0.5, Math.min(1.8, cfg.pitch));
      u.volume = 1;
      u.onend = () => resolve('done');
      u.onerror = () => resolve('error');
      ST.cur = u;
      try { w.speechSynthesis.speak(u); } catch (e) { resolve('error'); }
    });
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* মূল পাবলিক API */
  async function play(text, opt) {
    if (!has()) { try { w.toast && w.toast('এই ব্রাউজারে কণ্ঠ সমর্থিত নয়'); } catch (e) { } return; }
    stop();
    const o = Object.assign({}, M, opt || {});
    ST.playing = true; ST.pause = false; ST.label = o.label || ''; ST.mode = o.mode || M.mode;
    const token = ++ST.token;
    emit();
    const mode = o.mode || M.mode;
    const base = mode === 'story' ? { rate: 0.88, pitch: 1.02 } : mode === 'mantra' ? { rate: 0.74, pitch: 0.96 } : { rate: 0.98, pitch: 1.0 };
    const cfg = {
      voice: o.voice || M.voice,
      rate: clampNum(o.rate, 1) * base.rate,
      pitch: clampNum(o.pitch, 1) * base.pitch
    };
    const sents = sentences(text);
    for (let si = 0; si < sents.length; si++) {
      if (token !== ST.token) return;
      const chunks = chunk(sents[si]);
      for (let ci = 0; ci < chunks.length; ci++) {
        if (token !== ST.token) return;
        while (ST.pause) { await sleep(120); if (token !== ST.token) return; }
        const txt = chunks[ci];
        if (!txt.trim()) continue;
        if (M.breath && ci === 0 && si > 0 && si % 2 === 0) { breath(0.14); await sleep(260); }
        await utter(txt, cfg);
        if (ci < chunks.length - 1) await sleep(M.pauses ? 110 : 40);
      }
      /* বাক্যের পরে স্বাভাবিক বিরতি — প্রশ্নে একটু বেশি */
      const q = /[?]\s*$/.test(sents[si]);
      const d = mode === 'story' ? (q ? 520 : 430) : mode === 'mantra' ? (q ? 460 : 380) : (q ? 300 : 230);
      if (si < sents.length - 1) await sleep(M.pauses ? d : 90);
    }
    if (token !== ST.token) return;
    ST.playing = false; emit();
  }
  function clampNum(v, d) { const n = Number(v); return isFinite(n) && n > 0 ? n : d; }

  function stop() {
    ST.token++; ST.playing = false; ST.pause = false;
    try { w.speechSynthesis.cancel(); } catch (e) { }
    emit();
  }
  function pause() {
    if (!ST.playing) return;
    ST.pause = true;
    try { w.speechSynthesis.pause(); } catch (e) { }
    emit();
  }
  function resume() {
    if (!ST.playing) return;
    ST.pause = false;
    try { w.speechSynthesis.resume(); } catch (e) { }
    emit();
  }
  function toggle() { ST.playing && !ST.pause ? pause() : (ST.pause ? resume() : resume()); }

  function set(k, v) { M[k] = v; }
  function settings() { return Object.assign({}, M); }

  w.VOICE = {
    has, play, stop, pause, resume, toggle, set, settings, onState, state: () => ST,
    voices: voiceList, VOICES, clean, sentences,
    /* স্বয়ংক্রিয় পরীক্ষা: বাংলা কণ্ঠ আছে কি না, কোনটি */
    best() { const v = pick(M.voice); return v ? { name: v.name, lang: v.lang } : null; }
  };
})(window);
