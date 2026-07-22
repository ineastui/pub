# pub 픽셀 비교 검증 도구

`pub` 스킬이 생성한 결과와 피그마 원본을 실제 픽셀 단위로 비교하기 위한 도구입니다.

## 최초 설치 (한 번만)

이 `scripts` 폴더에서:

```bash
npm install
```

`postinstall`로 Playwright의 Chromium이 자동으로 같이 설치됩니다. 시간이 좀 걸릴 수 있습니다.

## 사용법

### 1. 생성된 HTML을 스크린샷으로 찍기

```bash
node capture.js <html파일경로> <출력png경로> [너비] [높이]
```

예시:
```bash
node capture.js ../../html/web1/mypage.html shots/mypage-actual.png 1200 800
```

모바일 사이즈로 찍으려면:
```bash
node capture.js ../../html/web1/mypage.html shots/mypage-actual-mobile.png 375 800
```

### 2. 피그마 원본 스크린샷 준비

Figma 도구(`get_design_context`)로 받은 스크린샷을 같은 크기로 저장해둡니다 (예: `shots/figma-mypage.png`).

### 3. 두 이미지 비교

```bash
node diff.js shots/figma-mypage.png shots/mypage-actual.png shots/mypage-diff.png
```

기준치(허용 오차)를 조정하려면 4번째 인자로 퍼센트를 줍니다 (기본 1%):
```bash
node diff.js shots/figma-mypage.png shots/mypage-actual.png shots/mypage-diff.png 0.5
```

### 결과 읽는 법

- **불일치 비율(%)**: 전체 픽셀 중 다른 픽셀의 비율. 낮을수록 원본과 가까움.
- **판정(PASS/FAIL)**: 기준치 이내면 PASS.
- **diff 이미지**: 다른 부분이 빨간색으로 표시됨 — 어디가 다른지 시각적으로 바로 확인 가능.
- 두 이미지 크기가 다르면 경고가 뜹니다 — 레이아웃/뷰포트 설정이 잘못됐을 가능성이 높다는 신호입니다.

## pub 스킬에서의 사용 흐름

`figma-review-agent`가 이 스크립트들을 호출해서:
1. 생성 결과를 캡처하고
2. 피그마 원본과 비교하고
3. FAIL이면 diff 이미지의 빨간 영역 좌표를 근거로 구체적인 수정 지시를 만들고
4. 수정 후 다시 캡처 → 비교를 반복 (최대 3~4회)

자세한 내용은 `../SKILL.md`의 "생성 후 자기 점검" 섹션을 참고하세요.
