import SwiftUI

/// 0 = 透明。1以上は palette のキーに対応する色。
typealias PixelGrid = [[Int]]

/// 汎用ドット絵レンダラー。指定パレットで grid を敷き詰め、
/// 塗りセルに隣接する透明セルへ自動で1ピクセルのアウトラインを引く。
struct PixelGridView: View {
    let grid: PixelGrid
    let palette: [Int: Color]
    let pixelSize: CGFloat
    var outlineColor: Color = Palette.outline

    private var rows: Int { grid.count }
    private var cols: Int { grid.first?.count ?? 0 }

    var body: some View {
        Canvas { context, _ in
            for r in 0..<rows {
                for c in 0..<cols where grid[r][c] == 0 && isAdjacentToFill(r, c) {
                    context.fill(cellPath(r, c), with: .color(outlineColor))
                }
            }
            for r in 0..<rows {
                for c in 0..<cols {
                    let v = grid[r][c]
                    guard v != 0, let color = palette[v] else { continue }
                    context.fill(cellPath(r, c), with: .color(color))
                }
            }
        }
        .frame(width: CGFloat(cols) * pixelSize, height: CGFloat(rows) * pixelSize)
    }

    private func cellPath(_ r: Int, _ c: Int) -> Path {
        Path(CGRect(x: CGFloat(c) * pixelSize, y: CGFloat(r) * pixelSize, width: pixelSize, height: pixelSize))
    }

    private func isAdjacentToFill(_ r: Int, _ c: Int) -> Bool {
        let neighbors = [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]
        for (nr, nc) in neighbors where nr >= 0 && nr < rows && nc >= 0 && nc < cols {
            if grid[nr][nc] != 0 { return true }
        }
        return false
    }
}
