document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const documento = document.getElementById("documento").value;
  const contacto = document.getElementById("contacto").value;
  const sangre = document.getElementById("sangre").value;
  const rol = document.getElementById("rol").value;
  const fotoInput = document.getElementById("foto");

  document.getElementById("nombre-c").textContent = nombre;
  document.getElementById("documento-c").textContent = documento;
  document.getElementById("contacto-c").textContent = contacto;
  document.getElementById("sangre-c").textContent = sangre;
  document.getElementById("rol-c").textContent = rol;

  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("foto-preview").src = reader.result;

    // Generar QR con enlace
    const qrData = `https://identilucha.vercel.app/carnet/${encodeURIComponent(documento)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=60x60`;
    const qrImg = document.getElementById("qr-code");
    qrImg.src = qrCodeUrl;

    // Mostrar carnet y generar PDF
    const carnet = document.getElementById("carnet");
    carnet.style.display = "block";

    setTimeout(() => {
      generarPDF(carnet);
    }, 1000);
  };

  reader.readAsDataURL(fotoInput.files[0]);
});

function generarPDF(carnet) {
  const opt = {
    margin: 0,
    filename: 'carnet_digital.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: {
      unit: 'in',
      format: [3.5, 2.25],
      orientation: 'landscape'
    }
  };

  html2pdf().from(carnet).set(opt).save();
}
