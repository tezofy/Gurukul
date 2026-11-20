/* ==========================================================================
   ১৬. ফিড — পোস্ট ও রিলস
   ফাইল: js/views/feed.js
   ========================================================================== */
  const feedLike = id => !!(S.socialLikes && S.socialLikes[id]);
  function reelScreen(id) {
      const F = DB.feed || { reels: [] };
      const list = F.reels || [];
      if (!list.length) return feedScreen();
      let i = list.findIndex(r => r.id === id);
      if (i < 0) i = U.reel ? U.reel.i : 0;
      const r = list[i];
      const on = feedLike(r.id);
      return `${appbar(r.title, r.sub + ' · ' + r.views, '#/feed', false, true)}
      <div class="pad" style="padding-top:0">
        <div class="reelplayer" style="--tint:${r.tint}">
          <div class="rp-bar"><i style="animation-duration:${U.reelPaused ? '0s' : '32s'};animation-play-state:${U.reelPaused ? 'paused' : 'running'}"></i></div>
          <div class="rp-head"><span class="pill">${esc(r.ref || 'রিলস')}</span><span class="tiny">${bn(i + 1)}/${bn(list.length)}</span></div>
          <div class="rp-body">
            ${r.lines.map((l, n) => `<div class="rp-line" style="animation-delay:${n * 35}ms">${esc(l)}</div>`).join('')}
          </div>
          <div class="rp-acts">
            <button class="pact ${on ? 'on' : ''}" data-act="feedLike" data-id="${r.id}">${vico('heart', 'sm')}${on ? 'ভালো লেগেছে' : 'ভালো লাগল'}</button>
            <button class="pact" data-act="reelSpeak" data-id="${r.id}">${vico('play', 'sm')}শুনুন</button>
            <button class="pact" data-act="reelPause">${U.reelPaused ? 'চালু করুন' : 'বিরতি'}</button>
          </div>
        </div>
        <div style="display:flex;gap:9px;margin-top:12px">
          <button class="btn ghost" style="flex:1" data-act="reelStep" data-d="-1" ${i === 0 ? 'disabled' : ''}>আগের</button>
          <button class="btn gold" style="flex:1.2" data-act="reelStep" data-d="1">${i === list.length - 1 ? 'প্রথম রিল' : 'পরের রিল'}</button>
        </div>
        <div class="sect"><h4>আরও রিলস</h4><div class="line"></div></div>
        <div class="reelgrid">${list.filter((_, n) => n !== i).map(x => `
          <button class="reel" data-act="reelPlay" data-id="${x.id}" style="--tint:${x.tint}">
            <span class="rl-ico">${vico('play', 'sm')}</span><span class="rl-len">${esc(x.len)}</span>
            <span class="rl-txt"><b>${esc(x.title)}</b><i>${esc(x.sub)}</i></span></button>`).join('')}</div>
      </div><div style="height:20px"></div>`;
    }
  function feedScreen(chatId) {
      const F = DB.feed || { posts: [], reels: [], chats: [] };
      if (chatId) return chatScreen(chatId);
      const t = U.feedTab;
      const tabs = [['posts', 'পোস্ট'], ['reels', 'রিলস'], ['chats', 'চ্যাট']];
      const unread = F.chats.reduce((a, c) => a + (c.unread || 0), 0);

      let body = '';
      if (t === 'posts') {
        body = F.posts.map(p => {
          const on = feedLike(p.id);
          return `<div class="card pad postcard">
            <div style="display:flex;gap:9px;align-items:center">
              <span class="avatar">${esc(p.name.slice(0, 1))}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12.4px;font-weight:600">${esc(p.name)}</div>
                <div class="tiny muted">${esc(p.role)} · ${esc(p.when)}</div>
              </div>
              <span class="tiny" style="color:var(--gold-300)">${esc(p.tag || '')}</span>
            </div>
            <p class="posttext">${esc(p.text)}</p>
            <div class="postacts">
              <button class="pact ${on ? 'on' : ''}" data-act="feedLike" data-id="${p.id}">${vico('heart', 'sm')}${bn(p.liked + (on ? 1 : 0))}</button>
              <button class="pact" data-act="toast" data-msg="মন্তব্য শীঘ্রই আসছে">${vico('chat', 'sm')}${bn(p.cmt)}</button>
              <button class="pact" data-act="toast" data-msg="লিংক কপি হয়েছে">${vico('send', 'sm')}শেয়ার</button>
            </div>
          </div>`;
        }).join('');
      } else if (t === 'reels') {
        body = `<div class="reelgrid">${F.reels.map(r => `
          <button class="reel" data-act="reelPlay" data-id="${r.id}" style="--tint:${r.tint}">
            <span class="rl-ico">${vico('play', 'sm')}</span>
            <span class="rl-len">${esc(r.len)}</span>
            <span class="rl-txt"><b>${esc(r.title)}</b><i>${esc(r.sub)} · ${esc(r.views)}</i></span>
          </button>`).join('')}</div>`;
      } else {
        body = F.chats.map(c => `<button class="card rowcard chatrow" data-act="chatOpen" data-id="${c.id}">
            <span class="avatar">${esc(c.name.slice(0, 1))}</span>
            <div style="flex:1;min-width:0;text-align:left">
              <div class="kv"><span style="font-size:12.4px;font-weight:600">${esc(c.name)}</span>
                <span class="tiny muted">${esc(c.when)}</span></div>
              <div class="tiny muted" style="margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.last)}</div>
            </div>
            ${c.unread ? `<span class="pill ok">${bn(c.unread)}</span>` : ''}
          </button>`).join('');
      }

      return `${appbar('সমাজ · ফিড', 'পোস্ট · রিলস · চ্যাট — সনাতন পরিবারের সঙ্গে জুড়ে থাকুন', '#/home', true, true)}
      <div class="pad" style="padding-top:0">
        <div class="segment">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-act="feedSeg" data-t="${k}">${ico(k, 'seg')}<span>${l}${k === 'chats' && unread ? ' · ' + bn(unread) : ''}</span></button>`).join('')}</div>
        <div class="mt">${body}</div>
        ${t === 'posts' ? `<button class="btn ghost block mt" data-act="toast" data-msg="নতুন পোস্ট লেখার সুবিধা শীঘ্রই আসছে">${ico('pen', 'sm')} নিজের পোস্ট লিখুন</button>` : ''}
        <p class="tiny muted" style="text-align:center;margin-top:12px;line-height:1.7">এটি ডেমো ফিড — আসল সমাজ-মঞ্চে পোস্ট, রিলস ও চ্যাট যোগ হবে যাচাই করা সদস্যদের জন্য।</p>
      </div><div style="height:20px"></div>`;
    }
