# Life Balance MVP

Mac activity logs are collected locally into SQLite and rendered as a responsive HTML dashboard.

This MVP intentionally avoids paid APIs. Notion, iPhone Health, and AI classification are left as later phases.

## What Phase 1 Collects

- Frontmost macOS app
- Active Chrome tab URL and title
- Input activity timestamp only, without keystroke content or idle duration storage
- Obsidian-like file edits, using configurable paths and auto-discovery of files named `Blue`
- Git commits under `~/Documents`

## Phase 2 Additions

- Score items now match the life balance items: focus, learning, rest, exercise, and sleep.
- App usage is shown as a horizontal percentage share instead of a pie chart.
- Notion task sync is available as an optional command when `NOTION_TOKEN` is configured.

## Quick Start

```bash
cd lifebalance_mvp
python3 -m src.lifebalance init
python3 -m src.lifebalance collect --seconds 60
python3 -m src.lifebalance report
python3 -m src.lifebalance serve --host 0.0.0.0 --port 8080
```

Open the dashboard on your Mac:

```text
http://localhost:8080/dashboard/daily.html
```

From an iPhone on the same Wi-Fi, use the Mac's local IP address:

```text
http://<MAC_LOCAL_IP>:8080/dashboard/daily.html
```

Find the Mac local IP with:

```bash
ipconfig getifaddr en0
```

## Permissions

Chrome URL capture uses AppleScript. macOS may ask for Automation or Accessibility permissions for Terminal, Python, or the app running this script.

## Configuration

Edit `config.json` after running `init`.

Important fields:

- `sample_interval_seconds`: collection interval
- `obsidian_paths`: specific vault folders or files to watch
- `git_search_roots`: defaults to `~/Documents`
- `category_rules`: local rule-based classification

## Optional Notion Sync

Set a Notion integration token only when you are ready to connect Notion:

```bash
export NOTION_TOKEN="secret_xxx"
python3 -m src.lifebalance sync-notion
python3 -m src.lifebalance report
```

The default database ID is:

```text
94eab464284042d2b379362fb9d20af6
```

If your task database uses different property names, edit `config.json`:

- `notion.data_source_id`
- `notion.date_property`
- `notion.status_property`
- `notion.project_relation_property`
- `notion.done_statuses`

For current Notion databases, the most reliable ID is often the data source ID:

```text
Database settings -> Manage data sources -> ... -> Copy data source ID
```

## Daily Report at 22:00

Add this to cron after adjusting the absolute path:

```cron
0 22 * * * cd /Users/aoi/Documents/Codex/2026-05-19/mvp-1-pc-iphone-2-mac/lifebalance_mvp && /usr/bin/python3 -m src.lifebalance report
```

For continuous daytime collection, run:

```bash
python3 -m src.lifebalance collect --seconds 28800
```
