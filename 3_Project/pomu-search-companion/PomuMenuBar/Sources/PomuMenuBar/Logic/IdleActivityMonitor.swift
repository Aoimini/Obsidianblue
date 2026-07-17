import Foundation
import CoreGraphics

/// マウス・キーボードの無操作時間を定期的に読み、
/// 「休憩を挟まず操作し続けている時間」を計測する。
/// CGEventSource.secondsSinceLastEventType はシステム全体の無操作秒数を返す
/// 読み取り専用APIで、アクセシビリティ権限は不要。
@MainActor
final class IdleActivityMonitor {
    /// (継続して操作し続けている秒数, 直近の無操作秒数)
    var onUpdate: ((TimeInterval, TimeInterval) -> Void)?

    private let pollInterval: TimeInterval
    private let restIdleThreshold: TimeInterval
    private var continuousActiveSeconds: TimeInterval = 0
    private var timer: Timer?

    init(pollInterval: TimeInterval = 2, restIdleThreshold: TimeInterval = 90) {
        self.pollInterval = pollInterval
        self.restIdleThreshold = restIdleThreshold
    }

    func start() {
        tick()
        let timer = Timer(timeInterval: pollInterval, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.tick() }
        }
        timer.tolerance = pollInterval * 0.2
        RunLoop.main.add(timer, forMode: .common)
        self.timer = timer
    }

    func stop() {
        timer?.invalidate()
        timer = nil
    }

    private func tick() {
        let idle = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: .null)
        if idle >= restIdleThreshold {
            continuousActiveSeconds = 0
        } else {
            continuousActiveSeconds += pollInterval
        }
        onUpdate?(continuousActiveSeconds, idle)
    }
}
