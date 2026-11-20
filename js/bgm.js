/* =====================================================================
   সনাতন বিদ্যাপীঠ — মন্দির-সংগীত (background music)
   ---------------------------------------------------------------------
   উৎসের ক্রম (নিজে থেকেই বেছে নেয়):
     ১. ব্যবহারকারীর নিজের ফাইল / লিংক  (সেটিংস → ফোন থেকে গান দিন / লিংক)
     ২. YouTube-এর গান — মঙ্গলম্ ভগবান বিষ্ণু মন্ত্র (অফিসিয়াল প্লেয়ার,
        লুকানো ছোট প্লেয়ারে চলে; ইউজার নিজের গান দিলে সেটি প্রাধান্য পায়)
     ৩. অ্যাপের নিজস্ব মন্দির-সংগীত (audio/bgm-temple.wav) — অফলাইনেও চলে

   • অ্যাপ লোড হলেই মৃদু স্বরে (২২%) নিজে থেকে শুরু — background।
   • পাতা/ট্যাব বদলালেও বাজতে থাকে; বন্ধ না করলে থামে না।
   • প্লে/বিরতি · ভলিউম · মিউট — সব সেটিংসে সংরক্ষিত।
   • ভয়েস/আরতি চললে সংগীত নিজে নেমে যায় (ducking)।
   ===================================================================== */
(function (w) {
  'use strict';

  const KEY = 'svp_bgm';
  const SRC_LOCAL = 'audio/bgm-temple.wav';
  const SRC_FILE = 'audio/bgm-song.mp3';            /* নিজের গান এই নামে রাখলে সেটাই বাজবে */
  const YT = {
    id: 'jrjrhoM6nus',
    title: 'মঙ্গলম্ ভগবান বিষ্ণু মন্ত্র',
    by: 'musiconlymusic · YouTube'
  };

  const D = {
    on: false, muted: false, blocked: false,
    vol: 0.22, playing: false, ready: false,
    custom: '', useYT: true, mode: 'none'
  };

  function load() {
    try {
      const o = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
      if (typeof o.vol === 'number') D.vol = Math.max(0, Math.min(1, o.vol));
      if (typeof o.on === 'boolean') D.on = o.on;
      if (typeof o.muted === 'boolean') D.muted = o.muted;
      if (typeof o.custom === 'string') D.custom = o.custom;
      if (typeof o.useYT === 'boolean') D.useYT = o.useYT;
    } catch (e) { }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ vol: D.vol, on: D.on, muted: D.muted, custom: D.custom, useYT: D.useYT }));
    } catch (e) { }
  }

  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(state()); } catch (e) { } });
  function state() {
    return {
      on: D.on && !D.muted, muted: D.muted, vol: D.vol, playing: D.playing,
      blocked: D.blocked, ready: D.ready, mode: D.mode, custom: D.custom,
      track: trackName()
    };
  }
  function trackName() {
    if (D.custom) return D.custom.split('/').pop();
    if (D.mode === 'yt') return YT.title;
    return 'মন্দির-সংগীত (অ্যাপের নিজস্ব)';
  }

  /* ------------------------------------------------ লোকাল অডিও */
  let el = null;
  function audio() {
    if (el) return el;
    el = document.getElementById('bgmAudio');
    if (!el) {
      el = document.createElement('audio');
      el.id = 'bgmAudio';
      el.loop = true; el.preload = 'auto'; el.playsInline = true;
      el.setAttribute('playsinline', '');
      el.src = SRC_LOCAL;
      document.body.appendChild(el);
    }
    el.loop = true;
    el.addEventListener('play', () => { if (D.mode === 'local') { D.playing = true; D.blocked = false; emit(); } });
    el.addEventListener('pause', () => { if (D.mode === 'local') { D.playing = false; emit(); } });
    el.addEventListener('canplay', () => { D.ready = true; emit(); });
    return el;
  }
  function fadeLocal(to, ms) {
    const a = audio();
    const from = a.volume, t0 = performance.now(), dur = ms || 800;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      try { a.volume = Math.max(0, Math.min(1, from + (to - from) * (k * (2 - k)))); } catch (e) { }
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ------------------------------------------------ YouTube প্লেয়ার */
  let ytp = null, ytReady = false, ytApiPromise = null;
  function ytHost() {
    let h = document.getElementById('bgmYT');
    if (h) return h;
    h = document.createElement('div');
    h.id = 'bgmYT';
    h.setAttribute('aria-hidden', 'true');
    /* শব্দের জন্য প্লেয়ারকে রেন্ডার হতে হয় — তাই ১×১ px, কোণে, অদৃশ্য */
    h.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;overflow:hidden;opacity:.01;pointer-events:none;z-index:-1';
    document.body.appendChild(h);
    return h;
  }
  function ytApi() {
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((res, rej) => {
      if (w.YT && w.YT.Player) return res(w.YT);
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => rej(new Error('yt-api'));
      document.head.appendChild(s);
      const t0 = Date.now();
      (function wait() {
        if (w.YT && w.YT.Player) return res(w.YT);
        if (Date.now() - t0 > 8000) return rej(new Error('yt-timeout'));
        setTimeout(wait, 200);
      })();
    });
    return ytApiPromise;
  }
  async function ytInit() {
    if (ytp) return ytp;
    const Y = await ytApi();
    return new Promise((res, rej) => {
      const d = document.createElement('div');
      ytHost().appendChild(d);
      ytp = new Y.Player(d, {
        videoId: YT.id,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, loop: 1, playlist: YT.id, playsinline: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => {
            ytReady = true;
            try { ytp.setVolume(Math.round(D.vol * 100)); } catch (e) { }
            res(ytp);
          },
          onStateChange: e => {
            const S = w.YT.PlayerState;
            if (e.data === S.PLAYING) { D.playing = true; D.blocked = false; emit(); }
            else if (e.data === S.PAUSED || e.data === S.ENDED) { D.playing = false; emit(); if (e.data === S.ENDED && D.on && !D.muted) { try { ytp.seekTo(0); ytp.playVideo(); } catch (er) { } } }
          },
          onError: () => { /* ভিডিও না চললে লোকাল সংগীতে ফেরা */ D.useYT = false; save(); emit(); }
        }
      });
      setTimeout(() => { if (!ytReady) rej(new Error('yt-player')); }, 9000);
    });
  }

  /* ------------------------------------------------ একক নিয়ন্ত্রণ */
  function activeMode() {
    if (D.custom) return 'local';
    if (D.useYT && D.mode !== 'local-forced') return 'yt';
    return 'local';
  }
  function fadeAll(to, ms) {
    if (D.mode === 'yt' && ytp && ytReady) {
      const from = ytp.getVolume ? ytp.getVolume() : Math.round(D.vol * 100);
      const target = Math.round(Math.max(0, Math.min(1, to)) * 100);
      const t0 = performance.now(), dur = ms || 700;
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        try { ytp.setVolume(Math.round(from + (target - from) * (k * (2 - k)))); } catch (e) { }
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    } else fadeLocal(to, ms);
  }

  async function startYT() {
    try {
      await ytInit();
      D.mode = 'yt';
      try { ytp.setVolume(D.muted ? 0 : Math.round(D.vol * 22)); } catch (e) { }  /* ফেড-ইন শূন্য থেকে */
      ytp.playVideo();
      fadeAll(D.vol, 2200);
      /* ব্রাউজার শব্দ-সহ অটোপ্লে আটকালে: নিঃশব্দে চালু করে প্রথম স্পর্শে শব্দ খুলে দেওয়া */
      setTimeout(() => {
        try {
          const S = w.YT.PlayerState;
          if (ytp && ytp.getPlayerState && ytp.getPlayerState() !== S.PLAYING) {
            ytp.mute(); ytp.playVideo(); D.mode = 'yt';
            D.playing = true; emit();
            const go = () => {
              document.removeEventListener('pointerdown', go, true);
              document.removeEventListener('keydown', go, true);
              document.removeEventListener('touchstart', go, true);
              if (D.on && !D.muted) { try { ytp.unMute(); ytp.setVolume(Math.round(D.vol * 100)); } catch (e) { } }
            };
            document.addEventListener('pointerdown', go, true);
            document.addEventListener('keydown', go, true);
            document.addEventListener('touchstart', go, true);
          }
        } catch (e) { }
      }, 1600);
      emit();
      return true;
    } catch (e) {
      D.mode = 'local';
      audio();
      return startLocal();
    }
  }
  function startLocal() {
    D.mode = 'local';
    const a = audio();
    a.src = D.custom || SRC_LOCAL;
    a.volume = 0;
    const p = a.play();
    if (p && p.catch) p.catch(() => { D.blocked = true; armGesture(); emit(); });
    fadeLocal(D.vol, 1600);
    emit();
    return true;
  }
  function armGesture() {
    D.blocked = true; emit();
    const go = () => {
      document.removeEventListener('pointerdown', go, true);
      document.removeEventListener('keydown', go, true);
      document.removeEventListener('touchstart', go, true);
      if (D.on && !D.muted) play();
    };
    document.addEventListener('pointerdown', go, true);
    document.addEventListener('keydown', go, true);
    document.addEventListener('touchstart', go, true);
  }

  async function play() {
    D.on = true; D.muted = false; save();
    if (activeMode() === 'yt') return startYT();
    return startLocal();
  }
  function pause() {
    D.on = false; save();
    if (D.mode === 'yt' && ytp) {
      fadeAll(0, 500);
      setTimeout(() => { try { ytp.pauseVideo(); } catch (e) { } D.playing = false; emit(); }, 520);
    } else {
      const a = audio();
      fadeLocal(0, 500);
      setTimeout(() => { try { a.pause(); } catch (e) { } D.playing = false; emit(); }, 520);
    }
  }
  function toggle() { (D.on && !D.muted && D.playing) ? pause() : play(); }
  function mute() {
    D.muted = true; save();
    fadeAll(0, 450);
    setTimeout(() => { if (D.mode === 'yt' && ytp) { try { ytp.pauseVideo(); } catch (e) { } D.playing = false; emit(); } }, 480);
    emit();
  }
  function unmute() { D.muted = false; save(); play(); }
  function setVol(v) {
    D.vol = Math.max(0, Math.min(1, v)); save();
    if (!D.muted) fadeAll(D.vol, 250);
    emit();
  }
  function setCustom(url) {
    D.custom = (url || '').trim(); save();
    if (D.mode === 'yt' && ytp) { try { ytp.pauseVideo(); } catch (e) { } }
    D.on = true; save();
    play();
    emit();
  }
  function clearCustom() { D.custom = ''; save(); play(); emit(); }
  function setUseYT(on) { D.useYT = !!on; save(); if (D.useYT) { D.custom = ''; save(); } play(); emit(); }

  async function boot() {
    load();
    audio();
    if (D.muted) { emit(); return; }
    D.on = true;
    play();
    emit();
  }

  /* ভয়েস/আরতি চললে সংগীত মৃদু */
  function duck(on) {
    if (D.muted || !D.on) return;
    fadeAll(on ? D.vol * 0.25 : D.vol, on ? 420 : 900);
  }

  w.BGM = {
    boot, play, pause, toggle, mute, unmute, setVol, setCustom, clearCustom, setUseYT,
    state, onState: fn => { subs.add(fn); return () => subs.delete(fn); },
    duck, D, audio, YT, trackName, activeMode
  };
})(window);
