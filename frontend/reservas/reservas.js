const form = document.getElementById('form-reserva');

form.addEventListener('submit', async (e) => {
    e.preventDefault();   //lo hago para evitar que la pagina se recargue al hacer submit
    const data = Object.fromEntries(new FormData(form));  //esto va a tener los valores del formulario
    
    const res = await fetch('http://localhost:3000/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    //por las dudas, verifico que se haya creado bien
    if (res.ok) {
        alert('Reserva creada correctamente');
        form.reset();
    } else {
        alert('Error al crear la reserva')
    }
});
