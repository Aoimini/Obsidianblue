import SwiftUI

/// ポムの相棒マフィン。ポムのダンスに合わせて跳ねる。
struct MuffinSpriteView: View {
    let mood: PomuMood
    var pixelSize: CGFloat = 2.6

    @State private var hop = false

    private let palette: [Int: Color] = [
        1: Palette.milk,
        2: Palette.caramel,
        3: Palette.milkShadow,
        4: Palette.outline
    ]

    var body: some View {
        PixelGridView(grid: CompanionSprites.muffinGrid(mood: mood), palette: palette, pixelSize: pixelSize)
            .offset(y: hop ? -3 : 0)
            .animation(
                isHopping
                    ? .easeInOut(duration: 0.42).repeatForever(autoreverses: true)
                    : .easeInOut(duration: 0.3),
                value: hop
            )
            .onAppear { hop = isHopping }
            .onChange(of: isHopping) { hop = $0 }
    }

    private var isHopping: Bool { mood == .looping || mood == .stuck }
}
