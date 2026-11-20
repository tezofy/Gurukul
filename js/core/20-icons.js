/* ==========================================================================
   আইকন ও ছোট SVG · vico, ico, AI_ICON, SPRITE
   ফাইল: js/core/20-icons.js
   ========================================================================== */
  const SPRITE = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <!-- ৩ডি মেটালিক স্ট্রোক-গ্রেডিয়েন্ট (আইকনemboss) -->
    <defs>
      <linearGradient id="icoGold" x1="0" y1="0" x2="0.25" y2="1">
        <stop offset="0" stop-color="#fdf0cd"/><stop offset="0.42" stop-color="#e6bf74"/>
        <stop offset="0.72" stop-color="#c2953f"/><stop offset="1" stop-color="#8d6420"/>
      </linearGradient>
      <linearGradient id="icoGoldIn" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#fffaf0"/><stop offset="0.5" stop-color="#f0d49a"/><stop offset="1" stop-color="#c79a48"/>
      </linearGradient>
      <radialGradient id="coinGloss" cx="32%" cy="24%" r="78%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
        <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.06"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
      </radialGradient>
    </defs>
    <!-- ধর্মীয় ধাঁচের আইকন-সেট: প্রতিটি আইকন নিজের বাটনের ভাব অনুসারে -->
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M3.6 20.4h16.8"/><path d="M5.8 20.4V13h12.4v7.4"/><path d="M10.1 20.4v-4.1a1.9 1.9 0 0 1 3.8 0v4.1"/><path d="m7 13 5-4.2 5 4.2"/><path d="m9.1 8.8 2.9-2.4 2.9 2.4"/><path d="M12 6.4V4.2"/><path d="m12 4.2 3 1.2-3 1.2"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M3.8 6.7c2.4-1 4.6-.6 6.5.8v10.8c-1.9-1.4-4.1-1.8-6.5-.8z"/><path d="M20.2 6.7c-2.4-1-4.6-.6-6.5.8v10.8c1.9-1.4 4.1-1.8 6.5-.8z"/><path d="M12 7.5v10.8"/><circle cx="12" cy="10.4" r=".55"/><circle cx="12" cy="15.2" r=".55"/></symbol>
    <symbol id="i-exam" viewBox="0 0 24 24"><path d="M4.3 7.1h15.4a1 1 0 0 1 1 1v9.6a1 1 0 0 1-1 1H4.3a1 1 0 0 1-1-1V8.1a1 1 0 0 1 1-1z"/><path d="M6.6 10.5h6.4"/><path d="M6.6 13.6h4.2"/><path d="m14.3 14.2 1.5 1.5 2.6-2.9"/><path d="M3.3 7.1c1.4-.9 2.7-1.3 4-1.1"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4.2 8.9a3 3 0 0 1 3-3h9.6a3 3 0 0 1 3 3v4.6a3 3 0 0 1-3 3H9.6l-3.8 3v-3a3 3 0 0 1-1.6-2.6z"/><path d="M8.5 5.9C9.4 4.5 10.6 3.8 12 3.8s2.6.7 3.5 2.1"/><circle cx="9.1" cy="11.1" r=".7"/><circle cx="12" cy="11.1" r=".7"/><circle cx="14.9" cy="11.1" r=".7"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M4.7 14.2c0 1.9 1.4 3 3.1 3h8.4c1.7 0 3.1-1.1 3.1-3"/><path d="m4.7 14.2 2.1-3.4M19.3 14.2 17.2 10.8"/><path d="M12 5.6c-.9 1.1-1.4 2-1.4 2.8 0 .9.6 1.5 1.4 2 .8-.5 1.4-1.1 1.4-2 0-.8-.5-1.7-1.4-2.8z"/><path d="M9.1 8.2c.8.2 1.3.7 1.5 1.4M14.9 8.2c-.8.2-1.3.7-1.5 1.4"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="7.6" r="2.7"/><path d="M12 5.2v.7"/><path d="M6.2 19.3c.9-3.2 3.1-4.9 5.8-4.9s4.9 1.7 5.8 4.9"/><path d="M8.3 19.3c1.2.6 2.4.9 3.7.9s2.5-.3 3.7-.9"/></symbol>
    <symbol id="i-flame" viewBox="0 0 24 24"><path d="M5.2 15.4h13.6l-1.7 4.3H6.9z"/><path d="M12 3.3c1.4 1.9 2.1 3.4 2.1 4.7 0 1.6-1.2 2.7-2.1 3.5-.9-.8-2.1-1.9-2.1-3.5 0-1.3.7-2.8 2.1-4.7z"/><path d="M9.4 12.6c.8.6 1.7.9 2.6.9s1.8-.3 2.6-.9"/></symbol>
    <symbol id="i-cal" viewBox="0 0 24 24"><path d="M4.4 6.4h15.2v13.4H4.4z"/><path d="M4.4 10h15.2"/><path d="M7.2 13.2h5.2M7.2 16.4h4.2"/><circle cx="16" cy="14.9" r="1.7"/><path d="M16 12.2v.8M16 16.8v.8M13.3 14.9h.8M17.9 14.9h.8"/></symbol>
    <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.7"/><circle cx="12" cy="12" r="3.3"/><path d="M12 4.3v3.2M12 16.5v3.2M4.3 12h3.2M16.5 12h3.2"/><path d="m6.6 6.6 2.3 2.3M15.1 15.1l2.3 2.3M17.4 6.6l-2.3 2.3M8.9 15.1l-2.3 2.3"/><circle cx="12" cy="12" r=".9"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6.1 9.4h11.8l-1.2 10.4H7.3z"/><path d="M8.7 9.4c0-2.1 1.5-3.6 3.3-3.6s3.3 1.5 3.3 3.6"/><path d="M10.7 9.4v1.9M13.3 9.4v1.9"/><circle cx="12" cy="14.6" r="1.1"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.6" cy="10.6" r="5.7"/><path d="m14.9 14.9 4.2 4.2"/><circle cx="10.6" cy="10.6" r="1.2"/></symbol>
    <symbol id="i-bell" viewBox="0 0 24 24"><path d="M7.3 16.3c.9-1 1.3-2.4 1.3-4.4 0-2.6 1.5-4.5 3.4-4.5s3.4 1.9 3.4 4.5c0 2 .4 3.4 1.3 4.4z"/><path d="M12 7.4V6.1"/><circle cx="12" cy="4.9" r="1"/><path d="M10.6 16.3c0 1 .6 1.7 1.4 1.7s1.4-.7 1.4-1.7"/><path d="M12 18v1.4"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><path d="m14.3 6.3-6 5.5 6 5.5"/><circle cx="16.6" cy="11.8" r=".85"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M7.2 7.2l9.6 9.6M16.8 7.2l-9.6 9.6"/></symbol>
    <symbol id="i-mark" viewBox="0 0 24 24"><path d="M6.7 4.6h10.6v15.1l-5.3-3.7-5.3 3.7z"/><circle cx="12" cy="9.8" r="1"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.1"/><path d="M10.4 8.9l4.6 3.1-4.6 3.1z"/><path d="M12 2.3v1.2M12 20.5v1.2M2.3 12h1.2M20.5 12h1.2"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5.6 12.7 4.3 4.3 8.5-9.1"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4.4 12h14.2"/><path d="m14.5 7.6 4.1 4.4-4.1 4.4"/><path d="M6.4 9.6 8.8 12M6.4 14.4 8.8 12"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.6V12l3 1.9"/><path d="M12 4v1.1M12 18.9V20M4 12h1.1M18.9 12H20"/></symbol>
    <symbol id="i-wallet" viewBox="0 0 24 24"><path d="M4.5 12.4h15c0 4.1-3.3 6.9-7.5 6.9s-7.5-2.8-7.5-6.9z"/><circle cx="12" cy="8.2" r="1.7"/><circle cx="8.4" cy="9.6" r="1.1"/><circle cx="15.6" cy="9.6" r="1.1"/><path d="M6.9 12.4c1.4.8 3.1 1.2 5.1 1.2s3.7-.4 5.1-1.2"/></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.7"/><circle cx="12" cy="12" r=".8"/><path d="M12 2.9v2.1M12 19v2.1M2.9 12h2.1M19 12h2.1M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5"/></symbol>
    <symbol id="i-setgear" viewBox="0 0 24 24">
      <path d="M10.53 2.56 L13.47 2.56 L13.47 5.10 L15.84 6.09 L17.63 4.29 L19.71 6.37 L17.91 8.16 L18.90 10.53 L21.44 10.53 L21.44 13.47 L18.90 13.47 L17.91 15.84 L19.71 17.63 L17.63 19.71 L15.84 17.91 L13.47 18.90 L13.47 21.44 L10.53 21.44 L10.53 18.90 L8.16 17.91 L6.37 19.71 L4.29 17.63 L6.09 15.84 L5.10 13.47 L2.56 13.47 L2.56 10.53 L5.10 10.53 L6.09 8.16 L4.29 6.37 L6.37 4.29 L8.16 6.09 L10.53 5.10 Z"/>
      <circle cx="12" cy="12" r="3.05"/>
      <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>
    </symbol>
    <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.9"/><circle cx="12" cy="12" r="2.7"/><path d="M12 5.1v1.9M12 17v1.9M5.1 12h1.9M17 12h1.9"/><path d="m7.4 7.4 1.3 1.3M15.3 15.3l1.3 1.3M16.6 7.4l-1.3 1.3M8.7 15.3l-1.3 1.3"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3.4 19 6v6c0 4.3-3 7.2-7 8.6-4-1.4-7-4.3-7-8.6V6z"/><path d="M12 8.9c-1.2 1.4-1.8 2.4-1.8 3.4 0 1 .8 1.8 1.8 2.4 1-.6 1.8-1.4 1.8-2.4 0-1-.6-2-1.8-3.4z"/></symbol>
    <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M7.2 12.6h9.6c0 3.7-2.1 6-4.8 6s-4.8-2.3-4.8-6z"/><path d="M9.4 12.6c0-1.1 1.1-1.8 2.6-1.8s2.6.7 2.6 1.8"/><circle cx="12" cy="8.1" r="1.4"/><path d="M8.9 11.4c-.4-1.9.1-3.3 1.3-4.2M15.1 11.4c.4-1.9-.1-3.3-1.3-4.2"/><path d="M8.4 7.6c.9-.4 1.8-.4 2.6 0M15.6 7.6c-.9-.4-1.8-.4-2.6 0"/><path d="M7 20.4h10"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5.2v13.6M5.2 12h13.6"/><circle cx="7.1" cy="7.1" r=".62"/><circle cx="16.9" cy="7.1" r=".62"/><circle cx="7.1" cy="16.9" r=".62"/><circle cx="16.9" cy="16.9" r=".62"/></symbol>
    <symbol id="i-om" viewBox="0 0 24 24"><text x="12" y="18.1" text-anchor="middle" font-size="17.5" font-family="Noto Sans Devanagari, Nirmala UI, Mangal, serif" fill="currentColor" stroke="none">ॐ</text></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.4 8.4 0 1 0 10.5 10.5z"/><circle cx="17.2" cy="6.6" r=".7"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7.4h16M4 12h10.6M4 16.6h16"/><circle cx="18.4" cy="12" r="1"/></symbol>
    <symbol id="i-pen" viewBox="0 0 24 24"><path d="M18.1 4.7c1.3 2.5.6 5.6-1.6 7.8-1.9 1.9-4.5 2.9-6.8 2.6.3-2.3 1.3-4.9 3.2-6.8 1.9-1.9 4.1-2.4 5.2-3.6z"/><path d="m9.9 15.9-4.6 4.6"/><path d="M14.2 8.2 11.9 10.5M11.9 12.9 9.6 15.2"/></symbol>
    <symbol id="i-video" viewBox="0 0 24 24"><path d="M4.4 6.5h15.2v11H4.4z"/><path d="M9.9 9.7l4.3 2.3-4.3 2.3z"/><path d="M7 9.5v5M17 9.5v5"/></symbol>
    <symbol id="i-send" viewBox="0 0 24 24"><path d="M4 12 20 4.6 15.4 20 12 13.6z"/><path d="m12 13.6 8-9"/><circle cx="6.4" cy="15.6" r=".6"/></symbol>
    <defs><radialGradient id="gGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd79a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd79a" stop-opacity="0"/></radialGradient></defs>
  </svg>`;
  const AI_ICON = {
      home: 'home', book: 'library', chat: 'feed', exam: 'exam', heart: 'seva', user: 'me',
      flame: 'puja', cal: 'panjika', target: 'quiz', bag: 'market',
      om: 'om', gita: 'gita', dan: 'track', lekha: 'notes',
      posts: 'posts', reels: 'reels', chats: 'chats'
    };
  const aiFile = n => `icons/ai/${AI_ICON[n]}-${S.theme === 'light' ? 'light' : 'dark'}.png`;
  const aiIco = (n, cls) => `<img class="aico ${cls || ''}" src="${aiFile(n)}" alt="" aria-hidden="true"/>`;
  const vico = (n, cls) => `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const ico = (n, cls) => (AI_ICON[n] && cls !== 'xs')
      ? aiIco(n, cls)
      : `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const qico = n => AI_ICON[n]
      ? `<img class="qai" src="${aiFile(n)}" alt="" aria-hidden="true"/>`
      : `<span class="qi">${ico(n)}</span>`;
  const FLAME = (w, h) => `<svg class="flame" width="${w || 30}" height="${h || 42}" viewBox="0 0 34 46" fill="none" aria-hidden="true">
      <ellipse class="glow" cx="17" cy="16" rx="14" ry="14" fill="url(#gGlow)"/>
      <path class="f2" d="M17 3c4.2 5.6 6.4 9.8 6.4 13.1 0 4-2.9 6.6-6.4 8.5-3.5-1.9-6.4-4.5-6.4-8.5C10.6 12.8 12.8 8.6 17 3Z" fill="#ffb347"/>
      <path class="f1" d="M17 8.6c2.4 3.3 3.6 5.7 3.6 7.6 0 2.3-1.6 3.9-3.6 5-2-1.1-3.6-2.7-3.6-5 0-1.9 1.2-4.3 3.6-7.6Z" fill="#fff3cd"/>
      <path d="M8.6 32h16.8l-2 9.6H10.6L8.6 32Z" fill="#8a5a2a" stroke="#d7a94f" stroke-width=".9"/>
    </svg>`;
  const themeBtn = () => `<button class="iconbtn hbtn hbtn-theme" data-act="toggleTheme" aria-label="${S.theme === 'light' ? 'ডার্ক মোডে যান' : 'লাইট (পাটা) মোডে যান'}" title="${S.theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড'}">
        ${ico(S.theme === 'light' ? 'moon' : 'sun', 'sm')}</button>`;
  const settingsBtn = (cls) => `<button class="iconbtn hbtn hbtn-set ${cls || ''}" data-act="setPopupOpen" aria-label="সেটিংস" title="সেটিংস">${vico('setgear', 'hsetico-v')}</button>`;
  const searchBtn = (cls) => `<button class="iconbtn hbtn hbtn-search ${cls || ''}" data-act="searchOpen" aria-label="সার্চ" title="সার্চ"><img class="hsearch-ai" src="icons/ai/search-maroon.png" alt="" aria-hidden="true"/></button>`;
