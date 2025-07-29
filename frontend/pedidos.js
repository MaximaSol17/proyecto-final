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

async function AgregarAlPedido(nombre, precio) {
    const pedido = {
        nombre_producto: nombre,
        precio: precio,
        cantidad: 1,
        descripcion: 'Pedido desde frontend',
        reserva_id: 1
    };

    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Se agregó ${data.nombre_producto} al pedido correctamente.`);
            console.log(data);
        } else {
            alert("Error al guardar el pedido.");
        }
    } catch (err) {
        console.error(err);
        alert("Fallo la conexión con el servidor.");
    }
}