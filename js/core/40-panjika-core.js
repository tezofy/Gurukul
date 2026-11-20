/* ==========================================================================
   পঞ্জিকা গণনা · তিথি, নক্ষত্র, সূর্যোদয়, বঙ্গাব্দ, আজকের পালনীয়
   ফাইল: js/core/40-panjika-core.js
   ========================================================================== */
  const P = DB.panjika;
  const DAY_MS = 86400000;
  const GEO = { lat: 23.8103, lon: 90.4125, tz: 6 };
  const RAD = Math.PI / 180;
  function sunTimes(dateKey) {
      const [y, mo, da] = dateKey.split('-').map(Number);
      const a = Math.floor((14 - mo) / 12), y2 = y + 4800 - a, m2 = mo + 12 * a - 3;
      const JDN = da + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
      const n = JDN - 2451545 + 0.0008, Jstar = n - GEO.lon / 360;
      const M = (357.5291 + 0.98560028 * Jstar) % 360;
      const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
      const lam = (M + C + 180 + 102.9372) % 360;
      const Jt = 2451545 + Jstar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lam * RAD);
      const dec = Math.asin(Math.sin(lam * RAD) * Math.sin(23.44 * RAD));
      const cosH = (Math.sin(-0.833 * RAD) - Math.sin(GEO.lat * RAD) * Math.sin(dec)) / (Math.cos(GEO.lat * RAD) * Math.cos(dec));
      const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / RAD;
      const cv = j => { const ms = (j - 2440587.5) * DAY_MS + GEO.tz * 3600000; const d = new Date(ms); return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60; };
      return { rise: cv(Jt - H / 360), set: cv(Jt + H / 360), noon: cv(Jt) };
    }
  const pjHM = m => { m = Math.round(((m % 1440) + 1440) % 1440); return bn(Math.floor(m / 60)) + ':' + bn(String(m % 60).padStart(2, '0')); };
  function muhurta(dateKey) {
      const t = sunTimes(dateKey), len = t.set - t.rise, part = len / 8;
      const wd = new Date(dateKey + 'T00:00:00').getDay();
      const R = [7, 1, 6, 4, 5, 3, 2][wd], Y = [4, 3, 2, 1, 0, 6, 5][wd], G = [6, 5, 4, 3, 2, 1, 0][wd];
      const sp = i => [t.rise + i * part, t.rise + (i + 1) * part];
      const mid = t.rise + len / 2;
      const r = sp(R), yg = sp(Y), gl = sp(G);
      return {
        sunrise: pjHM(t.rise), sunset: pjHM(t.set), noon: pjHM(t.noon),
        rahu: [pjHM(r[0]), pjHM(r[1])], yama: [pjHM(yg[0]), pjHM(yg[1])], guli: [pjHM(gl[0]), pjHM(gl[1])],
        abhijit: [pjHM(mid - 24), pjHM(mid + 24)],
        parana: [pjHM(t.rise), pjHM(t.rise + len / 4)],
        len
      };
    }
  const norm360 = x => ((x % 360) + 360) % 360;
  function jdLocal(dateKey, hoursLocal) {
      const [y, mo, da] = dateKey.split('-').map(Number);
      const a = Math.floor((14 - mo) / 12), y2 = y + 4800 - a, m2 = mo + 12 * a - 3;
      const JDN = da + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
      return JDN - 0.5 + (hoursLocal - GEO.tz) / 24;
    }
  function sunLon(T) {
      const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
      const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
      const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD) + 0.019993 * Math.sin(2 * M * RAD) + 0.000289 * Math.sin(3 * M * RAD);
      return norm360(L0 + C);
    }
  function moonLon(T) {
      const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
      const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
      const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
      const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
      const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T * T);
      return norm360(Lp
        + 6.288774 * Math.sin(Mp * RAD) + 1.274027 * Math.sin((2 * D - Mp) * RAD)
        + 0.658314 * Math.sin(2 * D * RAD) + 0.213618 * Math.sin(2 * Mp * RAD)
        - 0.185116 * Math.sin(M * RAD) - 0.114332 * Math.sin(2 * F * RAD)
        + 0.058793 * Math.sin((2 * D - 2 * Mp) * RAD) + 0.057066 * Math.sin((2 * D - M - Mp) * RAD)
        + 0.053322 * Math.sin((2 * D + Mp) * RAD) + 0.045758 * Math.sin((2 * D - M) * RAD)
        - 0.040923 * Math.sin((M - Mp) * RAD) - 0.034720 * Math.sin(D * RAD)
        - 0.030383 * Math.sin((M + Mp) * RAD));
    }
  function tithiIndex(dateKey, hoursLocal) {
      const T = (jdLocal(dateKey, hoursLocal) - 2451545) / 36525;
      return Math.floor(norm360(moonLon(T) - sunLon(T)) / 12) % 30;
    }
  function nakIndex(dateKey, hoursLocal) {
      const T = (jdLocal(dateKey, hoursLocal) - 2451545) / 36525;
      return Math.floor(norm360(moonLon(T)) / (360 / 27)) % 27;
    }
  function panjikaFor(dateKeyStr) {
      const mh = muhurta(dateKeyStr);
      const riseH = sunTimes(dateKeyStr).rise / 60;
      const ti = tithiIndex(dateKeyStr, riseH), ni = nakIndex(dateKeyStr, riseH);
      const shukla = ti < 15;
      const t = shukla ? P.tithi[ti] : P.tithiK[ti - 15];
      const nak = P.nakshatra[ni];
      const fest = P.festivals[dateKeyStr] || '';
      return {
        tithi: `${shukla ? 'শুক্লা' : 'কৃষ্ণ'} ${t}`, nak,
        sunrise: mh.sunrise, sunset: mh.sunset,
        shubho: `${mh.abhijit[0]}–${mh.abhijit[1]}`, rahu: `${mh.rahu[0]}–${mh.rahu[1]}`,
        mh, fest, ekadashi: t === 'একাদশী' || /একাদশী/.test(fest)
      };
    }
  const BM_NAMES = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  const BM_LEN = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30];
  const BM_SEASON = ['গ্রীষ্ম', 'গ্রীষ্ম', 'বর্ষা', 'বর্ষা', 'শরৎ', 'শরৎ', 'হেমন্ত', 'হেমন্ত', 'শীত', 'শীত', 'বসন্ত', 'বসন্ত'];
  const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const bmLens = startGYear => { const a = BM_LEN.slice(); if (isLeap(startGYear + 1)) a[10] += 1; return a; };
  function bengaliDate(dateObj) {
      const dt = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      let startG = dt.getFullYear();
      if (dt < new Date(startG, 3, 14)) startG -= 1;
      const start = new Date(startG, 3, 14);
      let elapsed = Math.round((dt - start) / DAY_MS);
      const lens = bmLens(startG);
      let m = 0;
      while (m < 11 && elapsed >= lens[m]) { elapsed -= lens[m]; m++; }
      return { year: startG - 593, m, d: elapsed + 1, month: BM_NAMES[m], season: BM_SEASON[m] };
    }
  const bnDateShort = d => `${bn(d.d)} ${d.month} ${bn(d.year)} বঙ্গাব্দ`;
  function banglaMonthCells(y, m) {
      let cur = new Date(y + 593, 3, 14), guard = 0;
      while (guard++ < 420) { const b = bengaliDate(cur); if (b.year === y && b.m === m) break; cur.setDate(cur.getDate() + 1); }
      const cells = [];
      while (guard++ < 840) {
        const b = bengaliDate(cur);
        if (b.year !== y || b.m !== m) break;
        cells.push({ d: b.d, date: new Date(cur) });
        cur.setDate(cur.getDate() + 1);
      }
      return cells;
    }
  function nextFestival() {
      const keys = Object.keys(P.festivals).filter(k => k >= TODAY_KEY).sort();
      if (!keys.length) return null;
      const k = keys[0], d = new Date(k + 'T00:00:00');
      const days = Math.round((d - new Date(TODAY_KEY + 'T00:00:00')) / DAY_MS);
      return { date: d, name: P.festivals[k], days };
    }
  function todayObservances() {
      const st = sunTimes(TODAY_KEY), mh = muhurta(TODAY_KEY), p = panjikaFor(TODAY_KEY);
      const cl = n => pjHM(Math.round(((n % 1440) + 1440) % 1440));
      const win = (a, b) => `${cl(a)}–${cl(b)}`;
      const abhijit = `${mh.abhijit[0]}–${mh.abhijit[1]}`;
      const out = [];
      const todays = (P.festivals[TODAY_KEY] || '').split('·').map(x => x.trim()).filter(Boolean);

      todays.forEach(name => {
        const isKali = /কালী|লক্ষ্মী|দীপাবলি|অমাবস্যা/.test(name);
        const isPuja = /পূজা|আরাধনা|আরতি|যাত্রা/.test(name);
        const isVrat = /ব্রত|ষষ্ঠী|নবমী|চতুর্থী|একাদশী|দ্বাদশী|চতুর্দশী|অষ্টমী|পূর্ণিমা/.test(name);
        out.push({
          kind: isVrat && !isPuja ? 'ব্রত' : isPuja ? 'পূজা' : 'উৎসব',
          name, tag: 'আজ',
          note: isKali ? 'সন্ধ্যা-নিশীথে প্রদীপ, মায়ের আরাধনা ও আরতি'
            : isVrat ? 'সংকল্প নিয়ে নিরাহার বা ফলাহারে পালন, সন্ধ্যায় আরতি'
            : isPuja ? 'বিধি অনুসারে পূজা, মন্ত্র ও আরতি'
            : 'পঞ্জিকা অনুসারে আজকের পালনীয়',
          whenLab: isKali ? 'নিশীথ কাল' : isPuja ? 'সন্ধ্যাকালীন পূজা' : 'শুভ সময় (অভিজিৎ)',
          when: isKali ? win(st.noon + 696, st.noon + 744) : isPuja ? win(st.set - 48, st.set + 36) : abhijit
        });
      });

      /* তিথি-ভিত্তিক ব্রত (নামে আগে না থাকলে) */
      const tt = (p.tithi.split(' ')[1] || '').trim();
      const TV = {
        'একাদশী': ['ব্রত', 'একাদশী ব্রত', 'নিরাহার, বিষ্ণুস্মরণ ও দান', 'পারণ কাল', `${mh.parana[0]}–${mh.parana[1]}`],
        'পূর্ণিমা': ['ব্রত', 'পূর্ণিমা ব্রত', 'সন্ধ্যায় চন্দ্রদর্শন ও দীপদান', 'সন্ধ্যাকাল', win(st.set - 20, st.set + 70)],
        'অমাবস্যা': ['তিথি', 'অমাবস্যা তিথি', 'পিতৃতর্পণ ও প্রদীপদান', 'সন্ধ্যাকাল', win(st.set - 30, st.set + 30)],
        'চতুর্থী': ['ব্রত', 'বিনায়ক চতুর্থী', 'গণেশ আরাধনা, চন্দ্রদর্শন বর্জন', 'মধ্যাহ্ন পূজা', abhijit],
        'দ্বাদশী': ['তিথি', 'দ্বাদশী তিথি', 'হরিবাসরের পারণ ও পুণ্যস্নান', 'পারণ কাল', `${mh.parana[0]}–${mh.parana[1]}`],
        'ষষ্ঠী': ['ব্রত', 'ষষ্ঠী ব্রত', 'সন্তান ও পরিবারের মঙ্গল-কামনা', 'সন্ধ্যাকাল', win(st.set - 20, st.set + 40)]
      }[tt];
      if (TV && !todays.some(n => n.includes(tt))) {
        out.push({ kind: TV[0], name: TV[1], tag: 'আজ', note: TV[2], whenLab: TV[3], when: TV[4] });
      }

      /* The same bundled panjika data, covering today and the next seven days.
         Every entry on a date is included instead of silently dropping all but the first. */
      const dateLabel = d => `${BN_DAY[d.getDay()]}, ${bn(d.getDate())} ${BN_MONTH[d.getMonth()]} ${bn(d.getFullYear())}`;
      out.forEach(o => { o.dateLabel = dateLabel(TODAY); });
      for (let days = 1; days <= 7; days++) {
        const d = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days);
        const k = key(d);
        const names = (P.festivals[k] || '').split('·').map(x => x.trim()).filter(Boolean);
        if (!names.length) continue;
        const pk = panjikaFor(k);
        names.forEach(name => out.push({
          kind: /ব্রত|ষষ্ঠী|নবমী|একাদশী|পূর্ণিমা|চতুর্দশী/.test(name) ? 'ব্রত' : 'উৎসব',
          name, tag: `${bn(days)} দিন বাকি`,
          dateLabel: dateLabel(d), note: `তিথি: ${pk.tithi}`,
          whenLab: 'শুভ সময় (অভিজিৎ)', when: `${pk.mh.abhijit[0]}–${pk.mh.abhijit[1]}`
        }));
      }
      if (!out.length) {
        const known = Object.keys(P.festivals).sort();
        const covered = known.length && TODAY_KEY >= known[0] && TODAY_KEY <= known[known.length - 1];
        out.push({ kind: 'পঞ্জিকা', name: covered ? 'আগামী ৭ দিনে কোনো উৎসব তালিকাভুক্ত নেই' : 'এই সময়ের উৎসবের তথ্য যোগ করা হয়নি',
          tag: 'আগামী ৭ দিন', dateLabel: dateLabel(TODAY),
          note: covered ? 'বিস্তারিত জানতে পঞ্জিকা দেখুন' : 'নতুন পঞ্জিকা তথ্য প্রয়োজন',
          whenLab: 'আজকের শুভ সময় (অভিজিৎ)', when: abhijit });
      }
      return out;
    }
