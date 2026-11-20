/* ==========================================================================
   ১৭. চ্যাট পেজ
   ফাইল: js/views/chat.js
   ========================================================================== */
  function chatScreen(id) {
      const c = (DB.feed.chats || []).find(x => x.id === id);
      if (!c) return feedScreen();
      const msgs = (S.chatMsgs || {})[id] || [];
      const all = c.msgs.concat(msgs);
      return `${appbar(c.name, 'চ্যাট · সনাতন বিদ্যাপীঠ', '#/feed', false, true)}
      <div class="pad" style="padding-top:0">
        <div class="chatbox">
          ${all.map(m => `<div class="bub ${m.me ? 'me' : ''}">
            ${!m.me && m.who ? `<div class="bubwho">${esc(m.who)}</div>` : ''}${esc(m.t)}</div>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <input class="input" id="chatDraft" placeholder="বার্তা লিখুন…" value="${esc(U.chatDraft)}" style="flex:1"/>
          <button class="btn gold" data-act="chatSend" data-id="${c.id}" style="width:56px;padding:0">${vico('send', 'sm')}</button>
        </div>
        <button class="btn ghost block mt" data-act="nav" data-to="#/feed">‹ সব চ্যাট</button>
      </div><div style="height:20px"></div>`;
    }
