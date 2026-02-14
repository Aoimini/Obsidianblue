/**
 * LINE家計簿Bot：最新統合版（予算管理・振替・記憶・削除機能搭載）
 * 
 * このスクリプトはLINEから送られたメッセージを受け取り、
 * Googleスプレッドシートに家計簿データを記録します。
 */

// ── 設定（定数）ブロック ─────────────────────
// LINEのWebhook用トークン（LINE Developersで取得したチャネルアクセストークン）
// ※注意：本番ではスクリプトプロパティで管理することを推奨
const LINE_TOKEN = '2rvDtaDUitdQzf7LvVFvzVbMmSMteUDnAK5jeTRmNK4rHtvsP3nKuExgFSr2Dt1QkTgV09ft0IdSGAdfPI5ARXEmwM1vYsiDxU7d8f+wpewf1C0DqfOKNDx5sNxmCN12R6QWPFwOI9zN9n0r2ELtzAdB04t89/1O/w1cDnyilFU=';
// 家計簿を記録するスプレッドシートのシート名
const SHEET_NAME = '2026';

/**
 * メイン処理：LINEからメッセージが届いたときに呼ばれる関数
 * Google Apps ScriptのWebアプリとしてデプロイすると、LINE Platformがこの関数にPOSTリクエストを送ります
 * @param {Object} e - POSTリクエストのデータ（postData.contents にJSONが入っている）
 */
function doPost(e) {
  // ── リクエスト解析ブロック ─────────────────────
  // POSTされたJSONをJavaScriptのオブジェクトに変換
  const json = JSON.parse(e.postData.contents);
  // LINEのイベントは配列で送られるので、最初の1件を取得
  const event = json.events[0];
  // メッセージ以外（スタンプ・画像など）の場合は何もせず終了
  if (!event || event.type !== 'message') return;

  // 後でLINEに返信する際に必要なトークン
  const replyToken = event.replyToken;
  // ユーザーが送ったテキスト（前後の空白を削除）
  const userMessage = event.message.text.trim();
  // ユーザーごとに記憶を分けるためのID
  const userId = event.source.userId;
  // 一時データを保存する仕組み（同じユーザーの前回入力を覚えておくため）
  const cache = CacheService.getScriptCache();
  const userKey = "input_" + userId;

  // ── 重複実行防止ブロック ─────────────────────
  // 同じメッセージIDが既に処理済みなら何もせず終了（LINEが再送することがあるため）
  if (cache.get(event.message.id)) return;
  // このメッセージIDを「処理済み」として10分間保存
  cache.put(event.message.id, '1', 600);

  // ── スプレッドシート準備ブロック ─────────────────────
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  // ── 1. 資産移動（振替機能）ブロック ─────────────────────
  // 例：「振替 三井住友 PayPay 5000」→ 三井住友からPayPayへ5000円移動
  if (userMessage.startsWith("振替")) {
    // スペース・全角スペースで区切って配列に分割
    const parts = userMessage.split(/[\s　]+/);
    // 「振替」「出元口座」「先口座」「金額」の4要素が必要
    if (parts.length >= 4) {
      const fromAcc = parts[1];  // 出元の口座（例：三井住友）
      const toAcc = parts[2];    // 送り先の口座（例：PayPay）
      const amt = parseInt(parts[3].replace(/[^0-9]/g, ''));  // 金額（数字以外を除去）
      const dateStr = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd");
      const month = (new Date().getMonth() + 1).toString();
      // 出元口座に「出金」、先口座に「入金」の2行を追加
      appendRowWithBalance(sheet, month, dateStr, fromAcc, "出金", "振替", toAcc, amt);
      appendRowWithBalance(sheet, month, dateStr, toAcc, "入金", "振替", fromAcc, amt);
      sendReply(replyToken, `振替完了：\n${fromAcc} ➔ ${toAcc}\n${amt.toLocaleString()}円`);
      return;  // 処理完了のためここで終了
    }
  }

  // ── 2. 削除・記憶リセットブロック ─────────────────────
  if (userMessage === "削除" || userMessage === "消して" || userMessage.includes("削除したい")) {
    // このユーザーの「途中まで入力した記憶」を消去
    cache.remove(userKey);
    if (userMessage === "削除" || userMessage === "消して") {
      // シートの最後の行を削除（直前に登録した1件を消す）
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) { 
        sheet.deleteRow(lastRow); 
        sendReply(replyToken, "直前のデータを削除し、記憶をリセットしました。"); 
      }
    } else {
      // 「〇〇を削除したい」形式で、日付・金額・費目を指定して特定行を削除
      deleteSpecificRow(sheet, userMessage, replyToken);
    }
    return;
  }

  // ── 3. 解析と一時記憶機能ブロック ─────────────────────
  // ユーザーが「分けて送る」に対応：例「カフェ」「500円」と別々に送ってもOK
  let savedData = cache.get(userKey);
  // 前回の入力を復元。なければ空のオブジェクトで開始（口座の初期値は三井住友）
  let currentInput = savedData ? JSON.parse(savedData) : { itemName: "", amount: null, dateStr: "", account: "三井住友" };
  // 今回のメッセージを空白・改行で区切って1つずつ解析
  const parts = userMessage.split(/[\s　\n]+/);
  
  parts.forEach(p => {
    if (/^\d{4}$/.test(p)) {
      // 4桁数字 → 日付（0131＝1月31日）か、単なる金額か判定
      let m = parseInt(p.slice(0,2)), d = parseInt(p.slice(2,4));
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) currentInput.dateStr = `2026/${p.slice(0,2)}/${p.slice(2,4)}`;
      else currentInput.amount = parseInt(p);  // 日付として不正なら金額扱い
    } else if (/^\d+円?$/.test(p)) {
      // 「500」「500円」形式 → 金額
      currentInput.amount = parseInt(p.replace("円", ""));
    } else if (["三井住友", "PayPay", "みずほ", "現金"].includes(p)) {
      // 登録済み口座名 → 口座
      currentInput.account = p;
    } else {
      // それ以外 → 費目（何に使ったか）
      currentInput.itemName = p;
    }
  });

  // ── 情報不足チェックブロック ─────────────────────
  // 費目か金額がまだない場合、今の状態を記憶して聞き返す
  if (!currentInput.itemName || currentInput.amount === null) {
    cache.put(userKey, JSON.stringify(currentInput), 1800);  // 現在の入力を30分間保持
    let missing = !currentInput.itemName ? "「費目」" : "「金額」";
    sendReply(replyToken, `${missing}を教えてください。\n(現在: ${currentInput.itemName || '-'} ${currentInput.amount || '-'}円)`);
    return;
  }

  // ── 4. 登録・予算照合ブロック ─────────────────────
  // 日付が指定されていればそれを使用、なければ今日の日付
  const finalDateStr = currentInput.dateStr || Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd");
  const month = parseInt(finalDateStr.split('/')[1]).toString();  // 月だけ抽出（予算照合用）
  cache.remove(userKey);  // 登録完了につき一時記憶を消去

  // 費目を「大分類」「小分類」に自動振り分け（デフォルトは変動費）
  let type = "出金", item1 = "変動費", item2 = currentInput.itemName;
  if (["勉強", "研修", "診断"].some(k => item2.includes(k))) { 
    item1 = "固定費"; item2 = "勉強費"; 
  } else {
    const rules = {"セブン":{i1:"変動費",i2:"食費"}, "ファミマ":{i1:"変動費",i2:"食費"}};
    if (rules[item2]) { item1 = rules[item2].i1; item2 = rules[item2].i2; }
  }

  // スプレッドシートに1行追加（残高計算の数式も自動で入れる）
  appendRowWithBalance(sheet, month, finalDateStr, currentInput.account, type, item1, item2, currentInput.amount);

  // 「予算」シートがあれば、この月の支出合計と残高を計算してメッセージに追加
  const budgetSheet = ss.getSheetByName("予算");
  let budgetMsg = "";
  if (budgetSheet) {
    const bData = budgetSheet.getRange(5, 1, 58, 2).getValues();  // A5:B58 の予算一覧
    const mainData = sheet.getDataRange().getValues();
    let spent = 0;
    mainData.forEach(row => { 
      if (row[0].toString() === month && (row[4] === item1 || row[5] === item2)) spent += Number(row[6]); 
    });
    
    for (let i = 0; i < bData.length; i++) {
      if (bData[i][0] === item1 || bData[i][0] === item2) {
        let remaining = bData[i][1] - spent;  // 予算 - 支出合計 = 残高
        budgetMsg = `\n\n【予算状況】\n${bData[i][0]} 残高: ${remaining.toLocaleString()}円`;
        break;
      }
    }
  }

  sendReply(replyToken, `登録完了：${finalDateStr}\n${item2} ${currentInput.amount.toLocaleString()}円${budgetMsg}`);
}

/**
 * 残高計算数式を含めて行を追加する関数
 * 
 * @param {Sheet} sheet - 対象のスプレッドシートシート
 * @param {string} month - 月（例："1"）
 * @param {string} date - 日付（例："2026/01/31"）
 * @param {string} acc - 口座名
 * @param {string} type - 入金 or 出金
 * @param {string} i1 - 大分類（変動費・固定費など）
 * @param {string} i2 - 小分類（食費・勉強費など）
 * @param {number} amt - 金額
 */
function appendRowWithBalance(sheet, month, date, acc, type, i1, i2, amt) {
  const lastRow = sheet.getLastRow();
  // H列に「同じ口座の直前残高 ± 今回の金額」を計算する数式を入れる
  // 入金なら+, 出金なら- で残高を更新
  const formulaH = `=IFERROR(INDEX(H:H,MAX(FILTER(ROW($C$1:C${lastRow}),$C$1:C${lastRow}="${acc}"))),0) + IF(D${lastRow+1}="入金",G${lastRow+1},-G${lastRow+1})`;
  sheet.appendRow([month, date, acc, type, i1, i2, amt, formulaH]);
}

/**
 * 特定の行を検索して削除
 */
function deleteSpecificRow(sheet, msg, token) {
  const data = sheet.getDataRange().getValues();
  const dMatch = msg.match(/\d{4}\/\d{2}\/\d{2}/), aMatch = msg.match(/(\d{1,3}(,\d{3})*|\d+)円/);
  if (!dMatch || !aMatch) return sendReply(token, "削除対象を特定できませんでした。");
  const tDate = dMatch[0], tAmt = parseInt(aMatch[1].replace(/,/g, ''));
  for (let i = data.length - 1; i >= 1; i--) {
    const sDate = Utilities.formatDate(new Date(data[i][1]), "JST", "yyyy/MM/dd");
    if (sDate === tDate && parseInt(data[i][6]) === tAmt && msg.includes(data[i][5])) {
      sheet.deleteRow(i + 1);
      return sendReply(token, `削除しました：\n${tDate} ${data[i][5]} ${tAmt}円`);
    }
  }
  sendReply(token, "一致するデータが見つかりませんでした。");
}

/** * LINEへの返信送信 
 */
function sendReply(token, text) {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    'headers': {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + LINE_TOKEN},
    'method': 'post', 'payload': JSON.stringify({'replyToken': token, 'messages': [{'type': 'text', 'text': text}]})
  });
}