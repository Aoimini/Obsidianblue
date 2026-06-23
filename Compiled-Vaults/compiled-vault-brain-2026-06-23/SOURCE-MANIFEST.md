---
type: manifest
created: 2026-06-23
last_updated: 2026-06-23
---

# SOURCE MANIFEST

Records every source and connector used, with account/workspace verification. No credentials or secrets are stored here.

## Local Sources
| Source | Path | Read/Write observed | Approved |
|---|---|---|---|
| Obsidian vault "Bluenote" | `/Users/aoi/Desktop/Bluenote` | read-only (no mutations) | yes (read-only) |

## Connectors

### Gmail
- Account: `aoiendo05@gmail.com`
- Workspace/Org: personal Google account
- Verification: `list_labels` → returned user labels (✈️, Oliveデビット通知)
- Timestamp: 2026-06-23
- Capability observed: read
- Approved for ingestion: **yes** (smoke pass 5-10 threads first)

### Google Calendar
- Account: `aoiendo05@gmail.com`
- Verification: `list_calendars` → プライベート / 家族 / ★ / 日本の祝日
- Timestamp: 2026-06-23
- Capability observed: read
- Approved for ingestion: **yes**

### Google Drive
- Account: `aoiendo05@gmail.com` (file owner field)
- Verification: `list_recent_files` → owner = aoiendo05@gmail.com
- Timestamp: 2026-06-23
- Capability observed: read
- Approved for ingestion: **yes** (metadata + links only for large media)

### Slack
- Account: `aoiendo05` / Real name 遠藤 葵 / User ID `U0B5BQDULLT`
- Workspace/Org: **Concon Inc**
- Verification: `slack_read_user_profile(U0B5BQDULLT)`
- Timestamp: 2026-06-23
- Capability observed: read
- Approved for ingestion: **yes**

### Notion
- Account: `Aostu` / `2520095291@campus.ouj.ac.jp` (放送大学 / Open University Japan student account)
- Verification: `notion-get-users(self)` + `notion-search` (confirmed real work data: 制作進行/案件管理/クリエイティブプロジェクトDB) + `notion-fetch`
- Timestamp: 2026-06-23
- Capability observed: read
- Approved for ingestion: **YES** — account mismatch noted, but **user explicitly confirmed inclusion (2026-06-23)**; workspace holds the user's real work content.

## Broad-pass connector usage (2026-06-23, all read-only)
| Connector | Calls made | Data taken |
|---|---|---|
| Gmail | `search_threads` (career/work) + `get_thread` (non-no editor body) | metadata + 1 thread body |
| Calendar | `list_events` (2026-06) | events (trip, active selections 代アニ/Wantedly/FUSION/TOKIUM, TOEIC, daily schedule) |
| Notion | `notion-search`, `notion-fetch` (クリエイティブプロジェクトDB) | confirmed presence of work DBs; row data not yet imported |
| Slack | `slack_read_user_profile`, `slack_search_channels` (木曜会/バレー/AI → 0 hits) | profile only; Concon Inc relationship still unconfirmed |
| Drive | `list_recent_files` | metadata only (media not ingested) |

## Write/Mutation Policy
No external writes performed or planned without explicit user approval: no email send, no calendar invite, no Slack message, no Notion write, no Drive write. Original local vault not modified.
