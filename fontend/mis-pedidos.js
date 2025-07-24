document.addEventListener("DOMContentLoaded", async () => {
    const cliente_id = localStorage.getItem("cliente_id");
    const contenedor = document.getElementById("lista-pedidos");

    if (!cliente_id) {
        contenedor.innerHTML = "<p>Inicia sesión para ver tus pedidos.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/pedidos/cliente/${cliente_id}`);
        const data = await res.json();

        if (data.length === 0) {
            contenedor.innerHTML = "<p>No hay pedidos registrados.</p>";
            return;
        }

        data.forEach(p => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${p.nombre}</h3>
                <p>Precio: $${p.precio}</p>
                <p>Tipo: ${p.tipo}</p>
                <p>Disponible: ${p.disponible ? "Sí" : "No"}</p>
                <button onclick="editarPedido(${p.pedido_id})">Editar</button>
                <button onclick="eliminarPedido(${p.pedido_id})">Eliminar</button>
                <hr>
            `;
            contenedor.appendChild(div);
        });
    } catch (err) {
        contenedor.innerHTML = "<p>Error al cargar los pedidos.</p>";
        console.error(err);
    }
});

async function eliminarPedido(id) {
    const cliente_id = localStorage.getItem("cliente_id");

    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cliente_id }),
    });

    if (res.ok) {
        alert("Pedido eliminado");
        location.reload();
    } else {
        const error = await res.json();
        alert("Error: " + error.error);
    }
}

async function editarPedido(id) {
    const productosRes = await fetch("http://localhost:3000/menu");
    const productos = await productosRes.json();

    const opciones = productos.map(p => `${p.id}: ${p.nombre} - $${p.precio}`).join("\n");
    const seleccion = prompt("Seleccioná el nuevo producto (por ID):\n" + opciones);

    const productoSeleccionado = productos.find(p => p.id === parseInt(seleccion));
    if (!productoSeleccionado) {
        alert("Producto inválido");
        return;
    }

    const cliente_id = localStorage.getItem("cliente_id");

    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            producto_id: productoSeleccionado.id,
            cliente_id,
        }),
    });

    if (res.ok) {
        alert("Pedido actualizado");
        location.reload();
    } else {
        const error = await res.json();
        alert("Error: " + error.error);
    }
}
