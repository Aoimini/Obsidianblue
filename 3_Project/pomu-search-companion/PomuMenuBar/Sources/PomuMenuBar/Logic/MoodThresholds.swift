import Foundation

/// design-guideline.md の「出現条件」を、無操作時間ベースの検知に合わせて定義しなおしたもの。
enum MoodThresholds {
    static let searching: TimeInterval = 10 * 60
    static let looping: TimeInterval = 20 * 60
    static let stuck: TimeInterval = 35 * 60

    static func mood(continuousActiveSeconds: TimeInterval, idleSeconds: TimeInterval, restIdleThreshold: TimeInterval) -> PomuMood {
        if idleSeconds >= restIdleThreshold { return .resting }
        switch continuousActiveSeconds {
        case ..<searching: return .idle
        case ..<looping: return .searching
        case ..<stuck: return .looping
        default: return .stuck
        }
    }
}
