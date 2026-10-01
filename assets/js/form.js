const WHATSAPP_NUMBER = "2347019180094";

function initForms() {
  prefillNeed();
  document.querySelectorAll("form[data-inquiry]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const d = Object.fromEntries(new FormData(form).entries());
      let msg = form.querySelector(".form-status");
      if (!msg) {
        msg = document.createElement("p");
        msg.setAttribute("role", "status");
        form.appendChild(msg);
      }
      msg.className = "form-status";
      msg.textContent = "Sending...";
      btn.disabled = true;
      try {
        const { saveInquiry } = await import("/assets/js/inquiry.js");
        await saveInquiry(d);
        form.reset();
        msg.textContent = "Thank you. We have received your inquiry and will contact you shortly.";
      } catch (err) {
        console.error(err);
        const text = `New inquiry from website\nName: ${d.name || ""}\nCompany: ${d.company || ""}\nPhone: ${d.phone || ""}\nEmail: ${d.email || ""}\nNeeds: ${d.need || ""}\nMessage: ${d.message || ""}`;
        msg.className = "form-status error";
        msg.textContent = "We could not send your inquiry. ";
        const a = document.createElement("a");
        a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        a.target = "_blank";
        a.rel = "noopener";
        a.style.textDecoration = "underline";
        a.textContent = "Send it on WhatsApp instead.";
        msg.appendChild(a);
      }
      btn.disabled = false;
    });
  });
}

function prefillNeed() {
  const need = new URLSearchParams(location.search).get("need");
  if (!need) return;
  document.querySelectorAll('select[name="need"]').forEach(s => {
    if ([...s.options].some(o => o.value === need)) s.value = need;
  });
}
