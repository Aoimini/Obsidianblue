#!/usr/bin/env python3
"""Deterministic validators for the compiled vault.

Checks (mirrors Obsidian resolution semantics where practical):
  1. Wikilink validation  — resolve [[links]] by note basename anywhere in vault,
     by relative/explicit path, or by frontmatter alias. Strips #heading / ^block / |display.
  2. Slug/path validation — empty filenames, invalid paths (e.g. People/.md), unsafe chars, duplicate slugs.
  3. Secret/credential scanning — tokens, keys, passwords, bearer/oauth, db urls, ssh keys, etc.
  4. Provenance validation — every promoted canonical note (People/Companies/Projects/Products/
     Topics/Decisions/Commitments/Procedures/Preferences) has a Provenance/Sources reference.
  5. Required artifact validation — required folders and files exist.

Exit code 0 only if all hard gates pass.
"""
import os, re, sys, glob

VAULT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CANONICAL_DIRS = ["People","Companies","Projects","Products","Topics",
                  "Decisions","Commitments","Procedures","Preferences"]
REQUIRED_DIRS = CANONICAL_DIRS + ["Context Packs","Sources","Maps","Reports","_tools"]
REQUIRED_FILES = ["README.md","SOURCE-MANIFEST.md","VALIDATION-REPORT.md",
                  "COMPLETION-AUDIT.md","INGESTION-LOG.md","state.json"]

def md_files():
    out = []
    for root,_,files in os.walk(VAULT):
        if os.sep+".git" in root: continue
        for f in files:
            if f.endswith(".md"):
                out.append(os.path.join(root,f))
    return out

def read(p):
    with open(p, encoding="utf-8") as fh: return fh.read()

def frontmatter_aliases(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m: return []
    fm = m.group(1)
    al = []
    am = re.search(r"^aliases:\s*\n((?:\s*-\s*.+\n?)+)", fm, re.M)
    if am:
        for line in am.group(1).splitlines():
            v = line.strip().lstrip("-").strip().strip('"').strip("'")
            if v: al.append(v)
    inline = re.search(r'^aliases:\s*\[(.+)\]', fm, re.M)
    if inline:
        for v in inline.group(1).split(","):
            v=v.strip().strip('"').strip("'")
            if v: al.append(v)
    return al

def main():
    files = md_files()
    rel = {os.path.relpath(f, VAULT) for f in files}
    basenames = {}      # basename(no ext) -> [relpaths]
    relnoext = {}       # relpath no ext -> relpath
    aliases = {}        # alias -> relpath
    for f in files:
        r = os.path.relpath(f, VAULT)
        b = os.path.splitext(os.path.basename(r))[0]
        basenames.setdefault(b, []).append(r)
        relnoext[os.path.splitext(r)[0]] = r
        for a in frontmatter_aliases(read(f)):
            aliases[a] = r

    errors = {"broken_links":[], "ambiguous_links":[], "bad_slugs":[],
              "secrets":[], "missing_provenance":[], "missing_artifacts":[]}

    # 1. Wikilinks
    link_re = re.compile(r"\[\[([^\]]+)\]\]")
    def resolve(target):
        t = target.split("|")[0].split("#")[0].split("^")[0].strip()
        if not t: return "empty"
        cand = t
        norm = cand.lstrip("./").replace("\\","/")
        while norm.startswith("../"): norm = norm[3:]
        # explicit path (with or without .md)
        if norm in rel: return "ok"
        if norm in relnoext: return "ok"
        if norm + ".md" in rel: return "ok"
        base = os.path.basename(norm)
        if base in basenames:
            return "ok" if len(basenames[base])==1 else "ambiguous"
        if base in aliases: return "ok"
        if t in aliases: return "ok"
        return "broken"
    for f in files:
        r = os.path.relpath(f, VAULT)
        for m in link_re.finditer(read(f)):
            res = resolve(m.group(1))
            if res=="broken": errors["broken_links"].append(f"{r}: [[{m.group(1)}]]")
            elif res=="ambiguous": errors["ambiguous_links"].append(f"{r}: [[{m.group(1)}]]")
            elif res=="empty": errors["bad_slugs"].append(f"{r}: empty wikilink")

    # 2. Slugs / paths
    seen = {}
    unsafe = re.compile(r'[<>:"\\|?*\x00-\x1f]')
    for r in rel:
        name = os.path.basename(r)
        stem = os.path.splitext(name)[0]
        if stem=="" or stem.strip()=="":
            errors["bad_slugs"].append(f"empty filename: {r}")
        if unsafe.search(name):
            errors["bad_slugs"].append(f"unsafe char in: {r}")
        top = r.split(os.sep)[0]
        if top in CANONICAL_DIRS:
            key = (top, stem.lower())
            if key in seen:
                errors["bad_slugs"].append(f"duplicate slug: {r} ~ {seen[key]}")
            else:
                seen[key]=r

    # 3. Secrets
    secret_pats = [
        (r"sk-[A-Za-z0-9]{20,}", "openai-style key"),
        (r"secret_[A-Za-z0-9]{16,}", "notion-style secret"),
        (r"ntn_[A-Za-z0-9]{20,}", "notion token"),
        (r"xox[baprs]-[A-Za-z0-9-]{10,}", "slack token"),
        (r"ghp_[A-Za-z0-9]{30,}", "github token"),
        (r"AKIA[0-9A-Z]{16}", "aws key"),
        (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "private key"),
        (r"AIza[0-9A-Za-z_\-]{30,}", "google api key"),
        (r"eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}", "jwt"),
        (r"(?i)\b(password|passwd|pwd)\s*[:=]\s*['\"]?[^\s'\"]{6,}", "password literal"),
        (r"(postgres|postgresql|mysql|mongodb(\+srv)?)://[^\s]+:[^\s]+@", "db url with creds"),
    ]
    PLACEHOLDER = re.compile(r"(?i)secret_xxx|x{4,}|placeholder|example|your[_-]?token")
    for f in files:
        txt = read(f)
        for pat,label in secret_pats:
            for m in re.finditer(pat, txt):
                if PLACEHOLDER.search(m.group(0)): continue
                errors["secrets"].append(f"{os.path.relpath(f,VAULT)}: {label}: {m.group(0)[:40]}")

    # 4. Provenance
    for f in files:
        r = os.path.relpath(f, VAULT)
        top = r.split(os.sep)[0]
        if top in CANONICAL_DIRS:
            txt = read(f)
            if not (re.search(r"##+\s*Provenance", txt) or "Sources/" in txt or "[[Sources" in txt):
                errors["missing_provenance"].append(r)

    # 5. Artifacts
    for d in REQUIRED_DIRS:
        if not os.path.isdir(os.path.join(VAULT,d)):
            errors["missing_artifacts"].append(f"missing dir: {d}")
    for fn in REQUIRED_FILES:
        if not os.path.isfile(os.path.join(VAULT,fn)):
            errors["missing_artifacts"].append(f"missing file: {fn}")

    print(f"Vault: {VAULT}")
    print(f"Markdown notes scanned: {len(files)}")
    total=0
    for k,v in errors.items():
        print(f"\n[{k}] {len(v)}")
        for item in v[:50]: print(f"  - {item}")
        total+=len(v)
    print(f"\nTOTAL ISSUES: {total}")
    print("RESULT:", "PASS ✅" if total==0 else "FAIL ❌")
    return 0 if total==0 else 1

if __name__=="__main__":
    sys.exit(main())
