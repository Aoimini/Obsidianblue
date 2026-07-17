#!/usr/bin/env python3
# ソリェル（マヨルカ）のトラム＋サン・バルトメウ教会の写真をもとにした
# レイヤードジオラマ / ポップアップカードの型紙SVGを生成するスクリプト。
# 単位はすべてmm。A4実寸（100%）で印刷する前提。
import math, os

OUT = os.path.dirname(os.path.abspath(__file__))

# ---- palette (photo-matched) ----
SKY_TOP = "#3F7FD0"; SKY_BOT = "#AACBEE"
STONE = "#CBBDA5"; STONE_MID = "#B7A78D"; STONE_DK = "#93856C"
OPENING = "#453C30"; TRACE = "#E7DCC6"; JOINT = "#BAA98E"
WOOD = "#A9683A"; WOOD_DK = "#6E421F"; ORANGE = "#E4581F"
ROOF = "#75838F"; ROOF_LT = "#8E9AA5"; VENT = "#67747F"
GLASS = "#4A392C"; UNDER = "#3A3128"; BRASS = "#C9A227"; PIN = "#2C4F9E"
TILE = "#D9C9A8"; TILE_LN = "#B7A47F"; RAIL = "#6B5B44"
G1 = "#4E7A3A"; G2 = "#6B9A4C"; G3 = "#87B268"; TRUNK = "#5C4630"
HOUSE = "#C4B49B"; ROOFH = "#6E4A32"
LAMPC = "#2B2B2B"; LGLASS = "#F4E9C8"
CUT = "#111111"
FOLD_V = "#1E6FD9"   # 谷折り: 青破線
FOLD_M = "#D92B2B"   # 山折り: 赤一点鎖線
SLOT = "#D92B2B"     # 差し込みスリット: 赤実線

def svg_a4(content, landscape=False):
    w, h = (297, 210) if landscape else (210, 297)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}mm" height="{h}mm" '
            f'viewBox="0 0 {w} {h}" font-family="Hiragino Sans, sans-serif">\n'
            f'<rect x="0" y="0" width="{w}" height="{h}" fill="#FFFFFF"/>\n{content}\n</svg>\n')

def caption(x, y, txt, size=3.2, color="#666666"):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{txt}</text>\n'

# ============================================================
# 教会（サン・バルトメウ教会ファサード） 140 x 95
# ============================================================
def church_group():
    s = '<g id="church">\n'
    s += (f'<path d="M6,95 L6,30 L9,30 L9,12 L15,0 L21,12 L21,30 L24,30 L24,6 '
          f'L118,6 L118,14 L122,14 L122,8 L132,8 L132,14 L138,14 L138,95 Z" '
          f'fill="{STONE}" stroke="{CUT}" stroke-width="0.5" stroke-linejoin="round"/>\n')
    # 左の尖塔まわりの陰影
    s += f'<rect x="6" y="30" width="18" height="65" fill="{STONE_MID}"/>\n'
    s += f'<polygon points="15,0 21,12 15,12" fill="{STONE_MID}"/>\n'
    s += f'<path d="M12,52 v-8 a3,3 0 0 1 6,0 v8 z" fill="{OPENING}"/>\n'
    # 主ファサード頂部の狭間（クレネル）: 印刷表現
    for i in range(11):
        x = 28 + 8 * i
        s += f'<rect x="{x}" y="6" width="4" height="4" fill="{STONE_DK}"/>\n'
    # ギャラリー（連続アーチ帯）
    s += f'<rect x="24" y="13" width="94" height="14" fill="{STONE_MID}"/>\n'
    for i in range(8):
        x = 29 + 11 * i
        s += f'<path d="M{x},27 v-7.5 a2.5,2.5 0 0 1 5,0 V27 Z" fill="{OPENING}"/>\n'
    s += f'<rect x="24" y="27" width="94" height="2" fill="{STONE_DK}"/>\n'
    # 側柱
    s += f'<rect x="24" y="10" width="4" height="85" fill="{STONE_MID}"/>\n'
    s += f'<rect x="114" y="10" width="4" height="85" fill="{STONE_MID}"/>\n'
    # 石目地
    for y in (35, 45, 58, 70, 82):
        s += f'<line x1="28" y1="{y}" x2="114" y2="{y}" stroke="{JOINT}" stroke-width="0.3"/>\n'
    # バラ窓
    s += f'<circle cx="70" cy="50" r="17" fill="{TRACE}"/>\n'
    s += f'<circle cx="70" cy="50" r="17" fill="none" stroke="{STONE_DK}" stroke-width="0.8"/>\n'
    s += f'<circle cx="70" cy="50" r="14" fill="{OPENING}"/>\n'
    for k in range(10):
        a = math.radians(k * 36)
        x2 = 70 + 13.3 * math.cos(a); y2 = 50 + 13.3 * math.sin(a)
        s += f'<line x1="70" y1="50" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{TRACE}" stroke-width="1"/>\n'
    for k in range(10):
        a = math.radians(k * 36 + 18)
        cx = 70 + 8.75 * math.cos(a); cy = 50 + 8.75 * math.sin(a)
        s += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2" fill="none" stroke="{TRACE}" stroke-width="0.8"/>\n'
    s += f'<circle cx="70" cy="50" r="3.5" fill="none" stroke="{TRACE}" stroke-width="1.2"/>\n'
    # バラ窓脇の小円窓
    for cx in (40, 100):
        s += f'<circle cx="{cx}" cy="42" r="4" fill="{OPENING}" stroke="{TRACE}" stroke-width="0.8"/>\n'
        s += f'<line x1="{cx-2.2}" y1="42" x2="{cx+2.2}" y2="42" stroke="{TRACE}" stroke-width="0.7"/>\n'
        s += f'<line x1="{cx}" y1="39.8" x2="{cx}" y2="44.2" stroke="{TRACE}" stroke-width="0.7"/>\n'
    # 正面ポータル（尖頭アーチ）
    s += f'<path d="M58,95 L58,80 Q58,68 70,68 Q82,68 82,80 L82,95 Z" fill="{OPENING}"/>\n'
    s += f'<path d="M61,95 L61,81 Q61,71 70,71 Q79,71 79,81 L79,95 Z" fill="none" stroke="{TRACE}" stroke-width="0.8"/>\n'
    # 右の鐘塔
    s += f'<rect x="118" y="14" width="4" height="81" fill="{STONE_MID}"/>\n'
    for x in (121, 129):
        s += f'<rect x="{x}" y="14" width="4" height="4" fill="{STONE_DK}"/>\n'
    for x in (124, 130):
        s += f'<path d="M{x},42 v-9 a2,2 0 0 1 4,0 v9 z" fill="{OPENING}"/>\n'
    s += f'<line x1="127" y1="8.5" x2="127" y2="13.5" stroke="{STONE_DK}" stroke-width="1.2"/>\n'
    s += f'<line x1="124.5" y1="10" x2="129.5" y2="10" stroke="{STONE_DK}" stroke-width="1.2"/>\n'
    for y in (52, 64, 76, 86):
        s += f'<line x1="120" y1="{y}" x2="136" y2="{y}" stroke="{JOINT}" stroke-width="0.3"/>\n'
    s += '</g>\n'
    return s

# ============================================================
# トラム（ソリェル鉄道3号車＋客車） 150 x 55
# ============================================================
def tram_group():
    s = '<g id="tram">\n'
    s += (f'<path d="M2,52 L2,14 L6,10 L30,10 L30,5 L62,5 L66,0 L88,0 L92,5 L96,5 '
          f'L96,10 L116,10 L116,38 L120,38 L120,12 L124,8 L144,8 L148,12 L148,52 Z" '
          f'fill="{WOOD}" stroke="{CUT}" stroke-width="0.5" stroke-linejoin="round"/>\n')
    # 足回り（先に下地）
    s += f'<rect x="2" y="44" width="146" height="8" fill="{UNDER}"/>\n'
    # パンタグラフ
    s += f'<polygon points="62,5 66,0 88,0 92,5" fill="#DCE3E8"/>\n'
    s += f'<line x1="64" y1="4.6" x2="77" y2="1" stroke="#3A3A3A" stroke-width="0.8"/>\n'
    s += f'<line x1="90" y1="4.6" x2="77" y2="1" stroke="#3A3A3A" stroke-width="0.8"/>\n'
    s += f'<line x1="67" y1="2.6" x2="87" y2="2.6" stroke="#3A3A3A" stroke-width="0.6"/>\n'
    s += f'<line x1="70" y1="0.8" x2="84" y2="0.8" stroke="#3A3A3A" stroke-width="1"/>\n'
    # 屋根（二重屋根）
    s += f'<path d="M2,14 L6,10 L116,10 L116,14 Z" fill="{ROOF}"/>\n'
    s += f'<rect x="30" y="5" width="66" height="5" fill="{ROOF_LT}"/>\n'
    for i in range(10):
        x = 33 + 6 * i
        s += f'<rect x="{x}" y="6.5" width="3" height="2" fill="{VENT}"/>\n'
    s += f'<circle cx="9" cy="12" r="1.5" fill="#3A3A3A"/>\n'
    s += f'<circle cx="14" cy="12" r="1.2" fill="#3A3A3A"/>\n'
    # 前面
    s += f'<rect x="4" y="15" width="5" height="14" fill="{WOOD_DK}"/>\n'
    s += f'<rect x="4.8" y="15.8" width="3.4" height="12.4" fill="#3E4149"/>\n'
    s += f'<rect x="11" y="15" width="13" height="14" fill="{WOOD_DK}"/>\n'
    s += f'<rect x="11.8" y="15.8" width="11.4" height="12.4" fill="#3E4149"/>\n'
    s += f'<rect x="26" y="15" width="5" height="14" fill="{WOOD_DK}"/>\n'
    s += f'<rect x="26.8" y="15.8" width="3.4" height="12.4" fill="#3E4149"/>\n'
    # 運転士
    s += f'<circle cx="17.5" cy="19.5" r="2.6" fill="#E8C4A0"/>\n'
    s += f'<path d="M14.9,19 a2.6,2.6 0 0 1 5.2,0 l-0.4,-1.6 a2.4,2.4 0 0 0 -4.4,0 z" fill="#4A3524"/>\n'
    s += f'<path d="M13.8,28.2 q0.4,-5.4 3.7,-5.4 q3.3,0 3.7,5.4 z" fill="#F5F2EC"/>\n'
    # 前面オレンジ部
    s += f'<rect x="2" y="29" width="32" height="15" fill="{ORANGE}"/>\n'
    s += f'<rect x="4" y="31" width="28" height="11" fill="none" stroke="{PIN}" stroke-width="0.5"/>\n'
    s += f'<text x="7" y="37.6" font-size="5" fill="{PIN}" font-weight="bold">3</text>\n'
    s += f'<circle cx="19" cy="36.5" r="3.6" fill="#2E2A22" stroke="{BRASS}" stroke-width="1.1"/>\n'
    s += f'<circle cx="19" cy="36.5" r="1.3" fill="#C9B36A"/>\n'
    # 側面の窓列＋乗客
    heads = {1: True, 3: True, 4: True}
    for i in range(6):
        x = 38 + 13 * i
        s += f'<rect x="{x}" y="15" width="10" height="15" fill="{WOOD_DK}"/>\n'
        s += f'<rect x="{x+0.8}" y="15.8" width="8.4" height="13.4" fill="{GLASS}"/>\n'
        s += (f'<polygon points="{x+1},29 {x+4},15.8 {x+6},15.8 {x+3},29" '
              f'fill="#FFFFFF" opacity="0.25"/>\n')
        if heads.get(i):
            s += f'<circle cx="{x+4.5}" cy="24.5" r="2" fill="#E8C4A0"/>\n'
            s += f'<path d="M{x+1.5},29 q3,-3.5 6,0 z" fill="#5A4A3A"/>\n'
    # 幕板・腰板
    s += f'<rect x="34" y="11.5" width="82" height="3.5" fill="{WOOD_DK}"/>\n'
    for i in range(14):
        x = 36 + 5.8 * i
        s += f'<line x1="{x}" y1="30" x2="{x}" y2="36" stroke="#8A5527" stroke-width="0.3"/>\n'
    # 側面オレンジ帯＋社名
    s += f'<rect x="34" y="36" width="82" height="8" fill="{ORANGE}"/>\n'
    s += f'<rect x="35.5" y="37" width="79" height="6" fill="none" stroke="{PIN}" stroke-width="0.4"/>\n'
    s += f'<text x="55" y="41.3" font-size="2.6" fill="{PIN}">F. C. DE SOLLER S. A.</text>\n'
    # カウキャッチャー・連結器
    s += f'<rect x="2" y="44" width="14" height="2" fill="#55493C"/>\n'
    s += f'<line x1="3" y1="45.5" x2="13" y2="51" stroke="#8A8378" stroke-width="0.8"/>\n'
    s += f'<line x1="3" y1="48" x2="10" y2="51.5" stroke="#8A8378" stroke-width="0.8"/>\n'
    s += f'<rect x="116" y="40" width="4" height="4" fill="{UNDER}"/>\n'
    # 客車（オープン構造）
    s += f'<rect x="121" y="14" width="26" height="18" fill="#3B2D24"/>\n'
    for x in (124, 130, 136, 142):
        s += f'<rect x="{x}" y="14" width="1.6" height="18" fill="#E8E0CE"/>\n'
    s += f'<path d="M120,12 L124,8 L144,8 L148,12 Z" fill="#D9D2C2"/>\n'
    s += f'<rect x="120" y="12" width="28" height="2" fill="#C7BFAE"/>\n'
    s += f'<rect x="120" y="32" width="28" height="4" fill="{WOOD}"/>\n'
    s += f'<rect x="120" y="36" width="28" height="8" fill="{ORANGE}"/>\n'
    s += f'<rect x="121.5" y="37" width="25" height="6" fill="none" stroke="{PIN}" stroke-width="0.4"/>\n'
    # 車輪
    for cx in (54, 98, 136):
        s += f'<circle cx="{cx}" cy="48" r="4" fill="#26211B" stroke="#4A423A" stroke-width="0.8"/>\n'
        s += f'<circle cx="{cx}" cy="48" r="1.2" fill="#6B6258"/>\n'
    s += '</g>\n'
    return s

# ============================================================
# 木と石造りの家＋市場テント 70 x 70
# ============================================================
def treehouse_group():
    s = '<g id="treehouse">\n'
    s += (f'<path d="M2,70 L2,34 L0,34 L10,26 L30,26 L37,33 '
          f'Q40,20 47,17 Q52,8 60,13 Q68,14 67,24 Q70,32 66,40 Q69,48 61,50 '
          f'Q56,54 50,51 L52,70 Z" '
          f'fill="{G2}" stroke="{CUT}" stroke-width="0.5" stroke-linejoin="round"/>\n')
    # 家
    s += f'<rect x="2" y="34" width="36" height="36" fill="{HOUSE}"/>\n'
    s += f'<polygon points="0,34 10,26 30,26 38,34" fill="{ROOFH}"/>\n'
    for i in range(5):
        x = 4 + 7 * i
        s += f'<line x1="{x}" y1="33" x2="{x+5}" y2="27.5" stroke="#5C3D28" stroke-width="0.4"/>\n'
    s += f'<rect x="8" y="40" width="7" height="9" fill="#58513F" stroke="#4A4436" stroke-width="0.5"/>\n'
    s += f'<rect x="24" y="40" width="7" height="9" fill="#58513F" stroke="#4A4436" stroke-width="0.5"/>\n'
    s += f'<line x1="11.5" y1="40" x2="11.5" y2="49" stroke="#7A705E" stroke-width="0.4"/>\n'
    s += f'<line x1="27.5" y1="40" x2="27.5" y2="49" stroke="#7A705E" stroke-width="0.4"/>\n'
    # 幹
    s += f'<polygon points="46,50 50,50 52,70 44,70" fill="{TRUNK}"/>\n'
    s += f'<line x1="48" y1="54" x2="56" y2="47" stroke="{TRUNK}" stroke-width="1.4"/>\n'
    # 葉の陰影
    for cx, cy, r in ((44, 24, 9), (58, 18, 8), (63, 32, 8), (52, 42, 9), (58, 46, 6)):
        s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{G1}" opacity="0.85"/>\n'
    for cx, cy, r in ((48, 15, 6), (64, 22, 5), (44, 34, 6), (55, 30, 5)):
        s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{G3}" opacity="0.9"/>\n'
    # 市場のテント（白い屋根）
    s += f'<polygon points="2,59 15,55.5 16,60 3,63.5" fill="#F2F0EA" stroke="#C9C4B8" stroke-width="0.4"/>\n'
    s += f'<polygon points="18,56 31,54 32,58.5 19,60.5" fill="#F2F0EA" stroke="#C9C4B8" stroke-width="0.4"/>\n'
    for x1, y1 in ((4, 63), (14, 60), (20, 60), (30, 58.5)):
        s += f'<line x1="{x1}" y1="{y1}" x2="{x1}" y2="70" stroke="#8A8378" stroke-width="0.5"/>\n'
    s += '</g>\n'
    return s

# ============================================================
# 街灯 14 x 58
# ============================================================
def lamp_group():
    s = '<g id="lamp">\n'
    s += (f'<path d="M3,58 L3,54 L4.6,54 L4.6,52 L5.8,52 L5.8,15.5 L3,15.5 L3,14 L4,14 '
          f'L5,7.5 L3.5,7.5 L5.9,4.6 A1.35,1.35 0 1 1 8.1,4.6 L10.5,7.5 L9,7.5 L10,14 '
          f'L11,14 L11,15.5 L8.2,15.5 L8.2,52 L9.4,52 L9.4,54 L11,54 L11,58 Z" '
          f'fill="{LAMPC}" stroke="{CUT}" stroke-width="0.4" stroke-linejoin="round"/>\n')
    s += f'<polygon points="4.9,13.6 9.1,13.6 8.5,8.2 5.5,8.2" fill="{LGLASS}"/>\n'
    s += f'<line x1="7" y1="8.2" x2="7" y2="13.6" stroke="#C9B36A" stroke-width="0.4"/>\n'
    s += f'<line x1="5.8" y1="20" x2="8.2" y2="20" stroke="#4A4A4A" stroke-width="0.6"/>\n'
    s += f'<line x1="5.8" y1="24" x2="8.2" y2="24" stroke="#4A4A4A" stroke-width="0.6"/>\n'
    s += '</g>\n'
    return s

# ============================================================
# 空の背景（scallop=True で上端が雲形の切り抜き）
# ============================================================
def sky_group(w, h, grad_id, scallop=True):
    k = w / 150.0
    s = f'<defs><linearGradient id="{grad_id}" x1="0" y1="0" x2="0" y2="1">'
    s += f'<stop offset="0" stop-color="{SKY_TOP}"/><stop offset="1" stop-color="{SKY_BOT}"/>'
    s += '</linearGradient></defs>\n'
    if scallop:
        s += (f'<path d="M0,{h} L0,22 Q{8*k},10 {20*k},14 Q{30*k},4 {44*k},10 '
              f'Q{56*k},2 {70*k},8 Q{84*k},2 {98*k},9 Q{112*k},4 {124*k},10 '
              f'Q{136*k},6 {w},16 L{w},{h} Z" '
              f'fill="url(#{grad_id})" stroke="{CUT}" stroke-width="0.5"/>\n')
    else:
        s += f'<rect x="0" y="0" width="{w}" height="{h}" fill="url(#{grad_id})"/>\n'
    # 架線（印刷表現）
    s += f'<line x1="0" y1="{h*0.28:.0f}" x2="{w}" y2="{h*0.46:.0f}" stroke="#35322D" stroke-width="0.4" opacity="0.75"/>\n'
    s += f'<line x1="0" y1="{h*0.35:.0f}" x2="{w}" y2="{h*0.5:.0f}" stroke="#35322D" stroke-width="0.4" opacity="0.75"/>\n'
    # 太陽のグレア（写真右上）
    s += f'<circle cx="{w*0.88:.0f}" cy="{h*0.13:.0f}" r="{16*k:.0f}" fill="#FFF3D6" opacity="0.25"/>\n'
    s += f'<circle cx="{w*0.88:.0f}" cy="{h*0.13:.0f}" r="{9*k:.0f}" fill="#FFF3D6" opacity="0.8"/>\n'
    # 雲（写真左中段）
    for cx, cy, rx, ry, op in ((28, 62, 14, 5, 0.95), (42, 67, 16, 5.5, 0.95),
                               (18, 68, 10, 4, 0.9), (105, 42, 10, 3.5, 0.6)):
        s += f'<ellipse cx="{cx*k:.0f}" cy="{cy*h/110:.0f}" rx="{rx*k:.0f}" ry="{ry}" fill="#FFFFFF" opacity="{op}"/>\n'
    return s

# ============================================================
# 石畳の地面（ジオラマ台座 150x80 / ポップアップ床 任意サイズ）
# ============================================================
def plaza_group(w, h, rail_to=(72, 46)):
    s = f'<rect x="0" y="0" width="{w}" height="{h}" fill="{TILE}"/>\n'
    rows = [0.22, 0.45, 0.68, 0.85]
    for r in rows:
        s += f'<line x1="0" y1="{h*r:.1f}" x2="{w}" y2="{h*r:.1f}" stroke="{TILE_LN}" stroke-width="0.5"/>\n'
    prev = 0
    for j, r in enumerate(rows + [1.0]):
        y0 = h * prev; y1 = h * r
        step = 30 - 4 * j
        off = (j % 2) * step / 2
        x = off
        while x < w:
            s += f'<line x1="{x:.1f}" y1="{y0:.1f}" x2="{x:.1f}" y2="{y1:.1f}" stroke="{TILE_LN}" stroke-width="0.4"/>\n'
            x += step
        prev = r
    for cx, cy, rx in ((0.2*w, 0.3*h, 9), (0.55*w, 0.75*h, 11), (0.8*w, 0.2*h, 7)):
        s += f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx}" ry="{rx*0.4:.1f}" fill="#CFBD97" opacity="0.5"/>\n'
    # レール（写真の手前から奥へカーブ）
    tx, ty = rail_to
    for base, gauge in ((0, 0), (8, 0)):
        for sub in (0, 1.8):
            x0 = w * 0.14 + base + sub
            s += (f'<path d="M{x0:.1f},{h} C{x0+16:.1f},{h*0.72:.1f} {tx-14+base+sub:.1f},{ty+14:.1f} '
                  f'{tx+base+sub:.1f},{ty:.1f}" fill="none" stroke="{RAIL}" stroke-width="1.1"/>\n')
    # マンホール（写真右下）
    s += f'<circle cx="{w*0.85:.0f}" cy="{h*0.82:.0f}" r="5" fill="#A8946F" stroke="#7A6A4E" stroke-width="0.8"/>\n'
    s += f'<circle cx="{w*0.85:.0f}" cy="{h*0.82:.0f}" r="3" fill="none" stroke="#7A6A4E" stroke-width="0.5"/>\n'
    return s

# ============================================================
# 差し込み足タブ（ジオラマ用）
# ============================================================
def feet(positions, ground_y, tab_h=8):
    s = ""
    for x0, x1 in positions:
        s += (f'<rect x="{x0}" y="{ground_y}" width="{x1-x0}" height="{tab_h}" '
              f'fill="#F4EFE4" stroke="{CUT}" stroke-width="0.5"/>\n')
        s += (f'<line x1="{x0}" y1="{ground_y}" x2="{x1}" y2="{ground_y}" '
              f'stroke="{FOLD_V}" stroke-width="0.5" stroke-dasharray="2.5,1.5"/>\n')
    return s

def slot(x0, x1, y, label=""):
    s = f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{SLOT}" stroke-width="0.9"/>\n'
    if label:
        s += f'<text x="{x0}" y="{y-1.5}" font-size="2.6" fill="{SLOT}">{label}</text>\n'
    return s

# ============================================================
# 完成イメージ（正面ビュー合成）
# ============================================================
def build_preview():
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 150 120" font-family="Hiragino Sans, sans-serif">\n'
    s += '<g>' + sky_group(150, 110, "gsky_prev") + '</g>\n'
    s += f'<g transform="translate(5,11)">{church_group()}</g>\n'
    s += f'<g transform="translate(0,36)">{treehouse_group()}</g>\n'
    s += f'<g transform="translate(18,66) scale(0.72)">{tram_group()}</g>\n'
    s += f'<g transform="translate(133,48)">{lamp_group()}</g>\n'
    s += f'<g transform="translate(0,106)"><rect x="0" y="0" width="150" height="14" fill="{TILE}"/>'
    s += f'<line x1="0" y1="0" x2="150" y2="0" stroke="{TILE_LN}" stroke-width="0.5"/>'
    for x in (10, 40, 70, 100, 130):
        s += f'<line x1="{x}" y1="0" x2="{x}" y2="14" stroke="{TILE_LN}" stroke-width="0.4"/>'
    for x0 in (24, 32):
        s += f'<line x1="{x0}" y1="14" x2="{x0+6}" y2="0" stroke="{RAIL}" stroke-width="1.2"/>'
    s += '</g>\n</svg>\n'
    return s

# ============================================================
# ジオラマ シート1〜4
# ============================================================
def build_diorama_sheets():
    sheets = {}
    # --- シート1: 背景（空）＋台座 ---
    c = caption(30, 14, "シート1｜背景（空）と台座 — 黒実線:カット / 青破線:折り / 赤実線:差し込みスリット", 3.4)
    c += f'<g transform="translate(30,20)">{sky_group(150, 110, "gsky_s1")}'
    c += (f'<rect x="0" y="110" width="150" height="8" fill="#F4EFE4" stroke="{CUT}" stroke-width="0.5"/>'
          f'<line x1="0" y1="110" x2="150" y2="110" stroke="{FOLD_V}" stroke-width="0.5" stroke-dasharray="2.5,1.5"/>'
          f'<text x="55" y="115.5" font-size="3" fill="#999">のりしろ（台座裏の奥端に貼る）</text></g>\n')
    c += caption(30, 156, "台座（石畳）— 赤スリットに各レイヤーの足を差し込む", 3.2)
    c += f'<g transform="translate(30,160)">{plaza_group(150, 80, rail_to=(76, 46))}'
    c += slot(37, 57, 14, "A 教会") + slot(101, 121, 14)
    c += slot(9, 22.5, 26, "B 木と家")
    c += slot(41, 55.4, 46, "C トラム") + slot(90, 104.4, 46)
    c += slot(130, 138, 60, "D 街灯")
    c += f'<rect x="0" y="0" width="150" height="80" fill="none" stroke="{CUT}" stroke-width="0.5"/></g>\n'
    sheets["diorama-sheet1-sky-base.svg"] = svg_a4(c)
    # --- シート2: 教会 ---
    c = caption(35, 20, "シート2｜サン・バルトメウ教会（レイヤーA・いちばん奥）", 3.4)
    c += f'<g transform="translate(35,30)">{church_group()}{feet([(32,52),(96,116)], 95)}</g>\n'
    c += caption(35, 145, "足タブを谷折りし、台座の赤スリットAに差し込む", 3)
    sheets["diorama-sheet2-church.svg"] = svg_a4(c)
    # --- シート3: 木と家・街灯 ---
    c = caption(30, 20, "シート3｜木と家（レイヤーB）・街灯（レイヤーD）", 3.4)
    c += f'<g transform="translate(30,30) scale(0.9)">{treehouse_group()}{feet([(10,25)], 70)}</g>\n'
    c += f'<g transform="translate(140,30)">{lamp_group()}{feet([(3,11)], 58)}</g>\n'
    c += caption(30, 122, "木と家 → スリットB ／ 街灯 → スリットD", 3)
    sheets["diorama-sheet3-tree-lamp.svg"] = svg_a4(c)
    # --- シート4: トラム ---
    c = caption(30, 30, "シート4｜ソリェルのトラム3号車＋客車（レイヤーC・主役）", 3.4)
    c += f'<g transform="translate(30,40) scale(0.72)">{tram_group()}{feet([(32,52),(100,120)], 55)}</g>\n'
    c += caption(30, 116, "足タブを谷折りし、台座の赤スリットCに差し込む", 3)
    sheets["diorama-sheet4-tram.svg"] = svg_a4(c)
    return sheets

# ============================================================
# ポップアップ シート1（ベースカード）＋ シート2（貼り込みパーツ）
# ============================================================
def build_popup_sheets():
    sheets = {}
    # --- ベースカード（A4横・中央横折り） ---
    c = caption(20, 12, "ポップアップ シート1｜ベースカード — 黒実線:カット / 青破線:谷折り / 赤一点鎖線:山折り", 3.2)
    c += f'<g transform="translate(20,20)">{sky_group(257, 85, "gsky_pop", scallop=False)}</g>\n'
    c += f'<g transform="translate(20,105)">{plaza_group(257, 85, rail_to=(135, 42))}</g>\n'
    c += f'<rect x="20" y="20" width="257" height="170" fill="none" stroke="{CUT}" stroke-width="0.7"/>\n'
    V = f'stroke="{FOLD_V}" stroke-width="0.6" stroke-dasharray="3,1.8"'
    M = f'stroke="{FOLD_M}" stroke-width="0.6" stroke-dasharray="5,1.5,1,1.5"'
    K = f'stroke="{CUT}" stroke-width="0.7"'
    # 中央折り（ステップ部分を除く）
    for x0, x1 in ((20, 25), (85, 95), (215, 225), (270, 277)):
        c += f'<line x1="{x0}" y1="105" x2="{x1}" y2="105" {V}/>\n'
    # ステップA: 教会（幅120 奥行き30）
    c += f'<line x1="95" y1="75" x2="95" y2="135" {K}/>\n'
    c += f'<line x1="215" y1="75" x2="215" y2="135" {K}/>\n'
    c += f'<line x1="95" y1="75" x2="215" y2="75" {V}/>\n'
    c += f'<line x1="95" y1="105" x2="215" y2="105" {M}/>\n'
    for x0, x1 in ((95, 100), (210, 215)):
        c += f'<line x1="{x0}" y1="135" x2="{x1}" y2="135" {V}/>\n'
    # ステップB（ネスト）: トラム（幅110 さらに12前へ）
    c += f'<line x1="100" y1="123" x2="100" y2="147" {K}/>\n'
    c += f'<line x1="210" y1="123" x2="210" y2="147" {K}/>\n'
    c += f'<line x1="100" y1="123" x2="210" y2="123" {V}/>\n'
    c += f'<line x1="100" y1="135" x2="210" y2="135" {M}/>\n'
    c += f'<line x1="100" y1="147" x2="210" y2="147" {V}/>\n'
    # ステップC: 木（左）
    c += f'<line x1="25" y1="87" x2="25" y2="123" {K}/>\n'
    c += f'<line x1="85" y1="87" x2="85" y2="123" {K}/>\n'
    c += f'<line x1="25" y1="87" x2="85" y2="87" {V}/>\n'
    c += f'<line x1="25" y1="105" x2="85" y2="105" {M}/>\n'
    c += f'<line x1="25" y1="123" x2="85" y2="123" {V}/>\n'
    # ステップD: 街灯（右）
    c += f'<line x1="225" y1="92" x2="225" y2="118" {K}/>\n'
    c += f'<line x1="270" y1="92" x2="270" y2="118" {K}/>\n'
    c += f'<line x1="225" y1="92" x2="270" y2="92" {V}/>\n'
    c += f'<line x1="225" y1="105" x2="270" y2="105" {M}/>\n'
    c += f'<line x1="225" y1="118" x2="270" y2="118" {V}/>\n'
    # 貼り位置ガイド
    def glue(x, y, w, h, label):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#FFFFFF" opacity="0.55"/>'
                f'<text x="{x+2}" y="{y+h/2+1.2}" font-size="3.4" fill="#B05A00">{label}</text>\n')
    c += glue(105, 107, 100, 26, "A 教会パーツをここに貼る（下端を下の赤線に合わせる）")
    c += glue(104, 136, 102, 10, "B トラム")
    c += glue(30, 107, 50, 14, "C 木と家")
    c += glue(228, 106.5, 39, 10, "D 街灯")
    sheets["popup-sheet1-base-card.svg"] = svg_a4(c, landscape=True)
    # --- パーツシート ---
    c = caption(30, 14, "ポップアップ シート2｜貼り込みパーツ — 外周をカットし、破線から下の“裏面”にのり付け", 3.2)
    gl = f'stroke="{FOLD_V}" stroke-width="0.5" stroke-dasharray="2.5,1.5"'
    # 教会 0.86倍 → 120x82
    c += f'<g transform="translate(35,22)"><g transform="scale(0.857)">{church_group()}</g>'
    c += f'<line x1="0" y1="69.4" x2="120" y2="69.4" {gl}/>'
    c += f'<text x="44" y="76" font-size="3" fill="#B05A00">A 教会（のりしろ12mm）</text></g>\n'
    # トラム 0.72倍 → 108x40
    c += f'<g transform="translate(30,124)"><g transform="scale(0.72)">{tram_group()}</g>'
    c += f'<line x1="0" y1="27.6" x2="108" y2="27.6" {gl}/>'
    c += f'<text x="34" y="47" font-size="3" fill="#B05A00">B トラム（のりしろ12mm）</text></g>\n'
    # 木 0.79倍 → 55x55
    c += f'<g transform="translate(35,196)"><g transform="scale(0.786)">{treehouse_group()}</g>'
    c += f'<line x1="0" y1="43" x2="55" y2="43" {gl}/>'
    c += f'<text x="2" y="61" font-size="3" fill="#B05A00">C 木と家（のりしろ12mm）</text></g>\n'
    # 街灯 0.86倍 → 12x50
    c += f'<g transform="translate(140,196)"><g transform="scale(0.857)">{lamp_group()}</g>'
    c += f'<line x1="0" y1="38" x2="12" y2="38" {gl}/>'
    c += f'<text x="-4" y="61" font-size="3" fill="#B05A00">D 街灯（のりしろ12mm）</text></g>\n'
    sheets["popup-sheet2-parts.svg"] = svg_a4(c)
    return sheets

# ============================================================
def main():
    files = {"preview-scene.svg": build_preview()}
    files.update(build_diorama_sheets())
    files.update(build_popup_sheets())
    for name, content in files.items():
        with open(os.path.join(OUT, name), "w") as f:
            f.write(content)
        print("wrote", name)
    # 整形チェック
    from xml.dom import minidom
    for name in files:
        minidom.parse(os.path.join(OUT, name))
    print("all SVGs parsed OK")

if __name__ == "__main__":
    main()
