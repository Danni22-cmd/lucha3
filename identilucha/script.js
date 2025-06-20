// Firebase SDK v10+
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqtUXbPvDtOcuZLwFsxll3TD7F3ICQzFo",
  authDomain: "identilucha.firebaseapp.com",
  projectId: "identilucha",
  storageBucket: "identilucha.firebasestorage.app",
  messagingSenderId: "338101541555",
  appId: "1:338101541555:web:edb3e5143ba87580c8eec6"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Escuchar el formulario
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const documento = document.getElementById("documento").value.trim();
  const contacto = document.getElementById("contacto").value.trim();
  const sangre = document.getElementById("sangre").value;
  const rol = document.getElementById("rol").value;
  const cargo = document.getElementById("cargo")?.value || "";
  const foto = document.getElementById("foto").files[0];

  if (!nombre || !documento || !contacto || !sangre || !foto) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const slug = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const reader = new FileReader();
  reader.onload = async function (e) {
    const carnetData = {
      nombre,
      documento,
      contacto,
      sangre,
      rol,
      cargo,
      foto: e.target.result,
      slug
    };

    try {
      await setDoc(doc(db, "carnets", slug), carnetData);
      window.location.href = `ver-carnet.html?slug=${slug}`;
    } catch (err) {
      console.error("Error al guardar en Firestore:", err);
      alert("Hubo un error al guardar el carnet.");
    }
  };

  reader.readAsDataURL(foto);
});
