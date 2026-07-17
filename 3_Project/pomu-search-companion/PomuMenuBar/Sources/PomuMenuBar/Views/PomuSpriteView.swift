import SwiftUI

/// 常時デスクトップに浮かぶポム本体。moodに応じてぷりぷりダンス/ぽむぽむ点滅/休憩ポーズを切り替える。
struct PomuSpriteView: View {
    let mood: PomuMood
    var pixelSize: CGFloat = 2.6

    @State private var frame = 0
    @State private var breathe = false

    private let palette: [Int: Color] = [
        1: Palette.cream,
        2: Palette.creamShadow,
        3: Palette.puddingBody,
        4: Palette.puddingCaramel,
        5: Palette.cheek,
        6: Palette.outline
    ]

    private let danceFrames: [(dx: CGFloat, rotation: Double)] = [
        (0, 0), (-1, -4), (1, 4), (-1, -8), (1, 8), (0, 0)
    ]

    private let timer = Timer.publish(every: 0.12, on: .main, in: .common).autoconnect()

    var body: some View {
        let dance = isDancing ? danceFrames[frame] : (dx: CGFloat(0), rotation: 0.0)

        PixelGridView(grid: CompanionSprites.pomGrid(mood: mood), palette: palette, pixelSize: pixelSize)
            .offset(x: dance.dx, y: mood == .resting ? 2 : 0)
            .rotationEffect(.degrees(dance.rotation + (mood == .resting ? -6 : 0)), anchor: .init(x: 0.5, y: 0.9))
            .opacity(mood == .stuck && frame % 2 == 1 ? 0.55 : 1)
            .scaleEffect(breathe ? 1.02 : 0.98, anchor: .init(x: 0.5, y: 0.9))
            .animation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true), value: breathe)
            .onAppear { breathe = true }
            .onReceive(timer) { _ in
                guard isDancing else {
                    if frame != 0 { frame = 0 }
                    return
                }
                frame = (frame + 1) % danceFrames.count
            }
    }

    private var isDancing: Bool { mood == .looping || mood == .stuck }
}
