function numsFromPath(d) {
  return (d.match(/-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?/gi) || [])
    .map(Number)
    .filter(Number.isFinite);
}

function pathBox(d) {
  const n = numsFromPath(d);
  if (n.length < 2) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) {
    const x = n[i], y = n[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return Number.isFinite(minX) ? { minX, minY, maxX, maxY } : null;
}

function area(b) {
  return Math.max(0, b.maxX - b.minX) * Math.max(0, b.maxY - b.minY);
}

function normalizeD(d) {
  return d.replace(/\s+/g, " ").replace(/(-?\d+(?:\.\d+)?)/g, (_, n) => Number(n).toFixed(2)).trim();
}

export function analyzeStockVector(svgText = "") {
  if (!svgText || typeof DOMParser === "undefined") return null;
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  if (doc.querySelector("parsererror")) return null;

  const root = doc.documentElement;
  const paths = [...doc.querySelectorAll("path")];
  const embeddedRaster = doc.querySelectorAll("image").length;
  const viewBox = (root.getAttribute("viewBox") || "").trim().split(/[ ,]+/).map(Number);
  const viewArea = viewBox.length === 4 && viewBox.every(Number.isFinite)
    ? Math.abs(viewBox[2] * viewBox[3])
    : 1;

  const seen = new Map();
  let openPaths = 0;
  let tinyObjects = 0;
  let zeroGeometry = 0;
  let duplicatePaths = 0;

  for (const path of paths) {
    const d = (path.getAttribute("d") || "").trim();
    if (!/z\s*$/i.test(d)) openPaths++;
    if (!d) {
      zeroGeometry++;
      continue;
    }
    const box = pathBox(d);
    if (!box || area(box) === 0) {
      zeroGeometry++;
    } else if (area(box) <= viewArea * 0.00008) {
      tinyObjects++;
    }
    const key = normalizeD(d);
    const count = seen.get(key) || 0;
    if (count > 0) duplicatePaths++;
    seen.set(key, count + 1);
  }

  const pathScore = Math.max(0, 100 - Math.max(0, paths.length - 1500) * 0.06);
  const tinyScore = Math.max(0, 100 - (tinyObjects / Math.max(1, paths.length)) * 500);
  const duplicateScore = Math.max(0, 100 - (duplicatePaths / Math.max(1, paths.length)) * 600);
  const openScore = Math.max(0, 100 - (openPaths / Math.max(1, paths.length)) * 300);
  const rasterScore = embeddedRaster ? 0 : 100;
  const zeroScore = Math.max(0, 100 - (zeroGeometry / Math.max(1, paths.length)) * 500);

  const score = Math.round(
    pathScore * 0.38 +
    tinyScore * 0.20 +
    duplicateScore * 0.15 +
    openScore * 0.12 +
    rasterScore * 0.10 +
    zeroScore * 0.05
  );

  const level = score >= 85 ? "Stock Ready" : score >= 70 ? "Needs Cleanup" : "Heavy / Review";
  return { score, level, paths: paths.length, tinyObjects, openPaths, duplicatePaths, embeddedRaster, zeroGeometry };
}

export function updateStockQualityGate(svgText = "") {
  return analyzeStockVector(svgText);
}
