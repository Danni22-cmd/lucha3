<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    doc,
    setDoc
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

  import html2pdf from "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";

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

  document.getElementById("formulario").addEventListener("submit", async function (e) {
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
      alert("Debes subir una foto");
      return;
    }

    const fotoRef = ref(storage, `fotos/${documento}`);
    await uploadBytes(fotoRef, foto);
    const fotoURL = await getDownloadURL(fotoRef);

    const qrData = `https://lucha3-4i23.vercel.app/carnet.html?doc=${documento}`;
    const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;

    const carnetData = {
      nombre,
      tipoDocumento,
      documento,
      sangre,
      emergencia,
      rol,
      cargo,
      fotoURL,
      qrURL: qrAPI
    };

    try {
      await setDoc(doc(db, "carnets", documento), carnetData);

      // Mostrar el carnet en pantalla
      const carnet = document.getElementById("carnet");
      carnet.innerHTML = `
        <div id="carnet-descargar" style="width: 300px; padding: 20px; border: 2px solid #003300; border-radius: 10px; background-color: #fff; text-align: center;">
          <img src="logo.png" style="width: 60px; position: absolute; top: 10px; left: 10px;" />
          <h3 style="margin-top: 10px;">LIGA SANTANDEREANA DE LUCHA OLÍMPICA</h3>
          <img src="${fotoURL}" style="width: 100px; height: 120px; object-fit: cover; margin: 10px; border-radius: 5px;" />
          <p><strong>${nombre}</strong></p>
          <p>${tipoDocumento}: ${documento}</p>
          <p>Tipo de sangre: ${sangre}</p>
          <p>Contacto emergencia: ${emergencia}</p>
          <p>Rol: ${rol}</p>
          ${rol === "ADMINISTRATIVO" ? `<p>Cargo: ${cargo}</p>` : ""}
          <img src="${qrAPI}" style="width: 80px;" />
        </div>
      `;

      // Esperar a que se renderice el carnet para ocultar botón
      setTimeout(() => {
        const descargarBtn = document.getElementById("descargarBtn");
        if (descargarBtn) descargarBtn.style.display = "none";

        html2pdf().from(document.getElementById("carnet-descargar")).save(`carnet_${documento}.pdf`);
      }, 1000);

    } catch (error) {
      console.error("Error al guardar el carnet:", error);
      alert("Hubo un error al guardar el carnet.");
    }
  });
</script>
