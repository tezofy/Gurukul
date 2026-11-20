/* ==========================================================================
   ACTIONS — সব বাটনের কাজ এক জায়গায় (data-act)
   ফাইল: js/core/85-actions.js
   ========================================================================== */
  const ACTIONS = {
    /* ---- ফাইল-স্টোরেজ ---- */
    mediaTab: el => { location.hash = '#/storage' + (el.dataset.k === 'all' ? '' : '/' + el.dataset.k); render(); },
    mediaOpen: async el => { location.hash = '#/file/' + el.dataset.key; render(); },
    mediaRemove: async el => {
      if (!confirm('এই ফাইলটা মুছে ফেলবেন?')) return;
      await MEDIA.remove(el.dataset.key); toast('ফাইল মুছে ফেলা হলো'); render();
    },
    mediaMusic: async el => {
      const ok = await MEDIA.setMusic(el.dataset.key);
      toast(ok ? 'এই গানটাই এখন মন্দির-সংগীত ♪' : 'গানটি চালু করা যায়নি');
    },
      bgmToggle: () => {
        if (!window.BGM) return;
        const st = BGM.state();
        if (st.muted) BGM.unmute(); else if (st.on && st.playing) BGM.pause(); else BGM.play();
        toast(!BGM.state().muted && BGM.state().on ? 'মন্দির-সংগীত চলছে ♪' : 'মন্দির-সংগীত বন্ধ');
      },
      bgmMute: () => { if (window.BGM) { BGM.mute(); save('bgmNoticeOff', true); toast('সংগীত মিউট হলো — আবার চালু করতে চাপুন'); } },
      bgmVol: el => { if (window.BGM) BGM.setVol(Number(el.value) / 100); const b = document.getElementById('bgmVolTxt'); if (b) b.textContent = el.value + '%'; },
      bgmPlay: () => { if (window.BGM) { BGM.play(); toast('সংগীত চালু ♪'); } },
      bgmDefault: () => {
        if (!window.BGM) return;
        BGM.setUseYT(false); BGM.clearCustom();
        const t = document.getElementById('bgmSrcNow'); if (t) t.textContent = 'মন্দির-সংগীত (অ্যাপের নিজস্ব)';
        toast('অ্যাপের নিজস্ব মন্দির-সংগীত চালু ♪');
      },
      bgmYT: () => {
        if (!window.BGM) return;
        BGM.clearCustom(); BGM.setUseYT(true); BGM.play();
        const t = document.getElementById('bgmSrcNow'); if (t) t.textContent = BGM.YT.title + ' · ' + BGM.YT.by;
        toast('মঙ্গলম্ ভগবান বিষ্ণু মন্ত্র চলছে ♪');
      },
      bgmLink: () => {
        const url = prompt('গানের সরাসরি অডিও লিংক (mp3/m4a/ogg — পেজের লিংক নয়):', window.BGM ? (BGM.customNow() || '') : '');
        if (!url) return;
        if (window.BGM) { BGM.setCustom(url.trim()); toast('লিংকের গান চালু ♪'); }
        const t = document.getElementById('bgmSrcNow'); if (t) t.textContent = 'লিংক: ' + url.trim().split('/').pop();
      },
      bgmFilePicked: el => {
        const f = el.files && el.files[0];
        if (!f || !window.BGM) return;
        const url = URL.createObjectURL(f);
        BGM.setCustom(url);
        try { /* পরেরবারের জন্য নাম মনে রাখা */ localStorage.setItem('svp_bgm_custom', JSON.stringify({ name: f.name, size: f.size, at: Date.now() })); } catch (e) { }
        const t = document.getElementById('bgmSrcNow'); if (t) t.textContent = 'নিজের গান: ' + f.name;
        toast('“' + f.name + '” বাজছে ♪');
      },
      voiceStop: () => { if (window.VOICE) VOICE.stop(); },
      voicePause: () => { if (window.VOICE) VOICE.toggle(); },
      voiceDemo: el => speak('আজ সন্ধ্যায় প্রদীপ জ্বালিয়ে আমরা শান্ত মনে ভগবানের নাম করব। মা সরস্বতীর কৃপায় জ্ঞান ও বাণী সবার জীবনে জেগে উঠুক।', { mode: el.dataset.mode || 'normal', label: 'কণ্ঠ পরীক্ষা' }),
      voiceMode: el => { VOICE.set('mode', el.dataset.m); saveVoice(); render(); speak('ওঁ শান্তিঃ শান্তিঃ শান্তিঃ।', { mode: el.dataset.m, label: 'নমুনা' }); },
      voicePick: el => { VOICE.set('voice', el.dataset.v); saveVoice(); render(); speak('মা সরস্বতীর কৃপায় জ্ঞান জাগুক।', { mode: stmtMode(), label: 'নমুনা' }); },
      voiceRate: el => { VOICE.set('rate', Number(el.value) / 100); saveVoice(); const b = document.getElementById('vsRate'); if (b) b.textContent = el.value + '%'; },
      voicePitch: el => { VOICE.set('pitch', Number(el.value) / 100); saveVoice(); const b = document.getElementById('vsPitch'); if (b) b.textContent = el.value + '%'; },
      voiceBreath: el => { VOICE.set('breath', el.checked); saveVoice(); },
      voicePauses: el => { VOICE.set('pauses', el.checked); saveVoice(); },
      voiceReset: () => { ['rate', 'pitch', 'voice', 'breath', 'pauses', 'mode'].forEach(k => VOICE.set(k, k === 'voice' ? 'auto' : k === 'breath' || k === 'pauses' ? true : k === 'mode' ? 'normal' : 1)); saveVoice(); render(); toast('ডিফল্ট কণ্ঠে ফেরা হলো'); },
      pdfOpen: el => { location.hash = '#/library/pdf/' + encodeURIComponent(el.dataset.key); render(); },
      pdfRemove: el => pdfRemove(el.dataset.key),
      pdfAdd: () => { const i = document.getElementById('pdfFile'); if (i) i.click(); },
      pdfPage: el => { const d = Number(el.dataset.d); pdfRender(PDFVIEW.num + d).catch(() => { }); },
      pdfZoom: el => { PDFVIEW.scale = Math.max(0.6, Math.min(3, PDFVIEW.scale + Number(el.dataset.d) * 0.2)); pdfRender(PDFVIEW.num).catch(() => { }); },
      pdfWidth: () => { PDFVIEW.scale = 1; pdfRender(PDFVIEW.num).catch(() => { }); },
      pdfSave: () => { const b = pdfStore().find(x => x.key === PDFVIEW.key); if (b) { b.page = PDFVIEW.num; b.at = Date.now(); save('pdfBooks'); toast('পৃষ্ঠা ' + bn(PDFVIEW.num) + ' সেভ ✓'); } },
      nav: el => { closeSheet(); location.hash = el.dataset.to; },
      feedSeg: el => { U.feedTab = el.dataset.t; U.chatId = null; render(); },
      feedLike: el => {
        S.socialLikes = S.socialLikes || {};
        const id = el.dataset.id;
        S.socialLikes[id] = !S.socialLikes[id];
        save('socialLikes'); chime('soft'); render();
      },
      reelPlay: el => { U.reelPaused = false; location.hash = '#/feed/reel/' + el.dataset.id; render(); },
      reelPause: el => { U.reelPaused = !U.reelPaused; render(); },
      reelStep: el => {
        const list = (DB.feed && DB.feed.reels) || [];
        const cur = (location.hash.split('/')[3] || '');
        let i = list.findIndex(r => r.id === cur);
        if (i < 0) i = 0;
        const n = (i + (+el.dataset.d) + list.length) % list.length;
        U.reelPaused = false;
        location.hash = '#/feed/reel/' + list[n].id; render();
      },
      reelSpeak: el => {
        const r = ((DB.feed && DB.feed.reels) || []).find(x => x.id === el.dataset.id);
        if (r) speak(r.title + '। ' + r.lines.join('। '), { mode: 'story' });
      },
      speakStop: () => { try { VOICE.stop(); toast('উচ্চারণ থামানো হলো'); } catch (e) {} },
      notifyAsk: () => askNotify(),
      markFestSeen: () => { S.festSeen = TODAY_KEY; save('festSeen'); render(); },
      chatOpen: el => { U.chatId = el.dataset.id; location.hash = '#/feed/chat/' + el.dataset.id; render(); },
      chatSend: el => {
        const inp = document.getElementById('chatDraft');
        const v = (inp ? inp.value : '').trim();
        if (!v) { toast('বার্তা লিখুন'); return; }
        const id = el.dataset.id;
        S.chatMsgs = S.chatMsgs || {};
        (S.chatMsgs[id] = S.chatMsgs[id] || []).push({ me: true, t: v });
        save('chatMsgs'); U.chatDraft = ''; render(); toast('বার্তা পাঠানো হলো');
      },
      bpOpen: el => { location.hash = '#/reels/' + el.dataset.id; },
      reelsMore: () => { U.reelsN = (U.reelsN || 30) + 30; render(); },
      reelSound: el => {
        S.reelMute = !S.reelMute; save('reelMute');
        el.textContent = reelSoundOn() ? '🔊 শব্দ চালু' : '🔇 নীরব';
        const sec = document.querySelector('#rfeed .rsec[data-playing="1"]');
        if (sec) { sec.dataset.playing = '0'; activateFeedSection(sec); }
        toast(reelSoundOn() ? 'শব্দ চালু হয়েছে 🔊' : 'নীরব মোড 🔇');
      },
      reelPlay2: el => {
        const id = el.dataset.id;
        const box = el.closest('.rvp');
        if (!box) return;
        const sec0 = el.closest('.rsec');
        S.reelMute = false; save('reelMute');
        if (sec0) { const b = el.closest('.rsec'); b.dataset.playing = '0'; activateFeedSection(b); }
        else {
          box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1"
            title="রিলস" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        }
      },
      reelSave: el => {
        const id = el.dataset.id;
        const all = bpList();
        const r = all.find(x => x[0] === id) || [];
        S.savedReels = S.savedReels || {};
        const ch = chOf(r);
        S.savedReels[id] = { t: r[1] || 'রিলস', ch: ch ? ch[0].trim() : 'রিলস', ts: Date.now() };
        save('savedReels');
        el.classList.add('on'); el.textContent = '✓ সেভ হয়েছে';
        toast('রিলস সেভ হয়েছে — “সেভ করা” তালিকায় পাবেন');
      },
      reelUnsave: el => {
        const id = el.dataset.id;
        if (S.savedReels) { delete S.savedReels[id]; save('savedReels'); }
        toast('তালিকা থেকে মুছে ফেলা হলো'); render();
      },
      reelThumb: el => {
        const id = el.dataset.id;
        const a = document.createElement('a');
        a.href = 'https://i.ytimg.com/vi/' + id + '/oar2.jpg';
        a.download = 'reel-' + id + '.jpg';
        a.target = '_blank'; a.rel = 'noopener';
        fetch(a.href, { mode: 'cors' }).then(res => {
          if (!res.ok) throw new Error('x');
          return res.blob();
        }).then(blob => {
          const url = URL.createObjectURL(blob);
          a.href = url; a.target = '';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          toast('ছবি ডাউনলোড হচ্ছে ⤓');
        }).catch(() => {
          document.body.appendChild(a); a.click(); a.remove();
          toast('ছবিটি নতুন ট্যাবে খুলছে — চেপে ধরে সেভ করুন');
        });
      },
      reelCopy: el => {
        const id = el.dataset.id, url = BP_YT(id);
        const done = () => toast('লিংক কপি হয়েছে');
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => toast(url));
          else { toast(url); }
        } catch (e) { toast(url); }
      },
      reelsShuffle: () => { U.reelSeed = Math.floor(Math.random() * 1e9) + 1; _bpOrder = null; _bpLen = 0; U.reelsN = 30; render(); },
      reelCh: el => {
        U.reelCh = +el.dataset.i; U.reelsN = 30;
        if (location.hash !== '#/reels') location.hash = '#/reels'; else render();
      },
      reelCat: el => {
        U.reelCat = el.dataset.c; U.reelCh = -1; U.reelsN = 30;
        if (location.hash !== '#/reels') location.hash = '#/reels'; else render();
      },
      sheetOpen: () => openSheet(),
      /* ---- পূজা দর্পণ ---- */
      devaOffer: el => offerStep(el.dataset.id, el.dataset.k),
      pujaExit: () => {
        if (location.hash !== '#/puja') location.hash = '#/puja';
        render();
        toast('পূজা তালিকায় ফেরা হলো');
      },
      bellRing: () => {
        /* বাটন নিজে নড়ে না — মন্দিরের ঝোলানো ঘণ্টা দুটোই দোলে */
        bellTone(1);
        document.querySelectorAll('.m-bell, .temple-bell').forEach(b => {
          b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring');
        });
      },
      nad: el => toggleNad(el, el.dataset.k),
      nadStop: () => nadStopAll(),
      ytPlay: el => openYt(el.dataset.id || el.closest('[data-aarti]').dataset.aarti),
      ytClose: () => { closeYt(); toast('ইউটিউব প্লেয়ার বন্ধ'); },
      pujaAarti: el => openAarti(el.dataset.id),
      aartiPlay: el => aartiToggle(el.dataset.id || el.closest('[data-aarti]').dataset.aarti),
      aartiClose: () => { closeAarti(); toast('আরতি শেষ — জয় মা'); },
      devaReset: el => {
        S.deva[devaKey(el.dataset.id)] = []; save('deva');
        U.keepTop = location.hash;
        toast('পূজা আবার শুরু হলো');
        render();
      },
      sheetTab: el => { U.sheetTab = el.dataset.t === 'note' ? 'note' : 'hisab'; openSheet(); },
      sheetClose: () => closeSheet(),
      /* ---- নোট ---- */
      noteNew: () => {
        closeSheet();
        U.note = { text: '', tags: [], ctx: null, edit: null };
        location.hash = '#/note'; render();
      },
      noteFromReader: el => {
        const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
        const i = Math.max(0, Math.min(+el.dataset.i || 0, b.texts.length - 1));
        const t = b.texts[i];
        U.note = { text: '', tags: [], ctx: { book: b.id, idx: i, ch: t.ch, v: t.v }, edit: null };
        location.hash = '#/note'; render();
      },
      openNotes: () => { U.noteTag = 'সব'; location.hash = '#/notes'; render(); },
      noteFilter: el => { U.noteTag = el.dataset.t; render(); },
      noteTag: el => {
        const t = el.dataset.t, arr = U.note.tags || (U.note.tags = []);
        const i = arr.indexOf(t);
        if (i >= 0) arr.splice(i, 1); else arr.push(t);
        render();
      },
      noteTagAdd: () => {
        const inp = document.getElementById('noteTagNew');
        const v = (inp ? inp.value : '').trim().replace(/^#/, '');
        if (!v) { toast('ট্যাগের নাম লিখুন'); return; }
        const arr = U.note.tags || (U.note.tags = []);
        if (!arr.includes(v)) arr.push(v);
        render();
      },
      noteCtxClear: () => { U.note.ctx = null; render(); },
      noteSave: () => {
        const ta = document.getElementById('noteText');
        const text = (ta ? ta.value : U.note.text || '').trim();
        if (!text) { toast('আগে কিছু লিখুন'); if (ta) ta.focus(); return; }
        const d = key(new Date());
        if (U.note.edit) {
          const i = S.notes.findIndex(n => n.id === U.note.edit);
          if (i >= 0) S.notes[i] = { ...S.notes[i], t: text, tags: U.note.tags.slice(), ctx: U.note.ctx, d };
          toast('নোট বদলানো হলো');
        } else {
          S.notes.unshift({ id: Date.now(), t: text, tags: U.note.tags.slice(), ctx: U.note.ctx || null, d });
          toast('নোট রাখা হলো ✍');
        }
        save('notes'); chime('tick');
        U.note = { text: '', tags: [], ctx: null, edit: null };
        location.hash = '#/notes'; render();
      },
      noteEdit: el => {
        const n = S.notes.find(x => String(x.id) === String(el.dataset.id));
        if (!n) return;
        U.note = { text: n.t, tags: (n.tags || []).slice(), ctx: n.ctx || null, edit: n.id };
        location.hash = '#/note'; render();
      },
      noteEditCancel: () => {
        U.note = { text: '', tags: [], ctx: null, edit: null };
        location.hash = '#/notes'; render();
      },
      noteDel: el => {
        if (!window.confirm('এই নোটটি মুছে ফেলবেন?')) return;
        S.notes = S.notes.filter(x => String(x.id) !== String(el.dataset.id));
        save('notes'); toast('নোট মুছে ফেলা হলো'); render();
      },
      noteGo: el => { location.hash = '#/reader/' + el.dataset.b + '/' + el.dataset.i; },
      toast: el => toast(el.dataset.msg || ''),
      dailyTasksOpen: () => openDailyTasks(),
      dailyTasksClose: () => closeDailyTasks(),
      dailyTaskToggle: el => { const i = el.dataset.i; ACTIONS.ritual(el); const row = document.querySelector(`#dailyTaskPop [data-i="${i}"]`); if (row) row.focus(); },
      dailyTaskGo: () => { closeDailyTasks(); location.hash = '#/sadhana'; },
      ritual: el => {
        const i = +el.dataset.i;
        if (!Number.isInteger(i) || i < 0 || i > 2) return;
        const arr = (S.rituals[TODAY_KEY] || [false, false, false]).slice();
        // Existing checked tasks predate reward bookkeeping; regard them as already rewarded.
        const rewards = S.ritualRewards[TODAY_KEY] || { tasks: arr.slice(), complete: arr.every(Boolean) };
        arr[i] = !arr[i];
        S.rituals[TODAY_KEY] = arr; save('rituals');
        if (arr[i] && !rewards.tasks[i]) { rewards.tasks[i] = true; bumpActivity(8); }
        if (arr[i]) chime('tick');
        if (arr.every(Boolean) && !rewards.complete) {
          rewards.complete = true; chime('complete'); bumpActivity(15);
          setTimeout(() => { burst(window.innerWidth / 2, 200, 22); toast('আজকের সাধনা সম্পূর্ণ 🌸'); }, 150);
        }
        S.ritualRewards[TODAY_KEY] = rewards; save('ritualRewards');
        render();
      },
      seg: el => { U.libSeg = el.dataset.s; render(); },
      audioCat: el => { U.audioCat = el.dataset.c; render(); },
      audioSrc: el => { U.audioSrc = el.dataset.s; U.audioCat = 'all'; render(); },
      audioPlay: el => { U.audioId = el.dataset.id; apStart(el.dataset.id); render(); },
      audioStop: () => { U.audioId = null; apStop(); },
      apToggle: () => { apToggle(); },
      apJump: el => { apJump(+el.dataset.s); },
      apNext: () => { apStep(1); },
      apPrev: () => { apStep(-1); },
      apStop: () => apStop(),
      apSpeed: () => apSpeed(),
      audioStep: el => {
        const list = DB.gitaAudio || [];
        if (!AP.id) { if (list[0]) { U.audioId = list[0].id; apStart(list[0].id); render(); } return; }
        let i = list.findIndex(x => x.id === AP.id);
        if (i < 0) i = 0;
        i = (i + (+el.dataset.d) + list.length) % list.length;
        U.audioId = list[i].id; apStart(list[i].id); render();
      },
      cat: el => { U.libCat = el.dataset.c; render(); },
      mcat: el => { U.marketCat = el.dataset.c; render(); },
      chapter: el => {
        const n = +el.dataset.n;
        if (S.chapters.includes(n)) toast(`অধ্যায় ${bn(n)} আবার পড়ুন`);
        else toast(`অধ্যায় ${bn(n)} এখনো খোলা হয়নি — আগে ${bn(Math.max(...S.chapters) + 1)} সম্পূর্ণ করুন`);
      },
      font: el => {
        S.font = Math.max(14, Math.min(24, S.font + (+el.dataset.d) * 1)); save('font'); render();
      },
      themeSet: el => { setTheme(el.dataset.v); render(); },
      toggleTheme: () => {
        const next = S.theme === 'light' ? 'dark' : 'light';
        setTheme(next); render();
        toast(next === 'light' ? 'লাইট মোড (পাটা-থিম) চালু ☀' : 'ডার্ক মোড চালু 🌙');
      },
      /* হেডারের সেটিংস বাটন: পপ হয়ে ছোট পপআপ খোলে */
      setPopupOpen: el => {
        const b = el.closest('.hbtn-set') || el;
        b.classList.add('popping');
        if (S.sound) chime('soft');
        setTimeout(() => { b.classList.remove('popping'); openSetPop(); }, 200);
      },
      setPopupClose: () => closeSetPop(),
      /* সার্চ পপআপ */
      searchDateGo: el => {
        const info = parseSearchDate(el.dataset.k);
        if (!info || info.invalid) return;
        U.panjika.day = info.key; U.panjika.y = info.date.getFullYear(); U.panjika.m = info.date.getMonth() + 1;
        const bd = bengaliDate(info.date); U.panjika.by = bd.year; U.panjika.bm = bd.m;
        closeSearchPop();
        if (location.hash === '#/panjika/daily') render(); else location.hash = '#/panjika/daily';
      },
      homeVoiceSearch: () => toggleHomeVoice(),
      homeSearchClear: () => { const input = document.getElementById('homeSearch'); if (input) { input.value = ''; updateHomeSearch(input); input.focus(); } },
      searchOpen: () => openSearchPop(),
      searchClose: () => closeSearchPop(),
      searchGo: el => {
        const to = el.dataset.to;
        const homeResults = document.getElementById('homeSearchResults'); if (homeResults) homeResults.hidden = true;
        closeSearchPop();
        if (to) { location.hash = to; }
      },
      toggleBg: () => { S.bg = !S.bg; save('bg'); applyBg(); render(); toast(S.bg ? 'পটভূমি থিম চালু' : 'পটভূমি থিম বন্ধ'); },
      toggleSound: () => { S.sound = !S.sound; save('sound'); if (S.sound) chime('soft'); render(); },
      toggleMotion: () => {
        S.motion = !S.motion; save('motion');
        document.documentElement.classList.toggle('no-motion', !S.motion); render();
      },
      toggleName: () => {
        const n = prompt('আপনার নাম লিখুন', S.name);
        if (n && n.trim()) { S.name = n.trim().slice(0, 40); save('name'); render(); toast('নাম সংরক্ষিত'); }
      },
      bookmark: el => {
        const i = +el.dataset.i;
        const id = (location.hash.split('/')[2]) || 'gita';
        const k = `${id}:${i}`;
        const at = S.bookmarks.indexOf(k);
        if (at >= 0) { S.bookmarks.splice(at, 1); toast('বুকমার্ক সরানো হলো'); }
        else { S.bookmarks.push(k); toast('বুকমার্কে যোগ হয়েছে'); chime('soft'); }
        save('bookmarks'); render();
      },
      markread: el => {
        const i = +el.dataset.i;
        const id = (location.hash.split('/')[2]) || 'gita';
        S.read[`${id}:${i}`] = true; save('read');
        S.lastVerse = { book: id, idx: i }; save('lastVerse');
        bumpActivity(6);
        const gita = DB.books.find(b => b.id === id);
        if (gita && gita.texts[i] && gita.texts[i].ch > Math.max(...S.chapters) && S.chapters.length < 18) {
          S.chapters.push(gita.texts[i].ch); save('chapters');
        }
        chime('tick'); toast('পাঠ সম্পন্ন ✓ · +৬ মিনিট');
        render();
      },
      lesson: el => {
        const id = el.dataset.id, i = +el.dataset.i;
        const arr = (S.lessons[id] || []).slice();
        const at = arr.indexOf(i);
        if (at >= 0) arr.splice(at, 1); else { arr.push(i); chime('tick'); bumpActivity(10); }
        S.lessons[id] = arr; save('lessons'); render();
      },
      pujaStep: el => {
        const id = el.dataset.id, i = +el.dataset.i;
        const k = id + ':' + TODAY_KEY;
        const arr = (S.puja[k] || []).slice();
        const at = arr.indexOf(i);
        if (at >= 0) arr.splice(at, 1); else { arr.push(i); chime('tick'); bumpActivity(4); }
        S.puja[k] = arr; save('puja');
        const total = (DB.pujas.find(p => p.id === id) || {}).steps.length;
        if (arr.length === total) { chime('complete'); setTimeout(() => { burst(window.innerWidth / 2, 200, 20); toast('পূজা সম্পূর্ণ 🌸'); }, 160); }
        render();
      },
      speak: el => speak(el.dataset.text || '', { mode: el.dataset.mode || 'normal', label: el.dataset.label || '' }),
      speakKatha: el => {
        const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
        const t = b.texts[+el.dataset.i];
        if (t && t.katha) speak(t.katha + (t.prayog ? ' জীবনে প্রয়োগ। ' + t.prayog : ''), { mode: 'story' });
      },
      speakFull: el => {
        const b = DB.books.find(x => x.id === 'gita') || DB.books[0];
        const t = b.texts[+el.dataset.i];
        if (t) speak([t.bn, t.arth, t.katha].filter(Boolean).join('। '), { mode: 'mantra' });
      },
      pmonth: el => {
        let { y, m } = U.panjika; m += +el.dataset.d;
        if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
        U.panjika.y = y; U.panjika.m = m; render();
      },
      pday: el => { U.panjika.day = el.dataset.k; render(); },
      pjsub: el => { location.hash = '#/panjika/' + el.dataset.s; },
      bbDay: el => {
        const st = jyState();
        const d = new Date(st.bday + 'T00:00:00'); d.setDate(d.getDate() + (+el.dataset.d));
        st.bday = key(d); render();
      },
      bbNow: () => { jyState().bday = TODAY_KEY; render(); },
      mdDay: el => {
        const st = jyState();
        const d = new Date(st.day + 'T00:00:00'); d.setDate(d.getDate() + (+el.dataset.d));
        st.day = key(d); render();
      },
      mdNow: () => { jyState().day = TODAY_KEY; render(); },
      pjall: el => { U.panjika.all = !U.panjika.all; render(); },
      pjday: el => {
        const d = new Date((U.panjika.day || TODAY_KEY) + 'T00:00:00');
        d.setDate(d.getDate() + (+el.dataset.d)); U.panjika.day = key(d); render();
      },
      pjnow: el => { U.panjika.day = TODAY_KEY; render(); },
      pjyear: el => { U.panjika.by += (+el.dataset.d); render(); },
      pjmonth: el => { U.panjika.by = +el.dataset.y; U.panjika.bm = +el.dataset.m; U.panjika.view = 'bn'; location.hash = '#/panjika'; render(); },
      scriptSet: el => { S.script = el.dataset.v; save('script'); render(); },
      pview: el => { U.panjika.view = el.dataset.v; render(); },
      pbm: el => {
        let y = U.panjika.by, m = U.panjika.bm + (+el.dataset.d);
        if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
        U.panjika.by = y; U.panjika.bm = m; render();
      },
      donate: el => {
        const id = el.dataset.id, amt = +el.dataset.amt;
        const c = DB.campaigns.find(x => x.id === id);
        const ok = confirm(`৳ ${bnN(amt)} দান নিশ্চিত করবেন?\n(${c.title})\n\nএটি ডেমো — কোনো বাস্তব পেমেন্ট হবে না।`);
        if (!ok) return;
        S.raised[id] = (S.raised[id] || 0) + amt; save('raised');
        S.orders.push({ kind: 'donation', title: c.title, amount: amt, status: 'সম্পন্ন', at: Date.now() }); save('orders');
        chime('complete'); burst(window.innerWidth / 2, window.innerHeight / 2, 18);
        const gitas = id === 'gita' ? Math.max(1, Math.round(amt / c.perUnit)) : 0;
        toast(gitas ? `গীতা দান গৃহীত 🙏 · ${bn(gitas)}টি গীতা ${bn(gitas)}টি পরিবারে পৌঁছাবে` : 'দানের জন্য ধন্যবাদ 🙏 · রিসিট সংরক্ষিত');
        render();
      },
      order: el => {
        const id = el.dataset.id;
        const p = (S.provider && S.provider.id === id) ? S.provider : DB.providers.find(x => x.id === id);
        const ok = confirm(`${p.name} — ৳ ${bnN(p.rate)} / ${p.rateLabel}\n\nবুকিং নিশ্চিত করবেন? (ডেমো — পেমেন্ট হবে না)`);
        if (!ok) return;
        S.orders.push({ kind: 'service', title: p.name + ' · ' + p.cat, amount: p.rate, status: 'এসক্রোতে', at: Date.now() });
        save('orders'); chime('soft'); toast('বুকিং তৈরি হয়েছে · এসক্রো সুরক্ষিত');
        render();
      },
      providerForm: () => {
        const name = prompt('আপনার নাম', S.name); if (!name) return;
        const cat = prompt('দক্ষতা / বিভাগ (টিউটর, পুরোহিত, গ্রাফিক্স, কথক)', 'গ্রাফিক্স'); if (!cat) return;
        const rate = parseInt(prompt('আপনার রেট (টাকায়)', '800'), 10) || 500;
        S.provider = { id: 'me', name: name.trim(), ini: name.trim().slice(0, 1), cat: cat.trim(), role: `${cat.trim()} · নিজের প্রোফাইল`, rate, rateLabel: 'কাজ', rating: 5, reviews: 0 };
        save('provider'); chime('complete'); toast('প্রোফাইল তৈরি হয়েছে ✓');
        render();
      },
      myProfile: () => {
        const e = S.orders.filter(o => o.kind === 'service').reduce((s, o) => s + o.amount, 0);
        toast(`মোট আয় ৳ ${bnN(e)} · আপনার শেয়ার ৳ ${bnN(Math.round(e * .85))}`);
      },
      quizStart: () => startQuiz(),
      pick: el => {
        U.quiz.answers[U.quiz.i] = +el.dataset.i;
        chime('soft'); render();
      },
      quizNext: () => { if (U.quiz.i < DB.quizzes.weekly.questions.length - 1) { U.quiz.i++; render(); } },
      quizPrev: () => { if (U.quiz.i > 0) { U.quiz.i--; render(); } },
      quizSubmit: () => {
        const answered = Object.keys(U.quiz.answers).length;
        if (answered < DB.quizzes.weekly.questions.length && !confirm(`আপনি ${bn(DB.quizzes.weekly.questions.length - answered)}টি প্রশ্নের উত্তর দেননি। তবুও জমা দেবেন?`)) return;
        submitQuiz();
      },
      tfield: el => {
        const k = el.dataset.k, d = +el.dataset.d;
        const e = entryFor(TODAY_KEY);
        const steps = { puja: 5, japaExtra: 1, dhyanaExtra: 5, pathMin: 5, daanTaka: 50, daanMin: 5,
          workMin: 15, income: 100, studyMin: 10, familyMin: 15, sleepH: 1, lies: 1, anger: 1 };
        const step = steps[k] || 1;
        let v = (e[k] || 0) + d * step;
        if (k === 'sleepH') v = clamp(v, 3, 12);
        else v = Math.max(0, v);
        e[k] = v; save('daily');
        if (d > 0 && (k === 'japaExtra' || k === 'puja')) chime('soft');
        render(); refreshSheet();
      },
      trackDone: () => {
        const e = entryFor(TODAY_KEY);
        const sc = scoreOf(e, todayAuto());
        e.done = true; save('daily');
        if (sc.total >= 60) { chime('complete'); setTimeout(() => burst(window.innerWidth / 2, 260, 24), 80); }
        else chime('tick');
        toast(`আজকের হিসাব সংরক্ষিত ✓ · স্কোর ${bn(sc.total)}/১০০`);
        render();
      },
      sadhanaTab: el => { U.sadhanaTab = el.dataset.t; location.hash = '#/sadhana/' + U.sadhanaTab; render(); },
      japaTap: () => japaTap(),
      japaReset: () => {
        if (!confirm('আজকের জপ গণনা রিসেট করবেন?')) return;
        S.japa.count = 0; save('japa'); japaUpdate(); toast('জপ গণনা রিসেট');
      },
      japaFinish: () => {
        const done = 108 - S.japa.count;
        S.japa.rounds += 1; S.japa.count = 0; save('japa');
        chime('complete'); bumpActivity(6);
        setTimeout(() => burst(window.innerWidth / 2, 260, 22), 60);
        toast(`মালা সম্পূর্ণ 🌸${done > 0 ? ' (বাকি ' + bn(done) + ' জপ গণ্য হলো)' : ''}`);
        japaUpdate(); render();
      },
      japaMantra: el => { S.japa.mantra = el.dataset.id; save('japa'); render(); },
      medPreset: el => {
        if (U.med.running && !confirm('চলমান ধ্যান বন্ধ করে সময় বদলাবেন?')) return;
        clearInterval(U.medTimer); U.medTimer = null;
        U.med = { mins: +el.dataset.m, left: +el.dataset.m * 60, running: false, phase: '' };
        render();
      },
      medToggle: () => {
        if (U.med.running) {
          clearInterval(U.medTimer); U.medTimer = null; U.med.running = false;
          toast('ধ্যান বিরতিতে'); render();
        } else { medStart(); chime('soft'); render(); }
      },
      medReset: () => {
        clearInterval(U.medTimer); U.medTimer = null;
        U.med.left = U.med.mins * 60; U.med.running = false;
        render(); toast('ধ্যান রিসেট');
      },
      asanaToggle: el => {
        const id = el.dataset.id;
        S.asanaDone[id] = !S.asanaDone[id]; save('asanaDone');
        if (S.asanaDone[id]) { chime('tick'); bumpActivity(1); }
        render();
      },
      seqToggle: () => {
        if (U.seq.running) { clearInterval(U.seqTimer); U.seqTimer = null; U.seq.running = false; render(); }
        else { seqStart(); render(); }
      },
      seqNext: () => {
        const st = DB.suryaNamaskar;
        if (U.seq.i < st.length - 1) { U.seq.i++; U.seq.left = st[U.seq.i].s; render(); }
        else { clearInterval(U.seqTimer); U.seq.running = false; U.seq.i = 0; U.seq.left = st[0].s; toast('শেষ ধাপ — আবার শুরু হলো'); render(); }
      },
      seqPrev: () => {
        const st = DB.suryaNamaskar;
        if (U.seq.i > 0) { U.seq.i--; U.seq.left = st[U.seq.i].s; render(); }
      },
      setRole: el => {
        S.role = el.dataset.r; save('role');
        logAction('ভূমিকা পরিবর্তন → ' + roleLabel(S.role));
        toast('এখন আপনি ' + roleLabel(S.role));
        render();
      },
      adminTab: el => { U.adminTab = el.dataset.t; render(); },
      uStatus: el => {
        S.userState[el.dataset.id] = el.dataset.v; save('userState');
        const u = DB.users.find(x => x.id === el.dataset.id);
        logAction((el.dataset.v === 'suspended' ? 'স্থগিত: ' : 'অনুমোদন: ') + (u ? u.name : ''));
        chime(el.dataset.v === 'active' ? 'complete' : 'tick');
        toast(el.dataset.v === 'suspended' ? 'ব্যবহারকারী স্থগিত করা হলো' : 'ব্যবহারকারী অনুমোদিত');
        render();
      },
      appDecide: el => {
        S.appState[el.dataset.id] = el.dataset.v; save('appState');
        const a = DB.applications.find(x => x.id === el.dataset.id);
        logAction((el.dataset.v === 'approved' ? 'আবেদন অনুমোদিত: ' : 'আবেদন বাতিল: ') + (a ? a.name : ''));
        chime(el.dataset.v === 'approved' ? 'complete' : 'tick');
        toast(el.dataset.v === 'approved' ? 'অনুমোদিত ✓ — প্রোফাইল প্রকাশ্যে এল' : 'আবেদন বাতিল হয়েছে');
        render();
      },
      repDecide: el => {
        S.reportState[el.dataset.id] = el.dataset.v; save('reportState');
        logAction((el.dataset.v === 'actioned' ? 'কনটেন্ট সরানো: ' : 'রিপোর্ট খারিজ: ') + el.dataset.id);
        toast(el.dataset.v === 'actioned' ? 'কনটেন্ট সরানো হয়েছে' : 'রিপোর্ট খারিজ');
        render();
      },
      payoutAppr: el => {
        const id = el.dataset.id;
        const base = DB.payouts.find(p => p.id === id).approvals;
        const cur = S.payoutAppr[id] !== undefined ? S.payoutAppr[id] : base;
        S.payoutAppr[id] = Math.min(2, cur + 1); save('payoutAppr');
        logAction('পেআউট অনুমোদন (' + S.payoutAppr[id] + '/২): ' + id);
        S.payoutAppr[id] >= 2 ? chime('complete') : chime('soft');
        toast(S.payoutAppr[id] >= 2 ? 'পেআউট রিলিজ হয়েছে ✓' : 'প্রথম অনুমোদন সম্পন্ন — আরও একজন দরকার');
        render();
      },
      addChild: () => {
        const n = prompt('সন্তানের নাম', ''); if (!n) return;
        const cls = prompt('শ্রেণি', 'শ্রেণি ৪') || '—';
        S.children.push({ n: n.trim(), cls: cls.trim(), pct: 0 });
        save('children'); toast('সন্তান যোগ হয়েছে'); render();
      },
      reset: () => {
        if (!confirm('সব ডেমো ডেটা (পাঠ, কুইজ, দান) রিসেট করবেন?')) return;
        try { Object.keys(localStorage).filter(k => k.startsWith('svp_')).forEach(k => localStorage.removeItem(k)); } catch (e) { }
        location.reload();
      }
    };
