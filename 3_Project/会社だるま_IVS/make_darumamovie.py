# -*- coding: utf-8 -*-
"""
カイシャダルマ撮影企画書を、固定テンプレートから企業名だけ差し替えて生成する。
テンプレート（画像・レイアウト・配色・フォントを完全保持）の表紙の企業名ランのみ置換する。

使い方:
    python3 make_darumamovie.py "株式会社ABC"
出力:
    【株式会社ABC様用】カイシャダルマ撮影企画書.pptx
"""
import sys, zipfile, shutil, os

BASE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(BASE, "【株式会社FINCHI様用】カイシャダルマ撮影企画書.pptx")
PLACEHOLDER = "株式会社FINCHI"          # テンプレート表紙の企業名ラン
SLIDE = "ppt/slides/slide1.xml"

def make(company: str):
    company = company.strip()
    if not company:
        raise SystemExit("企業名が空です。")
    out = os.path.join(BASE, f"【{company}様用】カイシャダルマ撮影企画書.pptx")
    zin = zipfile.ZipFile(TEMPLATE, "r")
    names = zin.namelist()
    slide_xml = zin.read(SLIDE).decode("utf-8")
    if f">{PLACEHOLDER}<" not in slide_xml:
        raise SystemExit(f"テンプレートの企業名ラン『{PLACEHOLDER}』が見つかりません。テンプレートを確認してください。")
    new_xml = slide_xml.replace(f">{PLACEHOLDER}<", f">{company}<")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
        for n in names:
            data = new_xml.encode("utf-8") if n == SLIDE else zin.read(n)
            zout.writestr(n, data)
    zin.close()
    print("Saved:", out)
    return out

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit('使い方: python3 make_darumamovie.py "企業名"')
    make(sys.argv[1])
