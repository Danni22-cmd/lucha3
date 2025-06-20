document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const cargoLabel = document.getElementById("cargoLabel");

  form.rol.addEventListener("change", () => {
    cargoLabel.style.display = form.rol.value === "Administrativo" ? "block" : "none";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const file = formData.get("foto");

    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result;

      const params = new URLSearchParams();
      params.append("nombre", formData.get("nombre"));
      params.append("tipoDocumento", formData.get("tipoDocumento"));
      params.append("numeroDocumento", formData.get("numeroDocumento"));
      params.append("emergencia", formData.get("emergencia"));
      params.append("sangre", formData.get("sangre"));
      params.append("rol", formData.get("rol"));
      params.append("cargo", formData.get("cargo") || "");
      params.append("foto", base64Image);

      window.location.href = `carnet.html?${params.toString()}`;
    };

    reader.readAsDataURL(file); // Leer la imagen como base64
  });
});
