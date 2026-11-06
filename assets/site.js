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
