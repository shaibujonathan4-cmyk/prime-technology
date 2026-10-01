import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbnXljrutTgICy4QGXtJCsZzjyuB42oxY",
  authDomain: "prime-industrial.firebaseapp.com",
  projectId: "prime-industrial",
  storageBucket: "prime-industrial.firebasestorage.app",
  messagingSenderId: "794344600650",
  appId: "1:794344600650:web:0fa673e4175edfc64aa2b3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const CLOUDINARY = {
  cloudName: "rh1jqizy",
  uploadPreset: "prime_products"
};

export const CATEGORIES = {
  packaging: "Packaging Machines",
  filling: "Filling Machines",
  production: "Production Machines",
  processing: "Processing Equipment",
  cooling: "Industrial Cooling Equipment",
  other: "Other Machinery"
};
