const pptxgen = require("pptxgenjs");

// ---- Palette ----
const INK = "2A1416";    // deep maroon-black (dark slides, headings)
const CHERRY = "B11226"; // daruma red (corporate theme)
const CREAM = "FBF6F1";  // background
const NAVY = "24305E";   // interview theme (FILL ONLY — never text)
const GOLD = "D89B2B";   // brand eye accent
const GRAY = "4A4A4A";   // body text
const MUTE = "8A7E78";   // captions
const BLACK = "000000";  // navy text replaced by black

const FONT = "Mintyo UI";

const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.16 });

function header(pres, slide, kicker, title) {
  slide.background = { color: CREAM };
  slide.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.55, w: 0.26, h: 0.26, fill: { color: CHERRY } });
  slide.addText(kicker, { x: 0.95, y: 0.5, w: 10, h: 0.35, fontFace: FONT, fontSize: 13, color: CHERRY, bold: true, charSpacing: 2, margin: 0, valign: "middle" });
  slide.addText(title, { x: 0.6, y: 0.82, w: 12.1, h: 0.7, fontFace: FONT, fontSize: 30, color: INK, bold: true, margin: 0 });
}

function panel(pres, slide, x, y, w, h, label, color, lines) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, shadow: shadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.6, fill: { color } });
  slide.addText(label, { x: x + 0.3, y, w: w - 0.6, h: 0.6, fontFace: FONT, fontSize: 16, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
  slide.addText(lines.map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: 10, fontFace: FONT, fontSize: 14, color: GRAY } })),
    { x: x + 0.35, y: y + 0.8, w: w - 0.7, h: h - 1.0, valign: "top", margin: 0 });
}

function buildDeck(cfg) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.author = "SNS Planner";
  pres.title = cfg.deckTitle;
  const THEME = cfg.theme;
  const LABEL = (THEME === NAVY) ? BLACK : THEME; // colored small labels (navy -> black)

  // 1) TITLE
  let s = pres.addSlide();
  s.background = { color: INK };
  s.addShape(pres.shapes.OVAL, { x: 9.4, y: 1.5, w: 4.4, h: 4.4, fill: { color: CHERRY } });
  s.addShape(pres.shapes.OVAL, { x: 10.7, y: 2.85, w: 0.6, h: 0.6, fill: { color: INK } });
  s.addShape(pres.shapes.OVAL, { x: 11.85, y: 2.85, w: 0.6, h: 0.6, fill: { color: GOLD } });
  s.addText("SNS PLANNING", { x: 0.9, y: 1.7, w: 8, h: 0.4, fontFace: FONT, fontSize: 14, color: GOLD, bold: true, charSpacing: 3, margin: 0 });
  s.addText("会社だるま × IVS", { x: 0.9, y: 2.2, w: 9, h: 0.8, fontFace: FONT, fontSize: 40, color: "FFFFFF", bold: true, margin: 0 });
  s.addText(cfg.bigTitle, { x: 0.9, y: 3.0, w: 9, h: 1.4, fontFace: FONT, fontSize: 50, color: "FFFFFF", bold: true, margin: 0 });
  s.addText("企画書", { x: 0.92, y: 4.55, w: 9, h: 0.5, fontFace: FONT, fontSize: 18, color: "E8D9D0", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.95, y: 5.25, w: 2.2, h: 0, line: { color: GOLD, width: 2 } });
  s.addText("目入れ＝決意表明の儀式を、IVSの熱量とともに記録する", { x: 0.92, y: 5.45, w: 8.2, h: 0.5, fontFace: FONT, fontSize: 14, color: "B9A79E", italic: true, margin: 0 });
  s.addText("ステータス：代表確認待ち（v1.0）", { x: 0.92, y: 6.6, w: 8, h: 0.4, fontFace: FONT, fontSize: 12, color: MUTE, margin: 0 });

  // 2) PURPOSE
  s = pres.addSlide();
  header(pres, s, cfg.kicker + "｜PURPOSE", cfg.label + "｜目的");
  cfg.purpose.forEach((p, i) => {
    const x = 0.6 + i * 4.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 3.8, h: 4.2, fill: { color: "FFFFFF" }, shadow: shadow() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.4, w: 1.0, h: 1.0, fill: { color: THEME } });
    s.addText(String(i + 1), { x: x + 0.35, y: 2.4, w: 1.0, h: 1.0, fontFace: FONT, fontSize: 34, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(p[0], { x: x + 0.35, y: 3.6, w: 3.1, h: 0.7, fontFace: FONT, fontSize: 18, color: INK, bold: true, margin: 0 });
    s.addText(p[1], { x: x + 0.35, y: 4.35, w: 3.1, h: 1.7, fontFace: FONT, fontSize: 14, color: GRAY, margin: 0 });
  });
  if (cfg.purposeNote) s.addText(cfg.purposeNote, { x: 0.6, y: 6.55, w: 12.1, h: 0.45, fontFace: FONT, fontSize: 13, color: MUTE, italic: true, margin: 0 });

  // 3) BASIC DESIGN
  s = pres.addSlide();
  header(pres, s, "BASIC SETUP", "基本設計");
  cfg.basic.forEach((it, i) => {
    const y = 1.7 + i * 1.04;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 12.1, h: 0.9, fill: { color: "FFFFFF" }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.1, h: 0.9, fill: { color: GOLD } });
    s.addText(it[0], { x: 0.95, y, w: 2.3, h: 0.9, fontFace: FONT, fontSize: 16, color: LABEL, bold: true, margin: 0, valign: "middle" });
    s.addText(it[1], { x: 3.35, y, w: 9.2, h: 0.9, fontFace: FONT, fontSize: 15, color: GRAY, margin: 0, valign: "middle" });
  });

  // 4) STYLE +α
  s = pres.addSlide();
  header(pres, s, "SHOOTING & EDIT", "撮影・編集の型｜+α 改善ポイント");
  s.addText("短尺で「最後まで見られる・保存される」を底上げする共通ルール。", { x: 0.6, y: 1.55, w: 12.1, h: 0.5, fontFace: FONT, fontSize: 14, color: GRAY, margin: 0 });
  const styleCards = [
    { mark: "音", color: GOLD, title: "音設計（ASMR）", body: "ペンの目入れ音などを意図的に録音。「音ON推奨」テロップで音声視聴を誘発し、満足度を上げる。" },
    { mark: "画", color: THEME, title: "構図・ループ", body: "重要な文字／顔は画面中央60%（縦型セーフゾーン）に配置。ラスト→冒頭でシームレスループ＝再生回数UP。" },
    { mark: "字", color: CHERRY, title: "テロップ2種", body: "質問テロップ＋ネームスーパー（名前・肩書き）を常設。無音視聴でも文脈が伝わり完視聴率が上がる。" },
  ];
  styleCards.forEach((c, i) => {
    const x = 0.6 + i * 4.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.8, h: 4.3, fill: { color: "FFFFFF" }, shadow: shadow() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.7, w: 1.0, h: 1.0, fill: { color: c.color } });
    s.addText(c.mark, { x: x + 0.35, y: 2.7, w: 1.0, h: 1.0, fontFace: FONT, fontSize: 28, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(c.title, { x: x + 0.35, y: 3.9, w: 3.1, h: 0.5, fontFace: FONT, fontSize: 18, color: INK, bold: true, margin: 0 });
    s.addText(c.body, { x: x + 0.35, y: 4.5, w: 3.1, h: 1.9, fontFace: FONT, fontSize: 14, color: GRAY, margin: 0 });
  });

  // 5) STRUCTURE
  if (cfg.structureType === "cut") {
    s = pres.addSlide();
    header(pres, s, cfg.kicker + "｜STRUCTURE", "構成カット表");
    const head = (t) => ({ text: t, options: { fill: { color: INK }, color: "FFFFFF", bold: true, fontFace: FONT, fontSize: 14, valign: "middle", align: "center" } });
    const body = cfg.cutRows.map((r, i) => {
      const bg = i % 2 ? "F4ECE5" : "FFFFFF";
      return [
        { text: r[0], options: { fill: { color: THEME }, color: "FFFFFF", bold: true, align: "center", valign: "middle", fontFace: FONT, fontSize: 15 } },
        { text: r[1], options: { fill: { color: bg }, color: INK, bold: true, valign: "middle", fontFace: FONT, fontSize: 13 } },
        { text: r[2], options: { fill: { color: bg }, color: BLACK, bold: true, align: "center", valign: "middle", fontFace: FONT, fontSize: 13 } },
        { text: r[3], options: { fill: { color: bg }, color: GRAY, valign: "middle", fontFace: FONT, fontSize: 12 } },
      ];
    });
    s.addTable([[head("#"), head("カット"), head("尺目安"), head("内容・狙い")], ...body], {
      x: 0.6, y: 1.7, w: 12.1, colW: [0.7, 2.7, 1.25, 7.45], rowH: [0.45, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72],
      border: { pt: 0.5, color: "E0D5CD" }, valign: "middle",
    });
  } else {
    s = pres.addSlide();
    header(pres, s, cfg.kicker + "｜STRUCTURE", "質問フロー");
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.6, w: 12.1, h: 0.7, fill: { color: THEME }, shadow: shadow() });
    s.addText([
      { text: "フック（先出し）　", options: { bold: true, color: "FFFFFF", fontSize: 15 } },
      { text: "一番エモい「叶えたいこと」を冒頭に先出し → そこから自己紹介へ繋ぐ（完視聴率UP）", options: { color: "FFFFFF", fontSize: 14 } },
    ], { x: 0.95, y: 1.6, w: 11.6, h: 0.7, fontFace: FONT, valign: "middle", margin: 0 });
    cfg.flow.forEach((f, i) => {
      const y = 2.55 + i * 0.86;
      s.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.03, w: 0.7, h: 0.7, fill: { color: THEME } });
      s.addText(String(i + 1), { x: 0.6, y: y + 0.03, w: 0.7, h: 0.7, fontFace: FONT, fontSize: 22, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
      if (i < cfg.flow.length - 1) s.addShape(pres.shapes.LINE, { x: 0.95, y: y + 0.73, w: 0, h: 0.13, line: { color: "C9BCB2", width: 2 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 1.6, y, w: 11.1, h: 0.76, fill: { color: "FFFFFF" }, shadow: shadow() });
      s.addText(f[0], { x: 1.9, y, w: 3.0, h: 0.76, fontFace: FONT, fontSize: 16, color: LABEL, bold: true, margin: 0, valign: "middle" });
      s.addText(f[1], { x: 4.9, y, w: 7.6, h: 0.76, fontFace: FONT, fontSize: 13.5, color: GRAY, margin: 0, valign: "middle" });
    });
  }

  // 6) REQUESTS (撮影時のお願い)
  s = pres.addSlide();
  header(pres, s, cfg.kicker + "｜REQUEST", "撮影時のお願い");
  panel(pres, s, 0.6, 1.75, 5.95, 4.9, "事前のご準備", THEME, cfg.req.before);
  panel(pres, s, 6.75, 1.75, 5.95, 4.9, "当日のお願い", THEME, cfg.req.onday);

  // 7) OPERATIONS + CHECKLIST
  s = pres.addSlide();
  header(pres, s, "ON-SITE", "当日オペレーション & 準備物");
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.75, w: 5.95, h: 4.9, fill: { color: "FFFFFF" }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.75, w: 5.95, h: 0.6, fill: { color: THEME } });
  s.addText("オペレーション", { x: 0.9, y: 1.75, w: 5.4, h: 0.6, fontFace: FONT, fontSize: 16, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
  s.addText(cfg.ops.map((t, i) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: 10, fontFace: FONT, fontSize: 14, color: GRAY } })),
    { x: 0.95, y: 2.55, w: 5.3, h: 3.9, valign: "top", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.75, y: 1.75, w: 5.95, h: 4.9, fill: { color: "FFFFFF" }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.75, y: 1.75, w: 5.95, h: 0.6, fill: { color: GOLD } });
  s.addText("準備物チェックリスト", { x: 7.05, y: 1.75, w: 5.4, h: 0.6, fontFace: FONT, fontSize: 16, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
  s.addText(cfg.checks.map((c) => ({ text: c, options: { bullet: { code: "2713", indent: 16 }, breakLine: true, paraSpaceAfter: 8, fontFace: FONT, fontSize: 13.5, color: GRAY } })),
    { x: 7.1, y: 2.55, w: 5.3, h: 3.9, valign: "top", margin: 0 });

  // 8) EDIT / DELIVERY
  s = pres.addSlide();
  header(pres, s, "EDIT & DELIVERY", "編集・納品");
  cfg.edit.forEach((it, i) => {
    const y = 1.75 + i * 1.0;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 12.1, h: 0.85, fill: { color: "FFFFFF" }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.1, h: 0.85, fill: { color: CHERRY } });
    s.addText(it[0], { x: 0.95, y, w: 2.3, h: 0.85, fontFace: FONT, fontSize: 15, color: LABEL, bold: true, margin: 0, valign: "middle" });
    s.addText(it[1], { x: 3.35, y, w: 9.2, h: 0.85, fontFace: FONT, fontSize: 14, color: GRAY, margin: 0, valign: "middle" });
  });

  // 9) DECISIONS
  s = pres.addSlide();
  s.background = { color: INK };
  s.addShape(pres.shapes.OVAL, { x: 0.7, y: 0.7, w: 0.26, h: 0.26, fill: { color: GOLD } });
  s.addText("FOR APPROVAL", { x: 1.05, y: 0.62, w: 8, h: 0.4, fontFace: FONT, fontSize: 13, color: GOLD, bold: true, charSpacing: 2, margin: 0, valign: "middle" });
  s.addText("代表に確認したいこと（決め事）", { x: 0.7, y: 1.0, w: 12, h: 0.7, fontFace: FONT, fontSize: 30, color: "FFFFFF", bold: true, margin: 0 });
  cfg.decisions.forEach((d, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 6.25, y = 2.0 + row * 1.55;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 5.9, h: 1.35, fill: { color: "3A2023" } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h: 1.35, fill: { color: GOLD } });
    s.addText(`${i + 1}. ${d[0]}`, { x: x + 0.3, y: y + 0.15, w: 5.4, h: 0.4, fontFace: FONT, fontSize: 16, color: GOLD, bold: true, margin: 0 });
    s.addText(d[1], { x: x + 0.3, y: y + 0.6, w: 5.4, h: 0.65, fontFace: FONT, fontSize: 13, color: "E8D9D0", margin: 0 });
  });
  s.addText("確認後 → 確定版を協力企業へ共有", { x: 0.7, y: 6.95, w: 12, h: 0.4, fontFace: FONT, fontSize: 13, color: MUTE, margin: 0 });

  return pres.writeFile({ fileName: cfg.fileName }).then((f) => console.log("Saved:", f));
}

// ============ DECK 1 — 企業納品動画 ============
const corporate = {
  fileName: "/Users/aoi/Desktop/Bluenote/3_Project/会社だるま_IVS/企業納品動画_企画書.pptx",
  deckTitle: "会社だるま × IVS 企業納品動画 企画書",
  bigTitle: "企業納品動画",
  kicker: "VIDEO ①",
  label: "企業納品動画",
  theme: CHERRY,
  purpose: [
    ["納品物としての価値", "購入企業に「特別な体験の記録」を残し、サービス満足度を高める"],
    ["企業による二次拡散", "企業自身がSNS投稿＝取引先・同業など“法人ネットワーク”へ届く"],
    ["新規法人への訴求", "「自社もやりたい」を生み、次の受注につなげる"],
  ],
  purposeNote: "※ 本企画は IVSイベント会場での納品動画。デスク設置など“オフィス納品編”は第2弾で別途設計。",
  basic: [
    ["配信先", "Instagram Reels / TikTok / YouTube Shorts｜縦型 9:16"],
    ["想定尺", "30〜60秒（フックは冒頭3秒で完結させる）"],
    ["機材", "スマホ＋ジンバル／手元用サブ1台／ピンマイク推奨"],
    ["演出の核", "目入れ＝願掛け・決意宣言。願いを描く瞬間をクライマックスに"],
    ["感情設計", "開封のワクワク → 目入れの集中 → 宣言の表情、で起伏をつくる"],
  ],
  structureType: "cut",
  cutRows: [
    ["1", "フック", "0–3秒", "「頑張りたいこと」＋会社名を本人が宣言（最初の一言で掴む）"],
    ["2", "開封", "3–8秒", "箱を開ける様子。手元アップ＋開封音をしっかり録る（音ON推奨）"],
    ["3", "取り出し（ヒキ）", "8–13秒", "箱から取り出して驚く様子。引きで全身＋表情、リアクション重視"],
    ["4", "目標を書く（クローズ）", "13–19秒", "だるまに願い・社名を書く手元アップ。会社だるま最大の差別化＝必ず魅せる"],
    ["5", "目入れPOV", "19–26秒", "ペンが目に迫る主観カット。ペンの音を録り緊張感を演出"],
    ["6", "目入れ（ヒキ）", "26–32秒", "目を入れる瞬間を引きで。表情と手元が両方入る画角"],
    ["7", "意気込み", "32–45秒", "決意表明で締め。カメラ目線、社名ロゴ／だるまで締める"],
  ],
  req: {
    before: [
      "冒頭で言う「目標（頑張りたいこと）」＋「会社名」を1文でご準備ください",
      "だるまに書く願い・社名の文言を事前に決めておいてください",
      "撮影に出る方（顔出し）を1〜数名お決めください",
    ],
    onday: [
      "開封〜目入れは“素のリアクション”が魅力。リハなし・一発本番でOK",
      "撮影時間：1社あたり 約◯分（要確定）",
      "顔出し・SNS掲載可否の同意をお願いします",
    ],
  },
  ops: [
    "役割分担：撮影／進行／同意・誘導 を分担",
    "撮影ブース：ロゴが映える背景、開封スペース、目入れ用の机",
    "だるまは事前に準備（社名・目標を「書く工程」の有無を確認）",
  ],
  checks: [
    "だるま（社名・目標 記入用）", "目入れ用ペン・筆・墨", "開封演出用の箱",
    "ジンバル・スマホ（メイン／サブ）", "ピンマイク・モバイルバッテリー", "背景ボード／ロゴ",
    "同意確認フォーム（掲載可否）",
  ],
  edit: [
    ["尺・縦横", "30〜60秒／縦型 9:16"],
    ["テロップ", "社名・目標・キーワードを最小限。だるま文化の一言を統一フォーマットで"],
    ["BGM", "高揚感のある共通BGMでシリーズ感（権利フリー音源）"],
    ["納品形式", "各社へ個別データを納品（縦型／必要に応じ横型も）"],
    ["資産化", "OP/EDのロゴ演出を共通化し、ブランド資産として蓄積"],
  ],
  decisions: [
    ["配信先", "Reels／TikTok／Shorts の優先順位は？"],
    ["撮影社数", "企業納品は何社を目標にするか"],
    ["撮影時間", "1社あたりの上限の目安（オペ設計に必要）"],
    ["同意・二次利用", "掲載可否の取り方と、納品データの二次利用ルール"],
    ["ブランド素材", "ロゴ・指定カラー・フォント・使用可能BGMの有無"],
    ["トーン", "「かっこいい/エモい」寄りか「親しみ/応援」寄りか"],
  ],
};

// ============ DECK 2 — 参加者インタビュー動画 ============
const interview = {
  fileName: "/Users/aoi/Desktop/Bluenote/3_Project/会社だるま_IVS/インタビュー動画_企画書.pptx",
  deckTitle: "会社だるま × IVS 参加者インタビュー動画 企画書",
  bigTitle: "参加者インタビュー動画",
  kicker: "VIDEO ②",
  label: "参加者インタビュー動画",
  theme: NAVY,
  purpose: [
    ["会場の熱量を発信", "参加者の生の声で、イベントとブランドの世界観を届ける"],
    ["共感でUGC化", "「叶えたいこと」という普遍テーマで一般視聴者の共感・保存・シェアを誘発"],
    ["新規フォロワー獲得", "公式アカウントの認知を一般層（＝将来の見込み客）へ拡大"],
  ],
  purposeNote: null,
  basic: [
    ["配信先", "Instagram Reels / TikTok / YouTube Shorts｜縦型 9:16"],
    ["想定尺", "30〜60秒（フックは冒頭3秒で完結させる）"],
    ["機材", "スマホ＋ジンバル／手元用サブ1台／ピンマイク推奨"],
    ["演出の核", "目入れ＝願掛け・決意宣言。願いを描く瞬間をクライマックスに"],
    ["感情設計", "自己紹介で親しみ → 「叶えたいこと」で共感 → 目入れの表情で締める"],
  ],
  structureType: "flow",
  flow: [
    ["自己紹介", "お名前・ステータス（学生／職業など）"],
    ["参加理由", "「IVSに参加した理由は？」"],
    ["マイブーム", "最近ハマっていること（例：ランニング、Setlog 等）"],
    ["叶えたいこと", "「あなたが叶えたいことを教えてください」（留学／起業／資格／一人旅）"],
    ["目入れ＆記念撮影", "願いを込めて目入れ → 記念写真"],
  ],
  req: {
    before: [
      "「叶えたいこと」を一言で考えておいてください（動画の主役になります）",
      "自己紹介（名前・ステータス）とマイブームを軽くご準備",
    ],
    onday: [
      "テンポよく短時間で撮影します（1人あたり 約◯分・要確定）",
      "顔出し・SNS掲載可否の同意をお願いします",
      "撮影後、記念写真データをプレゼントします",
    ],
  },
  ops: [
    "役割分担：撮影／聞き手（インタビュアー）／同意・誘導 を分担",
    "撮影ブース：ブランドが映える背景・ロゴ、目入れ用の机、記念写真スポット",
    "記念写真の受け渡し：その場AirDrop／QR／後日送付 のいずれか",
  ],
  checks: [
    "だるま（体験用）", "目入れ用ペン・筆・墨", "ジンバル・スマホ（メイン／サブ）",
    "ピンマイク・モバイルバッテリー", "背景ボード／ロゴ", "同意確認フォーム（掲載可否）",
    "記念写真の受け渡し手段（QR等）",
  ],
  edit: [
    ["尺・縦横", "30〜60秒／縦型 9:16"],
    ["テロップ", "質問・名前・肩書きを最小限。だるま文化の一言を統一フォーマットで"],
    ["BGM", "高揚感のある共通BGMでシリーズ感（権利フリー音源）"],
    ["納品形式", "会社だるま公式アカウントで投稿。複数人の“まとめ版”も展開可"],
    ["資産化", "OP/EDのロゴ演出を共通化し、ブランド資産として蓄積"],
  ],
  decisions: [
    ["配信先", "Reels／TikTok／Shorts の優先順位は？"],
    ["撮影人数", "インタビューは何人を目標にするか"],
    ["撮影時間", "1人あたりの上限の目安（オペ設計に必要）"],
    ["同意・肖像権", "掲載可否の取り方（口頭／書面）"],
    ["ブランド素材", "ロゴ・指定カラー・フォント・使用可能BGMの有無"],
    ["トーン", "「かっこいい/エモい」寄りか「親しみ/応援」寄りか"],
  ],
};

Promise.all([buildDeck(corporate), buildDeck(interview)]).then(() => console.log("Done."));
