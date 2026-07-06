// --- VOCABULARY DATABASE ---
const VOCAB_DATABASE = {
  food: [
    {
      word: "김밥",
      meaning: "キンパ (海苔巻き)",
      romanization: "Gim-bap / キムパプ",
      description: "ごま油と塩で味付けしたご飯と様々な具材を海苔で巻いた、韓国の国民食！",
      customerGreeting: "お腹ペコペコ！出来立ての美味しい「キンパ」はあるかな？",
      customerSuccess: "マシッソヨ（美味しい）！ごま油の香りと具だくさんの食感が最高だね！",
      syllables: [
        { char: "김", layout: "lrb", slots: { choseong: "ㄱ", jungseong: "ㅣ", jongseong: "ㅁ" } },
        { char: "밥", layout: "lrb", slots: { choseong: "ㅂ", jungseong: "ㅏ", jongseong: "ㅂ" } }
      ]
    },
    {
      word: "떡볶이",
      meaning: "トッポギ",
      romanization: "Tteok-bok-ki / トッポギ",
      description: "細長いお餅（トック）をコチュジャンベースの甘辛いタレで炒めた、大人気ストリートフード！",
      customerGreeting: "ちょっと小腹が空いたな。甘辛くてモチモチの「トッポギ」をちょうだい！",
      customerSuccess: "うーん、もちもちで辛くて最高！これはおでんのスープが欲しくなるね！",
      syllables: [
        { char: "떡", layout: "lrb", slots: { choseong: "ㄸ", jungseong: "ㅓ", jongseong: "ㄱ" } },
        { char: "볶", layout: "lrb", slots: { choseong: "ㅂ", jungseong: "ㅗ", jongseong: "ㄲ" } },
        { char: "이", layout: "lr", slots: { choseong: "ㅇ", jungseong: "ㅣ" } }
      ]
    },
    {
      word: "소주",
      meaning: "ソジュ (焼酎)",
      romanization: "So-ju / ソジュ",
      description: "韓国の屋台には欠かせない緑のボトルの国民的お酒。すっきりとした味わいです。",
      customerGreeting: "今日もお疲れ様。屋台と言えばこれ！冷たい「ソジュ」を一杯もらえる？",
      customerSuccess: "くぁー！冷えてて美味しい！おつまみと一緒に飲むと最高の夜だ！",
      syllables: [
        { char: "소", layout: "tb", slots: { choseong: "ㅅ", jungseong: "ㅗ" } },
        { char: "주", layout: "tb", slots: { choseong: "ㅈ", jungseong: "ㅜ" } }
      ]
    },
    {
      word: "라면",
      meaning: "ラーメン",
      romanization: "Ra-myeon / ラミョン",
      description: "韓国ではインスタントラーメンが主流。屋台やコンビニで食べるラーメンは格別です。",
      customerGreeting: "夜中の屋台で食べる「라면（ラーメン）」って、なんでこんなに魅力的なんだろう…！",
      customerSuccess: "この辛さがクセになる！スープまで飲み干したくなっちゃう美味しさだね！",
      syllables: [
        { char: "라", layout: "lr", slots: { choseong: "ㄹ", jungseong: "ㅏ" } },
        { char: "면", layout: "lrb", slots: { choseong: "ㅁ", jungseong: "ㅕ", jongseong: "ㄴ" } }
      ]
    },
    {
      word: "김치",
      meaning: "キムチ",
      romanization: "Gim-chi / キムチ",
      description: "乳酸発酵による酸味と唐辛子の辛さが特徴の韓国伝統の漬物。毎食欠かせないパートナーです。",
      customerGreeting: "屋台のご飯をもっと美味しくする、ピリ辛でシャキシャキの「キムチ」が欲しいな！",
      customerSuccess: "やっぱりキムチは裏切らない！何に合わせても美味しさを引き立ててくれるね！",
      syllables: [
        { char: "김", layout: "lrb", slots: { choseong: "ㄱ", jungseong: "ㅣ", jongseong: "ㅁ" } },
        { char: "치", layout: "lr", slots: { choseong: "ㅊ", jungseong: "ㅣ" } }
      ]
    },
    {
      word: "물",
      meaning: "水",
      romanization: "Mul / ムル",
      description: "食事中やお酒のお供に。韓国語で水は「ムル」と言います。",
      customerGreeting: "トッポギが思ったより辛くて…！すみません、冷たい「お水」をください！",
      customerSuccess: "ふぅー、生き返った！ありがとうございます！もう一口トッポギ食べようっと！",
      syllables: [
        { char: "물", layout: "tmb", slots: { choseong: "ㅁ", jungseong: "ㅜ", jongseong: "ㄹ" } }
      ]
    }
  ],
  travel: [
    {
      word: "서울",
      meaning: "ソウル",
      romanization: "Seo-ul / ソウル",
      description: "韓国の首都。古き良き王宮と最先端の都市文化が共存する魅力あふれる大都市です。",
      customerGreeting: "初めての韓国旅行なんだ！まずはこの国の首都「ソウル」の名前を覚えたいな！",
      customerSuccess: "そう、ソウル！美味しい屋台がたくさんあって、街がキラキラしていて本当に楽しい場所だね！",
      syllables: [
        { char: "서", layout: "lr", slots: { choseong: "ㅅ", jungseong: "ㅓ" } },
        { char: "울", layout: "tmb", slots: { choseong: "ㅇ", jungseong: "ㅜ", jongseong: "ㄹ" } }
      ]
    },
    {
      word: "지하철",
      meaning: "地下鉄",
      romanization: "Ji-ha-cheol / チハチョル",
      description: "ソウル市内を網羅する便利な交通網。日本語案内も多く、観光客の強い味方です。",
      customerGreeting: "ソウルの街をあちこち観光したいな。一番便利で安い「地下鉄」の韓国語を教えて！",
      customerSuccess: "「チハチョル」か！改札も分かりやすいし、次の目的地にもすぐに行けるね！",
      syllables: [
        { char: "지", layout: "lr", slots: { choseong: "ㅈ", jungseong: "ㅣ" } },
        { char: "하", layout: "lr", slots: { choseong: "ㅎ", jungseong: "ㅏ" } },
        { char: "철", layout: "lrb", slots: { choseong: "ㅊ", jungseong: "ㅓ", jongseong: "ㄹ" } }
      ]
    },
    {
      word: "지도",
      meaning: "地図",
      romanization: "Ji-do / チド",
      description: "旅行に欠かせない地図。ハングルで道を探すのも旅の醍醐味です。",
      customerGreeting: "路地裏で道に迷っちゃったみたい…。カバンから「地図」を取り出さなきゃ！",
      customerSuccess: "「チド」だね！スマホの地図アプリを見ながら、ここから屋台に戻るルートを探してみるよ！",
      syllables: [
        { char: "지", layout: "lr", slots: { choseong: "ㅈ", jungseong: "ㅣ" } },
        { char: "도", layout: "tb", slots: { choseong: "ㄷ", jungseong: "ㅗ" } }
      ]
    },
    {
      word: "택시",
      meaning: "タクシー",
      romanization: "Taek-si / テクシ",
      description: "初乗り料金が安く、気軽に利用できる移動手段。深夜の帰宅にも便利です。",
      customerGreeting: "荷物が多くて歩くのが大変だな。あそこを走っている「タクシー」を呼びたい！",
      customerSuccess: "「テクシ」だ！ドアは自動で開かないから、自分で開けて乗り込むよ！",
      syllables: [
        { char: "택", layout: "lrb", slots: { choseong: "ㅌ", jungseong: "ㅐ", jongseong: "ㄱ" } },
        { char: "시", layout: "lr", slots: { choseong: "ㅅ", jungseong: "ㅣ" } }
      ]
    },
    {
      word: "여권",
      meaning: "パスポート",
      romanization: "Yeo-gwon / ヨグォン",
      description: "海外旅行に最重要な身分証明書。免税（Tax Refund）を受ける際にも提示が必要です。",
      customerGreeting: "免税店でお買い物をしたよ。手続きをするために「パスポート」の単語を組み立てよう！",
      customerSuccess: "「ヨグォン」！旅行中は絶対になくさないように、しっかりホールドしておかなくちゃ！",
      syllables: [
        { char: "여", layout: "lr", slots: { choseong: "ㅇ", jungseong: "ㅕ" } },
        { char: "권", layout: "compb", slots: { choseong: "ㄱ", "jungseong-h": "ㅜ", "jungseong-v": "ㅓ", jongseong: "ㄴ" } }
      ]
    },
    {
      word: "공항",
      meaning: "空港",
      romanization: "Gong-hang / コンハン",
      description: "旅の始まりと終わりの場所。仁川（インチョン）空港は世界有数の規模を誇ります。",
      customerGreeting: "あっという間の旅だったな。これから帰国の飛行機に乗るために「空港」へ向かうよ！",
      customerSuccess: "「コンハン」！またすぐに韓国に遊びに来るから、その時までアンニョン！",
      syllables: [
        { char: "공", layout: "tmb", slots: { choseong: "ㄱ", jungseong: "ㅗ", jongseong: "ㅇ" } },
        { char: "항", layout: "lrb", slots: { choseong: "ㅎ", jungseong: "ㅏ", jongseong: "ㅇ" } }
      ]
    }
  ],
  daily: [
    {
      word: "안녕",
      meaning: "こんにちは / バイバイ (ため口)",
      romanization: "An-nyeong / アンニョン",
      description: "親しい間柄で使われる、挨拶の万能フレーズ。出会った時も別れる時も使えます。",
      customerGreeting: "屋台の店主さんや常連さんと、親しみを込めて「こんにちは」って挨拶したいな！",
      customerSuccess: "「アンニョン」！声に出して言うと、一気に友達になれたような気がするね！",
      syllables: [
        { char: "안", layout: "lrb", slots: { choseong: "ㅇ", jungseong: "ㅏ", jongseong: "ㄴ" } },
        { char: "녕", layout: "lrb", slots: { choseong: "ㄴ", jungseong: "ㅕ", jongseong: "ㅇ" } }
      ]
    },
    {
      word: "사랑",
      meaning: "愛 / ラブ",
      romanization: "Sa-rang / サラン",
      description: "ドラマや音楽でも頻出の単語。「サランヘヨ（愛しています）」でお馴染みです。",
      customerGreeting: "韓国のエンタメで一番よく耳にする、とてもロマンチックな「愛」という言葉は？",
      customerSuccess: "「サラン」だね！言葉の響きも優しくて、聞くだけで心が温かくなる単語だよ！",
      syllables: [
        { char: "사", layout: "lr", slots: { choseong: "ㅅ", jungseong: "ㅏ" } },
        { char: "랑", layout: "lrb", slots: { choseong: "ㄹ", jungseong: "ㅏ", jongseong: "ㅇ" } }
      ]
    },
    {
      word: "친구",
      meaning: "友達",
      romanization: "Chin-gu / チング",
      description: "同い年の親しい間柄を指す言葉。韓国では友情をとても大切にします。",
      customerGreeting: "ここで出会ったみんなと、これからもずっと仲良くできる「友達」になりたい！",
      customerSuccess: "「チング」！年齢を超えて通じ合える友達になれて、今日の夜は一生の思い出だよ！",
      syllables: [
        { char: "친", layout: "lrb", slots: { choseong: "ㅊ", jungseong: "ㅣ", jongseong: "ㄴ" } },
        { char: "구", layout: "tb", slots: { choseong: "ㄱ", jungseong: "ㅜ" } }
      ]
    },
    {
      word: "감사",
      meaning: "感謝 / ありがとう",
      romanization: "Gam-sa / カムサ",
      description: "感謝を表す言葉。「カムサハムニダ（感謝します）」のベースになる単語です。",
      customerGreeting: "美味しい料理を作ってくれた店主さんに、丁寧に「感謝」を伝えたい！",
      customerSuccess: "「カムサ」！店主さんも嬉しそうにニコニコしてくれたよ。笑顔は万国共通だね！",
      syllables: [
        { char: "감", layout: "lrb", slots: { choseong: "ㄱ", jungseong: "ㅣ", jongseong: "ㅁ" } },
        { char: "사", layout: "lr", slots: { choseong: "ㅅ", jungseong: "ㅏ" } }
      ]
    },
    {
      word: "행복",
      meaning: "幸せ / ハッピー",
      romanization: "Haeng-bok / ヘンボク",
      description: "心が満たされて幸せな状態。「ヘンボケヨ（幸せです）」のように使います。",
      customerGreeting: "美味しいものを食べて楽しい話をしている、この「幸せ」な気持ちを表す言葉は？",
      customerSuccess: "「ヘンボク」！まさに今のこのポチャ（屋台）の空間が、幸せそのものだね！",
      syllables: [
        { char: "행", layout: "lrb", slots: { choseong: "ㅎ", jungseong: "ㅐ", jongseong: "ㅇ" } },
        { char: "복", layout: "tmb", slots: { choseong: "ㅂ", jungseong: "ㅗ", jongseong: "ㄱ" } }
      ]
    },
    {
      word: "마음",
      meaning: "心 / 気持ち",
      romanization: "Ma-eum / マウム",
      description: "心、精神、感情を意味する言葉。人の温かい気持ちを表すのによく使われます。",
      customerGreeting: "店主さんのサービスやお客さんの優しさ、そんな温かい「心」に触れて感動したよ！",
      customerSuccess: "「マウム」だね。目には見えないけれど、言葉のやり取りでしっかり心と心が繋がったよ！",
      syllables: [
        { char: "마", layout: "lr", slots: { choseong: "ㅁ", jungseong: "ㅏ" } },
        { char: "음", layout: "tmb", slots: { choseong: "ㅇ", jungseong: "ㅡ", jongseong: "ㅁ" } }
      ]
    }
  ],
  culture: [
    {
      word: "노래",
      meaning: "歌 / 曲",
      romanization: "No-rae / ノレ",
      description: "音楽全般を指す言葉。韓国には「ノレバン（歌の部屋＝カラオケ）」という定番スポットもあります。",
      customerGreeting: "ポチャのラジオから流れているあの名曲！「歌」の韓国語は何て言うの？",
      customerSuccess: "「ノレ」！サビの部分をハングルで口ずさめるようになると、もっと楽しいよね！",
      syllables: [
        { char: "노", layout: "tb", slots: { choseong: "ㄴ", jungseong: "ㅗ" } },
        { char: "래", layout: "lr", slots: { choseong: "ㄹ", jungseong: "ㅐ" } }
      ]
    },
    {
      word: "가수",
      meaning: "歌手 / アーティスト",
      romanization: "Ga-su / カス",
      description: "歌う職業。K-POPアイドルや実力派バラードシンガーなど、韓国には魅力的な歌手が目白押しです。",
      customerGreeting: "大好きなK-POPグループがいるんだ。彼らの憧れの職業「歌手」を組み立ててみよう！",
      customerSuccess: "「カス」！歌もダンスも完璧で、いつもたくさんのエネルギーをもらっているよ！",
      syllables: [
        { char: "가", layout: "lr", slots: { choseong: "ㄱ", jungseong: "ㅏ" } },
        { char: "수", layout: "tb", slots: { choseong: "ㅅ", jungseong: "ㅜ" } }
      ]
    },
    {
      word: "스타",
      meaning: "スター",
      romanization: "Seu-ta / スター",
      description: "英語の「Star」をハングル表記したもの。世界で活躍するK-POPアイドルや俳優などを指します。",
      customerGreeting: "世界中を魅了して輝くK-POPの「スター」たち。ハングルではどう書くのかな？",
      customerSuccess: "「スター（スタ）」！母音がない子音のみの音に「ㅡ」を補う、韓国語特有の外来語ルールだね！",
      syllables: [
        { char: "스", layout: "tb", slots: { choseong: "ㅅ", jungseong: "ㅡ" } },
        { char: "타", layout: "lr", slots: { choseong: "ㅌ", jungseong: "ㅏ" } }
      ]
    },
    {
      word: "드라마",
      meaning: "ドラマ",
      romanization: "Deu-ra-ma / ドラマ",
      description: "世界的に大ヒット作を連発する韓国ドラマ。恋愛、復讐、サスペンスなど多彩なジャンルがあります。",
      customerGreeting: "昨夜も徹夜でお気に入りの「ドラマ」を見ちゃった！単語を組み立ててみよう！",
      customerSuccess: "「ドラマ」！ハングルでは3音節でリズミカルに発音するんだね。今夜の放送も楽しみ！",
      syllables: [
        { char: "드", layout: "tb", slots: { choseong: "ㄷ", jungseong: "ㅡ" } },
        { char: "라", layout: "lr", slots: { choseong: "ㄹ", jungseong: "ㅏ" } },
        { char: "마", layout: "lr", slots: { choseong: "ㅁ", jungseong: "ㅏ" } }
      ]
    },
    {
      word: "영화",
      meaning: "映画",
      romanization: "Yeong-hwa / ヨンファ",
      description: "アカデミー賞受賞作など、国際的評価の高い韓国映画。独自の緊迫感と描写力が強みです。",
      customerGreeting: "週末に友達と映画館に行くんだ。名作ぞろいの「映画」のハングルを調べよう！",
      customerSuccess: "「ヨンファ」！複合母音の「ㅘ (oa)」が含まれていて、発音の練習にもぴったりだね！",
      syllables: [
        { char: "영", layout: "lrb", slots: { choseong: "ㅇ", jungseong: "ㅕ", jongseong: "ㅇ" } },
        { char: "화", layout: "comp", slots: { choseong: "ㅎ", "jungseong-h": "ㅗ", "jungseong-v": "ㅏ" } }
      ]
    },
    {
      word: "대박",
      meaning: "ヤバい / 大ヒット / 大成功",
      romanization: "Dae-bak / テバク",
      description: "驚いた時、褒めちぎる時、美味しいものを食べた時など、日常のあらゆる場面で使われる超頻出スローガン！",
      customerGreeting: "感動したときや凄いものを見たとき、若者風に「ヤバい！」って叫んでみたい！",
      customerSuccess: "「テバク」！美味しすぎるキンパを食べた時も、まさにこの言葉がピッタリだね！",
      syllables: [
        { char: "대", layout: "lr", slots: { choseong: "ㄷ", jungseong: "ㅐ" } },
        { char: "박", layout: "lrb", slots: { choseong: "ㅂ", jungseong: "ㅏ", jongseong: "ㄱ" } }
      ]
    }
  ]
};

// --- CUSTOMERS SVG TEMPLATES ---
const CUSTOMER_TEMPLATES = [
  // 1. Ddeok-i (Cheerful Rice Cake)
  `<svg viewBox="0 0 100 100" class="svg-customer svg-glow-amber">
    <circle cx="50" cy="55" r="30" fill="#fff5ea" stroke="#ff9f00" stroke-width="2.5"/>
    <ellipse cx="50" cy="30" rx="20" ry="8" fill="#ff5e00" opacity="0.8"/> <!-- Headband/Sauce -->
    <path d="M 50,23 C 60,20 65,30 50,30 C 35,30 40,20 50,23 Z" fill="#ff5e00"/> <!-- Sauce Splat -->
    <!-- Eyes -->
    <circle cx="42" cy="52" r="3.5" fill="#2d1c08"/>
    <circle cx="58" cy="52" r="3.5" fill="#2d1c08"/>
    <circle cx="43.5" cy="50.5" r="1" fill="#fff"/>
    <circle cx="59.5" cy="50.5" r="1" fill="#fff"/>
    <!-- Blush -->
    <circle cx="36" cy="58" r="4" fill="#ffb4a2" opacity="0.6"/>
    <circle cx="64" cy="58" r="4" fill="#ffb4a2" opacity="0.6"/>
    <!-- Mouth -->
    <path d="M 46,62 Q 50,68 54,62" fill="none" stroke="#2d1c08" stroke-width="2" stroke-linecap="round"/>
    <!-- Little Chef Hat -->
    <path d="M 42,25 Q 50,15 58,25 Z" fill="#fff" stroke="#ff9f00" stroke-width="1.5"/>
  </svg>`,
  
  // 2. Kimbap Boy (Cute Seaweed Roll)
  `<svg viewBox="0 0 100 100" class="svg-customer svg-glow-cyan">
    <rect x="22" y="28" width="56" height="56" rx="28" fill="#151b22" stroke="#00f0ff" stroke-width="2.5"/>
    <!-- Filling layers -->
    <rect x="28" y="34" width="44" height="44" rx="22" fill="#faf6e8"/>
    <circle cx="50" cy="56" r="12" fill="#ffaa00"/> <!-- Egg -->
    <circle cx="42" cy="46" r="8" fill="#ff3b30"/> <!-- Carrot -->
    <circle cx="58" cy="46" r="7" fill="#4cd964"/> <!-- Spinach -->
    <rect x="44" y="60" width="12" height="8" rx="2" fill="#b06c00"/> <!-- Beef -->
    <!-- Face overlay -->
    <circle cx="44" cy="52" r="3" fill="#000"/>
    <circle cx="56" cy="52" r="3" fill="#000"/>
    <path d="M 47,56 Q 50,59 53,56" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"/>
    <!-- Cute glasses -->
    <rect x="37" y="47" width="12" height="9" rx="2" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
    <rect x="51" y="47" width="12" height="9" rx="2" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
    <line x1="49" y1="51" x2="51" y2="51" stroke="#00f0ff" stroke-width="1.5"/>
  </svg>`,

  // 3. Pocha Cat (Neko Chef)
  `<svg viewBox="0 0 100 100" class="svg-customer svg-glow-pink">
    <!-- Cat Ears -->
    <polygon points="25,20 45,40 22,48" fill="#403855" stroke="#ff007f" stroke-width="1.5"/>
    <polygon points="75,20 55,40 78,48" fill="#403855" stroke="#ff007f" stroke-width="1.5"/>
    <polygon points="28,25 41,38 26,43" fill="#ffb4a2"/>
    <polygon points="72,25 59,38 74,43" fill="#ffb4a2"/>
    <!-- Head -->
    <ellipse cx="50" cy="55" rx="30" ry="24" fill="#2c2540" stroke="#ff007f" stroke-width="2.5"/>
    <!-- Eyes (Happy Arcs) -->
    <path d="M 38,52 Q 43,47 45,53" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 62,52 Q 57,47 55,53" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Nose & Whiskers -->
    <polygon points="49,58 51,58 50,60" fill="#ffb4a2"/>
    <path d="M 46,63 Q 50,65 50,60 Q 50,65 54,63" fill="none" stroke="#fff" stroke-width="1.5"/>
    <!-- Whiskers -->
    <line x1="22" y1="56" x2="12" y2="54" stroke="#ff007f" stroke-width="1.5"/>
    <line x1="22" y1="60" x2="10" y2="61" stroke="#ff007f" stroke-width="1.5"/>
    <line x1="78" y1="56" x2="88" y2="54" stroke="#ff007f" stroke-width="1.5"/>
    <line x1="78" y1="60" x2="90" y2="61" stroke="#ff007f" stroke-width="1.5"/>
    <!-- Chef Hat -->
    <path d="M 40,33 C 35,22 45,15 50,20 C 55,15 65,22 60,33 Z" fill="#fff" stroke="#ff007f" stroke-width="1.5"/>
    <rect x="42" y="30" width="16" height="5" fill="#ff007f" rx="1"/>
  </svg>`
];

// --- SOUND EFFECTS SYNTHESIZER (WEB AUDIO API) ---
class AudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSnap() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playError() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playClear() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);

      gain.gain.setValueAtTime(0.12, now + index * 0.07);
      gain.gain.linearRampToValueAtTime(0.005, now + index * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.2);
    });
  }

  playLevelClear() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Energetic retro major chord arpeggio/fanfare
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]; // C4 to E6 arpeggio
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.05);

      gain.gain.setValueAtTime(0.1, now + index * 0.05);
      gain.gain.linearRampToValueAtTime(0.005, now + index * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.05);
      osc.stop(now + index * 0.05 + 0.35);
    });
  }
}

const synth = new AudioSynth();

// --- STATE MANAGEMENT ---
let state = {
  score: parseInt(localStorage.getItem('pocha_score') || '0'),
  completedWords: JSON.parse(localStorage.getItem('pocha_completed') || '[]'),
  currentCategory: 'food',
  currentIndex: 0,
  selectedLetterElement: null // For tap-to-place flow
};

const settings = {
  romaji: true,
  colorCode: true,
  voice: true
};

// --- DOM ELEMENTS ---
const elements = {
  customerBubble: document.getElementById('customer-bubble'),
  customerAvatar: document.getElementById('customer-avatar-container'),
  categoryList: document.getElementById('category-list'),
  wordMeaning: document.getElementById('word-meaning'),
  wordRomanization: document.getElementById('word-romanization'),
  syllableContainer: document.getElementById('syllable-container'),
  ingredientTray: document.getElementById('ingredient-tray'),
  statScore: document.getElementById('stat-score'),
  statLevel: document.getElementById('stat-level'),
  
  // Settings
  toggleRomaji: document.getElementById('toggle-romaji'),
  toggleColorCode: document.getElementById('toggle-color-code'),
  toggleVoice: document.getElementById('toggle-voice'),
  
  // Drawers & Modals
  recipeOverlay: document.getElementById('recipe-overlay'),
  recipeDrawer: document.getElementById('recipe-drawer'),
  recipeContent: document.getElementById('recipe-content'),
  btnRecipeBook: document.getElementById('btn-recipe-book'),
  btnCloseRecipe: document.getElementById('btn-close-recipe'),
  
  sandboxOverlay: document.getElementById('sandbox-overlay'),
  sandboxModal: document.getElementById('sandbox-modal'),
  btnSandbox: document.getElementById('btn-sandbox'),
  btnCloseSandbox: document.getElementById('btn-close-sandbox'),
  btnClearSandbox: document.getElementById('btn-clear-sandbox'),
  sandboxResultChar: document.getElementById('sandbox-result-char'),
  sandboxResultSound: document.getElementById('sandbox-result-sound'),
  
  btnSkip: document.getElementById('btn-skip'),
  toastNotify: document.getElementById('toast-notify')
};

// --- VOICE AUDIO SYNTHESIS (SPEECH) ---
function speakText(text) {
  if (!settings.voice) return;
  // Trigger speech synthesis
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}

// --- INIT APP ---
function init() {
  // Setup stats
  updateScoreDisplay();
  
  // Setup category listeners
  Array.from(elements.categoryList.children).forEach(btn => {
    btn.addEventListener('click', () => {
      // De-activate all
      Array.from(elements.categoryList.children).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const cat = btn.dataset.category;
      state.currentCategory = cat;
      state.currentIndex = 0;
      loadWord();
    });
  });

  // Settings inputs
  elements.toggleRomaji.addEventListener('change', (e) => {
    settings.romaji = e.target.checked;
    elements.wordRomanization.style.visibility = settings.romaji ? 'visible' : 'hidden';
  });

  elements.toggleColorCode.addEventListener('change', (e) => {
    settings.colorCode = e.target.checked;
    const arena = document.getElementById('puzzle-arena');
    if (settings.colorCode) {
      arena.classList.add('color-coded-slots');
    } else {
      arena.classList.remove('color-coded-slots');
    }
  });
  // Apply initial color coding
  document.getElementById('puzzle-arena').classList.add('color-coded-slots');

  elements.toggleVoice.addEventListener('change', (e) => {
    settings.voice = e.target.checked;
  });

  // Drawer / Modals listeners
  elements.btnRecipeBook.addEventListener('click', openRecipeBook);
  elements.btnCloseRecipe.addEventListener('click', closeRecipeBook);
  elements.recipeOverlay.addEventListener('click', closeRecipeBook);

  elements.btnSandbox.addEventListener('click', openSandbox);
  elements.btnCloseSandbox.addEventListener('click', closeSandbox);
  elements.sandboxOverlay.addEventListener('click', closeSandbox);
  elements.btnClearSandbox.addEventListener('click', resetSandboxSlots);

  // Skip button
  elements.btnSkip.addEventListener('click', () => {
    synth.playSnap();
    nextWord();
  });

  // Load the first word
  loadWord();
  
  // Setup Sandbox pieces
  buildSandboxPalette();
  setupSandboxDropTargets();

  // Close drawers on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRecipeBook();
      closeSandbox();
    }
  });
}

// --- LOAD WORD ---
function loadWord() {
  const words = VOCAB_DATABASE[state.currentCategory];
  // Loop back if we reach end
  if (state.currentIndex >= words.length) {
    state.currentIndex = 0;
  }
  
  const currentItem = words[state.currentIndex];
  
  // Update info panel
  elements.wordMeaning.innerHTML = `注文： <span>${currentItem.meaning}</span>`;
  elements.wordRomanization.textContent = currentItem.romanization;
  elements.wordRomanization.style.visibility = settings.romaji ? 'visible' : 'hidden';
  elements.customerBubble.textContent = currentItem.customerGreeting;
  
  // Display random customer avatar
  const rIndex = (currentItem.word.charCodeAt(0) + currentItem.word.charCodeAt(currentItem.word.length-1)) % CUSTOMER_TEMPLATES.length;
  elements.customerAvatar.innerHTML = CUSTOMER_TEMPLATES[rIndex];
  
  // Update progress text
  const clearedInCat = words.filter(w => state.completedWords.includes(w.word)).length;
  elements.statLevel.textContent = `${clearedInCat}/${words.length}`;
  
  // Clear tap selection
  clearTapSelection();

  // Render Syllable Slots
  elements.syllableContainer.innerHTML = '';
  
  // Build target letter structures
  const allNeededLetters = [];
  
  currentItem.syllables.forEach((syll, index) => {
    const block = document.createElement('div');
    block.className = `syllable-block layout-${syll.layout}`;
    block.dataset.syllableIndex = index;
    block.dataset.syllableChar = syll.char;
    block.dataset.completed = "false";
    
    // Create grid elements based on layout
    const slots = syll.slots;
    for (const [slotName, expectedLetter] of Object.entries(slots)) {
      const slot = document.createElement('div');
      slot.className = 'letter-slot';
      slot.dataset.slot = slotName;
      slot.dataset.expected = expectedLetter;
      slot.dataset.type = isVowel(expectedLetter) ? 'vowel' : 'consonant';
      
      // Add hints
      let hint = '子音';
      if (slotName.startsWith('jungseong')) hint = '母音';
      if (slotName === 'jongseong') hint = 'パッチム';
      slot.dataset.hint = hint;

      // Add HTML5 Drag handlers
      setupSlotDropHandlers(slot);
      
      // Click handler for Tap-to-Place
      slot.addEventListener('click', () => handleSlotClick(slot));

      block.appendChild(slot);
      allNeededLetters.push({
        letter: expectedLetter,
        type: slot.dataset.type
      });
    }
    
    elements.syllableContainer.appendChild(block);
  });

  // Render Ingredient tray (Draggables)
  elements.ingredientTray.innerHTML = '';
  
  // Add some distractors (random letters) to make it fun, total 8-10 pieces
  const distractorsCount = Math.max(3, 8 - allNeededLetters.length);
  for (let i = 0; i < distractorsCount; i++) {
    const randLetter = getRandomLetter(allNeededLetters[0].type);
    allNeededLetters.push({
      letter: randLetter,
      type: isVowel(randLetter) ? 'vowel' : 'consonant'
    });
  }

  // Shuffle letters
  allNeededLetters.sort(() => Math.random() - 0.5);

  // Render shuffled pieces
  allNeededLetters.forEach((item, id) => {
    const piece = document.createElement('div');
    piece.className = 'letter-piece';
    piece.draggable = true;
    piece.dataset.type = item.type;
    piece.dataset.letter = item.letter;
    piece.dataset.id = `piece-${id}`;
    piece.textContent = item.letter;

    // HTML5 DragStart
    piece.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: piece.dataset.id,
        letter: piece.dataset.letter,
        type: piece.dataset.type
      }));
      piece.classList.add('dragging');
    });

    piece.addEventListener('dragend', () => {
      piece.classList.remove('dragging');
    });

    // Tap selection for mobile / click path
    piece.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePieceSelect(piece);
    });

    elements.ingredientTray.appendChild(piece);
  });
}

// Helper to determine vowel
function isVowel(char) {
  const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  return vowels.includes(char);
}

function getRandomLetter(preferredType) {
  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㄸ', 'ㄲ', 'ㅃ', 'ㅆ'];
  const vowels = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅐ', 'ㅔ'];
  
  if (preferredType === 'vowel' && Math.random() > 0.3) {
    return vowels[Math.floor(Math.random() * vowels.length)];
  } else {
    return consonants[Math.floor(Math.random() * consonants.length)];
  }
}

// --- HTML5 DRAG & DROP HANDLERS ---
function setupSlotDropHandlers(slot) {
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!slot.classList.contains('filled')) {
      slot.classList.add('drag-over');
    }
  });

  slot.addEventListener('dragenter', (e) => {
    e.preventDefault();
  });

  slot.addEventListener('dragleave', () => {
    slot.classList.remove('drag-over');
  });

  slot.addEventListener('drop', (e) => {
    e.preventDefault();
    slot.classList.remove('drag-over');
    
    if (slot.classList.contains('filled')) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      verifyAndPlace(data.letter, data.id, slot);
    } catch(err) {
      console.error(err);
    }
  });
}

// --- TAP-TO-PLACE FLOW ---
function handlePieceSelect(piece) {
  synth.playSnap();
  
  // If clicked again, deselect
  if (state.selectedLetterElement === piece) {
    clearTapSelection();
    return;
  }
  
  // Clear any existing selection
  clearTapSelection();
  
  state.selectedLetterElement = piece;
  piece.style.transform = 'scale(1.1)';
  piece.style.borderColor = '#fff';
  piece.style.boxShadow = '0 0 15px #fff';
}

function clearTapSelection() {
  if (state.selectedLetterElement) {
    state.selectedLetterElement.style.transform = '';
    state.selectedLetterElement.style.borderColor = '';
    state.selectedLetterElement.style.boxShadow = '';
    state.selectedLetterElement = null;
  }
}

function handleSlotClick(slot) {
  if (slot.classList.contains('filled')) return;
  if (!state.selectedLetterElement) return;

  const letter = state.selectedLetterElement.dataset.letter;
  const id = state.selectedLetterElement.dataset.id;
  
  verifyAndPlace(letter, id, slot);
  clearTapSelection();
}

// Document body click clears piece selection
document.body.addEventListener('click', () => {
  clearTapSelection();
});

// --- VERIFY & PLACE LETTER ---
function verifyAndPlace(letter, id, slot) {
  const expected = slot.dataset.expected;
  
  if (letter === expected) {
    // SUCCESS! Place piece
    slot.classList.add('filled');
    slot.innerHTML = '';
    
    const piece = document.getElementById(id) || createStaticPiece(letter, slot.dataset.type);
    piece.classList.add('snapped');
    piece.removeAttribute('draggable');
    piece.style.transform = '';
    piece.style.borderColor = '';
    piece.style.boxShadow = '';
    
    // Disable click events on snapped piece
    piece.style.pointerEvents = 'none';
    
    slot.appendChild(piece);
    
    // Hide original element from tray
    const original = document.getElementById(id);
    if (original) original.style.display = 'none';

    synth.playSnap();
    
    // Check if whole syllable is completed
    const block = slot.closest('.syllable-block');
    checkSyllableCompletion(block);
    
  } else {
    // FAILURE! Buzz and feedback
    synth.playError();
    slot.style.animation = 'none';
    // Trigger redraw for reflow
    void slot.offsetWidth; 
    slot.style.animation = 'chew 0.2s 2';
    
    // Show a quick tooltip or red border pulse
    slot.style.borderColor = 'var(--neon-pink)';
    setTimeout(() => {
      slot.style.borderColor = '';
      slot.style.animation = '';
    }, 400);
  }
}

function createStaticPiece(letter, type) {
  const p = document.createElement('div');
  p.className = 'letter-piece snapped';
  p.dataset.type = type;
  p.textContent = letter;
  return p;
}

// --- CHECK SYLLABLE / WORD COMPLETION ---
function checkSyllableCompletion(block) {
  const slots = block.querySelectorAll('.letter-slot');
  const allFilled = Array.from(slots).every(s => s.classList.contains('filled'));
  
  if (allFilled && block.dataset.completed === "false") {
    block.dataset.completed = "true";
    block.classList.add('completed');
    
    // Speak this single syllable!
    const syllableChar = block.dataset.syllableChar;
    speakText(syllableChar);
    
    // Check if ALL syllables in the word are completed
    const allBlocks = elements.syllableContainer.querySelectorAll('.syllable-block');
    const wordCompleted = Array.from(allBlocks).every(b => b.dataset.completed === "true");
    
    if (wordCompleted) {
      handleWordCompleted();
    }
  }
}

function handleWordCompleted() {
  const words = VOCAB_DATABASE[state.currentCategory];
  const currentItem = words[state.currentIndex];
  
  // Increment score
  state.score += 100;
  updateScoreDisplay();
  
  // Add to completed list
  if (!state.completedWords.includes(currentItem.word)) {
    state.completedWords.push(currentItem.word);
    localStorage.setItem('pocha_completed', JSON.stringify(state.completedWords));
  }
  
  // Play clear chimes
  synth.playClear();
  
  // Change customer dialog and trigger animation
  elements.customerBubble.textContent = currentItem.customerSuccess;
  const avatar = elements.customerAvatar.firstElementChild;
  if (avatar) {
    avatar.classList.add('bounce');
    avatar.classList.add('eating');
  }
  
  // Show toast notification
  showToast(`調理完了！: ${currentItem.word} (${currentItem.meaning})`);
  
  // Flash effect on arena
  elements.syllableContainer.style.filter = 'drop-shadow(0 0 15px var(--neon-green))';
  setTimeout(() => {
    elements.syllableContainer.style.filter = '';
  }, 800);
  
  // TTS reads full word after a small delay
  setTimeout(() => {
    speakText(currentItem.word);
  }, 400);

  // Automatically move to next word after customer finishes "chewing" (3 seconds)
  setTimeout(() => {
    if (avatar) {
      avatar.classList.remove('bounce');
      avatar.classList.remove('eating');
    }
    nextWord();
  }, 4000);
}

function nextWord() {
  state.currentIndex++;
  loadWord();
}

function updateScoreDisplay() {
  elements.statScore.textContent = String(state.score).padStart(4, '0');
  localStorage.setItem('pocha_score', state.score);
}

function showToast(msg) {
  elements.toastNotify.textContent = msg;
  elements.toastNotify.classList.add('show');
  setTimeout(() => {
    elements.toastNotify.classList.remove('show');
  }, 2500);
}

// --- RECIPE BOOK (VOCAB DRAWER) ---
function openRecipeBook() {
  synth.playSnap();
  elements.recipeOverlay.classList.add('active');
  elements.recipeDrawer.classList.add('active');
  
  // Populate drawer
  elements.recipeContent.innerHTML = '';
  
  let totalWords = 0;
  let unlockedWords = 0;

  for (const [catName, list] of Object.entries(VOCAB_DATABASE)) {
    // Header for category
    const catHeader = document.createElement('h4');
    catHeader.style.color = 'var(--neon-cyan)';
    catHeader.style.marginTop = '1rem';
    catHeader.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    catHeader.style.paddingBottom = '0.3rem';
    catHeader.style.textTransform = 'uppercase';
    catHeader.style.fontSize = '0.8rem';
    catHeader.style.letterSpacing = '1.5px';
    
    let label = 'お食事・ドリンク';
    if (catName === 'travel') label = '旅行・移動';
    if (catName === 'daily') label = '日常の挨拶';
    if (catName === 'culture') label = '韓流・エンタメ';
    
    catHeader.textContent = label;
    elements.recipeContent.appendChild(catHeader);

    list.forEach(item => {
      totalWords++;
      const isUnlocked = state.completedWords.includes(item.word);
      if (isUnlocked) unlockedWords++;

      const card = document.createElement('div');
      card.className = `vocab-card ${isUnlocked ? '' : 'locked'}`;

      if (isUnlocked) {
        card.innerHTML = `
          <div class="vocab-card-kr">${item.word}</div>
          <div class="vocab-card-details">
            <span class="vocab-card-jp">${item.meaning}</span>
            <span class="vocab-card-romaji">${item.romanization.split(' / ')[0]}</span>
            <span class="vocab-card-example">${item.description}</span>
          </div>
          <button class="vocab-card-audio" title="発音を聞く">🔊</button>
        `;
        
        // Audio button click listener
        card.querySelector('.vocab-card-audio').addEventListener('click', (e) => {
          e.stopPropagation();
          synth.playSnap();
          speakText(item.word);
        });
      } else {
        card.innerHTML = `
          <div class="vocab-card-kr">？？</div>
          <div class="vocab-card-details">
            <span class="vocab-card-jp" style="color: rgba(255,255,255,0.3)">未開放のレシピ</span>
            <span class="vocab-card-romaji">PLAY TO UNLOCK</span>
          </div>
        `;
      }

      elements.recipeContent.appendChild(card);
    });
  }

  // Set title to include unlocked ratio
  elements.recipeDrawer.querySelector('.drawer-title').textContent = `📖 レシピ本 (${unlockedWords}/${totalWords})`;
}

function closeRecipeBook() {
  elements.recipeOverlay.classList.remove('active');
  elements.recipeDrawer.classList.remove('active');
}

// --- HANGUL SANDBOX (MODAL FREEPLAY) ---
let sandboxState = {
  choseong: null,
  jungseong: null,
  jongseong: null
};

function openSandbox() {
  synth.playSnap();
  elements.sandboxOverlay.classList.add('active');
  elements.sandboxModal.style.display = 'flex';
  // Wait a frame then apply active for transitions
  setTimeout(() => elements.sandboxModal.classList.add('active'), 50);
  
  resetSandboxSlots();
}

function closeSandbox() {
  elements.sandboxOverlay.classList.remove('active');
  elements.sandboxModal.classList.remove('active');
  setTimeout(() => elements.sandboxModal.style.display = 'none', 300);
}

function resetSandboxSlots() {
  sandboxState = { choseong: null, jungseong: null, jongseong: null };
  
  const slots = elements.sandboxModal.querySelectorAll('.letter-slot');
  slots.forEach(slot => {
    slot.innerHTML = '';
    slot.classList.remove('filled');
  });
  
  updateSandboxResult();
}

function buildSandboxPalette() {
  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'];
  const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const batchim = ['ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const conRow = document.getElementById('sandbox-consonants-row');
  const vowRow = document.getElementById('sandbox-vowels-row');
  const batRow = document.getElementById('sandbox-batchim-row');

  // Clear
  conRow.innerHTML = '';
  vowRow.innerHTML = '';
  batRow.innerHTML = '';

  const addPalettePiece = (char, row, type, idPrefix) => {
    const piece = document.createElement('div');
    piece.className = 'letter-piece';
    piece.textContent = char;
    piece.draggable = true;
    piece.dataset.type = type;
    piece.dataset.letter = char;
    piece.dataset.id = `${idPrefix}-${char}`;

    piece.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: piece.dataset.id,
        letter: piece.dataset.letter,
        type: piece.dataset.type,
        isSandboxPalette: true
      }));
    });

    piece.addEventListener('click', () => {
      // Tap to place fallback in sandbox:
      // Simply find the first empty matching slot and put it in
      let targetSlotName = '';
      if (type === 'consonant') {
        if (idPrefix === 'bat') {
          targetSlotName = 'jongseong';
        } else {
          targetSlotName = 'choseong';
        }
      } else {
        targetSlotName = 'jungseong';
      }

      const slot = elements.sandboxModal.querySelector(`.letter-slot[data-slot="${targetSlotName}"]`);
      if (slot) {
        placeInSandboxSlot(char, type, slot);
      }
    });

    row.appendChild(piece);
  };

  consonants.forEach(c => addPalettePiece(c, conRow, 'consonant', 'con'));
  vowels.forEach(v => addPalettePiece(v, vowRow, 'vowel', 'vow'));
  batchim.forEach(b => addPalettePiece(b, batRow, 'consonant', 'bat'));
}

function setupSandboxDropTargets() {
  const slots = elements.sandboxModal.querySelectorAll('.letter-slot');
  
  slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');

      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        // Validate type matches slot type
        if (data.type !== slot.dataset.type) {
          synth.playError();
          return;
        }

        placeInSandboxSlot(data.letter, data.type, slot);
      } catch(err) {
        console.error(err);
      }
    });
  });
}

function placeInSandboxSlot(letter, type, slot) {
  synth.playSnap();
  
  slot.classList.add('filled');
  slot.innerHTML = '';
  
  const piece = createStaticPiece(letter, type);
  // Allow clicking the slot to clear/remove it
  piece.style.cursor = 'pointer';
  piece.style.pointerEvents = 'auto';
  piece.addEventListener('click', (e) => {
    e.stopPropagation();
    synth.playSnap();
    slot.innerHTML = '';
    slot.classList.remove('filled');
    
    // Clear state
    const slotName = slot.dataset.slot;
    sandboxState[slotName] = null;
    updateSandboxResult();
  });

  slot.appendChild(piece);

  // Update sandbox state
  const slotName = slot.dataset.slot;
  sandboxState[slotName] = letter;

  updateSandboxResult();
}

// Math Formula to combine Choseong, Jungseong, Jongseong into Unicode syllable
function composeHangul(cho, jung, jong) {
  const CHOSEONG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const JUNGSEONG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const JONGSEONG_LIST = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const choIdx = CHOSEONG_LIST.indexOf(cho);
  const jungIdx = JUNGSEONG_LIST.indexOf(jung);
  const jongIdx = jong ? JONGSEONG_LIST.indexOf(jong) : 0;

  if (choIdx === -1 || jungIdx === -1) {
    return null;
  }

  const code = 0xAC00 + (choIdx * 21 * 28) + (jungIdx * 28) + jongIdx;
  return String.fromCharCode(code);
}

// Approximated Romaji reading mapping for combined sandbox chars
function getRomajiReading(cho, jung, jong) {
  const choRead = {
    'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt', 'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's', 'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h'
  };
  const jungRead = {
    'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo', 'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa', 'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i'
  };
  const jongRead = {
    '': '', 'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n', 'ㄵ': 'n', 'ㄶ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'lk', 'ㄻ': 'm', 'ㄼ': 'p', 'ㄽ': 'l', 'ㄾ': 't', 'ㄿ': 'p', 'ㅀ': 'l', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't', 'ㅆ': 't', 'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't'
  };

  const c = choRead[cho] !== undefined ? choRead[cho] : '';
  const v = jungRead[jung] !== undefined ? jungRead[jung] : '';
  const f = jong ? (jongRead[jong] !== undefined ? jongRead[jong] : '') : '';

  // Capitalize first letter
  const reading = c + v + f;
  return reading ? reading.charAt(0).toUpperCase() + reading.slice(1) : '';
}

function updateSandboxResult() {
  const cho = sandboxState.choseong;
  const jung = sandboxState.jungseong;
  const jong = sandboxState.jongseong;

  if (cho && jung) {
    const combined = composeHangul(cho, jung, jong);
    if (combined) {
      elements.sandboxResultChar.textContent = combined;
      const reading = getRomajiReading(cho, jung, jong);
      elements.sandboxResultSound.textContent = reading ? `${reading}` : '読込中...';
      
      // Auto voice speak
      speakText(combined);
    } else {
      elements.sandboxResultChar.textContent = '-';
      elements.sandboxResultSound.textContent = 'エラー';
    }
  } else {
    // Missing core ingredients
    elements.sandboxResultChar.textContent = '-';
    let hintText = '文字を配置してね';
    if (!cho && jung) hintText = '子音（左/上）が必要です';
    if (cho && !jung) hintText = '母音（右/下）が必要です';
    elements.sandboxResultSound.textContent = hintText;
  }
}

// Start application
window.addEventListener('DOMContentLoaded', init);
