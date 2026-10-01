// No backend yet: submitting opens WhatsApp with the inquiry pre-filled.
const WHATSAPP_NUMBER = "2347019180094";

function initForms() {
  document.querySelectorAll("form[data-inquiry]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      const text =
        `New inquiry from website\n` +
        `Name: ${d.name || ""}\nCompany: ${d.company || ""}\n` +
        `Phone: ${d.phone || ""}\nEmail: ${d.email || ""}\n` +
        `Needs: ${d.need || ""}\nMessage: ${d.message || ""}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
      form.reset();
    });
  });
}
