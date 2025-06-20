import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqtUXbPvDtOcuZLwFsxll3TD7F3ICQzFo",
  authDomain: "identilucha.firebaseapp.com",
  projectId: "identilucha",
  storageBucket: "identilucha.appspot.com",
  messagingSenderId: "338101541555",
  appId: "1:338101541555:web:edb3e5143ba87580c8eec6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const tipoDocumento = document.getElementById("tipoDocumento").value;
  const documento = document.getElementById("documento").value;
  const sangre = document.getElementById("sangre").value;
  const emergencia = document.getElementById("emergencia").value;
  const rol = document.getElementById("rol").value;
  const cargo = document.getElementById("cargo").value;
  const foto = document.getElementById("foto").files[0];

  if (!foto) {
    alert("Por favor selecciona una foto.");
    return;
  }

  const fotoRef = ref(storage, `fotos/${documento}`);
  await uploadBytes(fotoRef, foto);
  const fotoURL = await getDownloadURL(fotoRef);

  // 🔗 URL DEL CARNET DIGITAL CON TU DOMINIO
  const enlaceCarnet = `https://lucha3-4i23.vercel.app/carnet.html?doc=${documento}`;

  // Generar el QR desde api.qrserver.com
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(enlaceCarnet)}`;

  // Guardar en Firestore
  try {
    await setDoc(doc(db, "carnets", documento), {
      nombre,
      tipoDocumento,
      documento,
      sangre,
      emergencia,
      rol,
      cargo,
      fotoURL,
      qrURL
    });

    alert("¡Carnet guardado correctamente!");
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Hubo un error al guardar el carnet.");
  }
});
