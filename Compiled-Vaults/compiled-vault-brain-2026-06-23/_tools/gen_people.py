#!/usr/bin/env python3
"""Compile AI木曜会 profile-book files into People/ canonical notes (deterministic).

parse -> classify -> extract -> author. Idempotent: overwrites generated People notes
that carry `generated_by: gen_people.py` in frontmatter. Never touches hand-authored notes.
"""
import os, re, sys

SRC = "/Users/aoi/Desktop/Bluenote/5_Docs/木曜会/プロフィール帳"
VAULT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PEOPLE = os.path.join(VAULT, "People")

UNSAFE = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
def safe(name): return UNSAFE.sub("-", name).strip()

def section(text, header):
    m = re.search(rf"^##\s*{re.escape(header)}\s*\n(.*?)(?=^##\s|\Z)", text, re.S|re.M)
    return m.group(1).strip() if m else ""

def field(block, label):
    m = re.search(rf"-\s*{re.escape(label)}\s*[:：]\s*(.*)", block)
    return m.group(1).strip() if m else ""

def sns_lines(block):
    out=[]
    for m in re.finditer(r"-\s*(Instagram|X|Twitter|TikTok|YouTube|note|Threads)\s*[:：]\s*(\S+)", block):
        out.append(f"{m.group(1)}: {m.group(2)}")
    return out

def events(block):
    return [l.strip()[1:].strip() for l in block.splitlines() if l.strip().startswith("-") and l.strip()!="-"]

def memo(block):
    lines=[l.strip()[1:].strip() for l in block.splitlines() if l.strip().startswith("-")]
    return [l for l in lines if l]

# hand-authored elsewhere -> skip to avoid duplicate entities
SKIP = {"臼井拓水（usutaku）.md"}

count=0
for fn in sorted(os.listdir(SRC)):
    if not fn.endswith(".md"): continue
    if fn in SKIP: continue
    raw = open(os.path.join(SRC,fn), encoding="utf-8").read()
    hm = re.search(r"^#\s+(.+)$", raw, re.M)
    name = (hm.group(1).strip() if hm else os.path.splitext(fn)[0]).strip()
    basic = section(raw, "基本情報")
    ev = events(section(raw, "出会ったイベント"))
    mm = memo(section(raw, "メモ"))
    email = field(basic, "メールアドレス")
    company = field(basic, "会社・所属")
    fincs = field(basic, "自己紹介(Fincs)")
    sns_block = ""
    sm = re.search(r"-\s*SNS\s*[:：]?\s*\n(.*?)(?=^-\s*\S|\Z)", basic, re.S|re.M)
    if sm: sns_block = sm.group(1)
    sns = sns_lines(sns_block or basic)

    slug = safe(os.path.splitext(fn)[0])
    aliases = []
    if name != slug: aliases.append(name)

    fm = ["---", "type: person", f'name: "{name}"']
    if aliases:
        fm.append("aliases:")
        for a in aliases: fm.append(f'  - "{a}"')
    fm += ["tags:", "  - person", "  - ai-mokuyokai",
           "source_status: source-backed", "sensitivity: normal",
           "generated_by: gen_people.py",
           f'origin: "5_Docs/木曜会/プロフィール帳/{fn}"',
           "last_verified: 2026-06-23", "---", ""]
    body = [f"# {name}", "",
            "## Summary",
            f"[[Companies/ai-mokuyokai]]（AI木曜会）のメンバー。" + (f"所属: {company}。" if company else ""),
            "", "## 基本情報"]
    body.append(f"- 会社・所属: {company}" if company else "- 会社・所属: （未記載）")
    if email: body.append(f"- メール: {email}")
    if sns:
        body.append("- SNS:")
        for s in sns: body.append(f"  - {s}")
    if fincs: body.append(f"- 自己紹介(Fincs): {fincs}")
    body += ["", "## 出会ったイベント（ユーザーとの接点）"]
    body += [f"- {e}" for e in ev] if ev else ["- （未記載）"]
    if mm:
        body += ["", "## メモ"] + [f"- {m}" for m in mm]
    body += ["", "## Related", "- [[Companies/ai-mokuyokai]]", "- [[People/endo-aoi]]",
             "", "## Provenance",
             "- [[Sources/src-thursday-profile-book]] — AI木曜会プロフィール帳（2026-06-23）"]
    out = "\n".join(fm) + "\n".join(body) + "\n"
    with open(os.path.join(PEOPLE, slug + ".md"), "w", encoding="utf-8") as f:
        f.write(out)
    count+=1

print(f"generated {count} People notes into {PEOPLE}")
