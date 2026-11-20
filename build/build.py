#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build.py — js/app.js জোড়া লাগানোর স্ক্রিপ্ট (Windows / Mac / Linux সবখানে চলে)
--------------------------------------------------------------------------------
কী করে:
  * build/manifest.json-এ লেখা ক্রম অনুযায়ী js/core, js/views, js/features
    ফাইলগুলো জোড়া দিয়ে js/app.js তৈরি করে।

কীভাবে চালাবেন (প্রজেক্টের মূল ফোল্ডারে থেমে):
  * উইন্ডোজ :  py build\\build.py      (অথবা: python build\\build.py)
  * ম্যাক/লিনাক্স: python3 build/build.py

নতুন পেজ যোগ করার নিয়ম:
  1. js/views/<নাম>.js ফাইল বানান (ভেতরে একটি function লিখুন, যেমন myScreen())
  2. build/manifest.json-এ ফাইলের নামটি ঠিক ক্রমে বসান
  3. js/core/75-router.js-এ route যোগ করুন
  4. build.py চালিয়ে js/app.js নতুন করে বানান
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # প্রজেক্টের মূল ফোল্ডার
JS = os.path.join(ROOT, 'js')
MANIFEST = os.path.join(ROOT, 'build', 'manifest.json')
BASE = os.path.join(ROOT, 'build', '_baseline', 'app.js')

HEAD = open(os.path.join(ROOT, 'build', 'head.txt'), encoding='utf-8').read()

# পুরনো (ভাগ করার আগের) app.js — কেবল নতুন ফাইল "কেটে" বের করার জন্য
BASE_SRC = open(BASE, encoding='utf-8').read() if os.path.exists(BASE) else ''

# নিজে থেকে তৈরি হওয়া অংশ: কোথায় শুরু, কোন ফাইলে যাবে
SLICES = [
    ('core/00-utils.js', 'ভিত্তি · বাংলা সংখ্যা, লেখা-সাফাই ও তারিখের হেল্পার', r"^\s*const BN = ", r"^\s*const BN_DAYS = "),
    ('core/10-state.js', 'অ্যাপের সব সেটিংস ও ডেটা (state)', r"^\s*const mem = ", r"^\s*const U = "),
    ('core/20-icons.js', 'আইকন ও ছোট SVG (SPRITE, ico, vico)', r"^\s*const SPRITE = ", r"^\s*let ac = null"),
    ('core/30-feedback.js', 'ছোট জানানো ও শব্দ (toast, chime, burst)', r"^\s*let ac = null", r"^\s*const P = DB\.panjika"),
    ('core/40-panjika-core.js', 'পঞ্জিকা গণনা (তিথি, নক্ষত্র, বঙ্গাব্দ)', r"^\s*const P = DB\.panjika", r"^\s*function appbar\("),
    ('core/50-layout.js', 'উপরের বার (appbar)', r"^\s*function appbar\(", r"^\s*function homeScreen\("),
    ('views/home.js', '১. হোম পেজ', r"^\s*function homeScreen\(", r"^\s*function bookCards\("),
    ('views/library.js', '২. লাইব্রেরি ও অডিও প্লেয়ার', r"^\s*function bookCards\(", r"^\s*function bookScreen\("),
    ('views/gita.js', '৩. গীতা ও বাংলা অডিও পাঠ', r"^\s*function bookScreen\(", r"^\s*function readerScreen\("),
    ('views/reader.js', '৪. পাঠ-পৃষ্ঠা', r"^\s*function readerScreen\(", r"^\s*function coursesScreen\("),
    ('views/courses.js', '৫. কোর্স · পরীক্ষা · কুইজ', r"^\s*function coursesScreen\(", r"^\s*function pujaScreen\("),
    ('views/puja.js', '৬. পূজা পেজ', r"^\s*function pujaScreen\(", r"^\s*const DEVA = "),
    ('features/puja-temple.js', '৭. পূজা-মঞ্চ (লেয়ার, ধাপ, মন্ত্র, আরতি)', r"^\s*const DEVA = ", r"^\s*const bpList = "),
    ('views/reels.js', '৮. রিলস ও ভিডিও ফিড', r"^\s*const bpList = ", r"^\s*function panjikaScreen\("),
    ('views/panjika.js', '৯. পঞ্জিকা', r"^\s*function panjikaScreen\(", r"^\s*function sevaScreen\("),
    ('views/seva.js', '১০. সেবা ও দান', r"^\s*function sevaScreen\(", r"^\s*function providerCards\("),
    ('views/market.js', '১১. সেবা ও কাজ', r"^\s*function providerCards\(", r"^\s*function prefCard\("),
    ('views/me.js', '১২. আমি — পছন্দের কার্ড', r"^\s*function prefCard\(", r"^\s*const SI = "),
    ('core/60-search.js', 'সার্চ ইঞ্জিন ও সেটিংস পপআপ', r"^\s*const SI = ", r"^\s*function settingsScreen\("),
    ('views/settings.js', '১২½. সেটিংস ও প্রোফাইল পেজ', r"^\s*function settingsScreen\(", r"^\s*const JAPA_C = "),
    ('views/sadhana.js', '১৩. সাধনা (জপ, ধ্যান, যোগা)', r"^\s*const JAPA_C = ", r"^\s*const ROLES = "),
    ('views/manage.js', '১৪. ব্যবহারকারী ব্যবস্থাপনা', r"^\s*const ROLES = ", r"^\s*const TRAK_DEF = "),
    ('views/track.js', '১৫. দৈনিক হিসাব', r"^\s*const TRAK_DEF = ", r"^\s*function quickSheetHTML\("),
    ('core/70-sheet.js', '＋ প্যানেল (আজকের হিসাব ও নোট)', r"^\s*function quickSheetHTML\(", r"^\s*const feedLike = "),
    ('views/feed.js', '১৬. ফিড', r"^\s*const feedLike = ", r"^\s*const NOTE_TAGS = "),
    ('views/chat.js', '১৭. চ্যাট', r"^\s*function chatScreen\(", r"^\s*const NOTE_TAGS = "),
    ('views/notes.js', '১৮. নোট', r"^\s*const NOTE_TAGS = ", r"^\s*const PDFVIEW = "),
    ('features/pdf.js', '১৯. PDF গ্রন্থাগার', r"^\s*const PDFVIEW = ", r"^\s*const TABS = "),
    ('core/75-router.js', 'রাউটার', r"^\s*const TABS = ", r"^\s*function startQuiz\("),
    ('features/quiz.js', '২০. কুইজ ইঞ্জিন', r"^\s*function startQuiz\(", r"^\s*function bumpActivity\("),
    ('core/80-theme.js', 'থিম, কণ্ঠ ও ভয়েস-বার', r"^\s*function bumpActivity\(", r"^\s*const ACTIONS = "),
    ('core/85-actions.js', 'ACTIONS — বাটনের কাজ', r"^\s*const ACTIONS = ", r"^  window\.addEventListener\('pagehide'"),
    ('core/86-bindings.js', 'BINDINGS — ক্লিক/ইনপুট/কীবোর্ড', r"^  window\.addEventListener\('pagehide'", r"^\s*const BL_LINES = "),
    ('core/88-tickers.js', 'হেডার ও ঘোরানো শিরোনাম', r"^\s*const BL_LINES = ", r"^\s*function render\(\)"),
    ('core/90-render-init.js', 'render() ও init()', r"^\s*function render\(\)", None),
]

MANUAL = {   # হাতে লেখা নতুন অংশ (পুরনো app.js-এ নেই)
    'core/72-media.js', 'views/storage.js',
}


def slice_for(start_re, end_re):
    """পুরনো app.js থেকে একটি অংশ কেটে আনি (কেবল ফাইলটা না থাকলে)।"""
    if not BASE_SRC:
        return ''
    m = re.search(start_re, BASE_SRC, re.M)
    if not m:
        return ''
    a = m.start()
    if end_re is None:
        b = BASE_SRC.rfind('  init();')
    else:
        m2 = re.search(end_re, BASE_SRC[m.end():], re.M)
        b = m.end() + m2.start() if m2 else len(BASE_SRC)
    return BASE_SRC[a:b].strip('\n') + '\n'


def header(part, title):
    return ('/* ==========================================================================\n'
            '   ' + title + '\n'
            '   ফাইল: js/' + part + '\n'
            '   ========================================================================== */\n')


def main():
    order = json.load(open(MANIFEST, encoding='utf-8'))
    if not HEAD.strip():
        print('!! build/head.txt নেই'); return 1
    made, joined = [], []
    for part in order:
        path = os.path.join(JS, part)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        if not os.path.exists(path):
            if part in MANUAL:
                print('!! হাতে লেখা ফাইলটি নেই:', part); continue
            row = next((r for r in SLICES if r[0] == part), None)
            title, start_re, end_re = (row[1], row[2], row[3]) if row else (part, None, None)
            body = slice_for(start_re, end_re) if start_re else ''
            open(path, 'w', encoding='utf-8').write(header(part, title) + body)
            made.append(part)
        joined.append(open(path, encoding='utf-8').read())
    out = HEAD + '\n'.join(joined) + '\n  init();\n})();\n'
    open(os.path.join(JS, 'app.js'), 'w', encoding='utf-8').write(out)
    print('নতুন তৈরি:', made or '—')
    print('জোড়া লাগানো ফাইল:', len(joined))
    print('js/app.js লাইন:', out.count('\n'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
