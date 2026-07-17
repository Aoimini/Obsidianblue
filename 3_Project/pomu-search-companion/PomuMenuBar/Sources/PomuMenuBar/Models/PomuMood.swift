import Foundation

enum PomuMood: String, CaseIterable, Codable {
    case idle
    case searching
    case looping
    case stuck
    case resting

    var label: String {
        switch self {
        case .idle: return "Idle"
        case .searching: return "Searching"
        case .looping: return "Looping"
        case .stuck: return "Stuck"
        case .resting: return "Resting"
        }
    }

    var priority: Int {
        switch self {
        case .idle: return 0
        case .resting: return 1
        case .searching: return 2
        case .looping: return 3
        case .stuck: return 4
        }
    }
}
