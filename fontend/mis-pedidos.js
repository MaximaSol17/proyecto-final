document.addEventListener("DOMContentLoaded", async () => {
    const cliente_id = localStorage.getItem("cliente_id");
    if (!cliente_id) {
        document.getElementById("lista-pedidos").innerHTML = "<p>Inicia sesion para ver tus pedidos >/p>";
        return;
    }

    const reserva_id = await obtenerReservaDelCliente(cliente_id);
    if (!reserva_id) {
        document.getElementById("lista-pedidos"). innerHTML = "<p> No hay reservas.</p>";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/menu");
        const data = await res.json();
        const pedidosCliente = data.filter(item => item.reserva_id === reserva_id);

        const contenedor = document.getElementById("lista-pedidos");
        pedidosCliente.forEach(p => {
            const div = document.createElement("div");
            div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>Precio: ${p.precio}</p>
            <p>Tipo: ${p.tipo}</p>
            <p>Disponible: ${p.disponible ? "Si" : "No"}</p>
            <button onclick="eliminarPedido(${p.id})">Eliminar</button>
            <hr>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error("Error al obtener pedido:", error);
    }
});

async function obtenerReservaDelCliente(cliente_id) {
    try {
        const  res = await fetch(`http://localhost:3000/reservas/cliente/${cliente_id}`);
        const data = await res.json();
        if (data.length === 0) return null;
        //para que me devuelva la ultima reserva
        return data[data.length - 1].id;
    } catch (err) {
        console.error("Error al obtener la reserva:", err);
        return null;
    }
}

async function eliminarPedido(id) {
    const cliente_id = localStorage.getItem("cliente_id");

    const rest = await fetch(`http://localhost:3000/menu/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cliente_id }),
    });
    if (res.ok) {
        alert("El pedido ha sido eliminado");
        location.reload();
    } else {
        const error = await res.json();
        alert("Error: " + error.error);
    }
}

async function editarPedido(id) {
    //Obtengo todos los productos disponibles
    const productosRes = await fetch("http://localhost:3000/menu");
    const productos = await productosRes.json();

    //creo una lista
    const opciones = productos.map(p => `${p.id}: ${p.nombre} - ${p.precio}`).join("\n");
    const seleccion = prompt("Seleccioná el nuevo producto (por ID):n" + opciones);

    const productoSeleccionado = productos.find(p => p.id === parseInt(seleccion));

    if (!productoSeleccionado) {
        alert("Ese producto no es valido");
        return;
    }

    //Actualizo su pedido
    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            producto_id: productoSeleccionado.id
        })
    });

    if (res.ok) {
        alert("Pedido actualizado");
    } else {
        alert("No se pudo actualizar");
    }
}

