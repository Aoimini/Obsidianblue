import SwiftUI
import AppKit

/// MenuBarExtraのラベルではCanvasの描画が欠ける環境があるため、
/// 小さなピクセル絵をNSImageへ焼き込んで常駐アイコンにする。
struct MenuBarPomuIcon: View {
    let mood: PomuMood

    var body: some View {
        Image(nsImage: MenuBarPomuImage.make(mood: mood))
            .renderingMode(.original)
            .accessibilityLabel("ポム \(mood.label)")
    }
}

enum MenuBarPomuImage {
    private static let pixels: [[Int]] = [
        [0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1],
        [1, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0]
    ]

    static func make(mood: PomuMood) -> NSImage {
        let pixel: CGFloat = 2
        let size = NSSize(width: CGFloat(pixels[0].count) * pixel, height: CGFloat(pixels.count) * pixel)
        let image = NSImage(size: size, flipped: true) { _ in
            NSGraphicsContext.current?.imageInterpolation = .none

            for (row, values) in pixels.enumerated() {
                for (column, value) in values.enumerated() where value != 0 {
                    color(for: value).setFill()
                    NSBezierPath(rect: NSRect(
                        x: CGFloat(column) * pixel,
                        y: CGFloat(row) * pixel,
                        width: pixel,
                        height: pixel
                    )).fill()
                }
            }

            if mood.priority >= PomuMood.looping.priority {
                alertColor(for: mood).setFill()
                NSBezierPath(rect: NSRect(x: size.width - 4, y: 0, width: 4, height: 4)).fill()
            }
            return true
        }
        image.isTemplate = false
        return image
    }

    private static func color(for value: Int) -> NSColor {
        switch value {
        case 1: return NSColor(red: 1.00, green: 0.91, blue: 0.54, alpha: 1)
        case 2: return NSColor(red: 0.92, green: 0.76, blue: 0.34, alpha: 1)
        case 3: return NSColor(red: 0.45, green: 0.24, blue: 0.17, alpha: 1)
        default: return NSColor(red: 0.20, green: 0.14, blue: 0.12, alpha: 1)
        }
    }

    private static func alertColor(for mood: PomuMood) -> NSColor {
        mood == .stuck
            ? NSColor(red: 0.95, green: 0.42, blue: 0.48, alpha: 1)
            : NSColor(red: 0.97, green: 0.63, blue: 0.20, alpha: 1)
    }
}
