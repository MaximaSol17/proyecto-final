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
   //cargo los pedidos actuales del cliente
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
            li.innerHTML = `
                <strong>${pedido.nombre_producto}</strong> (${pedido.cantidad}) - $${pedido.precio}<br>
                <em>${pedido.descripcion || ''}</em><br>
                <button data-id="${pedido.id}" class="eliminar-btn">Eliminar</button>
                `;
                listaPedidos.appendChild(li);
        });

        totalPedido.textContent = total.toFixed(2);
    } catch (err) {
        console.error('No se pudo cargar los pedidos:', err);
    }
   }
});

