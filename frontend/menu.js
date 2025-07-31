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

async function AgregarAlPedido(nombre, precio) {

  let cliente = null;
  try {
    cliente = JSON.parse(localStorage.getItem("cliente"));
  } catch (e) {
    console.error("Cliente invalido en localStorage:", e)
  }
  
  const reservaID= localStorage.getItem("reserva_id");

  // Redirecciona al formulario de clientes
  if (!cliente) {
    alert("Debes registrarte o iniciar sesión para hacer un pedido.");
    window.location.href = "clientes.html"; 
    return;
  }
  
  if (!reservaID) {
    alert("Necesitas hacer una reserva primero.");
    window.location.href = "reservas.html";
    return;
  }
  const pedido = {
    reserva_id: parseInt(reservaID),
    nombre_producto: nombre,
    descripcion: "",
    precio: parseFloat(precio),
    cantidad: 1,

  };

  try {
    const res = await fetch("http://localhost:3000/pedidos", {
      method : 'POST',
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(pedido),
    });
  

    if( res.ok) {
      alert(`${nombre} agregado al pedido correctamente`);
    } else {
      alert("Hubo un error al agregar el producto.");
    }
  } catch(err) {
    console.error("Error al agregar el pedido:",err);
    alert("no se pudo enviar el pedido al servidor");
  }


};

let indiceMenu = 0;

function cambiarMenu(direccion) {
  const contenedor = document.querySelector('.contenedor-menu-deslizante');
  const menus = document.querySelectorAll('.menu-deslizante');

  indiceMenu += direccion;

  if (indiceMenu < 0) {
    indiceMenu = menus.length - 1;
  } else if (indiceMenu >= menus.length) {
    indiceMenu = 0;
  }

  const desplazamiento = -indiceMenu * 100;
  contenedor.style.transform = `translateX(${desplazamiento}%)`;
}

