// 年号
document.getElementById("year").textContent = new Date().getFullYear();

// トップへ
document.getElementById("btnToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// スクロール位置でナビをハイライト（ScrollSpy）
const navLinks = Array.from(document.querySelectorAll(".nav__link"));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const io = new IntersectionObserver((entries) => {
  // 画面に見えている中で一番上のやつをアクティブに
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach(a => a.classList.remove("is-active"));
  const active = navLinks.find(a => a.getAttribute("href") === `#${visible.target.id}`);
  if (active) active.classList.add("is-active");
}, { root: null, threshold: [0.25, 0.35, 0.5, 0.65] });

sections.forEach(sec => io.observe(sec));

// 彼氏の絵：降らせる（約5秒）
const rainBtn = document.getElementById("btnRain");
const rainLayer = document.getElementById("rainLayer");
const BF_IMG = "https://i.ibb.co/Mx9NTTDJ/IMG-3427.jpg";

let raining = false;

rainBtn.addEventListener("click", () => {
  if (raining) return;
  raining = true;

  const start = performance.now();
  const DURATION = 5000; // 5秒
  const spawnInterval = 120; // 生成間隔（ms）
  const maxDrops = 40; // 増やしすぎない（面接官PCでも重くしない）

  let spawned = 0;
  const timer = setInterval(() => {
    if (spawned >= maxDrops) return;
    spawnDrop();
    spawned++;
  }, spawnInterval);

  function spawnDrop(){
    const img = document.createElement("img");
    img.src = BF_IMG;
    img.alt = "";
    img.className = "rain__drop";

    // ランダム位置とサイズ（縮小中心：画質劣化しない）
    const size = rand(56, 96);         // px
    const left = rand(0, 100);         // vw
    const dur  = rand(2200, 4200);     // ms

    img.style.width = `${size}px`;
    img.style.left = `${left}vw`;
    img.style.animationDuration = `${dur}ms`;

    rainLayer.appendChild(img);

    // アニメ後に掃除
    setTimeout(() => img.remove(), dur + 200);
  }

  const raf = (t) => {
    if (t - start >= DURATION) {
      clearInterval(timer);
      // 少し待ってからフラグ解除
      setTimeout(() => { raining = false; }, 600);
      return;
    }
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
});

function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
