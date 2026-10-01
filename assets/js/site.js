import { db } from "/assets/js/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const sized = (url, w) => String(url || "").replace("/upload/", `/upload/w_${w},q_auto,f_auto/`);

(async () => {
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (!snap.exists()) return;
    const s = snap.data();
    const hero = document.querySelector(".hero");
    if (hero && s.heroImage) {
      hero.style.backgroundImage =
        `linear-gradient(rgba(8,69,44,.62), rgba(8,69,44,.62)), url("${sized(s.heroImage, 1600)}")`;
    }
    if (s.aboutImage) {
      document.querySelectorAll(".img-box").forEach(b => {
        b.style.backgroundImage = `url("${sized(s.aboutImage, 900)}")`;
      });
    }
  } catch (err) {
    console.error(err);
  }
})();
