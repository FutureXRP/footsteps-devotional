#!/usr/bin/env python3
import re, os, subprocess, html, sys

BOOK = '/home/user/footsteps-devotional/book2'
ORDER = [
    ('sundering/00-the-sundering.md', 'PART ONE'),
    ('waste/01-the-garden.md', 'PART TWO'),
    ('waste/02-the-fourth-side.md', None),
    ('waste/03-the-flask.md', None),
    ('slow-country/04-the-pale-stone.md', 'PART THREE'),
    ('slow-country/05-constant.md', None),
    ('slow-country/06-what-he-could-teach.md', None),
    ('slow-country/07-the-short-road.md', None),
    ('table-lands/08-the-valley.md', 'PART FOUR'),
    ('return/09-the-ninth.md', 'PART FIVE'),
]

ONES = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
        'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
        'Eighteen','Nineteen']
TENS = {2:'Twenty',3:'Thirty',4:'Forty',5:'Fifty',6:'Sixty',7:'Seventy',8:'Eighty',9:'Ninety'}

def word(n):
    if n < 20: return ONES[n-1]
    t, o = divmod(n, 10)
    return TENS[t] + ('-' + ONES[o-1] if o else '')

SEC = re.compile(r'^## [A-Z][a-z]+(?:-[A-Z][a-z]+)?\s*$')

# ---------- renumber ----------
n = 0
for rel, _ in ORDER:
    p = os.path.join(BOOK, rel)
    lines = open(p).read().split('\n')
    for i, l in enumerate(lines):
        if SEC.match(l):
            n += 1
            lines[i] = '## ' + word(n)
    open(p, 'w').write('\n'.join(lines))
TOTAL_SECTIONS = n

# ---------- assemble ----------
out = []
for rel, part in ORDER:
    lines = open(os.path.join(BOOK, rel)).read().split('\n')
    start = next(i for i, l in enumerate(lines) if SEC.match(l))
    if part:
        out.append('### ' + part + '\n')
    out.append('\n'.join(lines[start:]).rstrip() + '\n')
ms = '\n'.join(out)
open(os.path.join(BOOK, 'MANUSCRIPT.md'), 'w').write(ms)
words = len(re.findall(r"[A-Za-z0-9'’-]+", ms))

# ---------- html ----------
def inline(s):
    s = html.escape(s)
    s = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', s)
    return s

body = []
buf = []
cls = 'p'

def flush():
    global buf, cls
    if buf:
        body.append('<p class="%s">%s</p>' % (cls, inline(' '.join(buf))))
        buf = []
    cls = 'p'

for raw in ms.split('\n'):
    line = raw.rstrip()
    if not line.strip():
        flush(); continue
    if line.startswith('### PART '):
        flush()
        body.append('<div class="partpage"><h1>%s</h1></div>' % html.escape(line[4:].strip()))
        continue
    if SEC.match(line):
        flush()
        body.append('<h3 class="sec">%s</h3>' % html.escape(line[3:].strip()))
        continue
    if line.strip() == '---':
        flush()
        body.append('<div class="orn">* * *</div>')
        continue
    if line.startswith('— '):
        flush()
        cls = 'd'
    buf.append(line.strip())
flush()

# an ornament immediately before a section heading or part page is noise
body = [b for i, b in enumerate(body)
        if not (b.startswith('<div class="orn"')
                and i + 1 < len(body)
                and (body[i + 1].startswith('<h3 class="sec"')
                     or body[i + 1].startswith('<div class="partpage"')))]

HEAD = """<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Ninth — proof</title><style>
@page{size:Letter;margin:22mm 24mm 20mm}
body{font-family:Georgia,'Times New Roman',serif;font-size:11.5pt;line-height:1.75;color:#1a1a1a;margin:0}
p{margin:0 0 .8em;orphans:2;widows:2}
p.d{margin:0 0 .5em}
.titlepage{text-align:center;padding-top:24vh}
.t{font-size:32pt;letter-spacing:.06em;margin-bottom:.6em}
.s{font-size:14pt;font-style:italic;margin-bottom:3.5em}
.a{font-size:15pt;margin-bottom:5em}
.proof{font-size:10pt;font-weight:bold;letter-spacing:.12em}
.meta{font-size:10pt;font-style:italic;color:#555}
.partpage{page-break-before:always;text-align:center;padding:11em 0 4em}
.partpage h1{font-size:22pt;letter-spacing:.22em;font-weight:normal;margin:0;color:#333}
h3.sec{text-align:center;font-size:9.5pt;letter-spacing:.22em;color:#777;font-weight:normal;margin:2.6em 0 1.3em;page-break-after:avoid}
.orn{text-align:center;color:#bbb;margin:1.5em 0;letter-spacing:.45em;font-size:9pt}
</style></head><body>
<div class="titlepage"><div class="t">THE NINTH</div><div class="s">an allegory</div>
<div class="a">Matt Blair</div><div class="proof">PROOF COPY — NOT FOR DISTRIBUTION</div>
<div class="meta">Complete first draft · %d sections · approx. %s words</div></div>
""" % (TOTAL_SECTIONS, '{:,}'.format(round(words, -2)))

htmlpath = '/tmp/claude-0/-home-user-footsteps-devotional/549600c6-8c94-5175-8a20-9b8adb9da429/scratchpad/novel.html'
open(htmlpath, 'w').write(HEAD + '\n'.join(body) + '\n</body></html>')

pdf = '/tmp/claude-0/-home-user-footsteps-devotional/549600c6-8c94-5175-8a20-9b8adb9da429/scratchpad/The-Ninth-draft.pdf'
if os.path.exists(pdf): os.remove(pdf)
subprocess.run([
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '--headless', '--disable-gpu',
    '--no-sandbox', '--virtual-time-budget=25000',
    '--print-to-pdf=' + pdf, '--no-pdf-header-footer', 'file://' + htmlpath],
    check=True, capture_output=True)

import fitz
d = fitz.open(pdf)
print('sections=%d words=%d pages=%d' % (TOTAL_SECTIONS, words, d.page_count))
