console.log("reservas.js cargado");

let idEditando = null;
const cliente_id = localStorage.getItem('cliente_id');


if (!cliente_id) {
    alert('Primero debes iniciar sesión.');
    window.location.href = 'clientes.html';
}

// Mostrar el nombre y apellido del cliente en el campo "nombre_cliente"
const nombre = localStorage.getItem('nombre');
const apellido = localStorage.getItem('apellido');
const inputNombre = document.getElementById('nombre_cliente');

if (inputNombre) {
    inputNombre.value = `${nombre} ${apellido}`;
}

const form = document.getElementById('form-reserva');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const reserva = {
        cliente_id: cliente_id,
        fecha_reserva: formData.get('fecha_reserva'),
        hora: formData.get('hora'),
        cantidad_personas: parseInt(formData.get('cantidad_personas')),
        estado: formData.get('estado')
    };


    const idEditando = form.dataset.editando;
    console.log("Modo edición?", !!idEditando);
    console.log("Reserva a enviar:", reserva);

    let res;
    if (idEditando) {
        // Editar reserva existente
        res = await fetch(`http://localhost:3000/reservas/${idEditando}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva)
        });
    } else {
        // Crear nueva reserva
        res = await fetch('http://localhost:3000/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva)
        });
    }

    if (res.ok) {
        const data = await res.json();
        alert(idEditando ? 'Reserva actualizada correctamente' : 'Reserva creada correctamente');
        
        //guargo el id de la reserva
        if (!idEditando && data.id) {
            localStorage.setItem('reserva_id', data.id);
        } else if (idEditando) {
            localStorage.setItem('reserva_id', idEditando);
        }
        
        form.reset();
        delete form.dataset.editando; // Salgo del modo edición
        cargarReservas();
    } else {
        alert('Error al guardar la reserva');
    }
});

async function cargarReservas() {
    const cliente_id = localStorage.getItem('cliente_id');
    const res = await fetch(`http://localhost:3000/reservas/cliente/${cliente_id}`);
    const reservas = await res.json();

    const contenedor = document.getElementById('lista-reservas') || document.getElementById('contenedor-reservas');
    contenedor.innerHTML = ''; //limpio antes de cargar nuevas reservas


    reservas.forEach(r => {
        const item = document.createElement('div');
        item.classList.add('reserva-item');

        const fecha = new Date(r.fecha_reserva).toLocaleDateString('es-AR');
        const hora = r.hora.slice(0, 5); 

        const nombre = localStorage.getItem('nombre');
        const apellido = localStorage.getItem('apellido');

        let nombreCompleto = '';
        if (nombre && apellido) {
            nombreCompleto = `<strong>${nombre} ${apellido}</strong> - `;
        }

        item.innerHTML = `
            <p>${nombreCompleto}${fecha} a las ${hora} (${r.estado})</p>
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
    const idEditando = form.dataset.editando;
    console.log("Entrando en modo edición con ID:", id);

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

const email = localStorage.getItem('email');
//se es el admin muestro el link al panel de administracion.
if(email === 'admin@bar.com') {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = 'inline-block';
}