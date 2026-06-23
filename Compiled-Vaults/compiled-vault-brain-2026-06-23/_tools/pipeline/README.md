# Vault Brain — Daily Auto-Update Pipeline

Every morning (04:00, via launchd) this folds new information from your **local vault**
(and optionally **Notion**) into the compiled brain vault, validates it, and commits it.

## What runs each morning
1. `collect_local.sh` — finds source-vault (Obsidian) markdown changed since last run (read-only).
2. `collect_chrome.py` — today's Google searches + visited pages from Chrome's local history (read-only).
3. `collect_notion.py` — recently-edited Notion DB rows (read-only, optional; needs token).
4. `gen_people.py` — regenerates AI木曜会 People notes (idempotent).
5. `claude -p` (model: sonnet by default) — folds deltas into canonical notes **and writes a
   daily digest** `Reports/daily-digests/<date>.md` ("1日のまとめ"). **Skipped if no new input.**
6. `validate.py` — link/secret/provenance/slug/artifact gate.
7. Records status in `Reports/auto-update-log.md`, then `git commit` (local only — never pushes).

## Inputs captured
- **Obsidianメモ/日記** — any note you add/edit in the Bluenote vault.
- **Google検索履歴** — via Chrome's local history (your `q=` searches). The digest summarizes
  *themes*, not raw URLs. (Account-level "My Activity" has no clean API, so Chrome-local is used.)
- **Notion** — your work DBs, once you connect a token.
- NOT here: Gmail/Calendar/Slack (managed connectors aren't available headless) — do those in a session.

## Privacy note
Browsing/search history is sensitive. Raw history stays OUTSIDE git in `~/.local/share/vaultbrain/`;
only a themed summary enters the vault. If you don't want searches captured, delete
`collect_chrome.py` from the pipeline (or remove its line from `daily_update.sh`).

## Safety
- The morning `claude` run uses `--permission-mode acceptEdits` with `--allowedTools Read Edit
  Write Grep Glob` — **file edits only, no shell, no network, no connectors**. It cannot send
  email, post, run arbitrary commands, or bypass approvals. (No `bypassPermissions`.)
- Deterministic steps (collect, `gen_people.py`, `validate.py`, `git commit`) are run by the
  shell launcher — not by the AI.
- The **original vault is read-only**. All changes are local git commits (reversible, never pushed).
- Token & collected data live OUTSIDE the vault/git: `~/.local/share/vaultbrain/`.

## One-time setup
```bash
chmod +x _tools/pipeline/*.sh

# (optional) enable Notion — create an internal integration at
#   https://www.notion.so/my-integrations  then:
bash _tools/pipeline/setup_notion.sh
# ...and in Notion, share the target pages/DBs with the integration (••• → Connections).

# install the 04:00 schedule
cp _tools/pipeline/com.vaultbrain.daily.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.vaultbrain.daily.plist

# (recommended) wake the Mac just before 04:00 so it isn't asleep:
sudo pmset repeat wakeorpoweron MTWRFSU 03:58:00
```

If Chrome history reading fails under launchd (empty `chrome_<date>.md`), grant **Full Disk
Access** to `/bin/bash` (System Settings → Privacy & Security → Full Disk Access). Reading
worked from an interactive shell, but the launchd background context can be stricter.

## Manual / test commands
```bash
# dry run: collect only, no AI, no commit
VAULTBRAIN_DRYRUN=1 bash _tools/pipeline/daily_update.sh

# full manual run (uses sonnet; set opus if you want)
VAULTBRAIN_MODEL=opus bash _tools/pipeline/daily_update.sh

# logs
tail -f ~/.local/share/vaultbrain/logs/run_$(date +%F).log

# disable the schedule
launchctl unload ~/Library/LaunchAgents/com.vaultbrain.daily.plist
```

## Cost note
The AI step is skipped on days with no new input. On active days it runs one `claude -p`
pass (sonnet by default to keep cost low; override with `VAULTBRAIN_MODEL=opus`).

## Connector scope
Gmail / Calendar / Slack are NOT in this pipeline (managed connectors aren't available to a
headless CLI run — verified). Bring those in during an interactive session, or add direct
API integrations later. Notion is included because an internal integration token works headless.
