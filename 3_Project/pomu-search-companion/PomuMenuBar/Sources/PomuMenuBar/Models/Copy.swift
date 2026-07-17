import Foundation

enum Copy {
    static let statusTitle: [PomuMood: String] = [
        .idle: "とくに変化なし",
        .searching: "調べもの中",
        .looping: "検索ループかも",
        .stuck: "だいぶ長く抜けられていないかも",
        .resting: "休憩中"
    ]

    static let pomuLines: [PomuMood: [String]] = [
        .idle: [
            "のんびりしてるぽむ",
            "きょうも、ぼちぼちいくぽむ"
        ],
        .searching: [
            "いま、安心さがし中かもぽむ",
            "ぼく、ちょっと出てきたぽむ",
            "安心さがし、がんばってるぽむ"
        ],
        .looping: [
            "いったんぷりっと休も",
            "同じところ、見てるかもぽむ",
            "急がなくていいぽむ",
            "あと1ページにするぽむ？",
            "もう1こ見る前に、ふわっとしよ"
        ],
        .stuck: [
            "今日は、もう十分がんばったぽむ",
            "むずかしいこと、しらんぷりん♪",
            "だいじょうぶ、今すぐ決めなくていいぽむ"
        ],
        .resting: [
            "いったんぷりっと休も",
            "ふわっと止まるぽむ",
            "手だけ、ちょっと止めてみるぽむ"
        ]
    ]

    static let muffinLines: [PomuMood: [String]] = [
        .idle: [
            "まったりでちゅ"
        ],
        .searching: [
            "同じところ、ぐるぐるしてるでちゅ",
            "考えても変わらないでちゅ"
        ],
        .looping: [
            "しんこきゅでちゅ",
            "頑張りすぎでちゅ〜",
            "同じ検索でちゅ",
            "おみずでちゅ"
        ],
        .stuck: [
            "寝る準備でちゅ",
            "いまは休憩がつよいでちゅ",
            "今日はここまででもいいでちゅ"
        ],
        .resting: [
            "目をぱちぱちするでちゅ",
            "おみず飲むでちゅ",
            "メモすると落ちつくでちゅ"
        ]
    ]

    static func pomuLine(for mood: PomuMood) -> String {
        pomuLines[mood]?.randomElement() ?? ""
    }

    static func muffinLine(for mood: PomuMood) -> String {
        muffinLines[mood]?.randomElement() ?? ""
    }
}
