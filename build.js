// 사용법: teams.json을 고친 뒤 이 폴더에서 `node build.js` → index.html, 1/~5/ 페이지가 다시 만들어집니다.
const fs = require("fs");
const path = require("path");
const D = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(D, "teams.json"), "utf8"));
const svg = (f) => fs.readFileSync(path.join(D, "assets", f), "utf8").trim();
const LOGO = svg("logo-2ndlab.svg");
const DEPT = svg("logo-hongik-dc.svg");
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
<meta name="theme-color" content="#FAFAFA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Noto+Sans+KR:wght@300;400;500&display=swap">
<link rel="stylesheet" href="${root}assets/site.css">
</head>`;

const foot = (root) => `<footer class="foot mono rv" style="--i:9">
  <span>${esc(data.site.footer)}</span>
  <span class="keys ko">${root === "./" ? "1–5 키로 이동" : "← → 이전·다음 &nbsp;·&nbsp; Esc 처음으로"}</span>
</footer>
<script src="${root}assets/site.js" defer></script>
</body>
</html>
`;

// ---- home ----
const home = `${head(data.site.title, data.site.intro.join(" "), "./")}
<body data-root="./">
<main class="home">
  <h1 class="mark rv" style="--i:0" aria-label="2nd LAB">${LOGO}</h1>
  <div class="dept rv" style="--i:2" role="img" aria-label="홍익대학교 디자인컨버전스학부">${DEPT}</div>
  <p class="intro rv" style="--i:3">${data.site.intro.map((l) => `<span>${esc(l)}</span>`).join("")}</p>
  <nav class="teams rv" style="--i:4" aria-label="조 선택">
${T.map((t) => `    <a href="${t.no}/"><span class="no mono">${pad(t.no)}</span><span class="nm">${t.no}조</span><span class="tt">${esc(t.title)}</span></a>`).join("\n")}
  </nav>
</main>
${foot("./")}`;
fs.writeFileSync(path.join(D, "index.html"), home);

// ---- team pages ----
for (const t of T) {
  const i = T.indexOf(t);
  const prev = T[(i + T.length - 1) % T.length];
  const next = T[(i + 1) % T.length];
  const r = "../";
  const members = Object.entries(t.members || {}).map(([k, v]) => `<dt class="ko">${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  const page = `${head(`${t.no}조 · ${t.title} — 2nd LAB`, t.summary, r)}
<body data-root="${r}" data-team="${t.no}">
<header class="bar">
  <a class="back ko" href="${r}" aria-label="처음으로 돌아가기"><i></i><span>처음으로</span></a>
  <a class="mark" href="${r}" aria-label="2nd LAB 처음으로">${LOGO}</a>
  <span class="count mono"><b>${pad(t.no)}</b> / ${pad(T.length)}</span>
</header>
<main class="team">
  <div class="head">
    <p class="mono rv" style="--i:0">Team ${pad(t.no)}</p>
    <h1 class="rv" style="--i:1">${t.no}조</h1>
    <p class="title rv" style="--i:2">${esc(t.title)}</p>
  </div>
  <figure class="film rv" style="--i:3" data-video="${esc(t.video || "")}" aria-label="${t.no}조 영상">
    <button class="play" type="button" disabled><span class="tri"></span><span class="lbl ko">영상 준비 중</span></button>
    <figcaption class="mono">${pad(t.no)} — Film</figcaption>
  </figure>
  <section class="about rv" style="--i:4">
    <div><p class="lead">${esc(t.summary)}</p><p class="body">${esc(t.body)}</p></div>
    <dl>${members}</dl>
  </section>
  <nav class="switch rv" style="--i:5" aria-label="다른 조 보기">
    <span class="label ko">다른 조 보기</span>
    <ol>${T.map((o) => `<li><a href="${r}${o.no}/"${o.no === t.no ? ' aria-current="page"' : ""} aria-label="${o.no}조">${pad(o.no)}</a></li>`).join("")}</ol>
  </nav>
  <nav class="pn rv" style="--i:6" aria-label="이전·다음 조">
    <a href="${r}${prev.no}/" rel="prev"><span class="ko">← 이전</span><span class="nm">${prev.no}조 · ${esc(prev.title)}</span></a>
    <a href="${r}${next.no}/" rel="next"><span class="ko">다음 →</span><span class="nm">${next.no}조 · ${esc(next.title)}</span></a>
  </nav>
</main>
${foot(r)}`;
  fs.mkdirSync(path.join(D, String(t.no)), { recursive: true });
  fs.writeFileSync(path.join(D, String(t.no), "index.html"), page);
}

// favicon = symbol "2" cropped from the logo viewBox is overkill; use a simple mark
fs.writeFileSync(path.join(D, "assets", "favicon.svg"), LOGO.replace(/viewBox="[^"]*"/, "viewBox=\"-32 -0 220 220\"").replace(/currentColor/g, "#232323"));
console.log("built: index.html + " + T.map((t) => t.no + "/").join(" "));
