import { db, CATEGORIES } from "/assets/js/firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const cat = new URLSearchParams(location.search).get("cat");
const grid = document.getElementById("product-grid");
const title = document.getElementById("cat-title");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const opt = url => url.replace("/upload/", "/upload/w_800,q_auto,f_auto/");

async function load() {
  if (!CATEGORIES[cat]) {
    title.textContent = "Equipment";
    grid.innerHTML = '<p class="empty-msg">Category not found. <a href="/equipment.html"><u>Back to equipment</u></a></p>';
    return;
  }
  title.textContent = CATEGORIES[cat];
  document.title = CATEGORIES[cat] + " | Prime Industrial Technology Limited";

  try {
    const snap = await getDocs(query(collection(db, "products"), where("category", "==", cat)));
    const items = snap.docs.map(d => d.data())
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    if (!items.length) {
      grid.innerHTML = '<p class="empty-msg">No equipment listed in this category yet. <a href="/request-quote.html"><u>Request a quote</u></a> and we will source it for you.</p>';
      return;
    }
    grid.innerHTML = items.map(p => `
      <div class="equip-card">
        <img class="product-img" src="${esc(opt(p.imageUrl))}" alt="${esc(p.name)}" loading="lazy">
        <div class="product-body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          <a href="/request-quote.html" class="btn btn-primary">Request a Quote</a>
        </div>
      </div>`).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="empty-msg">Could not load products. Please try again later.</p>';
  }
}
load();
