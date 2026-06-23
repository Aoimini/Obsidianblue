#!/usr/bin/env python3
"""Collect the target day's MAC app-usage from knowledgeC.db (read-only).

Why Mac-only: iPhone Screen Time does NOT materialize a readable DB on this Mac (RMAdminStore
is absent; knowledgeC.db contains only this Mac's device). So iPhone SNS time can't be read
locally — enter that manually in the voice diary and the AI folds it into the same line.

Needs Full Disk Access on the executing process (e.g. /bin/bash under launchd) to read
knowledgeC.db. Target day = env VAULTBRAIN_DATE (YYYY-MM-DD) or yesterday.
Output: ~/.local/share/vaultbrain/inbox/screentime_<date>.md  (exits 0 even on failure).
"""
import os, sys, sqlite3, datetime

DATA = os.path.expanduser("~/.local/share/vaultbrain")
INBOX = os.path.join(DATA, "inbox"); os.makedirs(INBOX, exist_ok=True)
target = os.environ.get("VAULTBRAIN_DATE")
DAY = datetime.date.fromisoformat(target) if target else (datetime.date.today() - datetime.timedelta(days=1))
OUT = os.path.join(INBOX, f"screentime_{DAY.isoformat()}.md")
KDB = os.path.expanduser("~/Library/Application Support/Knowledge/knowledgeC.db")
COCOA = 978307200  # seconds between 1970 and 2001 epochs

def log(*a): print("[collect_screentime]", *a)
def write(body): open(OUT, "w", encoding="utf-8").write(f"# Screen Time — {DAY.isoformat()}\n\n{body}\n")

NAMES = {
    "com.google.Chrome": "Chrome", "md.obsidian": "Obsidian",
    "com.anthropic.claudefordesktop": "Claude", "com.apple.mail": "Mail",
    "notion.id": "Notion", "com.apple.Safari": "Safari", "com.tinyspeck.slackmacgap": "Slack",
    "com.hnc.Discord": "Discord", "com.spotify.client": "Spotify",
    "com.apple.Photos": "Photos", "com.apple.Notes": "Notes", "com.canva.canvaeditor": "Canva",
    "com.microsoft.Powerpoint": "PowerPoint", "com.google.GeminiMacOS": "Gemini",
}
def friendly(b):
    if b in NAMES: return NAMES[b]
    seg = (b or "").split(".")[-1]
    return seg[:1].upper() + seg[1:] if seg else b

if not os.path.isfile(KDB):
    write("（knowledgeC.db が見つかりません）"); log("no knowledgeC.db"); sys.exit(0)

start = datetime.datetime.combine(DAY, datetime.time.min).timestamp() - COCOA
end = datetime.datetime.combine(DAY + datetime.timedelta(days=1), datetime.time.min).timestamp() - COCOA

try:
    # Open the original read-only + immutable (WAL-safe, no copy, no locking).
    # Requires Full Disk Access for read; a quick open() probe surfaces a clear permission error.
    try:
        open(KDB, "rb").close()
    except PermissionError:
        write("（読み取り権限なし：システム設定→プライバシーとセキュリティ→フルディスクアクセスに /bin/bash を追加してください）")
        log("permission denied"); sys.exit(0)
    con = sqlite3.connect(f"file:{KDB}?mode=ro&immutable=1", uri=True); cur = con.cursor()
    rows = cur.execute(
        "SELECT ZVALUESTRING, CAST(SUM(ZENDDATE-ZSTARTDATE) AS INT) "
        "FROM ZOBJECT WHERE ZSTREAMNAME='/app/usage' AND ZSTARTDATE>=? AND ZSTARTDATE<? "
        "GROUP BY ZVALUESTRING ORDER BY 2 DESC", (start, end)).fetchall()
    con.close()

    apps = [(friendly(b), s) for b, s in rows if s and s >= 60]  # drop <1min noise
    if not apps:
        write("Macアプリ利用: 当日のデータなし。\n\n（iPhoneのSNS時間は手動で：音声日記に「Instagram 1h20m」等と書けばまとめに反映されます）")
        log("no app usage for day"); sys.exit(0)
    total = sum(s for _, s in apps)
    lines = [f"Macアプリ利用時間（{DAY.isoformat()}・自動）: 合計 {total//3600}h{(total%3600)//60:02d}m", ""]
    for name, secs in apps[:12]:
        h, m = secs // 3600, (secs % 3600) // 60
        lines.append(f"- {name}: {h}h{m:02d}m" if h else f"- {name}: {m}m")
    lines += ["", "（iPhoneのSNS利用時間はローカル取得不可。手動で音声日記に書けば同じ枠に反映されます）"]
    write("\n".join(lines)); log(f"wrote {OUT}: {len(apps)} apps, total {total}s")
except Exception as e:
    write(f"（取得失敗: {e}）"); log(f"error: {e}")
sys.exit(0)
