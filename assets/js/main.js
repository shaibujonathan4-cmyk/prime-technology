async function loadPartials() {
  const slots = document.querySelectorAll("[data-include]");
  await Promise.all([...slots].map(async slot => {
    const res = await fetch(slot.dataset.include);
    slot.innerHTML = await res.text();
  }));
  initNav();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  initForms();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
