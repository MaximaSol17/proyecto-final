let indiceMenu = 0;
const slider = document.querySelector(".contenedor-menu-deslizante");
const totalSlides = document.querySelectorAll(".menu-deslizante").length;

function cambiarMenu(direccion)
{
  indiceMenu += direccion;
  if (indiceMenu < 0)
  {
    indiceMenu = totalSlides - 1;
  }
  if (indiceMenu >= totalSlides)
  {
    indiceMenu = 0;
  }

  slider.style.transform = `translateX(-${indiceMenu * 100}%)`;
}

const PEDIDOS_DB = 'http://localhost:3000/pedidos';

async function AgregarAlPedido(nombre, precio)
{
  let cliente = null;
  try
  {
    cliente = JSON.parse(localStorage.getItem("cliente"));
  }
  catch (e)
  {
    console.error("Cliente inválido en localStorage:", e);
  }

  const reservaID = localStorage.getItem("reserva_id");

  if (!cliente)
  {
    alert("Debes registrarte o iniciar sesión para hacer un pedido.");
    window.location.href = "clientes.html";
    return;
  }

  if (!reservaID)
  {
    alert("Necesitas hacer una reserva primero.");
    window.location.href = "reservas.html";
    return;
  }

  const pedido =
  {
    reserva_id: parseInt(reservaID),
    nombre_producto: nombre,
    descripcion: "",
    precio: parseFloat(precio),
    cantidad: 1,
  };

  try
  {
    const res = await fetch(PEDIDOS_DB,
    {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (res.ok)
    {
      alert(`${nombre} agregado al pedido correctamente`);
      await cargarPedidos();
    }
    else
    {
      const error = await res.json();
      alert(`Error al agregar producto: ${error.error || 'Error desconocido'}`);
    }
  }
  catch (err)
  {
    console.error("Error al agregar el pedido:", err);
    alert("No se pudo enviar el pedido al servidor.");
  }
}

async function cargarPedidos()
{
  const reservaID = localStorage.getItem("reserva_id");

  if (!reservaID)
  {
    alert("Primero debés tener una reserva activa.");
    return;
  }

  try
  {
    const res = await fetch(`${PEDIDOS_DB}/reserva/${reservaID}`);
    if (!res.ok) throw new Error("No se pudieron obtener los pedidos");

    const pedidos = await res.json();

    const contenedor = document.getElementById("lista-pedidos");
    contenedor.innerHTML = '';

    pedidos.forEach(p =>
    {
      const div = document.createElement("div");
      div.className = "pedido";
      div.innerHTML = `
        <strong>
          ${p.nombre_producto}
        </strong>
        <br>
        Precio: $${p.precio}
        <br>
        Cantidad: ${p.cantidad}
        <br>
        Descripción: ${p.descripcion}
        <br>
        <button onclick="editarPedido(${p.id})">
          Editar
        </button>
        <button onclick="eliminarPedido(${p.id})">
          Eliminar
        </button>
        <hr>
      `;
      contenedor.appendChild(div);
    });
  }
  catch (err)
  {
    console.error("Error al cargar pedidos:", err);
    alert("No se pudieron cargar los pedidos.");
  }
}

async function editarPedido(id)
{
  try
  {
    const res = await fetch(`${PEDIDOS_DB}/${id}`);
    if (!res.ok) throw new Error("Pedido no encontrado");

    const p = await res.json();
    document.getElementById("id").value = p.id;
    document.getElementById("nombre_producto").value = p.nombre_producto;
    document.getElementById("precio").value = p.precio;
    document.getElementById("cantidad").value = p.cantidad;
    document.getElementById("descripcion").value = p.descripcion;

  }
  catch (err)
  {
    console.error("Error al editar el pedido:", err);
    alert("No se pudo cargar el pedido para edición.");
  }
}

async function eliminarPedido(id)
{
  if (!confirm("¿Estás seguro de eliminar este pedido?")) return;

  try
  {
    const res = await fetch(`${PEDIDOS_DB}/${id}`,
    {
      method: 'DELETE',
    });

    if (res.ok)
    {
      await cargarPedidos();
    }
    else
    {
      const error = await res.json();
      alert(`Error: ${error.error || 'No se pudo eliminar el pedido'}`);
    }
  }
  catch (err)
  {
    console.error("Error al eliminar el pedido:", err);
    alert("No se pudo eliminar el pedido.");
  }
}

document.getElementById("formpedido").addEventListener("submit", async function (e)
{
  e.preventDefault();

  const id = document.getElementById("id").value;
  const nombre_producto = document.getElementById("nombre_producto").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const descripcion = document.getElementById("descripcion").value;
  const reserva_id = parseInt(localStorage.getItem("reserva_id"));

  if (!reserva_id)
  {
    alert("No hay una reserva activa.");
    return;
  }

  const pedido = { nombre_producto, precio, cantidad, descripcion, reserva_id };

  try
  {
    const res = await fetch(`${PEDIDOS_DB}/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });

    if (res.ok)
    {
      document.getElementById("formpedido").reset();
      document.getElementById("id").value = '';
      await cargarPedidos();
    }
    else
    {
      const error = await res.json();
      alert(`Error: ${error.error || 'No se pudo actualizar el pedido'}`);
    }
  }
  catch (err)
  {
    console.error("Error al actualizar el pedido:", err);
    alert("No se pudo conectar con el servidor.");
  }
});

window.onload = cargarPedidos;