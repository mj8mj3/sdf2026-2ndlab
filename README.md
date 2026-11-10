# 2nd LAB — SDF 2026 웹사이트 (프로토타입)

메인 1쪽 + 1~5조 영상 페이지 5쪽, 원뎁스 구조.

## 내용 바꾸기
1. `teams.json`을 엽니다.
   - `site.intro`: 메인 소개 글(줄 단위)
   - `teams[n].title / summary / body / members`: 조별 제목·소개·참여자
   - `teams[n].video`: 메인 영상 주소 (16:9). 유튜브 링크, 비메오 링크, 또는 `videos/1.mp4` 같은 파일 경로
   - `teams[n].brandFilm`: 브랜드 필름 주소 (4:3, 가로). 형식은 video와 같음
   - 조 로고: `assets/teams/1.svg` ~ `5.svg` 로 넣으면 메인 조 버튼에 들어감 (없으면 회색 빈 자리)
2. 이 폴더에서 `node build.js`를 실행하면 `index.html`과 `1/`~`5/` 페이지가 다시 만들어집니다.

## 조작
- 메인에서 숫자 키 1~5 → 해당 조로 이동
- 조 페이지에서 ← → 이전·다음 조, Esc 처음으로

## 서체·색
Noto Sans KR · JetBrains Mono / 키컬러 — 배경 #FCFCFC · 글자 #101010 · 면 #F0EEE9(Cloud Dancer) · 포인트 #C4B6A0
