const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  alert('Debes iniciar sesión primero.');
  window.location.href = 'clientes.html';
  return;
}


document.addEventListener('DOMContentLoaded', () => {
  const listaPedidos = document.getElementById('lista-pedidos');
  const totalPedido = document.getElementById('total-pedido');
  const btnConfirmar = document.getElementById('confirmar-pedido');
  const btnCancelar = document.getElementById('cancelar-pedido');

  const reservaId = localStorage.getItem('reserva_id');
  if (!reservaId) {
    alert('Debes tener una reserva para hacer pedidos.');
    window.location.href = 'mis-reservas.html';
    return;
  }

  // cargar los pedidos actuales del cliente
  async function cargarPedidos() {
    try {
      const res = await fetch('http://localhost:3000/pedidos');
      const data = await res.json();

      const pedidosCliente = data.filter(p => p.reserva_id == reservaId);
      listaPedidos.innerHTML = '';
      let total = 0;

      pedidosCliente.forEach(pedido => {
        total += parseFloat(pedido.precio) * pedido.cantidad;

        const li = document.createElement('li');

        // parte visible del pedido
        li.innerHTML = `
          <strong>${pedido.nombre_producto}</strong> (${pedido.cantidad}) - $${pedido.precio}<br>
          <em>${pedido.descripcion || ''}</em><br>
          <button data-id="${pedido.id}" class="eliminar-btn">Eliminar</button>
        `;

        // input para modificar cantidad
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = pedido.cantidad;
        inputCantidad.min = 1;
        inputCantidad.classList.add('input-cantidad');

        // boton para guardar edicion
        const btnGuardar = document.createElement('button');
        btnGuardar.textContent = 'Guardar';
        btnGuardar.classList.add('guardar-btn');

        btnGuardar.addEventListener('click', () => {
          const nuevaCantidad = parseInt(inputCantidad.value);
          if (nuevaCantidad > 0) {
            editarPedido(pedido.id, { cantidad: nuevaCantidad });
          } else {
            alert('La cantidad debe ser mayor a 0');
          }
        });

        // agrego campos de edicion al <li>
        li.appendChild(document.createElement('br'));
        li.appendChild(document.createTextNode('Modificar cantidad: '));
        li.appendChild(inputCantidad);
        li.appendChild(btnGuardar);

        listaPedidos.appendChild(li);
      });

      totalPedido.textContent = total.toFixed(2);
    } catch (err) {
      console.error('No se pudo cargar los pedidos:', err);
    }
  }

  // editar un pedido
  async function editarPedido(id, datosActualizados) {
    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosActualizados)
    });

    if (res.ok) {
      alert('Pedido actualizado');
      cargarPedidos();
    } else {
      alert('Error al actualizar el pedido');
    }
  }

  // eliminar un pedido individual
  listaPedidos.addEventListener('click', async (e) => {
    if (e.target.classList.contains('eliminar-btn')) {
      const id = e.target.dataset.id;
      if (confirm('¿Estás seguro de eliminar este pedido?')) {
        await fetch(`http://localhost:3000/pedidos/${id}`, {
          method: 'DELETE',
        });
        cargarPedidos();
      }
    }
  });

  // mensaje de confirmar pedido
  btnConfirmar.addEventListener('click', () => {
    alert('¡Tu pedido ha sido confirmado con éxito!');
  });

  // cancelar todos los pedidos del cliente
  btnCancelar.addEventListener('click', async () => {
    if (confirm('¿Estás seguro que quieres cancelar todos tus pedidos?')) {
      const res = await fetch('http://localhost:3000/pedidos');
      const pedidos = await res.json();
      const pedidosCliente = pedidos.filter(p => p.reserva_id == reservaId);

      for (const pedido of pedidosCliente) {
        await fetch(`http://localhost:3000/pedidos/${pedido.id}`, {
          method: 'DELETE',
        });
      }
      cargarPedidos();
    }
  });

  cargarPedidos();
});