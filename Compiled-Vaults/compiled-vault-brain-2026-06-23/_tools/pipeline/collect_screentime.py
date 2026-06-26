#!/usr/bin/env python3
"""Collect the target day's screen-time signals (read-only):
  1) Mac app usage from knowledgeC.db (needs Full Disk Access).
  2) iPhone SNS time, OCR'd from a Screen Time screenshot you saved to an iCloud Drive folder.

iPhone Screen Time has no readable local DB, so the workflow is: take a Screen Time screenshot
on the iPhone and save it into iCloud Drive → "ScreenTime/". This script OCRs the newest one
for the target day (via macOS Vision, local + free) and writes the text so the AI can extract
each SNS app's time into the daily digest.

Target day = env VAULTBRAIN_DATE (YYYY-MM-DD) or yesterday.
Output: ~/.local/share/vaultbrain/inbox/screentime_<date>.md  (exits 0 even on failure).
"""
import os, sys, sqlite3, datetime, subprocess, glob

DATA = os.path.expanduser("~/.local/share/vaultbrain")
INBOX = os.path.join(DATA, "inbox"); os.makedirs(INBOX, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
target = os.environ.get("VAULTBRAIN_DATE")
DAY = datetime.date.fromisoformat(target) if target else (datetime.date.today() - datetime.timedelta(days=1))
OUT = os.path.join(INBOX, f"screentime_{DAY.isoformat()}.md")
KDB = os.path.expanduser("~/Library/Application Support/Knowledge/knowledgeC.db")
SHOT_DIR = os.path.expanduser("~/Library/Mobile Documents/com~apple~CloudDocs/ScreenTime")
COCOA = 978307200

def log(*a): print("[collect_screentime]", *a)

# ---------- 1) Mac app usage (knowledgeC.db) ----------
NAMES = {"com.google.Chrome": "Chrome", "md.obsidian": "Obsidian",
         "com.anthropic.claudefordesktop": "Claude", "com.apple.mail": "Mail",
         "notion.id": "Notion", "com.apple.Safari": "Safari", "com.tinyspeck.slackmacgap": "Slack",
         "com.spotify.client": "Spotify", "com.apple.Photos": "Photos", "com.apple.Notes": "Notes",
         "com.canva.canvaeditor": "Canva", "com.microsoft.Powerpoint": "PowerPoint",
         "com.google.GeminiMacOS": "Gemini"}
def friendly(b):
    if b in NAMES: return NAMES[b]
    seg = (b or "").split(".")[-1]
    return seg[:1].upper() + seg[1:] if seg else b

def mac_usage_section():
    if not os.path.isfile(KDB):
        return "## Macアプリ利用\n（knowledgeC.db が見つかりません）"
    try:
        open(KDB, "rb").close()
    except PermissionError:
        return "## Macアプリ利用\n（読み取り権限なし：フルディスクアクセスに /bin/bash を追加してください）"
    start = datetime.datetime.combine(DAY, datetime.time.min).timestamp() - COCOA
    end = datetime.datetime.combine(DAY + datetime.timedelta(days=1), datetime.time.min).timestamp() - COCOA
    try:
        con = sqlite3.connect(f"file:{KDB}?mode=ro&immutable=1", uri=True)
        rows = con.execute(
            "SELECT ZVALUESTRING, CAST(SUM(ZENDDATE-ZSTARTDATE) AS INT) FROM ZOBJECT "
            "WHERE ZSTREAMNAME='/app/usage' AND ZSTARTDATE>=? AND ZSTARTDATE<? "
            "GROUP BY ZVALUESTRING ORDER BY 2 DESC", (start, end)).fetchall()
        con.close()
    except Exception as e:
        return f"## Macアプリ利用\n（取得失敗: {e}）"
    apps = [(friendly(b), s) for b, s in rows if s and s >= 60]
    if not apps:
        return "## Macアプリ利用\n当日のデータなし。"
    total = sum(s for _, s in apps)
    out = [f"## Macアプリ利用（自動）: 合計 {total//3600}h{(total%3600)//60:02d}m"]
    for name, secs in apps[:12]:
        h, m = secs // 3600, (secs % 3600) // 60
        out.append(f"- {name}: {h}h{m:02d}m" if h else f"- {name}: {m}m")
    return "\n".join(out)

# ---------- 2) iPhone Screen Time screenshot (OCR) ----------
def shot_section():
    if not os.path.isdir(SHOT_DIR):
        return ("## iPhoneスクリーンタイム（スクショ）\n"
                f"（フォルダ未作成: iCloud Driveに『ScreenTime』を作り、スクショを保存してください）")
    # screenshots for day D are taken during D or the morning after → window [D 00:00, D+1 12:00)
    lo = datetime.datetime.combine(DAY, datetime.time.min).timestamp()
    hi = datetime.datetime.combine(DAY + datetime.timedelta(days=1), datetime.time(12)).timestamp()
    imgs = []
    for ext in ("png", "PNG", "jpg", "JPG", "jpeg", "heic", "HEIC"):
        imgs += glob.glob(os.path.join(SHOT_DIR, f"*.{ext}"))
    cand = [(p, os.path.getmtime(p)) for p in imgs if lo <= os.path.getmtime(p) < hi]
    if not cand:
        return ("## iPhoneスクリーンタイム（スクショ）\n"
                "（対象日のスクショなし。あればOCRしてSNS時間を反映します）")
    newest = max(cand, key=lambda x: x[1])[0]
    try:
        res = subprocess.run(["swift", os.path.join(HERE, "ocr_image.swift"), newest],
                             capture_output=True, text=True, timeout=120)
        text = (res.stdout or "").strip()
    except Exception as e:
        return f"## iPhoneスクリーンタイム（スクショ）\n（OCR失敗: {e}）"
    if not text or text in ("LOAD_FAIL", "OCR_FAIL"):
        return f"## iPhoneスクリーンタイム（スクショ）\n（OCRできず: {os.path.basename(newest)}）"
    return ("## iPhoneスクリーンタイム（スクショOCR — このテキストからSNSアプリ名と利用時間を抽出）\n"
            f"source: {os.path.basename(newest)}\n```\n{text[:3000]}\n```")

with open(OUT, "w", encoding="utf-8") as f:
    f.write(f"# Screen Time — {DAY.isoformat()}\n\n{mac_usage_section()}\n\n{shot_section()}\n")
log(f"wrote {OUT}")
sys.exit(0)
