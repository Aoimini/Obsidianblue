#!/usr/bin/env python3
"""英単語帳.md → quiz.html を生成するビルドスクリプト。

毎朝のスケジュールタスクから実行される:
    python3 build_quiz.py
入力:  ../../6_Personal/英単語帳.md  (## YYYY-MM-DD セクション + 単語::意味 行)
出力:  ./quiz.html  (template.html の __WORDS_JSON__ / __BUILD__ を置換)
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).parent
BANK = HERE / "../../6_Personal/英単語帳.md"
TEMPLATE = HERE / "template.html"
OUT = HERE / "quiz.html"


def parse_bank(text: str):
    words, seen, current_date = [], set(), None
    for raw in text.splitlines():
        line = re.sub(r"<!--SR:.*?-->", "", raw).strip()
        m = re.match(r"^##\s+(\d{4}-\d{2}-\d{2})", line)
        if m:
            current_date = m.group(1)
            continue
        if "::" not in line or line.startswith("#") or current_date is None:
            continue
        w, _, meaning = line.partition("::")
        w, meaning = w.strip(), meaning.strip()
        if not w or not meaning or w.lower() in seen:
            continue
        seen.add(w.lower())
        words.append({"w": w, "m": meaning, "d": current_date})
    return words


def main():
    words = parse_bank(BANK.read_text(encoding="utf-8"))
    if len(words) < 4:
        sys.exit("単語が4語未満のため生成を中止（4択が作れない）")
    html = TEMPLATE.read_text(encoding="utf-8")
    html = html.replace("__WORDS_JSON__", json.dumps(words, ensure_ascii=False))
    html = html.replace("__BUILD__", date.today().isoformat())
    OUT.write_text(html, encoding="utf-8")
    print(f"OK: {len(words)}語 → {OUT}")


if __name__ == "__main__":
    main()
