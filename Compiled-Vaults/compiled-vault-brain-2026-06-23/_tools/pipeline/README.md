# Vault Brain — Daily Auto-Update Pipeline

Every morning (04:00, via launchd) this folds **yesterday's** activity into the compiled brain
vault, writes a "1日のまとめ" into that day's Obsidian daily note, validates, and commits.

**Target day = yesterday** by default (the 4am run summarizes the day that just ended).
Override with `VAULTBRAIN_DATE=YYYY-MM-DD`.

**Runs up to 3x/day, does work once.** Fires at **04:00** and **16:00** (retry, in case 04:00 hit the
Claude session limit) and at **login/boot** (catch-up if the Mac was off). A once-per-target-day
guard (`~/.local/share/vaultbrain/last_completed_target`) skips if the day is already summarized.
A run that hits the session limit (RATELIMIT) or fails is NOT marked done, so a later slot retries it.
Force a re-run with `VAULTBRAIN_FORCE=1` or an explicit `VAULTBRAIN_DATE`.

## What runs each morning
1. `collect_local.sh` — source-vault (Obsidian) markdown changed since last run, incl. that day's
   daily note + voice diary (read-only; strips its own past auto-summary to avoid re-summarizing).
2. `collect_chrome.py` — that day's Google searches + visited pages from Chrome history (read-only).
3. `collect_screentime.py` — that day's SNS Screen Time, if set up (experimental; read-only).
4. `collect_notion.py` — recently-edited Notion DB rows (read-only, optional; needs token).
5. `gen_people.py` — regenerates AI木曜会 People notes (idempotent).
6. `claude -p` (sonnet) — folds deltas into canonical notes **and writes the daily digest**
   `Reports/daily-digests/<date>.md` with a `memo-block`. **Skipped if no new input.**
7. `inject_memo.py` — inserts that memo-block into the day's `2_daily/<MM-DD-YYYY>.md` `## 1. MEMO`
   (creates the note from `4_template/日記.md` if missing; idempotent; **preserves your voice diary**).
8. `validate.py` gate → records status in `Reports/auto-update-log.md` → `git commit` (local only).

## The daily MEMO write-back
The summary lands in your Obsidian daily note between `<!-- auto-summary:start -->` / `:end` markers
inside `## 1. MEMO`, with **行動ハイライト / 検索テーマ / 気付き / SNS利用**. Re-runs replace that block
in place; anything you type yourself (voice diary, notes) is left untouched. This is the ONE place
the pipeline writes into the original vault — and only between those markers.

## Inputs captured
- **Obsidianメモ/日記/音声日記** — any note you add/edit (the daily note's voice diary is read & folded in).
- **Google検索履歴** — via Chrome's local history (`q=` searches). Digest summarizes *themes*, not raw URLs.
- **Mac アプリ利用時間** — from `knowledgeC.db` (needs Full Disk Access).
- **iPhone SNS Screen Time** — save a Screen Time screenshot into iCloud Drive → `ScreenTime/`.
  `collect_screentime.py` OCRs the newest one for that day with macOS Vision (local, free) and the
  AI extracts each SNS app's time into the digest. (No readable iPhone DB exists, hence the screenshot.)
  You can still just type it in the voice diary instead.
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
- Deterministic steps (collect, `gen_people.py`, `inject_memo.py`, `validate.py`, `git commit`)
  are run by the shell launcher — not by the AI.
- The AI edits only the compiled vault. The **only** write into the original vault is the
  marker-bounded MEMO block, done deterministically by `inject_memo.py` (never the AI).
- All changes are local git commits (reversible, never pushed). Commits stage ONLY the compiled
  vault + the one daily note touched.
- Token & collected data live OUTSIDE the vault/git: `~/.local/share/vaultbrain/`.

## One-time setup
```bash
chmod +x _tools/pipeline/*.sh

# (optional) enable Notion — create an internal integration at
#   https://www.notion.so/my-integrations  then:
bash _tools/pipeline/setup_notion.sh
# ...and in Notion, share the target pages/DBs with the integration (••• → Connections).

# Mac app-usage (collect_screentime.py) needs Full Disk Access for /bin/bash (see note below).
# iPhone SNS Screen Time via screenshot OCR (folder already created at):
#   ~/Library/Mobile Documents/com~apple~CloudDocs/ScreenTime   (= iCloud Drive → "ScreenTime")
#   On iPhone: take a Screen Time screenshot → Share → Save to Files → ScreenTime folder
#   (or make a 1-tap Shortcut "Save to ScreenTime"). The morning run OCRs that day's newest image.

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
