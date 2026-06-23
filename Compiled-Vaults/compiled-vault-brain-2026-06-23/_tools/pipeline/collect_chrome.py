#!/usr/bin/env python3
"""Collect today's Chrome history (Google searches + visited page titles), read-only.

Chrome locks its History DB while running, so we copy it first, then query a read-only
copy. Output goes to the runtime inbox (OUTSIDE the vault). The morning AI run turns this
into a themed daily digest — it should NOT paste raw URLs into canonical notes.

Privacy: browsing history is sensitive. This file stays outside git; only a summarized
digest enters the vault. Exits 0 even on failure (pipeline keeps going).

Note: under launchd this may need Full Disk Access granted to the executing process if
macOS blocks reading ~/Library/Application Support/Google/Chrome.
"""
import os, sys, shutil, sqlite3, datetime, urllib.parse, glob, tempfile, re

DATA = os.path.expanduser("~/.local/share/vaultbrain")
INBOX = os.path.join(DATA, "inbox")
os.makedirs(INBOX, exist_ok=True)
TS = datetime.date.today().isoformat()
OUT = os.path.join(INBOX, f"chrome_{TS}.md")
CHROME = os.path.expanduser("~/Library/Application Support/Google/Chrome")

def log(*a): print("[collect_chrome]", *a)

# chrome epoch (microseconds since 1601-01-01) for local midnight today
midnight = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
chrome_midnight = int((midnight.timestamp() + 11644473600) * 1_000_000)

profiles = []
for hist in glob.glob(os.path.join(CHROME, "*", "History")):
    profiles.append(hist)
if not profiles:
    log("no Chrome History DB found; skipping")
    open(OUT, "w").write(f"# Chrome delta — {TS}\n\n(no Chrome history found)\n")
    sys.exit(0)

searches = []   # (time, query)
visits = []     # (time, title, domain)
for hist in profiles:
    prof = os.path.basename(os.path.dirname(hist))
    try:
        tmp = os.path.join(tempfile.gettempdir(), f"chrome_{prof}.sqlite")
        shutil.copy2(hist, tmp)
        con = sqlite3.connect(f"file:{tmp}?mode=ro", uri=True)
        cur = con.cursor()
        cur.execute(
            "SELECT last_visit_time, url, title FROM urls "
            "WHERE last_visit_time >= ? ORDER BY last_visit_time DESC", (chrome_midnight,))
        for t, url, title in cur.fetchall():
            secs = t/1_000_000 - 11644473600
            when = datetime.datetime.fromtimestamp(secs).strftime("%H:%M")
            if re.search(r"https?://(www\.)?google\.[^/]+/search", url):
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
                q = (qs.get("q") or [""])[0].strip()
                if q:
                    searches.append((when, q))
            else:
                dom = urllib.parse.urlparse(url).netloc
                if title and dom and "google." not in dom:
                    visits.append((when, title.strip(), dom))
        con.close()
        os.remove(tmp)
    except Exception as e:
        log(f"profile {prof}: {e}")

# dedupe preserving order
def dedupe(seq, key):
    seen=set(); out=[]
    for x in seq:
        k=key(x)
        if k in seen: continue
        seen.add(k); out.append(x)
    return out
searches = dedupe(searches, lambda x: x[1])
visits = dedupe(visits, lambda x: x[1])

lines = [f"# Chrome delta — {TS}", "",
         f"Today's Google searches: {len(searches)} unique. Visited pages (titles): {len(visits)}.",
         "", "## Google searches today"]
lines += [f"- {t}  {q}" for t, q in searches] or ["- (none)"]
lines += ["", "## Notable visited pages today (title — domain)"]
lines += [f"- {title}  — {dom}" for _, title, dom in visits[:60]] or ["- (none)"]

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
log(f"wrote {OUT}: {len(searches)} searches, {len(visits)} visits")
sys.exit(0)
