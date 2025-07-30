const tablaClientes = document.querySelector('#tabla-clientes tbody');
const formEditar = document.getElementById('form-editar');
const editarForm = document.getElementById('editar-form');
const cancelarEdicion = document.getElementById('cancelar-edicion');

// Verificar que el usuario logueado sea el administrador
const usuarioLogueado = localStorage.getItem('email');

if (usuarioLogueado !== 'admin@bar.com') {
    alert('Acceso denegado. Solo el administrador puede acceder.');
    window.location.href = 'index.html';
} else {
    cargarClientes();
}

async function cargarClientes() {
    const res = await fetch(`http://localhost:3000/clientes`);
    const clientes = await res.json();
    tablaClientes.innerHTML = '';
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.apellido}</td>
        <td>${cliente.email}</td>
        <td>${cliente.edad}</td>
        <td>${cliente.telefono}</td>
        <td>
            <button onclick="mostrarEditar(${cliente.id})">Editar</button>
            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>
        </td>
        `;
        tablaClientes.appendChild(tr);
        
    });

};


async function eliminarCliente(id) {
    if(!confirm('¿Estas seguro que queres eliminar cliente?'))return;
    const res = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',

    });
    if(res.ok) {
        alert('Cliente eliminado');
        cargarClientes();
    } else {
        alert('Error eliminando cliente');
    }  
};


async function mostrarEditar(id) {
    const res = await fetch(`http://localhost:3000/clientes/${id}`);
    if(!res.ok) throw new Error ('Cliente no encontrado');
    const cliente = await res.json();

    document.getElementById('editar-id').value = cliente.id;
    document.getElementById('editar-nombre').value = cliente.nombre;
    document.getElementById('editar-apellido').value = cliente.apellido;
    document.getElementById('editar-email').value = cliente.email;
    document.getElementById('editar-edad').value = cliente.edad;
    document.getElementById('editar-telefono').value = cliente.telefono;
    document.getElementById('editar-contraseña').value = cliente.contraseña;
    formEditar.style.display ='block';
        
    
};

editarForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const id = document.getElementById('editar-id').value;
    const nombre = document.getElementById('editar-nombre').value;
    const apellido = document.getElementById('editar-apellido').value;
    const email = document.getElementById('editar-email').value;
    const edad = document.getElementById('editar-edad').value;
    const telefono = document.getElementById('editar-telefono').value;
    const contraseña = document.getElementById('editar-contraseña').value;

    const res = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify({nombre, apellido, email, edad, telefono, contraseña})
    });
    if (res.ok) {
        alert('Cliente actualizado');
        formEditar.style.display = 'none';
        cargarClientes();
    } else {
        const error = await res.json();
        alert('Error actualizando cliente: ' + error.error);
    }

});

cancelarEdicion.addEventListener('click', () => {
    formEditar.style.display = 'none';
});

cargarClientes();

//cerrar sesion
document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear(); 
    alert('Sesión cerrada correctamente.');
    window.location.href = 'index.html';
});