// Local OCR via macOS Vision (no network, no API cost). Usage: swift ocr_image.swift <image_path>
// Prints recognized text lines (Japanese + English). Handles PNG/JPG/HEIC.
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else { FileHandle.standardError.write("usage: ocr_image.swift <path>\n".data(using: .utf8)!); exit(2) }
let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let img = NSImage(contentsOf: url),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("LOAD_FAIL"); exit(1) }

let req = VNRecognizeTextRequest { request, _ in
  for obs in (request.results as? [VNRecognizedTextObservation] ?? []) {
    if let s = obs.topCandidates(1).first?.string { print(s) }
  }
}
req.recognitionLevel = .accurate
req.recognitionLanguages = ["ja-JP", "en-US"]
req.usesLanguageCorrection = true
do { try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req]) }
catch { print("OCR_FAIL"); exit(1) }
