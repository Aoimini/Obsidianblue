import SwiftUI

/// 画面隅に常駐させるオーバーレイの中身。ふきだし+ポム+マフィンだけの、操作不要な見守り表示。
struct CompanionOverlayView: View {
    @ObservedObject var state: AppState

    var body: some View {
        VStack(alignment: .trailing, spacing: 4) {
            if state.showBubble {
                bubble
                    .transition(.opacity.combined(with: .scale(scale: 0.9, anchor: .bottom)))
            }
            HStack(alignment: .bottom, spacing: -6) {
                PomuSpriteView(mood: state.mood)
                MuffinSpriteView(mood: state.mood)
                    .offset(y: 8)
            }
        }
        .animation(.easeOut(duration: 0.25), value: state.showBubble)
        .padding(10)
    }

    private var bubble: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(state.pomuLine)
                .font(.system(size: 11, weight: .heavy))
            Text("マフィン: \(state.muffinLine)")
                .font(.system(size: 9, weight: .bold))
                .foregroundStyle(.secondary)
        }
        .fixedSize(horizontal: false, vertical: true)
        .padding(8)
        .frame(maxWidth: 150, alignment: .leading)
        .background(Palette.bubble)
        .overlay(RoundedRectangle(cornerRadius: 2).stroke(Palette.outline, lineWidth: 2))
    }
}
