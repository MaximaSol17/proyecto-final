
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom cargado');

    const form = document.getElementById('form-registro');

    form.addEventListener('submit',async(e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const edad = document.getElementById('edad').value;
        //por ser un entero
        const telefono = document.getElementById('telefono').value;
        const contraseña = document.getElementById('contraseña').value;

        const newcliente = { nombre, apellido, email, edad, telefono, contraseña};

        const res = await fetch('http://localhost:3000/clientes/registro', {

            method :'POST',
            headers : {

                'Content-type' : 'application/json' 
            },
            body: JSON.stringify(newcliente)
        

    
        });

        if(res.ok) {

            const person = await res.json();
            alert('Registro exitoso. Bienvenido');
            // Lo mando a login
            window.location.href = 'clientes.html';

        }
        else {

            const error = await res.text();
            alert('Error de registro' + error);
        }
    });

});



