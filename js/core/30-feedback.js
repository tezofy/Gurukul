/* ==========================================================================
   ছোট জানানো ও শব্দ · toast, chime, burst
   ফাইল: js/core/30-feedback.js
   ========================================================================== */
  let ac = null, toastT = null;
  function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg; el.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2100);
    }
  function chime(kind) {
      if (!S.sound) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const now = ac.currentTime;
        const f = kind === 'complete' ? [880, 1320, 1760] : kind === 'soft' ? [660, 990] : [1046, 1568];
        f.forEach((hz, i) => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sine'; o.frequency.value = hz;
          const t0 = now + i * .045;
          g.gain.setValueAtTime(0, t0);
          g.gain.linearRampToValueAtTime(.09 / (i + 1), t0 + .012);
          g.gain.exponentialRampToValueAtTime(.0001, t0 + 1.4);
          o.connect(g); g.connect(ac.destination);
          o.start(t0); o.stop(t0 + 1.5);
        });
        if (kind === 'complete' && navigator.vibrate) navigator.vibrate([12, 40, 18]);
      } catch (e) { }
    }
  function burst(x, y, n = 14) {
      if (!S.motion) return;
      const fx = document.getElementById('fx');
      for (let i = 0; i < n; i++) {
        const sp = document.createElement('span');
        const a = (Math.PI * 2 * i) / n + Math.random() * .4, dist = 42 + Math.random() * 60;
        const size = 4 + Math.random() * 6;
        sp.className = 'spark';
        sp.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--dx:${(Math.cos(a) * dist).toFixed(1)}px;--dy:${(Math.sin(a) * dist).toFixed(1)}px;animation-delay:${(Math.random() * .1).toFixed(2)}s`;
        fx.appendChild(sp);
        setTimeout(() => sp.remove(), 1200);
      }
    }
