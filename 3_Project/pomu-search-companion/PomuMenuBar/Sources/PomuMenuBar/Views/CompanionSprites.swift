import Foundation

/// ポムとマフィンのドット絵を手続き的に生成する。
/// 「もっちり丸い輪郭+耳+頭のプリン」を、なめらかな曲線式(スーパー楕円)で
/// 敷き詰めることで、少ない手打ちデータで一貫した高精細シルエットを作る。
enum CompanionSprites {
    // Pom palette: 1=cream, 2=creamShadow, 3=puddingBody, 4=puddingCaramel, 5=cheek, 6=outline(顔パーツ)
    static func pomGrid(mood: PomuMood) -> PixelGrid {
        let cols = 22, rows = 24
        var g = emptyGrid(cols: cols, rows: rows)
        let cx = Double(cols) / 2
        let cy = 16.0

        fillEllipse(&g, cx: cx - 6.9, cy: 8.4, rx: 2.3, ry: 2.7, value: 1)
        fillEllipse(&g, cx: cx + 6.9, cy: 8.4, rx: 2.3, ry: 2.7, value: 1)
        fillBlob(&g, cx: cx, cy: cy, rx: 8.3, ry: 7.6, power: 3.4, value: 1, top: 9)

        // 陰(右下)
        for r in 0..<rows {
            for c in 0..<cols where g[r][c] == 1 {
                let dx = Double(c) - cx
                let dy = Double(r) - cy
                if dx > 1.5 && dy > 0 { g[r][c] = 2 }
            }
        }

        // 頭のプリン(台形カップ+カラメルの雫)
        fillTrapezoid(&g, topY: 0, bottomY: 5, topLeft: cx - 5.0, topRight: cx + 5.0, bottomLeft: cx - 2.8, bottomRight: cx + 2.8, value: 3)
        setIfInBounds(&g, row: 4, col: Int(cx) - 2, value: 4)
        setIfInBounds(&g, row: 4, col: Int(cx), value: 4)
        setIfInBounds(&g, row: 4, col: Int(cx) + 2, value: 4)
        setIfInBounds(&g, row: 5, col: Int(cx) - 2, value: 4)
        setIfInBounds(&g, row: 5, col: Int(cx) + 2, value: 4)

        // ほっぺ
        for dx in [-5.0, 5.0] {
            let cr = Int(cy + 1.0), cc = Int(cx + dx)
            if g[cr][cc] != 0 { g[cr][cc] = 5 }
        }

        applyPomFace(&g, mood: mood, cx: cx, cy: cy)
        return g
    }

    // Muffin palette: 1=milk, 2=caramel, 3=milkShadow, 4=outline(顔パーツ)
    static func muffinGrid(mood: PomuMood) -> PixelGrid {
        let cols = 16, rows = 18
        var g = emptyGrid(cols: cols, rows: rows)
        let cx = Double(cols) / 2
        let cy = 12.0

        fillEllipse(&g, cx: cx - 4.6, cy: 6.0, rx: 1.7, ry: 2.0, value: 1)
        fillEllipse(&g, cx: cx + 4.6, cy: 6.0, rx: 1.7, ry: 2.0, value: 1)
        fillBlob(&g, cx: cx, cy: cy, rx: 5.8, ry: 5.2, power: 3.4, value: 1, top: 7)

        fillEllipse(&g, cx: cx + 2.6, cy: cy - 3.6, rx: 2.6, ry: 2.0, value: 2)

        for r in 0..<rows {
            for c in 0..<cols where g[r][c] == 1 {
                let dx = Double(c) - cx
                let dy = Double(r) - cy
                if dx > 1.0 && dy > 0.5 { g[r][c] = 3 }
            }
        }

        applyMuffinFace(&g, mood: mood, cx: cx, cy: cy)
        return g
    }

    private static func applyPomFace(_ g: inout PixelGrid, mood: PomuMood, cx: Double, cy: Double) {
        let closed = mood == .resting || mood == .stuck
        for dx in [-2.6, 2.6] {
            let c = Int(cx + dx)
            if closed {
                setIfInBounds(&g, row: Int(cy), col: c, value: 6)
            } else {
                setIfInBounds(&g, row: Int(cy) - 1, col: c, value: 6)
                setIfInBounds(&g, row: Int(cy), col: c, value: 6)
            }
        }
        let mouthRow = Int(cy) + 2
        setIfInBounds(&g, row: mouthRow, col: Int(cx) - 1, value: 6)
        setIfInBounds(&g, row: mouthRow, col: Int(cx), value: 6)
        setIfInBounds(&g, row: mouthRow, col: Int(cx) + 1, value: 6)
    }

    private static func applyMuffinFace(_ g: inout PixelGrid, mood: PomuMood, cx: Double, cy: Double) {
        let closed = mood == .resting || mood == .stuck
        for dx in [-1.8, 1.8] {
            let c = Int(cx + dx)
            setIfInBounds(&g, row: closed ? Int(cy) : Int(cy) - 1, col: c, value: 4)
        }
        setIfInBounds(&g, row: Int(cy) + 1, col: Int(cx) - 1, value: 4)
        setIfInBounds(&g, row: Int(cy) + 2, col: Int(cx), value: 4)
        setIfInBounds(&g, row: Int(cy) + 1, col: Int(cx) + 1, value: 4)
    }

    // MARK: - 描画プリミティブ

    private static func emptyGrid(cols: Int, rows: Int) -> PixelGrid {
        Array(repeating: Array(repeating: 0, count: cols), count: rows)
    }

    private static func fillBlob(_ g: inout PixelGrid, cx: Double, cy: Double, rx: Double, ry: Double, power: Double, value: Int, top: Int) {
        let rows = g.count, cols = g[0].count
        for r in top..<rows {
            for c in 0..<cols {
                let dx = (Double(c) + 0.5 - cx) / rx
                let dy = (Double(r) + 0.5 - cy) / ry
                if pow(abs(dx), power) + pow(abs(dy), power) <= 1.0 {
                    g[r][c] = value
                }
            }
        }
    }

    private static func fillEllipse(_ g: inout PixelGrid, cx: Double, cy: Double, rx: Double, ry: Double, value: Int) {
        let rows = g.count, cols = g[0].count
        for r in 0..<rows {
            for c in 0..<cols {
                let dx = (Double(c) + 0.5 - cx) / rx
                let dy = (Double(r) + 0.5 - cy) / ry
                if dx * dx + dy * dy <= 1.0 { g[r][c] = value }
            }
        }
    }

    private static func fillTrapezoid(_ g: inout PixelGrid, topY: Int, bottomY: Int, topLeft: Double, topRight: Double, bottomLeft: Double, bottomRight: Double, value: Int) {
        let cols = g[0].count
        guard bottomY > topY else { return }
        for r in topY..<bottomY {
            let t = Double(r - topY) / Double(bottomY - topY)
            let left = topLeft + (bottomLeft - topLeft) * t
            let right = topRight + (bottomRight - topRight) * t
            for c in 0..<cols {
                let cd = Double(c) + 0.5
                if cd >= left && cd <= right { g[r][c] = value }
            }
        }
    }

    private static func setIfInBounds(_ g: inout PixelGrid, row: Int, col: Int, value: Int) {
        guard row >= 0, row < g.count, col >= 0, col < g[0].count else { return }
        g[row][col] = value
    }
}

private func pow(_ base: Double, _ exp: Double) -> Double {
    Foundation.pow(base, exp)
}
