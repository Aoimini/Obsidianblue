# people.json から人物ノート(md)とHTMLプロフィール帳を生成
import json, re, html, pathlib

DIR = pathlib.Path("/Users/aoi/Desktop/Bluenote/5_Docs/木曜会/プロフィール帳")
data = json.loads((DIR / "people.json").read_text())
events, people = data["events"], data["people"]

def safe(name):
    return re.sub(r'[/\\:*?"<>|｜🍏👍★🪄🐰🐢🏀♨️🫑]', "", name).strip()

for p in people:
    ev_lines = "\n".join(
        f"- {events[e]['date']} {events[e]['title']}（{events[e]['type']}）"
        for e in p["events"])
    sns = []
    if p["ig"]: sns.append(f"Instagram: https://instagram.com/{p['ig']}")
    if p["x"]: sns.append(f"X: https://x.com/{p['x']}")
    sns_block = "\n".join(f"  - {s}" for s in sns) if sns else "  -"
    (DIR / f"{safe(p['name'])}.md").write_text(f"""---
tags: [人物, AI木曜会]
---

# {p['name']}

## 基本情報
- メールアドレス: {p['email'] or ''}
- SNS:
{sns_block}
- 会社・所属: {p['role']}
- Fincsアカウント名: {p.get('fincs', '')}
- 自己紹介(Fincs): {p.get('bio', '')}

## 出会ったイベント
{ev_lines}

## メモ
-
""")

# HTML生成（平成初期プロフ帳風）
PASTELS = ["pink", "mint", "sora", "lemon", "lavender"]
cards = []
for i, p in enumerate(sorted(people, key=lambda x: (-len(x["events"]), x["name"]))):
    evs = "".join(
        f'<span class="tag">{events[e]["date"][5:].replace("-", "/")} {html.escape(events[e]["title"][:16])}</span>'
        for e in p["events"])
    links = []
    if p["ig"]: links.append(f'<a href="https://instagram.com/{p["ig"]}" target="_blank">📷 Instagram</a>')
    if p["x"]: links.append(f'<a href="https://x.com/{p["x"]}" target="_blank">🐦 X</a>')
    if p["email"]: links.append(f'<a href="mailto:{p["email"]}">💌 メール</a>')
    role = html.escape(p["role"]) if p["role"] else "ひみつ☆"
    color = PASTELS[i % len(PASTELS)]
    # photos/<ファイル名セーフな名前>.jpg があれば顔写真、なければイニシャル
    photo_file = f"photos/{safe(p['name'])}.jpg"
    if (DIR / photo_file).exists():
        avatar = f'<div class="avatar photo"><img src="{html.escape(photo_file)}" alt=""></div>'
    else:
        avatar = f'<div class="avatar">{html.escape(p["name"][0])}</div>'
    fincs = p.get("fincs", "")
    fincs_row = (f'<div class="row"><span class="label">Fincs名</span><span class="val">{html.escape(fincs)}</span></div>'
                 if fincs else "")
    bio = p.get("bio", "")
    bio_row = (f'<div class="row"><span class="label">じこしょうかい</span><span class="val">{html.escape(bio)}</span></div>'
               if bio else "")
    cards.append(f'''<div class="card {color}" data-name="{html.escape((p["name"] + " " + fincs).lower())}" data-events="{' '.join(p["events"])}">
<div class="washi"></div>
<div class="cardhead">{avatar}
<div><div class="namelabel">なまえ☆</div><div class="name">{html.escape(p["name"])}</div></div></div>
{fincs_row}
<div class="row"><span class="label">おしごと</span><span class="val">{role}</span></div>
{bio_row}
<div class="row"><span class="label">れんらく先</span><span class="val links">{' '.join(links) if links else 'また聞いてね♪'}</span></div>
<div class="row"><span class="label">出会った日</span><span class="val tags">{evs}</span></div>
</div>''')

filters = "".join(
    f'<button class="fbtn" data-f="{k}">{html.escape(v["title"][:14])}</button>'
    for k, v in events.items())

page = f"""<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>☆AI木曜会 プロフ帳☆</title>
<style>
* {{ box-sizing:border-box; margin:0; }}
body {{
  font-family:"Hiragino Maru Gothic ProN","Yu Gothic","Noto Sans JP",sans-serif;
  color:#7a4a5a; padding:28px 14px;
  background-color:#ffe9f2;
  background-image:
    radial-gradient(#ffd1e3 12%, transparent 13%),
    radial-gradient(#ffd1e3 12%, transparent 13%);
  background-size:42px 42px; background-position:0 0,21px 21px;
}}
.notebook {{ max-width:960px; margin:0 auto; background:#fffdf6;
  border:4px solid #ff9ec4; border-radius:22px; padding:26px 20px 34px;
  box-shadow:6px 6px 0 #ffb7d2; position:relative; }}
.notebook::before {{ content:"✁ ----------------------------------------------------------";
  position:absolute; top:-14px; left:24px; color:#ffa9c9; font-size:.8rem; letter-spacing:2px;
  background:transparent; }}
h1 {{ text-align:center; font-size:1.7rem; color:#ff5e9d;
  text-shadow:2px 2px 0 #fff, 3px 3px 0 #ffc6dd; letter-spacing:.12em; }}
h1 .star {{ color:#ffd233; text-shadow:1px 1px 0 #e8a700; }}
.sub {{ text-align:center; color:#c98aa4; font-size:.8rem; margin:6px 0 18px; }}
.sub::before, .sub::after {{ content:" ♪ "; color:#8fd6c9; }}
.controls {{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:14px; }}
#q {{ flex:1 1 100%; max-width:400px; margin:0 auto; padding:10px 16px;
  border:3px dashed #ffabcb; border-radius:24px; font-size:1rem;
  background:#fff; color:#7a4a5a; outline:none; }}
#q::placeholder {{ color:#e3a8c0; }}
.fbtn {{ border:2px solid #ffabcb; background:#fff; border-radius:16px;
  padding:6px 13px; font-size:.78rem; cursor:pointer; color:#d36e98;
  box-shadow:2px 2px 0 #ffd5e6; font-family:inherit; }}
.fbtn.on {{ background:#ff8fbb; color:#fff; border-color:#ff6fa6; box-shadow:2px 2px 0 #f0a4c2; }}
#count {{ text-align:center; color:#d99cb5; font-size:.85rem; margin-bottom:14px; }}
#count::before {{ content:"☆ "; }} #count::after {{ content:" ☆"; }}
.grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(285px,1fr)); gap:18px; }}
.card {{ border-radius:4px 18px 4px 18px; padding:18px 14px 14px; position:relative;
  border:2px solid rgba(0,0,0,.06);
  box-shadow:3px 3px 0 rgba(214,138,168,.35); transform:rotate(-.6deg); }}
.card:nth-child(even) {{ transform:rotate(.7deg); border-radius:18px 4px 18px 4px; }}
.card.pink {{ background:#ffeef5; border-color:#ffc2d9; }}
.card.mint {{ background:#eafaf3; border-color:#b3e6d2; }}
.card.sora {{ background:#eaf4fd; border-color:#b9dcf5; }}
.card.lemon {{ background:#fffbe2; border-color:#f3e6a2; }}
.card.lavender {{ background:#f4eefc; border-color:#d9c8f0; }}
.washi {{ position:absolute; top:-10px; left:50%; transform:translateX(-50%) rotate(-3deg);
  width:84px; height:20px; background:repeating-linear-gradient(45deg,#ffd9e8,#ffd9e8 6px,#fff0f6 6px,#fff0f6 12px);
  opacity:.85; border-radius:2px; }}
.cardhead {{ display:flex; gap:12px; align-items:center; margin-bottom:10px; }}
.avatar {{ width:52px; height:52px; border-radius:50%; flex-shrink:0;
  background:#fff; border:3px double #ffa9c9; color:#ff7cab;
  display:flex; align-items:center; justify-content:center; font-size:1.3rem; font-weight:700; overflow:hidden; }}
.avatar.photo img {{ width:100%; height:100%; object-fit:cover; border-radius:50%; }}
.namelabel {{ font-size:.62rem; color:#cf8da9; letter-spacing:.2em; }}
.name {{ font-weight:800; font-size:1.05rem; color:#b03d6d; }}
.row {{ display:flex; gap:8px; align-items:baseline; padding:5px 2px;
  border-bottom:2px dotted rgba(190,120,150,.4); font-size:.8rem; }}
.row:last-child {{ border-bottom:none; }}
.label {{ flex-shrink:0; width:64px; font-size:.66rem; color:#fff;
  background:#ffa3c6; border-radius:10px; text-align:center; padding:2px 0; }}
.val {{ color:#8a5a6c; }}
.links a {{ color:#e0699a; text-decoration:none; margin-right:8px; }}
.links a:hover {{ text-decoration:wavy underline; }}
.tags {{ display:flex; flex-wrap:wrap; gap:4px; }}
.tag {{ font-size:.62rem; background:#fff; border:1px solid #e8bccd;
  border-radius:10px; padding:1px 7px; color:#b5798f; }}
.hide {{ display:none; }}
.footer {{ text-align:center; margin-top:24px; color:#daa3ba; font-size:.78rem; }}
</style></head><body>
<div class="notebook">
<h1><span class="star">★</span> AI木曜会 プロフ帳 <span class="star">★</span></h1>
<div class="sub">ともだちコレクション 2026年版（パイロット版5イベント）</div>
<div class="controls"><input id="q" placeholder="なまえでさがす…♪">{filters}</div>
<div id="count"></div>
<div class="grid">{''.join(cards)}</div>
<div class="footer">- 書いてくれてありがとう♪ また遊ぼうね -</div>
</div>
<script>
const q=document.getElementById('q'),cards=[...document.querySelectorAll('.card')],
btns=[...document.querySelectorAll('.fbtn')],count=document.getElementById('count');
let f=null;
function apply(){{
  const t=q.value.toLowerCase();let n=0;
  cards.forEach(c=>{{
    const ok=(!t||c.dataset.name.includes(t))&&(!f||c.dataset.events.split(' ').includes(f));
    c.classList.toggle('hide',!ok);if(ok)n++;
  }});
  count.textContent=n+'人';
}}
q.addEventListener('input',apply);
btns.forEach(b=>b.addEventListener('click',()=>{{
  if(f===b.dataset.f){{f=null;b.classList.remove('on');}}
  else{{f=b.dataset.f;btns.forEach(x=>x.classList.remove('on'));b.classList.add('on');}}
  apply();
}}));
apply();
</script></body></html>"""
(DIR / "プロフィール帳.html").write_text(page)
print(f"md: {len(people)}件 / HTML生成完了")
