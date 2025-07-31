let modoEdicion = false;
let pedidoEditandoID = null;

document.addEventListener('DOMContentLoaded', () => {
  const clienteId = localStorage.getItem('cliente_id');
  const reservaId = localStorage.getItem('reserva_id');

  if (!clienteId) {
    alert('Debes iniciar sesión primero.');
    window.location.href = 'clientes.html';
    return;
  }

  if (!reservaId) {
    alert('Debes tener una reserva para hacer pedidos.');
    window.location.href = 'reservas.html';
    return;
  }

  // Asignar automáticamente el reserva_id al formulario
  document.getElementById('reserva_id').value = reservaId;

  const tbodyPedidos = document.getElementById('cuerpo-tabla-pedidos');
  const totalPedido = document.getElementById('total-pedido');
  const btnConfirmar = document.getElementById('confirmar-pedido');
  const btnCancelar = document.getElementById('cancelar-pedido');
  const form = document.getElementById('formpedido');

  async function cargarPedidos() {
    try {
      const res = await fetch(`http://localhost:3000/pedidos/reserva/${reservaId}`);
      const pedidosCliente = await res.json();

      tbodyPedidos.innerHTML = '';
      let total = 0;

      pedidosCliente.forEach(pedido => {
        total += parseFloat(pedido.precio) * pedido.cantidad;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${pedido.id}</td>
          <td>${pedido.reserva_id}</td>
          <td>${pedido.nombre_producto}</td>
          <td>${pedido.descripcion || ''}</td>
          <td>${pedido.precio}</td>
          <td>${pedido.cantidad}</td>
          <td>$${(pedido.precio * pedido.cantidad).toFixed(2)}</td>
          <td>
            <button class="editar-btn" data-id="${pedido.id}">Editar</button>
            <button class="eliminar-btn" data-id="${pedido.id}">Eliminar</button>
          </td>
        `;
        tbodyPedidos.appendChild(fila);
      });

      totalPedido.textContent = total.toFixed(2);

    } catch (err) {
      console.error('No se pudo cargar los pedidos:', err);
    }
  }

  async function cargarPedidoenFormulario(id) {
    try {
      const res = await fetch(`http://localhost:3000/pedidos/${id}`);
      if (!res.ok) throw new Error('No se encontró el pedido');
      const pedido = await res.json();

      document.getElementById('reserva_id').value = pedido.reserva_id;
      document.getElementById('nombre_producto').value = pedido.nombre_producto;
      document.querySelector('[name="descripcion"]').value = pedido.descripcion || '';
      document.getElementById('precio').value = pedido.precio;
      document.getElementById('cantidad').value = pedido.cantidad;

      modoEdicion = true;
      pedidoEditandoID = id;
      document.getElementById('titulo-formulario').textContent = 'Editar pedido';

    } catch (error) {
      alert(error.message);
    }
  }

  // Crear o editar un pedido
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const pedido = {
      reserva_id: document.getElementById('reserva_id').value,
      nombre_producto: document.getElementById('nombre_producto').value,
      descripcion: document.querySelector('[name="descripcion"]').value,
      precio: parseFloat(document.getElementById('precio').value),
      cantidad: parseInt(document.getElementById('cantidad').value)
    };

    try {
      if (modoEdicion) {
        const res = await fetch(`http://localhost:3000/pedidos/${pedidoEditandoID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedido)
        });
        if (!res.ok) throw new Error('Error al editar el pedido');
        alert('Pedido editado correctamente');
      } else {
        const res = await fetch('http://localhost:3000/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedido)
        });
        if (!res.ok) throw new Error('Error al crear el pedido');
        alert('Pedido agregado correctamente');
      }

      modoEdicion = false;
      pedidoEditandoID = null;
      form.reset();
      document.getElementById('titulo-formulario').textContent = 'Agregar pedido';
      document.getElementById('reserva_id').value = reservaId;
      cargarPedidos();

    } catch (error) {
      alert(error.message);
    }
  });

  // Editar o eliminar pedido
  tbodyPedidos.addEventListener('click', async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('editar-btn')) {
      cargarPedidoenFormulario(id);
    } else if (target.classList.contains('eliminar-btn')) {
      if (confirm('¿Seguro que querés eliminar este pedido?')) {
        const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('Pedido eliminado');
          cargarPedidos();
        } else {
          alert('Error al eliminar el pedido');
        }
      }
    }
  });

  // Confirmar pedido
  btnConfirmar.addEventListener('click', () => {
    alert('¡Tu pedido ha sido confirmado con éxito!');
  });

  // Cancelar todos los pedidos
  btnCancelar.addEventListener('click', async () => {
    if (confirm('¿Estás seguro que querés cancelar todos tus pedidos?')) {
      try {
        const res = await fetch('http://localhost:3000/pedidos');
        const pedidos = await res.json();
        const pedidosCliente = pedidos.filter(p => p.reserva_id == reservaId);

        for (const pedido of pedidosCliente) {
          await fetch(`http://localhost:3000/pedidos/${pedido.id}`, {
            method: 'DELETE',
          });
        }

        cargarPedidos();
      } catch (error) {
        alert('Error al cancelar pedidos');
        console.error(error);
      }
    }
  });

  // Inicializar tabla
  cargarPedidos();
});