import SwiftUI
import AppKit
import Combine

@main
struct PomuMenuBarApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        Settings {
            EmptyView()
        }
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private let state = AppState()
    private let popover = NSPopover()
    private var statusItem: NSStatusItem?
    private var moodCancellable: AnyCancellable?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)

        let item = NSStatusBar.system.statusItem(withLength: 28)
        statusItem = item

        if let button = item.button {
            button.image = MenuBarPomuImage.make(mood: state.mood)
            button.imagePosition = .imageOnly
            button.target = self
            button.action = #selector(togglePopover(_:))
            button.toolTip = "ポム & マフィン"
            button.setAccessibilityLabel("ポム \(state.mood.label)")
        }

        popover.behavior = .transient
        popover.animates = true
        popover.contentSize = NSSize(width: 320, height: 560)
        popover.contentViewController = NSHostingController(rootView: MenuBarPopoverView(state: state))

        moodCancellable = state.$mood
            .receive(on: RunLoop.main)
            .sink { [weak self] mood in
                self?.statusItem?.button?.image = MenuBarPomuImage.make(mood: mood)
                self?.statusItem?.button?.setAccessibilityLabel("ポム \(mood.label)")
            }

        if CommandLine.arguments.contains("--show") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { [weak self, weak button = item.button] in
                guard let self, let button else { return }
                self.showPopover(relativeTo: button)
            }
        }
    }

    @objc private func togglePopover(_ sender: NSStatusBarButton) {
        if popover.isShown {
            popover.performClose(sender)
        } else {
            showPopover(relativeTo: sender)
        }
    }

    private func showPopover(relativeTo button: NSStatusBarButton) {
        popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        popover.contentViewController?.view.window?.makeKey()
    }
}
