/**
 * capture.js — 로컬 HTML 파일을 헤드리스 브라우저로 렌더링해서 스크린샷을 찍는다.
 * 사용법: node capture.js <html파일경로> <출력png경로> [너비] [높이|full]
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const [, , htmlPath, outPath, widthArg, heightArg] = process.argv;
  if (!htmlPath || !outPath) {
    console.error('사용법: node capture.js <html파일경로> <출력png경로> [너비] [높이|full]');
    process.exit(1);
  }
  const width = widthArg ? parseInt(widthArg, 10) : 1200;
  const fullPage = heightArg === 'full';
  const height = !fullPage && heightArg ? parseInt(heightArg, 10) : 800;

  const absHtmlPath = path.resolve(htmlPath);
  if (!fs.existsSync(absHtmlPath)) {
    console.error(`HTML 파일을 찾을 수 없습니다: ${absHtmlPath}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`file://${absHtmlPath}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.resolve(outPath), fullPage });
  await browser.close();
  console.log(`저장됨: ${outPath} (${width}x${fullPage ? 'full' : height})`);
}

main().catch((err) => {
  console.error('캡처 실패:', err.message);
  process.exit(1);
});
