/* ==========================================================================
   অ্যাপের সব সেটিংস ও ডেটা (state) · localStorage-এ svp_* কী
   ফাইল: js/core/10-state.js
   ========================================================================== */
  const mem = {};
  const store = {
      get(k, d) { try { const r = localStorage.getItem('svp_' + k); return r ? JSON.parse(r) : (k in mem ? mem[k] : d); } catch (e) { return k in mem ? mem[k] : d; } },
      set(k, v) { mem[k] = v; try { localStorage.setItem('svp_' + k, JSON.stringify(v)); } catch (e) { } }
    };
  function seedActivity() {
      const out = {};
      for (let i = 6; i >= 0; i--) { const d = new Date(TODAY); d.setDate(d.getDate() - i); out[key(d)] = [42, 68, 100, 55, 26, 0, 0][6 - i] || 0; }
      return out;
    }
  const S = {
      name: store.get('name', 'সৌরভ চক্রবর্তী'),
      theme: store.get('theme', 'light'),
      bg: store.get('bg', true),
      sound: store.get('sound', false),
      motion: store.get('motion', true),
      font: store.get('font', 17),
      streak: store.get('streak', 11),
      savedReels: store.get('savedReels', {}),
      audioVol: store.get('audioVol', 80),
      reelMute: store.get('reelMute', false),
      rituals: store.get('rituals', {}),
      ritualRewards: store.get('ritualRewards', {}),
      read: store.get('read', {}),
      pdfBooks: store.get('pdfBooks', []),
      lastVerse: store.get('lastVerse', { book: 'gita', idx: 2 }),
      bookmarks: store.get('bookmarks', []),
      attempts: store.get('attempts', []),
      lessons: store.get('lessons', { nityakarma: [0, 1, 2] }),
      puja: store.get('puja', {}),
      deva: store.get('deva', {}),
      raised: store.get('raised', {}),
      orders: store.get('orders', []),
      provider: store.get('provider', null),
      activity: store.get('activity', seedActivity()),
      chapters: store.get('chapters', [1, 2, 3, 4]),
      role: store.get('role', 'student'),
      children: store.get('children', [{ n: 'আরাধ্যা', cls: 'শ্রেণি ৫', pct: 45 }, { n: 'ঈশান', cls: 'শ্রেণি ৩', pct: 72 }]),
      userState: store.get('userState', {}),
      appState: store.get('appState', {}),
      reportState: store.get('reportState', {}),
      payoutAppr: store.get('payoutAppr', {}),
      audit: store.get('audit', []),
      japa: store.get('japa', { mantra: 'om-namah', count: 0, rounds: 0 }),
      sessions: store.get('sessions', []),
      asanaDone: store.get('asanaDone', {}),
      daily: store.get('daily', {}),
      script: store.get('script', 'bn'),
      notes: store.get('notes', []),
      socialLikes: store.get('socialLikes', {}),
      chatMsgs: store.get('chatMsgs', {}),
      notifyOn: store.get('notifyOn', false),
      notifiedKey: store.get('notifiedKey', ''),
      festSeen: store.get('festSeen', '')
    };
  const save = k => store.set(k, S[k]);
  const U = {
      libQ: '', libCat: 'সব', libSeg: 'books',
      marketQ: '', marketCat: 'সব', gitaQ: '',
      quiz: null, quizTimer: null, adminTab: 'users', adminQ: '',
      sadhanaTab: 'japa',
      med: { mins: 10, left: 600, running: false, phase: '' }, medTimer: null,
      seq: { i: 0, left: 20, running: false }, seqTimer: null,
      panjika: { y: TODAY.getFullYear(), m: TODAY.getMonth() + 1, day: TODAY_KEY, view: 'bn', by: null, bm: null, all: false },
      noteQ: '', noteTag: 'সব', noteCtx: null,
      note: { text: '', tags: [], ctx: null, edit: null },
      sheet: false,
      feedTab: 'posts', chatId: null, chatDraft: ''
    };
