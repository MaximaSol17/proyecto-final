const form = document.getElementById('form-registro');

form.addEventListener('submit',async(e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const edad = document.getElementById('edad').value;
    //por ser un entero
    const contraseña = parseInt(document.getElementById('contrasenia').value);

    const newcliente = { nombre, apellido, email, edad, contraseña};

    const res = await fetch('http://localhost:3000/clientes/login', {
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
        alert('Error de login');
    }



});