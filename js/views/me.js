/* ==========================================================================
   ১২. আমি — পছন্দের কার্ড (থিম, আবহ, নাম)
   ফাইল: js/views/me.js
   ========================================================================== */
  function prefCard() {
      return `<div class="card pad" style="padding:4px 14px">
          <div class="setting" data-act="toggleTheme">
            <span style="color:var(--gold-300)">${ico('sun', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">লাইট মোড (পাটা-থিম)</div>
            <span class="toggle ${S.theme === 'light' ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleBg">
            <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">পটভূমি থিম (মন্দির-পত্র)</div>
            <span class="toggle ${S.bg ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleSound">
            <span style="color:var(--gold-300)">${ico('bell', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">মৃদু ঘণ্টাধ্বনি</div>
            <span class="toggle ${S.sound ? 'on' : ''}"></span></div>
          <div class="setting" data-act="toggleMotion">
            <span style="color:var(--gold-300)">${ico('flame', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">অ্যানিমেশন</div>
            <span class="toggle ${S.motion ? 'on' : ''}"></span></div>
          <div class="setting" data-act="nav" data-to="#/voice">
            <span style="color:var(--gold-300)">${vico('play', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">কণ্ঠ ও উচ্চারণ (মধুর বাংলা ভয়েস)</div>
            <span class="mini muted">›</span></div>
          <div class="setting" data-act="toggleName">
            <span style="color:var(--gold-300)">${vico('user', 'sm')}</span>
            <div style="flex:1;font-size:12.5px">নাম পরিবর্তন</div>
            <span class="mini muted">${esc(S.name.split(' ')[0])} ›</span></div>
          <div class="setting" data-act="reset">
            <span style="color:var(--danger)">${ico('close', 'sm')}</span>
            <div style="flex:1;font-size:12.5px;color:var(--danger)">ডেমো ডেটা রিসেট</div>
            <span class="mini muted">›</span></div>
        </div>
  `;
    }
