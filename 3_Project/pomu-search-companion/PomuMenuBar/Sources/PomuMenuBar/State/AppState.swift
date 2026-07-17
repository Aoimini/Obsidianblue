import Foundation
import Combine

@MainActor
final class AppState: ObservableObject {
    @Published private(set) var mood: PomuMood = .idle
    @Published private(set) var pomuLine: String = Copy.pomuLine(for: .idle)
    @Published private(set) var muffinLine: String = Copy.muffinLine(for: .idle)
    @Published private(set) var showBubble: Bool = false
    @Published private(set) var continuousActiveSeconds: TimeInterval = 0
    @Published private(set) var idleSeconds: TimeInterval = 0

    private let monitor: IdleActivityMonitor
    private let restIdleThreshold: TimeInterval
    private var bubbleHideTimer: Timer?
    private var manualMoodUntil: Date?

    init(monitor: IdleActivityMonitor? = nil, restIdleThreshold: TimeInterval = 180) {
        let resolvedMonitor = monitor ?? IdleActivityMonitor(restIdleThreshold: restIdleThreshold)
        self.monitor = resolvedMonitor
        self.restIdleThreshold = restIdleThreshold
        resolvedMonitor.onUpdate = { [weak self] activeSeconds, idleSeconds in
            self?.handleUpdate(activeSeconds: activeSeconds, idleSeconds: idleSeconds)
        }
        resolvedMonitor.start()
    }

    private func handleUpdate(activeSeconds: TimeInterval, idleSeconds: TimeInterval) {
        self.continuousActiveSeconds = activeSeconds
        self.idleSeconds = idleSeconds

        if let manualMoodUntil, manualMoodUntil > Date() {
            return
        }
        manualMoodUntil = nil

        let newMood = MoodThresholds.mood(
            continuousActiveSeconds: activeSeconds,
            idleSeconds: idleSeconds,
            restIdleThreshold: restIdleThreshold
        )
        guard newMood != mood else { return }
        mood = newMood
        pomuLine = Copy.pomuLine(for: newMood)
        muffinLine = Copy.muffinLine(for: newMood)

        // 気づきが必要な状態のときだけ、ふきだしを一定時間出す。
        guard newMood == .searching || newMood == .looping || newMood == .stuck else {
            hideBubble()
            return
        }
        showBubbleTemporarily()
    }

    private func showBubbleTemporarily() {
        showBubble = true
        bubbleHideTimer?.invalidate()
        bubbleHideTimer = Timer.scheduledTimer(withTimeInterval: 8, repeats: false) { [weak self] _ in
            Task { @MainActor in self?.showBubble = false }
        }
    }

    private func hideBubble() {
        bubbleHideTimer?.invalidate()
        showBubble = false
    }

    func beginShortRest() {
        setManualMood(.resting, seconds: 10)
    }

    func previewMood(_ mood: PomuMood) {
        setManualMood(mood, seconds: 30)
    }

    func refreshLines() {
        pomuLine = Copy.pomuLine(for: mood)
        muffinLine = Copy.muffinLine(for: mood)
        if mood.priority >= PomuMood.searching.priority {
            showBubbleTemporarily()
        }
    }

    private func setManualMood(_ newMood: PomuMood, seconds: TimeInterval) {
        manualMoodUntil = Date().addingTimeInterval(seconds)
        mood = newMood
        pomuLine = Copy.pomuLine(for: newMood)
        muffinLine = Copy.muffinLine(for: newMood)
        if newMood.priority >= PomuMood.searching.priority {
            showBubbleTemporarily()
        } else {
            hideBubble()
        }
    }
}
