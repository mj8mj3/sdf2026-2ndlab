(() => {
  const body = document.body;
  const root = body.dataset.root || "./";
  const cur = Number(body.dataset.team || 0);

  // Keyboard: 1–5 jump, ←/→ prev/next, Esc back to main
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (/^[1-5]$/.test(e.key) && Number(e.key) !== cur) {
      location.href = root + e.key + "/";
    } else if (cur && e.key === "Escape") {
      location.href = root;
    } else if (cur && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const n = e.key === "ArrowRight" ? (cur % 5) + 1 : ((cur + 3) % 5) + 1;
      location.href = root + n + "/";
    }
  });

  // Video facade: load the player only when asked
  document.querySelectorAll(".film").forEach((film) => {
  const src = film.dataset.video || "";
  const btn = film.querySelector(".play");
  if (!src) return;
  btn.removeAttribute("disabled");
  btn.querySelector(".lbl").textContent = "재생";
  btn.addEventListener("click", () => {
    let el;
    const yt = src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || (/^[\w-]{11}$/.test(src) ? [0, src] : null);
    const vm = src.match(/vimeo\.com\/(\d+)/);
    if (yt) {
      el = document.createElement("iframe");
      el.src = "https://www.youtube-nocookie.com/embed/" + yt[1] + "?autoplay=1&rel=0&modestbranding=1";
      el.allow = "autoplay; fullscreen; picture-in-picture";
      el.allowFullscreen = true;
    } else if (vm) {
      el = document.createElement("iframe");
      el.src = "https://player.vimeo.com/video/" + vm[1] + "?autoplay=1&title=0&byline=0&portrait=0";
      el.allow = "autoplay; fullscreen; picture-in-picture";
      el.allowFullscreen = true;
    } else {
      el = document.createElement("video");
      el.src = src.startsWith("http") ? src : root + src;
      el.controls = true;
      el.playsInline = true;
      el.autoplay = true;
    }
    el.title = film.getAttribute("aria-label") || "영상";
    film.replaceChildren(el);
  }, { once: true });
  });
})();

// 폰: 메인 소개글 마지막 줄 오른쪽 빈 공간만큼 글상자를 좁혀 좌우 여백을 같게 늘림(줄 수는 그대로)
(() => {
  const p = document.querySelector(".home .intro");
  if (!p) return;
  const mq = matchMedia("(max-width: 720px)");
  const lines = () => {
    const r = document.createRange();
    r.selectNodeContents(p);
    return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
  };
  const fit = () => {
    p.style.width = "";
    p.style.marginInline = "";
    if (!mq.matches) return;
    const full = p.getBoundingClientRect().width;
    const n = lines();
    let lo = full * 0.6, hi = full;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      p.style.width = mid + "px";
      if (lines() > n) lo = mid; else hi = mid;
    }
    p.style.width = Math.ceil(hi) + "px";
    p.style.marginInline = "auto";
  };
  let t;
  const run = () => { clearTimeout(t); t = setTimeout(fit, 60); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener("resize", run);
})();
