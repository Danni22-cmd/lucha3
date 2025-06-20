document.getElementById("formulario").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const tipoDoc = document.getElementById("tipoDocumento").value;
  const numeroDoc = document.getElementById("numeroDocumento").value;
  const documento = `${tipoDoc} ${numeroDoc}`;
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

    const qrData = `https://identilucha.vercel.app/carnet/${encodeURIComponent(numeroDoc)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=70x70`;
    const qrImg = document.getElementById("qr-code");
    qrImg.src = qrCodeUrl;

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
    html2canvas: { scale: 5, useCORS: true },
    jsPDF: {
      unit: 'in',
      format: [3.5, 2.2], // Carnet horizontal
      orientation: 'landscape'
    }
  };

  html2pdf().set(opt).from(carnet).save();
}
