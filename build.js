// 사용법: teams.json을 고친 뒤 이 폴더에서 `node build.js` → index.html, 1/~5/ 페이지가 다시 만들어집니다.
const fs = require("fs");
const path = require("path");
const D = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(D, "teams.json"), "utf8"));
const svg = (f) => fs.readFileSync(path.join(D, "assets", f), "utf8").trim();
const LOGO = (root) => `<img src="${root}assets/logo-2ndlab.png" alt="" width="948" height="239" decoding="async">`;
const DEPT = svg("logo-dc-h.svg"); // 가로형 디자인컨버전스 로고(아이콘 + 글자)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const T = data.teams;

const head = (title, desc, root) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FCFCFC">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://2ndlab.kr/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}assets/favicon.svg?v=4" type="image/svg+xml">
<link rel="stylesheet" href="${root}assets/fonts/fonts.css">
<link rel="stylesheet" href="${root}assets/site.css">
</head>`;

const foot = (root) => `<footer class="foot mono rv" style="--i:9">
  <span>${esc(data.site.footer)}</span>
</footer>
<script src="${root}assets/site.js" defer></script>
</body>
</html>
`;

// 조 로고: assets/teams/N.svg 가 있으면 그 로고, 없으면 빈 자리(회색 박스)
const teamLogo = (t) => {
  const f = path.join(D, "assets", "teams", t.no + ".svg");
  const sr = `<span class="sr">${t.no}조</span>`;
  if (!fs.existsSync(f)) return `<span class="lg ph" aria-hidden="true"></span>${sr}`;
  const s = fs.readFileSync(f, "utf8").replace(/<\?xml[^>]*>/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  // 시각적 면적 통일: 비율 4:1 로고를 기준으로, 넓은 로고는 줄이고 좁은 로고는 키움(--k = √(4/비율), 0.7~1.9배)
  const vb = (s.match(/viewBox="([^"]+)"/) || [])[1];
  const [, , w, h] = vb ? vb.split(/[\s,]+/).map(Number) : [0, 0, 4, 1];
  const k = Math.min(1.9, Math.max(0.7, Math.sqrt(4 / (w / h)))).toFixed(2);
  return `<span class="lg" style="--k:${k}" aria-hidden="true">${s}</span>${sr}`;
};

// ---- home ----
const home = `${head(data.site.title, data.site.intro.join(" "), "./")}
<body data-root="./">
<header class="top rv" style="--i:0">
  <h1 class="mark" aria-label="2nd LAB">${LOGO("./")}</h1>
  <div class="dept" role="img" aria-label="홍익대학교 디자인컨버전스학부">${DEPT}</div>
</header>
<main class="home">
  <p class="intro rv" style="--i:3">${data.site.intro.map((l) => `<span>${esc(l)}</span>`).join("")}</p>
  <nav class="teams rv" style="--i:4" aria-label="조 선택">
${T.map((t) => `    <a href="${t.no}/"><span class="no mono">${pad(t.no)}</span>${teamLogo(t)}${t.title ? `<span class="tt">${esc(t.title)}</span>` : ""}</a>`).join("\n")}
  </nav>
</main>
${foot("./")}`;
fs.writeFileSync(path.join(D, "index.html"), home);

// ---- team pages ----
for (const t of T) {
  const r = "../";
  const members = Object.entries(t.members || {}).map(([k, v]) => `<dt class="ko">${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  const page = `${head(`${t.no}조${t.title ? ` · ${t.title}` : ""} — 2nd LAB`, t.summary || data.site.intro.join(" "), r)}
<body data-root="${r}" data-team="${t.no}">
<header class="bar">
  <a class="back ko" href="${r}" aria-label="처음으로 돌아가기"><svg viewBox="0 0 28 14" aria-hidden="true"><path d="M27 7H1.5M7.5 1L1.5 7l6 6"/></svg></a>
  <a class="mark" href="${r}" aria-label="2nd LAB 처음으로">${LOGO(r)}</a>
  <span class="count mono"><b>${pad(t.no)}</b> / ${pad(T.length)}</span>
</header>
<main class="team">
  <div class="head">
    <p class="mono rv" style="--i:0">${pad(t.no)}</p>
    <h1 class="tlogo rv" style="--i:1">${teamLogo(t)}</h1>
${t.title ? `    <p class="title rv" style="--i:2">${esc(t.title)}</p>
` : ""}  </div>
  <figure class="film rv${t.poster ? " has-poster" : ""}" style="--i:3${t.poster ? `;background-image:url(${r}${esc(t.poster)})` : ""}" data-video="${esc(t.video || "")}" aria-label="${t.no}조 영상">
    <button class="play" type="button" disabled><span class="tri"></span><span class="lbl ko">메인 영상</span></button>
  </figure>
  <section class="about rv" style="--i:4">
    <figure class="film reel${t.brandPoster ? " has-poster" : ""}"${t.brandPoster ? ` style="background-image:url(${r}${esc(t.brandPoster)})"` : ""} data-video="${esc(t.brandFilm || "")}" aria-label="${t.no}조 브랜드 필름">
      <button class="play" type="button" disabled><span class="tri"></span><span class="lbl ko">브랜드 필름</span></button>
    </figure>
    <div class="text">${t.summary || t.body ? `${t.summary ? `<p class="lead">${esc(t.summary)}</p>` : ""}${t.body ? `<p class="body">${esc(t.body)}</p>` : ""}` : `<div class="tbox"><span class="ko">프로젝트 소개 텍스트</span></div>`}<dl>${members}</dl></div>
  </section>
  <nav class="switch rv" style="--i:5" aria-label="다른 프로젝트 보기">
    <span class="label ko">다른 프로젝트 보기</span>
    <ol>${T.map((o) => `<li><a href="${r}${o.no}/"${o.no === t.no ? ' aria-current="page"' : ""} aria-label="${o.no}조">${pad(o.no)}</a></li>`).join("")}</ol>
  </nav>
</main>
${foot(r)}`;
  fs.mkdirSync(path.join(D, String(t.no)), { recursive: true });
  fs.writeFileSync(path.join(D, String(t.no), "index.html"), page);
}

console.log("built: index.html + " + T.map((t) => t.no + "/").join(" "));
