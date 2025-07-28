let indiceMenu = 0;
const slider = document.querySelector(".contenedor-menu-deslizante");
const totalSlides = document.querySelectorAll(".menu-deslizante").length;

function cambiarMenu(direccion)
{
    indiceMenu += direccion;
    if (indiceMenu < 0)
    {
        indiceMenu = totalSlides - 1;
    }
    if (indiceMenu >= totalSlides)
    {
        indiceMenu = 0;
    }

    slider.style.transform = `translateX(-${indiceMenu * 100}%)`;
}