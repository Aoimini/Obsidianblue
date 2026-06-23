---
type: report
report: validation
last_run: 2026-06-23
phase: 2-smoke-pass
---

# VALIDATION REPORT

## Scripts
| Script | Purpose |
|---|---|
| `_tools/validate.py` | wikilink, slug/path, secret scan, provenance, required-artifact checks |

## Command
```bash
cd Compiled-Vaults/compiled-vault-brain-2026-06-23 && python3 _tools/validate.py
```

## Result (broad pass) — 2026-06-23

```
Markdown notes scanned: 137
[broken_links] 0
[ambiguous_links] 0
[bad_slugs] 0
[secrets] 0
[missing_provenance] 0
[missing_artifacts] 0
TOTAL ISSUES: 0
RESULT: PASS ✅
```

92 People (90 generated via `_tools/gen_people.py` + 2 hand-authored), 10 Companies, 16 source traces, etc. All hard gates pass.

## Result (smoke pass) — 2026-06-23

```
Markdown notes scanned: 28
[broken_links] 0
[ambiguous_links] 0
[bad_slugs] 0
[secrets] 0
[missing_provenance] 0
[missing_artifacts] 0
TOTAL ISSUES: 0
RESULT: PASS ✅
```

| Hard gate | Status |
|---|---|
| 0 broken internal wikilinks (Obsidian resolution) | ✅ PASS |
| 0 ambiguous wikilinks | ✅ PASS |
| 0 empty/invalid slugs & paths (e.g. People/.md) | ✅ PASS |
| 0 copied secrets/tokens/keys/passwords | ✅ PASS |
| Every canonical note has provenance | ✅ PASS |
| Required folders & files present | ✅ PASS |

Notes:
- 1度目の実行で `luma-profile-book`（ユーザーのメモリ側ノートで、vault外）へのwikilink 2件のbroken linkを検出 → プレーンテキスト参照に修正し再実行でPASS。
- secret scanはプレースホルダ（`secret_xxx`等）を除外。Life Balance READMEの実トークンは元々非掲載。
- 本格パス後に同スクリプトを全件再実行して最終ゲートを判定する。
