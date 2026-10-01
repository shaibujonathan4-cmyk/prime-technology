function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
  const path = location.pathname === "/" ? "/index.html" : location.pathname;
  document.querySelectorAll(".nav-links a:not(.btn)").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}
