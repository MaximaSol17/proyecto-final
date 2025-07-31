const form = document.getElementById('form-clientes');
const nombre = localStorage.getItem('nombre') || 'Nombre';
const apellido = localStorage.getItem('apellido') || 'Apellido';


form.addEventListener('submit',async(e) => {
    e.preventDefault(); //para que recargue 
    //obtengo los mail y contraseñas

    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;

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
        console.log('Usuario logueado:', person);

        localStorage.setItem('cliente', JSON.stringify(person));
        localStorage.setItem('email', person.email);
        localStorage.setItem('cliente_id', data.cliente_id);
        localStorage.setItem('cliente_id', person.id);
        localStorage.setItem('nombre', person.nombre);
        localStorage.setItem('apellido', person.apellido);

        alert('Login exitoso. Bienvenido ' + person.nombre );
        // Lo mando a reservas
        window.location.href = 'reservas.html';

    }
    else {
        alert('Error de login');
    }

});

//cerrar sesion
document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear(); 
    alert('Sesión cerrada correctamente.');
    window.location.href = 'index.html'; 
});
