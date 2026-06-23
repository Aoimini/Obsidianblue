#!/usr/bin/env python3
"""Collect recent Notion work data via an internal integration token (read-only).

Token comes from env NOTION_TOKEN (loaded by the launcher from a chmod-600 file
OUTSIDE the vault). Writes a delta file into the runtime inbox (not committed).
Never writes the token anywhere. Exits 0 even on failure (pipeline keeps going).

Setup: create an internal integration at https://www.notion.so/my-integrations ,
copy the token, run setup_notion.sh, then SHARE the relevant pages/databases with
the integration in Notion (••• -> Connections -> your integration).
"""
import os, sys, json, datetime, urllib.request, urllib.error

TOKEN = os.environ.get("NOTION_TOKEN", "").strip()
DATA = os.path.expanduser("~/.local/share/vaultbrain")
INBOX = os.path.join(DATA, "inbox")
os.makedirs(INBOX, exist_ok=True)
TS = datetime.date.today().isoformat()
OUT = os.path.join(INBOX, f"notion_{TS}.md")

def log(*a): print("[collect_notion]", *a)

if not TOKEN:
    log("no NOTION_TOKEN set; skipping Notion collection")
    sys.exit(0)

API = "https://api.notion.com/v1"
H = {"Authorization": f"Bearer {TOKEN}",
     "Notion-Version": "2022-06-28",
     "Content-Type": "application/json"}

def api(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, headers=H, method=method)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def title_of(obj):
    # works for page or database objects
    props = obj.get("properties", {})
    for v in props.values():
        if v.get("type") == "title":
            return "".join(t.get("plain_text", "") for t in v.get("title", [])) or "(untitled)"
    # database object has top-level title
    if "title" in obj and isinstance(obj["title"], list):
        return "".join(t.get("plain_text", "") for t in obj["title"]) or "(untitled)"
    return "(untitled)"

try:
    # find databases the integration can see
    res = api("POST", "/search",
              {"filter": {"value": "database", "property": "object"},
               "page_size": 25})
    dbs = res.get("results", [])
    lines = [f"# Notion delta — {TS}", "",
             f"Integration sees {len(dbs)} database(s). Recently edited pages per database below.", ""]
    if not dbs:
        lines.append("(No databases shared with the integration yet. In Notion, open the page/DB -> ••• -> Connections -> add your integration.)")
    cutoff = (datetime.datetime.utcnow() - datetime.timedelta(days=7)).isoformat() + "Z"
    for db in dbs:
        dbtitle = title_of(db)
        dbid = db["id"]
        lines.append(f"## DB: {dbtitle}  ({dbid})")
        try:
            q = api("POST", f"/databases/{dbid}/query",
                    {"page_size": 15,
                     "sorts": [{"timestamp": "last_edited_time", "direction": "descending"}]})
            rows = q.get("results", [])
            recent = [r for r in rows if r.get("last_edited_time", "") >= cutoff]
            if not recent:
                lines.append("- (no pages edited in last 7 days)")
            for r in recent:
                lines.append(f"- {title_of(r)} — edited {r.get('last_edited_time','?')}")
        except Exception as e:
            lines.append(f"- (query failed: {e})")
        lines.append("")
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    log(f"wrote {OUT} ({len(dbs)} databases)")
except urllib.error.HTTPError as e:
    log(f"HTTP {e.code}: {e.read()[:200]!r} — check token / integration sharing")
except Exception as e:
    log(f"error: {e}")
sys.exit(0)
