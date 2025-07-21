const form = document.getElementById('form-reserva');
const contenedor = document.getElementById('lista-reservas');

if (!localStorage.getItem('cliente_id')) {
    alert('Primero ingresa a Breaking BAR');
    window.location.href = 'clientes.html'; //PASAR HTML DE SOFI
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();   //lo hago para evitar que la pagina se recargue al hacer submit
    const data = Object.fromEntries(new FormData(form));  //esto va a tener los valores del formulario
    data.cliente_id = localStorage.getItem('cliente_id');

    const idEditando = form.dataset.editando;

    const res = await fetch(
        idEditando ? http://localhost:3000/reservas/${idEditando} : 'http://localhost:3000/reservas', 
        {
            method: idEditando ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
    );

    //por las dudas, verifico que se haya creado bien
    if (res.ok) {
        alert(idEditando ? 'Reserva actualizada' : 'Reserva Creada');
        form.reset();
        delete form.dataset.editando;
        location.reload();
    }
    else {
        alert('Error al guardar');
    }
});

async function cargarReservas() {
    const cliente_id = localStorage.getItem('cliente_id');
    const res = await fetch(`http://localhost:3000/reservas/cliente/${cliente_id}`);
    const reservas = await res.json();

    const contenedor = document.getElementById('lista-reservas');
    contenedor.innerHTML = ''; //limpio antes de cargar nuevas reservas

    if (reservas.length === 0) {
    contenedor.innerHTML = "<p>No tenés reservas registradas.</p>";
    return;
    }

    reservas.forEach(r => {
        item.classList.add('reserva-item');
        item.innerHTML = `
           <p><strong>${r.nombre_cliente}</strong> - ${r.fecha_reserva} a las ${r.hora} (${r.estado})</p>
           <button onclick="editarReserva(${r.id})">editar</button>
           <button onclick="eliminarReserva(${r.id})">Eliminar</button>
           <hr/>
        `;
        contenedor.appendChild(item);
    });
}
cargarReservas();

async function eliminarReserva(id) {
    if (!confirm("¡Estas seguro que quieres eliminar esta reserva?")) return;

    const res = await fetch(`http://localhost:3000/reservas/${id}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        alert("Reserva Eliminada");
        location.reload();
    }
    else {
        alert("Error al eliminar");
    }
}

async function editarReserva(id) {
    const res = await fetch(`http://localhost:3000/reservas/${id}`);
    const reserva = await res.json();
    //recorro cada campo y verifica si existe
    for (const campo in reserva) {
        if (form.elements[campo]) {
            form.elements[campo].value = reserva[campo];
        }
    }
    //guardo el id de la reserva que estoy editando
    form.dataset.editando = id;
}