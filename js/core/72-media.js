/* ==========================================================================
   ফাইল-স্টোরেজ (MEDIA) — নিজের PDF · ছবি · গান · ভিডিও অ্যাপের ভেতরে রাখা
   --------------------------------------------------------------------------
   কী রাখে:  ফাইলটা নিজে IndexedDB-তে (তাই বড় ফাইলেও চলে, localStorage ভরে না)।
   কী দেখায়: ধরন (kind) ধরে ভাগ — pdf | image | audio | video | other
   কোথায় থাকে: ব্রাউজারের ডেটাবেস 'svp-media' → store 'files'

   বাইরে থেকে ব্যবহার (ব্রাউজার কনসোল বা অন্য ফাইলে):
     await MEDIA.add(file)            → ফাইল যোগ, রেকর্ড ফেরত
     await MEDIA.addFiles(fileList)   → একসাথে অনেক ফাইল
     MEDIA.list({kind:'pdf'})         → তালিকা (নতুন আগে)
     MEDIA.get(key)                   → {bytes, ...}  (Blob/ArrayBuffer)
     MEDIA.url(key)                   → తాৎক্ষণিক ব্লব-লিংক (ছবি/অডিও/ভিডিওর জন্য)
     MEDIA.setMusic(key)              → এই গানটাই ব্যাকগ্রাউন্ড সংগীত হবে
     MEDIA.remove(key)                → মুছে ফেলা
     MEDIA.usage()                    → কত জায়গা নিচ্ছে (আনুমানিক)
   ========================================================================== */
(function () {
  'use strict';

  const DB_NAME = 'svp-media';
  const STORE = 'files';
  const LIST_KEY = 'mediaFiles';          /* তালিকা localStorage-এ (কেবল তথ্য) */
  const KIND_ORDER = ['pdf', 'image', 'audio', 'video', 'other'];
  const KIND_BN = { pdf: 'PDF', image: 'ছবি', audio: 'গান', video: 'ভিডিও', other: 'অন্যান্য' };
  /* আইকন: ইমোজি নয় — বাংলা আদ্যক্ষর (সব ডিভাইসে একই দেখায়) */
  const KIND_ICON = { pdf: 'প', image: 'ছ', audio: 'গ', video: 'ভ', other: 'অ' };

  let _db = null;
  function db() {
    if (_db) return Promise.resolve(_db);
    return new Promise((res, rej) => {
      if (!('indexedDB' in window)) return rej(new Error('no-idb'));
      const rq = indexedDB.open(DB_NAME, 1);
      rq.onupgradeneeded = () => {
        const d = rq.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'key' });
      };
      rq.onsuccess = () => { _db = rq.result; res(_db); };
      rq.onerror = () => rej(rq.error);
    });
  }

  function readList() {
    try { return JSON.parse(localStorage.getItem('svp_' + LIST_KEY) || '[]') || []; }
    catch (e) { return []; }
  }
  function writeList(list) {
    try { localStorage.setItem('svp_' + LIST_KEY, JSON.stringify(list)); } catch (e) { }
  }

  function kindOf(f) {
    const t = (f.type || '').toLowerCase(), n = (f.name || '').toLowerCase();
    if (t.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
    if (t.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif|svg)$/.test(n)) return 'image';
    if (t.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|opus|flac)$/.test(n)) return 'audio';
    if (t.startsWith('video/') || /\.(mp4|webm|mov|mkv|m4v)$/.test(n)) return 'video';
    return 'other';
  }

  const pretty = name => String(name || '')
    .replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' ').trim() || 'ফাইল';

  const sizeTxt = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB'
    : b > 1024 ? Math.round(b / 1024) + ' KB' : b + ' B';

  async function put(key, rec, bytes) {
    const d = await db();
    return new Promise((res, rej) => {
      const tx = d.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ key, title: rec.title, type: rec.type, bytes });
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  }

  async function add(file) {
    if (!file) return null;
    const kind = kindOf(file);
    const key = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const rec = {
      key, kind, title: pretty(file.name), file: file.name, type: file.type || '',
      size: file.size || bytes.length, at: Date.now()
    };
    try { await put(key, rec, bytes); } catch (e) { }
    const list = readList(); list.unshift(rec); writeList(list);
    return rec;
  }

  async function addFiles(files) {
    const out = [];
    for (const f of [...(files || [])]) {
      const r = await add(f);
      if (r) out.push(r);
    }
    return out;
  }

  function list(opt) {
    const k = opt && opt.kind;
    return readList().filter(r => !k || k === 'all' || r.kind === k)
      .sort((a, b) => (b.at || 0) - (a.at || 0));
  }

  async function get(key) {
    try {
      const d = await db();
      return await new Promise((res, rej) => {
        const rq = d.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        rq.onsuccess = () => res(rq.result || null);
        rq.onerror = () => rej(rq.error);
      });
    } catch (e) { return null; }
  }

  const _urls = {};
  async function url(key) {
    if (_urls[key]) return _urls[key];
    const rec = await get(key);
    if (!rec || !rec.bytes) return '';
    const blob = new Blob([rec.bytes], { type: rec.type || 'application/octet-stream' });
    _urls[key] = URL.createObjectURL(blob);
    return _urls[key];
  }

  async function remove(key) {
    try {
      const d = await db();
      const tx = d.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
    } catch (e) { }
    if (_urls[key]) { try { URL.revokeObjectURL(_urls[key]); } catch (e) { } delete _urls[key]; }
    writeList(readList().filter(r => r.key !== key));
    return true;
  }

  function usage() {
    const all = readList();
    return {
      count: all.length,
      bytes: all.reduce((s, r) => s + (r.size || 0), 0),
      by: KIND_ORDER.reduce((o, k) => { o[k] = all.filter(r => r.kind === k).length; return o; }, {})
    };
  }

  /* গান → ব্যাকগ্রাউন্ড সংগীত (BGM-কে ব্লব-লিংক দিয়ে দেওয়া) */
  async function setMusic(key) {
    const rec = (await get(key));
    if (!rec) return false;
    const u = await url(key);
    if (!u) return false;
    if (window.BGM) {
      BGM.clearCustom();               /* আগের ফাইল/YouTube বন্ধ */
      BGM.setUseYT(false);
      BGM.setCustom(u);
    }
    localStorage.setItem('svp_bgmFileKey', key);
    localStorage.setItem('svp_bgmFileName', rec.title);
    return true;
  }

  window.MEDIA = {
    add, addFiles, list, get, url, remove, usage, setMusic,
    kindOf, KIND_ORDER, KIND_BN, KIND_ICON, sizeTxt, readList
  };
})();
