/**
 * diff.js — 두 PNG 이미지를 픽셀 단위로 비교한다.
 * 사용법: node diff.js <원본png> <결과png> <diff출력png> [기준치%=1]
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

function main() {
  const [, , originalPath, actualPath, diffOutPath, thresholdArg] = process.argv;
  if (!originalPath || !actualPath || !diffOutPath) {
    console.error('사용법: node diff.js <원본png> <결과png> <diff출력png> [기준치%=1]');
    process.exit(1);
  }
  const threshold = thresholdArg ? parseFloat(thresholdArg) : 1;

  const img1 = PNG.sync.read(fs.readFileSync(path.resolve(originalPath)));
  const img2 = PNG.sync.read(fs.readFileSync(path.resolve(actualPath)));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    console.warn(`⚠ 이미지 크기가 다릅니다 — 원본: ${img1.width}x${img1.height}, 결과: ${img2.width}x${img2.height}`);
  }

  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    cropToSize(img1, width, height),
    cropToSize(img2, width, height),
    diff.data, width, height,
    { threshold: 0.1, diffColor: [255, 0, 0] }
  );

  fs.mkdirSync(path.dirname(path.resolve(diffOutPath)), { recursive: true });
  fs.writeFileSync(path.resolve(diffOutPath), PNG.sync.write(diff));

  const totalPixels = width * height;
  const mismatchPercent = (mismatchedPixels / totalPixels) * 100;
  const pass = mismatchPercent <= threshold;

  console.log(`전체 픽셀: ${totalPixels}`);
  console.log(`불일치 픽셀: ${mismatchedPixels}`);
  console.log(`불일치 비율: ${mismatchPercent.toFixed(3)}%`);
  console.log(`기준치: ${threshold}%`);
  console.log(`판정: ${pass ? 'PASS' : 'FAIL'}`);
  console.log(`diff 이미지 저장됨: ${diffOutPath}`);
  process.exit(pass ? 0 : 1);
}

function cropToSize(png, width, height) {
  if (png.width === width && png.height === height) return png.data;
  const cropped = new PNG({ width, height });
  PNG.bitblt(png, cropped, 0, 0, width, height, 0, 0);
  return cropped.data;
}

main();
