#!/usr/bin/env python3
"""Auto-heal unresolved wikilinks in the compiled vault (deterministic, idempotent).

The nightly AI sometimes creates [[links]] to notes that don't exist (e.g. Notion items),
which fails validate.py and leaves a broken commit. This converts any wikilink that would NOT
resolve in Obsidian into plain text 「...」, so the vault always validates. Real links are left
untouched. Run it AFTER the AI synthesis and BEFORE validate.py.
"""
import os, re

VAULT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = ("People","Companies","Projects","Products","Topics","Decisions",
         "Commitments","Procedures","Preferences")

def md_files():
    out = []
    for root,_,files in os.walk(VAULT):
        if os.sep+".git" in root: continue
        for f in files:
            if f.endswith(".md"): out.append(os.path.join(root,f))
    return out

def frontmatter_aliases(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m: return []
    al = []
    am = re.search(r"^aliases:\s*\n((?:\s*-\s*.+\n?)+)", m.group(1), re.M)
    if am:
        for line in am.group(1).splitlines():
            v = line.strip().lstrip("-").strip().strip('"').strip("'")
            if v: al.append(v)
    return al

files = md_files()
rel = {os.path.relpath(f, VAULT) for f in files}
basenames, relnoext, aliases = set(), set(), set()
for f in files:
    r = os.path.relpath(f, VAULT)
    basenames.add(os.path.splitext(os.path.basename(r))[0])
    relnoext.add(os.path.splitext(r)[0])
    for a in frontmatter_aliases(open(f, encoding="utf-8").read()):
        aliases.add(a)

def resolves(target):
    t = target.split("|")[0].split("#")[0].split("^")[0].strip()
    if not t: return False
    norm = t.lstrip("./").replace("\\","/")
    while norm.startswith("../"): norm = norm[3:]
    if norm in rel or norm in relnoext or norm+".md" in rel: return True
    base = os.path.basename(norm)
    return base in basenames or base in aliases or t in aliases

link_re = re.compile(r"\[\[([^\]]+)\]\]")
fixed = 0
for f in files:
    # only heal links inside canonical/report notes of the compiled vault
    txt = open(f, encoding="utf-8").read()
    def repl(m):
        global fixed
        inner = m.group(1)
        if resolves(inner): return m.group(0)
        fixed += 1
        disp = inner.split("|")[-1].split("#")[0].strip() or inner
        return f"「{disp}」"
    new = link_re.sub(repl, txt)
    if new != txt:
        open(f, "w", encoding="utf-8").write(new)

print(f"[fix_links] healed {fixed} unresolved wikilink(s)")
