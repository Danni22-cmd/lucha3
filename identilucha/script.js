import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqtUXbPvDtOcuZLwFsxll3TD7F3ICQzFo",
  authDomain: "identilucha.firebaseapp.com",
  projectId: "identilucha",
  storageBucket: "identilucha.firebasestorage.app",
  messagingSenderId: "338101541555",
  appId: "1:338101541555:web:edb3e5143ba87580c8eec6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const tipoDocumento = document.getElementById("tipoDocumento").value;
  const documento = document.getElementById("documento").value;
  const sangre = document.getElementById("sangre").value;
  const emergencia = document.getElementById("emergencia").value;
  const rol = document.getElementById("rol").value;
  const cargo = document.getElementById("cargo").value || "";
  const fotoInput = document.getElementById("foto");
  const fotoFile = fotoInput.files[0];

  if (!fotoFile) {
    alert("Por favor selecciona una foto.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const fotoURL = reader.result;

    // ⚠️ ACTUALIZA ESTA URL con tu dominio Vercel real:
    const carnetURL = `https://lucha3-4i23.vercel.app/carnet.html?doc=${documento}`;

    // Generar código QR como Data URL
    const qrDataURL = await QRCode.toDataURL(carnetURL);

    const datos = {
      nombre,
      tipoDocumento,
      documento,
      sangre,
      emergencia,
      rol,
      cargo,
      fotoURL,
      qrURL: qrDataURL
    };

    try {
      await setDoc(doc(collection(db, "carnets"), documento), datos);
      alert("Carnet guardado correctamente.");
      window.open(carnetURL, "_blank");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el carnet.");
    }
  };

  reader.readAsDataURL(fotoFile);
});
