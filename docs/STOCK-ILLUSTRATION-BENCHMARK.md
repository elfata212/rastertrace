# Stock Illustration Benchmark

## Purpose

Use a commercially styled flat medical illustration as a regression benchmark for Vector Stock Factory. The benchmark is intended to balance vector simplicity against preservation of meaningful visual structure.

## Benchmark class

- Flat editorial/commercial illustration
- Multiple human figures
- Clothing folds and facial details
- Small medical and lifestyle objects
- Mixed large and small geometric shapes
- Limited but nontrivial color palette
- Complex connected decorative linework

## Primary quality target

The trace should preserve the visual identity and semantic structure of the source while avoiding path explosion from anti-aliasing and insignificant pixel fragments.

## Quality metrics

Evaluate each revision against the source using:

1. Path count
2. Small/tiny object count
3. Duplicate path count
4. Open path count
5. Embedded raster count
6. Visual fidelity of faces, hands, clothing, props, and connected linework
7. Clean edges at 100% and 200% preview
8. Commercial editability: coherent fills, minimal accidental fragments, and predictable grouped geometry

## Preset strategy

**Stock Clean** is optimized for lower path count and simpler flat artwork.

**Stock Illustration** is the fidelity-oriented profile for detailed commercial illustrations. Its current starting point is 12 colors, moderate speckle removal, moderate layer merging, spline tracing, path precision 2, segment length 3.5, spline splitting 35 degrees, 2x upscale, and light straightening.

**Network Illustration** remains a separate profile because node/branch assets have different simplification needs.

## Regression rule

A new tracing revision should not be accepted merely because path count decreases. Accept it only when the reduction does not materially damage meaningful subject details.

