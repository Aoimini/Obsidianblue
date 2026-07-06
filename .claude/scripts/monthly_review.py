#!/usr/bin/env python3
"""月次レビュー生成スクリプト.

2_daily の日記から前月分を集計して 2_daily/_review/YYYY-MM_月次レビュー.md を作る。
- Habit Tracker のチェック率（やる習慣／やらないこと=破った日）
- 手書きMEMOがある日の索引（1行目を添える）
- 自動まとめの「気付き」一覧
- 3行ふりかえり（Good / More）の一覧

使い方:
  python3 monthly_review.py            # 前月分（既に出力があれば何もしない）
  python3 monthly_review.py 2026-06    # 対象月を指定（既存出力は上書き）
"""

import re
import sys
from collections import OrderedDict
from datetime import date
from pathlib import Path

VAULT = Path(__file__).resolve().parents[2]
DAILY = VAULT / "2_daily"
REVIEW_DIR = DAILY / "_review"

AUTO_RE = re.compile(r"<!-- auto-summary:start -->.*?<!-- auto-summary:end -->", re.S)
CHECK_RE = re.compile(r"^- \[( |x|X)\] (.+?)\s*$", re.M)


def daily_files(year: int, month: int):
    """対象月の日記ファイル（当月はルート直下、過去月は YYYYMM フォルダ）。"""
    names = [f"{month:02d}-{day:02d}-{year}.md" for day in range(1, 32)]
    found = []
    for name in names:
        for cand in (DAILY / name, DAILY / f"{year}{month:02d}" / name, DAILY / str(year) / name):
            if cand.exists():
                found.append(cand)
                break
    return found


def section(text: str, start_pat: str) -> str:
    """start_pat の見出しから次の ## 見出しまでを返す。"""
    m = re.search(rf"^##\s*{start_pat}[^\n]*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return m.group(1) if m else ""


def handwritten_memo(text: str) -> str:
    memo = section(text, r"1\.\s*MEMO")
    memo = AUTO_RE.sub("", memo)
    memo = re.sub(r"<!--.*?-->", "", memo, flags=re.S)
    memo = "\n".join(l for l in memo.splitlines() if l.strip() and l.strip() != "---")
    return memo.strip()


def kizuki(text: str):
    """自動まとめ内の「気付き」ブロックの箇条書きを返す。"""
    m = AUTO_RE.search(text)
    if not m:
        return []
    lines, active = [], False
    for line in m.group(0).splitlines():
        s = line.strip()
        if s.startswith("**気付き**"):
            active = True
            continue
        if active:
            if s.startswith("**") or s.startswith("<!--"):
                break
            if s.startswith("- "):
                lines.append(s[2:].strip())
    return lines


def habit_stats(text: str):
    """(やる習慣 {label: (checked, total)}, やらないこと {label: (checked, total)})"""
    body = section(text, r"2\.\s*Habit")
    if not body:
        return {}, {}
    parts = re.split(r"\*\*やらないこと\*\*[^\n]*", body, maxsplit=1)
    do_part = parts[0]
    dont_part = parts[1] if len(parts) > 1 else ""
    do = {m.group(2).strip(): m.group(1).lower() == "x" for m in CHECK_RE.finditer(do_part)}
    dont = {m.group(2).strip(): m.group(1).lower() == "x" for m in CHECK_RE.finditer(dont_part)}
    return do, dont


def furikaeri(text: str):
    """3行ふりかえり（Good/More/明日イチバン）の記入済み行を返す。"""
    body = section(text, r"3\.\s*3行ふりかえり")
    out = {}
    for key in ("Good", "More", "明日イチバン"):
        m = re.search(rf"^- {key}：\s*(.+)$", body, re.M)
        if m and m.group(1).strip():
            out[key] = m.group(1).strip()
    return out


def build(year: int, month: int) -> str:
    files = daily_files(year, month)
    do_agg, dont_agg = OrderedDict(), OrderedDict()
    memo_index, kizuki_all, good_all, more_all = [], [], [], []
    diary_days = 0

    for f in sorted(files):
        text = f.read_text(encoding="utf-8")
        day = f.stem  # MM-DD-YYYY

        memo = handwritten_memo(text)
        if len(memo) >= 10:
            diary_days += 1
            first = memo.splitlines()[0][:60]
            memo_index.append(f"- [[{day}]] — {first}")

        for k in kizuki(text):
            kizuki_all.append(f"- {day[3:5]}日: {k}")

        do, dont = habit_stats(text)
        for label, checked in do.items():
            c, t = do_agg.get(label, (0, 0))
            do_agg[label] = (c + int(checked), t + 1)
        for label, checked in dont.items():
            c, t = dont_agg.get(label, (0, 0))
            dont_agg[label] = (c + int(checked), t + 1)

        fk = furikaeri(text)
        if "Good" in fk:
            good_all.append(f"- {day[3:5]}日: {fk['Good']}")
        if "More" in fk:
            more_all.append(f"- {day[3:5]}日: {fk['More']}")

    lines = [
        "---",
        "tags:",
        "  - 月次レビュー",
        "---",
        "",
        f"# {year}-{month:02d} 月次レビュー",
        "",
        f"対象: {len(files)}日分 ／ 手書き日記を書いた日: **{diary_days}日**",
        "",
        "## 習慣チェック率",
        "",
    ]
    if do_agg:
        for label, (c, t) in do_agg.items():
            pct = round(100 * c / t) if t else 0
            lines.append(f"- {label}: **{c}/{t}日** ({pct}%)")
        # Chartsプラグイン用の棒グラフ
        labels = ", ".join(l.split("（")[0] for l in do_agg)
        data = ", ".join(str(c) for c, _ in do_agg.values())
        lines += [
            "",
            "```chart",
            "type: bar",
            f"labels: [{labels}]",
            "series:",
            "  - title: 達成日数",
            f"    data: [{data}]",
            "```",
        ]
    else:
        lines.append("- （チェックの記録なし）")
    lines += ["", "**やらないこと（破った日）**", ""]
    if dont_agg:
        for label, (c, t) in dont_agg.items():
            lines.append(f"- {label}: {c}/{t}日")
    else:
        lines.append("- （記録なし）")

    lines += ["", "## Good", ""]
    lines += good_all or ["- （記入なし）"]
    lines += ["", "## More", ""]
    lines += more_all or ["- （記入なし）"]

    lines += ["", "## 自動まとめの気付き", ""]
    lines += kizuki_all or ["- （なし）"]

    lines += ["", "## 手書き日記のあった日", ""]
    lines += memo_index or ["- （なし）"]

    lines += [
        "",
        "---",
        "",
        "## 今月をひとことで（手書き欄）",
        "",
        "- ",
        "",
        f"📌 来月の目標を [[2026_GOAL]] に書き換えるのを忘れずに。",
        "",
    ]
    return "\n".join(lines)


def main():
    if len(sys.argv) > 1:
        year, month = map(int, sys.argv[1].split("-"))
        force = True
    else:
        today = date.today()
        year, month = (today.year, today.month - 1) if today.month > 1 else (today.year - 1, 12)
        force = False

    REVIEW_DIR.mkdir(exist_ok=True)
    out = REVIEW_DIR / f"{year}-{month:02d}_月次レビュー.md"
    if out.exists() and not force:
        return  # 既に生成済み（launchd RunAtLoad の重複実行ガード）
    out.write_text(build(year, month), encoding="utf-8")
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
