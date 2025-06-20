document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const cargoLabel = document.getElementById("cargoLabel");

  form.rol.addEventListener("change", () => {
    if (form.rol.value === "Administrativo") {
      cargoLabel.style.display = "block";
    } else {
      cargoLabel.style.display = "none";
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const datos = new URLSearchParams(new FormData(form)).toString();
    window.location.href = `carnet.html?${datos}`;
  });
});
