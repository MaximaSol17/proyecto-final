document.addEventListener("DOMContentLoaded", () => {
  obtenerMenu();
});

let pedidos = [];

function obtenerMenu() {
  fetch("http://localhost:3000/menu")
    .then((res) => res.json())
    .then((data) => {
      mostrarProductos(data);
    })
    .catch((error) => console.error("Error al obtener el menú:", error));
}

function mostrarProductos(menuItems) {
  const contenedor = document.getElementById("productos-menu");
  contenedor.innerHTML = "";

  menuItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>${item.descripcion}</p>
      <p class="precio">$${item.precio}</p>
      <button onclick="AgregarAlPedido('${item.nombre}', ${item.precio})">Agregar al pedido</button>
    `;
    contenedor.appendChild(div);
  });
}

function AgregarAlPedido(nombre, precio) {
  const cliente = JSON.parse(localStorage.getItem("cliente"));

  // Redirecciona al formulario de clientes
  if (!cliente) {
    alert("Debes registrarte o iniciar sesión para hacer un pedido.");
    window.location.href = "clientes.html"; 
    return;
  }

  pedidos.push({ nombre, precio });
  alert(`${nombre} agregado al pedido`);
  console.log(pedidos);
}

