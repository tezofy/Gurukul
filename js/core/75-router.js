/* ==========================================================================
   রাউটার · কোন #/লিংকে কোন পেজ দেখাবে (TABS, route)
   ফাইল: js/core/75-router.js
   ========================================================================== */
  const TABS = [
      { id: 'home', icon: 'home', label: 'মন্দির', target: '#/home' },
      { id: 'library', icon: 'book', label: 'লাইব্রেরি', target: '#/library' },
      { id: 'feed', icon: 'chat', label: 'ফিড', target: '#/feed' },
      { id: 'exam', icon: 'exam', label: 'পরীক্ষা', target: '#/exam' },
      { id: 'me', icon: 'user', label: 'আমি', target: '#/me' }
    ];
  const tabIco = (n, on) => `<img class="tabai ${on ? 'on' : 'off'}" src="icons/ai/tab/${AI_ICON[n]}-${on ? 'on' : 'off'}.png" alt="" aria-hidden="true"/>`;
  function renderTabbar(active) {
      document.getElementById('tabbar').innerHTML = TABS.map(t => `
        <button class="tab ${active === t.id ? 'on' : ''}" data-act="nav" data-to="${t.target}" aria-label="${t.label}" ${active === t.id ? 'aria-current="page"' : ''}>
          <span class="tbox"><img class="tabai" src="icons/reference/nav-${t.id}${S.theme === 'dark' ? '-dark' : ''}.png?v=clean3" alt="" aria-hidden="true"/><span class="tlabel">${t.label}</span></span></button>`).join('');
    }
  function route() {
      const raw = (location.hash || '#/home').replace(/^#\/?/, '');
      const parts = raw.split('/').filter(Boolean);
      const name = parts[0] || 'home';
      const a = parts[1], b = parts[2];
      let html = '', tab = 'home', root = false;

      switch (name) {
        case 'home': html = homeScreen(); tab = 'home'; root = true; break;
        case 'library':
          if (a === 'pdf') { html = b ? pdfReaderScreen(b) : pdfLibraryScreen(); tab = 'library'; root = !b; }
          else { html = libraryScreen(); tab = 'library'; root = true; }
          break;
        case 'pdf': html = pdfLibraryScreen(); tab = 'library'; root = true; break;
      case 'storage': html = storageScreen(a); tab = 'library'; root = !a; break;
      case 'file': html = mediaViewScreen(a); tab = 'library'; break;
        case 'book': html = bookScreen(a); tab = 'library'; break;
        case 'gita': html = a ? gitaChapterScreen(a) : gitaScreen(); tab = 'library'; root = !a; break;
        case 'reader': html = readerScreen(a, b); tab = 'library'; break;
        case 'courses': html = coursesScreen(); tab = 'library'; break;
        case 'course': html = courseScreen(a); tab = 'library'; break;
        case 'exam': html = examScreen(); tab = 'exam'; root = true; break;
        case 'quiz': html = quizScreen(); tab = 'exam'; break;
        case 'result': html = resultScreen(); tab = 'exam'; break;
        case 'puja':
          if (a === 'deva') html = devaPujaScreen(b);
          else html = a ? pujaGuideScreen(a) : pujaScreen();
          tab = 'home'; break;
        case 'panjika': html = a ? panjikaSub(a) : panjikaScreen(); tab = 'home'; break;
        case 'feed':
          if (a === 'reel') { html = reelScreen(b); tab = 'feed'; }
          else { html = feedScreen(a === 'chat' ? b : null); tab = 'feed'; root = !a; }
          break;
        case 'reels': html = a ? reelVideoScreen(a) : reelsScreen(); tab = 'home'; root = !a; break;
        case 'reelsch': html = chanListScreen(); tab = 'home'; break;
        case 'reelssaved': html = savedReelsScreen(); tab = 'home'; break;
        case 'notes': html = notesScreen(); tab = 'home'; break;
        case 'note': html = noteComposerScreen(); tab = 'home'; break;
        case 'settings': html = settingsScreen(); tab = 'me'; break;
        case 'voice': html = voiceScreen(); tab = 'me'; break;
        case 'seva': html = sevaScreen(); tab = 'seva'; root = true; break;
        case 'market': html = marketScreen(); tab = 'seva'; break;
        case 'me': html = meScreen(); tab = 'me'; root = true; break;
        case 'manage': html = manageScreen(); tab = 'me'; break;
        case 'track': html = (a === 'history') ? historyScreen() : trackScreen(); tab = 'me'; break;
        case 'sadhana':
          if (a === 'seq') { html = seqScreen(); tab = 'home'; }
          else { if (a) U.sadhanaTab = a; html = sadhanaScreen(); tab = 'home'; }
          break;
        default: html = homeScreen(); tab = 'home'; root = true;
      }

      clearInterval(U.quizTimer); U.quizTimer = null;
      clearInterval(U.medTimer); U.medTimer = null;
      clearInterval(U.seqTimer); U.seqTimer = null;
      const view = document.getElementById('view');
      const _keep = U.keepTop === location.hash ? view.scrollTop : 0;
      U.keepTop = null;
      view.innerHTML = html;
      view.scrollTop = _keep;
      try { hydrateArt(); } catch (e) {}
      document.querySelector('.shell').classList.toggle('sub', !root);
      renderTabbar(tab);
      if (name === 'reels' && !a) attachReelScroll();
      if (name === 'reels' && a) { attachFeedScroll(); attachFeedPlay(); }
      if (name === 'quiz' && U.quiz) startQuizTimer();
      if (name === 'sadhana' && a !== 'seq' && U.sadhanaTab === 'dhyana' && U.med.running) medStart();
      if (name === 'sadhana' && a === 'seq' && U.seq.running) seqStart();
    }
