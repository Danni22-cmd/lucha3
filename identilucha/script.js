document.getElementById("carnet-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const documento = document.getElementById("documento").value;
  const contacto = document.getElementById("contacto").value;
  const sangre = document.getElementById("sangre").value;
  const rol = document.getElementById("rol").value;
  const cargo = document.getElementById("cargo").value;
  const foto = document.getElementById("foto").files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const fotoBase64 = reader.result;

    const carnetHTML = `
      <div id="carnet">
        <img src="logo.png" class="logo" alt="Logo Liga">
        <img src="${fotoBase64}" alt="Foto" class="foto">
        <div class="info">
          <h2>LIGA SANTANDEREANA<br>DE LUCHA OLÍMPICA</h2>
          <strong>${nombre}</strong><br>
          CC: ${documento}<br>
          Emergencia: ${contacto}<br>
          Sangre: ${sangre}<br>
          Rol: ${rol}${rol === "Administrativo" ? ` - ${cargo}` : ""}
        </div>
        <img id="qr-code" class="qr" alt="QR Code">
        <div style="text-align: center; width: 100%; position: absolute; bottom: 6px;">
          <button onclick="descargarPDF()">Descargar carnet en PDF</button>
        </div>
      </div>
    `;

    document.getElementById("carnet-container").innerHTML = carnetHTML;

    // Generar QR Code
    const qrData = `${nombre} - CC: ${documento}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=60x60`;
    document.getElementById("qr-code").src = qrCodeUrl;
  };
  reader.readAsDataURL(foto);
});

function descargarPDF() {
  const carnet = document.getElementById("carnet");
  const boton = carnet.querySelector("button");

  boton.style.display = "none"; // Ocultar botón

  const opt = {
    margin: 0.2,
    filename: 'carnet_digital.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(carnet).set(opt).save().then(() => {
    boton.style.display = "inline-block"; // Mostrar botón de nuevo
  });
}
