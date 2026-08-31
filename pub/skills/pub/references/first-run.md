# layout.css가 비어있는 첫 실행일 때

> 이 파일의 "규칙 N", "N번"은 `pub` 스킬 `SKILL.md`의 번호를 가리킨다.

프로젝트에 `layout.css`가 없거나 비어 있을 때만 읽는다.

## layout.css가 비어있는 첫 실행일 때

피그마에서 다음을 먼저 뽑아 `:root` 토큰으로 확정한다: 가장 많이 쓰이는 폰트 패밀리(`--font-family-base`), 자주 쓰이는 폰트 크기들(`--font-size-*`, 빈도 높은 걸 base로), 가장 흔한 line-height(`--line-height-base`), 자주 쓰이는 색상(`--color-*`). 이후 모든 컴포넌트는 이 변수만 참조한다.

회사 표준 브레이크포인트(태블릿 `max-width: 1295px`, 모바일 `max-width: 744px`)도 이 시점에 layout.css 상단에 주석으로 문서화해둔다: `/* 브레이크포인트: 태블릿 max-width 1295px, 모바일 max-width 744px (회사 표준, 프로젝트 전체 공통) */` — 실제 브레이크포인트 CSS 작성은 `pub-responsive`가 담당하지만, 토큰 문서화는 여기서 한다.

