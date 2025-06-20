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
      const carnetData = {
        nombre: formData.get("nombre"),
        tipoDocumento: formData.get("tipoDocumento"),
        numeroDocumento: formData.get("numeroDocumento"),
        emergencia: formData.get("emergencia"),
        sangre: formData.get("sangre"),
        rol: formData.get("rol"),
        cargo: formData.get("cargo"),
        foto: reader.result, // imagen base64
      };

      // Guardamos los datos en sessionStorage
      sessionStorage.setItem("carnetData", JSON.stringify(carnetData));

      // Redirigimos sin pasar datos por URL
      window.location.href = "carnet.html";
    };

    reader.readAsDataURL(file);
  });
});
