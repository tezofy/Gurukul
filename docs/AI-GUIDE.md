# সনাতন বিদ্যাপীঠ — অ্যাপের ম্যাপ (AI ও ডেভেলপারের জন্য)

> এই ফাইলটাই এই প্রজেক্টের “ঠিকানা বই”। কোনো AI-কে শুধু **এই লিংক + একটি কমান্ড** দিলেই
> সে বুঝে নিতে পারবে কোন কাজে কোন ফাইল ছুঁতে হবে।
> বাংলা মন্তু/ভেরিয়েবলের নাম ইচ্ছাকৃত — কোডের ভেতরের ভাষাও বাংলা।

---

## ১. এক নজরে

| | |
|---|---|
| ধরন | একক-পাতার (SPA) PWA, কোনো বিল্ড টুল ছাড়া — সোজা HTML/CSS/JS |
| চলার জায়গা | `index.html` খুললেই চলে (`file://`-এও চলে, সার্ভারে হলে আরও ভালো) |
| ভাষা | বাংলা UI, ইংরেজি কোড-কি |
| ডেটা | সব ব্রাউজারেই — `localStorage` (ছোট সেটিংস) + `IndexedDB` (বড় ফাইল) |
| থিম | লাইট (পাটা) + ডার্ক — `document.documentElement.dataset.theme` |
| রুট | হ্যাশ-রাউটার: `#/home`, `#/library`, `#/puja`, `#/panjika` … |

### ফোল্ডার

```
app/
├── index.html            ← সব স্ক্রিপ্ট/স্টাইল এখানে যুক্ত হয়
├── sw.js                 ← offline cache (নতুন কিছু যোগ করলে CACHE নাম বদলান)
├── css/
│   ├── app.css           ← মূল স্টাইল (লেআউট, কার্ড, বাটন, থিম ভেরিয়েবল)
│   └── reference.css     ← রেফারেন্স-ভিত্তিক অংশ: পূজা-মঞ্চ, PDF, ভয়েস, FAB
├── js/
│   ├── app.js            ← ⚠️ স্বয়ংক্রিয়ভাবে জোড়া লাগানো ফাইল (হাতে বদলাবেন না)
│   ├── core/             ← ভিত্তি (নিচে তালিকা)
│   ├── views/            ← পেজগুলো (স্ক্রিন)
│   ├── features/         ← কাজ করা ইঞ্জিন (পূজা-মঞ্চ, PDF, কুইজ)
│   ├── data.js           ← বই, পূজা, পঞ্জিকা, প্রোভাইডার — সব কনটেন্ট
│   ├── puja-darpana.js   ← ২০ দেবতার পূজা-ধাপ ও মন্ত্র
│   ├── aarti.js · nad.js ← আরতি ও নাদ (শব্দ)
│   ├── voice.js          ← বাংলা কণ্ঠ (VOICE)
│   ├── bgm.js            ← মন্দির-সংগীত (BGM)
│   ├── gita*.js          ← গীতার বাংলা অনুবাদ/কথা/বক্তা
│   └── jyotish.js        ← জ্যোতিষ গণনা
├── icons/  audio/  img/  fonts/  vendor/   ← ছবি, শব্দ, ফন্ট, pdf.js
├── build/                ← app.js জোড়া লাগানোর স্ক্রিপ্ট (build.py)
└── docs/                 ← এই গাইড ও ডেটা-স্টোরেজের নিয়ম
```

---

## ২. কোন কাজে কোন ফাইল (সবচেয়ে দরকারি তালিকা)

### পেজ (স্ক্রিন) — `js/views/`
| পেজ | ফাইল | রুট | ভেতরের ফাংশন |
|---|---|---|---|
| হোম / মন্দির | `home.js` | `#/home` | `homeScreen()` |
| লাইব্রেরি | `library.js` | `#/library` | `libraryScreen()`, `bookCards()` |
| গীতা | `gita.js` | `#/gita`, `#/gita/2` | `gitaScreen()`, `gitaChapterScreen()` |
| শ্লোক পড়া | `reader.js` | `#/reader/gita/0` | `readerScreen()` |
| কোর্স · পরীক্ষা | `courses.js` | `#/exam`, `#/quiz` | `examScreen()`, `quizScreen()` |
| পূজা তালিকা | `puja.js` | `#/puja` | `pujaScreen()` |
| এক দেবতার পূজা | `features/puja-temple.js` | `#/puja/deva/<id>` | `devaPujaScreen()` |
| রিলস | `reels.js` | `#/reels` | `reelsScreen()` |
| পঞ্জিকা | `panjika.js` | `#/panjika` | `panjikaScreen()`, `panjikaSub()` |
| সেবা (দান) | `seva.js` | `#/seva` | `sevaScreen()` |
| সেবা-কাজ | `market.js` | `#/market` | `marketScreen()` |
| আমি | `me.js` | `#/me` | `prefCard()` |
| সেটিংস | `settings.js` | `#/settings` | `settingsScreen()`, `meScreen()` |
| সাধনা | `sadhana.js` | `#/sadhana` | `sadhanaScreen()`, `japaView()` |
| ব্যবস্থাপনা | `manage.js` | `#/manage` | `manageScreen()` |
| দৈনিক হিসাব | `track.js` | `#/track` | `trackScreen()` |
| ফিড | `feed.js` | `#/feed` | `feedScreen()` |
| চ্যাট | `chat.js` | `#/feed/chat/<id>` | `chatScreen()` |
| নোট | `notes.js` | `#/notes` | `notesScreen()` |
| **ফাইল স্টোরেজ** | `storage.js` | `#/storage`, `#/file/<key>` | `storageScreen()`, `mediaViewScreen()` |
| PDF | `features/pdf.js` | `#/library/pdf` | `pdfLibraryScreen()`, `pdfReaderScreen()` |
| কণ্ঠ সেটিংস | `core/80-theme.js` | `#/voice` | `voiceScreen()` |

### ভিত্তি — `js/core/`
| কাজ | ফাইল |
|---|---|
| সংখ্যা/তারিখ/esc-এর হেল্পার (`bn`, `esc`, `key`) | `00-utils.js` |
| সব সেটিংস ও ডেটা (`S`, `store`, `save`) | `10-state.js` |
| স্ক্রিনের সাময়িক অবস্থা (`U`) | *১০-state.js-এরই অংশ* |
| আইকন/SVG (`ico`, `vico`, `SPRITE`) | `20-icons.js` |
| `toast`, `chime`, `burst` | `30-feedback.js` |
| তিথি/নক্ষত্র/সূর্যোদয়/বঙ্গাব্দ | `40-panjika-core.js` |
| পেজের মাথার বার | `50-layout.js` |
| সার্চ ইঞ্জিন | `60-search.js` |
| ＋ প্যানেল (হিসাব/নোট শিট) | `70-sheet.js` |
| **ফাইল স্টোরেজ ইঞ্জিন (`MEDIA`)** | `72-media.js` |
| রাউটার (`route`, `TABS`) | `75-router.js` |
| থিম · কণ্ঠ · ভয়েস-বার | `80-theme.js` |
| সব বাটনের কাজ (`ACTIONS`) | `85-actions.js` |
| ক্লিক/ইনপুট/কীবোর্ড ধরা | `86-bindings.js` |
| হেডার-টিকার | `88-tickers.js` |
| `render()` ও `init()` | `90-render-init.js` |

---

## ৩. সাধারণ কাজ — ঠিক কোথায় হাত দেবেন

**একটি নতুন পেজ যোগ করা**
1. `js/views/আমার-পেজ.js` বানান, ভেতরে `function myScreen() { return `${appbar('শিরোনাম','উপশিরোনাম')} …`; }`
2. `build/manifest.json`-এ ফাইলের নাম যোগ করুন
3. `js/core/75-router.js`-এ `case 'mine': html = myScreen(); tab='library'; break;`
4. `python3 build/build.py` → `js/app.js` নতুন করে তৈরি হবে

**একটি বাটনের কাজ যোগ করা**
`js/core/85-actions.js` → `ACTIONS` অবজেক্টে `আমারকাজ: el => { … }` লিখুন।
HTML-এ: `<button data-act="আমারকাজ" data-কিছু="মান">`

**নতুন দেবতা / পূজা-ধাপ** → `js/puja-darpana.js` (ধাপ, মন্ত্র), ছবি → `icons/deva/<id>.png` ও `icons/deva/card/<id>.png`

**নতুন বই / অডিও / পঞ্জিকা-তথ্য** → `js/data.js`

**নতুন স্টাইল** → আগে `css/reference.css` (অ্যাপের রেফারেন্স-অংশ), সাধারণ লেআউট হলে `css/app.css`

**থিম-রঙ বদলানো** → `css/app.css`-এর `:root` ও `[data-theme="dark"]` ভেরিয়েবল

**ক্যাশ/আপডেট** — নতুন কিছু ঠিক করার পর:
`index.html`-এ `?v=` বাড়ান, `sw.js`-এ `CACHE = 'sanatana-v109-…'` বদলান।

---

## ৪. ডেটা কোথায় জমা থাকে

| কী | কোথায় | কী-নাম |
|---|---|---|
| নাম, থিম, পছন্দ | localStorage | `svp_name`, `svp_theme`, `svp_bg` … |
| পূজার অগ্রগতি | localStorage | `svp_deva`, `svp_puja` |
| নোট, বুকমার্ক | localStorage | `svp_notes`, `svp_bookmarks` |
| ভয়েস/সংগীত | localStorage | `svp_voicePrefs`, `svp_bgm` |
| PDF বই (নিজের) | IndexedDB `svp-pdf` | store `files` |
| **ছবি/গান/ভিডিও/PDF (স্টোরেজ)** | IndexedDB `svp-media` | store `files` + তালিকা `svp_mediaFiles` |

বিস্তারিত: `docs/DATA-STORAGE.md`

---

## ৫. যা মেনে চলতে হবে (নিয়ম)

1. **সব UI লেখা বাংলায়**, সংখ্যা বাংলা অঙ্কে (`bn()` দিয়ে)।
2. **লাইট ও ডার্ক দুটোতেই** দেখতে হবে — রঙ কখনো হার্ডকোড নয়, `var(--…)` ব্যবহার করুন।
3. **ফ্ল্যাটেনড স্ক্রিনশট** দিয়ে UI বানানো যাবে না; লেয়ার/কার্ড/আইকন আলাদা থাকবে।
4. **পূজার ক্রম**: আগে **ধাপ**, তারপর সেই ধাপের **মন্ত্র**।
5. **কোনো ডেটা সার্ভারে পাঠানো যাবে না** — সব ডিভাইসেই থাকবে।
6. বাটনে সবসময় `data-act` (কীবোর্ডেও চলে), ছবিতে `alt`, বাটনে `aria-label`।
7. `js/app.js` হাতে সম্পাদনা করবেন না — শুধু `js/**` ফাইলগুলোতে কাজ করুন, শেষে `build.py`।
8. পুরনো ডেটা নষ্ট হবে না — নতুন কী যোগ করলে `store.get('নতুন', ডিফল্ট)` দিয়ে পড়ুন।

---

## ৬. চালানো ও যাচাই

```bash
# লোকাল সার্ভার (মোবাইল থেকে একই Wi-Fi-তে)
python3 -m http.server 8001
# তারপর: http://<কম্পিউটারের-IP>:8001/

# app.js নতুন করে জোড়া লাগানো
python3 build/build.py
```

আপলোডের আগে দ্রুত পরীক্ষা: হোম → পূজা → পঞ্জিকা → লাইব্রেরি → সেটিংস → স্টোরেজ —
প্রতিটি পেজ খুলছে কি না, কনসোলে এরর আছে কি না।
