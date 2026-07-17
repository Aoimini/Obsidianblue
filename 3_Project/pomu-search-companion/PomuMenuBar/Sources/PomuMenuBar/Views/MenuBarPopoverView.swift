import SwiftUI

/// メニューバーアイコンをクリックしたときに開く、短い気づき用のポップオーバー。
struct MenuBarPopoverView: View {
    @ObservedObject var state: AppState

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            header

            HStack(alignment: .bottom, spacing: 10) {
                ZStack(alignment: .bottomTrailing) {
                    PomuSpriteView(mood: state.mood, pixelSize: 2.1)
                    MuffinSpriteView(mood: state.mood, pixelSize: 1.7)
                        .offset(x: 28, y: 8)
                }
                .frame(width: 96, height: 86)

                VStack(alignment: .leading, spacing: 6) {
                    speechBubble(text: state.pomuLine)
                    Text("マフィン: \(state.muffinLine)")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(.secondary)
                }
            }

            metrics
            actions
            statePreview
        }
        .padding(14)
        .frame(width: 320)
        .background(Color(hex: 0xFFFDF6))
    }

    private var header: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 3) {
                Text(Copy.statusTitle[state.mood] ?? state.mood.label)
                    .font(.system(size: 16, weight: .heavy))
                Text(statusSummary)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text(state.mood.label)
                .font(.system(size: 11, weight: .black))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(state.mood.badgeColor)
                .overlay(RoundedRectangle(cornerRadius: 3).stroke(Palette.outline, lineWidth: 1.5))
        }
    }

    private var metrics: some View {
        VStack(spacing: 6) {
            metricRow(label: "休憩なし", value: formatDuration(state.continuousActiveSeconds))
            metricRow(label: "無操作", value: formatDuration(state.idleSeconds))
        }
        .padding(10)
        .background(Color(hex: 0xFFF4C2))
        .overlay(RoundedRectangle(cornerRadius: 4).stroke(Palette.outline, lineWidth: 2))
    }

    private var actions: some View {
        HStack(spacing: 8) {
            Button("10秒休む") {
                state.beginShortRest()
            }
            Button("あと1ページ") {
                state.previewMood(.looping)
            }
            Button("言葉を変える") {
                state.refreshLines()
            }
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
    }

    private var statePreview: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("状態プレビュー")
                .font(.system(size: 11, weight: .heavy))
                .foregroundStyle(.secondary)

            HStack(spacing: 6) {
                ForEach(PomuMood.allCases, id: \.self) { mood in
                    Button(mood.shortLabel) {
                        state.previewMood(mood)
                    }
                    .buttonStyle(.borderless)
                    .font(.system(size: 10, weight: .bold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 4)
                    .background(mood == state.mood ? mood.badgeColor.opacity(0.72) : Color.clear)
                    .overlay(RoundedRectangle(cornerRadius: 3).stroke(Color.secondary.opacity(0.35), lineWidth: 1))
                }
            }
        }
    }

    private func speechBubble(text: String) -> some View {
        Text(text)
            .font(.system(size: 14, weight: .heavy))
            .lineLimit(3)
            .fixedSize(horizontal: false, vertical: true)
            .padding(9)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Palette.bubble)
            .overlay(RoundedRectangle(cornerRadius: 3).stroke(Palette.outline, lineWidth: 2))
    }

    private func metricRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 12, weight: .bold))
            Spacer()
            Text(value)
                .font(.system(size: 12, weight: .heavy).monospacedDigit())
        }
    }

    private var statusSummary: String {
        switch state.mood {
        case .idle:
            return "ポムは静かに見守り中"
        case .searching:
            return "調べものが続いているぽむ"
        case .looping:
            return "同じ安心さがしが増えてきたかも"
        case .stuck:
            return "長めに続いているので休憩候補"
        case .resting:
            return "いまは休憩を優先中"
        }
    }

    private func formatDuration(_ seconds: TimeInterval) -> String {
        let total = max(0, Int(seconds))
        let minutes = total / 60
        let seconds = total % 60
        if minutes == 0 {
            return "\(seconds)秒"
        }
        return "\(minutes)分\(seconds)秒"
    }
}

private extension PomuMood {
    var shortLabel: String {
        switch self {
        case .idle: return "Idle"
        case .searching: return "Search"
        case .looping: return "Loop"
        case .stuck: return "Stuck"
        case .resting: return "Rest"
        }
    }

    var badgeColor: Color {
        switch self {
        case .idle: return Palette.cream
        case .searching: return Color(hex: 0x9BD7BD)
        case .looping: return Palette.alert
        case .stuck: return Palette.cheek
        case .resting: return Color(hex: 0x8ECAE6)
        }
    }
}
