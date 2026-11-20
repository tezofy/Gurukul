# ডেটা স্টোরেজ — কোথায় কী রাখা হয়, কীভাবে বাড়ানো যায়

অ্যাপটি **সম্পূর্ণ ক্লায়েন্ট-সাইড**। কোনো সার্ভার নেই, কোনো অ্যাকাউন্ট লাগে না।
সব ডেটা ব্যবহারকারীর ব্রাউজারেই থাকে। দুই স্তরে ভাগ করা:

---

## ১. `localStorage` — ছোট সেটিংস ও তালিকা

সব কী `svp_` দিয়ে শুরু, ভেতরে JSON। পড়া/লেখার হেল্পার: `js/core/10-state.js` → `store.get()`, `store.set()`, `save()`।

| কী | কী রাখে |
|---|---|
| `svp_name` | ব্যবহারকারীর নাম |
| `svp_theme` / `svp_bg` / `svp_motion` / `svp_sound` | লাইট/ডার্ক, আবহ, অ্যানিমেশন, শব্দ |
| `svp_streak` / `svp_activity` / `svp_chapters` | ধারাবাহিকতা, দৈনিক সক্রিয়তা |
| `svp_read` / `svp_bookmarks` / `svp_lastVerse` | পড়ার অগ্রগতি ও বুকমার্ক |
| `svp_notes` | নোট (ট্যাগ, তারিখ, উৎস-শ্লোক) |
| `svp_puja` / `svp_deva` / `svp_rituals` | পূজা ও নিত্যকর্মের অগ্রগতি |
| `svp_attempts` / `svp_quizzes` | কুইজের ফল |
| `svp_pdfBooks` | নিজের PDF-এর তালিকা (ফাইল নিজে IndexedDB-তে) |
| `svp_voicePrefs` / `svp_speakMode` | কণ্ঠের গতি, স্বর, মোড |
| `svp_bgm` | সংগীত: `{vol, on, muted, custom, useYT}` |
| `svp_bgmFileKey` / `svp_bgmFileName` | স্টোরেজের কোন গানটি সংগীত হিসেবে বাছা |
| `svp_mediaFiles` | **ফাইল-স্টোরেজের তালিকা** (নাম, ধরন, আকার — ফাইল নিজে নয়) |
| `svp_raised` / `svp_orders` / `svp_provider` | দান ও সেবা-কাজ |
| `svp_seen` / `svp_themeLight2` | একবার-দেখানো বার্তা, মাইগ্রেশন-ফ্ল্যাগ |

> সীমা: ব্রাউজারপ্রতি প্রায় ৫ MB। **বড় ফাইল এখানে রাখা যায় না** — তার জন্য IndexedDB।

---

## ২. `IndexedDB` — বড় ফাইল (PDF, ছবি, গান, ভিডিও)

### ক) `svp-media` — ফাইল স্টোরেজ  ·  `js/core/72-media.js` (`window.MEDIA`)
| অংশ | মান |
|---|---|
| DB নাম | `svp-media` |
| Store | `files` (keyPath: `key`) |
| প্রতিটি রেকর্ড | `{key, title, file, type, kind, size, at}` + `bytes` (Uint8Array) |
| ধরন (`kind`) | `pdf` · `image` · `audio` · `video` · `other` |

**API** (যেকোনো ফাইল বা কনসোল থেকে):
```js
await MEDIA.add(file)              // একটি ফাইল → রেকর্ড
await MEDIA.addFiles(fileList)     // একসাথে অনেক
MEDIA.list({kind:'audio'})         // তালিকা (নতুন আগে)
await MEDIA.get(key)               // {bytes, …}
await MEDIA.url(key)               // blob: লিংক (ছবি/অডিও/ভিডিও দেখাতে)
await MEDIA.setMusic(key)          // এই গানটি ব্যাকগ্রাউন্ড সংগীত হবে
await MEDIA.remove(key)            // মুছে ফেলা
MEDIA.usage()                      // {count, bytes, by}
```
পেজ: `#/storage` (সব), `#/storage/pdf|image|audio|video`, `#/file/<key>`।
ফাইল যোগ: স্টোরেজ পেজের “＋ ফাইল যোগ করুন” বাটন → `#medFile` ইনপুট।

### খ) `svp-pdf` — PDF রিডারের নিজস্ব কপি  ·  `js/features/pdf.js`
`pdfPut/pdfGet/pdfDel` — PDF লাইব্রেরি থেকে যোগ করা বই এখানে থাকে, যাতে অফলাইনেও পড়া যায়।

---

## ৩. নতুন ডেটা যোগ করার নিয়ম

1. ছোট (কয়েক KB) → `localStorage`, `S.নতুনজিনিস = store.get('নতুনজিনিস', ডিফল্ট)`।
2. বড়/ফাইল → `MEDIA.add()` (বা নিজের IndexedDB স্টোর)।
3. সবসময় **ডিফল্ট মান** দিন — পুরনো ব্যবহারকারীর ডেটা যেন না ভাঙে।
4. সংবেদনশীল কিছু (পাসওয়ার্ড, টোকেন) এখানে রাখবেন না — এগুলো এনক্রিপ্টেড নয়।
5. ব্যবহারকারীকে বোঝান: “সব ডেটা এই ডিভাইসেই”। ব্রাউজার ডেটা মুছলে ফাইলও মুছে যায় —
   তাই জরুরি ফাইলের আলাদা কপি রাখতে বলুন।

---

## ৪. ব্যাকআপ ও পরিষ্কার করা

* ব্যবহারকারীর জন্য: সেটিংস → **ডেমো ডেটা রিসেট** → `localStorage`-এর সব `svp_*` মুছে রিলোড।
* শুধু ফাইল-স্টোরেজ খালি করতে: `#/storage` → প্রতিটি কার্ডে “মুছুন”।
* কোড থেকে সব মুছতে:
  ```js
  for (const k of Object.keys(localStorage)) if (k.startsWith('svp_')) localStorage.removeItem(k);
  indexedDB.deleteDatabase('svp-media'); indexedDB.deleteDatabase('svp-pdf');
  ```
* ব্রাউজারের কোটা শেষ হলে `MEDIA.add` নীরবে ব্যর্থ হতে পারে — `MEDIA.usage()` দেখে জানানো ভালো।
