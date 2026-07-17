import SwiftUI

// design-guideline.md の「カラーパレット」表と一致させる。
enum Palette {
    static let cream = Color(hex: 0xFFF2A8)
    static let creamShadow = Color(hex: 0xF6D96B)
    static let puddingBody = Color(hex: 0xFFE39A)
    static let puddingShadow = Color(hex: 0xF2C567)
    static let puddingCaramel = Color(hex: 0x8B5A2B)
    static let outline = Color(hex: 0x2A1B18)
    static let cheek = Color(hex: 0xF7B7A6)
    static let milk = Color(hex: 0xFFF9EF)
    static let milkShadow = Color(hex: 0xF0DFCE)
    static let caramel = Color(hex: 0xB7835C)
    static let bubble = Color(hex: 0xFFFDF6)
    static let bubbleLine = Color(hex: 0x4A332C)
    static let alert = Color(hex: 0xFFB45E)
}

extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
