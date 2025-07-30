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

async function AgregarAlPedido(nombre, precio)
{
    const pedido =
    {
        nombre_producto: nombre,
        precio: precio,
        cantidad: 1,
        descripcion: 'Pedido desde frontend',
        reserva_id: 1
    };

    try
    {
        const response = await fetch('http://localhost:3000/api/pedidos',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (response.ok)
        {
            const data = await response.json();
            alert(`Se agregó ${data.nombre_producto} al pedido correctamente.`);
            console.log(data);
        }
        else
        {
            alert("Error al guardar el pedido.");
        }
    }
    catch (err)
    {
        console.error(err);
        alert("Fallo la conexión con el servidor.");
    }
}

const API_URL = 'http://localhost:3000/api/pedidos';

document.getElementById('formpedido').addEventListener('submit', async function (e)
{
    e.preventDefault();

    const id = document.getElementById('id').value;
    const pedido =
    {
        nombre_producto: document.getElementById('nombre_producto').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value),
        descripcion: document.getElementById('descripcion').value,
        reserva_id: parseInt(document.getElementById('reserva_id').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try
    {
        const res = await fetch(url,
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (res.ok)
        {
            document.getElementById('formpedido').reset();
            document.getElementById('id').value = '';
            await cargarPedidos();
        }
        else
        {
            alert('Error al guardar el pedido.');
        }
    }
    catch (err)
    {
        console.error(err);
        alert('Fallo la conexión con el servidor.');
    }
});

async function cargarPedidos()
{
    const res = await fetch(API_URL);
    const pedidos = await res.json();

    const contenedor = document.getElementById('lista-pedidos');
    contenedor.innerHTML = '';

    pedidos.forEach(p =>
    {
        const div = document.createElement('div');
        div.className = 'pedido';
        div.innerHTML = `
            <strong>${p.nombre_producto}</strong><br>
            Precio: $${p.precio}<br>
            Cantidad: ${p.cantidad}<br>
            Reserva: ${p.reserva_id}<br>
            <button onclick="editarPedido(${p.id})">Editar</button>
            <button onclick="eliminarPedido(${p.id})">Eliminar</button>
            <hr>
        `;
        contenedor.appendChild(div);
    });
}

async function editarPedido(id)
{
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    document.getElementById('id').value = p.id;
    document.getElementById('nombre_producto').value = p.nombre_producto;
    document.getElementById('precio').value = p.precio;
    document.getElementById('cantidad').value = p.cantidad;
    document.getElementById('descripcion').value = p.descripcion;
    document.getElementById('reserva_id').value = p.reserva_id;
}

async function eliminarPedido(id)
{
    if (confirm('¿Seguro que querés eliminar este pedido?'))
    {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await cargarPedidos();
    }
}

window.onload = cargarPedidos;