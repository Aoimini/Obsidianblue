const pptxgen = require("pptxgenjs");

const INK = "2A1416", CHERRY = "B11226", CREAM = "FBF6F1", GOLD = "D89B2B", GRAY = "4A4A4A", MUTE = "8A7E78", BLACK = "1A1A1A";
const FONT = "Mintyo UI";
const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.16 });

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "カイシャダルマ";
pres.title = "カイシャダルマ × IVS 取材ご協力のご案内";

function header(s, kicker, title) {
  s.background = { color: CREAM };
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.55, w: 0.26, h: 0.26, fill: { color: CHERRY } });
  s.addText(kicker, { x: 0.95, y: 0.5, w: 11, h: 0.35, fontFace: FONT, fontSize: 13, color: CHERRY, bold: true, charSpacing: 2, margin: 0, valign: "middle" });
  s.addText(title, { x: 0.6, y: 0.82, w: 12.1, h: 0.7, fontFace: FONT, fontSize: 30, color: INK, bold: true, margin: 0 });
}

// S1 — TITLE
let s = pres.addSlide();
s.background = { color: INK };
s.addShape(pres.shapes.OVAL, { x: 9.4, y: 1.5, w: 4.4, h: 4.4, fill: { color: CHERRY } });
s.addShape(pres.shapes.OVAL, { x: 10.7, y: 2.85, w: 0.6, h: 0.6, fill: { color: INK } });
s.addShape(pres.shapes.OVAL, { x: 11.85, y: 2.85, w: 0.6, h: 0.6, fill: { color: GOLD } });
s.addText("カイシャダルマ × IVS", { x: 0.9, y: 1.9, w: 8.2, h: 0.4, fontFace: FONT, fontSize: 15, color: GOLD, bold: true, charSpacing: 2, margin: 0 });
s.addText("取材ご協力のお願い", { x: 0.9, y: 2.5, w: 8.4, h: 1.4, fontFace: FONT, fontSize: 50, color: "FFFFFF", bold: true, margin: 0 });
s.addShape(pres.shapes.LINE, { x: 0.95, y: 4.2, w: 2.2, h: 0, line: { color: GOLD, width: 2 } });
s.addText("IVS会場でのだるま納品＆ミニインタビュー企画 ご案内", { x: 0.92, y: 4.45, w: 8.4, h: 0.5, fontFace: FONT, fontSize: 15, color: "E8D9D0", margin: 0 });
s.addText("◯◯株式会社 御中", { x: 0.92, y: 6.4, w: 8, h: 0.4, fontFace: FONT, fontSize: 13, color: MUTE, margin: 0 });

// S2 — ABOUT
s = pres.addSlide();
header(s, "ABOUT", "本企画について");
s.addText("「カイシャダルマ」を導入された企業様の目標宣言と、納品時のリアルな反応やインタビューを通じて、企業の独自カラーと未来への想いを届ける短尺動画企画です。",
  { x: 0.6, y: 1.9, w: 12.1, h: 1.6, fontFace: FONT, fontSize: 19, color: GRAY, lineSpacingMultiple: 1.3, margin: 0 });
s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.3, w: 12.1, h: 1.2, fill: { color: "FFFFFF" }, shadow: shadow() });
s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.3, w: 0.12, h: 1.2, fill: { color: GOLD } });
s.addText("フォーマット", { x: 1.0, y: 4.3, w: 2.6, h: 1.2, fontFace: FONT, fontSize: 16, color: CHERRY, bold: true, valign: "middle", margin: 0 });
s.addText("縦型 9:16　／　約30秒　／　Instagram Reels・TikTok 向け", { x: 3.5, y: 4.3, w: 9.0, h: 1.2, fontFace: FONT, fontSize: 18, color: INK, bold: true, valign: "middle", margin: 0 });

// S3 — STRUCTURE TABLE
s = pres.addSlide();
header(s, "STRUCTURE", "構成（カット表）");
const head = (t) => ({ text: t, options: { fill: { color: INK }, color: "FFFFFF", bold: true, fontFace: FONT, fontSize: 14, valign: "middle", align: "center" } });
const rows = [
  ["1", "フック", "0–3秒", "後半インタビューカットの切り抜きを使用予定"],
  ["2", "開封", "3–5秒", "箱を開ける様子"],
  ["3", "取り出し", "8–13秒", "箱から取り出す様子（ヒキ）"],
  ["4", "インタビュー", "13–25秒", "業務内容・だるまのこだわり・今後の目標"],
  ["5", "意気込み", "25–35秒", "ボードを持って目標表明で締める"],
];
const body = rows.map((r, i) => {
  const bg = i % 2 ? "F4ECE5" : "FFFFFF";
  return [
    { text: r[0], options: { fill: { color: CHERRY }, color: "FFFFFF", bold: true, align: "center", valign: "middle", fontFace: FONT, fontSize: 15 } },
    { text: r[1], options: { fill: { color: bg }, color: INK, bold: true, valign: "middle", fontFace: FONT, fontSize: 14 } },
    { text: r[2], options: { fill: { color: bg }, color: BLACK, bold: true, align: "center", valign: "middle", fontFace: FONT, fontSize: 13 } },
    { text: r[3], options: { fill: { color: bg }, color: GRAY, valign: "middle", fontFace: FONT, fontSize: 14 } },
  ];
});
s.addTable([[head("#"), head("カット"), head("尺"), head("内容")], ...body], {
  x: 0.6, y: 1.75, w: 12.1, colW: [0.7, 2.4, 1.3, 7.7], rowH: [0.5, 0.78, 0.78, 0.78, 0.78, 0.78],
  border: { pt: 0.5, color: "E0D5CD" }, valign: "middle",
});
s.addText("※ カット2：カメラを段ボール下に設置するため、一度取り出した後に動画用の再現カットへご協力いただけますと幸いです。",
  { x: 0.6, y: 6.5, w: 12.1, h: 0.5, fontFace: FONT, fontSize: 13, color: MUTE, italic: true, margin: 0 });

// S4 — SCRIPT (dialogue)
s = pres.addSlide();
header(s, "SCRIPT", "撮影台本（A＝質問者／B＝ご担当者）");
function dialoguePanel(x, w, label, lines) {
  s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w, h: 4.95, fill: { color: "FFFFFF" }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w, h: 0.6, fill: { color: CHERRY } });
  s.addText(label, { x: x + 0.3, y: 1.75, w: w - 0.6, h: 0.6, fontFace: FONT, fontSize: 15, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
  const runs = [];
  lines.forEach(([who, text], i) => {
    const isA = who === "A";
    runs.push({ text: who + "：", options: { bold: true, color: isA ? CHERRY : BLACK, fontFace: FONT, fontSize: 14 } });
    runs.push({ text: text, options: { color: isA ? CHERRY : GRAY, fontFace: FONT, fontSize: 14, bold: isA, breakLine: true, paraSpaceAfter: isA ? 4 : 12 } });
  });
  s.addText(runs, { x: x + 0.35, y: 2.55, w: w - 0.7, h: 3.95, valign: "top", margin: 0 });
}
dialoguePanel(0.6, 6.05, "［インタビュー 13–25秒］", [
  ["A", "どんなお仕事をされていますか？"],
  ["B", "私たちは〇〇な会社で、△△をしています。"],
  ["A", "今のお仕事を始められたきっかけは？"],
  ["B", "もともと〜の経験があって、〜のために始めました。"],
  ["A", "今回のだるまへのこだわりポイントは？"],
  ["B", "色を〇〇にしたところです。△△への想いを込めています。"],
]);
dialoguePanel(6.85, 5.85, "［意気込み 25–35秒］", [
  ["A", "お仕事をしていて楽しかった/大変だったことは？"],
  ["B", "一番うれしいのは〜の瞬間です。"],
  ["A", "最後に目標を教えてください。"],
  ["B", "これから〇〇を実現します！"],
]);

// S5 — PREP & QUESTIONS
s = pres.addSlide();
header(s, "PLEASE PREPARE", "事前のご準備 ＆ 当日お聞きすること");
// left panel: prep
s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.75, w: 5.3, h: 4.9, fill: { color: "FFFFFF" }, shadow: shadow() });
s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.75, w: 5.3, h: 0.6, fill: { color: CHERRY } });
s.addText("事前のご準備のお願い", { x: 0.9, y: 1.75, w: 4.7, h: 0.6, fontFace: FONT, fontSize: 16, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
s.addText("SNSへの顔出し掲載がOKな方を 1〜数名 お決めください。\n\nまたボードに掲載する「目標」や、右の質問への回答を、簡単で構いませんのでお考えいただけますと幸いです。",
  { x: 0.95, y: 2.6, w: 4.6, h: 3.8, fontFace: FONT, fontSize: 15, color: GRAY, lineSpacingMultiple: 1.25, valign: "top", margin: 0 });
// right: questions
s.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: 1.75, w: 6.6, h: 4.9, fill: { color: "FFFFFF" }, shadow: shadow() });
s.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: 1.75, w: 6.6, h: 0.6, fill: { color: GOLD } });
s.addText("当日お聞きすること", { x: 6.4, y: 1.75, w: 6.0, h: 0.6, fontFace: FONT, fontSize: 16, color: "FFFFFF", bold: true, valign: "middle", margin: 0 });
const qs = [
  "お仕事の内容",
  "発注しただるまのデザイン（難しければ会社ロゴ・カラーのこだわり）",
  "仕事のやりがい・大変だったこと",
  "事業を始めた／その仕事に就いた理由",
  "これから頑張りたいこと（だるまに込める願い → 撮影時にホワイトボードへ記入）",
];
qs.forEach((q, i) => {
  const y = 2.62 + i * 0.78;
  s.addShape(pres.shapes.OVAL, { x: 6.4, y: y, w: 0.56, h: 0.56, fill: { color: CHERRY } });
  s.addText("Q" + (i + 1), { x: 6.4, y: y, w: 0.56, h: 0.56, fontFace: FONT, fontSize: 12, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
  s.addText(q, { x: 7.1, y: y - 0.05, w: 5.4, h: 0.66, fontFace: FONT, fontSize: 13.5, color: GRAY, valign: "middle", margin: 0 });
});

pres.writeFile({ fileName: "/Users/aoi/Desktop/Bluenote/3_Project/会社だるま_IVS/取材先企業様向け_ご案内.pptx" }).then((f) => console.log("Saved:", f));
