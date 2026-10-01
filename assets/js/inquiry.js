import { db } from "/assets/js/firebase-config.js";
import { collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const clean = (v, n) => String(v || "").trim().slice(0, n);

export async function saveInquiry(d) {
  await addDoc(collection(db, "inquiries"), {
    name: clean(d.name, 120),
    company: clean(d.company, 120),
    phone: clean(d.phone, 40),
    email: clean(d.email, 120),
    need: clean(d.need, 80),
    message: clean(d.message, 2000),
    status: "new",
    source: location.pathname.includes("request-quote") ? "quote" : "contact",
    createdAt: serverTimestamp()
  });
}
