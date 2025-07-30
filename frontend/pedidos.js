const clienteId = localStorage.getItem('cliente_id');
if (!clienteId) {
  alert('Debes iniciar sesión primero.');
  window.location.href = 'clientes.html';
  return;
}

let modoEdicion = false;
let pedidoEditandoID= null;


document.addEventListener('DOMContentLoaded', () => {
  const tbodyPedidos = document.getElementById('cuerpo-tabla-pedidos');
  const totalPedido = document.getElementById('total-pedido');
  const btnConfirmar = document.getElementById('confirmar-pedido');
  const btnCancelar = document.getElementById('cancelar-pedido');

  const reservaId = localStorage.getItem('reserva_id');
  if (!reservaId) {
    alert('Debes tener una reserva para hacer pedidos.');
    window.location.href = 'reservas.html';
    return;
  }
  


  async function cargarPedidoenFormulario(id) {
    try{
      const res = await fetch(`http://localhost:3000/pedidos/${id}`);
      if(!res.ok) throw new Error ('NO se encontro el pedido');
      const pedido = await res.json();

      document.getElementById('reserva_id').value = pedido.reserva_id;
      document.getElementById('nombre_producto').value = pedido.nombre_producto;
      document.querySelector('[name="descripcion"]').value = pedido.descripcion || '';
      document.getElementById('precio').value = pedido.precio;
      document.getElementById('cantidad').value = pedido.cantidad;

      modoEdicion =true;
      pedidoEditandoID=id;
      document.getElementById('titulo-formulario').textContent = 'Editar pedido';


    } catch (error){
      alert(error.message);

    }
  }

  // cargar los pedidos actuales del cliente
  async function cargarPedidos() {
    try {
      const res = await fetch('http://localhost:3000/pedidos');
      const data = await res.json();

      const pedidosCliente = data.filter(p => p.reserva_id == reservaId);
      tbodyPedidos.innerHTML = '';
      let total = 0;

      pedidosCliente.forEach(pedido => {
        total += parseFloat(pedido.precio) * pedido.cantidad;

        const fila = document.createElement('tr');

        // parte visible del pedido
      
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





  tbodyPedidos.addEventListener('click', async(e) => {
    const target = e.target;
    if(target.classList.contains('editar-btn')) {
      const id = target.dataset.id;
      cargarPedidoenFormulario(id);
    } else if (target.classList.contains('eliminar-btn')) {
      const id =target.dataset.id;
      if(confirm('¿Seguro que queres eliminar este pedido?')) {
        const res= await fetch(`http://localhost:3000/pedidos/${id}`, {
          method: 'DELETE',
        });
        if(res.ok) {
          alert('pedido eliminado');
          cargarPedidos();
        } else {
          alert('Error al eliminar un pedido');
        }
      }
    }
  });


  btnConfirmar.addEventListener('click' ,() => {
    alert('Tu pedido ha sido confirmado con exito!');
  });


  btnCancelar.addEventListener('click', async() => {
    if(confirm('¿Estas seguro que quieres cancelar todos tus pedidos?')) {
      try {
        const res = await fetch('http://localhost:3000/pedidos');
        const pedidos = await res.json();
        const pedidosCliente = pedidos.filter(p => p.reserva_id == reservaId);
        for(const pedido of pedidosCliente) {
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

  


  document.getElementById('formpedido').addEventListener('submit' , async(e) => {
    e.preventDefault();


    const pedido = {
      reserva_id: parseInt(reservaId),
      nombre_producto: document.getElementById('nombre_producto').value,
      descripcion: document.querySelector('[name = "descripcion"]').value,
      precio: parseFloat(document.getElementById('precio').value),
      cantidad: parseInt(document.getElementById('cantidad').value),
    };

    if(modoEdicion) {
      //actualizo pedido
      const res= await fetch(`http://localhost:3000/pedidos/${pedidoEditandoID}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(pedido),
      });
      if(res.ok) {
        alert('Pedido actualizado correctamente');
        //limpio la edicion y el formulario
        modoEdicion=false;
        pedidoEditandoID = null;
        e.target.reset();
        cargarPedidos();
        document.getElementById('titulo-formulario').textContent = 'Agregar pedido';


      } else {
        alert('Error al actualizar el pedido');
      }
    } else {
      //crear pedido
      const res= await fetch('http://localhost:3000/pedidos', {

        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(pedido), 

      });

      if(res.ok) {
        alert('Pedido agregado correctamente');
        cargarPedidos();
        e.target.reset(); //limpio el formulario

      } else {
        alert('Error al ingresar el pedido');
      }

    }

  
  });
  cargarPedidos();


});