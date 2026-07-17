import AppKit
import SwiftUI

/// ポムとマフィンを画面隅に常時浮かべておくための、操作不能(クリックすり抜け)の
/// ボーダーレスウィンドウ。Dockアイコン・メニューバーアイコンは出さない。
@MainActor
final class OverlayWindowController {
    private var window: NSWindow?
    private let size = CGSize(width: 150, height: 150)

    func show(state: AppState) {
        let hosting = NSHostingView(rootView: CompanionOverlayView(state: state))
        hosting.frame = CGRect(origin: .zero, size: size)

        let window = NSWindow(
            contentRect: CGRect(origin: .zero, size: size),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        window.contentView = hosting
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = false
        window.level = .floating
        window.ignoresMouseEvents = true
        window.collectionBehavior = [.canJoinAllSpaces, .stationary, .fullScreenAuxiliary]

        positionBottomRight(window)
        window.orderFrontRegardless()
        self.window = window
    }

    private func positionBottomRight(_ window: NSWindow) {
        guard let screen = NSScreen.main else { return }
        let margin: CGFloat = 16
        let frame = screen.visibleFrame
        let origin = CGPoint(x: frame.maxX - size.width - margin, y: frame.minY + margin)
        window.setFrameOrigin(origin)
    }
}
