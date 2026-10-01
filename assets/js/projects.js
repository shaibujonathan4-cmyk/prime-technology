import { db } from "/assets/js/firebase-config.js";
import { collection, query, where, getDocs }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const grid = document.getElementById("project-grid");
const homeGrid = document.getElementById("home-project-grid");
const homeSection = document.getElementById("home-projects");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sized = (url, w) => String(url || "").replace("/upload/", `/upload/w_${w},q_auto,f_auto/`);
const monthYear = v => {
  if (!v) return "";
  const d = new Date(v + "-01");
  return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

let all = [];

function card(p, i) {
  const imgs = p.images || [];
  return `<button type="button" class="proj-card" data-i="${i}">
    <div class="proj-media">
      <img class="proj-img" src="${esc(sized(imgs[0], 800))}" alt="${esc(p.title)}" loading="lazy">
      ${imgs.length > 1 ? `<span class="proj-count">${imgs.length} photos</span>` : ""}
    </div>
    <div class="proj-body">
      <h3>${esc(p.title)}</h3>
      <p class="proj-meta">${esc([p.location, p.service].filter(Boolean).join(", "))}</p>
      <p class="proj-desc">${esc(p.description)}</p>
    </div>
  </button>`;
}

async function load() {
  try {
    const snap = await getDocs(query(collection(db, "projects"), where("published", "==", true)));
    all = snap.docs.map(d => d.data())
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (err) {
    console.error(err);
    if (grid) grid.innerHTML = '<p class="empty-msg">Could not load projects. Please try again later.</p>';
    return;
  }
  if (grid) {
    grid.innerHTML = all.length
      ? all.map(card).join("")
      : '<p class="empty-msg">Projects will be added here soon. <a href="/contact.html"><u>Contact us</u></a> to discuss yours.</p>';
  }
  if (homeGrid && all.length) {
    homeGrid.innerHTML = all.slice(0, 3).map(card).join("");
    homeSection.style.display = "";
  }
}

/* Gallery */
const dlg = document.createElement("dialog");
dlg.className = "lightbox";
dlg.innerHTML = `
  <button type="button" class="lb-close" aria-label="Close">&times;</button>
  <img class="lb-img" alt="">
  <div class="lb-bar">
    <button type="button" class="lb-prev" aria-label="Previous photo">&#8249;</button>
    <div class="lb-cap"></div>
    <button type="button" class="lb-next" aria-label="Next photo">&#8250;</button>
  </div>`;
document.body.appendChild(dlg);
let pi = 0, cur = 0;

function show() {
  const p = all[pi];
  const imgs = p.images || [];
  dlg.querySelector(".lb-img").src = sized(imgs[cur], 1400);
  dlg.querySelector(".lb-img").alt = p.title;
  const meta = [p.client, p.location, monthYear(p.completedOn)].filter(Boolean).join(", ");
  dlg.querySelector(".lb-cap").innerHTML =
    `<b>${esc(p.title)}</b>${meta ? `<br><small>${esc(meta)}</small>` : ""}<p>${esc(p.description)}</p>`;
  const many = imgs.length > 1;
  dlg.querySelector(".lb-prev").style.visibility = many ? "visible" : "hidden";
  dlg.querySelector(".lb-next").style.visibility = many ? "visible" : "hidden";
}
function step(n) {
  const len = (all[pi].images || []).length;
  cur = (cur + n + len) % len;
  show();
}

document.addEventListener("click", e => {
  const c = e.target.closest(".proj-card");
  if (c) { pi = Number(c.dataset.i); cur = 0; show(); dlg.showModal(); return; }
  if (e.target.closest(".lb-close") || e.target === dlg) dlg.close();
  else if (e.target.closest(".lb-prev")) step(-1);
  else if (e.target.closest(".lb-next")) step(1);
});
document.addEventListener("keydown", e => {
  if (!dlg.open) return;
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

if (grid || homeGrid) load();
