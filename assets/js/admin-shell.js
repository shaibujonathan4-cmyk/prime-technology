import { auth, db } from "/assets/js/firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection, query, where, onSnapshot }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const STATUSES = [["new", "New"], ["contacted", "Contacted"], ["quoted", "Quoted"], ["won", "Won"], ["lost", "Lost"]];
export const statusLabel = s => (STATUSES.find(x => x[0] === s) || [s, s])[1];

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function timeAgo(ts) {
  if (!ts) return "Just now";
  const s = (Date.now() - ts.toDate().getTime()) / 1000;
  if (s < 60) return "Just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " h ago";
  if (s < 604800) return Math.floor(s / 86400) + " d ago";
  return ts.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fullDate(ts) {
  if (!ts) return "Just now";
  return ts.toDate().toLocaleString("en-GB",
    { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const svg = p => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
export const icons = {
  grid: svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'),
  inbox: svg('<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'),
  box: svg('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'),
  out: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'),
  link: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  back: svg('<polyline points="15 18 9 12 15 6"/>'),
  phone: svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  mail: svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'),
  chat: svg('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>')
};

export function inquiryRow(x, { href = "", selected = false } = {}) {
  const tag = href ? "a" : "button";
  const attrs = href ? `href="${href}"` : 'type="button"';
  return `<${tag} class="row ${selected ? "sel" : ""}" data-s="${esc(x.status)}" data-id="${esc(x.id)}" ${attrs}>
    <div class="row-top"><span class="row-name">${esc(x.name || "Unnamed")}</span><span class="row-time">${timeAgo(x.createdAt)}</span></div>
    <div class="row-sub">${esc(x.company || x.phone || x.email || "")}</div>
    <div class="row-foot"><span>${esc(x.need || "No service selected")}</span><span class="pill" data-s="${esc(x.status)}">${statusLabel(x.status)}</span></div>
  </${tag}>`;
}

function showLogin(root) {
  root.innerHTML = `
    <div class="login"><form class="login-box" id="login">
      <h1>Prime Industrial admin</h1>
      <p>Sign in to manage inquiries and equipment.</p>
      <div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="username" required></div>
      <div class="field"><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" required></div>
      <button class="btn btn-primary" type="submit">Sign in</button>
      <p class="note-status" id="login-msg" role="status"></p>
    </form></div>`;
  document.getElementById("login").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = document.getElementById("login-msg");
    msg.textContent = "Signing in...";
    try {
      await signInWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("password").value);
    } catch (err) {
      msg.textContent = "Sign in failed. Check your email and password.";
    }
  });
}

function showShell(root, user, active, title) {
  const nav = [
    ["dashboard", "Dashboard", "/admin/index.html", icons.grid],
    ["inquiries", "Inquiries", "/admin/inquiries.html", icons.inbox],
    ["equipment", "Equipment", "/admin/equipment.html", icons.box],
    ["projects", "Projects", "/admin/projects.html", icons.folder],
    ["website", "Website", "/admin/website.html", icons.image]
  ];
  document.title = title + " | Admin";
  root.innerHTML = `
    <div class="adm">
      <aside class="adm-side">
        <div class="adm-brand">PRIME INDUSTRIAL<small>Admin</small></div>
        <nav class="adm-nav">
          ${nav.map(([k, l, h, i]) => `<a href="${h}" class="${k === active ? "active" : ""}">${i}<span>${l}</span>${k === "inquiries" ? '<span class="badge hidden" id="new-badge"></span>' : ""}</a>`).join("")}
          <a href="/" target="_blank" rel="noopener" class="ext">${icons.link}<span>View website</span></a>
        </nav>
        <div class="adm-side-foot">
          <div class="who">${esc(user.email)}</div>
          <button type="button" class="btn" id="signout">${icons.out}Sign out</button>
        </div>
      </aside>
      <div class="adm-main">
        <header class="adm-top">
          <h1>${esc(title)}</h1>
          <button type="button" class="btn signout-m" id="signout-m" aria-label="Sign out">${icons.out}</button>
        </header>
        <main class="adm-content" id="adm-content"></main>
      </div>
    </div>`;
  document.getElementById("signout").addEventListener("click", () => signOut(auth));
  document.getElementById("signout-m").addEventListener("click", () => signOut(auth));
  onSnapshot(query(collection(db, "inquiries"), where("status", "==", "new")), snap => {
    const b = document.getElementById("new-badge");
    if (!b) return;
    b.textContent = snap.size;
    b.classList.toggle("hidden", snap.size === 0);
  }, () => {});
}

export function initAdmin({ active, title, render }) {
  const root = document.getElementById("app");
  onAuthStateChanged(auth, user => {
    if (!user) return showLogin(root);
    showShell(root, user, active, title);
    render(document.getElementById("adm-content"), user);
  });
}

icons.folder = svg('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>');

icons.image = svg('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>');
