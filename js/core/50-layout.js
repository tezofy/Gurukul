/* ==========================================================================
   উপরের বার (appbar) — প্রতিটি পেজের মাথার শিরোনাম
   ফাইল: js/core/50-layout.js
   ========================================================================== */
  function appbar(title, subText, backTo, withTheme, subBelow) {
      return `<header class="appbar"><div class="row">
        ${backTo ? `<button class="iconbtn" data-act="nav" data-to="${backTo}" aria-label="ফিরে যান">${ico('back')}</button>` : ''}
        <div style="flex:1;min-width:0">
          ${subText && !subBelow ? `<div class="eyebrow">${subText}</div>` : ''}
          <h3>${title}</h3>
          ${subText && subBelow ? `<div class="sub">${subText}</div>` : ''}
        </div>
        ${withTheme ? settingsBtn() : ''}</div></header>`;
    }
