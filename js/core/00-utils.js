/* ==========================================================================
   ভিত্তি · বাংলা সংখ্যা, লেখা-সাফাই ও তারিখের হেল্পার
   ফাইল: js/core/00-utils.js
   ========================================================================== */
  'use strict';
  const BN = '০১২৩৪৫৬৭৮৯';
  const bn = v => String(v).replace(/\d/g, d => BN[+d]);
  const bnN = n => bn(Number(n).toLocaleString('en-US'));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const D = (y, m, d) => new Date(y, m - 1, d);
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let TODAY = new Date();
  let TODAY_KEY = key(TODAY);
  const BN_MONTH = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const BN_DAY = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const BN_DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
