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

      //filtro solo los pedidos del cliente actual
        const pedidosCliente = data.filter(p => p.reserva_id == reservaId);
        listaPedidos.innerHTML = '';
        let total = 0;

        pedidosCliente.forEach(pedido => {
            total += parseFloat(pedido.precio) * pedido.cantidad; //convierto el precio a numero por si viene como string

            //creo un item de lista con los datos del pedido
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${pedido.nombre_producto}</strong> (${pedido.cantidad}) - $${pedido.precio}<br>
                <em>${pedido.descripcion || ''}</em><br>
                <button data-id="${pedido.id}" class="eliminar-btn">Eliminar</button>
                `;
                listaPedidos.appendChild(li);
        });

        totalPedido.textContent = total.toFixed(2); //redondeo a dos decimales
    } catch (err) {
        console.error('No se pudo cargar los pedidos:', err);
    }
   }

   //eliminar el pedido
   listaPedidos.addEventListener('click', async (e) => {
    if (e.target.classList.contains('eliminar-btn')) {
      const id = e.target.dataset.id;
      if (confirm('¿Estas seguro de eliminar este pedido?')) {
        await fetch(`http://localhost:3000/pedidos/${id}`, {
          method: 'DELETE',
        });
        cargarPedidos();
      }
    }
   });

   //confirmo el pedido
   btnConfirmar.addEventListener('click', async () => {
    alert('¡Tu pedidos ha sido confirmado con exito!');
   });

   //cancela pedido
   btnCancelar.addEventListener('click', async () => {
    if (confirm('¿Estas seguro que quieres cancelar todos tus pedidos?')) {
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

