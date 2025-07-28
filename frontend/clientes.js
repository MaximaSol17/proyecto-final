const form = document.getElementById('form-clientes');

form.addEventListener('submit',async(e) => {
    e.preventDefault(); //para que recargue 
    //obtengo los mail y contraseñas

    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('Contrasenia').value;

    const res = await fetch('http://localhost:3000/clientes/login', {
        method :'POST',
        headers : {
            'Content-type' : 'application/json' 
        },
        body: JSON.stringify({email, contraseña})
        
    });

    //si se creo 

    if(res.ok) {
        const person = await res.json();
        //va
        localStorage.setItem('email', cliente.email);
        alert('Login exitoso. Bienvenido' + person.nombre );
        // Lo mando a reservas
        window.location.href = 'reservas.html';

    }
    else {
        alert('Error de login');
    }

});