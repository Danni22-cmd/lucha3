import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import html2canvas from "https://cdn.skypack.dev/html2canvas";
import jsPDF from "https://cdn.skypack.dev/jspdf";
import QRCode from "https://cdn.skypack.dev/qrcode";

// 🔥 CONFIGURACIÓN FIREBASE
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

// 📥 ESCUCHAR FORMULARIO
document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    tipoDocumento: document.getElementById("tipoDocumento").value,
    documento: document.getElementById("documento").value,
    sangre: document.getElementById("sangre").value,
    emergencia: document.getElementById("emergencia").value,
    rol: document.getElementById("rol").value,
    cargo: document.getElementById("cargo").value,
    fotoURL: document.getElementById("foto").files[0] ? URL.createObjectURL(document.getElementById("foto").files[0]) : ""
  };

  // 🎯 Ruta única usando el número de documento
  const slug = data.documento;

  try {
    // Generar QR con la URL al carnet
    const qrDataURL = await QRCode.toDataURL(`https://identilucha.vercel.app/carnet.html?doc=${slug}`);

    // Guardar en Firestore
    await setDoc(doc(db, "carnets", slug), {
      ...data,
      qrURL: qrDataURL
    });

    // Mostrar carnet con los datos
    mostrarCarnet(data, qrDataURL);

  } catch (error) {
    console.error("Error detallado:", error);
    alert("Error al guardar el carnet: " + error.message);
  }
});

function mostrarCarnet(data, qrURL) {
  const carnet = document.getElementById("carnet");
  carnet.innerHTML = `
    <div class="carnet-contenedor" id="carnet-final">
      <img src="logo.png" class="logo-carnet" />
      <h2>LIGA SANTANDEREANA DE LUCHA OLÍMPICA</h2>
      <img src="${data.fotoURL}" class="foto" />
      <p><strong>${data.nombre}</strong></p>
      <p>${data.tipoDocumento}: ${data.documento}</p>
      <p>Tipo de sangre: ${data.sangre}</p>
      <p>Contacto emergencia: ${data.emergencia}</p>
      <p>Rol: ${data.rol}</p>
      ${data.rol === "ADMINISTRATIVO" ? `<p>Cargo: ${data.cargo}</p>` : ""}
      <img src="${qrURL}" class="qr" />
      <button id="descargar" onclick="descargarPDF()">Descargar PDF</button>
    </div>
  `;
  carnet.style.display = "block";
}

window.descargarPDF = async function () {
  const carnetElemento = document.getElementById("carnet-final");

  // Ocultar botón
  const boton = carnetElemento.querySelector("#descargar");
  if (boton) boton.style.display = "none";

  const canvas = await html2canvas(carnetElemento);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [350, 500] });
  pdf.addImage(imgData, "PNG", 0, 0);
  pdf.save("carnet.pdf");

  // Mostrar botón nuevamente
  if (boton) boton.style.display = "block";
};
